<p align="center">
  <img src="docs/assets/logo.png" alt="SpecMem Logo" width="200" />
</p>

<h1 align="center">SpecMem</h1>

<p align="center">
  <strong>🧠 Unified Agent Experience and Cognitive Memory for Every Coding Agent</strong>
</p>

<p align="center">
  <em>The first-ever Agent Experience (AgentEx) platform built for AI coding agents</em>
</p>

<p align="center">
  <a href="https://superagenticai.github.io/specmem/">📚 Documentation</a> •
  <a href="https://superagenticai.github.io/specmem/getting-started/installation/">🚀 Getting Started</a> •
  <a href="https://github.com/SuperagenticAI/specmem">⭐ GitHub</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/python-3.10+-blue.svg" alt="Python 3.10+" />
  <img src="https://img.shields.io/badge/license-Apache%202.0-green.svg" alt="License" />
  <img src="https://img.shields.io/badge/status-alpha-orange.svg" alt="Status" />
</p>

---

## 🎯 The Problem

Modern coding agents (Kiro, SpecKit, Tessl, Claude Code, Cursor, etc.) can **generate files**, **follow tasks**, and **implement features** — but they struggle with:

| Problem | Impact |
|---------|--------|
| **🧠 Lack of persistent memory** | Agents forget specs and context when sessions reset |
| **📋 Code changes without spec awareness** | Agents write or modify code without knowing specs, acceptance criteria, designs, or earlier decisions |
| **⚡ Over-testing and wasted compute** | Every change triggers full test runs, even when only a tiny module changed |
| **🔗 No spec impact understanding** | Agents can't automatically identify which specs or tests relate to code modifications |
| **📉 Inconsistent agent performance** | No Agent Experience (AgentEx) layer — the equivalent of DevEx but for agents |

> **These issues cause:** regressions, misaligned implementations, slow CI pipelines, unpredictable agent behavior, and increased costs.
>
> **The industry lacks a Cognitive Memory + AgentEx platform to fix this.**

---

## 💡 The Solution

**SpecMem** is a unified, embeddable memory layer for AI coding agents built on Spec-Driven Development (SDD) metadata.


```bash
pip install specmem
```

```python
from specmem import SpecMemClient

sm = SpecMemClient()
bundle = sm.get_context_for_change(["auth/service.py"])
print(bundle.tldr)
```

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **🔌 Multi-Framework Adapters** | Parse specs from Kiro, SpecKit, Tessl, Claude Code, Cursor, Codex, Factory, Warp, Gemini CLI |
| **🧠 Intelligent Memory** | Vector-based semantic search with LanceDB, ChromaDB, or Qdrant |
| **📊 SpecImpact Graph** | Bidirectional relationships between specs, code, and tests |
| **⏱️ SpecDiff Timeline** | Track spec evolution, detect drift, find contradictions |
| **✅ SpecValidator** | Quality assurance for specifications |
| **🎯 Selective Testing** | Run only the tests that matter |

---

## 🔄 The Killer Feature

**Swap agents without losing context.** SpecMem creates a unified, normalized, agent-agnostic context layer.

Switch from **Kiro → SpecKit → Tessl → Claude Code → Cursor** without rewriting spec files or losing project knowledge.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Your Project                            │
├─────────────────────────────────────────────────────────────────┤
│  .kiro/specs/   .speckit/   .tessl/   Claude.md   cursor.json   │
│       │             │          │          │            │         │
│       └─────────────┴──────────┴──────────┴────────────┘         │
│                           │                                      │
│                    ┌──────▼──────┐                               │
│                    │   SpecMem   │                               │
│                    │  Adapters   │                               │
│                    └──────┬──────┘                               │
│                           │                                      │
│                    ┌──────▼──────┐                               │
│                    │   SpecIR    │  ← Canonical Representation   │
│                    └──────┬──────┘                               │
│                           │                                      │
│         ┌─────────────────┼─────────────────┐                    │
│         │                 │                 │                    │
│  ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐            │
│  │ Vector DB   │   │ SpecImpact  │   │  SpecDiff   │            │
│  │ (LanceDB)   │   │   Graph     │   │  Timeline   │            │
│  └─────────────┘   └─────────────┘   └─────────────┘            │
│                           │                                      │
│                    ┌──────▼──────┐                               │
│                    │ AgentXPack  │  ← Output for any agent       │
│                    └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### CLI

```bash
# Initialize SpecMem in your project
specmem init

# Scan and index your specifications
specmem scan

# Build the Agent Experience Pack
specmem build

# Query your specs
specmem query "What are the authentication requirements?"

# Analyze impact of code changes
specmem impact --files src/auth/service.py
```

### Python API

```python
from specmem import SpecMemClient

# Initialize client
sm = SpecMemClient()

# Get context for code changes
bundle = sm.get_context_for_change(["auth/service.py"])
print(bundle.tldr)

# Query specifications
specs = sm.query("authentication requirements")

# Get impacted specs for changes
impacted = sm.get_impacted_specs(["auth/service.py"])

# Check for spec drift
drift = sm.get_drift_report()
```

---

## 📦 Output: Agent Experience Pack

SpecMem generates a `.specmem/` directory containing everything your agents need:

```
.specmem/
├── agent_memory.json      # All specs with metadata and rankings
├── agent_context.md       # Human-readable summary
├── knowledge_index.json   # Keyword → SpecBlock mapping
├── impact_graph.json      # Code ↔ Spec relationships
└── vectordb/              # Embedded vector storage
```

---

## 🔌 Supported Frameworks

### Spec-Driven Development (Priority)

| Framework | Adapter | File Patterns |
|-----------|---------|---------------|
| **Kiro** | `kiro` | `.kiro/specs/**/*.md` |
| **SpecKit** | `speckit` | `.speckit/**/*.yaml` |
| **Tessl** | `tessl` | `.tessl/**/*.md` |

### Commercial Coding Agents

| Framework | Adapter | File Patterns |
|-----------|---------|---------------|
| Claude Code | `claude` | `Claude.md`, `CLAUDE.md` |
| Cursor | `cursor` | `cursor.json`, `.cursorrules` |
| Codex | `codex` | `.codex/**/*.md` |
| Factory | `factory` | `.factory/**/*.yaml` |
| Warp | `warp` | `.warp/**/*.md` |
| Gemini CLI | `gemini` | `GEMINI.md`, `.gemini/**/*.md` |

---

## 📖 Documentation

Full documentation is available at **[superagenticai.github.io/specmem](https://superagenticai.github.io/specmem/)**

- [Installation Guide](https://superagenticai.github.io/specmem/getting-started/installation/)
- [Quick Start](https://superagenticai.github.io/specmem/getting-started/quickstart/)
- [User Guide](https://superagenticai.github.io/specmem/user-guide/concepts/)
- [CLI Reference](https://superagenticai.github.io/specmem/cli/init/)
- [Python API](https://superagenticai.github.io/specmem/api/client/)
- [Advanced Topics](https://superagenticai.github.io/specmem/advanced/)

---

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/SuperagenticAI/specmem.git
cd specmem

# Install dependencies
make install

# Run tests
make test

# Run linting
make lint
```

---

## 📄 License

Apache 2.0 - see [LICENSE](LICENSE) for details.

---

## 🏢 About

**SpecMem** is developed by [Superagentic AI](https://super-agentic.ai) as part of the Kiroween Hackathon, December 2025.

<p align="center">
  <sub>Built with ❤️ for the AI coding agent community</sub>
</p>
