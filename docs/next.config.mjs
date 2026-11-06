import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/*
 * Two build targets share this config:
 *
 *   NEXT_OUTPUT=standalone (default) -> a Node server (next start).
 *   NEXT_OUTPUT=export              -> static hosting under `out/`.
 *
 * `output: "export"` does not support `redirects` or image optimization, so the
 * two modes diverge here rather than in CI.
 */
const isStaticExport = process.env.NEXT_OUTPUT === "export";

/** Optional path prefix for static hosting under a subpath. */
const basePath = process.env.NEXT_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	output: isStaticExport ? "export" : "standalone",
	basePath,
	images: {
		...(isStaticExport ? { unoptimized: true } : {}),
	},
	// Directory indexes make deep links work on static hosts that do not perform
	// Next.js route resolution.
	...(isStaticExport ? { trailingSlash: true } : {}),
};

export default withMDX(config);
