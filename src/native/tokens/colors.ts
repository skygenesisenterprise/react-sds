/**
 * SDS Native color tokens.
 *
 * Same semantic contract as the web SDS tokens (`src/sds/tokens.ts`) but with
 * concrete hex values consumable by React Native style objects. The semantic
 * meaning of each token is the contract; values follow the current SGE
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
    background: "#ffffff",
    foreground: "#1c232b",
    surface: "#ffffff",
    surfaceMuted: "#f6f6f6",
    primary: "#1b2f5c",
    secondary: "#f6f6f6",
    accent: "#e1000f",
    success: "#18753c",
    warning: "#b34000",
    danger: "#ce0500",
    error: "#ce0500",
    info: "#0063cb",
    border: "#e5e5e5",
    input: "#c9c9c9",
    ring: "#1b2f5c",
    focus: "#1b2f5c",
    link: "#1b2f5c",
    linkHover: "#152647",
    onPrimary: "#ffffff",
    muted: "#666666",
    disabled: "#9b9b9b",
    text: "#1c232b",
    textMuted: "#6a6a6a"
};

/** Dark scheme (preliminary) — same semantic tokens, darker surfaces. */
export const sdsDarkColors: SDSColorTokens = {
    background: "#12161c",
    foreground: "#e8eaed",
    surface: "#1c222b",
    surfaceMuted: "#232a34",
    primary: "#8fb0e8",
    secondary: "#2a323d",
    accent: "#ff6b6b",
    success: "#4caf7d",
    warning: "#ff9a5c",
    danger: "#ff6b6b",
    error: "#ff6b6b",
    info: "#6db3f2",
    border: "#333c48",
    input: "#3b4552",
    ring: "#8fb0e8",
    focus: "#8fb0e8",
    link: "#8fb0e8",
    linkHover: "#a9c3ee",
    onPrimary: "#12161c",
    muted: "#a3aab3",
    disabled: "#5c6470",
    text: "#e8eaed",
    textMuted: "#a3aab3"
};
