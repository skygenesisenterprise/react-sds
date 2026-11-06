/**
 * SDS Native motion tokens (milliseconds).
 */

export type SDSMotionTokens = {
    durationFast: number;
    durationNormal: number;
    durationSlow: number;
};

export const sdsMotion: SDSMotionTokens = {
    durationFast: 150,
    durationNormal: 250,
    durationSlow: 350
};
