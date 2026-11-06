"use client";

import { useDocsSearch } from "fumadocs-core/search/client";
import {
	SearchDialog,
	SearchDialogClose,
	SearchDialogContent,
	SearchDialogFooter,
	SearchDialogHeader,
	SearchDialogIcon,
	SearchDialogInput,
	SearchDialogList,
	SearchDialogOverlay,
	type SharedProps,
	TagsList,
	TagsListItem,
} from "fumadocs-ui/components/dialog/search";
import { useState } from "react";

/**
 * Inherited docs-client search dialog, kept with its module filter.
 *
 * The tag is the first segment of the page slug (core, api or cli), produced by
 * app/api/search/route.ts. Under a static export there is no server to query, so
 * the prebuilt index is downloaded and searched in the browser.
 */
export default function CustomSearchDialog(props: SharedProps) {
	const [tag, setTag] = useState<string | undefined>("all");
	const tagFilter = tag === "all" ? undefined : tag;
	const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

	const { search, setSearch, query } = useDocsSearch(
		process.env.NEXT_PUBLIC_DOCS_OUTPUT === "export"
			? {
					type: "static",
					tag: tagFilter,
					from: `${basePath}/api/search`,
				}
			: { type: "fetch", tag: tagFilter },
	);

	return (
		<SearchDialog
			search={search}
			onSearchChange={setSearch}
			isLoading={query.isLoading}
			{...props}
		>
			<SearchDialogOverlay />
			<SearchDialogContent>
				<SearchDialogHeader>
					<SearchDialogIcon />
					<SearchDialogInput />
					<SearchDialogClose />
				</SearchDialogHeader>
				<SearchDialogList items={query.data !== "empty" ? query.data : null} />
				<SearchDialogFooter>
					<TagsList tag={tag} onTagChange={setTag}>
						<TagsListItem value="all">All</TagsListItem>
						<TagsListItem value="core">Core</TagsListItem>
						<TagsListItem value="api">API</TagsListItem>
						<TagsListItem value="cli">CLI</TagsListItem>
					</TagsList>
				</SearchDialogFooter>
			</SearchDialogContent>
		</SearchDialog>
	);
}
