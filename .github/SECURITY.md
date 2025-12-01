# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of SpecMem seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT:

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### Please DO:

1. **Email us directly** at security@super-agentic.ai with:
   - A description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact of the vulnerability
   - Any suggested fixes (if you have them)

2. **Allow us time** to investigate and address the vulnerability before any public disclosure

### What to expect:

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Communication**: We will keep you informed about our progress in addressing the vulnerability
- **Resolution**: We aim to resolve critical vulnerabilities within 7 days
- **Credit**: We will credit you in our security advisories (unless you prefer to remain anonymous)

## Security Best Practices for Users

### API Keys and Secrets

- Never commit API keys or secrets to version control
- Use environment variables or secure secret management
- Rotate API keys regularly

### Configuration

- Review `.specmem.toml` before committing to ensure no sensitive data is included
- Use `.specmem.local.toml` for local overrides (this file is gitignored)

### Dependencies

- Keep SpecMem and its dependencies up to date
- Review security advisories for dependencies regularly

## Security Features

SpecMem includes several security features:

- **No telemetry**: SpecMem does not collect or transmit any user data
- **Local-first**: All data is stored locally by default
- **API key handling**: API keys are loaded from environment variables, not stored in config files
- **Input validation**: All user inputs are validated before processing

## Acknowledgments

We would like to thank the following individuals for responsibly disclosing security issues:

- (No reports yet - be the first!)
