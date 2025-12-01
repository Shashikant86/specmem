# Requirements Document

## Introduction

This feature extends SpecMem's vector storage layer to support multiple vector database backends (ChromaDB, Qdrant, Weaviate, Milvus) alongside the existing LanceDB, with deep integration for AgentVectorDB. Additionally, it enhances the memory lifecycle management system with advanced states (active, deprecated, legacy, obsolete) and retrieval governance rules that enable intelligent agent recall.

## Glossary

- **VectorStore**: Abstract interface for vector database operations (store, query, update, delete)
- **LanceDB**: Default local vector database using DiskANN-based search
- **ChromaDB**: Open-source embedding database for AI applications
- **Qdrant**: High-performance vector similarity search engine
- **Weaviate**: Cloud-native vector database with GraphQL API
- **Milvus**: Scalable vector database for AI applications
- **AgentVectorDB**: Superagentic AI's agent-optimized memory system
- **Memory Lifecycle**: State machine governing spec block visibility (active → deprecated → legacy → obsolete)
- **Retrieval Governance**: Rules controlling which blocks are returned based on lifecycle state
- **Audit Log**: Permanent record of obsolete blocks for compliance and history

## Requirements

### Requirement 1

**User Story:** As a developer, I want to choose my preferred vector database backend, so that I can use the storage solution that best fits my infrastructure.

#### Acceptance Criteria

1. WHEN a user configures the vector backend as "lancedb" THEN the system SHALL use LanceDB for vector storage
2. WHEN a user configures the vector backend as "chroma" THEN the system SHALL use ChromaDB for vector storage
3. WHEN a user configures the vector backend as "qdrant" THEN the system SHALL use Qdrant for vector storage
4. WHEN a user configures the vector backend as "weaviate" THEN the system SHALL use Weaviate for vector storage
5. WHEN a user configures the vector backend as "milvus" THEN the system SHALL use Milvus for vector storage
6. WHEN a user configures the vector backend as "agentvectordb" THEN the system SHALL use AgentVectorDB for vector storage

### Requirement 2

**User Story:** As a developer, I want a CLI command to switch vector backends, so that I can easily migrate between storage solutions.

#### Acceptance Criteria

1. WHEN a user runs `specmem vector-backend <name>` THEN the system SHALL update the configuration to use the specified backend
2. WHEN a user runs `specmem vector-backend` without arguments THEN the system SHALL display the current backend
3. WHEN a user specifies an unsupported backend THEN the system SHALL display an error with supported options
4. WHEN switching backends THEN the system SHALL warn about data migration requirements

### Requirement 3

**User Story:** As a developer, I want all vector backends to implement the same interface, so that my code works consistently regardless of backend choice.

#### Acceptance Criteria

1. WHEN storing blocks THEN all backends SHALL accept the same SpecBlock format and embeddings
2. WHEN querying blocks THEN all backends SHALL return QueryResult objects with block, score, and distance
3. WHEN updating status THEN all backends SHALL support the same lifecycle state transitions
4. WHEN getting pinned blocks THEN all backends SHALL return blocks with pinned=True

### Requirement 4

**User Story:** As a developer, I want to mark specifications as deprecated, so that agents are warned but can still access them.

#### Acceptance Criteria

1. WHEN a block status is set to "deprecated" THEN the system SHALL include a deprecation warning in query results
2. WHEN querying with include_deprecated=True THEN the system SHALL return deprecated blocks with lower ranking
3. WHEN querying with include_deprecated=False THEN the system SHALL exclude deprecated blocks from results
4. WHEN a block is deprecated THEN the system SHALL record the deprecation timestamp and reason

### Requirement 5

**User Story:** As a developer, I want to mark specifications as legacy, so that they are never retrieved unless explicitly requested.

#### Acceptance Criteria

1. WHEN a block status is set to "legacy" THEN the system SHALL exclude the block from normal queries
2. WHEN querying with include_legacy=True THEN the system SHALL return legacy blocks
3. WHEN a block transitions to legacy THEN the system SHALL record the transition timestamp
4. WHEN listing all blocks THEN the system SHALL indicate legacy status clearly

### Requirement 6

**User Story:** As a developer, I want to mark specifications as obsolete, so that they are archived but never retrieved.

#### Acceptance Criteria

1. WHEN a block status is set to "obsolete" THEN the system SHALL move the block to the audit log
2. WHEN querying THEN the system SHALL never return obsolete blocks regardless of flags
3. WHEN a block becomes obsolete THEN the system SHALL record full block data in the audit log
4. WHEN accessing the audit log THEN the system SHALL provide read-only access to obsolete blocks

### Requirement 7

**User Story:** As a developer, I want lifecycle state transitions to be validated, so that blocks follow the correct progression.

#### Acceptance Criteria

1. WHEN transitioning from active to deprecated THEN the system SHALL allow the transition
2. WHEN transitioning from deprecated to legacy THEN the system SHALL allow the transition
3. WHEN transitioning from legacy to obsolete THEN the system SHALL allow the transition
4. WHEN attempting an invalid transition THEN the system SHALL raise a LifecycleError with details
5. WHEN transitioning states THEN the system SHALL record the transition in block metadata

### Requirement 8

**User Story:** As a developer, I want AgentVectorDB integration with advanced memory features, so that I can leverage agent-optimized storage.

#### Acceptance Criteria

1. WHEN using AgentVectorDB THEN the system SHALL support memory namespaces for project isolation
2. WHEN using AgentVectorDB THEN the system SHALL support memory importance scoring
3. WHEN using AgentVectorDB THEN the system SHALL support automatic memory consolidation
4. WHEN using AgentVectorDB THEN the system SHALL support memory decay for time-based relevance

### Requirement 9

**User Story:** As a developer, I want to configure retrieval governance rules, so that I can control what agents can access.

#### Acceptance Criteria

1. WHEN configuring retrieval rules THEN the system SHALL support max_age filters for time-based exclusion
2. WHEN configuring retrieval rules THEN the system SHALL support type filters for spec type exclusion
3. WHEN configuring retrieval rules THEN the system SHALL support source filters for file-based exclusion
4. WHEN querying THEN the system SHALL apply all configured governance rules before returning results
