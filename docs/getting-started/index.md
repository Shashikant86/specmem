# 🚀 Getting Started

Welcome to SpecMem! This guide will help you get up and running quickly.

## What is SpecMem?

SpecMem is a **cognitive memory layer** for AI coding agents. It provides:

- **Persistent memory** across agent sessions
- **Spec awareness** for code changes
- **Intelligent context** management
- **Selective testing** recommendations

## Quick Overview

```mermaid
graph LR
    A[Your Specs] --> B[SpecMem Adapters]
    B --> C[SpecIR]
    C --> D[Vector DB]
    C --> E[Impact Graph]
    C --> F[Timeline]
    D --> G[Agent Context]
    E --> G
    F --> G
```

## Next Steps

<div class="feature-grid">
  <div class="feature-card">
    <h3><span class="emoji">📦</span> Installation</h3>
    <p>Install SpecMem and its dependencies.</p>
    <a href="installation/" class="md-button">Install Now →</a>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">⚡</span> Quick Start</h3>
    <p>Get up and running in 5 minutes.</p>
    <a href="quickstart/" class="md-button">Quick Start →</a>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">🔧</span> Configuration</h3>
    <p>Customize SpecMem for your project.</p>
    <a href="configuration/" class="md-button">Configure →</a>
  </div>
</div>

## Requirements

- **Python 3.11+**
- **pip** or **uv** package manager
- A project with specification files (Kiro, Cursor, Claude, etc.)

## Supported Platforms

| Platform | Status |
|----------|--------|
| macOS | ✅ Fully supported |
| Linux | ✅ Fully supported |
| Windows | ✅ Fully supported |
| Docker | ✅ Fully supported |
