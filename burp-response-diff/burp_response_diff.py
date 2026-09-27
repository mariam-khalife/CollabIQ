#!/usr/bin/env python3
"""burp-response-diff — compare two HTTP responses for BOLA/IDOR testing.

Given two saved HTTP responses (raw files, or single-item Burp XML exports),
this prints a field-by-field diff:

  * status line
  * a curated set of security-relevant headers
  * a structural diff of the JSON body (added / removed / changed keys)

The intended workflow is two-account access testing: request the same resource
as account A and account B and diff the responses. If account B's response
carries account A's data (changed values where they should differ, or no
difference at all where there should be one), you have a candidate
BOLA/IDOR finding to verify.

Authorized use only: run this against applications you own or are explicitly
authorized to test.
"""
from __future__ import annotations

import argparse
import base64
import json
import re
import sys
from typing import Any, Dict, List, Optional, Tuple

# Headers worth surfacing in an access-control diff.
KEY_HEADERS = [
    "content-type",
    "content-length",
    "location",
    "set-cookie",
    "www-authenticate",
    "cache-control",
    "x-powered-by",
    "content-disposition",
]


def _decode_burp_export(text: str) -> Optional[str]:
    """If text is a Burp XML export, return the inner HTTP response, else None.

    Burp's "Save item" XML wraps the raw response in a <response> element that
    may be base64-encoded (base64="true").
    """
    match = re.search(
        r"<response(?P<attrs>[^>]*)>(?P<body>.*?)</response>",
        text,
        re.DOTALL | re.IGNORECASE,
    )
    if not match:
        return None
    body = match.group("body")
    # Strip a CDATA wrapper if present.
    cdata = re.match(r"\s*<!\[CDATA\[(?P<inner>.*?)\]\]>\s*$", body, re.DOTALL)
    if cdata:
        body = cdata.group("inner")
    if re.search(r'base64\s*=\s*"true"', match.group("attrs"), re.IGNORECASE):
        try:
            return base64.b64decode(body).decode("utf-8", errors="replace")
        except (ValueError, base64.binascii.Error):
            return None
    return body


def parse_response(text: str) -> Tuple[str, Dict[str, str], str]:
    """Parse a raw HTTP response into (status_line, headers, body).

    Accepts raw HTTP text or a Burp XML export. Header names are lower-cased;
    repeated headers are joined with ", ". Handles CRLF and LF line endings.
    """
    inner = _decode_burp_export(text)
    if inner is not None:
        text = inner

    text = text.replace("\r\n", "\n")
    # Split headers from body on the first blank line.
    if "\n\n" in text:
        head, _, body = text.partition("\n\n")
    else:
        head, body = text, ""

    lines = head.split("\n")
    status_line = lines[0].strip() if lines else ""

    headers: Dict[str, str] = {}
    for line in lines[1:]:
        if ":" not in line:
            continue
        name, _, value = line.partition(":")
        key = name.strip().lower()
        value = value.strip()
        if key in headers:
            headers[key] = headers[key] + ", " + value
        else:
            headers[key] = value
    return status_line, headers, body


def _flatten(obj: Any, prefix: str = "") -> Dict[str, Any]:
    """Flatten nested JSON into a {path: scalar} map.

    Dict keys use dotted paths; list items use [i] indices. Scalars (including
    empty containers) become leaves.
    """
    out: Dict[str, Any] = {}
    if isinstance(obj, dict):
        if not obj:
            out[prefix or "."] = {}
        for key, value in obj.items():
            child = "{}.{}".format(prefix, key) if prefix else str(key)
            out.update(_flatten(value, child))
    elif isinstance(obj, list):
        if not obj:
            out[prefix or "."] = []
        for i, value in enumerate(obj):
            child = "{}[{}]".format(prefix, i)
            out.update(_flatten(value, child))
    else:
        out[prefix] = obj
    return out


def json_body_diff(body_a: str, body_b: str) -> Dict[str, Any]:
    """Structurally diff two JSON bodies.

    Returns a dict with keys: parseable (bool), and when parseable,
    added/removed/changed. 'changed' maps path -> {"a": ..., "b": ...}.
    """
    try:
        obj_a = json.loads(body_a)
        obj_b = json.loads(body_b)
    except (json.JSONDecodeError, ValueError):
        return {"parseable": False}

    flat_a = _flatten(obj_a)
    flat_b = _flatten(obj_b)
    keys_a = set(flat_a)
    keys_b = set(flat_b)

    added = sorted(keys_b - keys_a)
    removed = sorted(keys_a - keys_b)
    changed = {
        path: {"a": flat_a[path], "b": flat_b[path]}
        for path in sorted(keys_a & keys_b)
        if flat_a[path] != flat_b[path]
    }
    return {
        "parseable": True,
        "added": added,
        "removed": removed,
        "changed": changed,
    }


def diff_responses(text_a: str, text_b: str) -> Dict[str, Any]:
    """Produce the full diff structure between two response texts."""
    status_a, headers_a, body_a = parse_response(text_a)
    status_b, headers_b, body_b = parse_response(text_b)

    header_diff = {}
    for name in KEY_HEADERS:
        va, vb = headers_a.get(name), headers_b.get(name)
        if va != vb:
            header_diff[name] = {"a": va, "b": vb}

    return {
        "status": {"a": status_a, "b": status_b,
                   "same": status_a == status_b},
        "headers": header_diff,
        "body": json_body_diff(body_a, body_b),
    }


def render(diff: Dict[str, Any], json_only: bool = False) -> str:
    """Render a diff structure to human-readable text."""
    lines: List[str] = []
    if not json_only:
        status = diff["status"]
        marker = "==" if status["same"] else "!="
        lines.append("STATUS")
        lines.append("  A: {}".format(status["a"] or "(none)"))
        lines.append("  B: {}  [{}]".format(status["b"] or "(none)", marker))
        lines.append("")

        lines.append("HEADERS (security-relevant, differing only)")
        if not diff["headers"]:
            lines.append("  (no differences)")
        else:
            for name, vals in diff["headers"].items():
                lines.append("  {}".format(name))
                lines.append("    A: {}".format(vals["a"] if vals["a"] is not None else "(absent)"))
                lines.append("    B: {}".format(vals["b"] if vals["b"] is not None else "(absent)"))
        lines.append("")

    lines.append("JSON BODY")
    body = diff["body"]
    if not body.get("parseable"):
        lines.append("  (one or both bodies are not valid JSON)")
        return "\n".join(lines)

    if not (body["added"] or body["removed"] or body["changed"]):
        lines.append("  (identical structure and values)")
    else:
        if body["removed"]:
            lines.append("  removed (in A, not B):")
            for path in body["removed"]:
                lines.append("    - {}".format(path))
        if body["added"]:
            lines.append("  added (in B, not A):")
            for path in body["added"]:
                lines.append("    + {}".format(path))
        if body["changed"]:
            lines.append("  changed (value differs A -> B):")
            for path, vals in body["changed"].items():
                lines.append("    ~ {}: {!r} -> {!r}".format(path, vals["a"], vals["b"]))
    return "\n".join(lines)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="burp-response-diff",
        description="Field-by-field diff of two HTTP responses for BOLA/IDOR testing.",
    )
    sub = parser.add_subparsers(dest="command", required=True)
    d = sub.add_parser("diff", help="diff two response files")
    d.add_argument("file_a", help="response from account A (raw or Burp export)")
    d.add_argument("file_b", help="response from account B (raw or Burp export)")
    d.add_argument("--json-only", action="store_true",
                   help="show only the JSON body diff")
    return parser


def main(argv: Optional[List[str]] = None) -> int:
    args = build_parser().parse_args(argv)
    if args.command == "diff":
        try:
            with open(args.file_a, "r", encoding="utf-8", errors="replace") as fh:
                text_a = fh.read()
            with open(args.file_b, "r", encoding="utf-8", errors="replace") as fh:
                text_b = fh.read()
        except OSError as exc:
            print("error: {}".format(exc), file=sys.stderr)
            return 2
        diff = diff_responses(text_a, text_b)
        print(render(diff, json_only=args.json_only))
        return 0
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
