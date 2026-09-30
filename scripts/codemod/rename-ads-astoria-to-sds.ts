/**
 * Codemod — remove every ADS / Astoria reference from the source tree.
 *
 * Second, deeper pass of the `@skygenesisenterprise/react-sds` migration. Unlike
 * `rename-ads-to-sds.ts` (package names only), this rewrites *code* and *content*:
 *
 *   - Astoria branding        → SGE / Sky Genesis Enterprise
 *   - `ADS*` / `Ads*` symbols → `SDS*` / `Sds*`
 *   - `ads*` identifiers      → `sds*`
 *   - `--ads-*` CSS variables → `--sds-*`
 *   - `ads-*` class names     → `sds-*`
 *   - `ads/…` import paths    → `sds/…`
 *
 * File and directory names are renamed separately (git mv) — see the migration
 * commands. Public API behaviour is preserved; only names change.
 *
 * Usage:
 *
 *     pnpm exec ts-node -T scripts/codemod/rename-ads-astoria-to-sds.ts
 */

import * as fs from "fs";
import * as path from "path";

const projectRoot = path.join(__dirname, "..", "..");

const dryRun = process.argv.slice(2).includes("--dry-run");

const EXTENSIONS = new Set([
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".json",
    ".md",
    ".mdx",
    ".yaml",
    ".yml",
    ".css",
    ".scss",
    ".html",
    ".txt"
]);

const IGNORED_DIR_NAMES = new Set([
    "node_modules",
    ".git",
    "dist",
    "dsfr",
    "coverage",
    "build_storybook",
    ".next",
    ".cache"
]);

const IGNORED_FILE_NAMES = new Set(["pnpm-lock.yaml", "yarn.lock", "package-lock.json"]);

/** Ordered: longest / most specific first. */
const REPLACEMENTS: [RegExp, string][] = [
    // --- Astoria branding -------------------------------------------------------
    [/Astoria Design System \(ADS\)/g, "Sky Genesis Enterprise Design System (SDS)"],
    [/Astoria Design System/g, "Sky Genesis Enterprise Design System"],
    [/Astoria design system/g, "Sky Genesis Enterprise design system"],
    [/Republic of Astoria/g, "Sky Genesis Enterprise"],
    [/Astorian/g, "SGE"],
    [/\bastoria-gouv\b/g, "sge-gouv"],
    [/\bastoria-identity\b/g, "sge-identity"],
    [/\bastoriaGouvImgUrl\b/g, "sgeGouvImgUrl"],
    [/\bastoriaGouvPngUrl\b/g, "sgeGouvPngUrl"],
    [/Astoria/g, "SGE"],
    [/astoria/g, "sge"],

    // --- import paths / directory segments -------------------------------------
    [/assets\/ads\//g, "assets/sds/"],
    [/(["'`/])ads\//g, "$1sds/"],
    [/(["'`/])ads\b/g, "$1sds"],

    // --- CSS custom properties and class names ----------------------------------
    [/--ads-/g, "--sds-"],
    [/\bads-/g, "sds-"],

    // --- identifiers ------------------------------------------------------------
    [/\bads([A-Z])/g, "sds$1"],
    [/\bADS([A-Z])/g, "SDS$1"],
    [/([a-z])ADS([A-Z])/g, "$1SDS$2"],
    [/([a-z])ADS\b/g, "$1SDS"],
    [/\bADS\b/g, "SDS"],
    [/ADS_/g, "SDS_"],
    [/\bAds([A-Z])/g, "Sds$1"],
    [/\bads\b/g, "sds"],

    // --- leftover org / product names (historical docs included) ----------------
    [/@codegouvaor\b/g, "@skygenesisenterprise"],
    [/\bcodegouvaor\b/g, "skygenesisenterprise"],
    [/\breact-ads\b/g, "react-sds"],

    // --- literal prefix string --------------------------------------------------
    [/"ads"/g, "\"sds\""],
    [/'ads'/g, "'sds'"]
];

function shouldProcess(filePath: string): boolean {
    const base = path.basename(filePath);
    const relativePath = path.relative(projectRoot, filePath);
    if (IGNORED_FILE_NAMES.has(base)) {
        return false;
    }
    if (relativePath.startsWith(path.join("scripts", "codemod"))) {
        return false;
    }
    return EXTENSIONS.has(path.extname(base).toLowerCase());
}

function walk(dirPath: string, onFile: (filePath: string) => void): void {
    for (const entry of fs.readdirSync(dirPath, { "withFileTypes": true })) {
        if (entry.isDirectory()) {
            if (IGNORED_DIR_NAMES.has(entry.name)) {
                continue;
            }
            walk(path.join(dirPath, entry.name), onFile);
        } else if (entry.isFile()) {
            onFile(path.join(dirPath, entry.name));
        }
    }
}

const changedFiles: string[] = [];

walk(projectRoot, filePath => {
    if (!shouldProcess(filePath)) {
        return;
    }

    const original = fs.readFileSync(filePath, "utf8");
    let updated = original;
    for (const [pattern, replacement] of REPLACEMENTS) {
        updated = updated.replace(pattern, replacement);
    }

    if (updated === original) {
        return;
    }

    changedFiles.push(path.relative(projectRoot, filePath));
    if (!dryRun) {
        fs.writeFileSync(filePath, updated, "utf8");
    }
});

// eslint-disable-next-line no-console
console.log(`${dryRun ? "[dry-run] " : ""}${changedFiles.length} file(s) updated`);
