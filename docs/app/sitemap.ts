import { source } from "@/lib/source";
import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_DOCS_URL ?? "https://skygenesisenterprise.github.io/react-sds";

export default function sitemap(): MetadataRoute.Sitemap {
	const pages = source.getPages().map((page) => ({
		url: `${siteUrl}${page.url}`,
		lastModified: new Date(),
		changeFrequency: "weekly" as const,
		priority: page.slugs.length === 1 ? 0.8 : 0.6,
	}));

	return [
		{
			url: siteUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		...pages,
	];
}
