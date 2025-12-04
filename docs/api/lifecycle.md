# Spec Lifecycle API

The Lifecycle module provides tools for managing specification health, pruning, generation, and compression.

## Import

```python
from specmem.lifecycle import (
    HealthAnalyzer,
    PrunerEngine,
    GeneratorEngine,
    CompressorEngine,
    SpecHealthScore,
    PruneResult,
    GeneratedSpec,
    CompressedSpec,
)
```

## HealthAnalyzer

Analyzes specification health based on code references, modification dates, and usage patterns.

### Constructor

```python
HealthAnalyzer(
    spec_base_path: Path,
    stale_threshold_days: int = 90,
)
```

### Methods

#### analyze_spec

Analyze health of a single specification.

```python
def analyze_spec(
    spec_name: str,
    spec_path: Path,
) -> SpecHealthScore
```

#### analyze_all

Analyze health of all specifications.

```python
def analyze_all() -> list[SpecHealthScore]
```

#### get_orphaned_specs

Get specs with no code references.

```python
def get_orphaned_specs() -> list[SpecHealthScore]
```

#### get_stale_specs

Get specs not modified within threshold.

```python
def get_stale_specs(threshold_days: int | None = None) -> list[SpecHealthScore]
```

### Example

```python
from pathlib import Path
from specmem.lifecycle import HealthAnalyzer

analyzer = HealthAnalyzer(
    spec_base_path=Path(".kiro/specs"),
    stale_threshold_days=90,
)

# Analyze all specs
scores = analyzer.analyze_all()
for score in scores:
    print(f"{score.spec_name}: {score.score:.2f}")
    if score.is_orphaned:
        print("  ⚠️ Orphaned - no code references")

# Get summary
summary = analyzer.get_summary()
print(f"Average health: {summary['average_score']:.2f}")
```

---

## PrunerEngine

Prunes orphaned or stale specifications with archive/delete modes.

### Constructor

```python
PrunerEngine(
    health_analyzer: HealthAnalyzer,
    archive_dir: Path | None = None,
)
```

### Methods

#### analyze

Identify specs that can be pruned.

```python
def analyze() -> list[PruneResult]
```

#### prune_orphaned

Prune all orphaned specifications.

```python
def prune_orphaned(
    mode: Literal["archive", "delete"] = "archive",
    dry_run: bool = True,
    force: bool = False,
) -> list[PruneResult]
```

#### prune_stale

Prune stale specifications.

```python
def prune_stale(
    threshold_days: int = 90,
    mode: Literal["archive", "delete"] = "archive",
    dry_run: bool = True,
) -> list[PruneResult]
```

#### prune_by_name

Prune specific specs by name.

```python
def prune_by_name(
    spec_names: list[str],
    mode: Literal["archive", "delete"] = "archive",
    dry_run: bool = True,
    force: bool = False,
) -> list[PruneResult]
```

### Example

```python
from pathlib import Path
from specmem.lifecycle import HealthAnalyzer, PrunerEngine

analyzer = HealthAnalyzer(Path(".kiro/specs"))
pruner = PrunerEngine(
    health_analyzer=analyzer,
    archive_dir=Path(".specmem/archive"),
)

# Preview orphaned specs
results = pruner.prune_orphaned(dry_run=True)
for r in results:
    print(f"Would {r.action}: {r.spec_name}")

# Actually archive them
results = pruner.prune_orphaned(dry_run=False)
```

---

## GeneratorEngine

Generates specifications from existing code files.

### Constructor

```python
GeneratorEngine(
    default_format: str = "kiro",
    output_dir: Path | None = None,
)
```

### Methods

#### generate_from_file

Generate spec from a single code file.

```python
def generate_from_file(
    file_path: Path,
    output_format: str | None = None,
) -> GeneratedSpec
```

#### generate_from_directory

Generate specs from a directory.

```python
def generate_from_directory(
    dir_path: Path,
    group_by: Literal["file", "directory", "module"] = "directory",
    output_format: str | None = None,
) -> list[GeneratedSpec]
```

#### write_spec

Write generated spec to disk.

```python
def write_spec(spec: GeneratedSpec) -> Path
```

### Example

```python
from pathlib import Path
from specmem.lifecycle import GeneratorEngine

generator = GeneratorEngine(
    default_format="kiro",
    output_dir=Path(".kiro/specs"),
)

# Generate from file
spec = generator.generate_from_file(Path("src/auth/service.py"))
print(f"Generated: {spec.name}")
print(f"Functions: {len(spec.functions)}")

# Generate from directory
specs = generator.generate_from_directory(
    Path("src/"),
    group_by="module",
)

# Write to disk
for spec in specs:
    path = generator.write_spec(spec)
    print(f"Wrote: {path}")
```

---

## CompressorEngine

Compresses verbose specifications while preserving acceptance criteria.

### Constructor

```python
CompressorEngine(
    verbose_threshold_chars: int = 5000,
    compression_storage_dir: Path | None = None,
)
```

### Methods

#### compress_spec

Compress a single specification.

```python
def compress_spec(
    spec_name: str,
    spec_path: Path,
) -> CompressedSpec
```

#### compress_all

Compress all verbose specifications.

```python
def compress_all(
    specs: list[tuple[str, Path]],
) -> list[CompressedSpec]
```

#### get_verbose_specs

Identify verbose specs above threshold.

```python
def get_verbose_specs(
    specs: list[tuple[str, Path]],
    threshold: int | None = None,
) -> list[str]
```

#### save_compressed

Save compressed version to storage.

```python
def save_compressed(compressed: CompressedSpec) -> Path
```

### Example

```python
from pathlib import Path
from specmem.lifecycle import CompressorEngine

compressor = CompressorEngine(
    verbose_threshold_chars=5000,
    compression_storage_dir=Path(".specmem/compressed"),
)

# Find verbose specs
spec_base = Path(".kiro/specs")
specs = [(d.name, d) for d in spec_base.iterdir() if d.is_dir()]

verbose = compressor.get_verbose_specs(specs)
print(f"Verbose specs: {verbose}")

# Compress a spec
compressed = compressor.compress_spec("auth-feature", spec_base / "auth-feature")
print(f"Original: {compressed.original_chars} chars")
print(f"Compressed: {compressed.compressed_chars} chars")
print(f"Ratio: {compressed.compression_ratio:.1%}")

# Save compressed version
path = compressor.save_compressed(compressed)
```

---

## Data Models

### SpecHealthScore

```python
@dataclass
class SpecHealthScore:
    spec_name: str
    spec_path: Path
    score: float              # 0.0 to 1.0
    is_orphaned: bool         # No code references
    is_stale: bool            # Not modified recently
    last_modified: datetime
    code_references: int      # Number of code files referencing
    query_count: int          # Times queried
    recommendations: list[str]
```

### PruneResult

```python
@dataclass
class PruneResult:
    spec_name: str
    action: str               # "archive", "delete", "skip"
    reason: str               # Why this action
    archive_path: Path | None # Where archived (if applicable)
    dry_run: bool             # Was this a preview
    success: bool
```

### GeneratedSpec

```python
@dataclass
class GeneratedSpec:
    name: str
    source_path: Path
    format: str               # "kiro", "speckit"
    content: str              # Generated spec content
    functions: list[str]      # Extracted function names
    classes: list[str]        # Extracted class names
    auto_generated: bool      # Always True
    timestamp: datetime
```

### CompressedSpec

```python
@dataclass
class CompressedSpec:
    spec_name: str
    original_content: str
    compressed_content: str
    original_chars: int
    compressed_chars: int
    compression_ratio: float
    preserved_criteria: list[str]  # Acceptance criteria kept
```

---

## Client Integration

The lifecycle features are also available through `SpecMemClient`:

```python
from specmem import SpecMemClient

sm = SpecMemClient()

# Health analysis
health = sm.get_spec_health()
print(f"Average: {health['average_score']:.2f}")

# Prune orphaned specs
results = sm.prune_specs(orphaned=True, dry_run=True)

# Generate specs from code
specs = sm.generate_specs(["src/auth/"], write=True)

# Compress verbose specs
compressed = sm.compress_specs(all_verbose=True, save=True)
```

See [Client API](client.md) for full method documentation.
