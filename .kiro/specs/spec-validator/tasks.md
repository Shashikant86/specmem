# Implementation Plan

- [x] 1. Create Core Data Models
  - [x] 1.1 Create IssueSeverity enum and ValidationIssue dataclass
    - Define ERROR, WARNING, INFO severity levels
    - Define fields: rule_id, severity, message, spec_id, file_path, line_number, context, suggestion
    - Add to_dict() and from_dict() methods
    - _Requirements: 7.2, 7.3_
  - [x] 1.2 Create ValidationResult dataclass
    - Define fields: issues, specs_validated, rules_run, duration_ms
    - Add is_valid property (no errors)
    - Add error_count, warning_count, info_count properties
    - Add get_by_severity() and get_by_spec() methods
    - _Requirements: 7.1, 7.4, 7.5_
  - [x] 1.3 Write property test for result completeness
    - **Property 8: Result Completeness**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

- [x] 2. Create ValidationRule Base and Config
  - [x] 2.1 Create ValidationRule abstract base class
    - Define rule_id, name, description, default_severity
    - Define abstract validate() method
    - Add is_enabled() helper method
    - _Requirements: 9.2_
  - [x] 2.2 Create ValidationConfig dataclass
    - Define rules dict, similarity_threshold, min_acceptance_criteria, max_spec_length
    - Add is_rule_enabled() and get_severity() methods
    - Add from_toml() class method
    - _Requirements: 9.1, 9.5_
  - [x] 2.3 Write property test for configuration respect
    - **Property 10: Configuration Respect**
    - **Validates: Requirements 9.2, 9.3, 9.4**

- [x] 3. Implement ValidationEngine
  - [x] 3.1 Create ValidationEngine class
    - Initialize with config
    - Implement register_rule() method
    - Implement validate() method
    - Add timing and result aggregation
    - _Requirements: 7.1_
  - [x] 3.2 Write property test for valid specs pass
    - **Property 9: Valid Specs Pass**
    - **Validates: Requirements 7.5**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement ContradictionRule
  - [x] 5.1 Create ContradictionRule class
    - Define negation patterns (SHALL vs SHALL NOT)
    - Implement semantic overlap detection
    - Generate issues with both spec IDs and explanation
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [x] 5.2 Write property test for contradiction detection
    - **Property 1: Contradiction Detection Completeness**
    - **Validates: Requirements 1.1, 1.2, 1.4**

- [x] 6. Implement AcceptanceCriteriaRule
  - [x] 6.1 Create AcceptanceCriteriaRule class
    - Check for missing acceptance criteria
    - Validate EARS pattern compliance
    - Check minimum criteria count
    - Detect undefined term references
    - _Requirements: 2.1, 2.2, 2.4, 2.5_
  - [x] 6.2 Write property test for acceptance criteria completeness
    - **Property 2: Acceptance Criteria Completeness**
    - **Validates: Requirements 2.1, 2.4**

- [x] 7. Implement ConstraintRule
  - [x] 7.1 Create ConstraintRule class
    - Detect impossible values (negative counts, >100%)
    - Detect conflicting numeric constraints (min > max)
    - Detect impossible time constraints
    - Detect undefined entity references
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 7.2 Write property test for invalid constraint detection
    - **Property 3: Invalid Constraint Detection**
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement DuplicateRule
  - [x] 9.1 Create DuplicateRule class
    - Implement semantic similarity scoring
    - Use configurable threshold
    - Detect identical IDs
    - Suggest consolidation for overlapping specs
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [x] 9.2 Write property test for duplicate detection
    - **Property 4: Duplicate Detection with Similarity**
    - **Validates: Requirements 4.1, 4.2, 4.3**
  - [x] 9.3 Write property test for ID uniqueness
    - **Property 5: ID Uniqueness**
    - **Validates: Requirements 4.4**

- [x] 10. Implement TimelineRule
  - [x] 10.1 Create TimelineRule class
    - Detect past deadlines
    - Detect conflicting dependency timelines
    - Detect missing time units
    - Detect undefined milestone references
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 10.2 Write property test for timeline consistency
    - **Property 6: Timeline Consistency**
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 11. Implement StructureRule
  - [x] 11.1 Create StructureRule class
    - Check for required sections
    - Validate markdown formatting
    - Check requirement numbering consistency
    - Validate cross-references
    - Check spec length
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [x] 11.2 Write property test for structure validation
    - **Property 7: Structure Validation**
    - **Validates: Requirements 6.1, 6.4**

- [x] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Implement CLI Commands
  - [x] 13.1 Implement `specmem validate` command
    - Validate all specs in repository
    - Support --spec filter option
    - Support --format json option
    - Exit with non-zero on errors
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [x] 13.2 Implement --fix option for auto-fixing
    - Auto-fix simple structure issues
    - Report what was fixed
    - _Requirements: 8.5_
  - [x] 13.3 Write property test for CLI exit code
    - **Property 11: CLI Exit Code**
    - **Validates: Requirements 8.3**
  - [x] 13.4 Write unit tests for CLI commands
    - Test validate command with valid inputs
    - Test error handling
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 14. Integrate with SpecMemClient
  - [x] 14.1 Add validate() method to SpecMemClient
    - Lazy-load ValidationEngine
    - Support spec_id filter
    - Return ValidationResult
    - _Requirements: 10.1, 10.2, 10.3_
  - [x] 14.2 Add validation filtering methods
    - get_errors(), get_warnings(), get_info()
    - Filter by spec_id
    - _Requirements: 10.4_
  - [x] 14.3 Write property test for client API correctness
    - **Property 12: Client API Correctness**
    - **Validates: Requirements 10.1, 10.2, 10.4**

- [x] 15. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
