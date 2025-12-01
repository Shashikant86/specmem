# 📖 Reference

Complete reference documentation for SpecMem.

## Quick Links

<div class="feature-grid">
  <div class="feature-card">
    <h3><span class="emoji">⚙️</span> Configuration</h3>
    <p>All configuration options explained.</p>
    <a href="configuration/" class="md-button">View →</a>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">🔐</span> Environment Variables</h3>
    <p>Environment variable reference.</p>
    <a href="environment/" class="md-button">View →</a>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">📄</span> Spec IR Format</h3>
    <p>Canonical specification format.</p>
    <a href="spec-ir/" class="md-button">View →</a>
  </div>
</div>

## Version Compatibility

| SpecMem | Python | LanceDB | ChromaDB | Qdrant |
|---------|--------|---------|----------|--------|
| 0.1.x | 3.11+ | 0.4+ | 0.4+ | 1.7+ |

## File Locations

| File | Purpose |
|------|---------|
| `.specmem.toml` | Main configuration |
| `.specmem.local.toml` | Local overrides (gitignored) |
| `.specmem/` | Data directory |
| `.specmem/vectordb/` | Vector database storage |
| `.specmem/agent_memory.json` | Spec index |
| `.specmem/agent_context.md` | Human-readable context |

## Supported Frameworks

| Framework | Adapter | Status |
|-----------|---------|--------|
| Kiro | `kiro` | ✅ Stable |
| Cursor | `cursor` | ✅ Stable |
| Claude Code | `claude` | ✅ Stable |
| SpecKit | `speckit` | ✅ Stable |
| Tessl | `tessl` | ✅ Stable |

## API Stability

| Component | Stability |
|-----------|-----------|
| CLI | Stable |
| Python API | Stable |
| REST API | Beta |
| MCP Server | Alpha |
