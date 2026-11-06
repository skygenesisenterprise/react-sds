"use client";

import { sdsTokens } from "@skygenesisenterprise/react-sds/sds/tokens";
import type { CSSProperties } from "react";

const tableStyle: CSSProperties = {
	width: "100%",
	borderCollapse: "collapse",
	fontSize: "var(--sge-font-size-sm)",
};

const cellStyle: CSSProperties = {
	textAlign: "start",
	borderBottom: "1px solid var(--sge-color-border)",
	padding: "var(--sge-space-2) var(--sge-space-3)",
	verticalAlign: "top",
};

/**
 * Renders the live token object exported by the package.
 *
 * Reading `sdsTokens` at render time means this page can never drift from the
 * installed version of React SDS: it is the package's own value, not a copy.
 */
export function TokenTable({ group }: { group?: keyof typeof sdsTokens }) {
	const groups = group !== undefined ? { [group]: sdsTokens[group] } : sdsTokens;

	return (
		<>
			{Object.entries(groups).map(([groupName, values]) => (
				<section key={groupName} style={{ marginBlock: "var(--sge-space-6)" }}>
					<h2 style={{ textTransform: "capitalize" }}>{groupName}</h2>
					<table style={tableStyle}>
						<thead>
							<tr>
								<th style={cellStyle}>Token</th>
								<th style={cellStyle}>Value</th>
								<th style={cellStyle}>Sample</th>
							</tr>
						</thead>
						<tbody>
							{Object.entries(values as Record<string, string>).map(([name, value]) => (
								<tr key={name}>
									<td style={cellStyle}>
										<code>{`--sge-${name}`}</code>
									</td>
									<td style={cellStyle}>
										<code>{value}</code>
									</td>
									<td style={cellStyle}>
										{groupName === "colors" ? (
											<span
												aria-hidden="true"
												style={{
													display: "inline-block",
													width: "1.25rem",
													height: "1.25rem",
													borderRadius: "var(--sge-radius-small)",
													border: "1px solid var(--sge-color-border)",
													background: value,
												}}
											/>
										) : (
											"—"
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
			))}
		</>
	);
}
