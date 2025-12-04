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

---

### get_coverage

Analyze spec coverage for all features or a specific feature.

```python
def get_coverage(
    feature: str | None = None,
) -> CoverageResult
```

#### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `feature` | `str \| None` | Feature name to analyze | All features |

#### Example

```python
# Overall coverage
result = sm.get_coverage()
print(f"Coverage: {result.coverage_percentage:.1f}%")

# Specific feature
result = sm.get_coverage("user-authentication")
for match in result.features[0].criteria:
    status = "✅" if match.is_covered else "⚠️"
    print(f"{status} {match.criterion.number}")
```

---

### get_coverage_suggestions

Get test suggestions for uncovered acceptance criteria.

```python
def get_coverage_suggestions(
    feature: str | None = None,
) -> list[TestSuggestion]
```

#### Example

```python
suggestions = sm.get_coverage_suggestions("user-authentication")

for s in suggestions:
    print(f"AC {s.criterion.number}: {s.criterion.text[:50]}...")
    print(f"  Suggested: {s.suggested_name}")
```

---

### get_coverage_badge

Generate a coverage badge for README files.

```python
def get_coverage_badge() -> str
```

#### Example

```python
badge = sm.get_coverage_badge()
print(badge)
# ![Spec Coverage](https://img.shields.io/badge/Spec_Coverage-80%25-green)
```


---

## Lifecycle Methods

Methods for managing specification health, pruning, generation, and compression.

### get_spec_health

Get health scores for specifications.

```python
def get_spec_health(
    spec_name: str | None = None,
    stale_days: int = 90,
) -> SpecHealthScore | dict
```

#### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `spec_name` | `str \| None` | Specific spec to analyze | All specs |
| `stale_days` | `int` | Days threshold for stale detection | `90` |

#### Example

```python
# Get health for all specs
health = sm.get_spec_health()
print(f"Total specs: {health['total_specs']}")
print(f"Orphaned: {health['orphaned_count']}")
print(f"Average score: {health['average_score']:.2f}")

# Get health for specific spec
score = sm.get_spec_health("auth-feature")
print(f"Score: {score.score:.2f}")
print(f"Orphaned: {score.is_orphaned}")
print(f"Stale: {score.is_stale}")
```

---

### prune_specs

Prune orphaned or stale specifications.

```python
def prune_specs(
    spec_names: list[str] | None = None,
    mode: str = "archive",
    dry_run: bool = True,
    force: bool = False,
    orphaned: bool = False,
    stale: bool = False,
    stale_days: int = 90,
) -> list[PruneResult]
```

#### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `spec_names` | `list[str] \| None` | Specific specs to prune | `None` |
| `mode` | `str` | "archive" or "delete" | `"archive"` |
| `dry_run` | `bool` | Preview without applying | `True` |
| `force` | `bool` | Skip confirmation for delete | `False` |
| `orphaned` | `bool` | Prune all orphaned specs | `False` |
| `stale` | `bool` | Prune all stale specs | `False` |
| `stale_days` | `int` | Days threshold for stale | `90` |

#### Example

```python
# Preview orphaned specs
results = sm.prune_specs(orphaned=True)
for r in results:
    print(f"Would {r.action}: {r.spec_name} ({r.reason})")

# Actually archive orphaned specs
results = sm.prune_specs(orphaned=True, dry_run=False)

# Delete specific specs
results = sm.prune_specs(
    spec_names=["old-feature", "deprecated-api"],
    mode="delete",
    dry_run=False,
    force=True,
)
```

---

### generate_specs

Generate specifications from code files.

```python
def generate_specs(
    files: list[str],
    format: str = "kiro",
    group_by: str = "directory",
    write: bool = False,
) -> list[GeneratedSpec]
```

#### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `files` | `list[str]` | File or directory paths | required |
| `format` | `str` | Output format ("kiro", "speckit") | `"kiro"` |
| `group_by` | `str` | Grouping ("file", "directory", "module") | `"directory"` |
| `write` | `bool` | Write specs to disk | `False` |

#### Example

```python
# Generate specs from directory
specs = sm.generate_specs(["src/auth/"])
for spec in specs:
    print(f"{spec.name}: {len(spec.functions)} functions")

# Generate and write to disk
specs = sm.generate_specs(
    ["src/auth.py", "src/users.py"],
    format="kiro",
    write=True,
)
```

---

### compress_specs

Compress verbose specifications.

```python
def compress_specs(
    spec_names: list[str] | None = None,
    threshold: int = 5000,
    all_verbose: bool = False,
    save: bool = False,
) -> list[CompressedSpec]
```

#### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `spec_names` | `list[str] \| None` | Specific specs to compress | `None` |
| `threshold` | `int` | Char threshold for verbose | `5000` |
| `all_verbose` | `bool` | Compress all verbose specs | `False` |
| `save` | `bool` | Save compressed versions | `False` |

#### Example

```python
# Find verbose specs
verbose = sm.compress_specs()
print(f"Verbose specs: {verbose}")

# Compress specific spec
results = sm.compress_specs(spec_names=["auth-feature"])
for r in results:
    print(f"{r.spec_name}: {r.compression_ratio:.1%} reduction")

# Compress all verbose specs and save
results = sm.compress_specs(all_verbose=True, save=True)
```
