# specmem kiro-config

Display a summary of all Kiro CLI configuration in the workspace.

## Usage

```bash
specmem kiro-config [OPTIONS]
```

## Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--path` | `-p` | Workspace path | `.` |

## Description

The `kiro-config` command displays a comprehensive summary of all Kiro configuration artifacts:

- **Steering files** from `.kiro/steering/`
- **MCP servers** from `.kiro/settings/mcp.json`
- **Hooks** from `.kiro/hooks/`

## Examples

### Show configuration for current directory

```bash
specmem kiro-config
```

### Show configuration for a specific workspace

```bash
specmem kiro-config --path /path/to/project
```

## Output

The command displays three tables:

### Steering Files

Shows all steering files with their inclusion mode and file patterns.

```
📝 Steering Files
┌──────────────┬───────────┬─────────┐
│ File         │ Inclusion │ Pattern │
├──────────────┼───────────┼─────────┤
│ python.md    │ fileMatch │ *.py    │
│ security.md  │ always    │ -       │
│ manual.md    │ manual    │ -       │
└──────────────┴───────────┴─────────┘
```

### MCP Servers

Shows all configured MCP servers with their status.

```
🔌 MCP Servers
┌─────────────┬─────────────────┬───────────┬─────────────┐
│ Server      │ Command         │ Status    │ Auto-Approve│
├─────────────┼─────────────────┼───────────┼─────────────┤
│ aws-docs    │ uvx awslabs...  │ ✅ Enabled │ search_docs │
│ specmem     │ uvx specmem-mcp │ ✅ Enabled │ -           │
│ old-server  │ uvx old-pkg     │ ❌ Disabled│ -           │
└─────────────┴─────────────────┴───────────┴─────────────┘
```

### Hooks

Shows all configured hooks with their triggers and patterns.

```
🪝 Hooks
┌──────────────────┬───────────────┬─────────┬──────────┐
│ Hook             │ Trigger       │ Pattern │ Status   │
├──────────────────┼───────────────┼─────────┼──────────┤
│ validate-on-save │ file_save     │ *.md    │ ✅ Active │
│ coverage-update  │ file_save     │ tests/* │ ✅ Active │
│ session-context  │ session_start │ -       │ ✅ Active │
└──────────────────┴───────────────┴─────────┴──────────┘
```

### Summary

A summary panel shows totals:

```
📊 Summary
┌────────────────────────────────────┐
│ Steering Files: 3                  │
│ MCP Servers: 2 enabled / 3 total   │
│ Hooks: 3 active / 3 total          │
│ Tools: 5 available                 │
└────────────────────────────────────┘
```

## Missing Configuration

If configuration files are missing, the command displays informative messages:

```
No steering files found in .kiro/steering/
No MCP configuration found in .kiro/settings/mcp.json
No hooks found in .kiro/hooks/
```

## See Also

- [specmem steering](steering.md) - Query steering files for specific files
- [Kiro Configuration Guide](../user-guide/kiro-config.md) - Full documentation
