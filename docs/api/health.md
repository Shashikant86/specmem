# Health Score API

The `specmem.health` module provides programmatic access to project health scoring, enabling you to assess specification quality and get actionable improvement suggestions.

## HealthScoreEngine

Main class for calculating project health scores.

```python
from pathlib import Path
from specmem.health import HealthScoreEngine

engine = HealthScoreEngine(Path("."))
score = engine.calculate()
```

### Methods

#### calculate()

Calculate the overall health score for the project.

```python
score = engine.calculate()
print(f"Grade: {score.letter_grade}")  # A, B, C, D, or F
print(f"Score: {score.overall_score}")  # 0-100
```

#### get_suggestions()

Get actionable suggestions for improving the health score.

```python
suggestions = engine.get_suggestions(score)
for suggestion in suggestions:
    print(f"• {suggestion}")
```

## Data Models

### HealthScore

Complete health score with breakdown and suggestions.

```python
from specmem.health import HealthScore

@dataclass
class HealthScore:
    overall_score: float      # 0-100
    letter_grade: str         # A, B, C, D, F
    coverage_score: float     # 0-100
    validation_score: float   # 0-100
    freshness_score: float    # 0-100
    completeness_score: float # 0-100
    suggestions: list[str]    # Actionable improvements
```

### HealthBreakdown

Detailed breakdown of each health category.

```python
from specmem.health import HealthBreakdown

@dataclass
class HealthBreakdown:
    category: str
    score: float
    weight: float
    details: str
```

## Grade Mapping

Health scores map to letter grades as follows:

| Score Range | Letter Grade | Status |
|-------------|--------------|--------|
| 90-100 | A | Excellent |
| 80-89 | B | Good |
| 70-79 | C | Fair |
| 60-69 | D | Poor |
| 0-59 | F | Critical |

## Score Components

The overall health score is a weighted average of four components:

### Coverage Score (30%)

Based on acceptance criteria test coverage:

```python
# High coverage = high score
coverage_score = (covered_criteria / total_criteria) * 100
```

### Validation Score (25%)

Based on specification validation results:

```python
# Fewer issues = higher score
validation_score = 100 - (error_count * 10) - (warning_count * 2)
```

### Freshness Score (20%)

Based on how recently specs were modified:

| Days Since Modified | Score |
|--------------------|-------|
| ≤ 7 days | 100 |
| ≤ 30 days | 80 |
| ≤ 90 days | 50 |
| > 90 days | 20 |

### Completeness Score (25%)

Based on spec structure analysis:

- Has acceptance criteria
- Has user stories
- Has design documents
- Has implementation tasks

## Usage Examples

### Basic Health Check

```python
from pathlib import Path
from specmem.health import HealthScoreEngine

engine = HealthScoreEngine(Path("."))
score = engine.calculate()

print(f"Project Health: {score.letter_grade} ({score.overall_score:.1f})")
print(f"  Coverage: {score.coverage_score:.1f}")
print(f"  Validation: {score.validation_score:.1f}")
print(f"  Freshness: {score.freshness_score:.1f}")
print(f"  Completeness: {score.completeness_score:.1f}")
```

### Get Improvement Suggestions

```python
if score.overall_score < 80:
    print("\nSuggestions for improvement:")
    for suggestion in score.suggestions:
        print(f"  • {suggestion}")
```

### Integration with CI/CD

```python
import sys
from specmem.health import HealthScoreEngine

engine = HealthScoreEngine(Path("."))
score = engine.calculate()

# Fail CI if health score is below threshold
if score.overall_score < 70:
    print(f"❌ Health score {score.overall_score:.1f} is below threshold 70")
    sys.exit(1)
else:
    print(f"✅ Health score {score.overall_score:.1f} passes threshold")
```

### JSON Output

```python
score_dict = {
    "overall_score": score.overall_score,
    "letter_grade": score.letter_grade,
    "breakdown": {
        "coverage": {"score": score.coverage_score, "weight": 0.3},
        "validation": {"score": score.validation_score, "weight": 0.25},
        "freshness": {"score": score.freshness_score, "weight": 0.2},
        "completeness": {"score": score.completeness_score, "weight": 0.25},
    },
    "suggestions": score.suggestions,
}
```

## Web UI Integration

The health score is displayed on the dashboard:

```python
from specmem.ui import create_app

# Health score is available at /api/health
# GET /api/health returns HealthScore as JSON
```

## See Also

- [CLI: specmem health](../cli/health.md)
- [User Guide: Web UI](../user-guide/web-ui.md)
- [API: Coverage](coverage.md)
