# Publishing react-sds

The publish-on-tag.yaml workflow publishes one verified tarball to npmjs and GitHub Packages, then creates a GitHub Release only after both registries confirm the version.

## One-time npmjs Trusted Publishing setup

The npmjs publication uses GitHub Actions OIDC Trusted Publishing. It intentionally does not use the legacy NPM_TOKEN secret.

In the npmjs package settings for @skygenesisenterprise/react-sds, configure a Trusted Publisher with:

| Field | Value |
|---|---|
| Provider | GitHub Actions |
| Organization / user | skygenesisenterprise |
| Repository | react-sds |
| Workflow filename | publish-on-tag.yaml |
| Environment | Leave unset (this workflow does not declare a GitHub environment) |

The package metadata already identifies the source repository as https://github.com/skygenesisenterprise/react-sds. Keep this repository identity consistent with the Trusted Publisher configuration.

The workflow grants id-token: write to the publishing job and installs npm 11.5.1 or newer before publication. Do not reintroduce NPM_TOKEN as a fallback: a silent fallback would conceal a broken Trusted Publisher configuration.

## GitHub Packages authentication

Create or update the repository Actions secret:

- Name: GH_PACKAGES_TOKEN
- Token: a GitHub Personal Access Token (classic) authorized for this organization and repository.
- Required scopes: read:packages and write:packages; add repo if required by the repository's package/repository access configuration.
- Authorize the token for the organization SSO if the organization enforces SSO.

The workflow writes this token only to a temporary npm configuration file with restrictive permissions and removes the file at the end of the step. Never print or commit the token.

## Release procedure

1. Merge the workflow changes.
2. Complete and verify the npmjs Trusted Publisher configuration and the GH_PACKAGES_TOKEN secret.
3. Update package.json to the next unused version and commit the release contents.
4. Create a new, immutable tag matching that version (for example, v1.1.3 only if that version is still unused).
5. Push the tag. The workflow validates the tag/package version match, builds and tests the package, creates one tarball, checks its SHA-256, and independently publishes/verifies each registry.
6. Confirm both registry publication steps and the GitHub Release are successful.

Do not move, delete/recreate, or reuse a release tag. The previously observed v1.1.2 tag/commit discrepancy must be investigated separately; use a fresh version and tag after confirming the version is unused.

## Recovery behavior

The two registry publication steps are independent: a failure at npmjs does not suppress the GitHub Packages attempt, and vice versa. The GitHub Release is created only when both publication steps have succeeded, including post-publication verification. The summary reports partial publication explicitly; retrying the same immutable tag is safe only after understanding the registry state and confirming the tag still points to the same commit.
