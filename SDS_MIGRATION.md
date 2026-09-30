# SDS Migration — from SDS to `@skygenesisenterprise/react-sds`

> Step 1 (audit) and Step 2 (cartography) of the SDS mission, produced **before** any
> code change. It complements the previous migration records:
>
> - [`AUDIT.md`](AUDIT.md) — audit of the `react-dsfr` → `react-sds` migration (historical baseline).
> - [`MIGRATION.md`](MIGRATION.md) — roadmap of the previous migration (superseded by this one).
> - [`PROVENANCE.md`](PROVENANCE.md) — lineage and licensing (still authoritative).
>
> Classification labels used here:
>
> - **CORE** — generic, belongs to the SDS package, independent from any identity.
> - **THEME** — an identity (SGE/SDS, SGE, future brands); must not live in core.
> - **ADAPTER** — integration layer (Next.js, MUI, Native); generic, opt-in.
> - **COMPATIBILITY** — legacy that keeps working during the transition (DSFR, `fr`/`sds` aliases).
> - **REMOVE** — candidate for deletion; nothing removed during this audit.

---

## 0. Repository reality check (read this first)

The mission describes two repositories. The **actual** state on this machine is:

| Repository | Local path | Git remote | Contents found |
| ---------- | ---------- | ---------- | -------------- |
| `react-sds` (target) | this workspace (`…/enterprise/react-sds`) | `github.com/skygenesisenterprise/react-sds` | **still the full `react-sds` codebase** |
| `react-sds` (source) | not checked out locally | `github.com/skygenesisenterprise/react-sds` | upstream of the code found here |

Consequences:

1. **The migration happens in place in this repository.** `react-sds` is already the git
   remote / the published package target; only its *contents* are still SDS-branded
   (`package.json` name is `@skygenesisenterprise/react-sds`, version `1.1.0`).
2. There is **no separate `react-sds` checkout** to diff against. The provenance of the
   code is already documented in `PROVENANCE.md`; the `react-dsfr → react-sds` work is
   already merged into this history.
3. The previous migration already introduced important scaffolding we should **reuse**
   rather than recreate: `src/sds/` (token contract + SGE component families),
   `src/styles/` (CSS foundation with `--sds-*`), `src/native/` (React Native layer).

> ⚠️ **Environment note.** `node_modules/` is absent, so `pnpm build`, `vitest` and
> `tsc` cannot be run yet. Every stage below must be validated locally by installing
> dependencies first (see §7).

---

## 1. What exists today (audit of the actual tree)

Counts are tracked files (lockfiles excluded); `dsfr|DSFR` appears in **100** files,
`fr-*` class names in **187**, `SGE` in **66**.

### 1.1 Source layout (`src/`)

| Area | Location | What it is today |
| ---- | -------- | ---------------- |
| Root components | `src/*.tsx` (Button, Alert, Accordion, Modal, Tabs, Table, Header, Footer, …) | Generic React components; emit `fr-*` classes bound to the bundled DSFR stylesheet |
| `fr` token hub | `src/fr/*` | DSFR-derived scales: `breakpoints`, `spacing`, `colors`, `cx`, `typography`; `generatedFromCss/*` generated from the DSFR sheet |
| SDS foundations | `src/sds/*` | Token contract (`sdsTokens`, `--sds-*`) + SGE families: `layout/`, `typography/`, `content/`, `portal/` (government header/footer/notice/ministry…) |
| CSS foundation | `src/styles/*` | `tokens.css` (`--sds-*`), `reset`, `base`, `typography`, `themes`, `accessibility`, `layout`, `utilities`, `components/` |
| Native | `src/native/*` | React Native/Expo layer sharing SDS tokens: `tokens/`, `theme/` (`SDSProvider`), `primitives/`, `components/`, `hooks/`, `utils/` |
| SSR / Next | `src/next-app-router/*` (`DsfrProvider`, `DsfrHead`, `getHtmlAttributes`), `src/next-pagesdir.tsx` | SSR helpers, no-flash color scheme, fonts |
| MUI adapter | `src/mui/*` | Optional MUI adaptation layer |
| Consent | `src/consentManagement/*` | Generic cookie-consent mechanism + banner |
| i18n | `src/i18n.ts` | Generic translation mechanism |
| Charts | `src/Chart/*` | Components importing `@gouvfr/dsfr-chart` CSS |
| Discord | `src/discord/*` | Non-visual integration (bot/webhooks) |
| Pictograms | `src/picto/*` | DSFR-derived pictograms (`fr-artwork`-style) |
| CLI | `src/bin/*` | `react-sds`, `copy-dsfr-to-public`, `only-include-used-icons` |
| Misc | `src/shared/`, `src/Display/`, `src/blocks/`, `src/tools/`, `src/zz_internal/`, `src/link.tsx`, `src/start.ts`, `src/spa.ts` | Shared utilities and adapters |
| Build | `scripts/build/*` | Compiles the `@gouvfr/dsfr` stylesheet into CSS + TS (`cssToTs`), builds `main.css` |
| Legacy assets | `dsfr/` (generated, published) | Bundled DSFR CSS/fonts/icons |
| Patch | `patches/@gouvfr+dsfr+1.15.3.patch` | patch-package fix applied to DSFR at install |

### 1.2 Tests, stories, tooling

- `test/runtime/**` — 118 detected test files (component, token, build-script and
  tree-shaking tests). **High-value, must be migrated, not rewritten.**
- `test/integration/*` — CRA / Vite / Next-pagesdir / Next-appdir demo apps (dev only).
- `stories/**` — Storybook showcase incl. `foundations.stories.mdx`, `Pictograms`,
  `sds/` families and `Native` where applicable.
- `.storybook/**` — branding, custom theme, docs container.
- `.github/workflows/{ci,publish-on-tag,publiccodeyml-check}.yaml`.
- `package.json` — ~1600-line `exports` map (generated), `bin`, peer deps on
  `@gouvfr/dsfr-chart`, `react-native`, `discord.js`.

---

## 2. Cartography — verdict per area

| # | Area | Verdict | Rationale / action |
| - | ---- | ------- | ------------------ |
| 1 | Generic React components (`src/*.tsx`) | **CORE** | Reuse as-is. Keep public props/APIs. They are the SDS component library. |
| 2 | `src/styles/*` CSS foundation | **CORE** | Generic already; rename `--sds-*` → `--sds-*` and decouple values into a theme layer. |
| 3 | `src/sds/tokens.ts` (token *contract*) | **CORE** | The structure (colors/typography/spacing/radius/elevation/motion/breakpoints/dimensions/z-index/accessibility) is generic → becomes `src/tokens/`. |
| 4 | `src/sds/tokens.ts` **values** (SGE palette) | **THEME** | Extract to an SGE/SDS theme. Core ships neutral defaults. |
| 5 | `src/sds/layout`, `src/sds/typography` | **CORE** | Generic primitives; drop the `SDS` prefix (compat aliases). |
| 6 | `src/sds/content` | **CORE** | Generic content cards; drop `SDS` prefix. |
| 7 | `src/sds/portal/*` (`SDSGovernmentHeader`, `SDSMinistryHeader`, `SDSOfficialNotice`, `SDSServiceBanner`, …) | **THEME** | Government/SGE identity specifics → theme package/module, not core. |
| 8 | `src/fr/*` (`fr` namespace, class names) | **COMPATIBILITY** | Keep as deprecated aliases; remove with DSFR. Generic scales move to core tokens. |
| 9 | `src/fr/generatedFromCss/*` | **COMPATIBILITY** | Generated from DSFR; disappears when the SDS sheet replaces it. |
| 10 | `src/native/*` | **CORE** (native entry) | Keep; rename `SDSProvider`→`SDSProvider` (alias), tokens → `sds`. No DOM/CSS dependency. |
| 11 | `src/next-app-router/*` | **ADAPTER** | Rename `DsfrProvider`/`DsfrHead`→`SDSProvider`/`SDSHead`, keep DSFR aliases. |
| 12 | `src/next-pagesdir.tsx` | **ADAPTER** | Same treatment as #11. |
| 13 | `src/mui/*` | **ADAPTER** | Generic; rename `MuiDsfrThemeProvider`→`MuiSdsThemeProvider` (alias). |
| 14 | `src/consentManagement/*` | **CORE** | Generic; storage-key prefix must be neutralized in the breaking release. |
| 15 | `src/i18n.ts` | **CORE** | Generic. |
| 16 | `src/Chart/*` + peer `@gouvfr/dsfr-chart` | **COMPATIBILITY** | Bound to DSFR chart CSS. Decide: re-found on a chart lib, or move to theme, or remove. |
| 17 | `src/picto/*` | **COMPATIBILITY** | DSFR-derived pictogram set (license-tracked). Keep until a neutral icon set exists. |
| 18 | `src/discord/*` | **REMOVE (from core)** | Not a design-system concern; either drop or publish as a separate non-core entry. Verify consumers first. |
| 19 | `src/bin/*` CLI | **CORE** | Rename `react-sds`→`react-sds`; legacy DSFR asset bins stay until DSFR removal. |
| 20 | `scripts/build/*` (DSFR CSS→TS) | **COMPATIBILITY** | Build-time only; replaced when the SDS stylesheet is generated from tokens. |
| 21 | `dsfr/` published assets + `patches/@gouvfr+dsfr*` | **COMPATIBILITY → REMOVE** | The long pole (see §5). |
| 22 | `src/assets/*sge*`, `SDSGovernmentBanner`, government content defaults | **THEME** | SGE branding/content. |
| 23 | `stories/**` | **CORE + THEME docs** | Split generic docs from SGE-theme docs; remove DSFR/SGE copy from core stories. |
| 24 | `test/runtime/**`, `test/integration/**` | **CORE** | Migrate package names/import paths; add tests for new behavior. |

---

## 3. Target architecture

```text
@skygenesisenterprise/react-sds
│
├── core/            Generic components, primitives, accessibility, i18n, consent
├── tokens/          Semantic token contract (structure, neutral values)
├── styles/          SDS CSS foundation (tokens.css, reset, base, themes, a11y, layout…)
├── themes/          Identity layers (SGE/SDS, SGE, future brands)
│                    └── each theme supplies token overrides + branding only
├── adapters/        opt-in integrations
│   ├── next         (SDSProvider / SDSHead, App Router + Pages Router, RSC, no-flash)
│   ├── mui          (MuiSdsThemeProvider)
│   └── native       (React Native / Expo, DOM-free, shares tokens)
└── compatibility/   legacy aliases (fr namespace, fr-* classes, Dsfr* symbols, DSFR assets)
```

Consumption model:

```text
React SDS  +  SGE theme  =  SDS
React SDS  +  SGE theme      =  SGE corporate identity
React SDS  +  <any theme>    =  a future product identity
```

Styling chain target:

```text
React component → SDS semantic API → SDS tokens → SDS CSS
```

not `React component → fr-* class → DSFR stylesheet`.

Namespace target:

```ts
import { sds } from "@skygenesisenterprise/react-sds";      // new
import { fr } from "@skygenesisenterprise/react-sds/fr";     // deprecated alias
```

Tokens target: `--sds-*` (with `--sds-*` / `--fr-*` kept as aliases during the
transition, removed in one coordinated breaking release).

---

## 4. Migration stages (incremental, each must compile)

| Stage | Goal | Type |
| ----- | ---- | ---- |
| S0 | This audit + cartography (done) | docs |
| S1 | Package identity: name, description, keywords, repository, author, bin (`react-sds`), docs badges | mechanical |
| S2 | Introduce `sds` namespace + `--sds-*` tokens as **additive aliases** over `sds`/`fr` | additive, non-breaking |
| S3 | Extract core token layer (`src/tokens/`) and move SGE values into `src/themes/sge` | architectural |
| S4 | De-couple SSR/MUI/native naming (`SDSProvider`, `SDSHead`, `SDSProvider` native) with `Dsfr*`/`SDS*` aliases | mechanical + aliases |
| S5 | Split SGE portal/government components out of core into the theme | architectural |
| S6 | Build a neutral **SDS stylesheet** from tokens (replace DSFR-generated layer) | architectural, long pole |
| S7 | Single coordinated breaking release: `fr-*`→`sds-*`, remove `fr`/`Dsfr*`/`--sds-*` aliases, drop `@gouvfr/dsfr`, `dsfr/`, `patches/` | breaking |
| S8 | Migrate tests + Storybook; add theme-switching and token tests | tests |
| S9 | Package/build/exports validation; `react-sds` becomes a thin compatibility/theme consumer | packaging |
| S10 | Documentation finalization (README, MIGRATION, PROVENANCE, GOVERNANCE, CONTRIBUTING, SECURITY, CHANGELOG) | docs |

Guardrails: no big-bang; separate mechanical renames from architectural changes;
never delete a feature without verifying its consumers; keep `AUDIT.md`/`PROVENANCE.md`
attribution intact.

---

## 5. The DSFR long pole (isolated, not yet removed)

`@gouvfr/dsfr` is already a **build-time devDependency only** (consumers never install
it). The bundled `dsfr/` assets are generated and clearly labeled, and the patch is
documented. The hard part is producing a real SDS stylesheet so components stop relying
on `fr-*` classes. Until then:

- DSFR stays **isolated** in `dsfr/` + `scripts/build` + `patches/`;
- `fr-*` class names and the `fr` namespace stay as **documented compatibility**;
- no simple `fr-button → sds-button` rename is performed while the DSFR stylesheet is
  still the source of the visual behavior (per mission §5).

---

## 6. Open decisions (documented — not silently assumed)

These are not fully determined by the existing code; they need a human decision before
the corresponding stage.

1. **Git workflow.** Migrate in place on `master`, or on a long-lived
   `migration/sds` branch? (History-preserving, auditable commits preferred.)
2. **SGE/SDS end state.** Keep SGE as an in-repo theme
   (`react-sds/themes/sge`), or keep it as a separate package
   (`@skygenesisenterprise/react-sds` consuming SDS)? Mission §9 suggests the latter is
   *prepared* but not forced now.
3. **`react-sds` compatibility channel.** Re-export shim package, or keep the existing
   `fr`/`sds` aliases in `react-sds` only? (Mission §18 wants no hard break.)
4. **Charts & pictograms.** Re-found on a neutral library, move to theme, or remove?
   (DSFR-dependent today.)
5. **Discord module.** Drop from core, or publish as a separate non-design entry?
6. **Breaking-release timing.** Batch all renames (`fr-*`, `fr`, `Dsfr*`, `--sds-*`) into
   one major release, or sequence them? (Lean: batch, ship a codemod.)

---

## 7. Validation gates

`node_modules/` must be installed before any code stage. Each stage must keep green:

```text
pnpm install
pnpm lint:check
tsc -p src --noEmit           (or the project's typecheck script)
pnpm test                     (vitest)
pnpm build
pnpm build-storybook
```

Plus package-level checks: `exports` map validity, tree-shaking tests, subpath imports,
and (once published) `npm pack` inspection.
