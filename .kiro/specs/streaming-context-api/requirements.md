# Requirements Document

## Introduction

This feature adds a Streaming Context API for real-time agent queries and context window optimization for per-agent context sizing. The API enables AI agents to query SpecMem dynamically during conversations, receiving relevant specifications streamed in real-time. Context window optimization ensures that the returned context fits within each agent's token limits while maximizing relevance.

## Glossary

- **Streaming Context API**: HTTP/WebSocket API that streams relevant specifications to agents in real-time
- **Context Window**: The maximum number of tokens an AI agent can process in a single request
- **Token Budget**: The allocated portion of context window for specification memory
- **Context Sizing**: Dynamic adjustment of returned content to fit within token limits
- **Relevance Score**: Numerical measure of how relevant a specification is to a query
- **Context Chunk**: A portion of specification content sized to fit token constraints
- **Agent Profile**: Configuration defining an agent's context window size and preferences
- **Priority Ranking**: Ordering of specifications by importance (pinned > high relevance > recency)

## Requirements

### Requirement 1

**User Story:** As an AI agent, I want to query SpecMem with a natural language question and receive relevant specifications streamed back, so that I can access project knowledge during conversations.

#### Acceptance Criteria

1. WHEN an agent sends a query to the streaming endpoint THEN the system SHALL return relevant SpecBlocks as a stream of JSON objects
2. WHEN streaming results THEN the system SHALL order results by relevance score descending
3. WHEN a query matches pinned specifications THEN the system SHALL include pinned blocks first regardless of relevance score
4. WHEN streaming completes THEN the system SHALL send a completion signal with total count and token usage

### Requirement 2

**User Story:** As an AI agent, I want to specify my context window size, so that SpecMem returns content that fits within my token limits.

#### Acceptance Criteria

1. WHEN an agent specifies a token budget THEN the system SHALL limit total response tokens to that budget
2. WHEN the token budget is exceeded THEN the system SHALL truncate lower-relevance content first
3. WHEN truncating content THEN the system SHALL preserve complete sentences and maintain coherence
4. WHEN no token budget is specified THEN the system SHALL use a default budget of 4000 tokens

### Requirement 3

**User Story:** As a developer, I want to configure agent profiles with different context window sizes, so that each agent type receives appropriately sized responses.

#### Acceptance Criteria

1. WHEN configuring an agent profile THEN the system SHALL allow specifying context window size in tokens
2. WHEN an agent profile is saved THEN the system SHALL persist the configuration
3. WHEN an agent queries with a profile name THEN the system SHALL apply that profile's settings
4. WHEN an unknown profile is specified THEN the system SHALL fall back to default settings with a warning

### Requirement 4

**User Story:** As an AI agent, I want to receive context in a format optimized for my consumption, so that I can efficiently process the specifications.

#### Acceptance Criteria

1. WHEN streaming context THEN the system SHALL support multiple output formats (JSON, Markdown, plain text)
2. WHEN returning Markdown format THEN the system SHALL structure content with headers and bullet points
3. WHEN returning JSON format THEN the system SHALL include metadata (id, type, source, relevance score)
4. WHEN returning plain text THEN the system SHALL concatenate specifications with clear separators

### Requirement 5

**User Story:** As an AI agent, I want to filter context by specification type, so that I receive only relevant categories of information.

#### Acceptance Criteria

1. WHEN an agent specifies type filters THEN the system SHALL return only matching specification types
2. WHEN multiple type filters are specified THEN the system SHALL return blocks matching any of the types
3. WHEN no type filter is specified THEN the system SHALL return all types
4. WHEN an invalid type filter is specified THEN the system SHALL ignore it and log a warning

### Requirement 6

**User Story:** As a developer, I want the streaming API to handle concurrent requests efficiently, so that multiple agents can query simultaneously.

#### Acceptance Criteria

1. WHEN multiple agents query simultaneously THEN the system SHALL handle requests concurrently without blocking
2. WHEN a request times out THEN the system SHALL return partial results with a timeout indicator
3. WHEN the system is under load THEN the system SHALL maintain response times under 500ms for initial results
4. WHEN a connection drops THEN the system SHALL clean up resources gracefully

### Requirement 7

**User Story:** As a developer, I want to estimate token counts accurately, so that context window optimization works correctly.

#### Acceptance Criteria

1. WHEN estimating tokens THEN the system SHALL use a tokenizer compatible with common LLM models
2. WHEN counting tokens THEN the system SHALL account for JSON/Markdown formatting overhead
3. WHEN the actual token count differs from estimate THEN the difference SHALL be within 5% tolerance
4. WHEN a custom tokenizer is configured THEN the system SHALL use that tokenizer for estimation

</content>
