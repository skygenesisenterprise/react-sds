/**
 * SDS Native color tokens.
 *
 * Same semantic contract as the web SDS tokens (`src/sds/tokens.ts`) but with
 * concrete hex values consumable by React Native style objects. The semantic
 * meaning of each token is the contract; values follow the current Sky Genesis Enterprise
 * palette (provisional) and may be replaced by the official identity without
 * changing the structure.
 */

export type SDSColorToken =
    | "background"
    | "foreground"
    | "surface"
    | "surfaceMuted"
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "danger"
    | "error"
    | "info"
    | "border"
    | "input"
    | "ring"
    | "focus"
    | "link"
    | "linkHover"
    | "onPrimary"
    | "muted"
    | "disabled"
    | "text"
    | "textMuted";

export type SDSColorTokens = Record<SDSColorToken, string>;

export const sdsColors: SDSColorTokens = {
    background: "#fcfcfc",
    foreground: "#141414",
    surface: "#ffffff",
    surfaceMuted: "#f6f6f6",
    primary: "#514e39",
    secondary: "#f6f6f6",
    accent: "#e8e3da",
    success: "#1d7d3e",
    warning: "#be7200",
    danger: "#cf1f29",
    error: "#cf1f29",
    info: "#2a75ba",
    border: "#dbdbdb",
    input: "#dbdbdb",
    ring: "#514e39",
    focus: "#514e39",
    link: "#514e39",
    linkHover: "#363325",
    onPrimary: "#ffffff",
    muted: "#f6f6f6",
    disabled: "#9e9e9e",
    text: "#141414",
    textMuted: "#5c5a56"
};

/** Dark scheme (preliminary) — same semantic tokens, darker surfaces. */
export const sdsDarkColors: SDSColorTokens = {
    background: "#141414",
    foreground: "#e8e3da",
    surface: "#1c1c1c",
    surfaceMuted: "#2a2a2a",
    primary: "#d1cfc0",
    secondary: "#222222",
    accent: "#363636",
    success: "#62c37a",
    warning: "#f4a437",
    danger: "#ef4444",
    error: "#ef4444",
    info: "#67aaed",
    border: "#2c2c2c",
    input: "#2c2c2c",
    ring: "#d1cfc0",
    focus: "#d1cfc0",
    link: "#d1cfc0",
    linkHover: "#e7e5d6",
    onPrimary: "#363636",
    muted: "#2a2a2a",
    disabled: "#555555",
    text: "#e8e3da",
    textMuted: "#8e8a83"
};
