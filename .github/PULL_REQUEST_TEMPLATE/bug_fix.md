# Bug fix

<!--
Use Conventional Commits for the PR title: `fix: <subject>`, or
`fix(<scope>): <subject>`. Allowed types: feat, fix, docs, style, refactor,
perf, test, build, ci, chore, revert.
-->

## Summary

<!-- What was broken, and what this changes. A few sentences. -->

## Related issue

<!-- Closes #123. Write "None" if this stands on its own. -->

## Root cause

<!-- Why did this happen? A wrong assumption, a missing check, or a regression from a specific change. -->

## Changes

<!-- The approach you took, and any decision a reviewer would want to know about. -->

## How this was verified

<!--
Tests, or the exact manual steps you followed. Runtime tests live in
test/runtime/ and run with `pnpm test`; `pnpm build`, `pnpm lint:check`, and
`pnpm format:check` cover the rest of the package.
-->

- [ ] Added or updated a test in `test/runtime/` that fails without this change
- [ ] Verified manually — steps:
- [ ] No new test — the fix is in wiring, styling, or configuration

## Compatibility

<!--
Does this change any documented behavior, prop, CSS custom property, subpath
export, or generated artifact? Answer in one line and move on; use "No".
-->

## Documentation

<!-- Did a documented behavior change? Update the README or the Storybook story, or say "Not needed". -->

## Checklist

- [ ] `pnpm lint:check` passes
- [ ] `pnpm format:check` passes
- [ ] `pnpm build` passes
- [ ] `pnpm test` passes, or the change has no test impact
- [ ] Storybook still renders the affected component, or the change has no UI impact
- [ ] No secrets, tokens, credentials, private hostnames, or personal data in the diff
- [ ] Confirmed the issue is not a security vulnerability (those go to the private advisory, not here)
