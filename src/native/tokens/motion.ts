/**
 * SDS Native motion tokens (milliseconds).
 */

export type SDSMotionTokens = {
    durationFast: number;
    durationNormal: number;
    durationSlow: number;
};

export const sdsMotion: SDSMotionTokens = {
    durationFast: 120,
    durationNormal: 200,
    durationSlow: 350
};
