import '@skygenesisenterprise/react-sds/main.css';
import 'fumadocs-ui/style.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import SearchDialog from '@/components/SearchDialog';

const siteUrl =
	process.env.NEXT_PUBLIC_DOCS_URL ??
	'https://skygenesisenterprise.github.io/react-sds';

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: 'React SDS documentation',
		template: '%s · React SDS',
	},
	description:
		'Official developer documentation for @skygenesisenterprise/react-sds: install the package, build interfaces with the SDS components, and browse the exact public API.',
	keywords: [
		'react-sds',
		'react',
		'design system',
		'sky genesis enterprise',
		'component library',
		'design tokens',
		'accessibility',
	],
	authors: [{ name: 'Sky Genesis Enterprise' }],
	alternates: {
		canonical: '/',
	},
	openGraph: {
		title: 'React SDS documentation',
		description:
			'Installation, foundations, components and the exhaustive API reference of @skygenesisenterprise/react-sds.',
		url: siteUrl,
		siteName: 'React SDS',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'React SDS documentation',
		description:
			'Installation, foundations, components and the exhaustive API reference of @skygenesisenterprise/react-sds.',
	},
	icons: {
		icon: '/icon.svg',
	},
};

/**
 * Fumadocs chrome mapped onto the React SDS tokens.
 *
 * The documentation has no stylesheet of its own: this layout imports the
 * official `main.css` of `@skygenesisenterprise/react-sds`, and these custom
 * properties only point the documentation shell at the library's variables.
 * Switching the SDS theme (light/dark) therefore restyles the whole portal, and
 * no colour, font or spacing value is redefined here.
 */
const sdsChromeVariables = {
	'--color-fd-background': 'var(--sge-color-background)',
	'--color-fd-foreground': 'var(--sge-color-text)',
	'--color-fd-muted': 'var(--sge-color-surface-muted)',
	'--color-fd-muted-foreground': 'var(--sge-color-text-muted)',
	'--color-fd-popover': 'var(--sge-color-popover)',
	'--color-fd-popover-foreground': 'var(--sge-color-popover-foreground)',
	'--color-fd-card': 'var(--sge-color-background)',
	'--color-fd-card-foreground': 'var(--sge-color-text)',
	'--color-fd-border': 'var(--sge-color-border)',
	'--color-fd-primary': 'var(--sge-color-text)',
	'--color-fd-primary-foreground': 'var(--sge-color-background)',
	'--color-fd-secondary': 'var(--sge-color-card)',
	'--color-fd-secondary-foreground': 'var(--sge-color-text)',
	'--color-fd-accent': 'var(--sge-color-surface-muted)',
	'--color-fd-accent-foreground': 'var(--sge-color-text)',
	'--color-fd-ring': 'var(--sge-color-ring)',
	'--color-fd-overlay': 'var(--sge-color-overlay)',
	'--color-fd-info': 'var(--sge-color-info)',
	'--color-fd-warning': 'var(--sge-color-warning)',
	'--color-fd-error': 'var(--sge-color-danger)',
	'--color-fd-success': 'var(--sge-color-success)',
	'--color-fd-idea': 'var(--sge-color-warning)',
	'--color-fd-article': 'var(--sge-color-background)',
	'--font-sans': 'var(--sge-font-family-sans)',
	'--font-mono': 'var(--sge-font-family-mono)',
} as CSSProperties;

export default function Layout({ children }: LayoutProps<'/'>) {
	return (
		<html lang="en" style={sdsChromeVariables} suppressHydrationWarning>
			<body
				style={{
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column',
					fontFamily: 'var(--sge-font-family-sans)',
					// The legacy component layer also targets `body`; keep the shell on
					// the SDS surface so the theme stays coherent.
					backgroundColor: 'var(--sge-color-background)',
					color: 'var(--sge-color-text)',
				}}
			>
				<RootProvider
					search={{ SearchDialog }}
					theme={{
						// Keep the Fumadocs `dark` class and the SDS theme attribute in sync
						// so every chrome variable resolves against the same scheme.
						attribute: ['class', 'data-sge-theme'],
						defaultTheme: 'dark',
						enableSystem: true,
					}}
				>
					{children}
				</RootProvider>
			</body>
		</html>
	);
}
