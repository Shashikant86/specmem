# 🔧 Kiro Configuration Indexing

SpecMem automatically indexes all Kiro CLI configuration artifacts, making them searchable and available for context generation.

## Overview

When you use the Kiro CLI to set up your project, it creates various configuration files:

- **Steering files** (`.kiro/steering/*.md`) - Project guidelines and coding standards
- **MCP configuration** (`.kiro/settings/mcp.json`) - Model Context Protocol servers
- **Hooks** (`.kiro/hooks/*.json`) - Automated actions on file events

SpecMem indexes all of these, enabling:

- Semantic search across all configuration
- File-specific steering queries
- Context bundles that include relevant guidelines
- Awareness of available MCP tools

## Steering Files

Steering files provide project-wide or file-specific guidance to the Kiro agent.

### Format

```markdown
---
inclusion: always | fileMatch | manual
fileMatchPattern: "*.py"
---

# Python Coding Standards

- Use type hints for all functions
- Follow PEP 8 style guide
- Write docstrings in Google format
```

### Inclusion Modes

| Mode | Description |
|------|-------------|
| `always` | Always included in context (high priority) |
| `fileMatch` | Included when working on files matching the pattern |
| `manual` | Only included when explicitly requested |

### Querying Steering

```bash
# Show all steering files
specmem steering

# Show steering applicable to a specific file
specmem steering --file src/auth/service.py
```

### Python API

```python
from specmem.kiro import KiroConfigIndexer

indexer = KiroConfigIndexer(Path("."))
indexer.index_steering()

# Get steering for a file
applicable = indexer.get_steering_for_file("src/auth.py")
for steering in applicable:
    print(f"{steering.title}: {steering.inclusion}")
```

## MCP Configuration

SpecMem indexes your MCP server configuration to know what tools are available.

### Format

```json
{
  "mcpServers": {
    "aws-docs": {
      "command": "uvx",
      "args": ["awslabs.aws-documentation-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": ["search_documentation"]
    }
  }
}
```

### What Gets Indexed

- Server names and commands
- Enabled/disabled status
- Auto-approved tools
- Environment configuration

### Querying MCP Config

```bash
# Show all Kiro configuration including MCP
specmem kiro-config
```

### Python API

```python
from specmem.kiro import KiroConfigIndexer

indexer = KiroConfigIndexer(Path("."))
indexer.index_mcp_config()

# Get available tools
tools = indexer.get_available_tools()
for tool in tools:
    print(f"{tool.server_name}/{tool.tool_name}")
```

## Hooks

SpecMem indexes your Kiro hooks to understand automated workflows.

### Format

```json
{
  "name": "validate-on-save",
  "description": "Validate specs when saved",
  "trigger": "file_save",
  "filePattern": ".kiro/specs/**/*.md",
  "action": "specmem validate --file ${file}",
  "enabled": true
}
```

### Trigger Types

| Trigger | Description |
|---------|-------------|
| `file_save` | Triggered when a file is saved |
| `manual` | Triggered manually by user |
| `session_start` | Triggered when a new session starts |

### Querying Hooks

```bash
# Show all Kiro configuration including hooks
specmem kiro-config
```

### Python API

```python
from specmem.kiro import KiroConfigIndexer

indexer = KiroConfigIndexer(Path("."))
indexer.index_hooks()

# Get hooks that would trigger for a file
hooks = indexer.get_hooks_for_trigger("file_save", "main.py")
for hook in hooks:
    print(f"{hook.name}: {hook.action}")
```

## CLI Commands

### specmem kiro-config

Display a summary of all Kiro configuration:

```bash
specmem kiro-config
```

Output:
```
📝 Steering Files
┌──────────────┬───────────┬─────────┐
│ File         │ Inclusion │ Pattern │
├──────────────┼───────────┼─────────┤
│ python.md    │ fileMatch │ *.py    │
│ security.md  │ always    │ -       │
└──────────────┴───────────┴─────────┘

🔌 MCP Servers
┌─────────────┬─────────────────┬───────────┐
│ Server      │ Command         │ Status    │
├─────────────┼─────────────────┼───────────┤
│ aws-docs    │ uvx awslabs...  │ ✅ Enabled │
│ specmem     │ uvx specmem-mcp │ ✅ Enabled │
└─────────────┴─────────────────┴───────────┘

🪝 Hooks
┌──────────────────┬───────────┬─────────┬──────────┐
│ Hook             │ Trigger   │ Pattern │ Status   │
├──────────────────┼───────────┼─────────┼──────────┤
│ validate-on-save │ file_save │ *.md    │ ✅ Active │
└──────────────────┴───────────┴─────────┴──────────┘
```

### specmem steering

Query steering files:

```bash
# Show all steering files
specmem steering

# Show steering for a specific file
specmem steering --file src/auth/service.py
```

## Integration with Context Bundles

When generating context bundles, SpecMem automatically includes:

1. **Always-included steering** - High priority guidelines
2. **File-matching steering** - Guidelines for the specific files being changed
3. **Triggered hooks** - Information about hooks that would run

```python
from specmem import SpecMemClient

sm = SpecMemClient()
bundle = sm.get_context_for_change(["src/auth.py"])

# Bundle includes applicable steering content
print(bundle.tldr)
```

## Best Practices

### Organizing Steering Files

```
.kiro/steering/
├── always/
│   ├── security.md      # Always included
│   └── architecture.md  # Always included
├── python.md            # fileMatch: *.py
├── typescript.md        # fileMatch: *.ts
└── testing.md           # fileMatch: tests/**/*
```

### Steering File Tips

1. Use `inclusion: always` sparingly - only for critical guidelines
2. Use specific `fileMatchPattern` values to avoid noise
3. Keep steering files focused and concise
4. Update steering when project conventions change

### MCP Configuration Tips

1. Disable unused servers to reduce noise
2. Use `autoApprove` for trusted, frequently-used tools
3. Document custom environment variables
