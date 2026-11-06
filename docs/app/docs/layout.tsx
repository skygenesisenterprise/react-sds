import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { getLayoutTabs } from "fumadocs-ui/layouts/shared";
import type { ReactNode } from "react";

function SectionIcon({ children }: { children: ReactNode }) {
	return (
		<			svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			{children}
		</svg>
	);
}

const sectionIcons: Record<string, ReactNode> = {
	core: (
		<SectionIcon>
			<path d="m12 2 9 5-9 5-9-5 9-5Z" />
			<path d="m3 12 9 5 9-5" />
			<path d="m3 17 9 5 9-5" />
		</SectionIcon>
	),
	api: (
		<SectionIcon>
			<path d="M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1" />
			<path d="M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1" />
		</SectionIcon>
	),
	cli: (
		<SectionIcon>
			<path d="m4 17 6-6-6-6" />
			<path d="M12 19h8" />
		</SectionIcon>
	),
};

const sectionDescriptions: Record<string, string> = {
	core: "Installation, foundations, components and recipes",
	api: "Every public export, hook, token and type",
	cli: "Optimise CSS, copy assets and refresh icons",
};

const tabs = getLayoutTabs(source.pageTree, {
	transform: (tab) => {
		const section = String(tab.title).toLowerCase();

		return {
			...tab,
			icon: sectionIcons[section],
			description: tab.description ?? sectionDescriptions[section],
		};
	},
});

export default function Layout({ children }: LayoutProps<"/docs">) {
	return (
		<DocsLayout
			tree={source.pageTree}
			{...baseOptions()}
			tabs={tabs}
			sidebar={{
				defaultOpenLevel: 1,
				style: { borderInlineEndColor: "transparent" },
			}}
		>
			{children}
		</DocsLayout>
	);
}
