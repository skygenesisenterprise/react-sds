/**
 * SGE color math — OKLCH → sRGB, hex serialization and WCAG 2.x contrast.
 *
 * Used by the token tooling (`scripts/tokens/`) and by the token-coherence tests.
 * The institutional palette is authored in OKLCH (see
 * `src/styles/foundation/colors.css`), while React Native style objects need
 * concrete RGB values, so a single, shared conversion keeps the two
 * representations comparable instead of relying on hand-copied hex values.
 *
 * The OKLab matrices are Björn Ottosson's reference implementation.
 */

export type RgbaColor = {
    /** 0–255 */
    r: number;
    /** 0–255 */
    g: number;
    /** 0–255 */
    b: number;
    /** 0–1 */
    a: number;
};

const encodeGamma = (channel: number): number => {
    const clamped = Math.min(1, Math.max(0, channel));
    return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
};

const decodeGamma = (channel: number): number => {
    const clamped = Math.min(1, Math.max(0, channel));
    return clamped <= 0.04045 ? clamped / 12.92 : Math.pow((clamped + 0.055) / 1.055, 2.4);
};

export function oklchToSrgb(params: { l: number; c: number; h: number }): {
    r: number;
    g: number;
    b: number;
} {
    const { l, c, h } = params;

    const hueRadians = (h * Math.PI) / 180;

    const a = c * Math.cos(hueRadians);
    const b = c * Math.sin(hueRadians);

    const lPrime = l + 0.3963377774 * a + 0.2158037573 * b;
    const mPrime = l - 0.1055613458 * a - 0.0638541728 * b;
    const sPrime = l - 0.0894841775 * a - 1.291485548 * b;

    const lCube = lPrime ** 3;
    const mCube = mPrime ** 3;
    const sCube = sPrime ** 3;

    const linearR = 4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube;
    const linearG = -1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube;
    const linearB = -0.0041960863 * lCube - 0.7034186147 * mCube + 1.707614701 * sCube;

    return {
        "r": encodeGamma(linearR),
        "g": encodeGamma(linearG),
        "b": encodeGamma(linearB)
    };
}

const isNumber = (value: string): boolean => value.trim() !== "" && !Number.isNaN(Number(value));

/**
 * Parses the color syntaxes the foundation actually uses:
 * `oklch(L C H)`, `oklch(L C H / a)`, `rgb(R G B)` and `rgb(R G B / a)`.
 * Throws on anything else (a hex literal, a named color, `color-mix()`) so a new
 * syntax can not silently produce a wrong token.
 */
export function parseCssColor(rawValue: string): RgbaColor {
    const value = rawValue.trim();

    const oklchMatch = value.match(
        /^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+(?:deg)?)\s*(?:\/\s*([\d.]+%?))?\s*\)$/i
    );

    if (oklchMatch !== null) {
        const [, rawL, rawC, rawH, rawAlpha] = oklchMatch;

        const parsePercentageOrNumber = (raw: string, scale: number): number =>
            raw.endsWith("%") ? (Number(raw.slice(0, -1)) / 100) * scale : Number(raw);

        const { r, g, b } = oklchToSrgb({
            "l": parsePercentageOrNumber(rawL, 1),
            "c": parsePercentageOrNumber(rawC, 0.4),
            "h": Number(rawH.replace(/deg$/i, ""))
        });

        return {
            "r": Math.round(r * 255),
            "g": Math.round(g * 255),
            "b": Math.round(b * 255),
            "a": rawAlpha === undefined ? 1 : parsePercentageOrNumber(rawAlpha, 1)
        };
    }

    const rgbMatch = value.match(
        /^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?))?\s*\)$/i
    );

    if (rgbMatch !== null) {
        const [, rawR, rawG, rawB, rawAlpha] = rgbMatch;

        if (![rawR, rawG, rawB].every(isNumber)) {
            throw new Error(`Unsupported rgb() color: "${value}"`);
        }

        const alpha = rawAlpha?.endsWith("%")
            ? Number(rawAlpha.slice(0, -1)) / 100
            : Number(rawAlpha ?? "1");

        return { "r": Number(rawR), "g": Number(rawG), "b": Number(rawB), "a": alpha };
    }

    throw new Error(
        `Unsupported CSS color "${value}" — the token tooling understands oklch() and rgb() only`
    );
}

const toHexPair = (channel: number): string =>
    Math.min(255, Math.max(0, Math.round(channel)))
        .toString(16)
        .padStart(2, "0");

/** `#rrggbb` (alpha is dropped: React Native tokens are opaque). */
export function colorToHex(color: RgbaColor): string {
    return `#${toHexPair(color.r)}${toHexPair(color.g)}${toHexPair(color.b)}`;
}

/** WCAG 2.x relative luminance of an opaque color. */
export function getRelativeLuminance(color: RgbaColor): number {
    return (
        0.2126 * decodeGamma(color.r / 255) +
        0.7152 * decodeGamma(color.g / 255) +
        0.0722 * decodeGamma(color.b / 255)
    );
}

/** WCAG 2.x contrast ratio, between 1 and 21. */
export function getContrastRatio(foreground: RgbaColor, background: RgbaColor): number {
    const luminanceA = getRelativeLuminance(foreground);
    const luminanceB = getRelativeLuminance(background);

    const [lightest, darkest] =
        luminanceA >= luminanceB ? [luminanceA, luminanceB] : [luminanceB, luminanceA];

    return (lightest + 0.05) / (darkest + 0.05);
}
