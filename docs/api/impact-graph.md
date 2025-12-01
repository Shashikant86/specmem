# Impact Graph

The Impact Graph tracks relationships between specifications, code files, and tests.

## Import

```python
from specmem.impact import ImpactGraph, ImpactBuilder
```

## ImpactGraph

### Constructor

```python
ImpactGraph(
    nodes: list[Node] | None = None,
    edges: list[Edge] | None = None,
)
```

### Methods

#### add_node

Add a node to the graph.

```python
def add_node(
    id: str,
    node_type: NodeType,
    metadata: dict | None = None,
) -> Node
```

##### Example

```python
graph = ImpactGraph()

# Add spec node
graph.add_node(
    id="auth-req-001",
    node_type=NodeType.SPEC,
    metadata={"path": "auth/requirements.md"}
)

# Add code node
graph.add_node(
    id="src/auth/service.py",
    node_type=NodeType.CODE,
)

# Add test node
graph.add_node(
    id="tests/test_auth.py",
    node_type=NodeType.TEST,
)
```

---

#### add_edge

Add an edge between nodes.

```python
def add_edge(
    from_id: str,
    to_id: str,
    edge_type: EdgeType,
    metadata: dict | None = None,
) -> Edge
```

##### Example

```python
# Spec implemented by code
graph.add_edge(
    from_id="auth-req-001",
    to_id="src/auth/service.py",
    edge_type=EdgeType.IMPLEMENTED_BY,
)

# Code tested by test
graph.add_edge(
    from_id="src/auth/service.py",
    to_id="tests/test_auth.py",
    edge_type=EdgeType.TESTED_BY,
)
```

---

#### get_impacted

Get nodes impacted by changes.

```python
def get_impacted(
    node_ids: list[str],
    depth: int = 2,
    direction: Direction = Direction.BOTH,
) -> list[Node]
```

##### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `node_ids` | `list[str]` | Starting nodes | required |
| `depth` | `int` | Traversal depth | `2` |
| `direction` | `Direction` | Traversal direction | `BOTH` |

##### Example

```python
# Get specs impacted by code change
impacted = graph.get_impacted(
    node_ids=["src/auth/service.py"],
    depth=2,
)

for node in impacted:
    print(f"{node.node_type}: {node.id}")
```

---

#### get_tests_for_files

Get tests that cover given files.

```python
def get_tests_for_files(
    files: list[str],
    depth: int = 2,
) -> list[str]
```

##### Example

```python
tests = graph.get_tests_for_files(["src/auth/service.py"])
# ["tests/test_auth.py::test_login", "tests/test_auth.py::test_logout"]
```

---

#### get_specs_for_files

Get specs related to given files.

```python
def get_specs_for_files(
    files: list[str],
    depth: int = 2,
) -> list[Node]
```

##### Example

```python
specs = graph.get_specs_for_files(["src/auth/service.py"])
```

---

#### get_neighbors

Get neighboring nodes.

```python
def get_neighbors(
    node_id: str,
    edge_type: EdgeType | None = None,
    direction: Direction = Direction.BOTH,
) -> list[Node]
```

##### Example

```python
# Get all neighbors
neighbors = graph.get_neighbors("auth-req-001")

# Get only implemented_by neighbors
code_files = graph.get_neighbors(
    "auth-req-001",
    edge_type=EdgeType.IMPLEMENTED_BY,
    direction=Direction.OUTGOING,
)
```

---

#### to_dict

Export graph as dictionary.

```python
def to_dict() -> dict
```

##### Example

```python
data = graph.to_dict()
# {"nodes": [...], "edges": [...]}
```

---

#### to_mermaid

Export graph as Mermaid diagram.

```python
def to_mermaid() -> str
```

##### Example

```python
mermaid = graph.to_mermaid()
print(mermaid)
```

Output:

```
graph TD
    auth-req-001[auth/requirements.md]
    src/auth/service.py[service.py]
    auth-req-001 -->|implemented_by| src/auth/service.py
```

---

#### to_dot

Export graph as DOT format.

```python
def to_dot() -> str
```

## ImpactBuilder

Build impact graphs from specifications and code.

```python
from specmem.impact import ImpactBuilder

builder = ImpactBuilder()

# Add specs
for spec in specs:
    builder.add_spec(spec)

# Analyze code relationships
builder.analyze_code_directory("src/")

# Analyze test relationships
builder.analyze_test_directory("tests/")

# Build the graph
graph = builder.build()
```

### Methods

#### add_spec

```python
def add_spec(spec: SpecBlock) -> None
```

#### analyze_code_directory

```python
def analyze_code_directory(
    path: str | Path,
    patterns: list[str] | None = None,
) -> None
```

#### analyze_test_directory

```python
def analyze_test_directory(
    path: str | Path,
    patterns: list[str] | None = None,
) -> None
```

#### build

```python
def build() -> ImpactGraph
```

## Types

### NodeType

```python
class NodeType(Enum):
    SPEC = "spec"
    CODE = "code"
    TEST = "test"
```

### EdgeType

```python
class EdgeType(Enum):
    IMPLEMENTS = "implements"
    IMPLEMENTED_BY = "implemented_by"
    DEPENDS_ON = "depends_on"
    TESTED_BY = "tested_by"
    COVERS = "covers"
    REFINES = "refines"
    CONFLICTS_WITH = "conflicts_with"
```

### Direction

```python
class Direction(Enum):
    INCOMING = "incoming"
    OUTGOING = "outgoing"
    BOTH = "both"
```

### Node

```python
@dataclass
class Node:
    id: str
    node_type: NodeType
    metadata: dict
```

### Edge

```python
@dataclass
class Edge:
    from_id: str
    to_id: str
    edge_type: EdgeType
    metadata: dict
```
