#!/usr/bin/env python3
"""hmac-session-cracker — recover a weak HMAC-SHA256 signing secret offline.

Given a signed session token and a wordlist of candidate secrets, this tool
finds which candidate (if any) produces the token's signature. It performs the
HMAC locally and makes **no network calls**.

Two token formats are supported:

  * express  ``s:<value>.<sig>`` — the express-session / cookie-signature
    layout, where ``sig = base64(HMAC_SHA256(secret, value))`` with trailing
    ``=`` padding stripped. Both URL-safe and standard base64 alphabets are
    accepted so real-world cookies (URL-decoded or not) compare correctly.

  * generic  ``<message>.<b64sig>`` — any message signed the same way.

Authorized use only: only test tokens issued by applications you own or are
explicitly authorized to assess. See the README.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import hmac
import sys
from concurrent.futures import ProcessPoolExecutor, as_completed
from typing import Iterable, Iterator, List, Optional, Tuple


def normalize_sig(sig: str) -> str:
    """Normalize a base64 signature for comparison.

    Maps the standard base64 alphabet onto the URL-safe one and strips any
    ``=`` padding, so ``base64`` and ``base64url`` encodings of the same bytes
    compare equal.
    """
    return sig.replace("+", "-").replace("/", "_").rstrip("=")


def sign(secret: str, value: str) -> str:
    """Return base64url(HMAC_SHA256(secret, value)) with padding stripped."""
    digest = hmac.new(secret.encode("utf-8"), value.encode("utf-8"),
                      hashlib.sha256).digest()
    return base64.urlsafe_b64encode(digest).decode("ascii").rstrip("=")


def parse_cookie(cookie: str, mode: str) -> Tuple[str, str]:
    """Split a token into (value, signature) for the given mode.

    Raises ValueError if the token does not match the expected shape.
    """
    token = cookie.strip()
    if mode == "express":
        # Accept a leading "s:" or the URL-encoded "s%3A".
        if token.startswith("s:"):
            token = token[2:]
        elif token.startswith("s%3A") or token.startswith("s%3a"):
            token = token[4:]
        else:
            raise ValueError(
                "express cookie must start with 's:' (or 's%3A'); "
                "got: {!r}".format(cookie)
            )
    if "." not in token:
        raise ValueError(
            "token has no '.' separating value from signature: {!r}".format(cookie)
        )
    value, _, sig = token.rpartition(".")
    if not value or not sig:
        raise ValueError("empty value or signature in token: {!r}".format(cookie))
    return value, sig


def _check_chunk(value: str, target: str, candidates: List[str]) -> Optional[str]:
    """Return the first candidate in the chunk that reproduces target, else None."""
    for secret in candidates:
        if hmac.compare_digest(normalize_sig(sign(secret, value)), target):
            return secret
    return None


def _chunked(iterable: Iterable[str], size: int) -> Iterator[List[str]]:
    chunk: List[str] = []
    for item in iterable:
        chunk.append(item)
        if len(chunk) >= size:
            yield chunk
            chunk = []
    if chunk:
        yield chunk


def crack(value: str, sig: str, words: Iterable[str],
          workers: int = 1, chunk_size: int = 2000) -> Optional[str]:
    """Return the secret that signs ``value`` to ``sig``, or None.

    Runs single-process when workers <= 1, otherwise fans chunks of the
    wordlist out to a process pool and returns as soon as a match is found.
    """
    target = normalize_sig(sig)

    if workers <= 1:
        for secret in words:
            if hmac.compare_digest(normalize_sig(sign(secret, value)), target):
                return secret
        return None

    with ProcessPoolExecutor(max_workers=workers) as pool:
        futures = {
            pool.submit(_check_chunk, value, target, chunk): chunk
            for chunk in _chunked(words, chunk_size)
        }
        for future in as_completed(futures):
            result = future.result()
            if result is not None:
                # Cancel any not-yet-started work; return the first hit.
                for f in futures:
                    f.cancel()
                return result
    return None


def load_words(path: str) -> List[str]:
    """Read a wordlist file, one candidate secret per line (blank lines dropped)."""
    with open(path, "r", encoding="utf-8", errors="replace") as fh:
        return [line.rstrip("\n") for line in fh if line.strip() != ""]


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="hmac-session-cracker",
        description="Recover a weak HMAC-SHA256 signing secret from a signed "
                    "session token using a wordlist. Offline; no network calls.",
    )
    parser.add_argument("--cookie", required=True,
                        help="the signed token to attack")
    parser.add_argument("--wordlist", required=True,
                        help="path to a candidate-secret wordlist (one per line)")
    parser.add_argument("--mode", choices=("express", "generic"),
                        default="express",
                        help="token format (default: express)")
    parser.add_argument("--workers", type=int, default=1,
                        help="parallel worker processes (default: 1)")
    return parser


def main(argv: Optional[List[str]] = None) -> int:
    args = build_parser().parse_args(argv)

    try:
        value, sig = parse_cookie(args.cookie, args.mode)
    except ValueError as exc:
        print("error: {}".format(exc), file=sys.stderr)
        return 2

    try:
        words = load_words(args.wordlist)
    except OSError as exc:
        print("error: cannot read wordlist: {}".format(exc), file=sys.stderr)
        return 2

    secret = crack(value, sig, words, workers=max(1, args.workers))
    if secret is not None:
        print("secret found: {}".format(secret))
        return 0
    print("not found")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
