# Publishing react-sds

The publish-on-tag.yaml workflow builds one immutable tarball, publishes it to npmjs and GitHub Packages, verifies the published SHA-512 integrity, and creates a GitHub Release after both registries accept the publication. Temporary registry metadata propagation delays are reported as warnings instead of incorrectly turning an accepted publication into a failed release.

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

The workflow grants id-token: write to the publishing job and installs npm 11.21.2 or newer before publication. Do not reintroduce NPM_TOKEN as a fallback: a silent fallback would conceal a broken Trusted Publisher configuration.

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
5. Push the tag. The workflow validates the tag/package version match, builds and tests the package, creates one tarball, checks its SHA-256, and independently publishes each registry and verifies that each registry contains the exact tarball using its SHA-512 integrity.
6. Review the generated workflow summary. It distinguishes verified publication from a registry that accepted the package but has not exposed its integrity metadata yet.

Do not move, delete/recreate, or reuse a release tag. The previously observed v1.1.2 tag/commit discrepancy must be investigated separately; use a fresh version and tag after confirming the version is unused.

## Recovery behavior

The two registry publication steps are independent: a failure at npmjs does not suppress the GitHub Packages attempt, and vice versa. Before treating an existing version as already published, the workflow compares the registry's SHA-512 integrity with the tarball built for the current tag. If a publish command returns an error, the workflow checks whether the exact tarball was nevertheless accepted (for example, when a retry encounters an already-published version). A different integrity is a hard failure and is never overwritten.\n\nAfter a successful publish response, registry metadata is polled with bounded backoff. If the registry accepted the publish but its metadata remains temporarily unavailable, the workflow reports `published_unverified` and continues to the GitHub Release rather than falsely reporting that publication failed. A retry of the same immutable tag is idempotent: it skips a matching artifact, recovers a previously accepted matching artifact, and refuses a version whose integrity differs. The summary clearly separates accepted-but-not-yet-verified publication from fully verified publication.
