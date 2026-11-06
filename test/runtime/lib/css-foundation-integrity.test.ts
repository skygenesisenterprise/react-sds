import { describe, it, expect } from "vitest";
import * as fs from "fs";
import { join as pathJoin, relative, sep } from "path";

/**
 * Structural rules of the institutional CSS foundation.
 *
 * The foundation must stay framework-independent and must not leak the legacy
 * legacy layer into the new identity: a Tailwind directive or a `fr-*` component
 * class in `src/styles` would mean the SGE foundation depends on something that
 * is not the design system.
 */

const projectRootDirPath = process.cwd();
const stylesDirPath = pathJoin(projectRootDirPath, "src/styles");

const readStylesheet = (relativePath: string): string =>
    fs.readFileSync(pathJoin(stylesDirPath, relativePath)).toString("utf8");

const stripComments = (rawCssCode: string): string => rawCssCode.replace(/\/\*[\s\S]*?\*\//g, "");

const listStylesheets = (): string[] =>
    fs
        .readdirSync(stylesDirPath, { "recursive": true, "withFileTypes": true })
        .filter(dirent => dirent.isFile() && dirent.name.endsWith(".css"))
        .map(dirent =>
            relative(stylesDirPath, pathJoin(dirent.parentPath, dirent.name)).split(sep).join("/")
        );

const FOUNDATION_STYLESHEETS = listStylesheets().filter(
    relativePath => !relativePath.startsWith("adapters/")
);

describe("SGE CSS foundation integrity", () => {
    it("enumerates the foundation stylesheets it checks", () => {
        expect(FOUNDATION_STYLESHEETS.length).toBeGreaterThan(20);
        expect(FOUNDATION_STYLESHEETS).toContain("foundation/dimensions.css");
        expect(FOUNDATION_STYLESHEETS).toContain("themes/dark.css");
    });

    it("is free of Tailwind directives (the adapters are the only Tailwind-aware files)", () => {
        const offenders = FOUNDATION_STYLESHEETS.filter(relativePath => {
            const cssCode = stripComments(readStylesheet(relativePath));

            return /@tailwind\b|@apply\b|@theme\b|@config\b/.test(cssCode);
        });

        expect(
            offenders,
            `Tailwind is an optional consumer of the tokens, never part of the foundation: ${offenders.join(", ")}`
        ).toStrictEqual([]);
    });

    it("never declares a legacy fr-* component class", () => {
        const offenders = FOUNDATION_STYLESHEETS.filter(relativePath =>
            /\.fr-[a-z]/.test(stripComments(readStylesheet(relativePath)))
        );

        expect(
            offenders,
            [
                "The SGE foundation must not style legacy classes.",
                `Found in: ${offenders.join(", ")}`
            ].join("\n")
        ).toStrictEqual([]);
    });

    it("keeps the adapters opt-in (never imported by a foundation entry)", () => {
        for (const entry of [
            "index.css",
            "tokens.css",
            "themes.css",
            "base.css",
            "utilities.css"
        ]) {
            const cssCode = stripComments(readStylesheet(entry));

            expect(cssCode, `${entry} must not pull a Tailwind adapter`).not.toContain("adapters/");
        }
    });

    it("keeps the token entry free of any global reset or element styling", () => {
        const tokensEntry = stripComments(readStylesheet("tokens.css"));

        const importedFiles = Array.from(
            tokensEntry.matchAll(/@import url\(["']?([^"')]+)["']?\)/g),
            match => match[1]
        );

        expect(importedFiles).toStrictEqual(["./foundation/tokens.css", "./themes/light.css"]);

        // Rules are restricted to custom-property declarations on :root / theme
        // selectors: importing tokens must never restyle the host application.
        const elementSelectors = Array.from(
            tokensEntry.matchAll(/^\s*([a-zA-Z][\w-]*)\s*(?:,|\{)/gm)
        )
            .map(match => match[1])
            .filter(selector => !["root", "media"].includes(selector));

        expect(
            elementSelectors,
            `The tokens entry must only expose variables, found element rules: ${elementSelectors.join(", ")}`
        ).toStrictEqual([]);
    });

    it("documents both theme activation conventions in the dark theme", () => {
        const darkTheme = readStylesheet("themes/dark.css");

        expect(darkTheme).toContain('[data-sge-theme="dark"]');

        // Legacy selectors are honored for existing consumers, and documented as such.
        expect(darkTheme).toContain('[data-fr-theme="dark"]');
        expect(darkTheme).toContain(".dark");
    });

    it("reduces every institutional transition when motion is reduced", () => {
        const motion = stripComments(readStylesheet("foundation/motion.css"));
        const accessibility = stripComments(readStylesheet("base/accessibility.css"));

        expect(motion).toContain("@media (prefers-reduced-motion: reduce)");
        expect(accessibility).toContain("@media (prefers-reduced-motion: reduce)");
        expect(accessibility).toContain("transition-duration: 0.01ms !important");
        expect(accessibility).toContain("animation-duration: 0.01ms !important");
    });
});
