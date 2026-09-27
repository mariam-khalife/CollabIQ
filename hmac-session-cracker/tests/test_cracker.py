"""Tests for hmac-session-cracker.

We sign a known value with a known secret using the same scheme the tool
attacks, then assert the cracker recovers it from a tiny wordlist — and reports
"not found" when the secret is absent.
"""
import base64
import hashlib
import hmac
import os
import sys

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import hmac_session_cracker as hsc  # noqa: E402


def reference_sign_urlsafe(secret: str, value: str) -> str:
    """base64url(HMAC_SHA256(secret, value)) with padding stripped."""
    digest = hmac.new(secret.encode(), value.encode(), hashlib.sha256).digest()
    return base64.urlsafe_b64encode(digest).decode().rstrip("=")


def reference_sign_standard(secret: str, value: str) -> str:
    """Standard-base64 (cookie-signature style) with padding stripped."""
    digest = hmac.new(secret.encode(), value.encode(), hashlib.sha256).digest()
    return base64.b64encode(digest).decode().rstrip("=")


def test_sign_matches_reference():
    assert hsc.sign("s3cr3t", "hello") == reference_sign_urlsafe("s3cr3t", "hello")


def test_parse_express_cookie():
    value, sig = hsc.parse_cookie("s:abc123.SIGPART", "express")
    assert value == "abc123"
    assert sig == "SIGPART"


def test_parse_express_url_encoded_prefix():
    value, sig = hsc.parse_cookie("s%3Aabc123.SIGPART", "express")
    assert value == "abc123"
    assert sig == "SIGPART"


def test_parse_generic_cookie():
    value, sig = hsc.parse_cookie("my.message.SIG", "generic")
    assert value == "my.message"
    assert sig == "SIG"


def test_parse_express_requires_prefix():
    with pytest.raises(ValueError):
        hsc.parse_cookie("abc123.SIGPART", "express")


def test_crack_recovers_known_secret_express():
    value = "sessionid-42"
    secret = "password1"
    sig = reference_sign_urlsafe(secret, value)
    cookie = "s:{}.{}".format(value, sig)

    parsed_value, parsed_sig = hsc.parse_cookie(cookie, "express")
    wordlist = ["letmein", "admin", "password1", "hunter2"]
    found = hsc.crack(parsed_value, parsed_sig, wordlist)
    assert found == "password1"


def test_crack_recovers_standard_base64_signature():
    # Real cookie-signature uses the standard base64 alphabet; the cracker
    # normalizes both alphabets, so it must still match.
    value = "sessionid-99"
    secret = "keyboard cat"
    sig = reference_sign_standard(secret, value)
    found = hsc.crack(value, sig, ["nope", "keyboard cat", "cat"])
    assert found == "keyboard cat"


def test_crack_returns_none_when_absent():
    value = "sessionid-42"
    sig = reference_sign_urlsafe("super-strong-unguessable", value)
    found = hsc.crack(value, sig, ["letmein", "admin", "password1"])
    assert found is None


def test_crack_parallel_workers():
    value = "abc"
    secret = "needle"
    sig = reference_sign_urlsafe(secret, value)
    words = ["a", "b", "c", "needle", "d", "e"]
    found = hsc.crack(value, sig, words, workers=2, chunk_size=2)
    assert found == "needle"


def test_main_found(tmp_path, capsys):
    value = "sid"
    secret = "qwerty"
    sig = reference_sign_urlsafe(secret, value)
    wl = tmp_path / "words.txt"
    wl.write_text("foo\nqwerty\nbar\n")
    rc = hsc.main(["--cookie", "s:{}.{}".format(value, sig),
                   "--wordlist", str(wl), "--mode", "express"])
    out = capsys.readouterr().out
    assert rc == 0
    assert "secret found: qwerty" in out


def test_main_not_found(tmp_path, capsys):
    value = "sid"
    sig = reference_sign_urlsafe("not-in-list", value)
    wl = tmp_path / "words.txt"
    wl.write_text("foo\nbar\n")
    rc = hsc.main(["--cookie", "s:{}.{}".format(value, sig),
                   "--wordlist", str(wl), "--mode", "express"])
    out = capsys.readouterr().out
    assert rc == 1
    assert "not found" in out
