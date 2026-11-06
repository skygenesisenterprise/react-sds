import { getLLMText, source } from "@/lib/source";

export const dynamic = "force-static";

/** `/llms-full.txt` — the full documentation as a single Markdown document. */
export async function GET() {
	const scan = source.getPages().map(getLLMText);
	const scanned = await Promise.all(scan);

	return new Response(scanned.join("\n\n---\n\n"), {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
}
