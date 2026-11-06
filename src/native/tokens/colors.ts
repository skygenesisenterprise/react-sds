/**
 * SDS Native color tokens — GENERATED FILE, DO NOT EDIT BY HAND.
 *
 * Derived from the institutional CSS foundation:
 *   - `src/styles/foundation/colors.css` (OKLCH primitives)
 *   - `src/styles/themes/light.css` and `src/styles/themes/dark.css` (semantic colors)
 *
 * Every value is the sRGB hexadecimal equivalent of the matching
 * `--sge-color-*` custom property, so the web and native identities are the same
 * identity, not two palettes that happen to look alike.
 *
 * Regenerate after changing a color token:
 *
 *     pnpm tokens:sync
 *
 * `test/runtime/lib/token-sync.test.ts` fails when this file is stale.
 */

export type SDSColorToken =
    | "background"
    | "foreground"
    | "surface"
    | "surfaceMuted"
    | "card"
    | "cardForeground"
    | "popover"
    | "popoverForeground"
    | "primary"
    | "primaryForeground"
    | "secondary"
    | "secondaryForeground"
    | "muted"
    | "mutedForeground"
    | "accent"
    | "accentForeground"
    | "destructive"
    | "destructiveForeground"
    | "success"
    | "warning"
    | "info"
    | "border"
    | "input"
    | "ring"
    | "focus"
    | "link"
    | "linkHover"
    | "onPrimary"
    | "text"
    | "textMuted"
    | "disabled"
    | "danger"
    | "error";

export type SDSColorTokens = Record<SDSColorToken, string>;

/** Light scheme — sRGB equivalent of the default SGE CSS theme. */
export const sdsColors: SDSColorTokens = {
    background: "#fcfcfc",
    foreground: "#141414",
    surface: "#ffffff",
    surfaceMuted: "#f6f6f6",
    card: "#ffffff",
    cardForeground: "#141414",
    popover: "#ffffff",
    popoverForeground: "#141414",
    primary: "#514e39",
    primaryForeground: "#ffffff",
    secondary: "#f6f6f6",
    secondaryForeground: "#514e39",
    muted: "#f6f6f6",
    mutedForeground: "#5c5a56",
    accent: "#e8e3da",
    accentForeground: "#363325",
    destructive: "#cf1f29",
    destructiveForeground: "#ffffff",
    success: "#1d7d3e",
    warning: "#be7200",
    info: "#2a75ba",
    border: "#dbdbdb",
    input: "#dbdbdb",
    ring: "#514e39",
    focus: "#514e39",
    link: "#514e39",
    linkHover: "#363325",
    onPrimary: "#ffffff",
    text: "#141414",
    textMuted: "#5c5a56",
    disabled: "#9e9e9e",
    danger: "#cf1f29",
    error: "#cf1f29"
};

/** Dark scheme — sRGB equivalent of `[data-sge-theme="dark"]`. */
export const sdsDarkColors: SDSColorTokens = {
    background: "#141414",
    foreground: "#e8e3da",
    surface: "#1c1c1c",
    surfaceMuted: "#2a2a2a",
    card: "#1c1c1c",
    cardForeground: "#e8e3da",
    popover: "#1c1c1c",
    popoverForeground: "#e8e3da",
    primary: "#d1cfc0",
    primaryForeground: "#363636",
    secondary: "#222222",
    secondaryForeground: "#d1cfc0",
    muted: "#2a2a2a",
    mutedForeground: "#8e8a83",
    accent: "#363636",
    accentForeground: "#d1cfc0",
    destructive: "#ef4444",
    destructiveForeground: "#141414",
    success: "#62c37a",
    warning: "#f4a437",
    info: "#67aaed",
    border: "#2c2c2c",
    input: "#2c2c2c",
    ring: "#d1cfc0",
    focus: "#d1cfc0",
    link: "#d1cfc0",
    linkHover: "#e7e5d6",
    onPrimary: "#363636",
    text: "#e8e3da",
    textMuted: "#8e8a83",
    disabled: "#555555",
    danger: "#ef4444",
    error: "#ef4444"
};
