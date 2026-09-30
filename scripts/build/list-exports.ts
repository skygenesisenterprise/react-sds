import * as fs from "fs";
import { join as pathJoin, relative as pathRelative } from "path";

/**
 * Generates the `exports` map of the published package from the real content of
 * `dist/`, so that every declared target is guaranteed to exist after `pnpm build`.
 *
 * The previous approach relied on a single `"./*"` wildcard mapping to `"./dist/*"`.
 * That never resolves: for a subpath like `@skygenesisenterprise/react-sds/Header` the target
 * becomes `./dist/Header`, which is a directory (Node.js does not fall back to
 * `index.js`) and for `@skygenesisenterprise/react-sds/SkipLinks` it becomes the extension-less
 * `./dist/SkipLinks` (Node.js does not append `.js`). This is exactly the `TS2307`
 * / `MODULE_NOT_FOUND` seen in consumer projects.
 *
 * `dist/` mixes two shapes (a flat file `SkipLinks.js` and a directory with an index
 * `Header/index.js`), which no single wildcard can express. We therefore enumerate the
 * actual emitted files and emit one explicit export per subpath, pointing at the real
 * `.js` file and its `.d.ts` companion.
 */

export type ExportsTarget =
    | string
    | {
          types: string;
          default: string;
      };

export type ExportsMap = Record<string, ExportsTarget>;

const EXTENSIONED_ASSET_FILES = [".css", ".svg", ".png", ".scss"] as const;

/**
 * Entries that are not derivable from the `dist/` file tree alone, or that need to
 * stay exactly as they are (root entry, server-only Discord alias, runtime/CSS
 * artifacts, the legacy DSFR CSS tree shipped at the package root, package.json).
 */
const SPECIAL_EXPORTS: ExportsMap = {
    ".": {
        types: "./dist/index.d.ts",
        default: "./dist/index.js"
    },
    "./discord/server": {
        types: "./dist/discord/index.d.ts",
        default: "./dist/discord/index.js"
    },
    "./main.css": "./dist/main.css",
    "./early-color-scheme.js": "./dist/early-color-scheme.js",
    "./package.json": "./package.json",
    "./dsfr/*": "./dsfr/*"
};

/**
 * Directories of `dist/` that are build/local-linking artifacts and must never be
 * declared in `exports` (`bin/` is the CLI, `src/` is only copied for local linking,
 * `dsfr/`/`favicon/` are shipped as-is at the package root).
 */
const EXCLUDED_DIR_NAMES = new Set(["bin", "src", "dsfr", "favicon"]);

const walk = (dirPath: string): string[] =>
    fs.readdirSync(dirPath, { "withFileTypes": true }).reduce<string[]>((filePaths, dirent) => {
        const filePath = pathJoin(dirPath, dirent.name);

        return dirent.isDirectory() ? [...filePaths, ...walk(filePath)] : [...filePaths, filePath];
    }, []);

const listDistFiles = (distDirPath: string): string[] =>
    walk(distDirPath)
        .map(filePath => pathRelative(distDirPath, filePath))
        .filter(relPath => !relPath.split("/").some(segment => EXCLUDED_DIR_NAMES.has(segment)))
        .filter(relPath => relPath !== "package.json")
        .filter(relPath => !relPath.endsWith(".tsbuildinfo"))
        .filter(relPath => !relPath.endsWith(".js.map"))
        .filter(relPath => !relPath.endsWith(".d.ts"))
        .sort();

/**
 * Maps every emitted module of `dist/` to the subpath consumers import it from.
 *
 * - `dist/SkipLinks.js`            → `./SkipLinks`            (`types` → `./dist/SkipLinks.d.ts`)
 * - `dist/Header/index.js`         → `./Header`               (`types` → `./dist/Header/index.d.ts`)
 * - `dist/MainNavigation/MegaMenu` → `./MainNavigation/MegaMenu`
 * - `dist/styles/layout.css`       → `./styles/layout.css`    (kept verbatim, extension included)
 */
export function generateExportsMap(params: { distDirPath: string }): ExportsMap {
    const { distDirPath } = params;

    const exports: ExportsMap = {};

    for (const relPath of listDistFiles(distDirPath)) {
        if (relPath.endsWith(".js")) {
            const moduleRelPath = relPath.slice(0, -".js".length);
            const subpath = `./${moduleRelPath.replace(/\/index$/, "")}`;

            if (subpath === "." || subpath === "./early-color-scheme") {
                continue;
            }

            exports[subpath] = {
                types: `./dist/${moduleRelPath}.d.ts`,
                default: `./dist/${relPath}`
            };

            continue;
        }

        if (EXTENSIONED_ASSET_FILES.some(extension => relPath.endsWith(extension))) {
            exports[`./${relPath}`] = `./dist/${relPath}`;
        }
    }

    return {
        ...SPECIAL_EXPORTS,
        ...Object.fromEntries(
            Object.keys(exports)
                .sort()
                .map(subpath => [subpath, exports[subpath]])
        )
    };
}

/**
 * Recomputes the `exports` field of the root `package.json` from the freshly built
 * `dist/` and writes it back, preserving the file indentation. Running it as part of
 * `pnpm build` guarantees the committed map always matches the emitted files.
 */
export function updatePackageJsonExports(params: { projectRootDirPath: string }): void {
    const { projectRootDirPath } = params;

    const packageJsonPath = pathJoin(projectRootDirPath, "package.json");

    const packageJsonRaw = fs.readFileSync(packageJsonPath).toString("utf8");

    const packageJsonParsed = JSON.parse(packageJsonRaw);

    packageJsonParsed["exports"] = generateExportsMap({
        "distDirPath": pathJoin(projectRootDirPath, "dist")
    });

    const indentSize = (packageJsonRaw.match(/^(\s*)"name"/m) ?? [{ "length": 5 }])[1].length;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonParsed, null, indentSize) + "\n");
}
