# 📚 User Guide

Learn how to use SpecMem effectively in your projects.

## Overview

SpecMem provides a comprehensive toolkit for managing specifications and context for AI coding agents. This guide covers all major features.

## Core Features

<div class="feature-grid">
  <div class="feature-card">
    <h3><span class="emoji">🧠</span> Core Concepts</h3>
    <p>Understand SpecIR, memory types, and the architecture.</p>
    <a href="concepts/" class="md-button">Learn →</a>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">🔌</span> Adapters</h3>
    <p>Parse specs from Kiro, Cursor, Claude, and more.</p>
    <a href="adapters/" class="md-button">Explore →</a>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">📊</span> SpecImpact Graph</h3>
    <p>Understand relationships between specs, code, and tests.</p>
    <a href="specimpact/" class="md-button">Discover →</a>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">⏱️</span> SpecDiff Timeline</h3>
    <p>Track spec evolution and detect drift over time.</p>
    <a href="specdiff/" class="md-button">Track →</a>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">✅</span> SpecValidator</h3>
    <p>Ensure specification quality and consistency.</p>
    <a href="validator/" class="md-button">Validate →</a>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">🎯</span> Selective Testing</h3>
    <p>Run only the tests that matter for your changes.</p>
    <a href="selective-testing/" class="md-button">Optimize →</a>
  </div>
</div>

## Workflow

```mermaid
graph TD
    A[Write Specs] --> B[specmem scan]
    B --> C[specmem build]
    C --> D[Agent Context Ready]
    D --> E{Code Changes?}
    E -->|Yes| F[specmem impact]
    F --> G[Selective Tests]
    E -->|No| H[specmem query]
    H --> I[Get Context]
```

## Best Practices

!!! tip "Keep Specs Updated"
    Run `specmem scan` after updating specifications to keep the index fresh.

!!! tip "Use Impact Analysis"
    Before committing, run `specmem impact` to understand the scope of your changes.

!!! tip "Validate Regularly"
    Run `specmem validate` in CI to catch spec issues early.

!!! tip "Leverage the Web UI"
    Use `specmem serve` for visual exploration of your spec graph.
