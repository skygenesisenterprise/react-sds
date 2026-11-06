"use client";

import { useSearchContext } from "fumadocs-ui/contexts/search";
import type {
	FullSearchTriggerProps,
	SearchTriggerProps,
} from "fumadocs-ui/layouts/shared/slots/search-trigger";
import type { CSSProperties } from "react";

const fullStyle: CSSProperties = {
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
	width: "100%",
	height: "1.875rem",
	padding: "0 0.6875rem",
	border: "1px solid var(--sge-color-border)",
	borderRadius: "var(--sge-radius-medium)",
	backgroundColor: "var(--sge-color-card)",
	color: "var(--sge-color-text-muted)",
	fontSize: "var(--sge-font-size-sm)",
	textAlign: "left",
	cursor: "pointer",
};

const smallStyle: CSSProperties = {
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	width: "2rem",
	height: "2rem",
	border: "1px solid var(--sge-color-border)",
	borderRadius: "var(--sge-radius-medium)",
	backgroundColor: "var(--sge-color-card)",
	color: "var(--sge-color-text-muted)",
	cursor: "pointer",
};

const shortcutStyle: CSSProperties = {
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	minWidth: "1.25rem",
	height: "1.25rem",
	padding: "0 0.25rem",
	border: "1px solid var(--sge-color-border)",
	borderRadius: "var(--sge-radius-small)",
	backgroundColor: "var(--sge-color-background)",
	color: "var(--sge-color-text-muted)",
	fontFamily: "var(--sge-font-family-mono)",
	fontSize: "0.6875rem",
	lineHeight: 1,
};

function SearchIcon({ size = 16 }: { size?: number }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="11" cy="11" r="7" />
			<path d="m20 20-3.5-3.5" />
		</svg>
	);
}

/** Full-width search field displayed at the top of the docs sidebar. */
export function DocsSearchTriggerFull({
	hideIfDisabled,
	style,
	...props
}: FullSearchTriggerProps) {
	const { enabled, hotKey, setOpenSearch } = useSearchContext();

	if (hideIfDisabled && !enabled) return null;

	return (
		<button
			type="button"
			aria-label="Open search"
			{...props}
			disabled={!enabled}
			onClick={() => setOpenSearch(true)}
			style={{ ...fullStyle, ...style }}
		>
			<SearchIcon />
			<span>Search</span>
			<span
				style={{
					display: "inline-flex",
					gap: "0.25rem",
					marginInlineStart: "auto",
				}}
			>
				{hotKey.map((key, index) => (
					<kbd key={index} style={shortcutStyle}>
						{key.display}
					</kbd>
				))}
			</span>
		</button>
	);
}

/** Compact icon-only variant used by the mobile header. */
export function DocsSearchTriggerSmall({
	hideIfDisabled,
	style,
	color: _color,
	variant: _variant,
	size: _size,
	...props
}: SearchTriggerProps) {
	const { enabled, setOpenSearch } = useSearchContext();

	if (hideIfDisabled && !enabled) return null;

	return (
		<button
			type="button"
			aria-label="Open search"
			{...props}
			disabled={!enabled}
			onClick={() => setOpenSearch(true)}
			style={{ ...smallStyle, ...style }}
		>
			<SearchIcon size={18} />
		</button>
	);
}
