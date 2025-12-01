# ⚡ Quick Start

Get SpecMem running in your project in under 5 minutes.

## Step 1: Initialize SpecMem

Navigate to your project directory and initialize SpecMem:

```bash
cd your-project
specmem init
```

This creates:

- `.specmem.toml` - Configuration file
- `.specmem/` - Data directory (add to `.gitignore`)

## Step 2: Scan Your Specifications

Scan your project for specification files:

```bash
specmem scan
```

SpecMem automatically detects specs from:

| Framework | Location |
|-----------|----------|
| Kiro | `.kiro/specs/` |
| Cursor | `cursor.json`, `.cursorrules` |
| Claude Code | `Claude.md`, `CLAUDE.md` |
| SpecKit | `.speckit/` |
| Tessl | `.tessl/` |

Example output:

```
🔍 Scanning for specifications...
✅ Found 12 specs in .kiro/specs/
✅ Found 3 specs in cursor.json
✅ Found 1 spec in Claude.md
📊 Total: 16 specifications indexed
```

## Step 3: Build the Agent Pack

Generate the Agent Experience Pack:

```bash
specmem build
```

This creates the `.specmem/` directory with:

```
.specmem/
├── agent_memory.json      # All specs with metadata
├── agent_context.md       # Human-readable summary
├── knowledge_index.json   # Keyword mappings
├── impact_graph.json      # Code ↔ Spec relationships
└── vectordb/              # Vector embeddings
```

## Step 4: Query Your Specs

Search your specifications semantically:

```bash
specmem query "authentication requirements"
```

Example output:

```
🔍 Query: "authentication requirements"

📄 user-auth/requirements.md (score: 0.92)
   User authentication with JWT tokens and refresh mechanism

📄 api-security/design.md (score: 0.87)
   API security layer with rate limiting and auth middleware

📄 session-management/tasks.md (score: 0.81)
   Session handling and token refresh implementation
```

## Step 5: Analyze Impact

See which specs are affected by code changes:

```bash
specmem impact --files src/auth/service.py
```

Example output:

```
📊 Impact Analysis for: src/auth/service.py

🎯 Directly Impacted Specs:
   • user-auth/requirements.md
   • user-auth/design.md

🔗 Transitively Impacted:
   • api-security/design.md
   • session-management/tasks.md

🧪 Recommended Tests:
   • tests/test_auth.py::test_login
   • tests/test_auth.py::test_logout
   • tests/test_auth.py::test_token_refresh
```

## Using the Python API

```python
from specmem import SpecMemClient

# Initialize
sm = SpecMemClient()

# Get context for changes
bundle = sm.get_context_for_change(["auth/service.py"])
print(bundle.tldr)
print(bundle.specs)
print(bundle.recommended_tests)

# Query specs
results = sm.query("authentication", top_k=5)
for spec in results:
    print(f"{spec.path}: {spec.summary}")

# Get impacted specs
impacted = sm.get_impacted_specs(["auth/service.py"])
for spec in impacted:
    print(f"Impacted: {spec.path}")

# Validate specs
issues = sm.validate()
for issue in issues:
    print(f"{issue.severity}: {issue.message}")
```

## Web UI

Launch the interactive web interface:

```bash
specmem serve
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

![SpecMem Web UI](../assets/web-ui-screenshot.png)

## What's Next?

<div class="feature-grid">
  <div class="feature-card">
    <h3><span class="emoji">🔧</span> Configuration</h3>
    <p>Customize SpecMem for your workflow.</p>
    <a href="../configuration/" class="md-button">Configure →</a>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">🧠</span> Core Concepts</h3>
    <p>Understand how SpecMem works.</p>
    <a href="../../user-guide/concepts/" class="md-button">Learn More →</a>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">💻</span> CLI Reference</h3>
    <p>Explore all CLI commands.</p>
    <a href="../../cli/" class="md-button">CLI Docs →</a>
  </div>
</div>
