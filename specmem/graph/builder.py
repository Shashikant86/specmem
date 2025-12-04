"""Impact Graph Builder implementation."""

import logging
from pathlib import Path

from specmem.graph.models import (
    EdgeType,
    GraphEdge,
    GraphNode,
    ImpactGraphData,
    NodeType,
)


logger = logging.getLogger(__name__)


class ImpactGraphBuilder:
    """Builds impact graph data for visualization.

    Creates a graph showing relationships between specs, code files, and tests.
    """

    def __init__(self, workspace_path: Path):
        """Initialize the graph builder.

        Args:
            workspace_path: Path to the workspace root
        """
        self.workspace_path = workspace_path

    def build(self) -> ImpactGraphData:
        """Build the complete impact graph.

        Returns:
            ImpactGraphData with all nodes and edges
        """
        nodes: list[GraphNode] = []
        edges: list[GraphEdge] = []

        # Add feature nodes
        feature_nodes = self._build_feature_nodes()
        nodes.extend(feature_nodes)

        # Add spec nodes
        spec_nodes = self._build_spec_nodes()
        nodes.extend(spec_nodes)

        # Add code nodes (from impact graph if available)
        code_nodes = self._build_code_nodes()
        nodes.extend(code_nodes)

        # Add test nodes
        test_nodes = self._build_test_nodes()
        nodes.extend(test_nodes)

        # Build edges
        edges.extend(self._build_feature_spec_edges(feature_nodes, spec_nodes))
        edges.extend(self._build_spec_code_edges(spec_nodes, code_nodes))
        edges.extend(self._build_code_test_edges(code_nodes, test_nodes))

        return ImpactGraphData(nodes=nodes, edges=edges)

    def _build_feature_nodes(self) -> list[GraphNode]:
        """Build nodes for features (spec directories)."""
        nodes = []
        specs_dir = self.workspace_path / ".kiro" / "specs"

        if not specs_dir.exists():
            return nodes

        for feature_dir in specs_dir.iterdir():
            if not feature_dir.is_dir():
                continue

            node = GraphNode(
                id=f"feature:{feature_dir.name}",
                type=NodeType.FEATURE,
                label=feature_dir.name.replace("-", " ").title(),
                metadata={
                    "path": str(feature_dir.relative_to(self.workspace_path)),
                    "has_requirements": (feature_dir / "requirements.md").exists(),
                    "has_design": (feature_dir / "design.md").exists(),
                    "has_tasks": (feature_dir / "tasks.md").exists(),
                },
            )
            nodes.append(node)

        return nodes

    def _build_spec_nodes(self) -> list[GraphNode]:
        """Build nodes for individual spec files."""
        nodes = []
        specs_dir = self.workspace_path / ".kiro" / "specs"

        if not specs_dir.exists():
            return nodes

        for spec_file in specs_dir.rglob("*.md"):
            # Get spec type from filename
            spec_type = spec_file.stem  # requirements, design, tasks
            feature_name = spec_file.parent.name

            node = GraphNode(
                id=f"spec:{feature_name}/{spec_type}",
                type=NodeType.SPEC,
                label=f"{feature_name}: {spec_type}",
                metadata={
                    "path": str(spec_file.relative_to(self.workspace_path)),
                    "feature": feature_name,
                    "spec_type": spec_type,
                },
            )
            nodes.append(node)

        return nodes

    def _build_code_nodes(self) -> list[GraphNode]:
        """Build nodes for code files from impact graph."""
        nodes = []

        try:
            from specmem.impact.graph import SpecImpactGraph

            graph = SpecImpactGraph(self.workspace_path)
            graph.load()

            # Get unique code files from the impact graph
            code_files = set()
            for spec_id in graph.spec_to_code:
                code_files.update(graph.spec_to_code[spec_id])

            for code_path in code_files:
                path = Path(code_path)
                node = GraphNode(
                    id=f"code:{code_path}",
                    type=NodeType.CODE,
                    label=path.name,
                    metadata={
                        "path": code_path,
                        "extension": path.suffix,
                    },
                )
                nodes.append(node)

        except Exception as e:
            logger.debug(f"Could not load impact graph: {e}")

        return nodes

    def _build_test_nodes(self) -> list[GraphNode]:
        """Build nodes for test files."""
        nodes = []
        tests_dir = self.workspace_path / "tests"

        if not tests_dir.exists():
            return nodes

        for test_file in tests_dir.rglob("test_*.py"):
            rel_path = str(test_file.relative_to(self.workspace_path))
            node = GraphNode(
                id=f"test:{rel_path}",
                type=NodeType.TEST,
                label=test_file.stem,
                metadata={
                    "path": rel_path,
                },
            )
            nodes.append(node)

        return nodes

    def _build_feature_spec_edges(
        self, features: list[GraphNode], specs: list[GraphNode]
    ) -> list[GraphEdge]:
        """Build edges from features to their specs."""
        edges = []

        for spec in specs:
            feature_name = spec.metadata.get("feature")
            if feature_name:
                feature_id = f"feature:{feature_name}"
                # Check if feature exists
                if any(f.id == feature_id for f in features):
                    edge = GraphEdge(
                        source=feature_id,
                        target=spec.id,
                        relationship=EdgeType.CONTAINS,
                    )
                    edges.append(edge)

        return edges

    def _build_spec_code_edges(
        self, specs: list[GraphNode], code_nodes: list[GraphNode]
    ) -> list[GraphEdge]:
        """Build edges from specs to code files."""
        edges = []

        try:
            from specmem.impact.graph import SpecImpactGraph

            graph = SpecImpactGraph(self.workspace_path)
            graph.load()

            for spec in specs:
                spec_path = spec.metadata.get("path", "")
                if spec_path in graph.spec_to_code:
                    for code_path in graph.spec_to_code[spec_path]:
                        code_id = f"code:{code_path}"
                        if any(c.id == code_id for c in code_nodes):
                            edge = GraphEdge(
                                source=spec.id,
                                target=code_id,
                                relationship=EdgeType.IMPLEMENTS,
                            )
                            edges.append(edge)

        except Exception as e:
            logger.debug(f"Could not build spec-code edges: {e}")

        return edges

    def _build_code_test_edges(
        self, code_nodes: list[GraphNode], test_nodes: list[GraphNode]
    ) -> list[GraphEdge]:
        """Build edges from code files to test files."""
        edges = []

        # Simple heuristic: match test files to code files by name
        for code in code_nodes:
            code_name = Path(code.metadata.get("path", "")).stem

            for test in test_nodes:
                test_name = test.metadata.get("path", "")
                # Check if test name contains code name
                if code_name in test_name:
                    edge = GraphEdge(
                        source=code.id,
                        target=test.id,
                        relationship=EdgeType.TESTED_BY,
                    )
                    edges.append(edge)

        return edges
