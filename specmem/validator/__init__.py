"""SpecValidator - Specification Quality Assurance.

Validates specifications for correctness, completeness, and consistency.
Detects contradictions, missing acceptance criteria, invalid constraints,
duplicate features, and impossible timelines.
"""

from specmem.validator.models import (
    IssueSeverity,
    ValidationIssue,
    ValidationResult,
)
from specmem.validator.config import ValidationConfig, RuleConfig
from specmem.validator.engine import ValidationEngine
from specmem.validator.rules import (
    ValidationRule,
    ContradictionRule,
    AcceptanceCriteriaRule,
    ConstraintRule,
    DuplicateRule,
    TimelineRule,
    StructureRule,
)

__all__ = [
    "IssueSeverity",
    "ValidationIssue",
    "ValidationResult",
    "ValidationConfig",
    "RuleConfig",
    "ValidationEngine",
    "ValidationRule",
    "ContradictionRule",
    "AcceptanceCriteriaRule",
    "ConstraintRule",
    "DuplicateRule",
    "TimelineRule",
    "StructureRule",
]
