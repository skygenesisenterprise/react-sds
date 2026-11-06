#!/usr/bin/env node
/**
 * Documentation checks for the React SDS portal.
 *
 * Verifies, without rendering the site:
 *   - every MDX page has a title and a description;
 *   - no page is empty or a stub;
 *   - every `meta.json` entry resolves to a page or a directory;
 *   - every internal /docs link resolves to a page;
 *   - no residual reference to the previous documentation platform;
 *   - every `@skygenesisenterprise/react-sds` import used in an example exists
 *     in the package exports map (subpaths) or in the root declarations (names).
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const docsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(docsDir, "..");
const contentDir = path.join(docsDir, "content/docs");
const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));

const errors = [];
const warnings = [];

/** @param {string} dir */
function walk(dir) {
	const out = [];
	for (const name of fs.readdirSync(dir)) {
		const file = path.join(dir, name);
		const stat = fs.statSync(file);
		if (stat.isDirectory()) out.push(...walk(file));
		else out.push(file);
	}
	return out;
}

const files = walk(contentDir);
const mdxFiles = files.filter((file) => file.endsWith(".mdx"));
const metaFiles = files.filter((file) => file.endsWith("meta.json"));

/** Route slug of a content file: `core/index.mdx` → `core`. */
function slugOf(file) {
	const relative = path.relative(contentDir, file).replace(/\\/g, "/");
	if (relative === "index.mdx") return "";
	const withoutExt = relative.replace(/\.mdx$/, "");
	return withoutExt.replace(/\/index$/, "");
}

const routes = new Set(mdxFiles.map(slugOf));

/** Frontmatter: only the flat `key: value` shape this repository uses. */
function frontmatter(source) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
	if (!match) return { data: {}, body: source };
	const data = {};
	for (const line of match[1].split("\n")) {
		const m = /^([a-zA-Z-]+):\s*(.*)$/.exec(line.trim());
		if (!m) continue;
		data[m[1]] = m[2].replace(/^["']|["']$/g, "");
	}
	return { data, body: source.slice(match[0].length) };
}

const pages = new Map();
for (const file of mdxFiles) {
	const source = fs.readFileSync(file, "utf8");
	const { data, body } = frontmatter(source);
	const relative = path.relative(docsDir, file);

	if (!data.title) errors.push(`${relative}: missing frontmatter title`);
	if (!data.description) errors.push(`${relative}: missing frontmatter description`);
	if (body.trim().length < 250) errors.push(`${relative}: page body is too short (stub)`);
	if (/\bTODO\b|\bTBD\b/.test(body)) warnings.push(`${relative}: contains TODO/TBD`);

	pages.set(slugOf(file), { file, body, data });
}

// ---------------------------------------------------------------------------
// meta.json
// ---------------------------------------------------------------------------
for (const file of metaFiles) {
	const relative = path.relative(docsDir, file);
	let json;
	try {
		json = JSON.parse(fs.readFileSync(file, "utf8"));
	} catch (error) {
		errors.push(`${relative}: invalid JSON (${error.message})`);
		continue;
	}
	const dir = path.dirname(file);
	for (const entry of json.pages ?? []) {
		const name = typeof entry === "string" ? entry : entry?.path ?? "";
		if (name.startsWith("---") || name.startsWith("...")) continue;
		const target = path.join(dir, name);
		const exists =
			fs.existsSync(`${target}.mdx`) || fs.existsSync(target) || (name === "index" && fs.existsSync(path.join(dir, "index.mdx")));
		if (!exists) errors.push(`${relative}: page "${name}" does not exist`);
	}
}

// ---------------------------------------------------------------------------
// Internal links
// ---------------------------------------------------------------------------
const linkPattern = /(?:href=|\]\()\s*["']?(\/docs[/\w#?=.%-]*)/g;
for (const [slug, page] of pages) {
	const relative = path.relative(docsDir, page.file);
	for (const match of page.body.matchAll(linkPattern)) {
		const url = match[1].replace(/[)"']+$/, "");
		const withoutHash = url.split("#")[0].split("?")[0].replace(/\/$/, "");
		const target = withoutHash.replace(/^\/docs\/?/, "");
		if (target === "") continue;
		if (!routes.has(target)) errors.push(`${relative}: broken link ${url}`);
	}
}

// ---------------------------------------------------------------------------
// Residual platform references
// ---------------------------------------------------------------------------
const FORBIDDEN = [/notploy/i, /dokploy/i];
const allDocsFiles = files.filter(
	(file) => /\.(mdx|json|ts|tsx|css|mjs|svg|md)$/.test(file) || file.endsWith("README.md"),
);
for (const file of allDocsFiles) {
	const source = fs.readFileSync(file, "utf8");
	for (const pattern of FORBIDDEN) {
		if (pattern.test(source)) errors.push(`${path.relative(docsDir, file)}: residual reference ${pattern}`);
	}
}
// The app shell and scripts are part of the portal too.
for (const dir of ["app", "components", "lib", "scripts"]) {
	const base = path.join(docsDir, dir);
	if (!fs.existsSync(base)) continue;
	for (const file of walk(base)) {
		if (!/\.(tsx?|mjs|css|json)$/.test(file)) continue;
		// This script necessarily contains the forbidden patterns it searches for.
		if (path.basename(file) === "check-docs.mjs") continue;
		const source = fs.readFileSync(file, "utf8");
		for (const pattern of FORBIDDEN) {
			if (pattern.test(source)) errors.push(`${path.relative(docsDir, file)}: residual reference ${pattern}`);
		}
	}
}

// ---------------------------------------------------------------------------
// Example imports
// ---------------------------------------------------------------------------
const exportsMap = pkg.exports ?? {};

// Root export names come from the declarations the package publishes, resolved by
// the TypeScript compiler (which follows `export * from` chains for us).
const ts = require("typescript");
const indexPath = path.join(repoRoot, "dist/index.d.ts");
const program = ts.createProgram([indexPath], {
	noEmit: true,
	skipLibCheck: true,
	moduleResolution: ts.ModuleResolutionKind.NodeJs,
	target: ts.ScriptTarget.ES2019,
});
const checker = program.getTypeChecker();
const indexSource = program.getSourceFile(indexPath);
const indexSymbol = indexSource ? checker.getSymbolAtLocation(indexSource) : undefined;
const rootNames = new Set(
	indexSymbol ? checker.getExportsOfModule(indexSymbol).map((symbol) => symbol.getName()) : [],
);

const importPattern =
	/import\s+(type\s+)?([^;]+?)\s+from\s+["']@skygenesisenterprise\/react-sds(?:\/([^"']+))?["']/g;
for (const [slug, page] of pages) {
	const relative = path.relative(docsDir, page.file);
	for (const match of page.body.matchAll(importPattern)) {
		const clause = match[2].trim();
		const subpath = match[3];
		if (subpath !== undefined && subpath !== "") {
			const key = `./${subpath}`;
			if (!(key in exportsMap)) {
				errors.push(`${relative}: import subpath "${key}" is not in the package exports`);
			}
			continue;
		}
		const braces = /\{([\s\S]*?)\}/.exec(clause);
		const names = braces
			? braces[1]
					.split(",")
					.map((part) => part.trim().split(/\s+as\s+/)[0].trim())
					.filter(Boolean)
			: [];
		for (const name of names) {
			if (name === "type" || name === "") continue;
			if (!rootNames.has(name)) {
				errors.push(`${relative}: "${name}" is not exported by the package root`);
			}
		}
	}
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
for (const warning of warnings) console.warn(`warning: ${warning}`);
if (errors.length > 0) {
	console.error(`\n${errors.length} documentation error(s):`);
	for (const error of errors) console.error(`  ${error}`);
	process.exit(1);
}
console.log(`Documentation OK — ${pages.size} pages, ${metaFiles.length} navigation files.`);
