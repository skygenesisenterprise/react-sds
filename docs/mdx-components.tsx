import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Steps, Step } from "fumadocs-ui/components/steps";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Demo } from "@/components/Demo";
import { TokenTable } from "@/components/TokenTable";

/**
 * MDX component map.
 *
 * Prose (headings, paragraphs, lists, tables) keeps the Fumadocs MDX components
 * because they carry the heading anchors the table of contents depends on; they
 * are restyled by the SDS typography foundation loaded in app/layout.tsx.
 * Everything added here is either generic MDX sugar (Callout, Tabs, Steps) or a
 * documentation-only helper (Demo, TokenTable).
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		Callout,
		Tab,
		Tabs,
		Steps,
		Step,
		Demo,
		TokenTable,
		...components,
	};
}
