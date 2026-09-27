# burp-response-diff

A two-account **BOLA/IDOR** helper. Give it two saved HTTP responses — the same
resource requested as account A and as account B — and it prints a
field-by-field diff:

- **status** line
- a curated set of **security-relevant headers** (content-type, set-cookie,
  location, www-authenticate, …)
- a **structural JSON body diff**: added / removed / changed keys, with paths

If account B's response carries account A's data — identical values where they
should differ, or no difference at all — you have a candidate broken
object-level authorization finding to verify.

## ⚠️ Authorized use only

Use this only against applications you own or are explicitly authorized to test
(e.g. an in-scope bug-bounty target). It only reads local files you provide; it
makes no requests of its own.

## Requirements

- Python 3.8+ (standard library only for the tool).
- [`pytest`](https://pytest.org) to run the tests (`requirements.txt`).

## Install

```bash
git clone <this-repo-url>
cd burp-response-diff
python3 -m pip install -r requirements.txt   # only needed to run the tests
```

## Usage

```
python3 burp_response_diff.py diff A.txt B.txt [--json-only]
```

- `A.txt`, `B.txt` — saved responses. Each may be a **raw HTTP response** or a
  single-item **Burp Suite XML export** (base64-encoded responses are decoded
  automatically).
- `--json-only` — print only the JSON body diff.

### Example

```bash
python3 burp_response_diff.py diff account_a.txt account_b.txt
```

```
STATUS
  A: HTTP/1.1 200 OK
  B: HTTP/1.1 200 OK  [==]

HEADERS (security-relevant, differing only)
  set-cookie
    A: session=aaaa; HttpOnly
    B: session=bbbb; HttpOnly

JSON BODY
  removed (in A, not B):
    - ssn
  changed (value differs A -> B):
    ~ role: 'user' -> 'admin'
```

## Capturing pairs with Burp + an AI CLI (MCP)

Burp Suite can expose an [MCP](https://modelcontextprotocol.io/) server (for
example via the official **MCP Server** BApp / extension), typically over an SSE
endpoint such as `http://127.0.0.1:9876/sse`. You can point an MCP-capable AI
CLI at that endpoint so the assistant can drive Burp — replaying a request under
two different session cookies and saving each response — and then run this tool
on the exported pair.

A sketch of the workflow (adapt endpoints and file names to your setup — nothing
here is hardcoded into the tool):

1. In Burp, enable the MCP server extension and note its SSE URL.
2. Configure your AI CLI with an MCP server entry pointing at that SSE URL,
   e.g. (generic MCP client config shape):

   ```json
   {
     "mcpServers": {
       "burp": { "url": "http://127.0.0.1:9876/sse" }
     }
   }
   ```

3. Ask the assistant to repeat one request twice — once with account A's
   session, once with account B's — and save each response to a file
   (`a.txt`, `b.txt`).
4. Diff the exported pair:

   ```bash
   python3 burp_response_diff.py diff a.txt b.txt
   ```

This tool deliberately does **not** talk to Burp or the network itself — it only
diffs files you hand it, so it stays simple and safe to run offline.

## Tests

```bash
python3 -m pytest tests/ -q
```

The suite diffs the two sample responses in `tests/fixtures/` and asserts
changed-, removed-, and added-key detection, header diffing, and Burp
base64-export parsing.

## License

[MIT](LICENSE)
