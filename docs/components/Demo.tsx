"use client";

import type { CSSProperties, ReactNode } from "react";

const frame: CSSProperties = {
	marginBlock: "var(--sge-space-5)",
	border: "1px solid var(--sge-color-border)",
	borderRadius: "var(--sge-radius-large)",
	backgroundColor: "var(--sge-color-surface)",
	padding: "var(--sge-space-6)",
	display: "flex",
	flexWrap: "wrap",
	alignItems: "center",
	gap: "var(--sge-space-4)",
};

const labelStyle: CSSProperties = {
	marginBlockEnd: "var(--sge-space-2)",
	fontSize: "var(--sge-font-size-xs)",
	fontWeight: "var(--sge-font-weight-semibold)",
	letterSpacing: "0.05em",
	textTransform: "uppercase",
	color: "var(--sge-color-text-muted)",
};

/**
 * Interactive demo frame.
 *
 * The frame itself is documentation chrome, expressed with the SDS token
 * variables. Its children are imported from `@skygenesisenterprise/react-sds`
 * in the MDX file, so every preview runs the real component.
 */
export function Demo({
	children,
	label,
	direction = "row",
}: {
	children: ReactNode;
	/** Optional caption shown above the preview. */
	label?: string;
	direction?: "row" | "column";
}) {
	return (
		<div>
			{label !== undefined && <p style={labelStyle}>{label}</p>}
			<div
				style={
					direction === "column"
						? { ...frame, flexDirection: "column", alignItems: "stretch" }
						: frame
				}
			>
				{children}
			</div>
		</div>
	);
}
