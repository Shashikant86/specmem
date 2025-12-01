# 💻 CLI Reference

SpecMem provides a comprehensive command-line interface for all operations.

## Installation

```bash
pip install specmem
```

## Global Options

```bash
specmem [OPTIONS] COMMAND [ARGS]...

Options:
  --version        Show version and exit
  --config PATH    Path to config file
  --verbose, -v    Enable verbose output
  --quiet, -q      Suppress output
  --help           Show help and exit
```

## Commands Overview

| Command | Description |
|---------|-------------|
| [`init`](init.md) | Initialize SpecMem in a project |
| [`scan`](scan.md) | Scan and index specifications |
| [`build`](build.md) | Build the Agent Experience Pack |
| [`query`](query.md) | Search specifications |
| [`impact`](impact.md) | Analyze impact of changes |
| [`validate`](validate.md) | Validate specifications |
| [`serve`](serve.md) | Start the web UI |

## Quick Reference

```bash
# Initialize
specmem init

# Scan specs
specmem scan

# Build pack
specmem build

# Query
specmem query "authentication"

# Impact analysis
specmem impact --files src/auth.py

# Validate
specmem validate

# Web UI
specmem serve
```

## Configuration

SpecMem looks for configuration in this order:

1. `--config` flag
2. `.specmem.toml` in current directory
3. `.specmem.local.toml` (local overrides)
4. Environment variables

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Configuration error |
| 3 | Validation errors found |
| 4 | No specs found |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SPECMEM_CONFIG` | Path to config file |
| `SPECMEM_LOG_LEVEL` | Log level (debug, info, warning, error) |
| `SPECMEM_NO_COLOR` | Disable colored output |
