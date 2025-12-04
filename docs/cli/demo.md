# specmem demo

Launch a demo of SpecMem using its own specifications (dogfooding).

## Usage

```bash
specmem demo [OPTIONS]
```

## Description

The `demo` command provides a zero-configuration way to try SpecMem. It:

1. **Copies SpecMem's own specs** - Uses the project's `.kiro/specs/` as sample data
2. **Builds the Agent Pack** - Indexes all specifications
3. **Launches the Web UI** - Starts the server on port 8765
4. **Opens your browser** - Automatically navigates to the UI

This is perfect for:

- First-time users exploring SpecMem
- Demos and presentations
- Testing new features

## Options

| Option | Description |
|--------|-------------|
| `--port, -p` | Port for the Web UI (default: 8765) |
| `--no-browser` | Don't open browser automatically |

## Examples

```bash
# Basic demo
specmem demo

# Custom port
specmem demo --port 3000

# Don't open browser
specmem demo --no-browser
```

## What You'll See

The demo showcases SpecMem's features using its own specifications:

### Dashboard
- **Health Score** - Project health grade (A-F)
- **Stats** - Total specs, features, coverage
- **Quick Actions** - Scan, Build, Validate, Coverage

### Specifications
- Browse all indexed specs
- Filter by type (requirement, design, task)
- Click to view full content

### Coverage
- See acceptance criteria coverage
- Identify untested requirements
- Get test suggestions

### Impact Graph
- Visualize spec → code → test relationships
- Filter by node type
- Hover for details

### Dogfooding Badge
When viewing SpecMem's own specs, you'll see a "🐕 Eating our own dogfood" badge - proof that we use SpecMem to build SpecMem!

## How It Works

```python
# The demo command does this:
1. Detects SpecMem's own .kiro/specs/ directory
2. Loads all specification blocks
3. Builds the vector index for search
4. Starts the FastAPI server
5. Opens the browser
```

## See Also

- [specmem serve](serve.md) - Start the Web UI manually
- [specmem build](build.md) - Build the Agent Pack
- [Web UI Guide](../user-guide/web-ui.md) - Full UI documentation
