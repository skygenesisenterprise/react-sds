import { source } from "@/lib/source";
import { libraryVersion } from "@/lib/library-version";

export const dynamic = "force-static";

/**
 * `/llms.txt` — a compact map of the documentation for language models and
 * agents. Generated from the MDX tree so it cannot go stale.
 */
export async function GET() {
	const pages = source.getPages();

	const sections = ["core", "api", "cli"].map((module) => {
		const modulePages = pages.filter((page) => page.slugs[0] === module);
		const lines = modulePages
			.map((page) => `- [${page.data.title}](${page.url}): ${page.data.description ?? ""}`)
			.join("\n");
		return `## ${module.toUpperCase()}\n\n${lines}`;
	});

	return new Response(
		`# React SDS documentation

> Official developer documentation for @skygenesisenterprise/react-sds, the Sky Genesis Enterprise React design system (package v${libraryVersion}).

This documentation is organised in three modules: Core (usage), API (exhaustive reference generated from the package TypeScript declarations) and CLI (commands shipped with the package).

${sections.join("\n\n")}

## Sources

- Repository: https://github.com/skygenesisenterprise/react-sds
- Package: https://www.npmjs.com/package/@skygenesisenterprise/react-sds
`,
		{
			headers: { "Content-Type": "text/plain; charset=utf-8" },
		},
	);
}
