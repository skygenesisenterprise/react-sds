"use client";

import Link from "next/link";
import { useEffect } from "react";
import { SDSContainer, SDSHeading, SDSLink, SDSStack, SDSText } from "@skygenesisenterprise/react-sds";
import type { CSSProperties } from "react";

const DESTINATION = "/docs/core";

const page: CSSProperties = {
	minHeight: "100vh",
	display: "flex",
	alignItems: "center",
	background: "var(--sge-color-background)",
};

/**
 * Inherited entry behaviour of the documentation client: `/` sends the reader
 * to the Core module. Kept as a client redirect with a static fallback so it
 * works both on the Node server and in a static export.
 */
export default function Page() {
	useEffect(() => {
		window.location.replace(DESTINATION);
	}, []);

	return (
		<main style={page}>
			<meta httpEquiv="refresh" content={`0;url=${DESTINATION}`} />
			<SDSContainer size="narrow">
				<SDSStack gap={4}>
					<SDSHeading level={1}>React SDS documentation</SDSHeading>
					<SDSText color="muted">
						The documentation opens on the Core module.
					</SDSText>
					<SDSLink href={DESTINATION} variant="action">
						Continue to Core
					</SDSLink>
					<SDSText size="sm" color="muted">
						Core covers installation and usage, API is the generated reference, CLI documents
						the package commands.
					</SDSText>
				</SDSStack>
			</SDSContainer>
		</main>
	);
}
