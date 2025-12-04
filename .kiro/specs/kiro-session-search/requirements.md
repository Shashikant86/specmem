# Requirements Document

## Introduction

This feature extends the existing Kiro adapter in SpecMem to support indexing and searching Kiro agent coding sessions. This enables developers to search through their past conversations with Kiro, find solutions to similar problems, and link sessions to specifications.

**Security Note:** This feature accesses Kiro session data stored outside the project directory (in the user's Application Support folder). This is an opt-in, admin-level feature that requires explicit user consent.

## Glossary

- **Session**: A conversation thread between a user and the Kiro agent
- **Session History**: The list of messages (user and assistant) in a session
- **Workspace Session**: A session associated with a specific project/workspace
- **Session Index**: The `sessions.json` file that lists all sessions for a workspace
- **Message**: A single user or assistant turn in a session conversation
- **Admin Feature**: A feature that requires explicit opt-in and accesses data outside the project directory

## Requirements

### Requirement 0

**User Story:** As a developer, I want the option to auto-discover my Kiro session directory with my permission, so that I don't have to manually find and enter the path.

#### Acceptance Criteria

1. WHEN SpecMem is initialized THEN the system SHALL NOT access any session data by default
2. WHEN a user runs `specmem sessions config` without a path THEN the system SHALL ask for permission to auto-discover the Kiro sessions directory
3. WHEN the user grants permission THEN the system SHALL search for the Kiro sessions directory in platform-specific default locations
4. WHEN auto-discovery finds a valid sessions directory THEN the system SHALL display the found path and ask for confirmation before storing
5. WHEN the user confirms the discovered path THEN the system SHALL store the path in `.specmem.toml` configuration
6. IF auto-discovery fails to find a valid directory THEN the system SHALL display an error with manual path instructions
7. WHEN a user runs `specmem sessions config --path <directory>` THEN the system SHALL skip auto-discovery and use the provided path directly
8. WHEN enabling session search THEN the system SHALL validate that the path exists and contains valid session data
9. WHEN session search runs THEN the system SHALL only access the configured directory path and nothing else
10. IF session search is not enabled THEN the system SHALL return an error with instructions when session commands are used
11. WHEN displaying help for session commands THEN the system SHALL show example paths for common platforms (macOS, Linux, Windows)

### Requirement 0.1

**User Story:** As a developer, I want the auto-discovery to check platform-specific default locations, so that it works across macOS, Linux, and Windows.

#### Acceptance Criteria

1. WHEN auto-discovery runs on macOS THEN the system SHALL check `~/Library/Application Support/Kiro/workspace-sessions/`
2. WHEN auto-discovery runs on Linux THEN the system SHALL check `~/.config/Kiro/workspace-sessions/` and `~/.local/share/Kiro/workspace-sessions/`
3. WHEN auto-discovery runs on Windows THEN the system SHALL check `%APPDATA%/Kiro/workspace-sessions/`
4. WHEN multiple valid directories are found THEN the system SHALL present all options and let the user choose
5. WHEN validating a discovered directory THEN the system SHALL check for the presence of session JSON files
6. IF no valid directory is found in default locations THEN the system SHALL suggest the user provide the path manually

### Requirement 1

**User Story:** As a developer, I want to discover and index Kiro sessions from the directory I provided, so that I can search through my past coding conversations.

#### Acceptance Criteria

1. WHEN session search is enabled THEN the system SHALL only scan the user-provided sessions directory path
2. WHEN sessions are detected THEN the system SHALL parse the workspace-sessions directory structure (base64-encoded workspace paths)
3. WHEN a sessions.json index file exists THEN the system SHALL extract session metadata (sessionId, title, dateCreated, workspaceDirectory)
4. WHEN individual session JSON files exist THEN the system SHALL parse the history array containing messages
5. IF the provided directory does not exist THEN the system SHALL return an error indicating the path is invalid
6. WHERE a workspace filter is specified THEN the system SHALL only index sessions for the current project directory

### Requirement 2

**User Story:** As a developer, I want to search through my Kiro session history using natural language queries, so that I can find relevant past conversations.

#### Acceptance Criteria

1. WHEN a user searches for sessions THEN the system SHALL perform semantic search across all indexed session messages
2. WHEN search results are returned THEN the system SHALL include session metadata (title, workspace, date) with each result
3. WHEN search results are returned THEN the system SHALL rank results by relevance score
4. WHERE a time filter is specified THEN the system SHALL filter sessions by dateCreated
5. WHERE a workspace filter is specified THEN the system SHALL filter sessions by workspaceDirectory

### Requirement 3

**User Story:** As a developer, I want to view the full conversation history of a specific session, so that I can understand the complete context.

#### Acceptance Criteria

1. WHEN a user requests a session by ID THEN the system SHALL return the complete message history
2. WHEN displaying messages THEN the system SHALL preserve the role (user/assistant) for each message
3. WHEN displaying messages THEN the system SHALL flatten content arrays into readable text
4. WHEN tool calls are present in messages THEN the system SHALL include tool name and description in the flattened content

### Requirement 4

**User Story:** As a developer, I want sessions to be linked to relevant specs, so that I can understand which specifications were discussed in each session.

#### Acceptance Criteria

1. WHEN indexing a session THEN the system SHALL detect references to spec files mentioned in the conversation
2. WHEN a session references a spec THEN the system SHALL create a bidirectional link between session and spec
3. WHEN querying specs THEN the system SHALL optionally include related sessions in the results
4. WHEN querying sessions THEN the system SHALL include linked spec IDs in the session metadata

### Requirement 5

**User Story:** As a developer, I want a CLI command to configure, search, and view Kiro sessions, so that I can quickly find past conversations.

#### Acceptance Criteria

1. WHEN a user runs `specmem sessions config` without arguments THEN the system SHALL prompt for permission to auto-discover the sessions directory
2. WHEN a user runs `specmem sessions config --path <directory>` THEN the system SHALL skip auto-discovery and use the provided path directly
3. WHEN a user runs `specmem sessions config --auto` THEN the system SHALL auto-discover without prompting (assumes permission granted)
4. WHEN a user runs `specmem sessions search <query>` AND session search is configured THEN the system SHALL return matching sessions
5. WHEN a user runs `specmem sessions list` AND session search is configured THEN the system SHALL display recent sessions with metadata
6. WHEN a user runs `specmem sessions view <session-id>` AND session search is configured THEN the system SHALL display the full conversation
7. WHERE the `--robot` flag is provided THEN the system SHALL output JSON format for AI agent consumption
8. WHERE the `--limit N` flag is provided THEN the system SHALL cap results to N items
9. IF session search is not configured AND a session command is run THEN the system SHALL display an error with instructions to configure
10. WHEN a user runs `specmem sessions config --help` THEN the system SHALL display guidance on finding the sessions directory
11. WHEN displaying configuration help THEN the system SHALL show the default paths for each platform (macOS, Linux, Windows)
12. WHEN displaying configuration help THEN the system SHALL provide a link to Kiro documentation for finding session storage location
13. WHEN auto-discovery finds a path THEN the system SHALL display the path and ask "Is this correct? [Y/n]" before saving

### Requirement 6

**User Story:** As a developer, I want session data to be normalized into a common format, so that future adapters (SpecKit, Tessl) can use the same data model.

#### Acceptance Criteria

1. WHEN parsing Kiro sessions THEN the system SHALL convert to a normalized Session data model
2. WHEN normalizing messages THEN the system SHALL map Kiro roles (user/assistant) to standard roles
3. WHEN normalizing content THEN the system SHALL flatten content arrays and tool calls into plain text
4. WHEN normalizing timestamps THEN the system SHALL convert to Unix milliseconds

### Requirement 7

**User Story:** As a developer, I want the option to only search sessions for my current project, so that I can limit access to project-relevant data only.

#### Acceptance Criteria

1. WHEN session search is enabled with `--workspace-only` flag THEN the system SHALL only access sessions for the current workspace
2. WHEN workspace-only mode is active THEN the system SHALL filter sessions by matching workspaceDirectory to the current project path
3. WHEN workspace-only mode is active THEN the system SHALL NOT access sessions from other projects
4. WHEN configuring session search THEN the system SHALL allow setting workspace-only as the default mode
