/**
 * Codemod — ADS → SDS package/identity rename.
 *
 * Part of the `@codegouvaor/react-ads` → `@skygenesisenterprise/react-sds` migration
 * (see SDS_MIGRATION.md, stage S1). It is intentionally a *mechanical* transformation:
 * only package names, organisation/repository slugs and CLI/product name occurrences are
 * rewritten. Public API symbols, CSS class names and the `fr`/`ads` namespaces are NOT
 * touched here (they are handled additively in later stages).
 *
 * Usage:
 *
 *     pnpm exec ts-node -T scripts/codemod/rename-ads-to-sds.ts            # apply
 *     pnpm exec ts-node -T scripts/codemod/rename-ads-to-sds.ts --dry-run  # preview
 */

import * as fs from "fs";
import * as path from "path";

const projectRoot = path.join(__dirname, "..", "..");

const dryRun = process.argv.slice(2).includes("--dry-run");

const RENAME_EXTENSIONS = new Set([
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
    ".txt",
    ".snap"
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

const IGNORED_FILE_NAMES = new Set([
    "pnpm-lock.yaml",
    "yarn.lock",
    "package-lock.json"
]);

/**
 * Historical / provenance documents: the fork lineage must stay truthful, so their
 * `codegouvaor` references are updated deliberately in the documentation stage, not by
 * the mechanical codemod. The codemod itself is skipped so it keeps working on re-runs.
 */
const IGNORED_RELATIVE_PATHS = new Set([
    "AUDIT.md",
    "MIGRATION.md",
    "PROVENANCE.md",
    "CHANGELOG.md",
    "SDS_MIGRATION.md"
]);

/**
 * Ordered replacements. Longest / most specific first so that
 * `@codegouvaor/react-ads` is fully rewritten before the bare scope rule runs.
 */
const REPLACEMENTS: [RegExp, string][] = [
    [/@codegouvaor\/react-ads/g, "@skygenesisenterprise/react-sds"],
    [/codegouvaor\/react-ads/g, "skygenesisenterprise/react-sds"],
    [/@codegouvaor\b/g, "@skygenesisenterprise"],
    [/\bcodegouvaor\b/g, "skygenesisenterprise"],
    [/\breact-ads\b/g, "react-sds"]
];

function shouldProcess(filePath: string): boolean {
    const base = path.basename(filePath);
    const relativePath = path.relative(projectRoot, filePath);
    if (IGNORED_FILE_NAMES.has(base) || IGNORED_RELATIVE_PATHS.has(relativePath)) {
        return false;
    }
    if (relativePath.startsWith(path.join("scripts", "codemod"))) {
        return false;
    }
    return RENAME_EXTENSIONS.has(path.extname(base).toLowerCase());
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
let totalReplacements = 0;

walk(projectRoot, filePath => {
    if (!shouldProcess(filePath)) {
        return;
    }

    const original = fs.readFileSync(filePath, "utf8");
    let updated = original;
    let fileReplacements = 0;

    for (const [pattern, replacement] of REPLACEMENTS) {
        updated = updated.replace(pattern, match => {
            fileReplacements += match.length > 0 ? 1 : 0;
            return replacement;
        });
    }

    if (updated === original) {
        return;
    }

    changedFiles.push(path.relative(projectRoot, filePath));
    totalReplacements += fileReplacements;

    if (!dryRun) {
        fs.writeFileSync(filePath, updated, "utf8");
    }
});

// eslint-disable-next-line no-console
console.log(
    `${dryRun ? "[dry-run] " : ""}${changedFiles.length} file(s), ${totalReplacements} replacement(s)`
);

for (const filePath of changedFiles.sort()) {
    // eslint-disable-next-line no-console
    console.log(`  ${filePath}`);
}
