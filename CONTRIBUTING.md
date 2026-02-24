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

---

## Adding or Improving Translations

The widget ships 40 built-in languages, all stored in `src/i18n.js`. Translation contributions are especially welcome — they directly improve the experience for millions of users.

### Full language (new locale)

1. Open `src/i18n.js` and find the `TRANSLATIONS` object.
2. Copy the English (`en`) block and rename it to the target BCP-47 code (e.g. `af` for Afrikaans).
3. Translate every string value. **Leave keys untouched** — they are the stable identifiers used by the widget.
4. Add the native language name to the `NATIVE_NAMES` map.
5. If the language is right-to-left (Arabic script, Hebrew, etc.), add the code to the `RTL_LANGUAGES` set.
6. Run `npm test` — the i18n tests will check that the new locale contains all required keys.

**Required keys** (as of v2.7.0):

```
menuTitle, closeMenu, resetAll, language, disclaimer,
highContrast, darkMode, fontSize, pauseAnimations,
invertColors, dyslexiaFont, underlineLinks, hideImages,
textSpacing, highlightHeadings, focusOutline, largeCursor,
readingGuide, textToSpeech, focusMode, lineHeight,
letterSpacing, wordSpacing, deuteranopia, protanopia,
tritanopia, reducedTransparency, sensoryFriendly,
readableFont, saturation, brightness, suppressNotifications,
highlightHover,
profiles, profileNamePlaceholder, saveProfile, loadProfile,
deleteProfile, noProfiles,
settingsActive, resetConfirmation, featureEnabled,
featureDisabled, tooltipMessage,
visual, content, navigation,
presetLowVision, presetDyslexia, presetAdhd,
presetMotor, presetMigraine, quickStart,
accessibilityStatementLinkLabel,
ttsPause, ttsResume, ttsSpeed, ttsSlower, ttsFaster,
zoomLockWarning
```

Missing keys automatically fall back to English, but a complete translation is preferred.

### Partial translation (fixing existing strings)

Open `src/i18n.js`, find the relevant language block, edit the incorrect string, and open a pull request with a description of what changed and why.

### Translation PR checklist

- [ ] New locale has all required keys (run `npm test` to verify)
- [ ] `NATIVE_NAMES` entry uses the language's own script (e.g. `"中文"` not `"Chinese"`)
- [ ] RTL languages added to `RTL_LANGUAGES`
- [ ] No `console.warn` about missing keys in test output

---

## Accessibility Requirements for New Features

Every new feature or UI change must:

1. **Have a feature ID and body class** following the existing `a11y-<featureId>` naming pattern.
2. **Exclude the widget itself** from any CSS filter or visibility effect: use `:not(.a11y-widget):not(.a11y-widget *)` selectors.
3. **Have i18n keys** for the feature label in at least English (`en`) and Hebrew (`he`). Other languages will receive a PR from maintainers or community members.
4. **Have tests** — feature definition tests in `test/features.test.js` and integration tests in `test/widget.test.js`.
5. **Pass axe-core** — run `npm test` and ensure `test/a11y.test.js` shows no violations.

### Feature definition structure (`src/features.js`)

```js
{
  id: 'myFeature',        // camelCase, unique
  group: 'content',       // 'visual' | 'content' | 'navigation'
  type: 'toggle',         // 'toggle' | 'range'
  defaultValue: false,    // false for toggles; 0 for range
  bodyClass: 'a11y-my-feature',  // applied to document.body
  icon: ICONS.myFeature,  // SVG string from ICONS map (aria-hidden)
  // Range-only:
  min: 0, max: 5, step: 1,
  // Optional:
  conflictsWith: ['otherFeature'],  // deactivated when this one activates
}
```
