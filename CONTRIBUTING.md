# Contributing to Free Accessibility Menu

Thank you for your interest in contributing! This project aims to make the web more accessible, and every contribution helps.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

1. Check the [existing issues](../../issues) to avoid duplicates
2. Use the **Bug Report** issue template
3. Include: browser/OS, steps to reproduce, expected vs actual behaviour, and any console errors

### Suggesting Features

1. Use the **Feature Request** issue template
2. Describe the use case and how it improves accessibility
3. Reference relevant WCAG guidelines if applicable

### Submitting Pull Requests

1. Fork the repository and create a feature branch from `main`
2. Install dependencies: `npm install`
3. Make your changes in `src/`
4. Add or update tests in `test/`
5. Run the full test suite: `npm test`
6. Run the linter: `npm run lint`
7. Build to verify: `npm run build`
8. Submit your PR with a clear description of the changes

## Development Setup

```bash
git clone https://github.com/user/free-accessibility-menu.git
cd free-accessibility-menu
npm install
npm test        # Run tests with coverage
npm run build   # Build UMD + ESM bundles
npm run lint    # Check code style
```

## Style Guidelines

- **JavaScript:** ES5-compatible code in `src/` (no arrow functions, `const`/`let` in module scope only)
- **CSS:** BEM naming convention (`.a11y-widget__element--modifier`)
- **Tests:** Jest with jsdom. Every new feature needs tests. Every bug fix needs a regression test.
- **ARIA:** All interactive elements must have proper roles, labels, and keyboard support

## Pull Request Checklist

- [ ] New UI elements have ARIA roles/labels and keyboard interactions
- [ ] Unit tests are provided or updated, and all tests pass
- [ ] Code is linted and formatted
- [ ] Build succeeds (`npm run build`)
- [ ] axe-core accessibility tests pass

## Testing

We use Jest with jsdom for unit tests and jest-axe for accessibility testing:

```bash
npm test              # Run all tests with coverage
npm run test:watch    # Watch mode for development
```

Coverage thresholds are enforced at 80% for statements, branches, functions, and lines.
