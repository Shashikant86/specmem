# specmem steering

Query steering files applicable to specific files.

## Usage

```bash
specmem steering [OPTIONS]
```

## Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--file` | `-f` | Show steering files applicable to this file | None |
| `--path` | `-p` | Workspace path | `.` |

## Description

The `steering` command queries Kiro steering files from `.kiro/steering/`.

Without `--file`, it shows all steering files in the workspace.

With `--file`, it shows only steering files that would apply to that specific file based on:
- `inclusion: always` - Always included
- `inclusion: fileMatch` with matching `fileMatchPattern`

## Examples

### Show all steering files

```bash
specmem steering
```

Output:
```
📝 All Steering Files
┌──────────────┬─────────────────────┬───────────┬─────────┐
│ File         │ Title               │ Inclusion │ Pattern │
├──────────────┼─────────────────────┼───────────┼─────────┤
│ python.md    │ Python Guidelines   │ fileMatch │ *.py    │
│ security.md  │ Security Standards  │ always    │ -       │
│ testing.md   │ Testing Guidelines  │ fileMatch │ tests/* │
└──────────────┴─────────────────────┴───────────┴─────────┘
```

### Show steering for a Python file

```bash
specmem steering --file src/auth/service.py
```

Output:
```
Steering files for: src/auth/service.py

╭─ 📝 Python Guidelines ─────────────────────────────────╮
│ - Use type hints for all functions                     │
│ - Follow PEP 8 style guide                             │
│ - Write docstrings in Google format                    │
│                                                        │
│ inclusion: fileMatch                                   │
╰────────────────────────────────────────────────────────╯

╭─ 📝 Security Standards ────────────────────────────────╮
│ - Never log sensitive data                             │
│ - Validate all user input                              │
│ - Use parameterized queries                            │
│                                                        │
│ inclusion: always                                      │
╰────────────────────────────────────────────────────────╯
```

### Show steering for a test file

```bash
specmem steering --file tests/test_auth.py
```

### Show steering for a TypeScript file

```bash
specmem steering --file src/components/Button.tsx
```

## Inclusion Modes

| Mode | Behavior |
|------|----------|
| `always` | Always included for any file |
| `fileMatch` | Included only when file matches `fileMatchPattern` |
| `manual` | Never auto-included (not shown in `--file` queries) |

## Pattern Matching

The `fileMatchPattern` uses glob syntax:

| Pattern | Matches |
|---------|---------|
| `*.py` | All Python files |
| `tests/*.py` | Python files in tests/ |
| `**/*.ts` | TypeScript files anywhere |
| `src/auth/*` | Files in src/auth/ |

## No Matches

If no steering files apply to a file:

```bash
specmem steering --file random.xyz
```

Output:
```
No steering files apply to: random.xyz
```

## See Also

- [specmem kiro-config](kiro-config.md) - Show all Kiro configuration
- [Kiro Configuration Guide](../user-guide/kiro-config.md) - Full documentation
