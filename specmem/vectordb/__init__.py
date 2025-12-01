"""Vector storage backends for SpecMem."""

from specmem.vectordb.base import (
    AuditEntry,
    GovernanceRules,
    QueryResult,
    VALID_TRANSITIONS,
    validate_transition,
    VectorStore,
)
from specmem.vectordb.embeddings import (
    EmbeddingProvider,
    LocalEmbeddingProvider,
    get_embedding_provider,
)
from specmem.vectordb.factory import get_vector_store, list_backends, SUPPORTED_BACKENDS
from specmem.vectordb.lancedb_store import LanceDBStore

__all__ = [
    # Base classes and types
    "VectorStore",
    "QueryResult",
    "AuditEntry",
    "GovernanceRules",
    "VALID_TRANSITIONS",
    "validate_transition",
    # Factory
    "get_vector_store",
    "list_backends",
    "SUPPORTED_BACKENDS",
    # Default store
    "LanceDBStore",
    # Embeddings
    "EmbeddingProvider",
    "LocalEmbeddingProvider",
    "get_embedding_provider",
]
