/**
 * Tailwind CSS v3 preset for the SGE design system.
 *
 * Usage (tailwind.config.js):
 *
 *     module.exports = {
 *         presets: [
 *             require("@skygenesisenterprise/react-sds/tailwind-preset")
 *         ],
 *         content: ["./src/**\/*.{ts,tsx}"]
 *     };
 *
 * The values are CSS variables from the institutional foundation, so the
 * active theme (light/dark) is resolved at runtime. Import the foundation
 * stylesheet once in your application:
 *
 *     import "@skygenesisenterprise/react-sds/styles";
 *
 * Note: because the colors are `var()` references, Tailwind's opacity modifier
 * syntax (e.g. `bg-primary/50`) is not supported by this preset. Use the
 * arbitrary-value syntax with `color-mix()` when you need translucency.
 */

const colors = {
    background: "var(--sge-color-background)",
    foreground: "var(--sge-color-foreground)",

    card: "var(--sge-color-card)",
    "card-foreground": "var(--sge-color-card-foreground)",
    popover: "var(--sge-color-popover)",
    "popover-foreground": "var(--sge-color-popover-foreground)",

    primary: "var(--sge-color-primary)",
    "primary-foreground": "var(--sge-color-primary-foreground)",
    secondary: "var(--sge-color-secondary)",
    "secondary-foreground": "var(--sge-color-secondary-foreground)",

    muted: "var(--sge-color-muted)",
    "muted-foreground": "var(--sge-color-muted-foreground)",
    accent: "var(--sge-color-accent)",
    "accent-foreground": "var(--sge-color-accent-foreground)",

    destructive: "var(--sge-color-destructive)",
    "destructive-foreground": "var(--sge-color-destructive-foreground)",

    border: "var(--sge-color-border)",
    input: "var(--sge-color-input)",
    ring: "var(--sge-color-ring)",

    chart: {
        1: "var(--sge-color-chart-1)",
        2: "var(--sge-color-chart-2)",
        3: "var(--sge-color-chart-3)",
        4: "var(--sge-color-chart-4)",
        5: "var(--sge-color-chart-5)"
    },

    overlay: "var(--sge-color-overlay)"
};

module.exports = {
    theme: {
        extend: {
            colors,
            borderRadius: {
                DEFAULT: "var(--sge-radius-default)",
                sm: "var(--sge-radius-small)",
                md: "var(--sge-radius-medium)",
                lg: "var(--sge-radius-large)",
                xl: "var(--sge-radius-xl)"
            },
            boxShadow: {
                "2xs": "var(--sge-shadow-2xs)",
                xs: "var(--sge-shadow-xs)",
                sm: "var(--sge-shadow-sm)",
                DEFAULT: "var(--sge-shadow-default)",
                md: "var(--sge-shadow-md)",
                lg: "var(--sge-shadow-lg)",
                xl: "var(--sge-shadow-xl)",
                "2xl": "var(--sge-shadow-2xl)"
            },
            transitionDuration: {
                quick: "var(--sge-motion-quick)",
                fast: "var(--sge-motion-fast)",
                medium: "var(--sge-motion-medium)",
                slow: "var(--sge-motion-slow)"
            },
            transitionTimingFunction: {
                "smooth-out": "var(--sge-ease-smooth-out)"
            },
            fontFamily: {
                sans: "var(--sge-font-family-sans)",
                display: "var(--sge-font-family-display)",
                mono: "var(--sge-font-family-mono)"
            },
            letterSpacing: {
                normal: "var(--sge-tracking-normal)",
                tight: "var(--sge-tracking-tight)",
                wide: "var(--sge-tracking-wide)"
            }
        }
    }
};
