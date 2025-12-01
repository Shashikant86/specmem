# specmem build

Build the Agent Experience Pack.

## Usage

```bash
specmem build [OPTIONS]
```

## Description

Generates the `.specmem/` directory containing all artifacts needed by AI coding agents:

- `agent_memory.json` - All specs with metadata
- `agent_context.md` - Human-readable summary
- `knowledge_index.json` - Keyword mappings
- `impact_graph.json` - Relationship graph
- `vectordb/` - Vector embeddings

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--output, -o PATH` | Output directory | `.specmem` |
| `--format FORMAT` | Output format (json, yaml) | `json` |
| `--no-context` | Skip context generation | `false` |
| `--no-graph` | Skip graph generation | `false` |
| `--no-index` | Skip index generation | `false` |
| `--verbose, -v` | Show detailed output | `false` |

## Examples

### Basic Build

```bash
specmem build
```

Output:

```
🔨 Building Agent Experience Pack...

Steps:
  ✅ Loading specifications (24 specs)
  ✅ Generating embeddings
  ✅ Building impact graph
  ✅ Creating knowledge index
  ✅ Writing agent context

Output:
  📁 .specmem/
  ├── agent_memory.json (124 KB)
  ├── agent_context.md (8 KB)
  ├── knowledge_index.json (12 KB)
  ├── impact_graph.json (18 KB)
  └── vectordb/ (2.4 MB)

✅ Build complete in 3.2s
```

### Custom Output Directory

```bash
specmem build --output ./build/specmem
```

### Skip Optional Artifacts

```bash
specmem build --no-context --no-index
```

### YAML Format

```bash
specmem build --format yaml
```

## Output Files

### agent_memory.json

Contains all specifications with metadata:

```json
{
  "version": "1.0.0",
  "generated_at": "2025-12-01T10:00:00Z",
  "specs": [
    {
      "id": "auth-req-001",
      "path": ".kiro/specs/auth/requirements.md",
      "type": "requirement",
      "title": "User Authentication",
      "content": "...",
      "summary": "User authentication with JWT",
      "tags": ["auth", "security"],
      "lifecycle": "active",
      "priority": "critical"
    }
  ]
}
```

### agent_context.md

Human-readable summary for agents:

```markdown
# Project Context

## Overview
This project contains 24 specifications across 8 features.

## Critical Requirements
- User authentication with JWT tokens
- API rate limiting (100 req/min)
- Data encryption at rest

## Active Features
- Authentication (4 specs)
- API Gateway (3 specs)
- User Management (5 specs)
...
```

### knowledge_index.json

Keyword to spec mappings:

```json
{
  "authentication": ["auth-req-001", "auth-design-001"],
  "jwt": ["auth-req-001", "auth-design-002"],
  "security": ["auth-req-001", "security-constraint-001"]
}
```

### impact_graph.json

Relationship graph:

```json
{
  "nodes": [
    {"id": "auth-req-001", "type": "spec"},
    {"id": "src/auth/service.py", "type": "code"}
  ],
  "edges": [
    {"from": "auth-req-001", "to": "src/auth/service.py", "type": "implemented_by"}
  ]
}
```

## See Also

- [specmem scan](scan.md)
- [Core Concepts](../user-guide/concepts.md)
