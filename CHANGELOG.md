# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-17

### Added

- **14 accessibility features:**
  - Visual: High Contrast, Dark Mode, Font Size (5 levels), Pause Animations, Invert Colors
  - Content: Dyslexia Font, Underline Links, Hide Images, Text Spacing, Highlight Headings
  - Navigation: Focus Outline, Large Cursor, Reading Guide, Text to Speech
- **Internationalization (i18n):** Built-in English and Hebrew translations with RTL support
- **Runtime language registration:** Add new languages via `registerLanguage(code, translations)`
- **Keyboard navigation:** Full WAI-ARIA menu pattern (Enter, Space, Arrow keys, Escape, Tab, Home, End)
- **State persistence:** All settings saved to localStorage with schema validation on load
- **Customizable API:** `AccessibilityWidget.init(options)` with callbacks for toggle, open, close
- **Feature toggling:** Enable/disable individual features via `features` option
- **Custom storage key:** Configurable localStorage key to avoid collisions
- **Responsive design:** Full-width bottom sheet on mobile (< 480px)
- **Reduced motion:** Respects `prefers-reduced-motion` media query
- **Print styles:** Widget hidden when printing
- **CSS customization:** All colours and sizes configurable via CSS custom properties
- **BEM naming:** Consistent `.a11y-widget` block naming to avoid style conflicts
- **Singleton pattern:** Re-initializing destroys previous instance
- **Clean destroy:** Restores original `lang`/`dir` attributes, removes all feature classes
- **Zero dependencies:** Pure vanilla JS and CSS, no runtime dependencies
- **Build outputs:** UMD, minified UMD, and ESM bundles via Rollup
- **363 automated tests** across 5 test files with 98%+ coverage
- **Demo page** in `examples/index.html`
