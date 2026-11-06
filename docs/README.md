# React SDS documentation

Official developer documentation for
[`@skygenesisenterprise/react-sds`](https://www.npmjs.com/package/@skygenesisenterprise/react-sds),
the Sky Genesis Enterprise React design system.

This app is a private pnpm workspace package. It is **not** published to npm and
has no independent design system: it imports the library through its public
exports and loads the library stylesheet.

## Requirements

- Node.js 22
- pnpm 12

## Commands

From the repository root:

```bash
pnpm docs:dev     # build the library, then run the docs on http://localhost:3001
pnpm docs:build   # build the library, regenerate the API reference, build the docs
pnpm docs:check   # content checks + API reference freshness + TypeScript
```

From `docs/`:

```bash
pnpm dev            # next dev --port 3001
pnpm build          # next build
pnpm generate       # regenerate the API reference from the package declarations
pnpm generate:check # fail if the generated reference is stale
pnpm check          # links, metadata, empty pages, residual references
pnpm types:check    # fumadocs-mdx + tsc --noEmit
```

## How the library is consumed

`docs/package.json` declares `"@skygenesisenterprise/react-sds": "workspace:*"`.
The documentation therefore compiles against the **local** source build:

1. `pnpm build` at the repository root produces `dist/` (JS + `.d.ts` + CSS).
2. The docs resolve `@skygenesisenterprise/react-sds` to that package through the
   pnpm workspace, exactly as an external consumer would after `npm install`.
3. The API reference is generated from `dist/**/*.d.ts`, i.e. from the public
   declarations that ship in the tarball — never from internal `src/` paths.

Because imports go through the package entry points, the docs catch packaging
regressions (missing export, missing declaration, broken CSS entry) at build
time. No import may reach into `../src`.

## Structure

```text
docs/
├── app/                 Next.js App Router shell (landing, docs layout, search, SEO)
├── components/          Documentation-only chrome (demo frame, logo, token table)
├── content/docs/
│   ├── core/            Usage documentation: install, foundations, components, recipes
│   ├── api/             Generated reference: components, hooks, tokens, styles
│   └── cli/             Commands shipped with the package
├── lib/                 MDX source loader, version helper, layout options
├── scripts/
│   ├── generate-api.mjs Generated API reference (TypeScript compiler API)
│   └── check-docs.mjs   Documentation validation
└── source.config.ts     Fumadocs MDX collection
```

## Generated files

`content/docs/api/components/**`, `content/docs/api/sds/**` and their `meta.json`
files are generated. Do not edit them by hand: change the library source (and its
TSDoc) or the generator, then run `pnpm generate`.
