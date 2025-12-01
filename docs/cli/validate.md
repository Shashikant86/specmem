# specmem validate

Validate specifications for quality and consistency.

## Usage

```bash
specmem validate [OPTIONS]
```

## Description

Runs validation rules against all specifications to detect issues like missing acceptance criteria, contradictions, and invalid formats.

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--spec, -s SPEC` | Validate specific spec | all |
| `--rules RULES` | Comma-separated rules to run | all |
| `--severity LEVEL` | Minimum severity (error, warning, info) | `warning` |
| `--strict` | Fail on warnings | `false` |
| `--fix` | Auto-fix fixable issues | `false` |
| `--dry-run` | Show fixes without applying | `false` |
| `--format FORMAT` | Output format (text, json) | `text` |

## Examples

### Validate All Specs

```bash
specmem validate
```

Output:

```
✅ SpecValidator Results

📊 Summary:
   • Specs checked: 24
   • Errors: 2
   • Warnings: 5
   • Info: 3

❌ Errors:
   auth/requirements.md:45
     Rule: acceptance_criteria
     Missing acceptance criteria for requirement "User Login"

   api/design.md:12
     Rule: constraints
     Invalid constraint format: "fast response times"

⚠️  Warnings:
   auth/design.md:78
     Rule: vague_terms
     Vague term "quickly" in requirement

   security/constraints.md:23
     Rule: duplicates
     Duplicate constraint detected (also in auth/constraints.md:15)

ℹ️  Info:
   legacy/old-feature.md:1
     Rule: lifecycle
     Spec marked as deprecated, consider archiving
```

### Validate Specific Spec

```bash
specmem validate --spec auth/requirements.md
```

### Only Errors

```bash
specmem validate --severity error
```

### Specific Rules

```bash
specmem validate --rules structure,acceptance_criteria
```

### Strict Mode (for CI)

```bash
specmem validate --strict
```

Exit code 3 if any warnings or errors.

### Auto-fix

```bash
# Preview fixes
specmem validate --fix --dry-run

# Apply fixes
specmem validate --fix
```

### JSON Output

```bash
specmem validate --format json
```

Output:

```json
{
  "summary": {
    "specs_checked": 24,
    "errors": 2,
    "warnings": 5,
    "info": 3
  },
  "issues": [
    {
      "spec": "auth/requirements.md",
      "line": 45,
      "rule": "acceptance_criteria",
      "severity": "error",
      "message": "Missing acceptance criteria for requirement",
      "suggestion": "Add acceptance criteria using EARS format",
      "fixable": false
    }
  ]
}
```

## Validation Rules

| Rule | Description |
|------|-------------|
| `structure` | Valid Markdown structure |
| `timeline` | Temporal consistency |
| `duplicates` | No duplicate specs |
| `constraints` | Valid constraint format |
| `acceptance_criteria` | Requirements have criteria |
| `contradiction` | No conflicting specs |
| `vague_terms` | No vague language |

## Severity Levels

| Level | Description | Exit Code |
|-------|-------------|-----------|
| `error` | Must be fixed | 3 |
| `warning` | Should be fixed | 0 (3 with --strict) |
| `info` | Suggestion | 0 |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | No errors (warnings allowed) |
| 1 | General error |
| 3 | Validation errors found |

## CI Integration

```yaml
# GitHub Actions
- name: Validate Specs
  run: specmem validate --strict
```

## See Also

- [SpecValidator](../user-guide/validator.md)
