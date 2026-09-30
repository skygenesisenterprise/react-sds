# Audit — react-dsfr → @skygenesisenterprise/react-sds

> Step A of the SDS migration mission. This document is the state of play produced **before**
> the mass rebranding, so every later change can be checked against it. Classification labels:
>
> -   **KEEP** — technically relevant, stays as is (possibly renamed later).
> -   **MIGRATE** — kept for now but must be replaced / rewired to SDS in a later stage.
> -   **REMOVE** — candidate for deletion (nothing was deleted during the audit itself).
> -   **REFACTOR** — logic to preserve, structure/branding to change.
> -   **CREATE** — missing piece to build.

Repository audited: `main` @ `7f06079` (+ uncommitted pnpm migration and package rename start).

> **Status updates since this audit was written** (the audit itself is kept as the historical
> baseline; progress is tracked in [MIGRATION.md](MIGRATION.md)):
>
> -   0.1.0 — surface rebranding (package name/docs/CLI/Storybook) done (Stage 1).
> -   0.2.0 (this session) — Stage 2 done: the French identity-provider components
>     (`FranceConnectButton`, `AgentConnectButton`, `ProConnectButton`, `MonCompteProButton`)
>     and `eulerianAnalytics` were removed with their assets and stories; the `optimize-css`
>     module map and Storybook navigation were updated. Stage 3 done: French default content
>     neutralized (`Footer` domains/licence, GDPR-flavored comments). Stories, code comments
>     and docblocks were swept of French DSFR/demo URLs. The Chart module stays as documented
>     legacy until the SDS stylesheet (Stage 4) lands.

---

## 1. What this repository is

A fork lineage of [`codegouvfr/react-dsfr`](https://github.com/codegouvfr/react-dsfr)
(v1.34.0-era), the React integration of the French **DSFR** ("Système de Design de l'État").
Git history and 225+ merged PRs are upstream react-dsfr history; the remote is already
`skygenesisenterprise/react-sds` and an uncommitted pnpm migration plus package rename were started
(`package.json`, `LICENSE`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`).

High-value existing work to preserve (do not rewrite):

| Area                                                                         | Location                                                            | Verdict                                    |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------ |
| React components (Button, Alert, Accordion, Modal, Tabs, Table, …)           | `src/*.tsx`                                                         | **KEEP**                                   |
| Design-token hub (`fr` object: breakpoints, spacing, colors, cx, typography) | `src/fr/*`                                                          | **KEEP** (namespace renamed later, see §3) |
| Types generated from the stylesheet                                          | `src/fr/generatedFromCss/*` (gitignored, generated)                 | **KEEP**                                   |
| Subpath package layout (tree-shakable, `@…/react-sds/Button`)                | whole `src/`                                                        | **KEEP**                                   |
| Unit tests (vitest) incl. generated-code and tree-shaking tests              | `test/runtime/**`                                                   | **KEEP**                                   |
| Storybook showcase + docs                                                    | `stories/**`, `.storybook/**`                                       | **REFACTOR** (branding)                    |
| Integration apps (CRA / Vite / Next pages / Next app dir)                    | `test/integration/*`                                                | **KEEP** (dev only, update package name)   |
| Build pipeline (CSS→TS generation, dsfr asset bundling, tsc ×2)              | `scripts/build/*`                                                   | **KEEP**                                   |
| CLI tooling (optimize-css, tree-shaking of CSS/icons, static asset copy)     | `src/bin/*`                                                         | **REFACTOR** (rename + rebrand messages)   |
| SSR helpers (Next pages/app dir providers, no-flash dark mode, fonts)        | `src/next-app-router/*`, `src/next-pagesdir.tsx`, `src/useIsDark/*` | **KEEP**                                   |
| consent management (cookie banners, i18n)                                    | `src/consentManagement/*`                                           | **KEEP**                                   |
| MUI adaptation layer                                                         | `src/mui/*`                                                         | **KEEP**                                   |
| i18n mechanism                                                               | `src/i18n.ts`, stories `LangProvider`                               | **KEEP**                                   |

## 2. DSFR / French references — measured

Counts are files containing the term (tracked files, lockfiles and `node_modules` excluded).

| Term                                          | Files   | Main areas                                                       |
| --------------------------------------------- | ------- | ---------------------------------------------------------------- |
| `dsfr` / `DSFR`                               | 211     | `src` 82 · `stories` 59 · `test` 50 · scripts/.storybook/READMEs |
| `react-dsfr`                                  | 174     | `src` 69 · `stories` 58 · `test` 38                              |
| `@codegouvfr`                                 | 64      | imports & tool paths in `src`, tests, integration apps           |
| `codegouvfr/react-dsfr` (GitHub links)        | ~101    | docblocks `@see`, stories, READMEs                               |
| `gouv.fr` (incl. `systeme-de-design.gouv.fr`) | 68      | docs/URLs + runtime strings in FR-specific components            |
| `codegouvfr`                                  | 114     | READMEs, workflows, docs, comments                               |
| `france` / `French`                           | 32 / 4  | branding + FR-specific components                                |
| `Etalab`                                      | 4       | README, publiccode, CONTRIBUTING                                 |
| `gouvernement` / `GouvernementFR`             | 22 / 12 | READMEs, patch notes, FR-specific code                           |
| `systeme-de-design.gouv.fr`                   | 59      | docblock URLs, READMEs                                           |

### Functional (code path / behavior) references to the DSFR layer

| Reference                                                                                | Role                                                                                                                                                              | Verdict                                                               |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `@gouvfr/dsfr` (devDependency, `1.14.2`)                                                 | **build-time only**: copied to `dsfr/` and compiled to CSS/TS by `scripts/build`                                                                                  | **MIGRATE** — isolate, replace last                                   |
| `patches/@gouvfr+dsfr+1.14.2.patch`                                                      | patch-package fix applied on install                                                                                                                              | **MIGRATE**                                                           |
| `@gouvfr/dsfr-chart` (optional peer dep)                                                 | charts (`src/Chart/*`) import its CSS                                                                                                                             | **MIGRATE** (or drop with charts)                                     |
| `dsfr/` generated asset folder (gitignored, published)                                   | package ships DSFR css/fonts/icons; imported as `@skygenesisenterprise/react-sds/dsfr/...`                                                                                 | **MIGRATE** — becomes SDS assets                                      |
| `src/fr/generatedFromCss` (gitignored, generated)                                        | types + `fr.cx` class names derived from DSFR CSS                                                                                                                 | **MIGRATE**                                                           |
| `fr-` CSS class names in every component                                                 | bound to the DSFR stylesheet                                                                                                                                      | **MIGRATE**                                                           |
| `fr` namespace (`import { fr } from …/fr`)                                               | exported token hub                                                                                                                                                | **MIGRATE** (rename to `sds` in the same breaking release as the CSS) |
| `window.dsfr` / `./dsfr/dsfr.module` in `src/start.ts`                                   | DSFR JS runtime init                                                                                                                                              | **MIGRATE**                                                           |
| `useBreakpointsValues`, `useColors`                                                      | expose DSFR color decisions                                                                                                                                       | **KEEP** (logic), rebrand later                                       |
| `REACT_DSFR_PACKAGE_NAME` in `src/bin/only-include-css-of-used-components.ts`            | import-path detection table                                                                                                                                       | **REFACTOR** (now)                                                    |
| FR identity-provider components                                                          | `src/FranceConnectButton.tsx`, `AgentConnectButton.tsx`, `ProConnectButton.tsx`, `MonCompteProButton.tsx` + `src/assets/{agentconnect,proconnect,moncomptepro}.*` | **REMOVE** (kept for now — see §6)                                    |
| `src/eulerianAnalytics.ts`                                                               | French analytics vendor bridge                                                                                                                                    | **REMOVE** (kept for now)                                             |
| `consentManagement` default strings                                                      | RGPD-oriented copy                                                                                                                                                | **REFACTOR** later (i18n-able already)                                |
| French gov links in Header/Footer content props, `language-select.css`, `search-bar.css` | FR-specific content/formatting                                                                                                                                    | **KEEP** (data-driven, replaced via props)                            |
| `Marianne` / `Spectral` fonts, FR favicons                                               | DSFR font assets                                                                                                                                                  | **MIGRATE** (last, with identity)                                     |

## 3. Branding / documentation references (safe to rebrand now)

-   Docblock URLs `https://github.com/codegouvfr/react-dsfr/...` (src & stories “see source code”).
-   Docblock URLs `https://components.react-dsfr.codegouv.studio/?path=/docs/...` (~56 files).
-   Docblock URLs `https://react-dsfr.codegouv.studio/...` guides links (~59 files).
-   `README.md` / `README.fr.md` — full rewrite (DSFR feature claims, governance, use-cases).
-   `publiccode.yml` — French metadata (Etalab, French maintainers, `countries: FR`, DSFR wording).
-   `CONTRIBUTING.md` — react-dsfr links & guidance.
-   `.storybook/` — brand: manager-head meta, customTheme (`@codegouvfr/react-dsfr`, Marianne),
    preview order labels (🇫🇷 Introduction), docs container title.
-   `stories/intro.stories.mdx` — DSFR marketing copy + video.
-   `package.json` — name/description done; still: keywords (`dsfr`), author, version, bin names
    (`react-dsfr`), `files`/`exports` audit.
-   CLI help/README `src/bin/README.md`, messages in `src/bin/*`.
-   Comments referencing the French ecosystem (RÉF. above).
-   `test/runtime/**` fixtures & import strings using the old package name.

## 4. Package metadata (audit)

-   name: `@skygenesisenterprise/react-sds` (already changed), version `1.34.0` → start own line at `0.1.0`.
-   `main`/`types`/`module` → `dist/fr/index.js` (`fr` root export). Kept for now; revisit when
    the `fr` namespace becomes `sds` (single breaking 1.0.0 later).
-   `files`: `src/`, `dist/`, `dsfr/` (+ negations). No obvious secret/dev-artifact risk
    (`dist/bin` built from `src/bin` is intended; `.storybook`/`stories`/`test` are NOT published).
-   `bin`: `react-dsfr`, `copy-dsfr-to-public`, `only-include-used-icons` → rename `react-dsfr` to
    `react-sds`, keep the two legacy asset/icon bins (they operate on the legacy `dsfr/` assets).
-   No `exports` map in-repo: subpath map is produced at publish time by
    `denoify enable_short_npm_import_path` (see `.github/workflows/ci.yaml`). Don't add one by hand.
-   Peer deps: `@gouvfr/dsfr-chart` (optional) — keep until charts decision.
-   Runtime deps: `tsafe`, `yargs-parser` — both generic, **KEEP**.
-   Lockfiles: `yarn.lock` (root, to be removed) + `pnpm-lock.yaml` (new); integration apps keep
    their own `yarn.lock`.

## 5. Tooling & CI (audit)

| Item                        | State                                                                | Verdict                                                              |
| --------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| package manager             | pnpm-lock + workspace file added, workflows still `yarn`             | **REFACTOR** (align CI + docs on pnpm)                               |
| Node                        | 22 in CI                                                             | **KEEP**                                                             |
| TypeScript                  | 4.9                                                                  | **KEEP** (old but consistent; no justification for a major bump now) |
| Storybook                   | 6.5 + webpack5                                                       | **KEEP** (major upgrade is a separate workstream)                    |
| vitest                      | 0.24                                                                 | **KEEP**                                                             |
| eslint/prettier             | standard                                                             | **KEEP**                                                             |
| `.github/workflows/ci.yaml` | yarn, `garronej/ts-ci` version-gate, auto-release/publish            | **REFACTOR** (pnpm, drop ts-ci, provenance-ready)                    |
| `publiccodeyml-check.yml`   | pin-based, fine                                                      | **KEEP**                                                             |
| Security posture            | no SECURITY.md, no dependabot, no CODEOWNERS, publish uses npm token | **CREATE**                                                           |

## 6. France-specific components — rationale (kept during audit, no deletion)

Nothing was deleted during this audit. The French identity-provider buttons and the Eulerian
bridge are self-contained modules that cannot exist under an SGE brand:
`FranceConnectButton`, `AgentConnectButton`, `ProConnectButton`, `MonCompteProButton`
(+ their storybook stories, docs and `src/assets/*` SVGs/CSS), `src/eulerianAnalytics.ts`.
They are classified **REMOVE** (next stage) because their removal:

-   does not affect any generic component (no cross-imports),
-   is safe for published package size and brand coherence,
-   can be done in one commit together with their stories.

The Chart module (`src/Chart/*`, `@gouvfr/dsfr-chart`) is classified **REMOVE or MIGRATE**
(depends on whether SGE needs charts backed by the legacy chart CSS).

`dsfr_plus_icons.css/scss` (`src/assets`) is a styling bridge used by the MUI layer
(`DsfrHead`), not a public component — **MIGRATE** with the MUI layer decision.

## 7. Risks / constraints for the transformation

1. **CSS is the deepest coupling.** Components emit `fr-*` class names; those classes exist
   only because the build compiles the `@gouvfr/dsfr` stylesheet (fonts, colors, layout,
   print CSS, JS hooks like `data-fr-js-*`). A real SDS identity therefore means producing a
   new stylesheet with `sds-*` classes and SGE tokens — weeks of work that must not block
   the rebranding of everything above it.
2. **`fr` is public API.** `import { fr } from "@skygenesisenterprise/react-sds"` and the subpath
   `…/fr` are used by every app. Renaming it to `sds` is a deliberate breaking change to
   schedule in one release together with the CSS rename.
3. **Subpath layout is the distribution contract.** Components are consumed as
   `@skygenesisenterprise/react-sds/Alert` etc. The package has no in-repo `exports` map (added at
   publish by denoify) — all self-imports in stories/tests must be renamed consistently.
4. **No invented identity.** SGE colors/typography/branding must come from the SGE
   side, not from this repo. Foundations can define the _contract_ (tokens, CSS variables)
   with placeholder values, never a final look.

## 8. Change budget by step

| Step              | Main files                                                                                                                  | Verdict                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| A (audit)         | this file                                                                                                                   | done                          |
| B (rebranding)    | package.json, README*, CONTRIBUTING, publiccode.yml, .storybook/*, stories/intro, docblock URLs, bin rename, tests fixtures | ~230 files, mostly mechanical |
| C (decoupling)    | scripts/build/\*, patches/, dsfr/, src/start.ts, bin tools                                                                  | strategy only this round      |
| D (foundations)   | `src/sds/**`, new tokens stylesheet                                                                                         | CREATE                        |
| E (components)    | none functional this round (components untouched)                                                                           | deferred to D+CSS stage       |
| F (docs)          | README\*, .storybook, new GOVERNANCE/CHANGELOG/SECURITY                                                                     | CREATE/REFACTOR               |
| G (CI/quality)    | .github/workflows/ci.yaml, dependabot, templates, CODEOWNERS                                                                | CREATE/REFACTOR               |
| H (package check) | `pnpm pack` + minimal consumer project                                                                                      | verify                        |
