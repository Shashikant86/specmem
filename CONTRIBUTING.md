# Contributing to SpecMem

First off, thank you for considering contributing to SpecMem! It's people like you that make SpecMem such a great tool for the AI coding agent community.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible using our bug report template.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Explain why this enhancement would be useful
- List any alternatives you've considered

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code follows the project's style guidelines
6. Issue that pull request!

## Development Setup

### Prerequisites

- Python 3.11 or higher
- [uv](https://github.com/astral-sh/uv) (recommended) or pip

### Setting Up Your Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/specmem.git
cd specmem

# Create a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies with dev extras
pip install -e ".[dev]"

# Install pre-commit hooks
pre-commit install
pre-commit install --hook-type commit-msg
```

### Running Tests

```bash
# Run all tests
pytest tests/ -v

# Run unit tests only
pytest tests/unit -v

# Run property tests only
pytest tests/property -v

# Run with coverage
pytest tests/ --cov=specmem --cov-report=html
```

### Code Style

We use [Ruff](https://github.com/astral-sh/ruff) for linting and formatting:

```bash
# Check for issues
ruff check .

# Auto-fix issues
ruff check --fix .

# Format code
ruff format .
```

### Type Checking

We use [MyPy](https://mypy.readthedocs.io/) for static type checking:

```bash
mypy specmem
```

## Project Structure

```
specmem/
├── adapters/       # Spec framework adapters (Kiro, Cursor, Claude, etc.)
├── cli/            # Command-line interface
├── client/         # Python client API
├── context/        # Streaming context API
├── core/           # Core models and memory bank
├── diff/           # SpecDiff temporal intelligence
├── impact/         # SpecImpact dependency graph
├── testing/        # Test mapping engine
├── ui/             # Web UI (FastAPI + React)
├── validator/      # Spec validation rules
└── vectordb/       # Vector database backends
```

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that don't affect code meaning
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `perf:` Performance improvement
- `test:` Adding missing tests
- `chore:` Changes to build process or auxiliary tools

Examples:
```
feat: add Windsurf adapter for spec parsing
fix: handle empty spec files in Kiro adapter
docs: update README with new CLI commands
test: add property tests for SpecImpact graph
```

## Adding a New Adapter

To add support for a new spec framework:

1. Create a new file in `specmem/adapters/`
2. Implement the `SpecAdapter` interface:

```python
from specmem.adapters.base import SpecAdapter
from specmem.core.specir import SpecBlock

class MyFrameworkAdapter(SpecAdapter):
    @property
    def name(self) -> str:
        return "MyFramework"

    def detect(self, repo_path: str) -> bool:
        # Return True if this framework is detected
        pass

    def load(self, repo_path: str) -> list[SpecBlock]:
        # Parse and return SpecBlocks
        pass
```

3. Add tests in `tests/unit/test_myframework_adapter.py`
4. Update documentation

## Adding a New Vector Backend

To add support for a new vector database:

1. Create a new file in `specmem/vectordb/`
2. Implement the `VectorStore` interface from `specmem/vectordb/base.py`
3. Register in `specmem/vectordb/factory.py`
4. Add tests and documentation

## Questions?

Feel free to open a discussion on GitHub or reach out to the maintainers.

Thank you for contributing! 🎉
