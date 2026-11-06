import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import {
	DocsSearchTriggerFull,
	DocsSearchTriggerSmall,
} from "@/components/DocsSearchTrigger";
import { Logo } from "@/components/Logo";
import { libraryVersion } from "@/lib/library-version";

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: (
				<span
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
						minWidth: 0,
					}}
				>
					<Logo />
					<span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
						React SDS
					</span>
					<span
						style={{
							fontSize: "var(--sge-font-size-xs)",
							fontWeight: 500,
							color: "var(--sge-color-text-muted)",
							whiteSpace: "nowrap",
						}}
					>
						v{libraryVersion}
					</span>
				</span>
			),
			url: "/",
		},
		githubUrl: "https://github.com/skygenesisenterprise/react-sds",
		slots: {
			searchTrigger: {
				full: DocsSearchTriggerFull,
				sm: DocsSearchTriggerSmall,
			},
		},
	};
}
