# Changelog

All notable changes to `@skygenesisenterprise/react-sds` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this
project adheres to [Semantic Versioning](https://semver.org).

> Note: the Git history before this release line belongs to the upstream
> `codegouvfr/react-dsfr` project (see [PROVENANCE.md](PROVENANCE.md)). From `0.1.0`
> onwards this changelog tracks the independent SGE Design System release line.

## [1.1.0] - 2026-11-06

Consolidation of the design system: one institutional foundation, one identity across
platforms, and the tests that keep it true.

### Added

- **Token coherence infrastructure** (`scripts/tokens/`): a reader for the `--sge-*` custom
  properties, OKLCH → sRGB conversion, WCAG contrast math, and a generator for the React
  Native palette. `pnpm tokens:sync` rewrites `src/native/tokens/colors.ts` from the CSS;
  `test/runtime/lib/token-sync.test.ts` fails when it is stale, when the typed `sdsTokens`
  contract drifts from the CSS light theme, or when a stylesheet consumes an undeclared
  `--sge-*` property.
- **`src/styles/foundation/dimensions.css`** and the `SDSDimensionTokens` contract: breakpoints,
  containers, content widths, control heights, icon sizes and the focus ring, separated from
  the spacing scale. Layout rules now consume these tokens instead of hard-coded widths.
- **`/tokens` public entry** (`import "@skygenesisenterprise/react-sds/tokens"`): the tokens and
  the default theme, with no reset and no element styling.
- **Tests**: cross-platform token sync, measured WCAG 2.2 contrast in both themes, CSS
  foundation integrity (no Tailwind directive, no `fr-*` class, adapters opt-in, tokens entry
  side-effect free, reduced-motion coverage), and the enriched packaging tests.
- [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md): the architecture reference (layers, token contract,
  entry points, themes, component conventions, platform scope, Tailwind limits, migration).

### Changed

- **Typography strategy**: the foundation no longer requests `Marianne` (a French State
  typeface inherited from the legacy lineage, never part of the SGE identity and not
  redistributed by this package). The institutional stack is the platform UI stack; products
  that load an official SGE webfont override `--sge-font-family-sans`.
- **React Native colors are generated** from the CSS foundation instead of being maintained by
  hand. The palette is unchanged (the generated values are byte-identical to the previous
  ones) but it can no longer drift. The native token set gains `card`, `popover`,
  `primary/secondary/muted/accent-foreground` and `destructive(-foreground)`.
- The `exports` map is regenerated: `./tokens`, `./tailwind-preset` and
  `./assets/tailwind-preset` are now declared (the v3 preset file shipped without an export).
- `react` is declared as a peer dependency (`^18.0.0`) instead of being absent from the
  manifest.
- **The build only writes to `dist/`**: the vendored stylesheet is staged in `dist/legacy/`
  instead of a package-root `legacy/` directory, so every relative import of `dist/main.css`
  resolves inside the published tarball. `files` no longer lists `legacy/`, and the
  `./legacy/*` export now points at `./dist/legacy/*`.

### Fixed

- **Dark theme destructive label contrast**: white on `#ef4444` measured 3.76:1, below the
  WCAG AA floor for a button label. The red is unchanged; `--sge-color-destructive-foreground`
  now resolves to the deep neutral in the dark scheme (4.99:1).
- **legacy cascade order drift**: `display` was missing from `LEGACY_COMPONENTS_CASCADE_ORDER`, so
  `react-sds optimize-css` ordered the rebuilt stylesheet against an outdated index. Detection
  has no class prefix for it (it only styles a descendant of `.fr-fieldset__element`).
- **CI never ran on the default branch**: the workflow was triggered on `main` while the
  repository default branch is `master`; both are now covered.
- **`publish-on-tag` shipped an inconsistent package**: the local-linking artifacts were
  supposed to be skipped through `-- --prePublish`, but `--` turned the flag into a
  positional argument, so the job published the local-linking layout while `main.css`
  pointed at stylesheets that were not in the tarball. It also ran denoify's
  `enable_short_npm_import_path`, which rewrote the generated `exports` map. The job now
  builds the published layout, asserts it and runs the test suite before publishing.

## [1.0.10] - 2026-09-15

### Fixed

- **Subpath imports no longer fail with `TS2307 Cannot find module`.** Consumers (e.g.
  `skygenesisenterprise/education`) importing `@skygenesisenterprise/react-sds/Header`,
  `/SkipLinks`, `/MainNavigation`, `/MainNavigation/MegaMenu` or `/Display` got a
  module-not-found error because the `package.json` `exports` map relied on a single
  `"./*"` wildcard:
  - For a directory-shaped component (`Header`) the target resolved to `./dist/Header`
    — a directory, which neither Node.js nor TypeScript turns into `index.js`/`index.d.ts`.
  - For a flat component (`SkipLinks`) the target resolved to the extension-less
    `./dist/SkipLinks`, which neither Node.js nor TypeScript completes with `.js`/`.d.ts`.
  - The wildcard has therefore been replaced by an explicit, exhaustive `exports` map
    generated by `scripts/build/list-exports.ts` from the real `dist/` content at every
    `pnpm build`. Every declared target is a file that actually exists after the build.
  - The map covers every emitted module (root entry, flat components, directory
    components with an index, deep subpaths such as `MainNavigation/MegaMenu`, the
    `native`/`sds`/`fr` namespaces, CSS/asset entries, the Discord isolation subpaths and
    the legacy `legacy/*` tree), so the previously working imports keep working and the
    reported ones now resolve under `moduleResolution: node`, `node16` and `bundler`.

### Added

- **Packaging tests** (`test/runtime/package/package-exports.test.ts`) that exercise the
  built package exactly as a consumer resolves it:
  - the committed `exports` map matches what the build generates from `dist/`;
  - every target referenced by `exports` exists;
  - a consumer layout (`node_modules/@skygenesisenterprise/react-sds`) type-checks the public
    root and subpath imports with no `TS2307`, under `node`, `node16` and (when a
    TypeScript ≥ 5 is installed) `bundler` resolution;
  - Node.js runtime resolution of the same subpaths.
- The `publicModuleCoverage` guard now asserts that every public `src/` subpath has an
  explicit export (and that no `"./*"` wildcard is used).

### Changed

- Package version bumped to `1.0.10`.
- `pnpm build` now regenerates `package.json` `exports` from `dist/` (via
  `scripts/build/list-exports.ts`), keeping the map in sync with the emitted files and
  deriving the local-linking `dist/package.json` from it.

## [0.1.0 – 1.0.9]

> Entries accumulated during the rebranding and native-foundation stages of the fork, before
the `1.0.10` packaging fix. Kept as history, newest first below.

### Added

- **SDS Native Foundation — official React Native / Expo support.** New public
  entry `@skygenesisenterprise/react-sds/native` (`src/native/`) implementing the Sky Genesis Enterprise
  Design System on React Native primitives (`View`, `Text`, `Pressable`,
  `TextInput`, `Modal`, `FlatList`, …). The native layer shares the SDS tokens
  and conventions with the web implementation, never imports the DOM/CSS stack,
  and is never pulled into the web bundle.
  - **Native tokens** — colors (light + dark), typography, spacing (`xs`–`xl`),
    radius (`sm`–`lg`/`full`), elevation (iOS shadow + Android elevation),
    dimensions (touch targets ≥ 44 pt, control heights, gutters), motion.
  - **Theme** — `SDSProvider`, `useSDSTheme` with `light`/`dark`/`system` color
    scheme, token overrides and an overridable icon renderer.
  - **Primitives** — `Text`, `Heading`, `Icon`, `Divider`, `Stack`, `Container`.
  - **Actions** — `Button`, `IconButton`, `Link`.
  - **Forms** — `Input`, `TextArea`, `Checkbox`, `Radio`, `RadioGroup`,
    `Switch`, `Select`.
  - **Feedback** — `Alert`, `Badge`, `Status`, `Progress`, `Loading`.
  - **Layout / content** — `Card`, `List`, `ListItem`, `Section`, `Avatar`.
  - **Navigation primitives (graphical only, no router)** — `Header`, `TabBar`,
    `NavItem`.
  - **Institutional components** — `ServiceCard`, `ProcedureCard`, `DocumentCard`,
    `NotificationCard`, `IdentityBadge`, `StatusBadge`, `GovernmentBanner`
    (generic across applications).
  - **Accessibility & touch** — `accessibilityLabel`/`Hint`/`Role`/`State`,
    disabled and loading states announced to assistive technologies, thumb-sized
    touch targets.
- Runtime tests for the native layer (tokens, component rendering with a mocked
  React Native, exports, module resolution/isolation) — see
  `test/runtime/native/`.
- `examples/native/ExampleScreen.tsx` — a minimal Expo consumption example
  (demonstration only, no SGE logic).
- `react-native` registered as an optional peer dependency (web consumers are
  unaffected).

### Changed

- Package version bumped to `1.0.7`.
- The component CSS optimizer module map now treats `native` and `styles` as
  non-legacy modules (neither renders legacy component markup).
- **Breaking — `Header` reworked into the institutional header of Sky Genesis Enterprise of
  Sky Genesis Enterprise.** The `brandTop` and `operatorLogo` props are replaced by a single `identity`
  prop describing the corporate identity (official brand lockup as an image, with
  `alt`) and the administrative authority hosting the site (`institution`, e.g.
  `"Sky Genesis Enterprise"` or `"Organisation de l'Économie"`). The identity block links to the home
  page; `navigation`, `quickAccessItems` and the search props are unchanged and remain
  strictly separated from the identity. The product/portal name still lives in the
  optional `serviceTitle` / `serviceTagline` zone.
- **Breaking — `Footer`** mirrors the same institutional identity: the `brandTop` prop is
  replaced by an optional `identity` prop that falls back to the one of the `<Header />`
  when the Footer is rendered after it.
- The Header/Footer brand zone no longer renders the legacy tricolor block
  (`.fr-logo`): it displays the Sky Genesis Enterprise lockup via the new companion stylesheet
  `src/assets/sge-identity.css` (provisional until the SDS stylesheet lands —
  [MIGRATION.md](MIGRATION.md)).
- Rebranded the package as `@skygenesisenterprise/react-sds` (SGE Design System — React),
  with its own version line starting at `0.1.0`.
- New root entry: generic components (`Button`, `Alert`, `Card`, …) can now be imported
  from the package root; per-component subpath imports remain available and recommended
  for granular bundles.
- CLI renamed: `French design-system` → `react-sds` (`react-sds optimize-css`, …).
- Repository migrated from Yarn to pnpm (`pnpm-lock.yaml`).
- Documentation (README, Storybook, publiccode.yml, contribution and governance docs)
  rewritten for the SGE Design System.

### Added

- `src/assets/sge-identity.svg` — official Sky Genesis Enterprise identity lockup (flag/
  emblem + "Sky Genesis Enterprise"), used by the Header/Footer stories and demo apps. A
  web-optimized SVG should eventually replace the raster in production.
- `src/assets/sge-identity.css` — companion stylesheet of the Header and Footer
  institutional brand zone.
- `src/global.d.ts` now declares `*.css` modules (side-effect stylesheet imports).
- `src/sds/` — SDS design-token contracts (colors, typography, spacing, radius, elevation,
  motion, breakpoints) exposed as typed constants and CSS custom properties
  (`--sge-*`). Values are placeholders pending the official SGE identity.
- Security policy, governance, provenance and migration documentation.
- CI: pnpm-based pipeline with lint, typecheck (build), tests, package validation,
  dependency auditing and provenance-ready publishing.

### Removed

- France-specific components and modules (MIGRATION Stage 2): `FranceConnectButton`,
  `AgentConnectButton`, `ProConnectButton`, `MonCompteProButton`, `eulerianAnalytics`, their
  dedicated assets (`agentconnect*`, `proconnect-btn.css`, `moncomptepro.css`) and their
  Storybook stories. The `react-sds optimize-css` module map and the Storybook navigation
  were updated accordingly.

### Changed

- The `Footer` no longer ships French default content: the `domains` prop defaults to an
  empty list (previously French government domains) and no licence mention is rendered when
  the `license` prop is not provided (previously an Etalab licence-ouverte notice).
  Consumers migrating from the fork must provide these props explicitly.
- Removed French demo/legacy doc URLs and references from Storybook stories, code comments
  and default copy (consent management is now phrased around a generic data-protection
  policy).

### Deprecated

- The legacy layer (`legacy/` assets, `fr-*` class names, `fr` namespace, `Legacy*`
  helpers) is kept as an isolated, documented implementation layer. It will be removed in
  a single coordinated breaking release — see [MIGRATION.md](MIGRATION.md).
