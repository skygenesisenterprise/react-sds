#!/usr/bin/env bash
set -Eeuo pipefail

PACKAGE="${1:?Usage: verify-registry-integrity.sh <package> <version> <tarball> <registry>}"
VERSION="${2:?Missing package version}"
TARBALL="${3:?Missing tarball path}"
REGISTRY="${4:?Missing registry URL}"
MAX_ATTEMPTS="${REGISTRY_VERIFY_ATTEMPTS:-20}"
BASE_DELAY="${REGISTRY_VERIFY_BASE_DELAY_SECONDS:-5}"
MAX_DELAY="${REGISTRY_VERIFY_MAX_DELAY_SECONDS:-20}"
NPM_BIN="${NPM_BIN:-npm}"

if [[ ! -s "$TARBALL" ]]; then
  echo "::error::Cannot verify registry integrity: tarball is missing or empty"
  exit 1
fi

expected_integrity="sha512-$(openssl dgst -sha512 -binary "$TARBALL" | openssl base64 -A)"
cache_dir="${NPM_REGISTRY_VERIFY_CACHE:-${RUNNER_TEMP:-/tmp}/npm-registry-verification-cache}"
mkdir -p "$cache_dir"

last_error=""
for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
  error_file="$(mktemp)"
  set +e
  raw_output="$("$NPM_BIN" view "${PACKAGE}@${VERSION}" dist.integrity --json \
    --registry "$REGISTRY" --prefer-online --fetch-retries=0 --cache "$cache_dir" 2>"$error_file")"
  query_status=$?
  set -e
  last_error="$(cat "$error_file")"
  rm -f "$error_file"

  if [[ "$query_status" -eq 0 ]]; then
    actual_integrity="$(printf '%s' "$raw_output" | node -e '
      let input = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", chunk => input += chunk);
      process.stdin.on("end", () => {
        try {
          const value = JSON.parse(input);
          process.stdout.write(typeof value === "string" ? value.trim() : "");
        } catch {
          process.stdout.write(input.trim().replace(/^"|"$/g, ""));
        }
      });
    ')"
    if [[ "$actual_integrity" == "$expected_integrity" ]]; then
      echo "Verified ${PACKAGE}@${VERSION}: registry integrity matches the release tarball."
      exit 0
    fi
    if [[ -n "$actual_integrity" ]]; then
      echo "::error::Integrity mismatch for ${PACKAGE}@${VERSION} on $REGISTRY"
      echo "Expected: $expected_integrity"
      echo "Received: $actual_integrity"
      exit 2
    fi
  fi

  if [[ "$attempt" -lt "$MAX_ATTEMPTS" ]]; then
    delay=$((BASE_DELAY * attempt))
    if [[ "$delay" -gt "$MAX_DELAY" ]]; then delay="$MAX_DELAY"; fi
    echo "Registry metadata not ready for ${PACKAGE}@${VERSION} (attempt $attempt/$MAX_ATTEMPTS); retrying in ${delay}s."
    sleep "$delay"
  fi
done

echo "::warning::Could not verify ${PACKAGE}@${VERSION} integrity after $MAX_ATTEMPTS attempts."
if [[ -n "$last_error" ]]; then
  printf '%s\n' "$last_error" | tail -n 5
fi
exit 1
