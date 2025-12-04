# Getting Started with SpecMem

## Quick Start

1. **Initialize SpecMem** in your project:
   ```bash
   specmem init
   ```

2. **Scan** your specifications:
   ```bash
   specmem scan
   ```

3. **Build** the memory index:
   ```bash
   specmem build
   ```

## Using SpecMem Tools

### Query Specifications

Find specs related to a topic:
```
specmem_query(query: "user authentication")
```

### Analyze Impact

Before making changes, check what specs are affected:
```
specmem_impact(files: ["src/auth/service.py"])
```

### Get Context

Get relevant context for your current work:
```
specmem_context(files: ["src/auth/service.py"], token_budget: 4000)
```

## Supported Frameworks

SpecMem works with:
- Kiro specs (`.kiro/specs/`)
- SpecKit (`.speckit/`)
- Tessl (`.tessl/`)
- Claude Code (`CLAUDE.md`)
- Cursor (`.cursorrules`)
