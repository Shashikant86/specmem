# Implementation Plan

- [x] 1. Implement OpenAI Embedding Provider
  - [x] 1.1 Create OpenAIEmbeddingProvider class
    - Implement `__init__` with API key handling (param or env var)
    - Implement `embed` method with OpenAI API call
    - Implement `dimension` and `model_name` properties
    - Add automatic batching for large text lists
    - _Requirements: 1.1, 1.4, 4.1, 4.2_
  - [x] 1.2 Write property test for embedding dimension consistency
    - **Property 3: Embedding dimension consistency**
    - **Validates: Requirements 3.3**
  - [x] 1.3 Write property test for batch result count
    - **Property 4: Batch result count matches input**
    - **Validates: Requirements 4.2**

- [x] 2. Implement Error Handling
  - [x] 2.1 Add error mapping for OpenAI exceptions
    - Map AuthenticationError to AUTH_ERROR
    - Map RateLimitError to RATE_LIMITED
    - Map APIConnectionError to NETWORK_ERROR
    - Wrap unknown errors with original details
    - _Requirements: 1.2, 1.3, 5.1, 5.2, 5.3, 5.4_
  - [x] 2.2 Write property test for error wrapping
    - **Property 5: Error wrapping preserves details**
    - **Validates: Requirements 1.3, 5.4**

- [x] 3. Update Factory Function
  - [x] 3.1 Extend get_embedding_provider factory
    - Add OpenAI provider to supported providers
    - Implement default model selection per provider
    - Add validation for unknown provider names
    - _Requirements: 2.1, 2.2, 3.2_
  - [x] 3.2 Write property test for factory provider type
    - **Property 1: Factory returns correct provider type**
    - **Validates: Requirements 1.1, 2.1**
  - [x] 3.3 Write property test for unknown provider error
    - **Property 2: Unknown provider raises error**
    - **Validates: Requirements 3.2**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Configuration Integration
  - [x] 5.1 Add EmbeddingConfig to configuration system
    - Add embedding provider, model, and api_key fields to SpecMemConfig
    - Implement serialization/deserialization for embedding settings
    - Support environment variable for API key (OPENAI_API_KEY)
    - _Requirements: 2.3, 2.4_
  - [x] 5.2 Write property test for configuration round-trip
    - **Property 6: Configuration round-trip**
    - **Validates: Requirements 2.4**
  - [x] 5.3 Write property test for environment variable API key
    - **Property 7: Environment variable API key usage**
    - **Validates: Requirements 2.3**

- [x] 6. Integration with MemoryBank
  - [x] 6.1 Update MemoryBank to use configurable embedding provider
    - Modify MemoryBank initialization to accept embedding config
    - Use factory to instantiate provider based on config
    - Ensure backward compatibility with existing code
    - _Requirements: 2.1, 2.2_

- [x] 7. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
