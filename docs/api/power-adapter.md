# 🔋 Power Adapter API

The Power Adapter parses Kiro Power configurations and includes them in the spec memory.

## Overview

When SpecMem scans a repository, the Power Adapter detects installed Kiro Powers in `.kiro/powers/` and converts their documentation into searchable SpecBlocks.

## PowerAdapter Class

::: specmem.adapters.power.PowerAdapter
    options:
      show_source: true
      members:
        - name
        - detect
        - load

## Data Models

### PowerInfo

Information about an installed Kiro Power.

```python
from dataclasses import dataclass, field
from pathlib import Path

@dataclass
class PowerInfo:
    """Information about an installed Kiro Power."""
    name: str
    path: Path
    description: str = ""
    tools: list[ToolInfo] = field(default_factory=list)
    steering_files: list[Path] = field(default_factory=list)
    keywords: list[str] = field(default_factory=list)
    version: str | None = None
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | str | Power display name |
| `path` | Path | Path to Power directory |
| `description` | str | Power description |
| `tools` | list[ToolInfo] | MCP tools provided |
| `steering_files` | list[Path] | Steering file paths |
| `keywords` | list[str] | Discovery keywords |
| `version` | str | Power version |

### ToolInfo

Information about an MCP tool.

```python
@dataclass
class ToolInfo:
    """Information about an MCP tool."""
    name: str
    description: str
    input_schema: dict = field(default_factory=dict)
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | str | Tool name |
| `description` | str | Tool description |
| `input_schema` | dict | JSON Schema for inputs |

## Usage

### Basic Usage

```python
from specmem.adapters.power import PowerAdapter

adapter = PowerAdapter()

# Check if Powers are installed
if adapter.detect("/path/to/repo"):
    # Load Power documentation as SpecBlocks
    blocks = adapter.load("/path/to/repo")
    print(f"Loaded {len(blocks)} blocks from Powers")
```

### With SpecMem Client

The Power Adapter is automatically used when scanning:

```python
from specmem import SpecMemClient

client = SpecMemClient()
client.scan()  # Automatically detects and indexes Powers
```

## What Gets Parsed

### POWER.md

The main Power documentation file is parsed into:

- **Overview block** (`SpecType.KNOWLEDGE`) - Power name, description, version
- **Section blocks** - Each `##` section becomes a separate block
- **Tool blocks** (`SpecType.DESIGN`) - One block per MCP tool

### Steering Files

Files in `steering/*.md` are parsed as:

- **Workflow blocks** (`SpecType.TASK`) - Workflow guides and instructions

### mcp.json

The MCP configuration provides:

- Display name and description
- Keywords for discovery
- Tool metadata (names, descriptions, schemas)

## SpecBlock Types

Powers create SpecBlocks with these types:

| Content | SpecType | Description |
|---------|----------|-------------|
| POWER.md overview | `KNOWLEDGE` | Power documentation |
| Tool descriptions | `DESIGN` | Tool architecture |
| Steering files | `TASK` | Workflow guides |

## Tags

Power SpecBlocks are tagged for easy filtering:

```python
# Overview block tags
["power", "power_name", "keyword1", "keyword2"]

# Tool block tags
["power", "tool", "tool_name", "power_name"]

# Steering block tags
["power", "steering", "power_name", "file_stem"]
```

## Directory Structure

Expected Power directory structure:

```
.kiro/powers/
└── power-name/
    ├── POWER.md           # Required - Power documentation
    ├── mcp.json           # Optional - MCP configuration
    └── steering/          # Optional - Steering files
        ├── getting-started.md
        └── workflows.md
```

## Error Handling

The adapter handles errors gracefully:

| Condition | Behavior |
|-----------|----------|
| Missing POWER.md | Skip Power, log warning |
| Malformed POWER.md | Extract what's possible |
| Missing steering/ | Continue without steering files |
| Invalid mcp.json | Skip tool metadata, log warning |

## Configuration

Enable/disable the Power adapter in `.specmem.toml`:

```toml
[adapters]
power = true  # Default: true

[adapters.power]
powers_dir = ".kiro/powers"  # Default location
```

## Integration with Impact Graph

Powers are integrated into the SpecImpact graph:

- Each Power becomes a `POWER` node
- Steering files that reference code patterns create edges
- Query impact to see Power relationships

```python
from specmem import SpecMemClient

client = SpecMemClient()
impact = client.get_impact_set(["src/auth.py"])

# Check for Power relationships
for node in impact.nodes:
    if node.type == "POWER":
        print(f"Affected Power: {node.name}")
```

## See Also

- [Kiro Powers Integration](../user-guide/kiro-powers.md) - User guide
- [Writing Adapters](../advanced/writing-adapters.md) - Create custom adapters
- [Adapters Overview](adapters.md) - All available adapters
