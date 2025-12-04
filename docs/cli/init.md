# specmem init

Initialize SpecMem in a project.

## Usage

```bash
specmem init [OPTIONS]
```

## Description

Creates the necessary configuration files and directories for SpecMem:

- `.specmem.toml` - Configuration file
- `.specmem/` - Data directory

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--force, -f` | Overwrite existing config | `false` |
| `--minimal` | Create minimal config | `false` |
| `--embedding PROVIDER` | Embedding provider | `local` |
| `--vectordb BACKEND` | Vector database backend | `lancedb` |
| `--hooks` | Generate Kiro hooks for automation | `false` |

## Examples

### Basic Initialization

```bash
specmem init
```

Output:

```
✅ Created .specmem.toml
✅ Created .specmem/ directory
✅ Added .specmem/ to .gitignore

SpecMem initialized! Next steps:
  1. Run 'specmem scan' to index your specs
  2. Run 'specmem build' to create the agent pack
```

### With OpenAI Embeddings

```bash
specmem init --embedding openai
```

### Minimal Config

```bash
specmem init --minimal
```

Creates a minimal `.specmem.toml`:

```toml
[embedding]
provider = "local"

[vectordb]
backend = "lancedb"
```

### Force Overwrite

```bash
specmem init --force
```

### With Kiro Hooks

```bash
specmem init --hooks
```

This generates Kiro hook configurations in `.kiro/hooks/`:

- **specmem-validate-on-save** - Validates specs when you save a `.md` file
- **specmem-coverage-on-test** - Updates coverage when you save a test file
- **specmem-spec-reminder** - Reminds the agent about relevant specs when coding

## Generated Files

### .specmem.toml

```toml
# SpecMem Configuration
# See https://specmem.dev/docs/configuration for all options

[embedding]
provider = "local"
model = "all-MiniLM-L6-v2"

[vectordb]
backend = "lancedb"
path = ".specmem/vectordb"

[adapters]
kiro = true
cursor = true
claude = true

[output]
path = ".specmem"
```

### .gitignore Addition

```
# SpecMem
.specmem/
.specmem.local.toml
```

## See Also

- [Configuration](../getting-started/configuration.md)
- [specmem scan](scan.md)
