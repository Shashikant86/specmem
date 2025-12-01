# specmem scan

Scan and index specifications from your project.

## Usage

```bash
specmem scan [OPTIONS]
```

## Description

Scans your project for specification files from all enabled adapters and indexes them in the vector database.

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--path, -p PATH` | Path to scan | `.` |
| `--adapter ADAPTER` | Only use specific adapter | all enabled |
| `--force, -f` | Force re-index all specs | `false` |
| `--dry-run` | Show what would be indexed | `false` |
| `--verbose, -v` | Show detailed output | `false` |

## Examples

### Basic Scan

```bash
specmem scan
```

Output:

```
🔍 Scanning for specifications...

Adapters:
  ✅ kiro: .kiro/specs/
  ✅ cursor: cursor.json, .cursorrules
  ✅ claude: Claude.md

Found:
  📄 .kiro/specs/auth/requirements.md
  📄 .kiro/specs/auth/design.md
  📄 .kiro/specs/auth/tasks.md
  📄 .kiro/specs/api/requirements.md
  📄 cursor.json (3 rules)
  📄 Claude.md (1 context)

📊 Total: 8 specifications indexed
⏱️  Time: 1.2s
```

### Scan Specific Path

```bash
specmem scan --path ./features
```

### Use Specific Adapter

```bash
specmem scan --adapter kiro
```

### Force Re-index

```bash
specmem scan --force
```

### Dry Run

```bash
specmem scan --dry-run
```

Output:

```
🔍 Dry run - no changes will be made

Would index:
  📄 .kiro/specs/auth/requirements.md (new)
  📄 .kiro/specs/auth/design.md (modified)
  📄 .kiro/specs/api/requirements.md (unchanged)

Summary:
  • New: 1
  • Modified: 1
  • Unchanged: 1
```

## Incremental Scanning

By default, SpecMem only re-indexes specs that have changed since the last scan. Use `--force` to re-index everything.

## Supported Adapters

| Adapter | Files |
|---------|-------|
| `kiro` | `.kiro/specs/**/*.md` |
| `cursor` | `cursor.json`, `.cursorrules` |
| `claude` | `Claude.md`, `CLAUDE.md` |
| `speckit` | `.speckit/**/*.yaml` |
| `tessl` | `.tessl/**/*.md` |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error during scan |
| 4 | No specs found |

## See Also

- [Adapters](../user-guide/adapters.md)
- [specmem build](build.md)
