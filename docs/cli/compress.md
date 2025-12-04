# specmem compress

Compress verbose specifications to reduce context size.

## Synopsis

```bash
specmem compress [SPEC_NAMES]... [OPTIONS]
```

## Description

The `compress` command condenses verbose specs while preserving essential content like acceptance criteria. This helps:

- Reduce token usage when serving specs to agents
- Identify overly verbose specifications
- Maintain focused, actionable documentation

## Arguments

| Argument | Description |
|----------|-------------|
| `SPEC_NAMES` | Optional list of specific spec names to compress |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--threshold`, `-t` | `5000` | Character threshold for verbose detection |
| `--all`, `-a` | `false` | Compress all verbose specs |
| `--save`, `-s` | `false` | Save compressed versions to disk |
| `--path`, `-p` | `.` | Repository path |

## Examples

### Find verbose specs

```bash
specmem compress
```

Lists specs exceeding the character threshold.

### Compress specific spec

```bash
specmem compress auth-feature
```

Shows compression results for the specified spec.

### Compress all verbose specs

```bash
specmem compress --all
```

Compresses all specs exceeding the threshold.

### Save compressed versions

```bash
specmem compress --all --save
```

Compresses and saves to `.specmem/compressed/`.

### Custom threshold

```bash
specmem compress --all --threshold 3000
```

Uses a lower threshold for verbose detection.

## Output

The command displays a table showing:

- **Spec**: Specification name
- **Original**: Original size in characters
- **Compressed**: Compressed size in characters
- **Ratio**: Compression ratio (compressed/original)
- **Criteria**: Number of preserved acceptance criteria

## Compression Strategy

The compressor:

1. **Preserves** all acceptance criteria verbatim
2. **Condenses** verbose descriptions and explanations
3. **Removes** redundant content and boilerplate
4. **Maintains** structural integrity

## Storage

Compressed specs are stored in `.specmem/compressed/` alongside originals, allowing:

- Serving compressed versions to agents by default
- Expanding to full versions when needed
- Tracking compression ratios in health reports

## See Also

- [specmem health](health.md) - View spec health scores
- [specmem prune](prune.md) - Remove orphaned specs
