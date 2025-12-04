# specmem serve

Start the SpecMem web UI server.

## Usage

```bash
specmem serve [PATH] [OPTIONS]
```

## Description

Launches an interactive web interface for exploring and managing specifications.

**Prerequisites:** Run `specmem build` first to index your specifications.

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `PATH` | Repository path | `.` (current directory) |
| `--port, -p PORT` | Server port | `8765` |

## Examples

### Basic Start

```bash
# Build first (required for search)
specmem build

# Start the server
specmem serve
```

Output:

```
🚀 SpecMem UI starting...
   Local:   http://127.0.0.1:8765
   API:     http://127.0.0.1:8765/api
   Docs:    http://127.0.0.1:8765/docs
   Live:    File watcher enabled

Press Ctrl+C to stop
```

### Custom Port

```bash
specmem serve --port 3000
```

### Specific Project Path

```bash
specmem serve /path/to/project
```

## Features

The Web UI provides:

- **Dashboard** - Health score, stats, quick actions
- **Specifications** - Browse and filter all indexed specs
- **Search** - Semantic search across your specs
- **Coverage** - See which acceptance criteria have tests
- **Impact Graph** - Visualize spec ↔ code ↔ test relationships
- **Sessions** - Browse Kiro conversation history
- **Powers** - View installed Kiro Powers

## API Endpoints

The server exposes a REST API at `/api`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/blocks` | GET | List all spec blocks |
| `/api/blocks/{id}` | GET | Get specific block |
| `/api/search` | GET | Search specs |
| `/api/stats` | GET | Get statistics |
| `/api/health` | GET | Get health score |
| `/api/coverage` | GET | Get coverage analysis |
| `/api/graph` | GET | Get impact graph |
| `/api/actions/*` | POST | Quick actions |

## WebSocket

Real-time updates at `ws://localhost:8765/api/ws`

The server watches for spec file changes and broadcasts updates to connected clients.

## See Also

- [specmem demo](demo.md) - Try SpecMem with sample data
- [Web UI Guide](../user-guide/web-ui.md) - Full UI documentation
