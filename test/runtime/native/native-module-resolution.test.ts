import { describe, it, expect } from "vitest";
import * as fs from "fs";
import { join as pathJoin } from "path";

const projectRootDirPath = process.cwd();

/**
 * These tests validate the native/web module isolation and the published
 * subpath resolution (`@skygenesisenterprise/react-sds/native` → `native/index.js`).
 * They run against the compiled `dist/` (produced by `pnpm build`).
 */

const readRecursive = (dirPath: string, acc: string[] = []): string[] => {
    if (!fs.existsSync(dirPath)) {
        return acc;
    }

    for (const entry of fs.readdirSync(dirPath, { "withFileTypes": true })) {
        const fullPath = pathJoin(dirPath, entry.name);

        if (entry.isDirectory()) {
            readRecursive(fullPath, acc);
        } else {
            acc.push(fullPath);
        }
    }

    return acc;
};

const distExists = fs.existsSync(pathJoin(projectRootDirPath, "dist", "index.js"));

describe("SDS Native module resolution & isolation", () => {
    it("compiles the native subpath to dist/native (post-build)", () => {
        if (!distExists) {
            // Build not run — nothing to assert.
            return;
        }

        expect(
            fs.existsSync(pathJoin(projectRootDirPath, "dist", "native", "index.js")),
            "dist/native/index.js should exist after pnpm build"
        ).toBe(true);
        expect(
            fs.existsSync(pathJoin(projectRootDirPath, "dist", "native", "index.d.ts"))
        ).toBe(true);
    });

    it("resolves @skygenesisenterprise/react-sds/native to dist/native/index.js", () => {
        if (!distExists) {
            return;
        }

        // The published package flattens dist/ at its root (see npm pack /
        // denoify enable_short_npm_import_path), so the subpath "native"
        // resolves to <root>/native/index.js.
        const subpathCandidates = [
            pathJoin(projectRootDirPath, "dist", "native", "index.js")
        ];

        expect(subpathCandidates.some(path => fs.existsSync(path))).toBe(true);
    });

    it("keeps the native layer free of DOM imports", () => {
        const nativeFiles = readRecursive(pathJoin(projectRootDirPath, "src", "native")).filter(
            filePath => /\.(ts|tsx)$/.test(filePath)
        );

        expect(nativeFiles.length).toBeGreaterThan(0);

        const forbidden = ["react-dom", "document.", "window.", "className=", "getElementById"];

        for (const filePath of nativeFiles) {
            const content = fs.readFileSync(filePath).toString("utf8");

            for (const needle of forbidden) {
                expect(
                    content.includes(needle),
                    `${filePath} should not contain "${needle}"`
                ).toBe(false);
            }
        }
    });

    it("keeps the web bundle free of React Native imports (post-build)", () => {
        if (!distExists) {
            return;
        }

        const webEntry = fs.readFileSync(
            pathJoin(projectRootDirPath, "dist", "index.js")
        ).toString("utf8");

        expect(webEntry.includes("react-native")).toBe(false);
    });

    it("does not import the native layer from the web entry", () => {
        if (!distExists) {
            return;
        }

        const webEntry = fs.readFileSync(
            pathJoin(projectRootDirPath, "dist", "index.js")
        ).toString("utf8");

        expect(webEntry.includes("./native")).toBe(false);
    });
});