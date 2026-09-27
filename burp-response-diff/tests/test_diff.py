"""Tests for burp-response-diff.

Uses two sample JSON responses in tests/fixtures and asserts the structural
body diff detects changed, removed, and added keys, and that key headers and
status are compared correctly.
"""
import base64
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import burp_response_diff as brd  # noqa: E402

FIXTURES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fixtures")


def read_fixture(name: str) -> str:
    with open(os.path.join(FIXTURES, name), "r", encoding="utf-8") as fh:
        return fh.read()


def test_parse_response_basic():
    status, headers, body = brd.parse_response(read_fixture("account_a.txt"))
    assert status == "HTTP/1.1 200 OK"
    assert headers["content-type"] == "application/json"
    assert '"user_id": 1001' in body


def test_changed_key_detection():
    diff = brd.diff_responses(read_fixture("account_a.txt"),
                              read_fixture("account_b.txt"))
    body = diff["body"]
    assert body["parseable"] is True
    # role changed admin<-user between the two accounts' responses.
    assert "role" in body["changed"]
    assert body["changed"]["role"] == {"a": "user", "b": "admin"}


def test_removed_key_detection():
    diff = brd.diff_responses(read_fixture("account_a.txt"),
                              read_fixture("account_b.txt"))
    # A exposed "ssn"; B did not.
    assert "ssn" in diff["body"]["removed"]


def test_added_key_detection():
    # Reverse the arguments: now "ssn" is present in B (the second arg) only.
    diff = brd.diff_responses(read_fixture("account_b.txt"),
                              read_fixture("account_a.txt"))
    assert "ssn" in diff["body"]["added"]


def test_header_diff_surfaces_set_cookie():
    diff = brd.diff_responses(read_fixture("account_a.txt"),
                              read_fixture("account_b.txt"))
    assert "set-cookie" in diff["headers"]
    assert diff["headers"]["set-cookie"]["a"] != diff["headers"]["set-cookie"]["b"]


def test_status_same():
    diff = brd.diff_responses(read_fixture("account_a.txt"),
                              read_fixture("account_b.txt"))
    assert diff["status"]["same"] is True


def test_nested_json_changed_path():
    a = 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"data": {"items": [{"id": 1}]}}'
    b = 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"data": {"items": [{"id": 2}]}}'
    diff = brd.diff_responses(a, b)
    assert "data.items[0].id" in diff["body"]["changed"]


def test_non_json_body_marked_unparseable():
    a = "HTTP/1.1 200 OK\nContent-Type: text/html\n\n<html>a</html>"
    b = "HTTP/1.1 200 OK\nContent-Type: text/html\n\n<html>b</html>"
    diff = brd.diff_responses(a, b)
    assert diff["body"]["parseable"] is False


def test_burp_base64_export_parsed():
    raw = "HTTP/1.1 403 Forbidden\r\nContent-Type: application/json\r\n\r\n{\"error\": \"denied\"}"
    encoded = base64.b64encode(raw.encode()).decode()
    export = '<?xml version="1.0"?><items><item><response base64="true">' + \
             encoded + "</response></item></items>"
    status, headers, body = brd.parse_response(export)
    assert status == "HTTP/1.1 403 Forbidden"
    assert '"error"' in body


def test_render_json_only(capsys):
    diff = brd.diff_responses(read_fixture("account_a.txt"),
                              read_fixture("account_b.txt"))
    text = brd.render(diff, json_only=True)
    assert "STATUS" not in text
    assert "JSON BODY" in text
    assert "role" in text


def test_main_diff_runs(capsys):
    rc = brd.main(["diff",
                   os.path.join(FIXTURES, "account_a.txt"),
                   os.path.join(FIXTURES, "account_b.txt")])
    out = capsys.readouterr().out
    assert rc == 0
    assert "STATUS" in out
    assert "JSON BODY" in out
