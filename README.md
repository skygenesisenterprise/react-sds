# SDS React Toolkit Project

[![License: MIT](https://img.shields.io/github/license/skygenesisenterprise/react-sds)](LICENSE)
[![Node.js 22](https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![pnpm 12](https://img.shields.io/badge/pnpm-12-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![TypeScript 4.9](https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![React Native 0.72+](https://img.shields.io/badge/React_Native-0.72%2B-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> The official React implementation of the Sky Genesis Enterprise Design System.

> **Architecture reference:** [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) — the institutional layers, the token contract and its cross-platform guarantees, the CSS entry points, the theme contract, the component conventions, the React Native scope, the Tailwind limits and the migration strategy.

**SDS React** (`@skygenesisenterprise/react-sds`) is the React and React Native toolkit for building the digital products of Sky Genesis Enterprise. It ships accessible, typed, tree-shakable components, the official `--sge-*` CSS foundation, light and dark themes, layout and editorial primitives, and a native foundation that shares the same token contract.

**Perfect for:** product teams, design-system maintainers, internal tools, customer portals, marketing sites and mobile applications that need a consistent SGE identity without rebuilding a component library.

## Contents

- [SDS React Toolkit Project](#sds-react-toolkit-project)
    - [Contents](#contents)
    - [Why SDS matters](#why-sds-matters)
    - [What you can do](#what-you-can-do)
        - [Build](#build)
        - [Style](#style)
        - [Theme](#theme)
        - [Extend](#extend)
    - [Quick start](#quick-start)
        - [Install](#install)
        - [Use the CSS foundation](#use-the-css-foundation)
        - [Use components](#use-components)
        - [Use the native foundation](#use-the-native-foundation)
    - [How SDS React is built](#how-sds-react-is-built)
        - [Repository layout](#repository-layout)
        - [Core layers](#core-layers)
        - [Component families](#component-families)
        - [Native foundation](#native-foundation)
        - [Build and tooling](#build-and-tooling)
    - [Development](#development)
        - [Root commands](#root-commands)
        - [CSS foundation development](#css-foundation-development)
        - [Storybook and integration demos](#storybook-and-integration-demos)
    - [FAQ](#faq)
        - [Is SDS free?](#is-sds-free)
        - [Do I need Next.js?](#do-i-need-nextjs)
        - [What do I need to run it?](#what-do-i-need-to-run-it)
        - [Does SDS work with React Native?](#does-sds-work-with-react-native)
        - [Where is the documentation?](#where-is-the-documentation)
        - [How do I get help or report a bug?](#how-do-i-get-help-or-report-a-bug)
    - [Related resources](#related-resources)
        - [Official](#official)
        - [Community](#community)
        - [Commercial](#commercial)
    - [Contributing](#contributing)
    - [Security](#security)
    - [License](#license)
    - [Note](#note)

## Why SDS matters

🎯 **One identity, every product** — the same tokens, components and accessibility rules power web apps, portals, internal tools and native applications. The SGE identity stays consistent by construction.

🚀 **React-first, framework-agnostic** — use SDS with Next.js App Router or Pages Router, Vite, Create React App, React Server Components or any React 18+ setup.

🎨 **A real CSS foundation** — `main.css` ships the `--sge-*` tokens, reset, base styles, light and dark themes, typography, layout primitives, component styles and utilities. No Tailwind dependency is required.

♿ **Accessibility by default** — keyboard navigation, visible focus, ARIA patterns, form errors, skip links, reduced motion and contrast handling are part of the system, with WCAG 2.2 AA as the target.

🧩 **Typed and tree-shakable** — every component is fully typed and available from a dedicated subpath, so bundlers only include what you import.

📱 **Web and native parity** — `@skygenesisenterprise/react-sds/native` shares the SDS token contract with the web implementation without importing the DOM or CSS stack.

🔓 **Open source and extensible** — the package is MIT licensed, the token names are stable and overridable, and the upstream lineage is documented honestly.

## What you can do

### Build

- Compose pages with the SDS layout primitives: `SDSPage`, `SDSMain`, `SDSContainer`, `SDSSection`, `SDSStack`, `SDSGrid` and `SDSColumns`.
- Use the portal family for complete institutional shells: `SDSPortal`, `SDSGovernmentHeader`, `SDSMinistryHeader`, `SDSGovernmentFooter`, `SDSHero`, `SDSBreadcrumb`, `SDSNavigation`, `SDSSearch`, `SDSPagination`, `SDSOfficialNotice`, `SDSServiceBanner` and `SDSMegaMenu`.
- Use the content family for editorial pages: `SDSArticleCard`, `SDSCard`, `SDSDocument`, `SDSDownload`, `SDSEvent`, `SDSLinkList`, `SDSMeetingCard`, `SDSNewsList` and `SDSTeaserCard`.
- Use the historic generic components (`Button`, `Alert`, `Header`, `Footer`, `Table`, `Tabs`, `Modal`, `Upload`…) and optional chart components where needed.

### Style

- Import the official CSS entry once: `@skygenesisenterprise/react-sds/main.css`.
- Consume semantic `--sge-*` custom properties instead of hard-coded values.
- Keep the application CSS focused on business layout; the global visual behavior belongs to SDS.
- Use the Tailwind adapter only when a product needs utility classes on top of the foundation.

### Theme

- The light theme is the default.
- The dark theme is opt-in through `data-sge-theme="dark"`, `.dark` or `[data-fr-theme="dark"]`.
- Override `--sge-*` custom properties from the application to restyle without touching components.
- Read the typed token contract from `sdsTokens` when a value is needed in JavaScript or React Native.

### Extend

- Import components from their dedicated subpath to keep bundles small.
- Add the native entry for Expo and React Native applications.
- Use the `react-sds` CLI to optimize CSS and copy the required static assets.
- Start from the integration demos for Next.js, Vite and Create React App.

## Quick start

### Install

```bash
npm install @skygenesisenterprise/react-sds
# or
pnpm add @skygenesisenterprise/react-sds
```

SDS React is designed for React 18+. The native entry additionally requires `react-native` as an optional peer. The chart and Discord integrations are optional peers as well.

### Use the CSS foundation

```tsx
// The official CSS foundation — once, from the application entry point.
import "@skygenesisenterprise/react-sds/main.css";
```

The foundation is plain standalone CSS. It can be consumed with Next.js, Vite, Create React App or any other bundler.

If your application already applies its own reset and only needs the SGE identity, import the
tokens alone — they expose the `--sge-*` variables and never touch an HTML element:

```tsx
import "@skygenesisenterprise/react-sds/tokens";
```

`main.css` adds the legacy `fr-*` stylesheet on top of the foundation; `styles` gives you the
SGE foundation alone. See [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md#5-css-entry-points) for the exact
contents of each entry.

### Use components

```tsx
import "@skygenesisenterprise/react-sds/main.css";
import { Button } from "@skygenesisenterprise/react-sds/Button";

export function Example() {
    return <Button iconId="ri-add-line">New record</Button>;
}
```

Components can also be imported from the package root:

```tsx
import { Button, Header, Footer } from "@skygenesisenterprise/react-sds";
```

Subpath imports remain the recommended, granular path.

### Use the native foundation

```tsx
import { Button, Card, Heading, SDSProvider, Text } from "@skygenesisenterprise/react-sds/native";

export function ExampleScreen() {
    return (
        <SDSProvider colorScheme="system">
            <Card>
                <Heading>Mon espace SGE</Heading>
                <Text>Retrouvez vos services et démarches.</Text>
                <Button>Continuer</Button>
            </Card>
        </SDSProvider>
    );
}
```

See [`examples/native`](examples/native) for a complete consumption example.

## How SDS React is built

SDS React is a single pnpm package with a TypeScript source tree, a static CSS foundation, Storybook documentation and integration demos. The build pipeline generates the compiled `dist/` tree, the package exports map, the published CSS assets and the native declarations.

### Repository layout

```text
react-sds/
├── src/
│   ├── styles/                  # Official CSS foundation
│   │   ├── foundation/          # Theme-independent --sge-* tokens
│   │   ├── themes/              # light.css (default) and dark.css (opt-in)
│   │   ├── components/          # SDS component styles
│   │   ├── reset.css            # Browser normalization
│   │   ├── base.css             # Global defaults
│   │   ├── typography.css       # Element typography scale
│   │   ├── accessibility.css    # Focus, screen-reader and contrast rules
│   │   ├── layout.css           # Page-shell primitives
│   │   ├── utilities.css        # System-wide helpers
│   │   └── index.css            # Foundation entry imported by main.css
│   ├── sds/                     # SDS foundations and component families
│   │   ├── tokens.ts            # Typed token contract
│   │   ├── layout/              # SDSPage, SDSMain, SDSGrid, …
│   │   ├── typography/          # SDSHeading, SDSText, SDSLead, SDSLink
│   │   ├── portal/              # SDSPortal, headers, footer, navigation, …
│   │   └── content/             # Cards, documents, events, news, …
│   ├── native/                  # SDS Native Foundation (React Native / Expo)
│   ├── fr/                      # Legacy legacy token helpers
│   ├── assets/                  # Static assets and public token re-exports
│   ├── bin/                     # CLI tools (react-sds)
│   └── <Component>.tsx          # Historic generic components
├── scripts/build/               # Build pipeline and exports generation
├── stories/                     # Storybook documentation
├── test/                        # Unit, runtime and integration tests
├── examples/native/             # Native consumption example
├── .storybook/                  # Storybook configuration
├── package.json
└── pnpm-lock.yaml
```

### Core layers

| Path               | Role                                                                              |
| ------------------ | --------------------------------------------------------------------------------- |
| `src/sds`          | Token contract and SDS component families: layout, typography, portal and content |
| `src/styles`       | Official CSS foundation imported by `main.css`; canonical `--sge-*` namespace     |
| `src/native`       | Native foundation with the same token names and no DOM/CSS dependency             |
| `src/fr`           | Legacy legacy token helpers kept while historic `fr-*` components remain          |
| `scripts/build`    | Generates `dist/`, the exports map, CSS assets and native declarations            |
| `src/bin`          | `react-sds` CLI for CSS optimization and static asset helpers                     |
| `test/integration` | Next.js App Router, Next.js Pages Router, Vite and Create React App demos         |

### Component families

| Family     | Components                                                                                                                                                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout     | `SDSPage`, `SDSMain`, `SDSContainer`, `SDSSection`, `SDSStack`, `SDSGrid`, `SDSColumns`                                                                                                                                           |
| Typography | `SDSHeading`, `SDSText`, `SDSLead`, `SDSLink`                                                                                                                                                                                     |
| Portal     | `SDSPortal`, `SDSGovernmentHeader`, `SDSMinistryHeader`, `SDSGovernmentFooter`, `SDSHero`, `SDSBreadcrumb`, `SDSNavigation`, `SDSSearch`, `SDSPagination`, `SDSOfficialNotice`, `SDSServiceBanner`, `SDSMegaMenu`                 |
| Content    | `SDSArticleCard`, `SDSCard`, `SDSDocument`, `SDSDownload`, `SDSEvent`, `SDSLinkList`, `SDSMeetingCard`, `SDSNewsList`, `SDSTeaserCard`                                                                                            |
| Generic    | `Accordion`, `Alert`, `BackToTop`, `Badge`, `Button`, `Card`, `Checkbox`, `ConsentManagement`, `Footer`, `Header`, `Input`, `Modal`, `Pagination`, `Select`, `Table`, `Tabs`, `Tag`, `ToggleSwitch`, `Tooltip`, `Upload` and more |

The historic chart components remain available through their optional `@gouvfr/dsfr-chart` peer.

### Native foundation

The native entry is **not a DOM port**. It is built on React Native primitives (`View`, `Text`, `Pressable`, `TextInput`, `Modal`, `FlatList`…) and shares the same semantic token contract as the web foundation:

| Layer                 | Components                                                                                                             |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Foundations           | `Text`, `Heading`, `Icon`, `Divider`, `Stack`, `Container`                                                             |
| Actions               | `Button`, `IconButton`, `Link`                                                                                         |
| Forms                 | `Input`, `TextArea`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Select`                                             |
| Feedback              | `Alert`, `Badge`, `Status`, `Progress`, `Loading`                                                                      |
| Layout and content    | `Card`, `List`, `ListItem`, `Section`, `Avatar`                                                                        |
| Navigation primitives | `Header`, `TabBar`, `NavItem`                                                                                          |
| Institutional         | `ServiceCard`, `ProcedureCard`, `DocumentCard`, `NotificationCard`, `IdentityBadge`, `StatusBadge`, `GovernmentBanner` |

The native foundation provides graphics and primitives, not a router. Routing stays in Expo Router or React Navigation. The web bundle never imports the native layer, and the native bundle never imports the web/DOM stack.

### Build and tooling

The build pipeline compiles TypeScript, copies the CSS foundation and static assets, regenerates the package exports map and prepares the published native declarations. The root `main.css` entry loads the SDS foundation first, then the legacy stylesheet that still styles the historic `fr-*` component classes.

The repository also contains the `react-sds` CLI (`src/bin`), the Storybook documentation, the Vitest runtime tests and the integration applications used to validate consumption in real frameworks.

## Development

SDS React uses **Node.js 22** and **pnpm 11** in CI. Install dependencies from the repository root:

```bash
git clone https://github.com/skygenesisenterprise/react-sds.git
cd react-sds
pnpm install --frozen-lockfile
```

### Root commands

| Command                    | Purpose                                                    |
| -------------------------- | ---------------------------------------------------------- |
| `pnpm build`               | Generate assets/types and compile the library into `dist/` |
| `pnpm test`                | Run the Vitest unit and runtime test suite                 |
| `pnpm lint:check`          | Run ESLint                                                 |
| `pnpm format:check`        | Check formatting with Prettier                             |
| `pnpm storybook`           | Run the Storybook documentation on `:6006`                 |
| `pnpm build-storybook`     | Build the static Storybook                                 |
| `pnpm prestorybook`        | Build the package and optimize the CSS used by Storybook   |
| `pnpm start-next-appdir`   | Run the Next.js App Router demo against `dist/`            |
| `pnpm start-next-pagesdir` | Run the Next.js Pages Router demo against `dist/`          |
| `pnpm start-vite`          | Run the Vite demo against `dist/`                          |
| `pnpm start-cra`           | Run the Create React App demo against `dist/`              |

The build step includes the full TypeScript typecheck. Run `pnpm build`, `pnpm test`, `pnpm lint:check` and `pnpm format:check` before opening a pull request.

### CSS foundation development

- Theme-independent tokens live in `src/styles/foundation/`.
- Light and dark semantic tokens live in `src/styles/themes/`.
- Shared component styles live in `src/styles/components/`.
- `src/styles/index.css` is the foundation entry, and `scripts/build/main.css` is the official CSS entry published with the package.
- The canonical namespace is `--sge-*`; do not introduce a parallel token namespace.

Token changes must stay aligned with `src/sds/tokens.ts` (web), `src/native/tokens` (native) and the foundation tests.

### Storybook and integration demos

```bash
pnpm storybook
```

Storybook documents every component, its variants, states, accessibility properties and code samples. The integration demos under `test/integration/` validate the package against Next.js App Router, Next.js Pages Router, Vite and Create React App.

## FAQ

### Is SDS free?

Yes. SDS React is licensed under the MIT License. The project started as a fork of [`codegouvfr/react-dsfr`](https://github.com/codegouvfr/react-dsfr) (also MIT) and retains the upstream history and attribution obligations documented in [PROVENANCE.md](PROVENANCE.md).

### Do I need Next.js?

No. SDS React works with Next.js App Router and Pages Router, Vite, Create React App and any React 18+ setup. Next.js helpers are optional subpath modules, not a requirement.

### What do I need to run it?

React 18+ for the web components. For development, use Node.js 22 and pnpm 11. The native entry requires `react-native` as an optional peer, and the chart and Discord integrations have their own optional peers.

### Does SDS work with React Native?

Yes. `@skygenesisenterprise/react-sds/native` is the official SDS Native Foundation for React Native and Expo. It shares the SDS token contract with the web implementation but uses React Native primitives instead of the DOM/CSS stack.

### Where is the documentation?

The interactive documentation lives at [skygenesisenterprise.github.io/react-sds](https://skygenesisenterprise.github.io/react-sds). The repository also contains [MIGRATION.md](MIGRATION.md), [AUDIT.md](AUDIT.md), [PROVENANCE.md](PROVENANCE.md) and the Storybook sources in `stories/`.

### How do I get help or report a bug?

Open a [GitHub issue](https://github.com/skygenesisenterprise/react-sds/issues) for bugs and feature requests. Never report a security vulnerability in a public issue — follow [SECURITY.md](SECURITY.md) instead.

## Related resources

### Official

- Documentation and Storybook: [skygenesisenterprise.github.io/react-sds](https://skygenesisenterprise.github.io/react-sds)
- npm package: [@skygenesisenterprise/react-sds](https://www.npmjs.com/package/@skygenesisenterprise/react-sds)
- Repository: [github.com/skygenesisenterprise/react-sds](https://github.com/skygenesisenterprise/react-sds)
- Native example: [`examples/native`](examples/native)
- Integration demos: [`test/integration`](test/integration)

### Community

- Bugs and feature requests: [GitHub Issues](https://github.com/skygenesisenterprise/react-sds/issues)
- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Governance: [GOVERNANCE.md](GOVERNANCE.md)

### Commercial

- Sky Genesis Enterprise: [skygenesisenterprise.com](https://skygenesisenterprise.com)
- Commercial support and design-system engagements: contact Sky Genesis Enterprise.

## Contributing

Contributions and suggestions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before participating, then use the appropriate [pull request template](.github/PULL_REQUEST_TEMPLATE.md).

- Keep PR titles in [Conventional Commits](https://www.conventionalcommits.org) format (`fix: …`, `feat: …`, `docs: …`).
- Run `pnpm build`, `pnpm test`, `pnpm lint:check` and `pnpm format:check` before opening a pull request.
- Update the Storybook stories and the foundation tests when changing component APIs or tokens.
- Read [AUDIT.md](AUDIT.md) before making structural changes.

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in [SECURITY.md](SECURITY.md).

## License

SDS React is licensed under the [MIT License](LICENSE). Some optional integrations and upstream assets may carry their own license terms; check the relevant package or asset before redistributing it.

## Note

SDS React is maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). The documentation layout follows the [Notploy README](https://github.com/skygenesisenterprise/notploy/blob/master/README.md) as the reference design for Sky Genesis Enterprise repositories. Links to external services are provided for convenience and do not imply endorsement. Check each service's own terms before relying on it in production.
