# specmem impact

Analyze the impact of code changes on specifications.

## Usage

```bash
specmem impact [OPTIONS]
```

## Description

Identifies which specifications and tests are affected by code changes using the impact graph.

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--files, -f FILES` | Files to analyze | required* |
| `--git-diff` | Use git diff for changed files | `false` |
| `--git-staged` | Use git staged files | `false` |
| `--tests` | Include test recommendations | `false` |
| `--depth INT` | Traversal depth | `2` |
| `--format FORMAT` | Output format (text, json, list) | `text` |
| `--verbose, -v` | Show detailed output | `false` |

*One of `--files`, `--git-diff`, or `--git-staged` is required.

## Examples

### Analyze Specific Files

```bash
specmem impact --files src/auth/service.py
```

Output:

```
📊 Impact Analysis

Changed files:
  • src/auth/service.py

🎯 Directly Impacted Specs (2):
  • auth/requirements.md
  • auth/design.md

🔗 Transitively Impacted (2):
  • api-security/design.md
  • session-management/tasks.md

Total: 4 specs impacted
```

### Multiple Files

```bash
specmem impact --files src/auth/service.py src/auth/models.py src/auth/routes.py
```

### With Test Recommendations

```bash
specmem impact --files src/auth/service.py --tests
```

Output:

```
📊 Impact Analysis

Changed files:
  • src/auth/service.py

🎯 Directly Impacted Specs (2):
  • auth/requirements.md
  • auth/design.md

🧪 Recommended Tests (4):
  • tests/test_auth.py::test_login
  • tests/test_auth.py::test_logout
  • tests/test_auth.py::test_token_refresh
  • tests/integration/test_auth_flow.py::test_full_flow

⏱️  Estimated time: 45s (vs 8m for full suite)
```

### From Git Diff

```bash
specmem impact --git-diff
```

### From Staged Changes

```bash
specmem impact --git-staged
```

### Deeper Analysis

```bash
specmem impact --files src/auth/service.py --depth 3
```

### JSON Output

```bash
specmem impact --files src/auth/service.py --format json
```

Output:

```json
{
  "changed_files": ["src/auth/service.py"],
  "direct_specs": [
    {
      "path": "auth/requirements.md",
      "relationship": "implemented_by"
    }
  ],
  "transitive_specs": [
    {
      "path": "api-security/design.md",
      "relationship": "depends_on",
      "via": "auth/requirements.md"
    }
  ],
  "recommended_tests": [
    "tests/test_auth.py::test_login",
    "tests/test_auth.py::test_logout"
  ]
}
```

### List Output (for piping)

```bash
# Get just test paths
specmem impact --files src/auth/service.py --tests --format list
```

Output:

```
tests/test_auth.py::test_login
tests/test_auth.py::test_logout
tests/test_auth.py::test_token_refresh
```

### Pipe to pytest

```bash
pytest $(specmem impact --files src/auth/service.py --tests --format list)
```

## CI Integration

```yaml
# GitHub Actions
- name: Get impacted tests
  run: |
    TESTS=$(specmem impact --git-diff --tests --format list)
    if [ -n "$TESTS" ]; then
      pytest $TESTS
    fi
```

## See Also

- [SpecImpact Graph](../user-guide/specimpact.md)
- [Selective Testing](../user-guide/selective-testing.md)
