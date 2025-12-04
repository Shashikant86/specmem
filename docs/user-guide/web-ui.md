# 🌐 Web UI

SpecMem includes an interactive web interface for exploring and managing specifications.

## Quick Start

```bash
# 1. Build your specs first
specmem build

# 2. Start the server
specmem serve
```

Open [http://localhost:8765](http://localhost:8765) in your browser.

## Demo Mode

For a quick demo with SpecMem's own specs (dogfooding):

```bash
specmem demo
```

This will:
1. Copy SpecMem's own specs as sample data
2. Build the Agent Experience Pack
3. Launch the Web UI
4. Open your browser automatically

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

The Web UI uses the default port 8765. You can customize this:

```bash
# Custom port
specmem serve --port 3000
```

## CLI Options

```bash
# Custom port
specmem serve --port 3000

# Specify workspace path
specmem serve /path/to/project
```

## API Endpoints

The web UI exposes a REST API at `/api`:

### Blocks (Specs)

```bash
# List all blocks
GET /api/blocks

# Get specific block
GET /api/blocks/{id}

# Search blocks
GET /api/search?q=authentication&limit=10

# Get pinned blocks
GET /api/pinned

# Get statistics
GET /api/stats
```

### Coverage

```bash
# Get coverage analysis
GET /api/coverage

# Get test suggestions
GET /api/coverage/suggestions
```

### Health Score

```bash
# Get project health score
GET /api/health
```

### Impact Graph

```bash
# Get graph data
GET /api/graph

# Filter by node type
GET /api/graph?types=spec,code
```

### Quick Actions

```bash
# Scan workspace
POST /api/actions/scan

# Build Agent Pack
POST /api/actions/build

# Validate specs
POST /api/actions/validate

# Run coverage analysis
POST /api/actions/coverage

# Query specs
POST /api/actions/query?q=authentication
```

### Sessions (Kiro)

```bash
# List sessions
GET /api/sessions

# Search sessions
GET /api/sessions/search?q=query

# Get session details
GET /api/sessions/{session_id}
```

### Powers (Kiro)

```bash
# List installed powers
GET /api/powers

# Get power details
GET /api/powers/{power_name}
```

## WebSocket

Real-time updates via WebSocket at `/api/ws`:

```javascript
const ws = new WebSocket('ws://localhost:8765/api/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'spec_update') {
    console.log('Specs updated:', data.files);
    // Refresh your data
  }
};

// Keepalive
ws.send('ping');
```

The server automatically watches for spec file changes and broadcasts updates to all connected clients.

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

!!! note "Screenshots Coming Soon"
    Visual screenshots of the Web UI will be added in a future update.

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
