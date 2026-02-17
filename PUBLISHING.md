# Publishing to npm

This document explains how to publish `free-accessibility-menu` to npm.

## Prerequisites

1. **npm account**: You need an npm account. Create one at https://www.npmjs.com/signup
2. **npm login**: Run `npm login` and enter your credentials

## Pre-Publish Checklist

Before publishing, ensure:

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Version is updated in `package.json`
- [ ] CHANGELOG is updated (if you have one)
- [ ] README is accurate
- [ ] All changes are committed to git

## Publishing Steps

### 1. Verify Package Contents (Dry Run)

```bash
npm publish --dry-run
```

This shows what would be published without actually publishing.

Expected output should include:
- `dist/` folder with all builds (ESM, CJS, UMD)
- `dist/a11y-widget.css`
- `README.md`
- `LICENSE`
- `package.json`

### 2. Update Version

Use npm's version command to bump the version and create a git tag:

```bash
# For bug fixes
npm version patch

# For new features (backwards compatible)
npm version minor

# For breaking changes
npm version major
```

This automatically:
- Updates `package.json`
- Creates a git commit
- Creates a git tag

### 3. Push to GitHub

```bash
git push --follow-tags
```

The `--follow-tags` flag ensures version tags are pushed along with commits.

### 4. Publish to npm

**First time publishing (public package):**

```bash
npm publish --access public
```

**Subsequent publishes:**

```bash
npm publish
```

## What Happens During Publish

The `prepublishOnly` script in `package.json` automatically runs:

1. `npm run clean` - Removes old dist files
2. `npm run test` - Runs all tests (must pass)
3. `npm run build` - Creates fresh builds

If any step fails, publishing is aborted.

## Package Outputs

The package provides multiple formats for different use cases:

| Format | File | Use Case |
|--------|------|----------|
| ESM | `dist/index.js` | Modern bundlers (Webpack, Vite, etc.) |
| CJS | `dist/index.cjs` | Node.js `require()` |
| UMD | `dist/index.umd.js` | Browser `<script>` tag (dev) |
| UMD Min | `dist/index.umd.min.js` | Browser `<script>` tag (production) |
| CSS | `dist/a11y-widget.css` | Styles (required) |

## CDN Availability

After publishing, the package is automatically available on CDNs:

- **unpkg**: `https://unpkg.com/free-accessibility-menu`
- **jsDelivr**: `https://cdn.jsdelivr.net/npm/free-accessibility-menu`

## Versioning Strategy

Follow [Semantic Versioning (SemVer)](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features (backwards compatible)
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

## Unpublishing

⚠️ **Warning**: Unpublishing is discouraged and has restrictions.

You can only unpublish within 72 hours of publishing, and only if no other packages depend on it.

```bash
npm unpublish free-accessibility-menu@<version>
```

## Deprecating

If you need to discourage use of a version without unpublishing:

```bash
npm deprecate free-accessibility-menu@<version> "Message explaining deprecation"
```

## Support

- npm documentation: https://docs.npmjs.com/
- Package page: https://www.npmjs.com/package/free-accessibility-menu
- Repository issues: https://github.com/pachpul12/free-accessibility-menu/issues
