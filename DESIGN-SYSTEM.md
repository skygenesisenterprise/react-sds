# Sky Genesis Enterprise Design System (SDS)

> **The official design system and shared UI foundation of Sky Genesis Enterprise.**

`@skygenesisenterprise/react-sds` is the single distribution of this design system: the
institutional foundation (tokens, themes, CSS, type), the common React components, the
React Native foundation, and the Tailwind adapters. One package, one identity, several
consumption environments.

This document is the architectural reference. The narrative README, the migration roadmap
([MIGRATION.md](MIGRATION.md)) and the historical audit ([AUDIT.md](AUDIT.md)) explain how the
project got here; this file states what the system _is_ and what a product may rely on.

---

## 1. Philosophy

- **The identity belongs to SGE.** Notploy was the initial visual reference, not the owner of
  the charte. Token values live in this repository and are edited only here.
- **One base, many products.** Notploy, Astron Collection, Aether, Learn… share the same
  foundation and keep their own business components and UX specifics.
- **Technology-neutral foundations.** The canonical layer is plain CSS custom properties: no
  Tailwind, no React, no framework, no reset imposed on the host application.
- **Progressive migration, no regression.** The historic legacy components keep working
  while the SGE layer replaces them piece by piece. Nothing is deleted before its replacement
  is verified.

## 2. The three layers

| Layer                        | What it is                                                                 | May a product change it?                    |
| ---------------------------- | -------------------------------------------------------------------------- | ------------------------------------------- |
| **Institutional foundation** | `--sge-*` tokens, themes, reset/base, typography, accessibility, utilities | No — consume it, override variables only    |
| **Common components**        | SDS families (`SDS*`), historic generic components (`Button`, `Table`, …)  | Configure through props; do not fork        |
| **Product extensions**       | A product's own screens, business components, product-specific accents     | Yes — that is where product character lives |

A product that needs a different primary color overrides the token in **its own** stylesheet;
it never re-declares the scale, the spacing or the components.

## 3. Repository layers

```text
src/styles/      Canonical CSS foundation (tokens, themes, base, components, utilities)
src/sds/         Typed token contract + SDS component families (layout, typography, portal, content)
src/native/      React Native foundation, same semantic contract, no DOM/CSS
src/fr/          Legacy legacy token helpers (historic layer, migration in progress)
src/assets/      Static assets, public token re-export, Tailwind v3 preset
src/*.tsx        Historic generic components (Button, Alert, Header, …)
scripts/build/   Build: tsc, assets, CSS copy, exports map generation
scripts/tokens/  Token tooling: CSS reader, OKLCH→sRGB, native palette generator
```

## 4. Design tokens

The canonical namespace is `--sge-*`, in two tiers:

```css
:root {
    /* Primitive — raw palette, never consumed by product code. */
    --sge-palette-neutral-950: oklch(0.1913 0 0);
    --sge-palette-primary-700: oklch(0.42 0.033 100.6306);

    /* Semantic — what components and products consume. */
    --sge-color-background: …;
    --sge-color-foreground: …;
    --sge-color-primary: …;
}
```

| Family     | File                        | Tokens                                                                           |
| ---------- | --------------------------- | -------------------------------------------------------------------------------- |
| Colors     | `foundation/colors.css`     | `--sge-palette-*` primitives; semantic values per theme                          |
| Typography | `foundation/typography.css` | families, sizes, weights, line heights, tracking                                 |
| Spacing    | `foundation/spacing.css`    | 4px-grid scale `--sge-space-1…12`                                                |
| Dimensions | `foundation/dimensions.css` | breakpoints, containers, content widths, control heights, icon sizes, focus ring |
| Radius     | `foundation/radius.css`     | `none` → `full`                                                                  |
| Elevation  | `foundation/shadows.css`    | `2xs` → `2xl`, theme-dependent                                                   |
| Motion     | `foundation/motion.css`     | durations, easings, ready-to-use transitions, reduced-motion collapse            |

Rules:

- Components use **semantic** tokens only; primitives are an implementation detail.
- Spacing is internal rhythm; **dimensions** answer width/height questions. The two are never
  mixed (a container width is not a spacing step).
- A token exists once, with one name. Tailwind-compatible aliases (`--sge-radius-sm`, …) are
  aliases, never definitions.
- Any palette change must be justified by a concrete readability, coherence or accessibility
  problem — never by convenience.

### One identity, three representations

| Representation         | File                          | Produced by                       | Guarantee                                     |
| ---------------------- | ----------------------------- | --------------------------------- | --------------------------------------------- |
| CSS custom properties  | `src/styles/**`               | hand-edited — **the source**      | canonical                                     |
| Typed contract (React) | `src/sds/tokens.ts`           | hand-edited                       | validated against the CSS light theme         |
| React Native values    | `src/native/tokens/colors.ts` | `pnpm tokens:sync` (OKLCH → sRGB) | **generated**; the file is replaced wholesale |

`test/runtime/lib/token-sync.test.ts` fails when the native file is not the output of the
current CSS, when the typed contract drifts from the CSS, or when a stylesheet consumes a
`--sge-*` property nothing declares. A token can therefore not be changed for one platform
only.

Editing a color is always: change the CSS → `pnpm tokens:sync` → run the tests.

## 5. CSS entry points

| Import                                                  | Contains                                                                               | Side effects                              |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------- |
| `@skygenesisenterprise/react-sds/tokens`                | `--sge-*` custom properties + light theme only                                         | none — no reset, no element rules         |
| `@skygenesisenterprise/react-sds/styles`                | tokens + themes + reset + base + typography + accessibility + layout + utilities       | styles `html`/`body` and element defaults |
| `@skygenesisenterprise/react-sds/main.css`              | everything in `styles` **plus** the legacy vendor stylesheet styling `fr-*` components | full page styling                         |
| `@skygenesisenterprise/react-sds/styles/tokens.css`     | legacy alias of `tokens`                                                               | none                                      |
| `@skygenesisenterprise/react-sds/assets/sds/tokens.css` | legacy alias of `styles/tokens.css`                                                    | none                                      |

`main.css` is **not** free of the legacy stylesheet: the historic components emit `fr-*` class names that only
exist in the bundled legacy stylesheet. Products that only use SDS components can depend on
`styles` alone; `main.css` is the compatible entry while the migration continues
(see [MIGRATION.md](MIGRATION.md)).

## 6. Themes

```html
<html data-sge-theme="dark"></html>
<html data-sge-theme="light"></html>
```

- Light is the default, including when no attribute is set: SGE never forces dark mode.
- `data-sge-theme="dark"` is the stable convention. `.dark` and `[data-fr-theme="dark"]` remain
  honored so applications already driving a scheme keep working during the migration.
- `color-scheme` is declared per theme, so native form controls and scrollbars follow.
- Switching the attribute at runtime works: every semantic token is re-declared by the theme
  selector, components re-render with no reload.
- No theme flash is guaranteed by the CSS alone only when the attribute is present in the
  initial HTML. Applications that resolve the scheme client-side can import
  `@skygenesisenterprise/react-sds/early-color-scheme.js` (or the Next.js helpers) before paint.

## 7. Components

Supported by convention, on every component family:

- **Variants** through props (`priority`, `size`, `variant`, `tone`), never by adding classes
  from outside the library.
- **States**: `hover`, `active`, `focus-visible`, `disabled`, `loading` where relevant,
  each with its own token-driven style.
- **Composition**: layout primitives (`SDSStack`, `SDSGrid`, …) plus components; slots are
  props (`children`, `footer`, `media`), not internal CSS overrides.
- **Theming**: a component reads semantic tokens only, so it follows the active theme.
- **Customization**: a product either overrides a `--sge-*` variable or passes `className` /
  `style`; it never edits the library's internals.

New components use the SGE foundation exclusively and add **no** new legacy dependency.
Historic components stay on the legacy layer until their SGE styles are implemented and
covered by non-regression tests.

## 8. React and React Native compatibility

React (web):

- `react` is a **peer** dependency (`^18.0.0`); the package never bundles a second React.
- TypeScript 4.9+ declarations, tree-shakable subpath exports (`…/Button`), root entry
  `…` re-exporting the generic components. Optional integrations (MUI, charts, Discord,
  Next.js helpers) are not pulled by the root entry.
- Renovate/React 19 is **not** declared as supported: it has not been validated.

React Native (`@skygenesisenterprise/react-sds/native`):

- Isolated entry: it never imports the DOM/CSS stack, and the web bundle never imports it.
- Provides foundations, actions, forms, feedback, layout/content primitives, navigation
  primitives and institutional cards. It does **not** provide a router, the historic `fr-*`
  components, charts, the MUI layer or any CSS-based component.
- Shares the semantic color contract with the web (generated, see §4); spacing/typography/
  dimensions are platform-adapted (points, platform font) rather than pixel-identical.

## 9. Tailwind adapters

Tailwind is a **consumer** of the tokens, never a source.

| Adapter              | Entry                               | Usage                                                                   |
| -------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| Tailwind v3 preset   | `…/tailwind-preset`                 | `presets: [require("@skygenesisenterprise/react-sds/tailwind-preset")]` |
| Tailwind v4 theme    | `…/styles/adapters/tailwind-v4.css` | import after `…/styles`                                                 |
| shadcn-style aliases | `…/styles/adapters/tailwind.css`    | opt-in, maps `--background`, `--primary`, … to `--sge-*`                |

Known limits, by design:

- Colors are `var(--sge-*)` references, so Tailwind's opacity modifier (`bg-primary/50`) does
  not apply. Use `color-mix()` in an arbitrary value when translucency is needed.
- The adapters do not import the foundation: the application loads `…/styles` once, so the
  active theme keeps working and no duplicate reset is applied.
- The preset extends `theme.extend`, so an application's own Tailwind config keeps
  precedence and no conflict is introduced.
- An application that does not use Tailwind needs nothing from this section.

## 10. Development conventions

- Tokens come before components: no hard-coded color, radius, shadow, duration or size in a
  component.
- Plain CSS for the foundation (`@import` only, no preprocessor, no `@apply`).
- Every public entry is exercised by a test; the `exports` map is generated from `dist/`, so a
  declared target always exists.
- Accessibility is part of acceptance: semantic markup, keyboard path, visible focus,
  announced errors, `prefers-reduced-motion` respected, WCAG AA contrast measured in both
  themes (`test/runtime/lib/theme-contrast.test.ts`).
- No compatibility claim without a test: if it is not asserted, it is not supported.

## 11. Versioning and release

- Semantic versioning; the release line is independent from the upstream `French design-system` fork
  (see [PROVENANCE.md](PROVENANCE.md) and [CHANGELOG.md](CHANGELOG.md)).
- A tag `vX.Y.Z` triggers the publish workflow, which aligns `package.json` with the tag.
- Breaking changes are grouped: the `fr` → `sds` namespace rename, the class rename and the
  removal of the legacy layer ship together, with a migration note.
- Nothing is published from a feature branch or by hand in CI.

## 12. Migration strategy

1. **Foundation first** — products adopt `…/styles` (or `…/tokens` for a host that already has
   a reset) and delete their local charte.
2. **Components next** — replace local reimplementations with SDS components; keep product
   components for business behavior.
3. **Legacy last** — historic `fr-*` components remain available; the `fr` namespace is
   deprecated in favour of `sdsTokens`. The legacy stylesheet is dropped only when every
   published component has an SGE implementation (tracked in MIGRATION.md).

## 13. Mandatory / common / extension — summary

- **Mandatory**: `--sge-*` semantics, themes, reset/base, typography scale, accessibility
  rules, focus treatment, motion policy. A product may override values, never remove them.
- **Common**: SDS families and historic generic components; shared, configurable through
  props.
- **Extensions**: product-specific components, product accents, marketing art direction. They
  build on the foundation and never redefine it.
