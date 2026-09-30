/**
 * SDS Native tokens — aggregated entry.
 *
 * ```ts
 * import { sdsTokens } from "@skygenesisenterprise/react-sds/native";
 * ```
 *
 * These mirror the semantic contract of the web SDS tokens
 * (`@skygenesisenterprise/react-sds/sds`) but are expressed with concrete values
 * consumable by React Native styles.
 */

import { sdsColors, sdsDarkColors } from "./colors";
import type { SDSColorTokens, SDSColorToken } from "./colors";
import { sdsTypography } from "./typography";
import type { SDSTypographyTokens, SDSFontWeight } from "./typography";
import { sdsSpacing } from "./spacing";
import type { SDSSpacingTokens } from "./spacing";
import { sdsRadius } from "./radius";
import type { SDSRadiusTokens } from "./radius";
import { sdsElevation } from "./elevation";
import type { SDSElevation, SDSElevationTokens } from "./elevation";
import { sdsDimensions } from "./dimensions";
import type { SDSDimensionTokens } from "./dimensions";
import { sdsMotion } from "./motion";
import type { SDSMotionTokens } from "./motion";

export type {
    SDSColorTokens,
    SDSColorToken,
    SDSTypographyTokens,
    SDSFontWeight,
    SDSSpacingTokens,
    SDSRadiusTokens,
    SDSElevation,
    SDSElevationTokens,
    SDSDimensionTokens,
    SDSMotionTokens
};

export { sdsColors, sdsDarkColors };
export { sdsTypography };
export { sdsSpacing };
export { sdsRadius };
export { sdsElevation };
export { sdsDimensions };
export { sdsMotion };

export type SDSTokens = {
    colors: SDSColorTokens;
    darkColors: SDSColorTokens;
    typography: SDSTypographyTokens;
    spacing: SDSSpacingTokens;
    radius: SDSRadiusTokens;
    elevation: Record<keyof SDSElevationTokens, SDSElevation>;
    dimensions: SDSDimensionTokens;
    motion: SDSMotionTokens;
};

/** Default SDS Native tokens (light scheme). */
export const sdsTokens: SDSTokens = {
    colors: sdsColors,
    darkColors: sdsDarkColors,
    typography: sdsTypography,
    spacing: sdsSpacing,
    radius: sdsRadius,
    elevation: sdsElevation,
    dimensions: sdsDimensions,
    motion: sdsMotion
};
