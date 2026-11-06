#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HELPER="$ROOT/scripts/ci/verify-registry-integrity.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

TARBALL="$TMP/package.tgz"
printf 'deterministic package fixture\n' > "$TARBALL"
EXPECTED="sha512-$(openssl dgst -sha512 -binary "$TARBALL" | openssl base64 -A)"
MOCK_NPM="$TMP/npm"
CALLS="$TMP/calls"

cat > "$MOCK_NPM" <<'MOCK'
#!/usr/bin/env bash
set -Eeuo pipefail
count=0
[[ ! -f "${MOCK_CALLS:?}" ]] || count="$(cat "$MOCK_CALLS")"
count=$((count + 1))
printf '%s' "$count" > "$MOCK_CALLS"
if [[ "${MOCK_ALWAYS_FAIL:-false}" == "true" ]]; then
  echo "simulated registry propagation delay" >&2
  exit 1
fi
if [[ "${MOCK_FAIL_FIRST:-false}" == "true" && "$count" -eq 1 ]]; then
  echo "simulated temporary 404" >&2
  exit 1
fi
printf '"%s"\n' "${MOCK_INTEGRITY:?}"
MOCK
chmod +x "$MOCK_NPM"

common_env=(
  "NPM_BIN=$MOCK_NPM"
  "REGISTRY_VERIFY_ATTEMPTS=3"
  "REGISTRY_VERIFY_BASE_DELAY_SECONDS=0"
  "REGISTRY_VERIFY_MAX_DELAY_SECONDS=0"
  "MOCK_CALLS=$CALLS"
)

echo "Testing matching registry integrity..."
: > "$CALLS"
env "${common_env[@]}" MOCK_INTEGRITY="$EXPECTED" bash "$HELPER" test/package 1.0.0 "$TARBALL" https://registry.example.test

echo "Testing transient registry visibility..."
: > "$CALLS"
env "${common_env[@]}" MOCK_FAIL_FIRST=true MOCK_INTEGRITY="$EXPECTED" bash "$HELPER" test/package 1.0.0 "$TARBALL" https://registry.example.test
[[ "$(cat "$CALLS")" -eq 2 ]]

echo "Testing integrity mismatch rejection..."
: > "$CALLS"
set +e
env "${common_env[@]}" MOCK_INTEGRITY="sha512-not-the-same" bash "$HELPER" test/package 1.0.0 "$TARBALL" https://registry.example.test
status=$?
set -e
[[ "$status" -eq 2 ]]

echo "Testing bounded retries when registry metadata is unavailable..."
: > "$CALLS"
set +e
env "${common_env[@]}" MOCK_ALWAYS_FAIL=true bash "$HELPER" test/package 1.0.0 "$TARBALL" https://registry.example.test
status=$?
set -e
[[ "$status" -eq 1 ]]
[[ "$(cat "$CALLS")" -eq 3 ]]

echo "Registry integrity verification tests passed."
