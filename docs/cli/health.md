# specmem health

Display spec health scores and recommendations.

## Synopsis

```bash
specmem health [SPEC_NAME] [OPTIONS]
```

## Description

The `health` command analyzes specifications and calculates health scores based on:

- **Code references**: How many code files reference the spec
- **Freshness**: How recently the spec was modified
- **Usage**: How often the spec is queried

Health scores help identify specs that need attention or cleanup.

## Arguments

| Argument | Description |
|----------|-------------|
| `SPEC_NAME` | Optional specific spec to analyze |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--sort`, `-s` | `score` | Sort by: `score`, `name`, or `refs` |
| `--path`, `-p` | `.` | Repository path |

## Examples

### View all specs

```bash
specmem health
```

Shows summary and health scores for all specs.

### Analyze specific spec

```bash
specmem health auth-feature
```

Shows detailed health report for one spec.

### Sort by code references

```bash
specmem health --sort refs
```

Lists specs sorted by number of code references.

## Output

### Summary View

```
Spec Health Summary

Total Specs: 12
Orphaned: 2
Stale: 3
Average Score: 0.65
```

### Health Scores Table

| Spec | Score | Refs | Status | Recommendation |
|------|-------|------|--------|----------------|
| auth-feature | 0.85 | 5 | healthy | - |
| old-login | 0.20 | 0 | orphaned | Consider archiving |
| legacy-api | 0.35 | 1 | stale | Update or archive |

### Detailed Report

```
Health Report: auth-feature

Score: 0.85
Code References: 5
Last Modified: 2024-01-15
Query Count: 23
Status: Healthy

Recommendations:
  • No action needed
```

## Health Score Calculation

The health score (0.0 to 1.0) is calculated from:

| Factor | Points | Description |
|--------|--------|-------------|
| Code References | 0-40 | 10 points per reference, max 40 |
| Freshness | 0-30 | Based on days since modification |
| Usage | 0-30 | 5 points per query, max 30 |

### Freshness Scoring

| Days Since Modified | Points |
|--------------------|--------|
| ≤ 7 days | 30 |
| ≤ 30 days | 20 |
| ≤ 90 days | 10 |
| > 90 days | 0 |

## Status Indicators

| Status | Description |
|--------|-------------|
| **healthy** | Score ≥ 0.5, has code references, recently modified |
| **orphaned** | No code references in the codebase |
| **stale** | Not modified within threshold (default: 90 days) |

## Recommendations

Based on health analysis, the command suggests:

- **Archive**: For orphaned specs with no code references
- **Update**: For stale specs that may need refresh
- **Review**: For specs with low query counts
- **No action**: For healthy, well-maintained specs

## See Also

- [specmem prune](prune.md) - Archive or delete specs
- [specmem compress](compress.md) - Compress verbose specs
