import { describe, it, expect } from "vitest";
import { getContrastRatio, parseCssColor } from "../../../scripts/tokens/color";
import { getResolvedToken, readSgeTokenMaps } from "../../../scripts/tokens/readSgeTokens";
import type { SgeTokenScope } from "../../../scripts/tokens/readSgeTokens";

/**
 * WCAG contrast of the institutional color pairs, measured — not assumed.
 *
 * The palette is not "adjusted until the numbers look nice": these assertions fix
 * the floor the identity must clear in both schemes. If a design change breaks a
 * pair, the failing pair is the deliverable, not a reason to lower the threshold.
 *
 * Thresholds (WCAG 2.2):
 *   - 4.5:1 — normal text;
 *   - 3:1   — large text, UI components and graphical objects.
 */

const projectRootDirPath = process.cwd();

type ContrastCase = {
    foreground: string;
    background: string;
    min: number;
    why: string;
};

const TEXT = 4.5;
const UI = 3;

const CONTRAST_CASES: ContrastCase[] = [
    { "foreground": "foreground", "background": "background", "min": TEXT, "why": "body text" },
    { "foreground": "text", "background": "background", "min": TEXT, "why": "text alias" },
    {
        "foreground": "muted-foreground",
        "background": "background",
        "min": TEXT,
        "why": "secondary text"
    },
    { "foreground": "text-muted", "background": "background", "min": TEXT, "why": "captions" },
    { "foreground": "card-foreground", "background": "card", "min": TEXT, "why": "card text" },
    {
        "foreground": "popover-foreground",
        "background": "popover",
        "min": TEXT,
        "why": "popover text"
    },
    {
        "foreground": "primary-foreground",
        "background": "primary",
        "min": TEXT,
        "why": "primary button label"
    },
    {
        "foreground": "secondary-foreground",
        "background": "secondary",
        "min": TEXT,
        "why": "secondary button label"
    },
    {
        "foreground": "accent-foreground",
        "background": "accent",
        "min": TEXT,
        "why": "accent surface"
    },
    {
        "foreground": "destructive-foreground",
        "background": "destructive",
        "min": TEXT,
        "why": "destructive button label"
    },
    { "foreground": "link", "background": "background", "min": TEXT, "why": "inline link" },
    {
        "foreground": "link-hover",
        "background": "background",
        "min": TEXT,
        "why": "link hover state"
    },
    { "foreground": "ring", "background": "background", "min": UI, "why": "focus ring" },
    {
        "foreground": "border",
        "background": "background",
        "min": 1.2,
        "why": "hairline separator (must stay visible)"
    }
];

const getContrast = (params: {
    scope: SgeTokenScope;
    foregroundToken: string;
    backgroundToken: string;
}): number => {
    const { scope, foregroundToken, backgroundToken } = params;

    const maps = readSgeTokenMaps(projectRootDirPath);

    const read = (token: string): ReturnType<typeof parseCssColor> =>
        parseCssColor(getResolvedToken({ maps, scope, "tokenName": `--sge-color-${token}` }));

    return getContrastRatio(read(foregroundToken), read(backgroundToken));
};

describe("SGE theme contrast (WCAG 2.2)", () => {
    for (const scope of ["light", "dark"] as const) {
        it(`meets the contrast floor in the ${scope} theme`, () => {
            const failures = CONTRAST_CASES.map(contrastCase => ({
                contrastCase,
                ratio: getContrast({
                    scope,
                    "foregroundToken": contrastCase.foreground,
                    "backgroundToken": contrastCase.background
                })
            }))
                .filter(({ contrastCase, ratio }) => ratio < contrastCase.min)
                .map(
                    ({ contrastCase, ratio }) =>
                        `${contrastCase.foreground} on ${contrastCase.background}: ` +
                        `${ratio.toFixed(2)}:1 < ${contrastCase.min}:1 (${contrastCase.why})`
                );

            expect(
                failures,
                `Accessibility regressions in the ${scope} theme:\n${failures.join("\n")}`
            ).toStrictEqual([]);
        });
    }

    it("keeps the two schemes genuinely distinct", () => {
        expect(
            getContrast({
                "scope": "light",
                "foregroundToken": "link",
                "backgroundToken": "background"
            })
        ).toBeGreaterThan(1);
        expect(
            getContrast({
                "scope": "dark",
                "foregroundToken": "link",
                "backgroundToken": "background"
            })
        ).toBeGreaterThan(1);
    });
});
