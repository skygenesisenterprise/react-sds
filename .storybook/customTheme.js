import { create } from "@storybook/theming";

// NOTE: The SGE official visual identity (colors, logo, fonts) is not defined yet.
// Storybook chrome below uses neutral placeholders so the branding can be centralized
// later without touching components. See the "Design tokens" section of the README.
const brandImage = "logo.png";
const brandTitle = "Sky Genesis Enterprise Design System — React";
const brandUrl = "https://github.com/skygenesisenterprise/react-sds";
const fontBase = '"Segoe UI", arial, sans-serif';
const fontCode = "monospace";

export const darkTheme = create({
    "base": "dark",
    "appBg": "#1E1E1E",
    "appContentBg": "#161616",
    "barBg": "#161616",
    "colorSecondary": "#8585F6",
    "textColor": "#FFFFFF",
    brandImage,
    brandTitle,
    brandUrl,
    fontBase,
    fontCode
});

export const lightTheme = create({
    "base": "light",
    "appBg": "#F6F6F6",
    "appContentBg": "#FFFFFF",
    "barBg": "#FFFFFF",
    "colorSecondary": "#3A3A3A",
    "textColor": "#212121",
    brandImage,
    brandTitle,
    brandUrl,
    fontBase,
    fontCode
});
