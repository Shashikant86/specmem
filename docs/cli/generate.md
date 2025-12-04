# specmem generate

Generate specifications from existing code files.

## Synopsis

```bash
specmem generate FILES... [OPTIONS]
```

## Description

The `generate` command creates spec documents from existing code, enabling brownfield adoption of spec-driven development. It analyzes:

- Function signatures and docstrings
- Class definitions and methods
- Comments and documentation
- Module structure

Generated specs are marked as "auto-generated" for future reference.

## Arguments

| Argument | Description |
|----------|-------------|
| `FILES` | Code files or directories to generate specs from (required) |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--format`, `-f` | `kiro` | Output format: `kiro` or `speckit` |
| `--output`, `-o` | `.kiro/specs` | Output directory for generated specs |
| `--group-by`, `-g` | `directory` | Grouping: `file`, `directory`, or `module` |
| `--write`, `-w` | `false` | Write specs to disk |
| `--path`, `-p` | `.` | Repository path |

## Examples

### Preview spec from a file

```bash
specmem generate src/auth.py
```

Shows what spec would be generated without writing to disk.

### Generate from directory

```bash
specmem generate src/
```

Generates specs for all code files in the directory.

### Write specs to disk

```bash
specmem generate src/auth/ --write
```

Generates and saves specs to `.kiro/specs/`.

### One spec per file

```bash
specmem generate src/ --group-by file --write
```

Creates a separate spec for each source file.

### Custom output format

```bash
specmem generate src/ --format speckit --write
```

Generates specs in SpecKit format.

## Output

The command displays a table showing:

- **Name**: Generated spec name
- **Format**: Output format used
- **Sources**: Number of source files analyzed
- **Size**: Content size in characters

When `--write` is used, shows the paths where specs were written.

## Generated Content

Each generated spec includes:

- **Requirements**: Inferred from function purposes
- **User Stories**: Based on module/class functionality
- **Acceptance Criteria**: Derived from function signatures
- **Metadata**: Auto-generated marker and timestamp

## Grouping Strategies

| Strategy | Description |
|----------|-------------|
| `file` | One spec per source file |
| `directory` | One spec per directory (default) |
| `module` | One spec per Python module/package |

## See Also

- [specmem compress](compress.md) - Compress verbose specs
- [specmem health](health.md) - View spec health scores
