---
title: Home
hide:
  - navigation
  - toc
---

<div class="hero">
  <div class="hero-logo">
    <img src="assets/logo.png" alt="SpecMem Logo" />
  </div>
  <h1>SpecMem</h1>
  <p class="hero-tagline">Unified Agent Experience and Cognitive Memory for Every Coding Agent</p>
  <p class="hero-description">SpecMem transforms scattered specs, outdated docs, and brittle agent prompts into a unified cognitive layer for your entire codebase. Give your coding agents the clarity, memory, and context they've always been missing.</p>
  <p class="hero-features">Executable Specs · Living Documentation · Impact-Aware Context</p>
  <p class="hero-badges">Open-source · Local-first · Agent-agnostic</p>
  <p class="hero-highlight">🏆 First ever Agent Experience tool built for Coding Agents</p>
  <div class="hero-buttons">
    <a href="getting-started/installation/" class="md-button md-button--primary">🚀 Get Started</a>
    <a href="https://github.com/SuperagenticAI/specmem" class="md-button md-button--secondary">📦 View on GitHub</a>
  </div>
</div>

## 🎯 The Problem

Modern coding agents (Kiro, SpecKit, Tessl, Claude Code, Cursor, etc.) can generate files, follow tasks, and implement features — but they struggle with:

| Problem | Impact |
|---------|--------|
| **Lack of persistent memory** | Agents forget specs and context when sessions reset |
| **Code changes without spec awareness** | Agents write or modify code without knowing specs, acceptance criteria, designs, or earlier decisions |
| **Over-testing and wasted compute** | Every change triggers full test runs, even when only a tiny module changed |
| **No spec impact understanding** | Agents can't automatically identify which specs or tests relate to code modifications |
| **Inconsistent agent performance** | No Agent Experience (AgentEx) layer — the equivalent of DevEx but for agents |

<div class="consequences">
<p><strong>These issues cause:</strong> regressions, misaligned implementations, slow CI pipelines, unpredictable agent behavior, and increased costs.</p>
<p><strong>The industry lacks a Cognitive Memory + AgentEx platform to fix this.</strong></p>
</div>

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

<div class="feature-grid">
  <div class="feature-card">
    <h3><span class="emoji">🔌</span> Multi-Framework Adapters</h3>
    <p>Parse specs from Kiro, SpecKit, Tessl, Claude Code, Cursor, Codex, Factory, Warp, Gemini CLI and more. One unified format for all your specifications.</p>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">🧠</span> Intelligent Memory</h3>
    <p>Vector-based semantic search with LanceDB, ChromaDB, or Qdrant. Pinned memory ensures critical constraints are never forgotten.</p>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">📊</span> SpecImpact Graph</h3>
    <p>Bidirectional relationships between specs, code, and tests. Know exactly what's affected by your changes.</p>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">⏱️</span> SpecDiff Timeline</h3>
    <p>Track spec evolution, detect drift, find contradictions, and manage deprecations over time.</p>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">✅</span> SpecValidator</h3>
    <p>Quality assurance for specifications. Detect contradictions, missing criteria, and duplicates automatically.</p>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">🎯</span> Selective Testing</h3>
    <p>Run only the tests that matter. Save CI time and compute costs with intelligent test selection.</p>
  </div>
</div>

## 🔄 The Killer Feature

**Swap agents without losing context.** SpecMem creates a unified, normalized, agent-agnostic context layer.

Switch from Kiro → SpecKit → Tessl → Claude Code → Cursor without rewriting spec files or losing project knowledge.

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

## 🚀 Quick Start

=== "CLI"

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

=== "Python"

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

## 🏢 About

**SpecMem** is developed by [Superagentic AI](https://super-agentic.ai) as part of the Kiroween Hackathon, December 2025.

<p align="center">
  <sub>Built with ❤️ for the AI coding agent community</sub>
</p>
