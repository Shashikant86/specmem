# Requirements Document

## Introduction

This feature implements the "Pragmatic SDD" philosophy by providing tools to manage the spec lifecycle: pruning stale/orphaned specs that no longer have code references, and generating specs from existing code for brownfield adoption. These features address the "Markdown Madness" criticism of SDD by keeping specs lean and relevant.

## Glossary

- **SpecMem**: The unified agent experience and pragmatic memory platform
- **Spec Pruning**: The process of identifying and archiving/deleting specs that have no code references
- **Spec Generation**: The process of analyzing code and generating specs from it (reverse direction)
- **Orphaned Spec**: A spec that has no references to existing code files
- **Stale Spec**: A spec that hasn't been updated in a configurable time period
- **Spec Health Score**: A metric indicating how relevant and maintained a spec is
- **SpecImpact Graph**: The bidirectional relationship graph between specs, code, and tests

## Requirements

### Requirement 1: Spec Pruning Analysis

**User Story:** As a developer, I want to identify specs that have no code references, so that I can clean up outdated documentation and reduce markdown clutter.

#### Acceptance Criteria

1. WHEN a user runs the prune analysis command THEN the system SHALL scan all indexed specs and identify those with no code file references in the SpecImpact graph
2. WHEN analyzing specs for pruning THEN the system SHALL calculate a "health score" based on code references, last modified date, and query frequency
3. WHEN specs are identified as orphaned THEN the system SHALL display them with their health scores and last modification dates
4. WHEN the analysis completes THEN the system SHALL provide a summary showing total specs, orphaned count, and recommended actions

### Requirement 2: Spec Pruning Actions

**User Story:** As a developer, I want to archive or delete orphaned specs, so that my spec collection stays lean and relevant.

#### Acceptance Criteria

1. WHEN a user requests to prune specs THEN the system SHALL support both "archive" (move to .specmem/archive/) and "delete" (permanent removal) modes
2. WHEN archiving specs THEN the system SHALL preserve the original file structure and add metadata about when and why it was archived
3. WHEN deleting specs THEN the system SHALL require explicit confirmation with --force flag or interactive prompt
4. WHEN pruning is complete THEN the system SHALL update the vector index to remove pruned specs
5. WHEN a dry-run flag is provided THEN the system SHALL show what would be pruned without making changes
6. WHEN a user specifies a spec name explicitly (e.g., `specmem prune login`) THEN the system SHALL target that specific spec for removal
7. WHEN multiple spec names are provided THEN the system SHALL process each specified spec in sequence

### Requirement 3: Code to Spec Generation

**User Story:** As a developer adopting SpecMem in a brownfield codebase, I want to generate initial specs from my existing code, so that I can bootstrap my spec collection without manual writing.

#### Acceptance Criteria

1. WHEN a user requests spec generation for a code file THEN the system SHALL analyze the file and generate a requirements.md with inferred user stories
2. WHEN generating specs THEN the system SHALL extract function signatures, docstrings, and comments to inform the generated content
3. WHEN generating specs THEN the system SHALL create them in the appropriate adapter format (Kiro, SpecKit, etc.) based on configuration
4. WHEN specs are generated THEN the system SHALL mark them as "auto-generated" with metadata for future reference
5. WHEN generating specs for multiple files THEN the system SHALL group related files into logical feature specs

### Requirement 4: Spec Compression

**User Story:** As a developer, I want to automatically compress verbose specs into concise summaries, so that agents get focused context without information overload.

#### Acceptance Criteria

1. WHEN a user requests spec compression THEN the system SHALL analyze spec content and generate a condensed version
2. WHEN compressing specs THEN the system SHALL preserve all acceptance criteria while reducing verbose descriptions
3. WHEN compression is applied THEN the system SHALL store both original and compressed versions
4. WHEN agents query specs THEN the system SHALL serve compressed versions by default with option to expand
5. WHEN compression ratio exceeds a threshold THEN the system SHALL flag the spec as "verbose" in health reports

### Requirement 5: CLI Integration

**User Story:** As a developer, I want CLI commands to manage spec lifecycle, so that I can integrate these tools into my workflow.

#### Acceptance Criteria

1. WHEN the user runs `specmem prune` THEN the system SHALL analyze and optionally remove orphaned specs
2. WHEN the user runs `specmem generate` THEN the system SHALL create specs from specified code files
3. WHEN the user runs `specmem compress` THEN the system SHALL compress verbose specs
4. WHEN the user runs `specmem health` THEN the system SHALL display spec health scores and recommendations
5. WHEN any command modifies specs THEN the system SHALL provide clear output showing what changed

### Requirement 6: Python API Integration

**User Story:** As a developer using the Python API, I want programmatic access to spec lifecycle features, so that I can integrate them into custom workflows.

#### Acceptance Criteria

1. WHEN using the SpecMemClient THEN the system SHALL expose `prune_specs()`, `generate_specs()`, and `compress_specs()` methods
2. WHEN calling lifecycle methods THEN the system SHALL return structured results with affected specs and actions taken
3. WHEN errors occur during lifecycle operations THEN the system SHALL raise appropriate exceptions with clear messages
