# Coverage API

The Coverage API provides programmatic access to spec coverage analysis.

## Overview

```python
from specmem import SpecMemClient

client = SpecMemClient()
result = client.get_coverage()
```

## SpecMemClient Methods

### get_coverage()

Analyze spec coverage for all features or a specific feature.

```python
def get_coverage(
    self,
    feature: str | None = None,
) -> CoverageResult:
    """Get spec coverage analysis.

    Args:
        feature: Optional feature name to analyze (analyzes all if None)

    Returns:
        CoverageResult with coverage data and suggestions
    """
```

**Example:**

```python
# Get overall coverage
result = client.get_coverage()
print(f"Overall: {result.covered_criteria}/{result.total_criteria}")
print(f"Coverage: {result.coverage_percentage:.1f}%")

# Get coverage for specific feature
result = client.get_coverage("user-authentication")
for match in result.features[0].criteria:
    status = "✅" if match.is_covered else "⚠️"
    print(f"{status} {match.criterion.number}: {match.criterion.text[:50]}...")
```

### get_coverage_suggestions()

Get test suggestions for uncovered acceptance criteria.

```python
def get_coverage_suggestions(
    self,
    feature: str | None = None,
) -> list[TestSuggestion]:
    """Get test suggestions for uncovered criteria.

    Args:
        feature: Optional feature name to get suggestions for

    Returns:
        List of TestSuggestion objects
    """
```

**Example:**

```python
suggestions = client.get_coverage_suggestions("user-authentication")
for s in suggestions:
    print(f"AC {s.criterion.number}: {s.criterion.text[:50]}...")
    print(f"  Suggested file: {s.suggested_file}")
    print(f"  Suggested name: {s.suggested_name}")
    for point in s.verification_points:
        print(f"    - {point}")
```

### get_coverage_badge()

Generate a coverage badge for README files.

```python
def get_coverage_badge(self) -> str:
    """Generate coverage badge markdown.

    Returns:
        Badge markdown string for README
    """
```

**Example:**

```python
badge = client.get_coverage_badge()
print(badge)
# ![Spec Coverage](https://img.shields.io/badge/Spec_Coverage-80%25-green)
```

## Data Models

### CoverageResult

Overall coverage analysis result.

```python
@dataclass
class CoverageResult:
    features: list[FeatureCoverage]
    suggestions: list[TestSuggestion]

    @property
    def total_criteria(self) -> int: ...
    @property
    def covered_criteria(self) -> int: ...
    @property
    def coverage_percentage(self) -> float: ...
    @property
    def gap_percentage(self) -> float: ...

    def to_dict(self) -> dict: ...
    def to_json(self) -> str: ...
    def to_markdown(self) -> str: ...
    def generate_badge(self) -> str: ...
```

### FeatureCoverage

Coverage data for a single feature.

```python
@dataclass
class FeatureCoverage:
    feature_name: str
    criteria: list[CriteriaMatch]

    @property
    def total_count(self) -> int: ...
    @property
    def tested_count(self) -> int: ...
    @property
    def coverage_percentage(self) -> float: ...
    @property
    def gap_percentage(self) -> float: ...
```

### CriteriaMatch

Match between an acceptance criterion and a test.

```python
@dataclass
class CriteriaMatch:
    criterion: AcceptanceCriterion
    test: ExtractedTest | None  # None if uncovered
    confidence: float  # 0.0 to 1.0

    @property
    def is_covered(self) -> bool:
        """True if confidence >= 0.5 and test is not None."""
```

### AcceptanceCriterion

Acceptance criterion extracted from requirements.md.

```python
@dataclass
class AcceptanceCriterion:
    id: str           # e.g., "user-auth.1.3"
    number: str       # e.g., "1.3"
    text: str         # Full EARS format text
    requirement_id: str
    user_story: str
    feature_name: str
```

### ExtractedTest

Test function extracted from test files.

```python
@dataclass
class ExtractedTest:
    name: str
    file_path: str
    line_number: int
    docstring: str | None
    requirement_links: list[str]  # e.g., ["1.3", "1.4"]
    framework: str  # pytest, jest, vitest, etc.
    selector: str   # Framework-specific selector
```

### TestSuggestion

Suggestion for writing a test.

```python
@dataclass
class TestSuggestion:
    criterion: AcceptanceCriterion
    suggested_file: str
    suggested_name: str
    verification_points: list[str]
```

## Direct Engine Access

For advanced use cases, you can use the CoverageEngine directly:

```python
from pathlib import Path
from specmem.coverage import CoverageEngine

engine = CoverageEngine(Path("."))

# Analyze all features
result = engine.analyze_coverage()

# Analyze specific feature
feature = engine.analyze_feature("user-authentication")

# Get suggestions
suggestions = engine.get_suggestions("user-authentication")

# Generate badge
badge = engine.generate_badge()

# Export
json_data = engine.export("json")
markdown = engine.export("markdown")
```

## See Also

- [CLI: specmem cov](../cli/cov.md) - Command-line interface
- [Concepts](../user-guide/concepts.md) - Core concepts
