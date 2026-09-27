#!/usr/bin/env bash
#
# recon-pipeline — chain subfinder -> dnsx -> httpx -> nuclei over a scope file.
#
# For authorized security testing only. Run this only against assets you own or
# are explicitly authorized to test (e.g. an in-scope bug-bounty program).
#
# Every output file is named with the target prefix you pass via -t, so results
# from different engagements never collide or get silently overwritten.
#
set -euo pipefail

PROG="$(basename "$0")"

# -------- defaults --------
TARGET=""
SCOPE=""
OUTDIR=""
RESOLVER=""
SEVERITY="low,medium,high,critical"
DRY_RUN=0

usage() {
  cat <<USAGE
$PROG — chain subfinder -> dnsx -> httpx -> nuclei

Usage:
  $PROG -t <target-prefix> -d <scope-file> -o <outdir> [-r <resolver>] [-s <severity>] [--dry-run]

Required:
  -t <target-prefix>   Prefix for every output file (e.g. "acme-2026").
  -d <scope-file>      File of root domains, one per line.
  -o <outdir>          Directory to write outputs into (created if missing).

Optional:
  -r <resolver>        Resolver IP or resolver file, passed through to dnsx (-r).
                       Use this on DNS-restricted networks.
  -s <severity>        nuclei severity filter (default: ${SEVERITY}).
  --dry-run            Print the command chain and exit; run nothing.
  -h, --help           Show this help.

Outputs (all prefixed with <target-prefix>):
  <prefix>-subs.txt        deduped subdomains from subfinder
  <prefix>-resolved.txt    resolved hosts from dnsx
  <prefix>-live.txt        live hosts from httpx
  <prefix>-nuclei.txt      nuclei findings
USAGE
}

die() { echo "$PROG: error: $*" >&2; exit 1; }

# -------- arg parsing --------
while [ $# -gt 0 ]; do
  case "$1" in
    -t) TARGET="${2:-}"; shift 2 ;;
    -d) SCOPE="${2:-}"; shift 2 ;;
    -o) OUTDIR="${2:-}"; shift 2 ;;
    -r) RESOLVER="${2:-}"; shift 2 ;;
    -s) SEVERITY="${2:-}"; shift 2 ;;
    --dry-run) DRY_RUN=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) die "unknown argument: $1 (see --help)" ;;
  esac
done

[ -n "$TARGET" ] || { usage >&2; die "missing -t <target-prefix>"; }
[ -n "$SCOPE" ]  || die "missing -d <scope-file>"
[ -n "$OUTDIR" ] || die "missing -o <outdir>"

# Keep the prefix filesystem-safe so it can't escape the outdir.
case "$TARGET" in
  */*|*..*) die "target-prefix must not contain '/' or '..': $TARGET" ;;
esac

# -------- output paths (every name carries the prefix) --------
SUBS="$OUTDIR/${TARGET}-subs.txt"
RESOLVED="$OUTDIR/${TARGET}-resolved.txt"
LIVE="$OUTDIR/${TARGET}-live.txt"
NUCLEI="$OUTDIR/${TARGET}-nuclei.txt"

# dnsx resolver passthrough (-r) only when the caller asked for it.
DNSX_RESOLVER_ARGS=()
if [ -n "$RESOLVER" ]; then
  DNSX_RESOLVER_ARGS=(-r "$RESOLVER")
fi

# -------- dry-run: print the chain, execute nothing --------
if [ "$DRY_RUN" -eq 1 ]; then
  resolver_note="(none)"
  [ -n "$RESOLVER" ] && resolver_note="-r $RESOLVER"
  cat <<CHAIN
[dry-run] recon-pipeline command chain
  target-prefix : $TARGET
  scope-file    : $SCOPE
  outdir        : $OUTDIR
  resolver      : $resolver_note
  severity      : $SEVERITY

  [1/4] subfinder -dL $SCOPE -silent | sort -u > $SUBS
  [2/4] dnsx -l $SUBS -silent ${RESOLVER:+-r $RESOLVER} | sort -u > $RESOLVED
  [3/4] httpx -l $RESOLVED -silent | sort -u > $LIVE
  [4/4] nuclei -l $LIVE -severity $SEVERITY -silent -o $NUCLEI

[dry-run] no commands were executed
CHAIN
  exit 0
fi

# -------- real run --------
require() {
  command -v "$1" >/dev/null 2>&1 || die "required tool '$1' not found in PATH. Install it before running."
}
for tool in subfinder dnsx httpx nuclei sort; do
  require "$tool"
done

[ -f "$SCOPE" ] || die "scope file not found: $SCOPE"
mkdir -p "$OUTDIR"

echo "[1/4] subfinder -> $SUBS"
subfinder -dL "$SCOPE" -silent | sort -u > "$SUBS"

echo "[2/4] dnsx -> $RESOLVED"
dnsx -l "$SUBS" -silent "${DNSX_RESOLVER_ARGS[@]}" | sort -u > "$RESOLVED"

echo "[3/4] httpx (live hosts) -> $LIVE"
httpx -l "$RESOLVED" -silent | sort -u > "$LIVE"

echo "[4/4] nuclei (severity: $SEVERITY) -> $NUCLEI"
nuclei -l "$LIVE" -severity "$SEVERITY" -silent -o "$NUCLEI"

echo "done. outputs:"
echo "  $SUBS"
echo "  $RESOLVED"
echo "  $LIVE"
echo "  $NUCLEI"
