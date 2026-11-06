/**
 * SDS design tokens — the contract.
 *
 * This module declares the token structure the SGE Design System components and
 * stylesheets are built upon (colors, typography, spacing, radius, elevation, motion,
 * breakpoints).
 *
 * ⚠️ Values — SGE palette (provisional).
 * The color values below follow the SGE palette used by the reference SGE
 * application (`skygenesisenterprise/economie`, `apps/styles/globals.css`, scheme tokens): the
 * semantic meaning of each token is the contract, the exact values are the current
 * working identity. The official SGE identity (colors, fonts, precise scales) is
 * decided by the Sky Genesis Enterprise design owners and will replace these values without
 * changing the structure. Components and stylesheets must consume tokens — never
 * hard-coded values — so that updating the identity never requires rewriting a
 * component. Overriding `--sge-*` custom properties from the application is the
 * supported theming mechanism.
 *
 * The same tokens are exposed as CSS custom properties in
 * `src/styles/foundation/` (theme-independent primitives),
 * `src/styles/themes/light.css` (default scheme) and
 * `src/styles/themes/dark.css` (opt-in scheme), importable together through
 * `@skygenesisenterprise/react-sds/main.css`:
 *
 * ```tsx
 * import "@skygenesisenterprise/react-sds/main.css";
 * ```
 *
 * or individually:
 *
 * ```tsx
 * import "@skygenesisenterprise/react-sds/assets/sds/tokens.css";
 * ```
 */

/** CSS custom-property prefix used for every SDS token. */
export const cssCustomPropertyPrefix = "sge";

export type SDSColorTokens = {
    /** Main action / brand color. */
    primary: string;
    /** Secondary action color. */
    secondary: string;
    /** Highlight / emphasis color. */
    accent: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    /** Page background. */
    background: string;
    /** Text color on `background`. */
    foreground: string;
    /** Raised surface (cards, popovers…). */
    surface: string;
    /** Muted surface (cards on background, table stripes, subtle sections…). */
    "surface-muted": string;
    /** Body text color (alias of `foreground`, kept for compatibility). */
    text: string;
    /** Secondary text (captions, muted paragraphs…). */
    "text-muted": string;
    /** Hairline borders and separators. */
    border: string;
    /** Form control borders. */
    input: string;
    /** Focus / selection ring. */
    ring: string;
    /** Focus outline color. */
    focus: string;
    /** Link color. */
    link: string;
    /** Link hover color. */
    "link-hover": string;
    /** Text that must remain readable when sitting on `primary`. */
    "on-primary": string;
    /** Disabled content (text, borders) — must stay readable. */
    disabled: string;
};

export type SDSTypographyTokens = {
    "font-family-base": string;
    "font-family-heading": string;
    /** Sans stack used across the system. */
    "font-family-sans": string;
    /** Monospace stack (code, pre, numeric data…). */
    "font-family-mono": string;
    /** Font sizes, from smallest to largest. */
    "font-size-xs": string;
    "font-size-sm": string;
    "font-size-md": string;
    "font-size-lg": string;
    "font-size-xl": string;
    "font-size-2xl": string;
    "font-size-3xl": string;
    "font-weight-regular": string;
    "font-weight-medium": string;
    "font-weight-semibold": string;
    "font-weight-bold": string;
    "line-height-body": string;
    "line-height-heading": string;
    "line-height-tight": string;
    "line-height-normal": string;
    "line-height-relaxed": string;
};

export type SDSSpacingTokens = {
    /** Base unit of the spacing scale. */
    base: string;
    /** Spacing steps (multiples of the base unit). */
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
};

export type SDSRadiusTokens = {
    none: string;
    small: string;
    medium: string;
    large: string;
    full: string;
    /** Short aliases (Tailwind-compatible names). */
    sm: string;
    md: string;
    lg: string;
    xl: string;
};

export type SDSElevationTokens = {
    none: string;
    small: string;
    medium: string;
    large: string;
};

export type SDSMotionTokens = {
    "duration-fast": string;
    "duration-normal": string;
    "duration-slow": string;
    "easing-standard": string;
    "easing-entrance": string;
    "easing-exit": string;
    /** Ready-to-use `transition` values (duration + easing). */
    "transition-fast": string;
    "transition-normal": string;
    "transition-slow": string;
};

export type SDSBreakpointTokens = {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
};

/**
 * Layout and interaction dimensions — deliberately separate from `spacing`.
 * CSS names are `--sge-<key>` (e.g. `--sge-container-default`).
 */
export type SDSDimensionTokens = {
    "container-narrow": string;
    "container-default": string;
    "container-wide": string;
    "content-prose": string;
    "content-wide": string;
    "control-height-sm": string;
    "control-height-md": string;
    "control-height-lg": string;
    "touch-target": string;
    "icon-size-sm": string;
    "icon-size-md": string;
    "icon-size-lg": string;
    "focus-ring-width": string;
    "focus-ring-offset": string;
};

export type SDSTokens = {
    colors: SDSColorTokens;
    typography: SDSTypographyTokens;
    spacing: SDSSpacingTokens;
    dimensions: SDSDimensionTokens;
    radius: SDSRadiusTokens;
    elevation: SDSElevationTokens;
    motion: SDSMotionTokens;
    breakpoints: SDSBreakpointTokens;
};

/**
 * PROVISIONAL working values — the SGE palette used by the reference application,
 * kept overridable. Replace with the official SGE identity when decided.
 * Values are given as CSS lengths where relevant so they can be consumed both by CSS
 * custom properties and by CSS-in-JS.
 */
export const sdsTokens: SDSTokens = {
    colors: {
        // Default light scheme (see src/styles/themes/light.css).
        primary: "oklch(0.42 0.033 100.6306)",
        secondary: "oklch(0.9731 0 0)",
        accent: "oklch(0.9173 0.0133 82.4015)",
        success: "oklch(0.52 0.13 150)",
        warning: "oklch(0.62 0.15 70)",
        danger: "oklch(0.55 0.2078 25.3313)",
        info: "oklch(0.55 0.13 250)",
        background: "oklch(0.9911 0 0)",
        foreground: "oklch(0.1913 0 0)",
        surface: "oklch(1 0 0)",
        "surface-muted": "oklch(0.9731 0 0)",
        text: "oklch(0.1913 0 0)",
        "text-muted": "oklch(0.4681 0.0069 84.5829)",
        border: "oklch(0.89 0 0)",
        input: "oklch(0.89 0 0)",
        ring: "oklch(0.42 0.033 100.6306)",
        focus: "oklch(0.42 0.033 100.6306)",
        link: "oklch(0.42 0.033 100.6306)",
        "link-hover": "oklch(0.32 0.025 100.6306)",
        "on-primary": "oklch(1 0 0)",
        disabled: "oklch(0.7 0 0)"
    },
    typography: {
        // SGE ships no webfont: the institutional stack is the platform UI stack.
        // Products that load an official SGE typeface override
        // `--sge-font-family-sans` in their own stylesheet.
        "font-family-base":
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif',
        "font-family-heading":
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif',
        "font-family-sans":
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif',
        "font-family-mono":
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        "font-size-xs": "0.75rem",
        "font-size-sm": "0.875rem",
        "font-size-md": "1rem",
        "font-size-lg": "1.25rem",
        "font-size-xl": "1.5rem",
        "font-size-2xl": "1.75rem",
        "font-size-3xl": "2.25rem",
        "font-weight-regular": "400",
        "font-weight-medium": "500",
        "font-weight-semibold": "600",
        "font-weight-bold": "700",
        "line-height-body": "1.6",
        "line-height-heading": "1.2",
        "line-height-tight": "1.2",
        "line-height-normal": "1.5",
        "line-height-relaxed": "1.7"
    },
    spacing: {
        base: "0.25rem",
        "1": "0.25rem",
        "2": "0.5rem",
        "3": "0.75rem",
        "4": "1rem",
        "5": "1.5rem",
        "6": "2rem",
        "7": "2.5rem",
        "8": "3rem",
        "9": "4rem",
        "10": "5rem",
        "11": "6rem",
        "12": "8rem"
    },
    dimensions: {
        "container-narrow": "45rem",
        "container-default": "75rem",
        "container-wide": "80rem",
        "content-prose": "52rem",
        "content-wide": "72rem",
        "control-height-sm": "2rem",
        "control-height-md": "2.5rem",
        "control-height-lg": "3rem",
        "touch-target": "2.5rem",
        "icon-size-sm": "1rem",
        "icon-size-md": "1.25rem",
        "icon-size-lg": "1.5rem",
        "focus-ring-width": "2px",
        "focus-ring-offset": "2px"
    },
    radius: {
        none: "0",
        small: "0.375rem",
        medium: "0.5rem",
        large: "0.625rem",
        full: "9999px",
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.625rem",
        xl: "0.875rem"
    },
    elevation: {
        none: "none",
        small: "0 1px 2px rgb(28 35 43 / 0.08)",
        medium: "0 6px 18px rgb(28 35 43 / 0.14)",
        large: "0 12px 32px rgb(28 35 43 / 0.18)"
    },
    motion: {
        "duration-fast": "150ms",
        "duration-normal": "250ms",
        "duration-slow": "350ms",
        "easing-standard": "cubic-bezier(0.22, 1, 0.36, 1)",
        "easing-entrance": "cubic-bezier(0, 0, 0.2, 1)",
        "easing-exit": "cubic-bezier(0.4, 0, 1, 1)",
        "transition-fast": "150ms cubic-bezier(0.22, 1, 0.36, 1)",
        "transition-normal": "250ms cubic-bezier(0.22, 1, 0.36, 1)",
        "transition-slow": "350ms cubic-bezier(0.22, 1, 0.36, 1)"
    },
    breakpoints: {
        xs: "0rem",
        sm: "36rem", // 576px
        md: "48rem", // 768px
        lg: "62rem", // 992px
        xl: "75rem" // 1200px
    }
};
