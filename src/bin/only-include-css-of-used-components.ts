/**
 * This processing stage is run by `npx react-sds optimize-css`, after the icon CSS
 * has been optimized.
 * It scans your codebase to find which react-sds components are used and rebuilds
 * the node_modules/@skygenesisenterprise/react-sds/legacy/legacy.css and legacy.min.css files
 * with only the CSS of those components (plus the core, which is always included).
 * The public/legacy/legacy.min.css file is patched as well if applicable (not in Next.js for example).
 *
 * The trimmed stylesheets are rebuilt from the granular CSS files shipped by the legacy
 * (legacy/core/*, legacy/component/*, legacy/scheme/*) so no CSS rule is ever rewritten,
 * only whole components are included or excluded. This makes the output robust to
 * classes and attributes dynamically added by the legacy JavaScript (data-fr-js-*).
 *
 * Usage of a component is detected by:
 * - Imports of `@skygenesisenterprise/react-sds/<Component>` in your sources.
 * - Usage of the component's CSS class names (e.g. "fr-table") in your sources,
 *   for when you use raw legacy classes without the React component.
 *
 * Stylesheets (.css, .scss...) are not scanned: class name detection is substring based,
 * so a single compiled bundle would mark every component as used.
 *
 * You can force the inclusion of components that the detection would miss by adding
 * to your package.json:
 * "react-sds": {
 *     "additionalComponents": ["table", "Range"]
 * }
 * (values are legacy CSS component names or react-sds component names)
 *
 * There are three optional arguments that you can use:
 * - `--projectDir <path>` to specify the project directory. Default to the current working directory.
 *   This can be used in monorepos to specify the react project directory.
 * - `--silent` to disable console.log
 * - `--strict` to exit with a non zero code instead of falling back to the untrimmed
 *   stylesheet when something can't be resolved. Recommended in CI, where the warning
 *   would otherwise go unnoticed and the build would silently ship the full bundle.
 */

import { getProjectRoot } from "./tools/getProjectRoot";
import * as fs from "fs";
import { join as pathJoin, relative as pathRelative } from "path";
import { assert } from "tsafe/assert";
import { exclude } from "tsafe/exclude";
import { writeFile, readFile, rm, cp } from "fs/promises";
import { crawl } from "./tools/crawl";
import { basename as pathBasename, sep as pathSep, dirname as pathDirname } from "path";
import yargsParser from "yargs-parser";
import { getAbsoluteAndInOsFormatPath } from "./tools/getAbsoluteAndInOsFormatPath";
import { readPublicDirPath } from "./readPublicDirPath";
import { existsAsync } from "./tools/fs.existsAsync";
import { fnv1aHashToHex } from "./tools/fnv1aHashToHex";
import { modifyHtmlHrefs } from "./tools/modifyHtmlHrefs";

/**
 * The legacy CSS components (legacy/component/<name> directories), listed in the
 * order in which they are concatenated in the upstream legacy.css bundle.
 * Preserving this order preserves the CSS cascade of the original stylesheet.
 *
 * The order is the order of first occurrence of each `component/<name>/main.scss`
 * in the `sources` of `@gouvfr/dsfr/dist/dsfr.main.css.map`. It is asserted against
 * the installed legacy in test/runtime/scripts/onlyIncludeUsedComponents/legacyComponentsCascadeOrder.test.ts
 * so that it can't silently drift on a legacy bump.
 * `radio` is the only component that has no `main.scss` upstream, its position is
 * taken from the first occurrence of any of its stylesheets (between notice and card).
 */
export const LEGACY_COMPONENTS_CASCADE_ORDER = [
    "upload",
    "range",
    "accordion",
    "badge",
    "logo",
    "button",
    "connect",
    "quote",
    "breadcrumb",
    "form",
    "stepper",
    "tooltip",
    "link",
    "sidemenu",
    "callout",
    "highlight",
    "tab",
    "pagination",
    "summary",
    "tag",
    "download",
    "alert",
    "notice",
    "radio",
    "card",
    "checkbox",
    "input",
    "content",
    "segmented",
    "toggle",
    "skiplink",
    "select",
    "modal",
    "navigation",
    "share",
    "footer",
    "tile",
    "search",
    "consent",
    "follow",
    "password",
    "display",
    "translate",
    "table",
    "transcription",
    "header"
] as const;

export type LegacyComponentName = (typeof LEGACY_COMPONENTS_CASCADE_ORDER)[number];

/**
 * Map from react-sds module (the `@skygenesisenterprise/react-sds/<moduleId>` import subpath)
 * to the legacy CSS components its markup depends on, transitive dependencies included
 * (e.g. the Header renders a navigation, a search bar and a modal on mobile).
 * When in doubt a dependency is included: too much CSS is only a size cost,
 * not enough CSS is a rendering bug.
 * Modules that do not appear here and are not known non-component modules trigger
 * a fail-safe: every component is included.
 */
export const REACT_LEGACY_MODULE_TO_LEGACY_COMPONENTS: Record<string, LegacyComponentName[]> = {
    "Accordion": ["accordion"],
    "Alert": ["alert", "link", "button"],
    "Badge": ["badge"],
    "Breadcrumb": ["breadcrumb", "link"],
    "Button": ["button", "link"],
    "ButtonsGroup": ["button", "link"],
    "CallOut": ["callout", "button", "link"],
    "Card": ["card", "badge", "link"],
    // The Chart components pull their CSS from the @gouvfr/dsfr-chart peer dependency.
    "Chart": [],
    "Checkbox": ["checkbox", "radio", "form"],
    "Display": ["modal", "radio", "form", "button", "link"],
    "Download": ["download", "link"],
    "Follow": ["follow", "form", "input", "upload", "button", "link", "alert", "checkbox"],
    "Footer": ["footer", "logo", "button", "link"],
    "Header": [
        "header",
        "navigation",
        "modal",
        "logo",
        "button",
        "link",
        "search",
        "input",
        "form"
    ],
    "Highlight": ["highlight"],
    "Input": ["input", "form", "upload"],
    "LanguageSelect": ["translate", "navigation", "button", "link"],
    "MainNavigation": ["navigation", "link"],
    "Modal": ["modal", "button", "link"],
    "Notice": ["notice", "button", "link"],
    "Pagination": ["pagination", "link"],
    "Quote": ["quote"],
    "RadioButtons": ["radio", "checkbox", "form"],
    "Range": ["range", "form"],
    "SearchBar": ["search", "input", "form", "button"],
    "SegmentedControl": ["segmented", "form"],
    "Select": ["select", "form"],
    "SelectNext": ["select", "form"],
    "SideMenu": ["sidemenu", "link"],
    "SkipLinks": ["skiplink", "link"],
    "Stepper": ["stepper"],
    "Summary": ["summary", "link"],
    "Table": ["table"],
    "Tabs": ["tab"],
    "Tag": ["tag"],
    "TagsGroup": ["tag"],
    "Tile": ["tile", "link"],
    "ToggleSwitch": ["toggle", "form"],
    "ToggleSwitchGroup": ["toggle", "form"],
    "Tooltip": ["tooltip", "button"],
    "Upload": ["upload", "input", "form"],
    "blocks/PasswordInput": ["password", "input", "form", "link", "checkbox"],
    "consentManagement": ["consent", "modal", "button", "link", "radio", "form"],
    // `link` is the registerLink module, its Link fallback renders a `fr-link` button.
    "link": ["link"],
    // `shared` only contains Fieldset, the internal building block of
    // Checkbox / RadioButtons: it renders fr-fieldset, fr-label, fr-hint-text and fr-radio-rich.
    "shared": ["form", "radio", "checkbox"]
};

/**
 * The stylesheet a legacy component ships under `component/<name>/<name>.<ext>`, by order of
 * preference. Not every component has every variant: `download` for instance only ships
 * `download.css` and `download.min.css`, no `.main.` ones.
 */
export const LEGACY_COMPONENT_CSS_FILE_EXTENSIONS = [
    "main.min.css",
    "min.css",
    "main.css",
    "css"
] as const;

/**
 * CSS class name prefixes that reveal a direct usage of a legacy component in the
 * sources (when raw fr-* classes are used without importing the React component).
 * Substring matching is intentional and fail-safe: matching too much only means
 * including a component's CSS that may not be needed.
 *
 * A prefix only belongs here if it opens a selector in that component's own stylesheet.
 * A class that the component merely *styles as a descendant* is not a usage signal: its
 * base rules live elsewhere (usually in the always included core), so detecting on it
 * pulls the whole component in for nothing. legacyComponentDetectionClassPrefixes.test.ts
 * re-derives this rule against the installed @gouvfr/dsfr.
 */
export const LEGACY_COMPONENT_DETECTION_CLASS_PREFIXES: Record<LegacyComponentName, string[]> = {
    "accordion": ["fr-accordion"],
    "alert": ["fr-alert"],
    "badge": ["fr-badge"],
    "breadcrumb": ["fr-breadcrumb"],
    "button": ["fr-btn"],
    "callout": ["fr-callout"],
    "card": ["fr-card"],
    "checkbox": ["fr-checkbox"],
    "connect": ["fr-connect"],
    "consent": ["fr-consent"],
    // NOTE: deliberately not fr-responsive-img / fr-responsive-vid. Their base rules
    // live in the always included core, and every rule content.css has for them is
    // scoped under .fr-content-media, which is already the prefix detected here.
    "content": ["fr-content-media"],
    // `display` styles `.fr-display` only as a descendant of `.fr-fieldset__element`
    // (a form layout helper), so no class prefix earns a place here: the component
    // is reached through imports. See legacyComponentDetectionClassPrefixes.test.ts.
    "display": [],
    "download": ["fr-download"],
    "follow": ["fr-follow"],
    "footer": ["fr-footer"],
    "form": ["fr-fieldset", "fr-label", "fr-hint-text", "fr-message", "fr-input-group"],
    "header": ["fr-header"],
    "highlight": ["fr-highlight"],
    "input": ["fr-input"],
    "link": ["fr-link"],
    "logo": ["fr-logo"],
    "modal": ["fr-modal"],
    "navigation": ["fr-nav", "fr-menu", "fr-mega-menu"],
    "notice": ["fr-notice"],
    "pagination": ["fr-pagination"],
    "password": ["fr-password"],
    "quote": ["fr-quote"],
    "radio": ["fr-radio"],
    "range": ["fr-range"],
    "search": ["fr-search-bar"],
    "segmented": ["fr-segmented"],
    "select": ["fr-select"],
    "share": ["fr-share"],
    "sidemenu": ["fr-sidemenu"],
    "skiplink": ["fr-skiplink"],
    "stepper": ["fr-stepper"],
    "summary": ["fr-summary"],
    "tab": ["fr-tabs"],
    "table": ["fr-table"],
    "tag": ["fr-tag"],
    "tile": ["fr-tile"],
    "toggle": ["fr-toggle"],
    "tooltip": ["fr-tooltip"],
    "transcription": ["fr-transcription"],
    "translate": ["fr-translate"],
    "upload": ["fr-upload"]
};

/**
 * react-sds modules that are known not to render any legacy component markup
 * (hooks, utilities, integration helpers, assets...).
 */
const NON_COMPONENT_MODULE_IDS = new Set<string>([
    // SDS foundations (design tokens, BackToTop bubble): no legacy component markup
    // (BackToTop only uses an icon glyph from the always-included icon font).
    "sds",
    "BackToTop",
    // SDS CSS foundation stylesheets (styles/*): the SDS layer replaces legacy,
    // it never renders legacy component markup.
    "styles",
    // SDS Native (native/*): React Native implementation — no legacy markup, and
    // must never be pulled into the web CSS optimizer.
    "native",
    "fr",
    "i18n",
    "spa",
    "start",
    "tss",
    "mui",
    "picto",
    "tools",
    "assets",
    "favicon",
    "main.css",
    "legacy.css",
    "next-appdir",
    "next-app-router",
    "next-pagesdir",
    "useBreakpointsValues",
    "useBreakpointsValuesPx",
    "useColors",
    "useIsDark",
    "getHtmlAttributes",
    "zz_internal",
    // SDS Discord integration (discord/*): server-only, never rendered as web
    // markup — must never be pulled into the web CSS optimizer.
    "discord"
]);

/**
 * Regexes matching the specifier of an actual import statement.
 * Matching any textual occurrence of "@skygenesisenterprise/react-sds/..." instead would
 * pick up urls and comments (a link to https://www.npmjs.com/package/@skygenesisenterprise/react-sds/v/1.32.5
 * would resolve to the unknown module "v" and trigger the include-everything fail-safe).
 */
const IMPORT_SPECIFIER_REGEXES = [
    // import X from "..." / export * from "..."
    /\bfrom\s*["'`]([^"'`\n]+)["'`]/g,
    // import "..." / import("...")
    /\bimport\s*\(?\s*["'`]([^"'`\n]+)["'`]/g,
    // require("...")
    /\brequire\s*\(\s*["'`]([^"'`\n]+)["'`]/g,
    // @import "..." / @import url("...")
    /@import\s+(?:url\(\s*)?["'`]([^"'`\n]+)["'`]/g
];

const REACT_LEGACY_PACKAGE_NAME = "@skygenesisenterprise/react-sds";

/**
 * Module id produced when a file imports the package root (`@skygenesisenterprise/react-sds`,
 * no subpath). The root entry re-exports every generic component, so a root import does
 * not tell which components are used: the caller falls back to including every component.
 */
export const ROOT_IMPORT_MODULE_ID = REACT_LEGACY_PACKAGE_NAME;

export function getReactLegacyImportedModuleIds(params: { rawFileContent: string }): string[] {
    const { rawFileContent } = params;

    const moduleIds = new Set<string>();

    if (!rawFileContent.includes(REACT_LEGACY_PACKAGE_NAME)) {
        return [];
    }

    const importSpecifiers = new Set(
        IMPORT_SPECIFIER_REGEXES.map(regex =>
            Array.from(rawFileContent.matchAll(regex), ([, specifier]) => specifier)
        ).flat()
    );

    for (const importSpecifier of importSpecifiers) {
        if (importSpecifier === REACT_LEGACY_PACKAGE_NAME) {
            // Importing the package root can pull any of the components re-exported from
            // src/index.ts: the import itself does not tell which ones are used.
            moduleIds.add(ROOT_IMPORT_MODULE_ID);

            continue;
        }

        if (!importSpecifier.startsWith(`${REACT_LEGACY_PACKAGE_NAME}/`)) {
            continue;
        }

        const subpath = importSpecifier.slice(`${REACT_LEGACY_PACKAGE_NAME}/`.length);

        const segments = subpath
            .replace(/\.(?:js|mjs|cjs|ts|tsx|jsx)$/, "")
            .split("/")
            .filter(segment => segment !== "index" && segment !== "");

        if (segments.length === 0) {
            continue;
        }

        moduleIds.add(
            (() => {
                switch (segments[0]) {
                    case "blocks":
                        return segments.slice(0, 2).join("/");
                    case "legacy":
                        return segments.slice(0, 3).join("/");
                    default:
                        return segments[0];
                }
            })()
        );
    }

    return Array.from(moduleIds);
}

export function resolveModuleIdToLegacyComponents(params: {
    moduleId: string;
}): LegacyComponentName[] | undefined {
    const { moduleId } = params;

    direct_import_of_a_legacy_component_stylesheet: {
        const match = moduleId.match(/^legacy\/component\/([^/]+)/);

        if (match === null) {
            break direct_import_of_a_legacy_component_stylesheet;
        }

        const legacyComponent = LEGACY_COMPONENTS_CASCADE_ORDER.find(
            componentName => componentName === match[1]
        );

        return legacyComponent === undefined ? undefined : [legacyComponent];
    }

    if (moduleId.startsWith("legacy/")) {
        return [];
    }

    {
        const legacyComponents = REACT_LEGACY_MODULE_TO_LEGACY_COMPONENTS[moduleId.split("/")[0]];

        if (legacyComponents !== undefined) {
            return legacyComponents;
        }
    }

    {
        const legacyComponents = REACT_LEGACY_MODULE_TO_LEGACY_COMPONENTS[moduleId];

        if (legacyComponents !== undefined) {
            return legacyComponents;
        }
    }

    const firstSegment = moduleId.split("/")[0];

    if (NON_COMPONENT_MODULE_IDS.has(firstSegment)) {
        return [];
    }

    // A component this script does not know about (newer react-sds version?),
    // or a new non-component module missing from NON_COMPONENT_MODULE_IDS.
    return undefined;
}

export function detectLegacyComponentsFromClassNames(params: {
    rawFileContent: string;
}): LegacyComponentName[] {
    const { rawFileContent } = params;

    if (!rawFileContent.includes("fr-")) {
        return [];
    }

    return Object.entries(LEGACY_COMPONENT_DETECTION_CLASS_PREFIXES)
        .filter(([, classPrefixes]) =>
            classPrefixes.some(classPrefix => rawFileContent.includes(classPrefix))
        )
        .map(([componentName]) => componentName as LegacyComponentName);
}

export function rewriteCssRelativeUrls(params: {
    rawCssCode: string;
    /** Posix style, relative to the legacy directory, e.g. "component/header" */
    cssFileRelativeDirPath: string;
}): string {
    const { rawCssCode, cssFileRelativeDirPath } = params;

    return rawCssCode.replace(/url\((["']?)([^)"']+)\1\)/g, (match, quote: string, url: string) => {
        if (/^(?:data:|https?:|\/)/.test(url)) {
            return match;
        }

        const pathSegments: string[] = [];

        for (const segment of [...cssFileRelativeDirPath.split("/"), ...url.split("/")]) {
            if (segment === "." || segment === "") {
                continue;
            }

            if (segment === ".." && pathSegments.length !== 0) {
                pathSegments.pop();
                continue;
            }

            pathSegments.push(segment);
        }

        return `url(${quote}${pathSegments.join("/")}${quote})`;
    });
}

/**
 * The assets (fonts, icons, artwork...) referenced by a stylesheet whose url()
 * have already been rewritten relative to the legacy directory root by
 * rewriteCssRelativeUrls(). Absolute and data: urls are skipped.
 */
export function getReferencedAssetRelativePaths(params: { rawCssCode: string }): string[] {
    const { rawCssCode } = params;

    const assetRelativePaths = new Set<string>();

    for (const [, , url] of rawCssCode.matchAll(/url\((["']?)([^)"']+)\1\)/g)) {
        if (/^(?:data:|https?:|\/)/.test(url)) {
            continue;
        }

        const [urlWithoutQuery] = url.split(/[?#]/);

        if (urlWithoutQuery === "") {
            continue;
        }

        assetRelativePaths.add(urlWithoutQuery);
    }

    return Array.from(assetRelativePaths);
}

/**
 * String level equivalent of scripts/build/patchCssForMui.ts, the selectors
 * `button:not(:disabled):hover` and `button:not(:disabled):active` only exist
 * in the core stylesheet, within the `(hover: hover) and (pointer: fine)` media query.
 */
export function patchCoreCssCodeForCompatWithMui(params: { rawCssCode: string }): string {
    const { rawCssCode } = params;

    return rawCssCode
        .replace(
            /button:not\(:disabled\):hover(?![\w:([-])/g,
            'button:not(:disabled):hover:not([class^="Mui"])'
        )
        .replace(
            /button:not\(:disabled\):active(?![\w:([-])/g,
            'button:not(:disabled):active:not([class^="Mui"])'
        );
}

export function generateLegacyCssCode(params: {
    legacyComponents: string[];
    isMinified: boolean;
    /** Returns the raw code of a file within the legacy directory, undefined if it does not exist */
    readLegacyFile: (fileRelativePath: string) => string | undefined;
}): string {
    const { legacyComponents, isMinified, readLegacyFile } = params;

    const sortedLegacyComponents = [
        ...LEGACY_COMPONENTS_CASCADE_ORDER.filter(componentName =>
            legacyComponents.includes(componentName)
        ),
        // Fail-safe for component directories unknown to this script
        // (newer legacy version): appended in alphabetical order.
        ...legacyComponents
            .filter(
                componentName =>
                    !LEGACY_COMPONENTS_CASCADE_ORDER.includes(componentName as LegacyComponentName)
            )
            .sort()
    ];

    const readCssChunks = (params: {
        getFileRelativePathCandidates: (dirRelativePath: string, basename: string) => string[];
    }) => {
        const { getFileRelativePathCandidates } = params;

        return [
            ["core", "core"],
            ["scheme", "scheme"],
            ...sortedLegacyComponents.map(componentName => [
                `component/${componentName}`,
                componentName
            ])
        ]
            .map(([dirRelativePath, basename]) => {
                for (const fileRelativePath of getFileRelativePathCandidates(
                    dirRelativePath,
                    basename
                )) {
                    const rawCssCode = readLegacyFile(fileRelativePath);

                    if (rawCssCode === undefined) {
                        continue;
                    }

                    return {
                        dirRelativePath,
                        rawCssCode
                    };
                }

                return undefined;
            })
            .filter(exclude(undefined));
    };

    const cssChunks = [
        ...readCssChunks({
            "getFileRelativePathCandidates": (dirRelativePath, basename) =>
                (isMinified
                    ? [`${basename}.main.min.css`, `${basename}.min.css`]
                    : [`${basename}.main.css`, `${basename}.css`]
                ).map(fileBasename => `${dirRelativePath}/${fileBasename}`)
        }),
        ...readCssChunks({
            "getFileRelativePathCandidates": (dirRelativePath, basename) =>
                (isMinified ? [`${basename}.print.min.css`] : [`${basename}.print.css`]).map(
                    fileBasename => `${dirRelativePath}/${fileBasename}`
                )
        })
    ];

    assert(
        cssChunks.length !== 0,
        "Can't find the granular legacy stylesheets to rebuild legacy.css from"
    );

    return [
        `/*! legacy stylesheet rebuilt by react-sds optimize-css, components: ${sortedLegacyComponents.join(
            ", "
        )} */`,
        ...cssChunks.map(({ dirRelativePath, rawCssCode }) => {
            let cssCode = rawCssCode
                .replace(/@charset "UTF-8";\s*/g, "")
                .replace(/^\/\*![\s\S]*?\*\/\s*/, "")
                .replace(/\/\*# sourceMappingURL=[^*]*\*\/\s*/g, "");

            cssCode = rewriteCssRelativeUrls({
                "rawCssCode": cssCode,
                "cssFileRelativeDirPath": dirRelativePath
            });

            if (dirRelativePath === "core") {
                cssCode = patchCoreCssCodeForCompatWithMui({ "rawCssCode": cssCode });
            }

            return cssCode.trim();
        })
    ].join("\n");
}

type CommandContext = {
    projectDirPath: string;
    srcFilePaths: string[];
    legacyDirPath: string;
    spaParams:
        | {
              legacyDirPath_static: string;
              // Undefined whenever public/legacy exists but no index.html was found to add
              // a cache busting query parameter to: a monorepo invoked with --projectDir
              // where the html is not where either branch looks, a project that used to be
              // a Vite/CRA app and lost its index.html, or a public/legacy that was committed
              // or restored by other means. Not reachable through copy-static-assets: it
              // asserts "Can't locate your index.html file." before creating anything.
              htmlFilePath: string | undefined;
          }
        | undefined;
    isSilent: boolean;
    isStrict: boolean;
};

const SGE_PACKAGE_NAME: string = JSON.parse(
    fs.readFileSync(pathJoin(getProjectRoot(), "package.json")).toString("utf8")
)["name"];

async function getCommandContext(args: string[]): Promise<CommandContext | undefined> {
    const argv = yargsParser(args);

    const projectDirPath: string = (() => {
        read_from_argv: {
            const arg = argv["projectDir"];

            if (arg === undefined) {
                break read_from_argv;
            }

            return getAbsoluteAndInOsFormatPath({ "pathIsh": arg, "cwd": process.cwd() });
        }

        return process.cwd();
    })();

    special_case_for_our_storybook: {
        const packageJsonFilePath = pathJoin(process.cwd(), "package.json");

        if (!(await existsAsync(packageJsonFilePath))) {
            break special_case_for_our_storybook;
        }

        const packageJson = JSON.parse((await readFile(packageJsonFilePath)).toString("utf8"));

        if (packageJson["name"] !== SGE_PACKAGE_NAME) {
            break special_case_for_our_storybook;
        }

        // The storybook documents every component, there is nothing to trim.
        return undefined;
    }

    const nodeModulesDirPath = await (async function callee(n: number): Promise<string> {
        if (n >= projectDirPath.split(pathSep).length) {
            throw new Error("Need to install node modules?");
        }

        const nodeModulesDirPath = pathJoin(
            ...[projectDirPath, ...new Array(n).fill(".."), "node_modules"]
        );

        const doesExist = await existsAsync(
            pathJoin(...[nodeModulesDirPath, ...SGE_PACKAGE_NAME.split("/")])
        );

        if (!doesExist) {
            return callee(n + 1);
        }

        return nodeModulesDirPath;
    })(0);

    const legacyDirPath = pathJoin(
        ...[nodeModulesDirPath, ...SGE_PACKAGE_NAME.split("/"), "dist", "legacy"]
    );

    const legacyDirPath_static = await (async () => {
        const legacyDirPath_static = pathJoin(
            await readPublicDirPath({ projectDirPath }),
            "legacy"
        );

        if (!(await existsAsync(legacyDirPath_static))) {
            return undefined;
        }

        return legacyDirPath_static;
    })();

    const htmlFilePath = await (async () => {
        if (legacyDirPath_static === undefined) {
            return undefined;
        }

        vite: {
            const filePath = pathJoin(projectDirPath, "index.html");

            if (!fs.existsSync(filePath)) {
                break vite;
            }

            return filePath;
        }

        cra: {
            const filePath = pathJoin(pathDirname(legacyDirPath_static), "index.html");

            if (!fs.existsSync(filePath)) {
                break cra;
            }

            return filePath;
        }

        // Next.js
        return undefined;
    })();

    const isSilent = argv["silent"] === true;
    const isStrict = argv["strict"] === true;

    const srcFilePaths = (
        await Promise.all([
            crawl({
                "dirPath": projectDirPath,
                "returnedPathsType": "absolute",
                "getDoCrawlInDir": async ({ relativeDirPath }) => {
                    if (relativeDirPath === "dist") {
                        return false;
                    }

                    if (relativeDirPath === "build") {
                        return false;
                    }

                    if (pathBasename(relativeDirPath) === "node_modules") {
                        return false;
                    }

                    if (
                        await existsAsync(
                            pathJoin(projectDirPath, relativeDirPath, "legacy.min.css")
                        )
                    ) {
                        // We don't want to search in public/legacy
                        return false;
                    }

                    if (pathBasename(relativeDirPath).startsWith(".")) {
                        return false;
                    }

                    return true;
                }
            }),
            crawl({
                "dirPath": nodeModulesDirPath,
                "returnedPathsType": "absolute",
                "getDoCrawlInDir": async ({ relativeDirPath }) => {
                    if (
                        relativeDirPath.startsWith("@") &&
                        relativeDirPath.split(pathSep).length === 1
                    ) {
                        return true;
                    }

                    if (
                        relativeDirPath.split(pathSep).length === 1 ||
                        (relativeDirPath.startsWith("@") &&
                            relativeDirPath.split(pathSep).length === 2)
                    ) {
                        const parsedPackageJson = await readFile(
                            pathJoin(nodeModulesDirPath, relativeDirPath, "package.json")
                        ).then(
                            buff => JSON.parse(buff.toString("utf8")),
                            () => undefined
                        );

                        if (parsedPackageJson === undefined) {
                            return false;
                        }

                        if (parsedPackageJson["name"] === SGE_PACKAGE_NAME) {
                            // Scanning react-sds's own sources would mark every component as used.
                            return false;
                        }

                        if (parsedPackageJson["name"] === "tss-react") {
                            return false;
                        }

                        if (parsedPackageJson["name"] === "@gouvfr/dsfr-chart") {
                            return false;
                        }

                        if (parsedPackageJson["name"] === "@gouvfr/dsfr") {
                            return false;
                        }

                        for (const packageName of [SGE_PACKAGE_NAME, "@gouvfr/dsfr"]) {
                            if (
                                Object.keys({
                                    ...parsedPackageJson["dependencies"],
                                    ...parsedPackageJson["devDependencies"],
                                    ...parsedPackageJson["peerDependencies"]
                                }).includes(packageName)
                            ) {
                                return true;
                            }
                        }

                        return false;
                    }

                    if (pathBasename(relativeDirPath) === "generatedFromCss") {
                        return false;
                    }

                    if (pathBasename(relativeDirPath) === "node_modules") {
                        return false;
                    }

                    if (pathBasename(relativeDirPath).startsWith(".")) {
                        return false;
                    }

                    return true;
                }
            })
        ])
    )
        .flat()
        .filter(
            filePath =>
                // NOTE: Stylesheets are deliberately not scanned: detectLegacyComponentsFromClassNames()
                // does substring matching, so a single compiled bundle (a leftover out/, a
                // dependency shipping the legacy) would mark every component as used.
                // Use "react-sds"."additionalComponents" in your package.json for the
                // components you only reference from a stylesheet.
                ["tsx", "jsx", "js", "ts", "mdx", "html", "htm", "svelte", "vue"].find(ext =>
                    filePath.endsWith(`.${ext}`)
                ) !== undefined
        );

    return {
        projectDirPath,
        srcFilePaths,
        legacyDirPath,
        "spaParams": (() => {
            if (legacyDirPath_static === undefined) {
                return undefined;
            }

            return {
                legacyDirPath_static,
                htmlFilePath
            };
        })(),
        isSilent,
        isStrict
    };
}

export async function main(args: string[]) {
    const commandContext = await getCommandContext(args);

    if (commandContext === undefined) {
        return;
    }

    const log = commandContext.isSilent ? undefined : console.log;

    const componentsDirPath = pathJoin(commandContext.legacyDirPath, "component");

    if (!fs.existsSync(componentsDirPath)) {
        assert(
            false,
            [
                `Can't find the granular legacy stylesheets in ${componentsDirPath},`,
                `is your installation of ${SGE_PACKAGE_NAME} complete?`
            ].join(" ")
        );
    }

    const availableLegacyComponents = fs
        .readdirSync(componentsDirPath, { "withFileTypes": true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(componentName =>
            LEGACY_COMPONENT_CSS_FILE_EXTENSIONS.some(ext =>
                fs.existsSync(
                    pathJoin(
                        commandContext.legacyDirPath,
                        "component",
                        componentName,
                        `${componentName}.${ext}`
                    )
                )
            )
        );

    const usedLegacyComponents = new Set<string>();

    let doIncludeAllComponents = false;

    await Promise.all(
        commandContext.srcFilePaths.map(async srcFilePath => {
            const rawFileContent = (await readFile(srcFilePath)).toString("utf8");

            for (const moduleId of getReactLegacyImportedModuleIds({ rawFileContent })) {
                if (moduleId === ROOT_IMPORT_MODULE_ID) {
                    console.warn(
                        [
                            `[react-sds] "${moduleId}" (no subpath) is imported in`,
                            `${pathRelative(process.cwd(), srcFilePath)}:`,
                            `a root import does not tell which components are used, so no CSS`,
                            `is trimmed at all for this run. Prefer importing components from`,
                            `their subpath (e.g. "${REACT_LEGACY_PACKAGE_NAME}/Button") to keep`,
                            `the CSS optimization effective.`
                        ].join(" ")
                    );

                    doIncludeAllComponents = true;

                    continue;
                }

                const legacyComponents = resolveModuleIdToLegacyComponents({ moduleId });

                if (legacyComponents === undefined) {
                    // NOTE: Deliberately not routed through log?.(), --silent must not hide
                    // the fact that the optimization has been disabled for this run.
                    console.warn(
                        [
                            `[react-sds] Unknown react-sds module "${moduleId}" imported in`,
                            `${pathRelative(process.cwd(), srcFilePath)}:`,
                            `no CSS is trimmed at all for this run, every component is included.`,
                            `Please report it: https://github.com/skygenesisenterprise/react-sds/issues`
                        ].join(" ")
                    );

                    doIncludeAllComponents = true;

                    continue;
                }

                if (legacyComponents.length === 0) {
                    continue;
                }

                log?.(`Found import of ${moduleId} in ${pathRelative(process.cwd(), srcFilePath)}`);

                legacyComponents.forEach(componentName => usedLegacyComponents.add(componentName));
            }

            for (const componentName of detectLegacyComponentsFromClassNames({ rawFileContent })) {
                if (usedLegacyComponents.has(componentName)) {
                    continue;
                }

                log?.(
                    `Found usage of ${componentName} classes in ${pathRelative(
                        process.cwd(),
                        srcFilePath
                    )}`
                );

                usedLegacyComponents.add(componentName);
            }
        })
    );

    additional_components_from_package_json: {
        const packageJsonFilePath = pathJoin(commandContext.projectDirPath, "package.json");

        if (!(await existsAsync(packageJsonFilePath))) {
            break additional_components_from_package_json;
        }

        const reactLegacyConfig: unknown = JSON.parse(
            (await readFile(packageJsonFilePath)).toString("utf8")
        )["react-sds"];

        const additionalComponents: unknown =
            reactLegacyConfig === null || typeof reactLegacyConfig !== "object"
                ? undefined
                : (reactLegacyConfig as Record<string, unknown>)["additionalComponents"];

        if (additionalComponents === undefined) {
            if (reactLegacyConfig !== null && typeof reactLegacyConfig === "object") {
                // A typo in the key would otherwise silently disable the escape hatch.
                console.warn(
                    [
                        `[react-sds] The "react-sds" entry of your package.json has no`,
                        `"additionalComponents" key, is it a typo? Found:`,
                        `${Object.keys(reactLegacyConfig as Record<string, unknown>).join(", ")}`
                    ].join(" ")
                );
            }

            break additional_components_from_package_json;
        }

        assert(
            Array.isArray(additionalComponents) &&
                additionalComponents.every((value): value is string => typeof value === "string"),
            'Malformed "react-sds"."additionalComponents" in package.json, expected an array of strings'
        );

        for (const additionalComponent of additionalComponents) {
            const legacyComponents =
                REACT_LEGACY_MODULE_TO_LEGACY_COMPONENTS[additionalComponent] ??
                (availableLegacyComponents.includes(additionalComponent)
                    ? [additionalComponent]
                    : undefined);

            if (legacyComponents === undefined) {
                console.warn(
                    [
                        `[react-sds] Unknown component "${additionalComponent}" in`,
                        `"react-sds"."additionalComponents" of your package.json:`,
                        `no CSS is trimmed at all for this run, every component is included.`
                    ].join(" ")
                );

                doIncludeAllComponents = true;

                continue;
            }

            if (legacyComponents.length === 0) {
                // Reporting "Including <X>" here would be the exact opposite of what happens,
                // and this escape hatch is precisely what one reaches for when something is unstyled.
                console.warn(
                    [
                        `[react-sds] "${additionalComponent}" of`,
                        `"react-sds"."additionalComponents" maps to no legacy stylesheet,`,
                        `nothing was added.`,
                        ...(additionalComponent === "Chart"
                            ? [`The Chart CSS comes from the @gouvfr/dsfr-chart package.`]
                            : [])
                    ].join(" ")
                );

                continue;
            }

            log?.(`Including ${additionalComponent} (from package.json additionalComponents)`);

            legacyComponents.forEach(componentName => usedLegacyComponents.add(componentName));
        }
    }

    if (doIncludeAllComponents && commandContext.isStrict) {
        console.error(
            [
                `[react-sds] Aborting because of --strict:`,
                `something could not be resolved (see the warning(s) above),`,
                `so this run would have shipped the untrimmed legacy.min.css.`,
                `Fix the cause or add the component to "react-sds"."additionalComponents"`,
                `in your package.json.`
            ].join(" ")
        );

        process.exit(1);
    }

    const legacyComponents = doIncludeAllComponents
        ? availableLegacyComponents
        : availableLegacyComponents.filter(componentName =>
              usedLegacyComponents.has(componentName)
          );

    log?.(
        `Including the CSS of ${legacyComponents.length} legacy components (out of ${availableLegacyComponents.length}).`
    );

    const readLegacyFile = (fileRelativePath: string) => {
        const filePath = pathJoin(commandContext.legacyDirPath, ...fileRelativePath.split("/"));

        if (!fs.existsSync(filePath)) {
            return undefined;
        }

        return fs.readFileSync(filePath).toString("utf8");
    };

    const rawLegacyCssCodeBuffer = Buffer.from(
        generateLegacyCssCode({
            legacyComponents,
            "isMinified": false,
            readLegacyFile
        }),
        "utf8"
    );

    const rawLegacyMinCssCodeBuffer = Buffer.from(
        generateLegacyCssCode({
            legacyComponents,
            "isMinified": true,
            readLegacyFile
        }),
        "utf8"
    );

    let hasChanged = false;

    await Promise.all(
        [
            {
                "legacyDirPath": commandContext.legacyDirPath,
                "cssFileBasenames": ["legacy.css", "legacy.min.css"] as const
            },
            ...(commandContext.spaParams === undefined
                ? []
                : [
                      {
                          "legacyDirPath": commandContext.spaParams.legacyDirPath_static,
                          // copy-legacy-to-public only keeps the minified variant.
                          "cssFileBasenames": ["legacy.min.css"] as const
                      }
                  ])
        ].map(async ({ legacyDirPath, cssFileBasenames }) =>
            Promise.all(
                cssFileBasenames.map(async cssFileBasename => {
                    const cssFilePath = pathJoin(legacyDirPath, cssFileBasename);

                    if (!(await existsAsync(cssFilePath))) {
                        return;
                    }

                    const buffer =
                        cssFileBasename === "legacy.min.css"
                            ? rawLegacyMinCssCodeBuffer
                            : rawLegacyCssCodeBuffer;

                    if (Buffer.compare(await readFile(cssFilePath), buffer) === 0) {
                        return;
                    }

                    hasChanged = true;

                    await writeFile(cssFilePath, buffer);
                })
            )
        )
    );

    // NOTE: Deliberately outside of the `hasChanged` guard below.
    // copy-legacy-to-public builds its keep list from the url() of the legacy.min.css it
    // finds in node_modules, then early returns on every later run as long as
    // public/legacy/version.txt matches the @gouvfr/dsfr version. So once it has run
    // against an already trimmed stylesheet, public/legacy is frozen on that asset subset
    // and growing the component set later can never bring the missing files back.
    // Copying them ourselves also makes a purged public/legacy repairable when the CSS
    // itself did not change.
    await (async function copyUsedLegacyAssetsToStatic() {
        if (commandContext.spaParams === undefined) {
            return;
        }

        const { legacyDirPath_static } = commandContext.spaParams;

        await Promise.all(
            getReferencedAssetRelativePaths({
                "rawCssCode": rawLegacyMinCssCodeBuffer.toString("utf8")
            }).map(async assetRelativePath => {
                const pathSegments = assetRelativePath.split("/");

                const srcFilePath = pathJoin(commandContext.legacyDirPath, ...pathSegments);

                if (!(await existsAsync(srcFilePath))) {
                    return;
                }

                await cp(srcFilePath, pathJoin(legacyDirPath_static, ...pathSegments));
            })
        );
    })();

    // NOTE: Deliberately outside of the `hasChanged` guard below. The rewrite is
    // idempotent, and inside the guard a stale or hand reverted hash could never be
    // repaired as long as legacy.min.css itself did not change.
    await (async function addHashQueryParameterInIndexHtml() {
        const htmlFilePath = commandContext.spaParams?.htmlFilePath;

        if (htmlFilePath === undefined) {
            return;
        }

        const html = (await readFile(htmlFilePath)).toString("utf8");

        const { modifiedHtml } = modifyHtmlHrefs({
            "html": html,
            "getModifiedHref": href => {
                if (!href.includes("legacy.min.css")) {
                    return href;
                }

                const [urlWithoutQuery] = href.split("?");

                return `${urlWithoutQuery}?hash=${fnv1aHashToHex(
                    rawLegacyMinCssCodeBuffer.toString("utf8")
                )}`;
            }
        });

        if (modifiedHtml === html) {
            return;
        }

        await writeFile(htmlFilePath, Buffer.from(modifiedHtml, "utf8"));
    })();

    if (!hasChanged) {
        log?.("No change since last run");
        return;
    }

    await Promise.all([
        (async function clearCache() {
            await Promise.all(
                [
                    pathJoin(".next", "cache"),
                    pathJoin(".vite"),
                    pathJoin(".cache", "storybook"),
                    pathJoin(".cache", "babel-loader"),
                    pathJoin(".cache", "default-development")
                ]
                    .map(relativeDirPath =>
                        pathJoin(commandContext.projectDirPath, "node_modules", relativeDirPath)
                    )
                    .map(async dirPath => {
                        if (!(await existsAsync(dirPath))) {
                            return;
                        }

                        await rm(dirPath, { "recursive": true, "force": true });
                    })
            );
        })()
    ]);
}

if (require.main === module) {
    main(process.argv.slice(2));
}
