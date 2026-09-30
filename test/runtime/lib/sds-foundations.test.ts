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

const tokensCssContent = readSrcFile("styles/tokens.css");
const themesCssContent = readSrcFile("styles/themes.css");
const mainCssContent = readSrcFile("../scripts/build/main.css");

/**
 * Maps every typed token to its CSS custom property name:
 *   colors    → --sds-color-<key>
 *   typography→ --sds-<key>       (keys already carry their font/line-height prefix)
 *   spacing   → --sds-space-<key>
 *   radius    → --sds-radius-<key>
 *   elevation → --sds-elevation-<key>
 *   motion    → --sds-<key>       (duration/easing/transition prefixes)
 *   breakpoints → --sds-breakpoint-<key>
 */
const getExpectedCssVariableNames = (): Set<string> => {
    const variableNames = new Set<string>();

    for (const [section, values] of Object.entries(sdsTokens)) {
        for (const key of Object.keys(values as Record<string, string>)) {
            switch (section) {
                case "colors":
                    variableNames.add(`--sds-color-${key}`);
                    break;
                case "spacing":
                    variableNames.add(`--sds-space-${key}`);
                    break;
                case "radius":
                    variableNames.add(`--sds-radius-${key}`);
                    break;
                case "elevation":
                    variableNames.add(`--sds-elevation-${key}`);
                    break;
                case "breakpoints":
                    variableNames.add(`--sds-breakpoint-${key}`);
                    break;
                case "typography":
                case "motion":
                    variableNames.add(`--sds-${key}`);
                    break;
                default:
                    throw new Error(`Unhandled token section: ${section}`);
            }
        }
    }

    return variableNames;
};

describe("SDS CSS foundation", () => {
    it("declares every --sds-* custom property of the token contract (tokens.css)", () => {
        const expectedVariableNames = getExpectedCssVariableNames();

        // Only the :root block is theme-independent (dark scheme lives in themes.css).
        const rootBlock = tokensCssContent.split("@media")[0];

        for (const variableName of expectedVariableNames) {
            expect(
                rootBlock.includes(variableName),
                `tokens.css should declare ${variableName} (declared in the sdsTokens contract)`
            ).toBe(true);
        }
    });

    it("tokens.css declares no custom property outside the token contract", () => {
        const rootBlock = tokensCssContent.split("@media")[0];

        const declaredVariableNames = new Set(
            Array.from(rootBlock.matchAll(/(--sds-[\w-]+)\s*:/g), match => match[1])
        );

        const expectedVariableNames = getExpectedCssVariableNames();

        for (const variableName of declaredVariableNames) {
            expect(
                expectedVariableNames.has(variableName),
                `${variableName} is declared in tokens.css but missing from the sdsTokens contract`
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
            expect(tokensCssContent).toContain(`--sds-color-${colorToken}`);
            expect(
                themesCssContent,
                `the dark scheme (themes.css) should re-declare --sds-color-${colorToken}`
            ).toContain(`--sds-color-${colorToken}`);
        }
    });

    it("honors both dark-mode conventions (.dark and [data-fr-theme=\"dark\"])", () => {
        expect(themesCssContent).toMatch(/^\s*\.dark,/m);
        expect(themesCssContent).toMatch(/\[data-fr-theme="dark"\]\s*\{/);
    });

    it("main.css loads the foundation in the documented order then the legacy layer", () => {
        const importedFiles = Array.from(
            mainCssContent.matchAll(/@import url\((\.\/[^)]+)\)/g),
            match => match[1]
        );

        expect(importedFiles).toStrictEqual([
            "./styles/tokens.css",
            "./styles/reset.css",
            "./styles/base.css",
            "./styles/typography.css",
            "./styles/themes.css",
            "./styles/accessibility.css",
            "./styles/layout.css",
            "./styles/components/header.css",
            "./styles/components/form.css",
            "./styles/components/table.css",
            "./styles/components/prose.css",
            "./styles/components/back-to-top.css",
            "./styles/components/sds-layout.css",
            "./styles/components/sds-typography.css",
            "./styles/components/sds-card.css",
            "./styles/components/sds-portal.css",
            "./styles/components/sds-search.css",
            "./styles/utilities.css",
            "./dsfr/utility/icons/icons.min.css",
            "./dsfr/dsfr.css"
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
