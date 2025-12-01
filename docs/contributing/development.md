# Development Setup

Set up your development environment for contributing to SpecMem.

## Prerequisites

- Python 3.11 or higher
- Git
- Make (optional, for convenience commands)

## Clone the Repository

```bash
git clone https://github.com/Shashikant86/specmem.git
cd specmem
```

## Create Virtual Environment

```bash
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate   # Windows
```

## Install Dependencies

```bash
# Install with all dev dependencies
pip install -e ".[all]"

# Or just dev dependencies
pip install -e ".[dev]"
```

## Verify Installation

```bash
# Run CLI
specmem --version

# Run tests
pytest tests/ -v

# Run linter
ruff check .

# Run type checker
mypy specmem/
```

## Project Structure

```
specmem/
├── specmem/              # Main package
│   ├── adapters/         # Framework adapters
│   ├── cli/              # CLI commands
│   ├── client/           # Client API
│   ├── context/          # Context management
│   ├── core/             # Core data models
│   ├── diff/             # SpecDiff timeline
│   ├── impact/           # Impact graph
│   ├── testing/          # Test utilities
│   ├── ui/               # Web UI
│   ├── validator/        # Validation rules
│   └── vectordb/         # Vector stores
├── tests/                # Test suite
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── property/         # Property-based tests
├── docs/                 # Documentation
├── .kiro/                # Kiro specs
└── pyproject.toml        # Project config
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/my-feature
```

### 2. Make Changes

Edit code in `specmem/` directory.

### 3. Run Tests

```bash
# All tests
pytest tests/ -v

# Specific test file
pytest tests/unit/test_client.py -v

# With coverage
pytest tests/ --cov=specmem --cov-report=html
```

### 4. Run Linter

```bash
# Check
ruff check .

# Fix automatically
ruff check . --fix

# Format
ruff format .
```

### 5. Run Type Checker

```bash
mypy specmem/
```

### 6. Commit and Push

```bash
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

## Make Commands

If you have Make installed:

```bash
make install    # Install dependencies
make test       # Run tests
make lint       # Run linter
make format     # Format code
make typecheck  # Run type checker
make docs       # Build documentation
make clean      # Clean build artifacts
```

## Running Documentation Locally

```bash
# Install docs dependencies
pip install -e ".[docs]"

# Serve docs locally
mkdocs serve

# Open http://localhost:8000
```

## Pre-commit Hooks

Install pre-commit hooks:

```bash
pre-commit install
```

Hooks run automatically on commit:

- Ruff linting
- Ruff formatting
- Type checking
- Test execution

## IDE Setup

### VS Code

Recommended extensions:

- Python
- Pylance
- Ruff
- Even Better TOML

Settings (`.vscode/settings.json`):

```json
{
  "python.defaultInterpreterPath": ".venv/bin/python",
  "python.analysis.typeCheckingMode": "basic",
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true
  }
}
```

### PyCharm

1. Set interpreter to `.venv/bin/python`
2. Enable Ruff plugin
3. Configure pytest as test runner

## Debugging

### CLI Debugging

```bash
# Verbose output
specmem --verbose scan

# Debug logging
SPECMEM_LOG_LEVEL=debug specmem scan
```

### Python Debugging

```python
import logging
logging.basicConfig(level=logging.DEBUG)

from specmem import SpecMemClient
sm = SpecMemClient()
```

## Getting Help

- Check existing [issues](https://github.com/Shashikant86/specmem/issues)
- Open a [discussion](https://github.com/Shashikant86/specmem/discussions)
- Read the [contributing guide](index.md)
