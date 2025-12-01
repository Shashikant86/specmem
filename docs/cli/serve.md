# specmem serve

Start the SpecMem web UI server.

## Usage

```bash
specmem serve [OPTIONS]
```

## Description

Launches an interactive web interface for exploring and managing specifications.

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--host HOST` | Server host | `127.0.0.1` |
| `--port, -p PORT` | Server port | `8000` |
| `--reload` | Enable hot reload | `true` |
| `--no-reload` | Disable hot reload | `false` |
| `--open` | Open browser automatically | `false` |
| `--production` | Production mode | `false` |

## Examples

### Basic Start

```bash
specmem serve
```

Output:

```
🌐 SpecMem Web UI

Server running at: http://127.0.0.1:8000
Press Ctrl+C to stop

Features:
  • Dashboard: http://127.0.0.1:8000/
  • Search: http://127.0.0.1:8000/search
  • Graph: http://127.0.0.1:8000/graph
  • Timeline: http://127.0.0.1:8000/timeline
  • Validator: http://127.0.0.1:8000/validate
  • API Docs: http://127.0.0.1:8000/docs
```

### Custom Host and Port

```bash
specmem serve --host 0.0.0.0 --port 3000
```

### Open Browser

```bash
specmem serve --open
```

### Production Mode

```bash
specmem serve --production --no-reload
```

### Docker

```bash
docker run -p 8000:8000 -v $(pwd):/workspace ghcr.io/shashikant86/specmem:latest serve --host 0.0.0.0
```

## API Endpoints

The server exposes a REST API:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/specs` | GET | List all specs |
| `/api/specs/{id}` | GET | Get specific spec |
| `/api/specs/search` | GET | Search specs |
| `/api/impact` | POST | Analyze impact |
| `/api/validate` | POST | Validate specs |
| `/api/graph` | GET | Get impact graph |

## WebSocket

Real-time updates at `ws://localhost:8000/ws`

## Requirements

```bash
pip install "specmem[ui]"
```

## See Also

- [Web UI Guide](../user-guide/web-ui.md)
