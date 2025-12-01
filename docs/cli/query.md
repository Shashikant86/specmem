# specmem query

Search specifications using semantic search.

## Usage

```bash
specmem query [OPTIONS] QUERY
```

## Description

Performs semantic search across all indexed specifications using vector similarity.

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `QUERY` | Search query (natural language) | Yes |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--top-k, -k INT` | Number of results | `5` |
| `--type TYPE` | Filter by spec type | all |
| `--lifecycle LIFECYCLE` | Filter by lifecycle | `active` |
| `--threshold FLOAT` | Minimum similarity score | `0.5` |
| `--format FORMAT` | Output format (text, json, markdown) | `text` |
| `--verbose, -v` | Show detailed output | `false` |

## Examples

### Basic Query

```bash
specmem query "authentication requirements"
```

Output:

```
🔍 Query: "authentication requirements"

📄 auth/requirements.md (score: 0.92)
   User authentication with JWT tokens and refresh mechanism
   Type: requirement | Priority: critical | Lifecycle: active

📄 api-security/design.md (score: 0.87)
   API security layer with rate limiting and auth middleware
   Type: design | Priority: high | Lifecycle: active

📄 session-management/tasks.md (score: 0.81)
   Session handling and token refresh implementation
   Type: task | Priority: medium | Lifecycle: active
```

### More Results

```bash
specmem query "user management" --top-k 10
```

### Filter by Type

```bash
specmem query "security" --type requirement
```

### Filter by Lifecycle

```bash
specmem query "api" --lifecycle deprecated
```

### Higher Threshold

```bash
specmem query "database schema" --threshold 0.8
```

### JSON Output

```bash
specmem query "authentication" --format json
```

Output:

```json
{
  "query": "authentication",
  "results": [
    {
      "id": "auth-req-001",
      "path": "auth/requirements.md",
      "score": 0.92,
      "title": "User Authentication",
      "summary": "User authentication with JWT tokens",
      "type": "requirement",
      "lifecycle": "active",
      "priority": "critical"
    }
  ]
}
```

### Markdown Output

```bash
specmem query "api design" --format markdown
```

Output:

```markdown
## Search Results: "api design"

### 1. api/design.md (0.94)
**Type:** design | **Priority:** high

API design with RESTful endpoints and OpenAPI specification.

---

### 2. gateway/design.md (0.88)
**Type:** design | **Priority:** medium

API gateway design with routing and load balancing.
```

## Spec Types

| Type | Description |
|------|-------------|
| `requirement` | What the system should do |
| `design` | How the system works |
| `task` | Implementation steps |
| `constraint` | Limitations and rules |

## Lifecycle Values

| Lifecycle | Description |
|-----------|-------------|
| `active` | Current, in-use spec |
| `deprecated` | Being phased out |
| `legacy` | Old but still referenced |
| `obsolete` | No longer relevant |

## See Also

- [Core Concepts](../user-guide/concepts.md)
- [specmem impact](impact.md)
