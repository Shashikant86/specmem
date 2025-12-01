# 🤝 Contributing

Thank you for your interest in contributing to SpecMem!

## Ways to Contribute

<div class="feature-grid">
  <div class="feature-card">
    <h3><span class="emoji">🐛</span> Report Bugs</h3>
    <p>Found a bug? Open an issue on GitHub.</p>
    <a href="https://github.com/Shashikant86/specmem/issues/new?template=bug_report.md" class="md-button">Report Bug</a>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">💡</span> Request Features</h3>
    <p>Have an idea? We'd love to hear it.</p>
    <a href="https://github.com/Shashikant86/specmem/issues/new?template=feature_request.md" class="md-button">Request Feature</a>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">📝</span> Improve Docs</h3>
    <p>Help us improve documentation.</p>
    <a href="https://github.com/Shashikant86/specmem/edit/main/docs/" class="md-button">Edit Docs</a>
  </div>
  <div class="feature-card">
    <h3><span class="emoji">💻</span> Submit Code</h3>
    <p>Fix bugs or add features.</p>
    <a href="development/" class="md-button">Dev Guide</a>
  </div>
</div>

## Quick Start

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/specmem.git
cd specmem

# Install dev dependencies
pip install -e ".[dev]"

# Run tests
pytest tests/ -v

# Run linter
ruff check .
```

## Guidelines

### Code of Conduct

We follow the [Contributor Covenant](https://www.contributor-covenant.org/). Please be respectful and inclusive.

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pytest tests/ -v`)
5. Run linter (`ruff check . --fix`)
6. Commit (`git commit -m 'Add amazing feature'`)
7. Push (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new adapter for XYZ framework
fix: resolve query timeout issue
docs: update installation guide
test: add property tests for memory bank
refactor: simplify impact graph traversal
```

## Topics

- [Development Setup](development.md) - Set up your dev environment
- [Code Style](code-style.md) - Coding standards and conventions
- [Testing](testing.md) - Writing and running tests

## Questions?

- Open a [Discussion](https://github.com/Shashikant86/specmem/discussions)
- Join our community chat
- Email: team@super-agentic.ai
