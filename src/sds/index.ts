/**
 * SDS foundations.
 *
 * Public entry of the Sky Genesis Enterprise Design System token layer:
 *
 * ```ts
 * import { sdsTokens } from "@skygenesisenterprise/react-sds/sds";
 * ```
 *
 * The CSS custom-property stylesheet is importable separately:
 *
 * ```ts
 * import "@skygenesisenterprise/react-sds/assets/sds/tokens.css";
 * ```
 *
 * Values are provisional working defaults — see ./tokens.ts. This module is independent
 * from the legacy (DSFR-derived) token layer (`src/fr`) and will become the single source
 * of truth once the SDS stylesheet lands (MIGRATION.md).
 */
export { sdsTokens, cssCustomPropertyPrefix } from "./tokens";
export type {
    SdsTokens,
    SdsColorTokens,
    SdsTypographyTokens,
    SdsSpacingTokens,
    SdsRadiusTokens,
    SdsElevationTokens,
    SdsMotionTokens,
    SdsBreakpointTokens
} from "./tokens";

// SDS component families — layout, typography, government portal and content.
export * from "./layout";
export * from "./typography";
export * from "./portal";
export * from "./content";