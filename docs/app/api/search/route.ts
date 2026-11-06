import { source } from "@/lib/source";
import {
	createFromSource,
	initAdvancedSearch,
} from "fumadocs-core/search/server";
import type { InferPageType } from "fumadocs-core/source";

type Page = InferPageType<typeof source>;

// The first slug segment is the documentation module (core, api or cli); it is
// exposed as a search tag so the dialog can filter by module.
function buildIndex(page: Page) {
	return {
		id: page.url,
		title: page.data.title,
		description: page.data.description,
		url: page.url,
		structuredData: page.data.structuredData,
		tag: page.slugs[0] ?? "all",
	} as any;
}

export const dynamic = "force-static";

const isStaticExport = process.env.NEXT_OUTPUT === "export";

// Under `output: "export"` there is no server, so the index is emitted at build
// time and searched in the browser. The standalone server keeps the runtime
// handler.
const staticSearch = initAdvancedSearch({
	language: "english",
	indexes: source.getPages().map(buildIndex),
});

const staticHandler = async () => Response.json(await staticSearch.export());

const { GET: runtimeHandler } = createFromSource(source, {
	language: "english",
	buildIndex,
});

export const GET: (request: Request) => Promise<Response> = isStaticExport
	? async () => staticHandler()
	: runtimeHandler;
