/**
 * SDS Native dimension tokens.
 *
 * Mobile-specific measurements adapted for touch — these intentionally differ
 * from the web (larger touch targets, thumb-friendly control heights).
 */

import { StyleSheet } from "react-native";

export type SDSDimensionTokens = {
    /** Minimum touch target (Apple HIG / Material guidance). */
    touchTarget: number;
    /** Small control height (icon buttons, compact). */
    controlSm: number;
    /** Standard control height (buttons, inputs). */
    controlMd: number;
    /** Large control height (primary CTAs). */
    controlLg: number;
    /** Icon glyph size (regular). */
    iconSm: number;
    /** Icon glyph size (medium). */
    iconMd: number;
    /** Icon glyph size (large). */
    iconLg: number;
    /** Horizontal page/content gutter. */
    contentGutter: number;
    /** Gap between stacked elements. */
    elementGap: number;
    /** Gap between related controls in a group. */
    controlGap: number;
    /** Card horizontal/vertical padding. */
    cardPadding: number;
    /** Section vertical spacing. */
    sectionGap: number;
    /** Border hairline width. */
    hairline: number;
};

export const sdsDimensions: SDSDimensionTokens = {
    touchTarget: 44,
    controlSm: 36,
    controlMd: 44,
    controlLg: 52,
    iconSm: 18,
    iconMd: 24,
    iconLg: 32,
    contentGutter: 16,
    elementGap: 12,
    controlGap: 8,
    cardPadding: 16,
    sectionGap: 24,
    hairline: StyleSheet.hairlineWidth
};
