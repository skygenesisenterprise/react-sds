# Feature

<!--
Use Conventional Commits for the PR title: `feat: <subject>`, or
`feat(<scope>): <subject>`. Allowed types: feat, fix, docs, style, refactor,
perf, test, build, ci, chore, revert.
-->

## Summary

<!-- What this adds, in a few sentences. -->

## Related issue

<!-- Closes #123. Write "None" if this stands on its own. -->

## Use case

<!--
Who uses this, what they do, and what they cannot do today. This is the part
reviewers care about most.
-->

## Implementation notes

<!--
Key technical decisions and the trade-offs behind them — anything a reviewer
would otherwise have to reverse-engineer from the diff.
-->

## Public API surface

<!--
New components live one-per-module in `src/`, export both a named and a default
export, and are re-exported from `src/index.ts` unless they require an optional
dependency (MUI, charts, Next.js, native, Discord). New tokens belong in
`src/sds/tokens.ts` and the matching `src/styles/foundation/` file.
-->

- [ ] No public API change
- [ ] New component or subpath export — documented in a Storybook story
- [ ] New design token — added to the web contract and the native foundation
- [ ] Backward compatible (new optional props or tokens only)
- [ ] Breaking change — described below

## Tests

<!--
New or updated tests, and what they cover. `pnpm test` runs the Vitest suite in
test/runtime/. Add a test even if the change looks visual-only when it touches
behavior, tokens, or generated types.
-->

## Breaking changes and migration

<!--
What breaks for consumers, and what they must do. Include renamed tokens,
removed props, changed defaults, or required peer dependencies. Write "None" if
there are none; update MIGRATION.md when there are.
-->

## Documentation

<!-- Link the README section or Storybook story you added or updated, or say "Not needed". -->

## Screenshots

<!-- Required for visual changes. Before and after, light and dark themes. -->

## Checklist

- [ ] `pnpm lint:check` passes
- [ ] `pnpm format:check` passes
- [ ] `pnpm build` passes
- [ ] `pnpm test` passes, or the change has no test impact
- [ ] `pnpm pack --dry-run` shows the expected package contents
- [ ] No secrets, tokens, credentials, private hostnames, or personal data in the diff
