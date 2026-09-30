/**
 * SDS Native elevation tokens.
 *
 * Elevation is expressed through the cross-platform abstraction the app actually
 * consumes (iOS shadow + Android elevation) so the same token works on both
 * platforms.
 */

export type SDSElevationTokens = {
    none: number;
    sm: number;
    md: number;
    lg: number;
};

/**
 * Platform-neutral elevation definition. The render layer translates these
 * into `shadowColor`/`shadowOffset`/`shadowRadius`/`shadowOpacity` (iOS) and
 * `elevation` (Android).
 */
export type SDSElevation = {
    /** Android `elevation` (dp). */
    android: number;
    /** iOS shadow opacity. */
    opacity: number;
    /** iOS shadow radius. */
    radius: number;
    /** iOS shadow offset. */
    offset: { width: number; height: number };
};

export const sdsElevation: Record<keyof SDSElevationTokens, SDSElevation> = {
    none: { android: 0, opacity: 0, radius: 0, offset: { width: 0, height: 0 } },
    sm: { android: 2, opacity: 0.1, radius: 3, offset: { width: 0, height: 1 } },
    md: { android: 6, opacity: 0.15, radius: 8, offset: { width: 0, height: 3 } },
    lg: { android: 12, opacity: 0.2, radius: 16, offset: { width: 0, height: 6 } }
};
