# SpecMemClient

The main entry point for all SpecMem operations.

## Import

```python
from specmem import SpecMemClient
```

## Constructor

```python
SpecMemClient(
    config_path: str | Path | None = None,
    embedding_provider: str | None = None,
    vectordb_backend: str | None = None,
)
```

### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `config_path` | `str \| Path \| None` | Path to config file | Auto-detect |
| `embedding_provider` | `str \| None` | Override embedding provider | From config |
| `vectordb_backend` | `str \| None` | Override vector backend | From config |

### Example

```python
# Default configuration
sm = SpecMemClient()

# Custom config file
sm = SpecMemClient(config_path="./custom.toml")

# Override settings
sm = SpecMemClient(
    embedding_provider="openai",
    vectordb_backend="chroma"
)
```

## Methods

### query

Search specifications using semantic search.

```python
def query(
    query: str,
    top_k: int = 5,
    spec_type: SpecType | None = None,
    lifecycle: Lifecycle | None = None,
    threshold: float = 0.5,
) -> list[QueryResult]
```

#### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `query` | `str` | Search query | required |
| `top_k` | `int` | Number of results | `5` |
| `spec_type` | `SpecType \| None` | Filter by type | `None` |
| `lifecycle` | `Lifecycle \| None` | Filter by lifecycle | `None` |
| `threshold` | `float` | Minimum similarity | `0.5` |

#### Example

```python
results = sm.query("authentication requirements", top_k=10)

for result in results:
    print(f"{result.spec.path}: {result.score:.2f}")
```

---

### get_context_for_change

Get context bundle for code changes.

```python
def get_context_for_change(
    files: list[str],
    include_tests: bool = True,
) -> ContextBundle
```

#### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `files` | `list[str]` | Changed file paths | required |
| `include_tests` | `bool` | Include test recommendations | `True` |

#### Example

```python
bundle = sm.get_context_for_change(["src/auth/service.py"])

print(bundle.tldr)
print(f"Impacted specs: {len(bundle.impacted)}")
print(f"Tests to run: {bundle.recommended_tests}")
```

---

### get_impacted_specs

Get specifications impacted by file changes.

```python
def get_impacted_specs(
    files: list[str],
    depth: int = 2,
    include_transitive: bool = True,
) -> list[SpecBlock]
```

#### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `files` | `list[str]` | Changed file paths | required |
| `depth` | `int` | Traversal depth | `2` |
| `include_transitive` | `bool` | Include transitive | `True` |

#### Example

```python
impacted = sm.get_impacted_specs(["src/auth/service.py"])

for spec in impacted:
    print(f"Impacted: {spec.path}")
```

---

### get_impacted_tests

Get tests affected by file changes.

```python
def get_impacted_tests(
    files: list[str],
    depth: int = 2,
) -> list[str]
```

#### Example

```python
tests = sm.get_impacted_tests(["src/auth/service.py"])

for test in tests:
    print(f"Run: {test}")
```

---

### validate

Validate all specifications.

```python
def validate(
    rules: list[str] | None = None,
    min_severity: Severity = Severity.WARNING,
) -> list[ValidationIssue]
```

#### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `rules` | `list[str] \| None` | Rules to run | All rules |
| `min_severity` | `Severity` | Minimum severity | `WARNING` |

#### Example

```python
issues = sm.validate()

for issue in issues:
    print(f"[{issue.severity}] {issue.spec}:{issue.line}")
    print(f"  {issue.message}")
```

---

### validate_spec

Validate a specific specification.

```python
def validate_spec(
    spec_path: str,
    rules: list[str] | None = None,
) -> list[ValidationIssue]
```

#### Example

```python
issues = sm.validate_spec("auth/requirements.md")
```

---

### get_drift_report

Get specification drift report.

```python
def get_drift_report() -> DriftReport
```

#### Example

```python
drift = sm.get_drift_report()

print(f"Stale specs: {len(drift.stale)}")
print(f"Orphaned specs: {len(drift.orphaned)}")
print(f"Contradictions: {len(drift.contradictions)}")
```

---

### pin_spec

Pin a specification for guaranteed recall.

```python
def pin_spec(spec_id: str) -> None
```

#### Example

```python
sm.pin_spec("security-requirements")
```

---

### unpin_spec

Unpin a specification.

```python
def unpin_spec(spec_id: str) -> None
```

---

### get_all_specs

Get all indexed specifications.

```python
def get_all_specs(
    spec_type: SpecType | None = None,
    lifecycle: Lifecycle | None = None,
) -> list[SpecBlock]
```

#### Example

```python
# All specs
all_specs = sm.get_all_specs()

# Only requirements
requirements = sm.get_all_specs(spec_type=SpecType.REQUIREMENT)

# Only active specs
active = sm.get_all_specs(lifecycle=Lifecycle.ACTIVE)
```

---

### get_spec

Get a specific specification by ID or path.

```python
def get_spec(spec_id: str) -> SpecBlock | None
```

#### Example

```python
spec = sm.get_spec("auth-req-001")
if spec:
    print(spec.title)
```

---

### scan

Scan and index specifications.

```python
def scan(
    path: str | Path = ".",
    force: bool = False,
) -> ScanResult
```

#### Example

```python
result = sm.scan(force=True)

print(f"Indexed: {result.indexed}")
print(f"Skipped: {result.skipped}")
print(f"Errors: {result.errors}")
```

---

### build

Build the Agent Experience Pack.

```python
def build(
    output_path: str | Path = ".specmem",
) -> BuildResult
```

#### Example

```python
result = sm.build()

print(f"Output: {result.output_path}")
print(f"Specs: {result.spec_count}")
```
