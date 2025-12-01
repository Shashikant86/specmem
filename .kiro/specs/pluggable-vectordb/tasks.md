# Implementation Plan

- [x] 1. Enhance VectorStore Base Interface
  - [x] 1.1 Update VectorStore abstract class
    - Add include_deprecated and include_legacy parameters to query method
    - Add governance_rules parameter to query method
    - Add get_audit_log method for obsolete block retrieval
    - Add transition validation to update_status
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.2, 4.3, 5.1, 5.2_
  - [x] 1.2 Implement GovernanceRules dataclass
    - Create dataclass with max_age_days, exclude_types, exclude_sources, min_importance
    - Add validation for rule values
    - _Requirements: 9.1, 9.2, 9.3_
  - [x] 1.3 Implement AuditEntry dataclass
    - Create dataclass for obsolete block records
    - Include block data, timestamps, reason, transition history
    - _Requirements: 6.1, 6.3_

- [x] 2. Implement Memory Lifecycle State Machine
  - [x] 2.1 Add LifecycleError exception class
    - Create exception with from_status, to_status, block_id details
    - Include valid_transitions in error details
    - _Requirements: 7.4_
  - [x] 2.2 Implement lifecycle transition validation
    - Define VALID_TRANSITIONS mapping
    - Create validate_transition function
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [x] 2.3 Write property test for valid transitions
    - **Property 7: Valid lifecycle transitions succeed**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.5**
  - [x] 2.4 Write property test for invalid transitions
    - **Property 8: Invalid lifecycle transitions fail**
    - **Validates: Requirements 7.4**

- [x] 3. Update LanceDBStore with Lifecycle Support
  - [x] 3.1 Add lifecycle filtering to LanceDB queries
    - Filter deprecated blocks when include_deprecated=False
    - Filter legacy blocks when include_legacy=False
    - Never return obsolete blocks
    - _Requirements: 4.3, 5.1, 6.2_
  - [x] 3.2 Implement audit log for LanceDB
    - Create separate audit table for obsolete blocks
    - Move blocks to audit on obsolete transition
    - _Requirements: 6.1, 6.3_
  - [x] 3.3 Write property test for deprecated exclusion
    - **Property 4: Deprecated blocks excluded by default**
    - **Validates: Requirements 4.3**
  - [x] 3.4 Write property test for legacy exclusion
    - **Property 5: Legacy blocks excluded by default**
    - **Validates: Requirements 5.1**
  - [x] 3.5 Write property test for obsolete never returned
    - **Property 6: Obsolete blocks never returned**
    - **Validates: Requirements 6.2**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement ChromaDB Backend
  - [x] 5.1 Create ChromaDBStore class
    - Implement initialize with chromadb>=1.3.5
    - Implement store method with ChromaDB collection
    - Implement query with lifecycle filtering
    - Implement update_status and get_audit_log
    - _Requirements: 1.2, 3.1, 3.2_
  - [x] 5.2 Write property test for ChromaDB interface consistency
    - **Property 3: Interface consistency across backends**
    - **Validates: Requirements 3.1, 3.2**

- [x] 6. Implement Qdrant Backend
  - [x] 6.1 Create QdrantStore class
    - Implement initialize with qdrant-client>=1.16.1
    - Support both local and cloud modes
    - Implement store, query, update_status, get_audit_log
    - _Requirements: 1.3, 3.1, 3.2_

- [x] 7. Implement Weaviate Backend
  - [x] 7.1 Create WeaviateStore class
    - Implement initialize with weaviate-client>=4.0.0
    - Support cloud connection with API key
    - Implement store, query, update_status, get_audit_log
    - _Requirements: 1.4, 3.1, 3.2_

- [x] 8. Implement Milvus Backend
  - [x] 8.1 Create MilvusStore class
    - Implement initialize with pymilvus>=2.6.6
    - Support Milvus Lite for local mode
    - Implement store, query, update_status, get_audit_log
    - _Requirements: 1.5, 3.1, 3.2_

- [x] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement AgentVectorDB Backend
  - [x] 10.1 Create enhanced AgentVectorDBStore class
    - Implement initialize with agentvectordb>=0.0.3
    - Support namespace isolation for projects
    - Implement importance scoring integration
    - Implement memory decay for time-based relevance
    - _Requirements: 1.6, 8.1, 8.2, 8.4_
  - [x] 10.2 Implement prune_memories method
    - Support max_age_seconds and min_importance filters
    - Integrate with AgentVectorDB's prune_memories
    - _Requirements: 8.4_
  - [x] 10.3 Write property test for importance scoring
    - **Property 11: AgentVectorDB importance scoring**
    - **Validates: Requirements 8.2**

- [x] 11. Implement VectorStore Factory
  - [x] 11.1 Create get_vector_store factory function
    - Support all backend names in SUPPORTED_BACKENDS
    - Return correct store class for each backend
    - Raise VectorStoreError for unknown backends
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  - [x] 11.2 Write property test for factory returns correct type
    - **Property 1: Factory returns correct backend type**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6**
  - [x] 11.3 Write property test for unknown backend error
    - **Property 2: Unknown backend raises error**
    - **Validates: Requirements 2.3**

- [x] 12. Implement Governance Rules
  - [x] 12.1 Add governance rule filtering to all backends
    - Apply max_age_days filter
    - Apply exclude_types filter
    - Apply exclude_sources filter
    - Apply min_importance filter (AgentVectorDB)
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - [x] 12.2 Write property test for governance filtering
    - **Property 10: Governance rules filter results**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4**
  - [x] 12.3 Write property test for audit log
    - **Property 9: Audit log contains obsolete blocks**
    - **Validates: Requirements 6.1, 6.3**

- [x] 13. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. CLI Integration
  - [x] 14.1 Implement `specmem vector-backend` command
    - Display current backend when no argument
    - Update config when backend name provided
    - Show error for unsupported backends
    - Warn about data migration
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x] 14.2 Write unit tests for vector-backend command
    - Test display current backend
    - Test update backend
    - Test error handling
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 15. Update pyproject.toml with Optional Dependencies
  - [x] 15.1 Add optional dependency groups
    - Add chroma extra with chromadb>=1.3.5
    - Add qdrant extra with qdrant-client>=1.16.1
    - Add weaviate extra with weaviate-client>=4.0.0
    - Add milvus extra with pymilvus>=2.6.6
    - Update agentvectordb extra with >=0.0.3
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 16. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
