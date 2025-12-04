# SpecMem Power

Unified agent memory for spec-driven development. SpecMem provides persistent memory and context awareness for AI coding agents.

## Overview

SpecMem creates a unified, normalized, agent-agnostic context layer for your project's specifications. It enables:

- **Persistent Memory**: Specs and context persist across sessions
- **Impact Analysis**: Know which specs are affected by code changes
- **Spec Coverage**: Analyze gaps between acceptance criteria and tests
- **Validation**: Check specifications for quality issues

## Tools

### specmem_query

Query specifications by natural language.

```
specmem_query(query: "authentication requirements", top_k: 10)
```

Returns relevant specifications matching your query.

### specmem_impact

Get specs and tests affected by file changes.

```
specmem_impact(files: ["src/auth.py", "src/user.py"], depth: 2)
```

Returns affected specifications and tests to run.

### specmem_context

Get optimized context bundle for files.

```
specmem_context(files: ["src/auth.py"], token_budget: 4000)
```

Returns specs, designs, and TL;DR within token budget.

### specmem_tldr

Get TL;DR summary of key specifications.

```
specmem_tldr(token_budget: 500)
```

Returns concise summary prioritizing pinned specs.

### specmem_coverage

Get spec coverage analysis.

```
specmem_coverage(feature: "authentication")
```

Returns coverage data and test suggestions.

### specmem_validate

Validate specifications for quality issues.

```
specmem_validate(spec_id: "auth.login")
```

Returns validation errors and warnings.

## Getting Started

1. Install SpecMem: `pip install specmem`
2. Initialize in your project: `specmem init`
3. Scan specifications: `specmem scan`
4. Build memory: `specmem build`

## Keywords

specs, memory, context, impact, coverage, testing, validation, spec-driven
