/**
 * SDS Native typography tokens.
 *
 * Font sizes are given in points (numbers) as expected by React Native styles.
 * Weights use the React Native `FontWeight` string union.
 */

export type SDSFontWeight = "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";

export type SDSTypographyTokens = {
    "fontFamily-sans": string;
    "fontFamily-serif": string;
    "fontFamily-mono": string;
    "fontSize-xs": number;
    "fontSize-sm": number;
    "fontSize-md": number;
    "fontSize-lg": number;
    "fontSize-xl": number;
    "fontSize-2xl": number;
    "fontSize-3xl": number;
    "fontWeight-regular": SDSFontWeight;
    "fontWeight-medium": SDSFontWeight;
    "fontWeight-semibold": SDSFontWeight;
    "fontWeight-bold": SDSFontWeight;
    "lineHeight-body": number;
    "lineHeight-heading": number;
    "lineHeight-tight": number;
    "lineHeight-normal": number;
    "lineHeight-relaxed": number;
};

export const sdsTypography: SDSTypographyTokens = {
    "fontFamily-sans": "System",
    "fontFamily-serif": "Georgia",
    "fontFamily-mono": "monospace",
    "fontSize-xs": 12,
    "fontSize-sm": 14,
    "fontSize-md": 16,
    "fontSize-lg": 20,
    "fontSize-xl": 24,
    "fontSize-2xl": 28,
    "fontSize-3xl": 36,
    "fontWeight-regular": "400",
    "fontWeight-medium": "500",
    "fontWeight-semibold": "600",
    "fontWeight-bold": "700",
    "lineHeight-body": 24,
    "lineHeight-heading": 28,
    "lineHeight-tight": 22,
    "lineHeight-normal": 24,
    "lineHeight-relaxed": 27
};
