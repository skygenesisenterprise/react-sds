/**
 * Builds the React Native color palette from the institutional CSS foundation.
 *
 * Why a generator
 * ---------------
 * The web tokens are authored in OKLCH (the SGE identity), React Native style
 * objects need opaque sRGB values. Hand-maintaining the second list is exactly
 * how two visual identities appear in one design system: someone edits a CSS
 * token and the native app keeps rendering last quarter's color, silently.
 *
 * So the CSS files stay the single editable source, this module derives the
 * native palette from them, and `test/runtime/lib/token-sync.test.ts` fails when
 * the committed file is not the output of the current CSS.
 *
 * Regenerate with:
 *
 *     pnpm tokens:sync
 */

import * as path from "path";
import prettier from "prettier";
import { colorToHex, parseCssColor } from "./color";
import { getResolvedToken, readSgeTokenMaps } from "./readSgeTokens";
import type { SgeTokenScope } from "./readSgeTokens";

/**
 * Semantic CSS token → native token key, in the published order.
 * Every entry is a `--sge-color-*` property resolved in the light and dark scope.
 */
export const SGE_COLOR_TOKEN_TO_NATIVE_KEY = [
    ["background", "background"],
    ["foreground", "foreground"],
    ["surface", "surface"],
    ["surface-muted", "surfaceMuted"],
    ["card", "card"],
    ["card-foreground", "cardForeground"],
    ["popover", "popover"],
    ["popover-foreground", "popoverForeground"],
    ["primary", "primary"],
    ["primary-foreground", "primaryForeground"],
    ["secondary", "secondary"],
    ["secondary-foreground", "secondaryForeground"],
    ["muted", "muted"],
    ["muted-foreground", "mutedForeground"],
    ["accent", "accent"],
    ["accent-foreground", "accentForeground"],
    ["destructive", "destructive"],
    ["destructive-foreground", "destructiveForeground"],
    ["success", "success"],
    ["warning", "warning"],
    ["info", "info"],
    ["border", "border"],
    ["input", "input"],
    ["ring", "ring"],
    ["focus", "focus"],
    ["link", "link"],
    ["link-hover", "linkHover"],
    ["on-primary", "onPrimary"],
    ["text", "text"],
    ["text-muted", "textMuted"],
    ["disabled", "disabled"]
] as const;

/**
 * Native-only aliases, kept so the existing native components and the published
 * `SDSColorToken` union do not break. Each alias points at a canonical key above:
 * `danger`/`error` are the historical native names of the web `destructive` token.
 */
export const NATIVE_COLOR_ALIASES = {
    "danger": "destructive",
    "error": "destructive"
} as const;

export type NativeColorKey =
    (typeof SGE_COLOR_TOKEN_TO_NATIVE_KEY)[number][1] | keyof typeof NATIVE_COLOR_ALIASES;

export type NativeColorMap = Record<NativeColorKey, string>;

export const NATIVE_COLOR_KEYS: NativeColorKey[] = [
    ...SGE_COLOR_TOKEN_TO_NATIVE_KEY.map(([, nativeKey]) => nativeKey),
    ...(Object.keys(NATIVE_COLOR_ALIASES) as (keyof typeof NATIVE_COLOR_ALIASES)[])
];

export function buildNativeColorTokens(params: { projectRootDirPath: string }): {
    light: NativeColorMap;
    dark: NativeColorMap;
} {
    const { projectRootDirPath } = params;

    const maps = readSgeTokenMaps(projectRootDirPath);

    const build = (scope: SgeTokenScope): NativeColorMap => {
        const colors = Object.fromEntries(
            SGE_COLOR_TOKEN_TO_NATIVE_KEY.map(([cssToken, nativeKey]) => [
                nativeKey,
                colorToHex(
                    parseCssColor(
                        getResolvedToken({
                            maps,
                            scope,
                            "tokenName": `--sge-color-${cssToken}`
                        })
                    )
                )
            ])
        ) as Record<string, string>;

        for (const [alias, target] of Object.entries(NATIVE_COLOR_ALIASES)) {
            colors[alias] = colors[target];
        }

        return colors as NativeColorMap;
    };

    return { "light": build("light"), "dark": build("dark") };
}

const renderColorEntries = (colors: NativeColorMap): string =>
    Object.entries(colors)
        .map(([key, value]) => `    ${key}: "${value}"`)
        .join(",\n");

/**
 * The full source of `src/native/tokens/colors.ts`, formatted with the
 * repository's Prettier configuration so the file satisfies `format:check`.
 */
export async function generateNativeColorsSource(params: {
    projectRootDirPath: string;
}): Promise<string> {
    const { projectRootDirPath } = params;

    const { light, dark } = buildNativeColorTokens({ projectRootDirPath });

    const targetFilePath = path.join(projectRootDirPath, "src/native/tokens/colors.ts");

    const source = [
        "/**",
        " * SDS Native color tokens — GENERATED FILE, DO NOT EDIT BY HAND.",
        " *",
        " * Derived from the institutional CSS foundation:",
        " *   - `src/styles/foundation/colors.css` (OKLCH primitives)",
        " *   - `src/styles/themes/light.css` and `src/styles/themes/dark.css` (semantic colors)",
        " *",
        " * Every value is the sRGB hexadecimal equivalent of the matching",
        " * `--sge-color-*` custom property, so the web and native identities are the same",
        " * identity, not two palettes that happen to look alike.",
        " *",
        " * Regenerate after changing a color token:",
        " *",
        " *     pnpm tokens:sync",
        " *",
        " * `test/runtime/lib/token-sync.test.ts` fails when this file is stale.",
        " */",
        "",
        "export type SDSColorToken =",
        NATIVE_COLOR_KEYS.map(key => `    | "${key}"`).join("\n") + ";",
        "",
        "export type SDSColorTokens = Record<SDSColorToken, string>;",
        "",
        "/** Light scheme — sRGB equivalent of the default SGE CSS theme. */",
        "export const sdsColors: SDSColorTokens = {",
        renderColorEntries(light),
        "};",
        "",
        '/** Dark scheme — sRGB equivalent of `[data-sge-theme="dark"]`. */',
        "export const sdsDarkColors: SDSColorTokens = {",
        renderColorEntries(dark),
        "};",
        ""
    ].join("\n");

    const prettierConfig = (await prettier.resolveConfig(targetFilePath)) ?? {};

    return await prettier.format(source, { ...prettierConfig, "parser": "typescript" });
}
