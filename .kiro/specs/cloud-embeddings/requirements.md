# Requirements Document

## Introduction

This feature extends SpecMem's embedding system to support cloud-based embedding providers (OpenAI, Gemini, Cohere, etc.) in addition to the existing local SentenceTransformers implementation. This enables users to leverage higher-quality cloud embeddings while maintaining backward compatibility with local embeddings for offline use.

## Glossary

- **EmbeddingProvider**: Abstract interface for generating vector embeddings from text
- **LocalEmbeddingProvider**: Implementation using SentenceTransformers for local, offline embedding generation
- **CloudEmbeddingProvider**: Implementation using cloud APIs (OpenAI, Gemini, etc.) for embedding generation
- **EmbeddingFactory**: Factory pattern component for instantiating the appropriate provider based on configuration
- **API Key**: Authentication credential required for cloud provider access
- **Embedding Dimension**: The size of the vector produced by an embedding model

## Requirements

### Requirement 1

**User Story:** As a developer, I want to use OpenAI embeddings for my memory bank, so that I can leverage higher-quality embeddings for better semantic search.

#### Acceptance Criteria

1. WHEN a user configures the embedding provider as "openai" THEN the system SHALL use the OpenAI API to generate embeddings
2. WHEN the OpenAI API key is not provided THEN the system SHALL raise an EmbeddingError with code "MISSING_API_KEY"
3. WHEN the OpenAI API returns an error THEN the system SHALL wrap the error in an EmbeddingError with appropriate details
4. WHEN embedding text with OpenAI THEN the system SHALL use the text-embedding-3-small model by default

### Requirement 2

**User Story:** As a developer, I want to configure embedding providers through the config system, so that I can easily switch between local and cloud embeddings.

#### Acceptance Criteria

1. WHEN a user specifies an embedding provider in configuration THEN the system SHALL instantiate the corresponding provider
2. WHEN no embedding provider is specified THEN the system SHALL default to the local provider
3. WHEN a user provides an API key via environment variable THEN the system SHALL use that key for cloud providers
4. WHEN serializing configuration THEN the system SHALL persist the embedding provider settings

### Requirement 3

**User Story:** As a developer, I want the embedding interface to be extensible, so that new cloud providers can be added without modifying existing code.

#### Acceptance Criteria

1. WHEN adding a new embedding provider THEN the developer SHALL only need to implement the EmbeddingProvider interface
2. WHEN the factory receives an unknown provider name THEN the system SHALL raise an EmbeddingError with code "UNSUPPORTED_PROVIDER"
3. WHEN embedding text THEN all providers SHALL return vectors of consistent dimension for the same model

### Requirement 4

**User Story:** As a developer, I want batch embedding support for cloud providers, so that I can efficiently embed multiple texts in a single API call.

#### Acceptance Criteria

1. WHEN embedding multiple texts THEN the system SHALL batch them into a single API call where supported
2. WHEN a batch exceeds the provider's limit THEN the system SHALL split into multiple calls automatically
3. WHEN any text in a batch fails THEN the system SHALL raise an EmbeddingError with details about the failure

### Requirement 5

**User Story:** As a developer, I want proper error handling for cloud embedding failures, so that I can diagnose and recover from issues.

#### Acceptance Criteria

1. WHEN a network error occurs THEN the system SHALL raise an EmbeddingError with code "NETWORK_ERROR"
2. WHEN rate limiting occurs THEN the system SHALL raise an EmbeddingError with code "RATE_LIMITED"
3. WHEN authentication fails THEN the system SHALL raise an EmbeddingError with code "AUTH_ERROR"
4. WHEN an unknown error occurs THEN the system SHALL include the original error details in the EmbeddingError
