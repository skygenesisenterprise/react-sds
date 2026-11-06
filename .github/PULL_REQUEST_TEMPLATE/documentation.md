# Documentation

<!--
Use Conventional Commits for the PR title: `docs: <subject>`. Allowed types:
feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.
-->

## Summary

<!-- What changed in the documentation, in a few sentences. -->

## Related issue

<!-- Closes #123. Write "None" if this stands on its own. -->

## What was wrong, and what it says now

<!--
For a fix: what the page claimed and what the current behavior actually is.
For a new page: what it covers and who it is for.
-->

## Pages changed

<!-- File paths such as README.md, MIGRATION.md, stories/Button.stories.tsx, or src/ comments. -->

## Validation

<!--
How you checked it renders and reads correctly. Storybook runs with
`pnpm storybook` on port 6006; `pnpm build-storybook` performs a production build.
-->

- [ ] Read the page in the local Storybook or repository renderer
- [ ] Followed every command or link on the page
- [ ] Checked the table of contents or Storybook navigation if you added a section
- [ ] Verified code samples against the current package API

## Checklist

- [ ] `pnpm format:check` passes
- [ ] `pnpm lint:check` passes
- [ ] `pnpm build-storybook` passes when a story changed
- [ ] No secrets, tokens, credentials, private hostnames, or personal data in the diff
