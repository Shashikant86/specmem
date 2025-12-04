# ⚡ Kiro Powers Integration

SpecMem integrates with [Kiro Powers](https://kiro.dev/blog/introducing-powers/) to provide spec memory capabilities directly within Kiro IDE.

## Overview

The integration works in two directions:

1. **SpecMem as a Power** - Install SpecMem as a Kiro Power to access spec memory tools directly from Kiro
2. **Power-Aware Memory** - SpecMem automatically indexes installed Powers, making their documentation searchable

## Installing the SpecMem Power

### From Kiro Powers Registry

1. Open Kiro IDE
2. Go to the Powers panel
3. Search for "SpecMem"
4. Click Install

### Manual Installation

Add to your `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "specmem": {
      "command": "uvx",
      "args": ["specmem-mcp"],
      "env": {
        "SPECMEM_LOG_LEVEL": "INFO"
      }
    }
  }
}
```

## Available Tools

Once installed, the SpecMem Power provides six MCP tools:

### specmem_query

Query specifications by natural language.

```
specmem_query(query: "authentication requirements", top_k: 10)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | required | Natural language search query |
| `top_k` | integer | 10 | Maximum results to return |
| `include_legacy` | boolean | false | Include deprecated specs |

### specmem_impact

Analyze which specs and tests are affected by file changes.

```
specmem_impact(files: ["src/auth.py", "src/user.py"], depth: 2)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `files` | array | required | File paths to analyze |
| `depth` | integer | 2 | Traversal depth for relationships |

### specmem_context

Get an optimized context bundle for files within a token budget.

```
specmem_context(files: ["src/auth.py"], token_budget: 4000)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `files` | array | required | Files to get context for |
| `token_budget` | integer | 4000 | Maximum tokens in response |

### specmem_tldr

Get a concise summary of key specifications.

```
specmem_tldr(token_budget: 500)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `token_budget` | integer | 500 | Maximum tokens for summary |

### specmem_coverage

Analyze spec coverage and identify test gaps.

```
specmem_coverage(feature: "authentication")
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `feature` | string | optional | Feature to analyze (all if omitted) |

### specmem_validate

Validate specifications for quality issues.

```
specmem_validate(spec_id: "auth.login")
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `spec_id` | string | optional | Spec to validate (all if omitted) |

## Workflows

### Before Making Changes

1. Use `specmem_impact` to see which specs are affected
2. Use `specmem_context` to get relevant context
3. Review the TL;DR with `specmem_tldr`

```
# Check what specs relate to auth changes
specmem_impact(files: ["src/auth/service.py"])

# Get context for the work
specmem_context(files: ["src/auth/service.py"], token_budget: 4000)
```

### After Making Changes

1. Run `specmem_validate` to check spec quality
2. Use `specmem_coverage` to identify test gaps
3. Run affected tests from impact analysis

```
# Validate specs are still correct
specmem_validate()

# Check for coverage gaps
specmem_coverage()
```

### Code Review Workflow

```
# Get context for changed files
specmem_context(files: ["changed_file.py"])

# Check if changes align with specs
specmem_query(query: "requirements for changed functionality")

# Validate specs
specmem_validate()
```

## Power-Aware Memory

SpecMem automatically detects and indexes installed Kiro Powers from `.kiro/powers/`.

### What Gets Indexed

- **POWER.md** - Power documentation and overview
- **Steering files** - Workflow guides from `steering/*.md`
- **Tool metadata** - Tool descriptions from `mcp.json`

### Querying Power Documentation

```bash
# Find Power-related specs
specmem query "aws documentation"

# Get context including Power docs
specmem context --files src/aws_client.py
```

### Power Impact Tracking

The SpecImpact graph tracks relationships between Powers and your code:

- Powers are represented as `POWER` nodes in the graph
- Steering files that reference code patterns create edges to matching files
- Query impact to see which Powers affect which code

```bash
# See what Powers affect a file
specmem impact --files src/auth.py
```

## Configuration

### Steering File for SpecMem

Create `.kiro/steering/specmem.md` to always include SpecMem guidance:

```markdown
---
inclusion: always
---

# SpecMem Integration

This project uses SpecMem for specification management.

## Before Making Changes

1. Query relevant specs: `specmem_query("<description>")`
2. Check impact: `specmem_impact(files: [<files>])`
3. Get context: `specmem_context(files: [<files>])`

## After Changes

1. Validate: `specmem_validate()`
2. Check coverage: `specmem_coverage()`
```

### Agent Hook

Create a hook to run impact analysis on file save:

```json
{
  "name": "SpecMem Impact Check",
  "trigger": "on_file_save",
  "pattern": "*.py",
  "action": {
    "type": "shell",
    "command": "specmem impact --files ${file} --tests --format list"
  }
}
```

## Error Handling

The SpecMem Power handles errors gracefully:

| Condition | Response |
|-----------|----------|
| Not initialized | Helpful message with `specmem init` instructions |
| No results | Empty result set with descriptive message |
| Invalid file path | Error identifying which paths are invalid |
| Vector DB unavailable | Falls back to keyword-based search |

## Keywords

The SpecMem Power responds to these keywords in Kiro:

- specs, memory, context
- impact, coverage, testing
- validation, spec-driven

When you mention these topics, Kiro will suggest using SpecMem tools.
