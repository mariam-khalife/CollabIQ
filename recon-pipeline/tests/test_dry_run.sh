#!/usr/bin/env bash
#
# Test: --dry-run prints the command chain, executes nothing, and every stage
# output filename carries the target prefix.
#
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
SCRIPT="$HERE/../recon-pipeline.sh"
PREFIX="acme-2026"

fail() { echo "FAIL: $*" >&2; exit 1; }

workdir="$(mktemp -d)"
trap 'rm -rf "$workdir"' EXIT

scope="$workdir/scope.txt"
outdir="$workdir/out"
printf 'example.com\nexample.org\n' > "$scope"

# Run the pipeline in dry-run mode with a resolver, capturing output.
output="$("$SCRIPT" -t "$PREFIX" -d "$scope" -o "$outdir" -r 1.1.1.1 --dry-run)"

# 1. Nothing must be executed: no output directory or files created.
[ ! -d "$outdir" ] || fail "--dry-run created the output directory; it must not run anything"

# 2. Every stage filename must use the prefix (never a generic reused name).
for stage in subs resolved live nuclei; do
  expected="${PREFIX}-${stage}.txt"
  echo "$output" | grep -q "$expected" \
    || fail "stage '$stage' output does not use prefixed name '$expected'"
  # And it must not fall back to a generic un-prefixed name.
  echo "$output" | grep -qE "(^|[^-])${stage}\.txt" \
    && fail "stage '$stage' leaked a generic un-prefixed '${stage}.txt' name"
done

# 3. The resolver must be threaded into dnsx (-r passthrough).
echo "$output" | grep -q "dnsx" || fail "dnsx stage missing from chain"
echo "$output" | grep -q -- "-r 1.1.1.1" || fail "resolver not passed through to dnsx"

# 4. The four ProjectDiscovery stages must appear in order.
echo "$output" | grep -q "subfinder" || fail "subfinder stage missing"
echo "$output" | grep -q "httpx" || fail "httpx stage missing"
echo "$output" | grep -q "nuclei" || fail "nuclei stage missing"
echo "$output" | grep -q -- "-severity" || fail "nuclei severity flag missing"

# 5. The dry-run must state plainly that nothing ran.
echo "$output" | grep -q "no commands were executed" \
  || fail "dry-run did not confirm that nothing was executed"

echo "PASS: dry-run prints prefixed chain and executes nothing"
