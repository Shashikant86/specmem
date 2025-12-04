# specmem prune

Archive or delete orphaned and stale specifications.

## Synopsis

```bash
specmem prune [SPEC_NAMES]... [OPTIONS]
```

## Description

The `prune` command helps maintain a lean spec collection by identifying and removing specs that are no longer relevant. It supports:

- **Orphaned specs**: Specs with no code references
- **Stale specs**: Specs not modified within a threshold period
- **Explicit targeting**: Prune specific specs by name

By default, pruning operates in dry-run mode to preview changes safely.

## Arguments

| Argument | Description |
|----------|-------------|
| `SPEC_NAMES` | Optional list of specific spec names to prune |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--mode`, `-m` | `archive` | Prune mode: `archive` or `delete` |
| `--dry-run/--no-dry-run` | `--dry-run` | Preview changes without applying |
| `--force`, `-f` | `false` | Force delete without confirmation |
| `--orphaned` | `false` | Prune all orphaned specs |
| `--stale` | `false` | Prune all stale specs |
| `--stale-days` | `90` | Days threshold for stale detection |
| `--path`, `-p` | `.` | Repository path |

## Examples

### Analyze specs (no changes)

```bash
specmem prune
```

Shows a health analysis table without making any changes.

### Preview orphaned specs

```bash
specmem prune --orphaned
```

Shows what would be archived if you ran with `--no-dry-run`.

### Archive orphaned specs

```bash
specmem prune --orphaned --no-dry-run
```

Archives all orphaned specs to `.specmem/archive/`.

### Delete specific specs

```bash
specmem prune old-feature legacy-auth --mode delete --no-dry-run --force
```

Permanently deletes the specified specs.

### Prune stale specs

```bash
specmem prune --stale --stale-days 60 --no-dry-run
```

Archives specs not modified in the last 60 days.

## Output

The command displays a table showing:

- **Spec**: Specification name
- **Action**: `archived`, `deleted`, or `skipped`
- **Reason**: Why the action was taken

## Archive Location

Archived specs are stored in `.specmem/archive/` with metadata including:

- Original path
- Archive timestamp
- Health score at time of archiving
- Reason for archiving

## See Also

- [specmem health](health.md) - View spec health scores
- [specmem generate](generate.md) - Generate specs from code
