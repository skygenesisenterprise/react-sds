"use client";

import { Button } from "@skygenesisenterprise/react-sds/Button";
import { useState } from "react";

/**
 * Copies the current page as Markdown (the `processed` MDX content served by
 * the docs source). Uses the public `Button` export of React SDS.
 */
export function CopyMarkdownButton({ markdown }: { markdown: string }) {
	const [copied, setCopied] = useState(false);

	return (
		<Button
			priority="tertiary no outline"
			size="small"
			style={{
				border: "1px solid var(--sge-color-border)",
				borderRadius: "var(--sge-radius-medium)",
				backgroundColor: "transparent",
				color: "var(--sge-color-text-muted)",
				whiteSpace: "nowrap",
			}}
			onClick={async () => {
				await navigator.clipboard.writeText(markdown);
				setCopied(true);
				setTimeout(() => setCopied(false), 1500);
			}}
		>
			{copied ? "Copied" : "Copy as Markdown"}
		</Button>
	);
}
