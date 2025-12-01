# 🌐 Web UI

SpecMem includes an interactive web interface for exploring and managing specifications.

## Quick Start

```bash
# Install UI dependencies
pip install "specmem[ui]"

# Start the server
specmem serve
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

## Features

### 📊 Dashboard

The dashboard provides an overview of your specification health:

- Total specs by type and lifecycle
- Recent changes
- Validation issues
- Impact graph summary

### 🔍 Search

Semantic search across all specifications:

- Natural language queries
- Filter by type, lifecycle, priority
- Sort by relevance, date, or priority
- Preview results inline

### 📈 Impact Graph

Interactive visualization of spec relationships:

- Zoom and pan
- Click nodes for details
- Filter by relationship type
- Export as image

### ⏱️ Timeline

Visual history of specification changes:

- Chronological view
- Filter by spec or date range
- Compare versions
- Identify drift

### ✅ Validator

Run and view validation results:

- Real-time validation
- Filter by severity
- Quick fixes
- Export reports

## Configuration

```toml
[ui]
# Server host
host = "127.0.0.1"

# Server port
port = 8000

# Enable hot reload (development)
reload = true

# Enable authentication
auth_enabled = false

# API key (if auth enabled)
# api_key = "your-secret-key"
```

## CLI Options

```bash
# Custom host and port
specmem serve --host 0.0.0.0 --port 3000

# Disable hot reload
specmem serve --no-reload

# Open browser automatically
specmem serve --open

# Production mode
specmem serve --production
```

## API Endpoints

The web UI exposes a REST API:

### Specs

```bash
# List all specs
GET /api/specs

# Get specific spec
GET /api/specs/{id}

# Search specs
GET /api/specs/search?q=authentication

# Get spec history
GET /api/specs/{id}/history
```

### Impact

```bash
# Analyze impact
POST /api/impact
{
  "files": ["src/auth/service.py"]
}

# Get graph data
GET /api/graph
```

### Validation

```bash
# Validate all specs
POST /api/validate

# Validate specific spec
POST /api/validate/{id}
```

## WebSocket

Real-time updates via WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Update:', data);
};

// Subscribe to spec changes
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'specs'
}));
```

## Embedding

Embed the UI in your own application:

```python
from specmem.ui import create_app

app = create_app()

# Mount at a subpath
from fastapi import FastAPI
main_app = FastAPI()
main_app.mount("/specmem", app)
```

## Docker

Run the UI in Docker:

```bash
docker run -p 8000:8000 -v $(pwd):/workspace ghcr.io/shashikant86/specmem:latest serve
```

## Screenshots

### Dashboard
![Dashboard](../assets/ui-dashboard.png)

### Search
![Search](../assets/ui-search.png)

### Impact Graph
![Impact Graph](../assets/ui-graph.png)

### Timeline
![Timeline](../assets/ui-timeline.png)

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Focus search |
| `g d` | Go to dashboard |
| `g s` | Go to search |
| `g g` | Go to graph |
| `g t` | Go to timeline |
| `g v` | Go to validator |
| `?` | Show shortcuts |
