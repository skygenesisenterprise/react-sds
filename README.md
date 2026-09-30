<p align="center">
    <i>Sky Genesis Enterprise Design System — React</i>
    <br>
    <b>SDS React</b>
    <br>
    <br>
    <a href="https://github.com/skygenesisenterprise/react-sds/actions">
      <img src="https://github.com/skygenesisenterprise/react-sds/actions/workflows/ci.yaml/badge.svg">
    </a>
    <a href="https://www.npmjs.com/package/@skygenesisenterprise/react-sds">
      <img src="https://img.shields.io/npm/v/@skygenesisenterprise/react-sds?logo=npm">
    </a>
    <a href="https://bundlephobia.com/package/@skygenesisenterprise/react-sds">
      <img src="https://img.shields.io/bundlephobia/minzip/@skygenesisenterprise/react-sds">
    </a>
    <a href="https://github.com/skygenesisenterprise/react-sds/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/@skygenesisenterprise/react-sds">
    </a>
</p>

> **SDS is the official design system for the digital ecosystem of the Sky Genesis Enterprise.**

`@skygenesisenterprise/react-sds` is its official React implementation: accessible, typed,
tree-shakable React components **and the official CSS foundation** for the web
services, portals and applications of the SGE government.

> **Status: `1.0.7`.** Since 1.0.6 the package ships the official Sky Genesis Enterprise Design System
> CSS foundation (`@skygenesisenterprise/react-sds/main.css`): tokens, reset, base, typography,
> themes (light/dark/system), accessibility, government layout primitives, editorial
> content and utilities. **Since 1.0.7 it also ships the SDS Native Foundation
> (`@skygenesisenterprise/react-sds/native`):** the first official React Native / Expo layer of
> SDS, sharing the same tokens and conventions with the web implementation without
> depending on the DOM/CSS stack. A government application imports the foundation once
> and no longer maintains a government-wide `globals.css` of its own — the application
> only keeps its business CSS. The project is a fork of the French `react-dsfr` library
> being transformed into an independent design system; the migration state and what
> still comes from the upstream DSFR stylesheet are documented in
> [AUDIT.md](AUDIT.md), [MIGRATION.md](MIGRATION.md) and [PROVENANCE.md](PROVENANCE.md).

## Table of contents

-   [What is SDS?](#what-is-sds)
-   [Installation](#installation)
-   [Quick start](#quick-start)
-   [CSS foundation](#css-foundation)
-   [Components](#components)
-   [Native — React Native / Expo](#native--react-native--expo)
-   [SSR / Next.js / Server Components](#ssr--nextjs--server-components)
-   [Design tokens](#design-tokens)
-   [Layout primitives](#layout-primitives)
-   [Theming](#theming)
-   [Accessibility](#accessibility)
-   [Internationalization](#internationalization)
-   [Contributing & development](#contributing--development)
-   [Architecture & package layout](#architecture--package-layout)
-   [Provenance & licensing](#provenance--licensing)
-   [Governance](#governance)
-   [Releases & versioning](#releases--versioning)

---

## What is SDS?

The **Sky Genesis Enterprise Design System** (SDS) is the reference design system for the digital
public services of the Sky Genesis Enterprise. It defines the visual identity,
components, **CSS foundations**, tokens and accessibility rules that make SGE
government websites recognizable, consistent and accessible.

**SDS React** (`@skygenesisenterprise/react-sds`) is the official React implementation of that
system. It is designed for the modern React ecosystem:

-   **Next.js** — Pages Router and App Router, with full SSR support.
-   **Vite / Create React App / bundler-agnostic** SPA usage.
-   **React Server Components** — components are server-component safe where relevant.
-   **TypeScript** — fully typed, documented API.
-   **Tree-shaking** — cherry-pick the components you import (subpath imports), no monolithic bundle.
-   **A real CSS foundation** — tokens, base styles, themes, layout primitives and
    accessibility rules shipped as plain CSS, importable with a single line and usable
    without Tailwind (Tailwind stays optional for business layouts).
-   **Accessibility** — WCAG-oriented implementation and interactive docs with a11y stories.

The toolkit also ships SSR helpers (no white flash on reload, color scheme persistence),
an optional MUI adaptation layer, i18n, and opt-in CSS/asset optimization tools.

## Installation

```bash
npm install @skygenesisenterprise/react-sds
# or
pnpm add @skygenesisenterprise/react-sds
```

Peer requirements: `react` ≥ 18 (and `react-dom` for the DOM entry points). No other
runtime dependency is required for the core components.

## Quick start

```tsx
// 1. The official CSS foundation — once, from your app entry point.
import "@skygenesisenterprise/react-sds/main.css";

// 2. The components — subpath imports keep your bundle minimal.
import { Button } from "@skygenesisenterprise/react-sds/Button";
import { Header } from "@skygenesisenterprise/react-sds/Header";
import { Footer } from "@skygenesisenterprise/react-sds/Footer";
```

```tsx
export function Example() {
    return (
        <Button iconId="ri-add-line" onClick={() => alert("Hello SGE!")}>
            New record
        </Button>
    );
}
```

See the [interactive documentation](https://skygenesisenterprise.github.io/react-sds) (Storybook)
for every component, its variants, states and code samples — and the **Foundations**
pages for the CSS foundation.

> Components can also be imported from the package root
> (`import { Button } from "@skygenesisenterprise/react-sds"`): the root re-exports the generic
> components and the `fr`/`sds` token helpers. Subpath imports remain the granular,
> recommended path.
>
> **Legacy:** until the coordinated breaking release (see [MIGRATION.md](MIGRATION.md)),
> the component styles come from the legacy DSFR layer bundled in the package. The old
> explicit import `import "@skygenesisenterprise/react-sds/dsfr/dsfr.min.css"` is superseded by
> `main.css` (which loads it) and kept for compatibility.

## CSS foundation

`@skygenesisenterprise/react-sds/main.css` is **the official CSS entry of the SGE Design
System**. A government application should only keep its *business* CSS — everything
that concerns the global visual behavior of a government application belongs to SDS.

It loads, in order:

1. **tokens** — `--sds-*` custom properties (colors, typography, spacing, radius,
   elevation, motion, breakpoints);
2. **reset** — modern, minimal browser normalization;
3. **base** — `html`/`body` defaults, links, text selection;
4. **typography** — the base element scale (`h1`–`h6`, `p`, `blockquote`, `code`,
   `pre`, lists…);
5. **themes** — dark scheme (`.dark` and `[data-fr-theme="dark"]`);
6. **accessibility** — `:focus-visible`, `.sds-sr-only`, reduced motion, contrast;
7. **layout** — `.gov-page`, `.gov-main`, `.gov-container`, `.gov-section`…;
8. **component styles** — header shell, forms, tables, editorial `.gov-prose`,
   `.sds-back-to-top`;
9. **utilities** — the handful of system-wide helpers;
10. then the **legacy DSFR layer** that styles the `fr-*` component classes (it will
    be replaced by `sds-*` styles in the single coordinated breaking release, without
    changing this import).

The foundation is **plain standalone CSS**: it does not depend on Tailwind or on the
application build. Applications remain free to use Tailwind (or anything else) for
their business layouts on top of the foundation.

```text
src/styles/           # the foundation (published as @skygenesisenterprise/react-sds/styles/*)
├── tokens.css        # design tokens (light scheme, --sds-*)
├── reset.css
├── base.css
├── typography.css
├── themes.css        # dark scheme (.dark / [data-fr-theme="dark"])
├── accessibility.css
├── layout.css        # .gov-page .gov-main .gov-container .gov-section …
├── utilities.css
└── components/
    ├── header.css    # .gov-header-sticky
    ├── form.css      # .gov-form primitives
    ├── table.css     # .gov-table primitives
    ├── prose.css     # .gov-prose editorial content
    └── back-to-top.css
```

## Components

The library implements generic, accessible components, among which:

`Accordion` · `Alert` · `BackToTop` · `Badge` · `Breadcrumb` · `Button` ·
`ButtonsGroup` · `CallOut` · `Card` · `Checkbox` · `ConsentManagement` · `Download` ·
`Follow` · `Footer` · `Header` · `Highlight` · `Input` · `LanguageSelect` ·
`MainNavigation` · `Modal` · `Notice` · `Pagination` · `Quote` · `RadioButtons` ·
`Range` · `SearchBar` · `SegmentedControl` · `Select` · `SideMenu` · `SkipLinks` ·
`Stepper` · `Summary` · `Table` · `Tabs` · `Tag` · `TagsGroup` · `Tile` ·
`ToggleSwitch` · `Tooltip` · `Upload` · plus `blocks/` composites and the legacy chart
components (`Chart/*`, optional `@gouvfr/dsfr-chart` peer).

> The France-specific leftovers from the fork (`FranceConnectButton`,
> `AgentConnectButton`, `ProConnectButton`, `MonCompteProButton`, `eulerianAnalytics`)
> have been removed — see [CHANGELOG.md](CHANGELOG.md) and [MIGRATION.md](MIGRATION.md)
> §Stage 2.

## Native — React Native / Expo

**`@skygenesisenterprise/react-sds/native` is the official native support of SDS** (the
**SDS Native Foundation**, introduced in 1.0.7). It lets React Native / Expo
applications of the SGE government (MyGouv Mobile, Économie Mobile,
Éducation Mobile, …) use SDS as their shared native UI layer:

```text
               Sky Genesis Enterprise Design System
                        │
         ┌──────────────┴──────────────┐
         │                             │
     Web / React                 Native / React Native
         │                             │
@skygenesisenterprise/               @skygenesisenterprise/
  react-sds                   react-sds/native
         │                             │
      Browser                      iOS / Android
```

The native layer shares the **SDS tokens and conventions** with the web
implementation but is **not a port of the DOM/CSS components**: it is built on
React Native primitives (`View`, `Text`, `Pressable`, `TextInput`, `Modal`,
`FlatList`, …). It never imports the web/DOM stack, and the web bundle never
imports the native layer.

### Installation

```bash
npm install @skygenesisenterprise/react-sds react-native
```

`react-native` is an optional peer dependency of the package (required only by
the native entry, never by the web entry).

### Usage

```tsx
import {
  Button,
  Card,
  Heading,
  Text,
} from "@skygenesisenterprise/react-sds/native";

export function ExampleScreen() {
  return (
    <View>
      <Heading>Mon espace MyGouv</Heading>
      <Card>
        <Text>Retrouvez vos services et démarches administratives.</Text>
        <Button>Continuer</Button>
      </Card>
    </View>
  );
}
```

Metro resolves `@skygenesisenterprise/react-sds/native` directly to the compiled native
entry — no web code is pulled into an Expo bundle.

### Components (SDS Native Foundation)

-   **Foundations** — `Text`, `Heading`, `Icon`, `Divider`, `Stack`, `Container`.
-   **Actions** — `Button`, `IconButton`, `Link`.
-   **Forms** — `Input`, `TextArea`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Select`.
-   **Feedback** — `Alert`, `Badge`, `Status`, `Progress`, `Loading`.
-   **Layout / content** — `Card`, `List`, `ListItem`, `Section`, `Avatar`.
-   **Navigation primitives (graphical only)** — `Header`, `TabBar`, `NavItem`.
    SDS provides the graphics, **not a router**: routing stays in Expo Router or
    React Navigation.
-   **Government components** — `ServiceCard`, `ProcedureCard`, `DocumentCard`,
    `NotificationCard`, `IdentityBadge`, `StatusBadge`, `GovernmentBanner`.
    Generic across applications, no MyGouv-specific logic.

### Tokens & theme

Native tokens mirror the web SDS token contract (colors, typography, spacing,
radius, elevation, dimensions, motion) with concrete values consumable by React
Native styles:

```tsx
import { sdsTokens } from "@skygenesisenterprise/react-sds/native";

sdsTokens.spacing.md; // 16
sdsTokens.dimensions.touchTarget; // 44
```

Components are themed through the provider (defaults to the SGE palette and
to the system color scheme when no provider is present):

```tsx
import { SDSProvider } from "@skygenesisenterprise/react-sds/native";

<SDSProvider colorScheme="system">
  <App />
</SDSProvider>
```

### Accessibility & touch

Native components ship with accessibility baked in (`accessibilityLabel`,
`accessibilityHint`, `accessibilityRole`, `accessibilityState`, disabled/loading
states announced to assistive technologies) and mobile-adapted **touch targets**
(≥ 44 pt on interactive controls) — see [Accessibility](#accessibility).

A complete consumption example lives in [`examples/native`](examples/native).

## SSR / Next.js / Server Components

The package does not require Next.js. SSR helpers are provided as separate subpath
modules.

### Next.js App Router

```tsx
// app/layout.tsx
import "@skygenesisenterprise/react-sds/main.css"; // ← the whole SDS CSS foundation
import { DsfrHead } from "@skygenesisenterprise/react-sds/next-app-router/DsfrHead";
import { DsfrProvider } from "@skygenesisenterprise/react-sds/next-app-router/DsfrProvider";
```

`DsfrProvider` renders the runtime for client components and `DsfrHead` handles fonts,
favicon and color-scheme on the server without white flash on hydration. See the
`test/integration/next-appdir` demo app for a full setup (fonts preloading, nonce, CSP).

### Next.js Pages Router

```tsx
import { createNextDsfrIntegrationApi } from "@skygenesisenterprise/react-sds/next-pagesdir";
```

See `test/integration/next-pagesdir`.

### React Server Components

Most components are server-component safe. Components that need browser APIs are labeled
`"use client"` and are imported through client entry points, keeping the server bundle clean.
`BackToTop` is one of them.

## Design tokens

SDS tokens are the single source of truth for the look of the system. They are exposed
as CSS custom properties (`--sds-*`) and as typed constants (`src/sds/tokens.ts`,
`import { sdsTokens } from "@skygenesisenterprise/react-sds/sds"`).

```css
:root {
    --sds-color-primary: …;
    --sds-color-background: …;
    --sds-radius-medium: …;
    --sds-space-4: …;
    --sds-font-family-base: …;
}
```

Token families: **colors** (`background`, `foreground`, `surface`, `surface-muted`,
`primary`, `secondary`, `accent`, `success`, `warning`, `danger`, `info`, `border`,
`input`, `ring`, `link`, `link-hover`, `text`, `text-muted`, `focus`, `disabled`,
`on-primary`), **typography** (fonts, sizes `xs`–`3xl`, weights, line-heights),
**spacing** (`--sds-space-1`…`12`, 4px base), **radius**, **elevation**, **motion**
(durations, easings, ready-made `--sds-transition-*`) and **breakpoints**.

Components and stylesheets consume tokens — never hard-coded values — so updating the
identity never requires rewriting a component. Overriding `--sds-*` custom properties
from your application `:root` is the supported theming mechanism.

> The token values follow the **SGE palette** used by the reference government
> application. The exact official identity (colors, fonts, icons) is decided by the
> SGE brand/design owners and will replace the values without changing the
> property names — see [MIGRATION.md](MIGRATION.md).

## Layout primitives

The foundation ships the generic government page shell primitives (`layout.css`), so no
application has to restyle its shell:

```tsx
<div className="gov-page">
    <div className="gov-header-sticky">{/* <Header … /> */}</div>
    <main className="gov-main" id="contenu">
        <div className="gov-container">
            <div className="gov-page-header">
                <h1 className="gov-page-title">Titre de la page</h1>
                <p className="gov-page-description">Description…</p>
            </div>
            <section className="gov-section">
                <div className="gov-section__header">
                    <h2 className="gov-section__title">…</h2>
                </div>
                <div className="gov-content">{/* … */}</div>
            </section>
        </div>
    </main>
    {/* <Footer … /> */}
</div>
```

| Class                         | Role                                                        |
| ----------------------------- | ----------------------------------------------------------- |
| `.gov-page`                   | full-height flex column (`min-height: 100vh`)               |
| `.gov-main`                   | grows to fill the space (sticky footer)                     |
| `.gov-container`              | centered column, max-width coherent with SDS (`75rem`)      |
| `.gov-section` (+ `--subtle`) | vertical rhythm of the page sections                        |
| `.gov-section__container`     | wide internal centered column of a section                  |
| `.gov-section__header/title`  | section heading with optional action on the right           |
| `.gov-page-header/title/description` | page header band                                   |
| `.gov-content`                | readable content column                                     |
| `.gov-lead` / `.gov-kicker`   | introduction paragraph / small uppercase label              |

**Editorial content** (`.gov-prose`, `components/prose.css`): wrap editorial content
(law texts, press articles, guides…) in `.gov-prose` and two ministries render the same
default typography — paragraphs, headings, lists, links, blockquotes, code, tables,
images and captions.

**Back to top** (`BackToTop` component + `components/back-to-top.css`): a floating,
accessible, reduced-motion-aware "back to top" bubble that appears once the page is
scrolled — style included, position/z-index/theme/responsive handled.

**Forms & tables** (`components/form.css`, `components/table.css`): plain-CSS
primitives (`.gov-form` fields, help/error/required states; `.gov-table` with
responsive overflow, density and hover variants) for hand-written markup — the
`<Input />`, `<Select />`, `<Checkbox />`, `<Table />`… components are styled by the
component layer shipped with the package.

## Theming

Three mechanisms, all token-driven:

-   **CSS variables** — override `--sds-*` custom properties from your application to
    restyle globally without touching components.
-   **Dark mode** — semantic tokens switch automatically. Both conventions are honored:

    ```html
    <html class="dark">…</html>
    <html data-fr-theme="dark">…</html>
    ```

    The `Display` dialog (in the `Header`) exposes **light / dark / system**; the
    runtime (`startReactDsfr` + SSR "early color scheme" helpers) resolves `system`
    against `prefers-color-scheme` and writes the result in `data-fr-theme`. Without
    the runtime the default is the light scheme.
-   **Application freedom** — business layouts stay free to use Tailwind or any
    utility approach on top of the foundation.

## Accessibility

Accessibility is a first-class requirement (target: WCAG 2.2 AA):

-   keyboard navigation, visible focus, ARIA patterns, form errors, skip links;
-   reduced motion support (durations collapse to 1 ms under
    `prefers-reduced-motion: reduce`);
-   centralized rules in `accessibility.css`: `:focus-visible`, `.sds-sr-only`,
    `.sds-focus-ring`, `.sds-touch-target`, `prefers-contrast: more`;
-   every component story documents its accessibility properties;
-   the Storybook runs with the `@storybook/addon-a11y` checks.

## Internationalization

Built-in texts (Header, Footer, consent management, Display, …) are translated with an
opt-in i18n mechanism: provide translations for the languages you support and override
any string. See `src/i18n.ts` and the stories of the `Display` component.

## Contributing & development

See [CONTRIBUTING.md](CONTRIBUTING.md) — and [AUDIT.md](AUDIT.md) if you want the state of
the codebase before making structural changes.

```bash
git clone https://github.com/skygenesisenterprise/react-sds.git
cd react-sds
pnpm install
```

| Command                                 | Purpose                                                 |
| --------------------------------------- | ------------------------------------------------------- |
| `pnpm build`                            | Generate assets/types and compile the library (`dist/`) |
| `pnpm storybook`                        | Interactive documentation (dev server on `:6006`)       |
| `pnpm test`                             | Unit tests (vitest)                                     |
| `pnpm lint:check` / `pnpm format:check` | ESLint and Prettier checks                              |
| `pnpm start-next-appdir`                | Run the Next.js App Router demo app (linked to `dist/`) |

> ⚠️ The legacy CSS generation step (`scripts/build/*`, `src/bin/*`) consumes
> `@gouvfr/dsfr` **at build time only**. Consumers never install it.

## Architecture & package layout

```text
src/
├── styles/            # the SDS CSS foundation (tokens, themes, layout, utilities,
│   │                  #  components/…) — published and loaded by main.css
├── assets/            # static assets shipped with the package
├── sds/               # SDS foundations: token contracts (colors, type, space, …)
├── native/            # SDS Native Foundation (React Native / Expo) — published as
│   │                  #  @skygenesisenterprise/react-sds/native, no DOM/CSS dependency
├── fr/                # token helpers (legacy namespace, renamed with the CSS layer)
├── BackToTop.tsx      # floating "back to top" button (styles in styles/components/)
├── <Component>.tsx    # one module per component — subpath imports, tree-shakable
├── next-app-router/   # Next.js App Router helpers (server + client)
├── next-pagesdir.tsx  # Next.js Pages Router helpers
├── mui/               # optional MUI adaptation layer
└── bin/               # CLI tools (react-sds optimize-css, copy-static-assets, …)
```

Component usage follows `import { X } from "@skygenesisenterprise/react-sds/X"` — bundlers then
only include the modules you import. The CSS foundation is importable as a whole
(`@skygenesisenterprise/react-sds/main.css`) or file by file
(`@skygenesisenterprise/react-sds/styles/layout.css`, `@skygenesisenterprise/react-sds/styles/themes.css`,
`@skygenesisenterprise/react-sds/assets/sds/tokens.css`, …).

## Provenance & licensing

This project started as a fork of [`codegouvfr/react-dsfr`](https://github.com/codegouvfr/react-dsfr)
(MIT), itself the React integration of the French government's DSFR. The fork retains the
upstream Git history. It is being transformed — step by step, without rewriting what is
technically sound — into the official React library of the **Sky Genesis Enterprise Design System**.

Read [PROVENANCE.md](PROVENANCE.md) for the honest account of this lineage and the
attribution obligations that follow. The code is MIT licensed (see [LICENSE](LICENSE)).

## Governance

This module is developed and maintained in the open by the digital services of the Republic
of SGE, under the governance described in [GOVERNANCE.md](GOVERNANCE.md). Security
matters: see [SECURITY.md](SECURITY.md).

## Releases & versioning

The package follows [Semantic Versioning](https://semver.org). Releases are cut from the
`main` branch and published to npm — see [GOVERNANCE.md](GOVERNANCE.md) and
`.github/workflows/ci.yaml`. Changes are tracked in [CHANGELOG.md](CHANGELOG.md).
