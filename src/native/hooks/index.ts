/**
 * SDS Native hooks.
 *
 * For v1 the theme hook is the primary hook; the subpath exists so future hooks
 * (breakpoints, color scheme, reduced motion…) have a stable home.
 */

export { useSDSTheme } from "../theme";
export type { SDSTheme, SDSColorScheme } from "../theme";