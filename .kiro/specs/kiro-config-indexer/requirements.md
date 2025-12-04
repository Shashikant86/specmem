# Requirements Document

## Introduction

The Kiro Config Indexer extends SpecMem's Kiro adapter to index all Kiro CLI configuration artifacts beyond just specs. This enables SpecMem to learn from and provide context about project-level steering files, MCP server configurations, hooks, and agent settings. By indexing these artifacts, SpecMem can answer questions like "What coding standards apply to Python files?" or "What MCP tools are available in this project?"

## Glossary

- **Steering File**: A markdown file in `.kiro/steering/` that provides project-wide or file-specific guidance to the Kiro agent
- **MCP Configuration**: JSON configuration in `.kiro/settings/mcp.json` defining available Model Context Protocol servers and tools
- **Hook**: A JSON configuration in `.kiro/hooks/` that defines automated actions triggered by file events or manual invocation
- **Agent Configuration**: JSON settings in `.kiro/settings/agent.json` defining agent behavior preferences
- **Inclusion Mode**: How a steering file is included - "always", "fileMatch" (conditional), or "manual"
- **File Match Pattern**: A glob pattern in steering file frontmatter that determines which files trigger inclusion

## Requirements

### Requirement 1

**User Story:** As a developer, I want SpecMem to index my project's steering files, so that I can search for coding standards and guidelines that apply to specific files.

#### Acceptance Criteria

1. WHEN SpecMem scans a project with `.kiro/steering/*.md` files THEN the System SHALL parse each steering file and create searchable SpecBlocks
2. WHEN a steering file contains YAML frontmatter with `inclusion` and `fileMatchPattern` THEN the System SHALL extract and store these metadata fields
3. WHEN querying for guidelines applicable to a specific file THEN the System SHALL return steering files where the file matches the `fileMatchPattern`
4. WHEN a steering file has `inclusion: always` THEN the System SHALL mark the SpecBlock as high-priority for context inclusion
5. WHEN a steering file has `inclusion: manual` THEN the System SHALL tag the SpecBlock for manual-only retrieval

### Requirement 2

**User Story:** As a developer, I want SpecMem to index my MCP server configuration, so that I can query what tools and capabilities are available in my project.

#### Acceptance Criteria

1. WHEN SpecMem scans a project with `.kiro/settings/mcp.json` THEN the System SHALL parse the MCP configuration and create SpecBlocks for each server
2. WHEN an MCP server configuration includes tool definitions THEN the System SHALL create searchable entries for each tool with its description
3. WHEN an MCP server is marked as `disabled: true` THEN the System SHALL tag the SpecBlock as inactive
4. WHEN querying for available tools THEN the System SHALL return only enabled MCP server tools
5. WHEN an MCP server has `autoApprove` tools listed THEN the System SHALL include this trust information in the SpecBlock

### Requirement 3

**User Story:** As a developer, I want SpecMem to index my Kiro hooks, so that I can understand what automated actions are configured in my project.

#### Acceptance Criteria

1. WHEN SpecMem scans a project with `.kiro/hooks/*.json` files THEN the System SHALL parse each hook and create searchable SpecBlocks
2. WHEN a hook has a `filePattern` THEN the System SHALL store this pattern for file-based queries
3. WHEN querying what happens on file save THEN the System SHALL return hooks with `trigger: file_save` matching the file pattern
4. WHEN a hook is disabled THEN the System SHALL tag the SpecBlock as inactive

### Requirement 4

**User Story:** As a developer, I want SpecMem to provide a unified view of all Kiro configuration, so that I can understand my project's agent setup at a glance.

#### Acceptance Criteria

1. WHEN running `specmem kiro-config` THEN the System SHALL display a summary of all indexed Kiro configuration
2. WHEN displaying the summary THEN the System SHALL group items by type (steering, mcp, hooks)
3. WHEN a configuration file is missing or empty THEN the System SHALL indicate this in the summary without error
4. WHEN configuration changes THEN the file watcher SHALL trigger re-indexing of affected config files

### Requirement 5

**User Story:** As a developer, I want to query steering rules that apply to specific files, so that I can understand what guidelines the agent follows when working on those files.

#### Acceptance Criteria

1. WHEN running `specmem steering --file <path>` THEN the System SHALL return all steering files applicable to that file
2. WHEN a steering file has `fileMatchPattern` matching the queried file THEN the System SHALL include it in results
3. WHEN a steering file has `inclusion: always` THEN the System SHALL always include it in results regardless of file path
4. WHEN no steering files match THEN the System SHALL return an empty result with informative message

### Requirement 6

**User Story:** As a developer, I want SpecMem to integrate Kiro config into context bundles, so that relevant configuration is automatically included when working on files.

#### Acceptance Criteria

1. WHEN generating a context bundle for changed files THEN the System SHALL include applicable steering file content
2. WHEN a file matches a steering file's `fileMatchPattern` THEN the System SHALL include that steering content in the bundle
3. WHEN MCP tools are relevant to the context THEN the System SHALL include tool availability information
4. WHEN hooks would trigger for the changed files THEN the System SHALL mention this in the context bundle
