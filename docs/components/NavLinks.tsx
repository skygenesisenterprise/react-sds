import Link from 'next/link';
import type { CSSProperties } from 'react';

/**
 * Header quick-links menu — the inherited docs-client pattern (a compact menu
 * in the navigation bar), reduced to the links that belong to React SDS.
 *
 * Styling is token-driven: the portal ships no stylesheet of its own, only the
 * React SDS variables loaded in app/layout.tsx.
 */
const links = [
	{ text: 'Core documentation', href: '/docs/core' },
	{ text: 'API reference', href: '/docs/api' },
	{ text: 'CLI', href: '/docs/cli' },
	{
		text: 'npm package',
		href: 'https://www.npmjs.com/package/@skygenesisenterprise/react-sds',
		external: true,
	},
	{
		text: 'GitHub',
		href: 'https://github.com/skygenesisenterprise/react-sds',
		external: true,
	},
	{
		text: 'Report an issue',
		href: 'https://github.com/skygenesisenterprise/react-sds/issues',
		external: true,
	},
];

const summaryStyle: CSSProperties = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: '0.375rem',
	padding: '0.375rem 0.625rem',
	borderRadius: 'var(--sge-radius-small)',
	color: 'var(--sge-color-text-muted)',
	fontSize: 'var(--sge-font-size-sm)',
	cursor: 'pointer',
	listStyle: 'none',
};

const menuStyle: CSSProperties = {
	position: 'absolute',
	insetInlineEnd: 0,
	marginBlockStart: '0.25rem',
	minWidth: '14rem',
	padding: '0.375rem',
	background: 'var(--sge-color-popover)',
	color: 'var(--sge-color-popover-foreground)',
	border: '1px solid var(--sge-color-border)',
	borderRadius: 'var(--sge-radius-medium)',
	boxShadow: 'var(--sge-shadow-md)',
	zIndex: 40,
};

const itemStyle: CSSProperties = {
	display: 'block',
	padding: '0.5rem 0.625rem',
	borderRadius: 'var(--sge-radius-small)',
	color: 'var(--sge-color-text)',
	fontSize: 'var(--sge-font-size-sm)',
	textDecoration: 'none',
};

export function NavLinks() {
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
			<Link href="/docs/core" style={{ ...summaryStyle, textDecoration: 'none' }}>
				Core
			</Link>
			<Link href="/docs/api" style={{ ...summaryStyle, textDecoration: 'none' }}>
				API
			</Link>
			<Link href="/docs/cli" style={{ ...summaryStyle, textDecoration: 'none' }}>
				CLI
			</Link>

			<details style={{ position: 'relative' }}>
				<summary aria-label="Quick links" style={summaryStyle}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="16"
						height="16"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						aria-hidden="true"
					>
						<path d="M4 6h16M4 12h16M4 18h16" />
					</svg>
					<span>Quick links</span>
				</summary>
				<nav aria-label="Quick links" style={menuStyle}>
					{links.map((link) =>
						link.external ? (
							<a
								key={link.href}
								href={link.href}
								target="_blank"
								rel="noreferrer noopener"
								style={itemStyle}
							>
								{link.text}
							</a>
						) : (
							<Link key={link.href} href={link.href} style={itemStyle}>
								{link.text}
							</Link>
						),
					)}
				</nav>
			</details>
		</div>
	);
}
