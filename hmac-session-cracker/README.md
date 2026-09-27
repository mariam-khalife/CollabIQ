# hmac-session-cracker

An **offline** tool that recovers a weak HMAC-SHA256 signing secret from a
signed session token by testing a wordlist of candidate secrets. It is useful
for demonstrating the impact of a guessable/default session-signing key (a
common misconfiguration in `express-session` deployments).

It computes HMAC locally and makes **no network calls**.

## ⚠️ Authorized use only

Only test cookies and tokens from applications **you own or are explicitly
authorized to assess** — for example, a target that is in scope for a
bug-bounty program, or your own staging environment. Recovering a signing
secret for a system you do not have permission to test is unauthorized access.
Use responsibly and within the rules of your engagement.

## Supported formats

| Mode      | Shape                    | Signature                                                        |
|-----------|--------------------------|------------------------------------------------------------------|
| `express` | `s:<value>.<sig>`        | `base64(HMAC_SHA256(secret, value))` with `=` padding stripped   |
| `generic` | `<message>.<b64sig>`     | same scheme over an arbitrary message                            |

The `express` mode matches the
[`cookie-signature`](https://www.npmjs.com/package/cookie-signature) layout used
by [`express-session`](https://www.npmjs.com/package/express-session). Both the
standard and URL-safe base64 alphabets are accepted, and a leading URL-encoded
`s%3A` prefix is handled, so a cookie copied straight from a browser compares
correctly.

## Requirements

- Python 3.8+
- Standard library only for the tool itself. [`pytest`](https://pytest.org) is
  needed to run the tests (see `requirements.txt`).

## Install

```bash
git clone <this-repo-url>
cd hmac-session-cracker
python3 -m pip install -r requirements.txt   # only needed to run the tests
```

## Usage

```
python3 hmac_session_cracker.py --cookie <token> --wordlist <file> [--mode express|generic] [--workers N]
```

| Flag         | Meaning                                              |
|--------------|------------------------------------------------------|
| `--cookie`   | The signed token to attack. **Required.**            |
| `--wordlist` | Candidate-secret list, one per line. **Required.**   |
| `--mode`     | `express` (default) or `generic`.                    |
| `--workers`  | Parallel worker processes (default 1).               |

On success it prints `secret found: <secret>` and exits `0`; otherwise it prints
`not found` and exits `1`.

### Example

```bash
# Suppose you captured this cookie from an app you're authorized to test:
python3 hmac_session_cracker.py \
  --cookie 's:sessionid-42.<signature>' \
  --wordlist /usr/share/wordlists/rockyou.txt \
  --mode express \
  --workers 4
```

You can reproduce a signed token for testing with Python's stdlib:

```python
import base64, hashlib, hmac
value, secret = "sessionid-42", "password1"
sig = base64.urlsafe_b64encode(
    hmac.new(secret.encode(), value.encode(), hashlib.sha256).digest()
).decode().rstrip("=")
print(f"s:{value}.{sig}")
```

## Tests

```bash
python3 -m pytest tests/ -q
```

The suite signs a known value with a known secret and asserts the cracker
recovers it from a tiny wordlist, and that it reports `not found` when the
secret is absent.

## License

[MIT](LICENSE)
