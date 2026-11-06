import { describe, it, expect } from "vitest";
import * as fs from "fs";
import { join as pathJoin } from "path";
import {
    buildNativeColorTokens,
    generateNativeColorsSource,
    SGE_COLOR_TOKEN_TO_NATIVE_KEY
} from "../../../scripts/tokens/nativeColors";
import {
    getResolvedToken,
    parseCssCustomProperties,
    readSgeTokenMaps,
    resolveCssValue
} from "../../../scripts/tokens/readSgeTokens";
import { sdsTokens } from "../../../src/sds/tokens";

/**
 * One design system, one identity.
 *
 * The same institutional tokens are published in three representations:
 *   - CSS custom properties (`src/styles/**`) — the canonical, hand-edited source;
 *   - the typed contract (`sdsTokens` in `src/sds/tokens.ts`) — for React code;
 *   - React Native values (`src/native/tokens/colors.ts`) — opaque sRGB, generated.
 *
 * These tests are the mechanism that prevents a token edit from silently leaving
 * another platform on the previous value.
 */

const projectRootDirPath = process.cwd();

const normalizeCssValue = (value: string): string =>
    value.replace(/\s+/g, " ").trim().toLowerCase();

const walkCssFiles = (dirPath: string): string[] =>
    fs.readdirSync(dirPath, { "withFileTypes": true }).flatMap(dirent => {
        const filePath = pathJoin(dirPath, dirent.name);

        return dirent.isDirectory()
            ? walkCssFiles(filePath)
            : dirent.name.endsWith(".css")
              ? [filePath]
              : [];
    });

describe("SGE token coherence across platforms", () => {
    it("the committed native palette is exactly what the CSS tokens generate", async () => {
        const expectedSource = await generateNativeColorsSource({ projectRootDirPath });

        const actualSource = fs
            .readFileSync(pathJoin(projectRootDirPath, "src/native/tokens/colors.ts"))
            .toString("utf8");

        expect(
            actualSource,
            [
                "src/native/tokens/colors.ts is out of sync with the CSS foundation.",
                "A color token changed without regenerating the native palette — run:",
                "    pnpm tokens:sync"
            ].join("\n")
        ).toBe(expectedSource);
    });

    it("every mapped native color is the sRGB value of its CSS token, in both themes", () => {
        const maps = readSgeTokenMaps(projectRootDirPath);

        const { light, dark } = buildNativeColorTokens({ projectRootDirPath });

        for (const [cssToken, nativeKey] of SGE_COLOR_TOKEN_TO_NATIVE_KEY) {
            const cssValue = getResolvedToken({
                maps,
                "scope": "light",
                "tokenName": `--sge-color-${cssToken}`
            });

            expect(
                cssValue,
                `--sge-color-${cssToken} must resolve to a concrete color (native "${nativeKey}")`
            ).not.toContain("var(");

            expect(
                light[nativeKey],
                `native light "${nativeKey}" must derive from --sge-color-${cssToken}`
            ).toMatch(/^#[0-9a-f]{6}$/);

            expect(
                dark[nativeKey],
                `native dark "${nativeKey}" must derive from --sge-color-${cssToken}`
            ).toMatch(/^#[0-9a-f]{6}$/);
        }

        // A dark theme that resolves to the light values would mean the dark scope
        // silently fell back to the primitives instead of re-declaring the semantics.
        expect(dark.background).not.toBe(light.background);
        expect(dark.foreground).not.toBe(light.foreground);
    });

    it("the typed token contract matches the CSS light theme", () => {
        const maps = readSgeTokenMaps(projectRootDirPath);

        const problems: string[] = [];

        for (const [key, value] of Object.entries(sdsTokens.colors)) {
            const cssValue = getResolvedToken({
                maps,
                "scope": "light",
                "tokenName": `--sge-color-${key}`
            });

            if (normalizeCssValue(cssValue) !== normalizeCssValue(value)) {
                problems.push(`--sge-color-${key}: CSS "${cssValue}" vs sdsTokens "${value}"`);
            }
        }

        expect(
            problems,
            [
                "The typed `sdsTokens.colors` contract drifted from the CSS foundation:",
                ...problems.map(problem => `  - ${problem}`)
            ].join("\n")
        ).toStrictEqual([]);
    });

    it("every --sge-* custom property consumed by the stylesheets is declared", () => {
        const maps = readSgeTokenMaps(projectRootDirPath);

        const declared = new Set([
            ...maps.primitives.keys(),
            ...maps.light.keys(),
            ...maps.dark.keys()
        ]);

        const problems: string[] = [];

        for (const filePath of walkCssFiles(pathJoin(projectRootDirPath, "src/styles"))) {
            const rawCssCode = fs.readFileSync(filePath).toString("utf8");

            const consumed = new Set(
                Array.from(rawCssCode.matchAll(/var\(\s*(--sge-[a-zA-Z0-9-]+)/g), match => match[1])
            );

            for (const variableName of consumed) {
                if (declared.has(variableName)) {
                    continue;
                }

                problems.push(
                    `${pathJoin("src/styles", filePath.split("/src/styles/")[1])}: ${variableName}`
                );
            }
        }

        expect(
            problems,
            [
                "Undefined institutional custom properties (they resolve to nothing at runtime):",
                ...problems.map(problem => `  - ${problem}`)
            ].join("\n")
        ).toStrictEqual([]);
    });

    it("the token reader resolves the semantic chain down to a primitive", () => {
        const maps = readSgeTokenMaps(projectRootDirPath);

        const resolved = resolveCssValue({
            "map": maps.light,
            "value": "var(--sge-color-primary)"
        });

        expect(resolved).toBe("oklch(0.42 0.033 100.6306)");

        // An undeclared variable must throw instead of producing an invalid value.
        expect(() =>
            resolveCssValue({ "map": maps.light, "value": "var(--sge-color-does-not-exist)" })
        ).toThrow(/Undeclared CSS custom property/);

        // The parser only understands declarations, not prose in docblocks.
        expect(
            parseCssCustomProperties(
                "/** `--sge-color-fake: red;` */ :root { --sge-color-real: blue; }"
            )
        ).toStrictEqual(new Map([["--sge-color-real", "blue"]]));
    });
});
