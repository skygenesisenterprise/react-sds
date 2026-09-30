/**
 * SDS Native spacing tokens (points).
 *
 * Semantic aliases map to the numeric scale so components stay readable.
 */

export type SDSSpacingTokens = {
    none: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    "2xl": number;
    "3xl": number;
    "4xl": number;
};

export const sdsSpacing: SDSSpacingTokens = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 40,
    "3xl": 48,
    "4xl": 64
};
