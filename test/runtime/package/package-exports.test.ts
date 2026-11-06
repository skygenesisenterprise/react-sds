import { it, expect, describe } from "vitest";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { createRequire } from "module";
import ts from "typescript";
import { generateExportsMap } from "../../../scripts/build/list-exports";

const pathJoin = path.join;

/**
 * Packaging tests. They exercise the package exactly the way a consumer resolves it
 * after `pnpm build` — not the `src/` sources — so a regression in the `exports` map,
 * the emitted files or the `.d.ts` generation is caught here even when the component
 * tests above still pass.
 */

const projectRootDirPath = process.cwd();
const distDirPath = pathJoin(projectRootDirPath, "dist");
const packageJsonPath = pathJoin(projectRootDirPath, "package.json");

/**
 * Subpaths reported broken in consumer projects (TS2307 / MODULE_NOT_FOUND) plus a few
 * representatives of each emitted shape: flat files (SkipLinks), directories with an
 * index (Header, MainNavigation, Display), deep files (MainNavigation/MegaMenu),
 * namespaces (native, sds, fr) and the root entry.
 */
const PUBLIC_SUBPATHS = [
    ".",
    "/Header",
    "/SkipLinks",
    "/MainNavigation",
    "/MainNavigation/MegaMenu",
    "/Display",
    "/Button",
    "/Footer",
    "/native",
    "/sds",
    "/fr",
    "/next-pagesdir",
    "/next-app-router/DsfrHead",
    "/discord",
    "/discord/server",
    "/main.css",
    "/early-color-scheme.js"
];

describe("published package: package.json exports", () => {
    it("are generated from the real dist/ layout", () => {
        // The committed map is the output of scripts/build/list-exports.ts run against the
        // freshly built dist/. If the build were to emit something different (a renamed
        // component, a new entry) this fails, forcing a rebuild of the map.
        const generated = generateExportsMap({ distDirPath });

        const packageJsonParsed = JSON.parse(fs.readFileSync(packageJsonPath).toString("utf8"));

        expect(packageJsonParsed["exports"]).toEqual(generated);
    });

    it("never reference a missing file", () => {
        const packageJsonParsed = JSON.parse(fs.readFileSync(packageJsonPath).toString("utf8"));

        const missing: string[] = [];

        for (const [subpath, target] of Object.entries(
            packageJsonParsed["exports"] as Record<string, unknown>
        )) {
            const targets = typeof target === "string" ? [target] : Object.values(target);

            for (const filePath of targets) {
                if (filePath === "./package.json" || filePath === "./dsfr/*") {
                    continue;
                }

                if (!fs.existsSync(pathJoin(projectRootDirPath, filePath))) {
                    missing.push(`${subpath} -> ${filePath}`);
                }
            }
        }

        expect(missing, `exports reference missing files:\n${missing.join("\n")}`).toStrictEqual(
            []
        );
    });

    it("the generated dist/package.json (local linking) matches the root map", () => {
        // `pnpm build` derives dist/package.json from the root one by stripping the
        // `dist/` prefix. Integration apps consume exactly this file (file:../../../dist).
        const distPackageJsonPath = pathJoin(distDirPath, "package.json");

        if (!fs.existsSync(distPackageJsonPath)) {
            return; // prePublish builds do not emit it
        }

        const rootExports = JSON.parse(fs.readFileSync(packageJsonPath).toString("utf8"))[
            "exports"
        ];
        const distExports = JSON.parse(fs.readFileSync(distPackageJsonPath).toString("utf8"))[
            "exports"
        ];

        const stripDistPrefix = (target: unknown): unknown =>
            typeof target === "string"
                ? target.replace(/^\.\/dist\//, "./")
                : Object.fromEntries(
                      Object.entries(target).map(([k, v]) => [k, stripDistPrefix(v)])
                  );

        expect(distExports).toEqual(
            Object.fromEntries(
                Object.entries(rootExports).map(([subpath, target]) => [
                    subpath,
                    stripDistPrefix(target)
                ])
            )
        );
    });
});

describe("published package: TypeScript resolution", () => {
    const setupConsumer = (): string => {
        // Reproduces the "install the repo / published package in a consumer" layout:
        // node_modules/@skygenesisenterprise/react-sds = dist/ + the root package.json, which is
        // the layout the broken `./*` wildcard used to live in.
        const consumerDirPath = fs.mkdtempSync(pathJoin(os.tmpdir(), "react-sds-consumer-"));

        const packageDirPath = pathJoin(
            consumerDirPath,
            "node_modules",
            "@skygenesisenterprise",
            "react-sds"
        );

        fs.mkdirSync(packageDirPath, { "recursive": true });

        fs.cpSync(distDirPath, pathJoin(packageDirPath, "dist"), { "recursive": true });
        fs.copyFileSync(packageJsonPath, pathJoin(packageDirPath, "package.json"));

        return consumerDirPath;
    };

    const compileConsumer = (params: {
        consumerDirPath: string;
        moduleResolution: ts.ModuleResolutionKind;
        module: ts.ModuleKind;
    }): ts.Diagnostic[] => {
        const { consumerDirPath, moduleResolution, module } = params;

        // /main.css and /early-color-scheme.js are CSS/runtime artifacts: they are not
        // TypeScript modules and are exercised by the exports-existence checks instead.
        const moduleSubpaths = PUBLIC_SUBPATHS.filter(
            subpath => subpath !== "/main.css" && subpath !== "/early-color-scheme.js"
        );

        const consumerSourceCode = [
            `import { Header } from "@skygenesisenterprise/react-sds/Header";`,
            `import { SkipLinks } from "@skygenesisenterprise/react-sds/SkipLinks";`,
            `import { MainNavigation } from "@skygenesisenterprise/react-sds/MainNavigation";`,
            `import { MegaMenu } from "@skygenesisenterprise/react-sds/MainNavigation/MegaMenu";`,
            `import { Display } from "@skygenesisenterprise/react-sds/Display";`,
            `import { Header as HeaderRoot } from "@skygenesisenterprise/react-sds";`,
            ...moduleSubpaths
                .filter(
                    subpath =>
                        subpath !== "." &&
                        subpath !== "/Header" &&
                        subpath !== "/SkipLinks" &&
                        subpath !== "/MainNavigation" &&
                        subpath !== "/MainNavigation/MegaMenu" &&
                        subpath !== "/Display"
                )
                .map(subpath => `import "${"@skygenesisenterprise/react-sds" + subpath}";`)
        ].join("\n");

        fs.writeFileSync(pathJoin(consumerDirPath, "consumer.ts"), consumerSourceCode);

        const compilerOptions: ts.CompilerOptions = {
            moduleResolution,
            module,
            "target": ts.ScriptTarget.ES2017,
            "lib": ["lib.es2017.d.ts", "lib.dom.d.ts"],
            "jsx": ts.JsxEmit.React,
            "skipLibCheck": true,
            "noEmit": true,
            "strict": true,
            "types": []
        };

        const program = ts.createProgram(
            [pathJoin(consumerDirPath, "consumer.ts")],
            compilerOptions
        );

        return ts.getPreEmitDiagnostics(program).filter(diagnostic => diagnostic.code === 2307);
    };

    for (const [label, moduleResolution, module] of [
        ["node10 (legacy node)", ts.ModuleResolutionKind.Node10, ts.ModuleKind.ESNext],
        // `bundler` resolution only exists since TypeScript 5.0: the repo pins 4.9.x, so
        // this case only runs when a newer TypeScript is installed.
        ...(ts.ModuleResolutionKind.Bundler !== undefined
            ? ([["bundler", ts.ModuleResolutionKind.Bundler, ts.ModuleKind.ESNext]] as const)
            : []),
        ["node16", ts.ModuleResolutionKind.Node16, ts.ModuleKind.Node16]
    ] as const) {
        it(`compiles every public subpath with moduleResolution=${label}`, () => {
            const consumerDirPath = setupConsumer();

            const ts2307 = compileConsumer({ consumerDirPath, moduleResolution, module });

            expect(
                ts2307.map(diagnostic =>
                    ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")
                ),
                `TS2307 with moduleResolution=${label}`
            ).toStrictEqual([]);
        });
    }
});

describe("published package: Node resolution", () => {
    it("resolves every public subpath at runtime", () => {
        const consumerDirPath = setupConsumerNode();

        const requireFromConsumer = createRequire(pathJoin(consumerDirPath, "consumer.js"));

        for (const subpath of PUBLIC_SUBPATHS.filter(
            subpath =>
                !subpath.startsWith("/main.css") && !subpath.startsWith("/early-color-scheme")
        )) {
            const moduleName = `@skygenesisenterprise/react-sds${subpath === "." ? "" : subpath}`;

            expect(
                () => requireFromConsumer.resolve(moduleName),
                `${moduleName} must resolve to a real .js file`
            ).not.toThrow();
        }
    });
});

function setupConsumerNode(): string {
    const consumerDirPath = fs.mkdtempSync(pathJoin(os.tmpdir(), "react-sds-consumer-node-"));

    const packageDirPath = pathJoin(consumerDirPath, "node_modules", "@skygenesisenterprise", "react-sds");

    fs.mkdirSync(packageDirPath, { "recursive": true });

    fs.cpSync(distDirPath, pathJoin(packageDirPath, "dist"), { "recursive": true });
    fs.copyFileSync(packageJsonPath, pathJoin(packageDirPath, "package.json"));

    return consumerDirPath;
}
