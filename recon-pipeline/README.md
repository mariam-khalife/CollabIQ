# recon-pipeline

A small, dependency-light Bash wrapper that chains the
[ProjectDiscovery](https://github.com/projectdiscovery) recon tools into one
pass:

```
subfinder  ->  dnsx  ->  httpx  ->  nuclei
```

Every output file is named with a **target prefix** you pass in, so results from
different engagements never collide or silently overwrite each other. Stages are
deduplicated and sorted between steps, `httpx` narrows to live hosts, and
`nuclei` runs with a severity filter.

## ⚠️ Authorized use only

This tool automates active reconnaissance and vulnerability scanning against
hosts. Run it **only** against assets you own or are explicitly authorized to
test — for example, domains inside the scope of a bug-bounty program that
permits automated scanning. You are responsible for staying within scope and
within the program's rules. Do not point it at third parties.

## Requirements

The wrapper shells out to these tools; install them and make sure they are on
your `PATH`:

- [`subfinder`](https://github.com/projectdiscovery/subfinder)
- [`dnsx`](https://github.com/projectdiscovery/dnsx)
- [`httpx`](https://github.com/projectdiscovery/httpx)
- [`nuclei`](https://github.com/projectdiscovery/nuclei)

Plus a POSIX-ish environment with `bash` and coreutils (`sort`). If any tool is
missing, the pipeline stops with a clear error before doing anything.

## Install

```bash
git clone <this-repo-url>
cd recon-pipeline
chmod +x recon-pipeline.sh
```

## Usage

```
./recon-pipeline.sh -t <target-prefix> -d <scope-file> -o <outdir> [-r <resolver>] [-s <severity>] [--dry-run]
```

| Flag        | Meaning                                                                 |
|-------------|-------------------------------------------------------------------------|
| `-t`        | Prefix for every output file (e.g. `acme-2026`). **Required.**          |
| `-d`        | Scope file: root domains, one per line. **Required.**                   |
| `-o`        | Output directory (created if missing). **Required.**                    |
| `-r`        | Resolver IP or resolver file, passed through to `dnsx` (`-r`).          |
| `-s`        | `nuclei` severity filter (default `low,medium,high,critical`).          |
| `--dry-run` | Print the exact command chain and exit — runs nothing.                  |
| `-h`        | Help.                                                                   |

### Example

Scope file `scope.txt`:

```
example.com
example.org
```

Dry run (prints the chain, executes nothing):

```bash
./recon-pipeline.sh -t acme-2026 -d scope.txt -o out --dry-run
```

Real run, forcing a specific resolver for a DNS-restricted network:

```bash
./recon-pipeline.sh -t acme-2026 -d scope.txt -o out -r 1.1.1.1 -s medium,high,critical
```

## Outputs

All prefixed with your `-t` value:

| File                      | Stage                                   |
|---------------------------|-----------------------------------------|
| `<prefix>-subs.txt`       | deduped subdomains (`subfinder`)        |
| `<prefix>-resolved.txt`   | resolved hosts (`dnsx`)                 |
| `<prefix>-live.txt`       | live HTTP(S) hosts (`httpx`)            |
| `<prefix>-nuclei.txt`     | `nuclei` findings                       |

## Tests

The test runs the pipeline in `--dry-run` mode and asserts that every stage
filename uses the prefix and that nothing is executed:

```bash
bash tests/test_dry_run.sh
```

## License

[MIT](LICENSE)
