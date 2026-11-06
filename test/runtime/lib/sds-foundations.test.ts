import { describe, it, expect } from "vitest";
import * as fs from "fs";
import { join as pathJoin } from "path";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { sdsTokens } from "../../../src/sds/tokens";
import { BackToTop } from "../../../src/BackToTop";

const projectRootDirPath = process.cwd();

const readSrcFile = (relativeFilePath: string): string =>
    fs.readFileSync(pathJoin(projectRootDirPath, "src", relativeFilePath)).toString("utf8");

const foundationCssContent = [
    "styles/foundation/typography.css",
    "styles/foundation/spacing.css",
    "styles/foundation/dimensions.css",
    "styles/foundation/radius.css",
    "styles/foundation/shadows.css",
    "styles/foundation/motion.css"
]
    .map(readSrcFile)
    .join("\n");
const lightThemeCssContent = readSrcFile("styles/themes/light.css");
const darkThemeCssContent = readSrcFile("styles/themes/dark.css");
const tokensCssContent = [foundationCssContent, lightThemeCssContent, darkThemeCssContent].join(
    "\n"
);
const mainCssContent = readSrcFile("../scripts/build/main.css");

/**
 * Maps every typed token to its CSS custom property name:
 *   colors    → --sge-color-<key>
 *   typography→ --sge-<key>       (keys already carry their font/line-height prefix)
 *   spacing   → --sge-space-<key>
 *   dimensions→ --sge-<key>       (keys already carry their container/control prefix)
 *   radius    → --sge-radius-<key>
 *   elevation → --sge-elevation-<key>
 *   motion    → --sge-<key>       (duration/easing/transition prefixes)
 *   breakpoints → --sge-breakpoint-<key>
 */
const getExpectedCssVariableNames = (): Set<string> => {
    const variableNames = new Set<string>();

    for (const [section, values] of Object.entries(sdsTokens)) {
        for (const key of Object.keys(values as Record<string, string>)) {
            switch (section) {
                case "colors":
                    variableNames.add(`--sge-color-${key}`);
                    break;
                case "spacing":
                    variableNames.add(`--sge-space-${key}`);
                    break;
                case "radius":
                    variableNames.add(`--sge-radius-${key}`);
                    break;
                case "elevation":
                    variableNames.add(`--sge-elevation-${key}`);
                    break;
                case "breakpoints":
                    variableNames.add(`--sge-breakpoint-${key}`);
                    break;
                case "typography":
                case "motion":
                case "dimensions":
                    variableNames.add(`--sge-${key}`);
                    break;
                default:
                    throw new Error(`Unhandled token section: ${section}`);
            }
        }
    }

    return variableNames;
};

describe("SDS CSS foundation", () => {
    it("declares every --sge-* custom property of the token contract (tokens.css)", () => {
        const expectedVariableNames = getExpectedCssVariableNames();

        for (const variableName of expectedVariableNames) {
            expect(
                tokensCssContent.includes(variableName),
                `the foundation should declare ${variableName} (declared in the sdsTokens contract)`
            ).toBe(true);
        }
    });

    it("covers every required semantic color (mission list) in light and dark schemes", () => {
        const requiredColorTokens = [
            "background",
            "foreground",
            "surface",
            "surface-muted",
            "primary",
            "secondary",
            "accent",
            "success",
            "warning",
            "danger",
            "info",
            "border",
            "input",
            "ring",
            "link",
            "link-hover"
        ];

        for (const colorToken of requiredColorTokens) {
            expect(lightThemeCssContent).toContain(`--sge-color-${colorToken}`);
            expect(
                darkThemeCssContent,
                `the dark scheme should re-declare --sge-color-${colorToken}`
            ).toContain(`--sge-color-${colorToken}`);
        }
    });

    it('honors both dark-mode conventions (.dark and [data-fr-theme="dark"])', () => {
        expect(darkThemeCssContent).toMatch(/^\s*\.dark,/m);
        expect(darkThemeCssContent).toMatch(/\[data-fr-theme="dark"\]\s*\{/);
    });

    it("main.css loads the foundation in the documented order then the legacy layer", () => {
        const importedFiles = Array.from(
            mainCssContent.matchAll(/@import url\((\.\/[^)]+)\)/g),
            match => match[1]
        );

        expect(importedFiles).toStrictEqual([
            "./styles/index.css",
            "./legacy/utility/icons/icons.min.css",
            "./legacy/legacy.css"
        ]);
    });

    it("keeps the public assets/sds/tokens.css import path in sync (single source of truth)", () => {
        const tokensReExport = readSrcFile("assets/sds/tokens.css");

        expect(tokensReExport).toContain('@import url("../../styles/tokens.css")');
    });

    it("ships the reduced-motion token override", () => {
        expect(tokensCssContent).toContain("@media (prefers-reduced-motion: reduce)");
    });

    it("BackToTop renders a hidden-by-default, accessible button", () => {
        const html = renderToStaticMarkup(createElement(BackToTop));

        expect(html).toContain('class="sds-back-to-top"');
        expect(html).not.toContain("is-visible");
        expect(html).toContain('type="button"');
        expect(html).toContain('tabindex="-1"');
        expect(html).toContain('aria-hidden="true"');
        expect(html).toContain('aria-label="Retour en haut de page"');

        const customHtml = renderToStaticMarkup(
            createElement(BackToTop, { "label": "Back to top", "className": "my-class" })
        );

        expect(customHtml).toContain("sds-back-to-top my-class");
        expect(customHtml).toContain('aria-label="Back to top"');
    });
});
