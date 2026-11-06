#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKFLOW="$ROOT/.github/workflows/publish-on-tag.yaml"
CI_WORKFLOW="$ROOT/.github/workflows/ci.yaml"

echo "Running npm semantic-version tests..."
node --test "$ROOT/tests/npm-version.test.cjs"

echo "Checking publication workflow invariants..."
grep -Fq 'node scripts/ci/ensure-npm-version.cjs' "$WORKFLOW"
grep -Fq 'npm publish "$TARBALL"' "$WORKFLOW"
grep -Fq -- '--provenance' "$WORKFLOW"
grep -Fq 'GH_PACKAGES_TOKEN' "$WORKFLOW"
grep -Fq "steps.check_github.outcome == 'success'" "$WORKFLOW"
grep -Fq "steps.check_npmjs.outcome == 'success'" "$WORKFLOW"
grep -Fq 'if: ${{ !cancelled()' "$WORKFLOW"
grep -Fq 'status=integrity_mismatch' "$WORKFLOW"
grep -Fq 'status=published_unverified' "$WORKFLOW"
grep -Fq 'verify-registry-integrity.sh' "$WORKFLOW"
grep -Fq "REQUIRED_NPM_VERSION = '11.21.2'" "$ROOT/scripts/ci/ensure-npm-version.cjs"
grep -Fq "actions/upload-artifact@v4" "$CI_WORKFLOW"
grep -Fq "actions/download-artifact@v4" "$CI_WORKFLOW"
grep -Fq "src/generatedFromCss/" "$CI_WORKFLOW"
grep -Fq "path: ./" "$CI_WORKFLOW"
bash "$ROOT/tests/registry-integrity.test.sh"

if grep -Fq "require('semver')" "$WORKFLOW"; then
  echo "Unexpected runtime dependency on semver remains in workflow." >&2
  exit 1
fi
if grep -Fq 'NPM_TOKEN' "$WORKFLOW"; then
  echo "Legacy npmjs token authentication must not be required with Trusted Publishing." >&2
  exit 1
fi
if grep -Fq '${RELEASE_${var_name}' "$WORKFLOW"; then
  echo "Invalid nested Bash variable expansion remains in summary." >&2
  exit 1
fi

echo "Publication workflow invariants passed."
