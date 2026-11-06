/**
 * Reads the institutional tokens out of the CSS foundation.
 *
 * The CSS files are the canonical, human-edited source; every derived
 * representation (the native hex palette, the Tailwind adapters when checked)
 * is produced or validated from them. Nothing here writes CSS: it only resolves
 * the `--sge-*` custom properties the way a browser would.
 */

import * as fs from "fs";
import { join as pathJoin } from "path";

/** Foundation layers that declare `--sge-*` primitives (theme-independent). */
export const SGE_FOUNDATION_CSS_RELATIVE_PATHS = [
    "src/styles/foundation/colors.css",
    "src/styles/foundation/typography.css",
    "src/styles/foundation/spacing.css",
    "src/styles/foundation/dimensions.css",
    "src/styles/foundation/radius.css",
    "src/styles/foundation/shadows.css",
    "src/styles/foundation/motion.css"
] as const;

export const SGE_LIGHT_THEME_CSS_RELATIVE_PATH = "src/styles/themes/light.css";
export const SGE_DARK_THEME_CSS_RELATIVE_PATH = "src/styles/themes/dark.css";

/** Strips `/* ... *\/` block comments so declarations in documentation never count. */
const stripComments = (rawCssCode: string): string => rawCssCode.replace(/\/\*[\s\S]*?\*\//g, "");

/**
 * Every `--name: value;` declaration of a stylesheet, in file order.
 * Later declarations win, which mirrors the CSS cascade within one file.
 */
export function parseCssCustomProperties(rawCssCode: string): Map<string, string> {
    const declarations = new Map<string, string>();

    for (const [, name, value] of stripComments(rawCssCode).matchAll(
        /(--[a-zA-Z0-9-]+)\s*:\s*([^;{}]+);/g
    )) {
        declarations.set(name, value.trim());
    }

    return declarations;
}

export type SgeTokenScope = "light" | "dark";

export type SgeTokenMaps = {
    /** Primitives only (`--sge-palette-*`, font sizes, spacing, …). */
    primitives: Map<string, string>;
    light: Map<string, string>;
    dark: Map<string, string>;
};

export function readSgeTokenMaps(projectRootDirPath: string): SgeTokenMaps {
    const read = (relativePath: string): string =>
        fs.readFileSync(pathJoin(projectRootDirPath, relativePath)).toString("utf8");

    const primitives = new Map<string, string>();

    for (const relativePath of SGE_FOUNDATION_CSS_RELATIVE_PATHS) {
        for (const [name, value] of parseCssCustomProperties(read(relativePath))) {
            primitives.set(name, value);
        }
    }

    const merge = (themeRelativePath: string): Map<string, string> => {
        const merged = new Map(primitives);

        for (const [name, value] of parseCssCustomProperties(read(themeRelativePath))) {
            merged.set(name, value);
        }

        return merged;
    };

    return {
        primitives,
        "light": merge(SGE_LIGHT_THEME_CSS_RELATIVE_PATH),
        "dark": merge(SGE_DARK_THEME_CSS_RELATIVE_PATH)
    };
}

/**
 * Resolves `var(--x)` references (recursively) against a scope, throwing on a
 * variable that is not declared anywhere — a missing token would otherwise
 * silently resolve to nothing and reach the platform as an invalid value.
 */
export function resolveCssValue(params: {
    map: Map<string, string>;
    value: string;
    seen?: readonly string[];
}): string {
    const { map, value, seen = [] } = params;

    return value.replace(/var\(\s*(--[a-zA-Z0-9-]+)\s*\)/g, (_match, name: string) => {
        if (seen.includes(name)) {
            throw new Error(`Circular --sge-* reference: ${[...seen, name].join(" -> ")}`);
        }

        const rawValue = map.get(name);

        if (rawValue === undefined) {
            throw new Error(`Undeclared CSS custom property: ${name}`);
        }

        return resolveCssValue({ map, value: rawValue, seen: [...seen, name] });
    });
}

/** Resolved value of a token in a scope, e.g. `--sge-color-primary` in `dark`. */
export function getResolvedToken(params: {
    maps: SgeTokenMaps;
    scope: SgeTokenScope;
    tokenName: string;
}): string {
    const { maps, scope, tokenName } = params;

    const rawValue = maps[scope].get(tokenName);

    if (rawValue === undefined) {
        throw new Error(`${tokenName} is not declared in the ${scope} theme`);
    }

    return resolveCssValue({ "map": maps[scope], "value": rawValue });
}
