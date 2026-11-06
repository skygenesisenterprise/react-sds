import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_DOCS_URL ?? "https://skygenesisenterprise.github.io/react-sds";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: `${siteUrl}/sitemap.xml`,
	};
}
