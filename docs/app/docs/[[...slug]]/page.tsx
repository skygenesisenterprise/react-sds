import { getPageImage, getLLMText, source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { CopyMarkdownButton } from "@/components/CopyMarkdownButton";
import { SDSHeading } from "@skygenesisenterprise/react-sds/sds/typography/SDSHeading";
import { DocsBody, DocsDescription, DocsPage } from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const MDX = page.data.body;
	const markdown = await getLLMText(page);

	const cardStyle: CSSProperties = {
		width: "100%",
		maxWidth: page.data.full ? "72rem" : "56rem",
		minHeight: "calc(100vh - 2rem)",
		marginBlock: "1rem",
		padding:
			"clamp(1.5rem, 2.5vw, 2.75rem) clamp(1.25rem, 4vw, 3.5rem)",
		border: "1px solid var(--sge-color-border)",
		borderRadius: "var(--sge-radius-large)",
		backgroundColor: "var(--sge-color-card)",
	};

	return (
		<DocsPage toc={page.data.toc} full={page.data.full} style={cardStyle}>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					alignItems: "center",
					justifyContent: "space-between",
					gap: "var(--sge-space-3)",
				}}
			>
				<SDSHeading
					level={1}
					style={{
						margin: 0,
						fontSize: "1.875rem",
						lineHeight: 1.2,
						letterSpacing: "-0.02em",
						fontWeight: 600,
					}}
				>
					{page.data.title}
				</SDSHeading>
				<CopyMarkdownButton markdown={markdown} />
			</div>
			<DocsDescription>{page.data.description}</DocsDescription>
			<DocsBody>
				<MDX
					components={getMDXComponents({
						// this allows you to link to other pages with relative file paths
						a: createRelativeLink(source, page),
					})}
				/>
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(
	props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	return {
		title: page.data.title,
		description: page.data.description,
		alternates: { canonical: page.url },
		openGraph: {
			images: getPageImage(page).url,
		},
	};
}
