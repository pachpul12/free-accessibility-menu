# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.10.0] - 2026-02-24

### Added

- **F-003: Plugin Architecture** (PRD §7.6): External plugins can be registered via `AccessibilityWidget.registerPlugin(plugin)` before `init()`. A plugin supplies `id`, `features` (array of `FeatureDefinition`), `handlers` (activate/deactivate per feature), and optional `mount(container, widget)` / `unmount(widget)` lifecycle hooks. The dispatch table `_BUILTIN_FEATURE_HANDLERS` + `_pluginHandlerMap` replaces all hard-coded feature if-chains in `_toggleFeature`, `setFeature`, `_applyAllFeatures`, `resetAll`, and `destroy`. Plugin features are fully integrated: they appear in the panel, respond to `setFeature()`, persist to storage, and are cleaned up on `resetAll()` / `destroy()`.
- **`AccessibilityWidget.getAvailableFeatures()`**: Returns the array of enabled `FeatureDefinition` objects. Delegates to `instance.getAvailableFeatures()` when active, otherwise merges built-in and registered plugin features. Also added as `WidgetInstance.getAvailableFeatures()`.
- **`AccessibilityWidget._clearPlugins()`**: Test-only helper that resets the shared plugin registry between test runs.
- **F-204: TTS word-level highlighting via `onboundary`** (PRD §F-204): When clicking a plain-text element during TTS playback, `_prepareTTSWordSpans()` injects `<span class="a11y-tts-word" data-char-index="N">` elements. The `SpeechSynthesisUtterance.onboundary` handler adds `.a11y-tts-word-active` to the current word span as speech progresses. On `onend`/`onerror`, `_cleanupTTSElement()` restores the original `innerHTML`. Elements with child elements fall back to element-level highlighting (`.a11y-tts-speaking`) without DOM mutation.
- **F-210: Click-to-pin highlight** (PRD §F-210): When `highlightHover` is active, clicking a text element (`P`, `LI`, `H1`–`H6`, `BLOCKQUOTE`, `TD`) pins the `.a11y-highlight-pinned` CSS class to it. Clicking the same element again unpins. Clicking a different element moves the pin. Clicks inside the widget panel are ignored. Pin is cleared on `setFeature('highlightHover', false)` and `destroy()`.
- **F-212: Dev audit badge clickable detail list** (PRD §F-212): The dev-mode violation badge is now a `<button>` with `aria-expanded` and `aria-controls`. Clicking toggles a scrollable `role="list"` showing each violation's element selector.
- **`FeatureDefinition` TypeScript interface**: Exported from `src/index.d.ts`; describes `id`, `label`, `type`, `group`, `cssClass`, `min`, `max`, `default`, `conflictsWith`. Used by `WidgetInstance.getAvailableFeatures()` and `A11yPlugin.features`.
- **`A11yPlugin` and `A11yPluginHandler` TypeScript interfaces**: Exported from `src/index.d.ts`; full JSDoc with `mount`/`unmount` signatures and `activate`/`deactivate` parameter types.
- CSS: `.a11y-tts-word` (inline span) and `.a11y-tts-word-active` (highlighted current word, blue background) styles.
- CSS: `body.a11y-highlight-hover .a11y-highlight-pinned` (amber-tinted background + outline for pinned element).

### Changed

- Version bumped to `2.10.0` in `package.json` and `src/index.js`.
- `_onTTSClick`: now calls `_cleanupTTSElement()` before each new utterance (ensures previous word spans are always restored), then `_prepareTTSWordSpans()`, and wires `onboundary`.
- `_deactivateTTS`: calls `_cleanupTTSElement()` before the stale-class cleanup loop to restore any injected word spans.

---

## [2.9.0] - 2026-02-24

### Added

- **`config.schema.json`** (PRD §7.2): JSON Schema Draft-07 file describing all `WidgetOptions` properties with types, defaults, enums, descriptions, and examples. Copied to `dist/config.schema.json` by the Rollup `copySchema()` plugin. Exported via the `./schema` sub-path in `package.json` exports. Enables IDE autocompletion and runtime validation in tooling integrations.
- **`rollup.config.mjs` `copySchema()` plugin**: Automatically copies `src/config.schema.json` → `dist/config.schema.json` during the build step alongside `copyCSS` and `copyDTS`.
- **`package.json` `./schema` export**: `"./schema": "./dist/config.schema.json"` sub-path export enables `import schema from 'free-accessibility-menu/schema'` in Node tooling.

### Changed

- **Language section moved outside `role="menu"`** (PRD §8.1, §8.3): The language selector section is now appended to the panel element as a sibling of `_contentEl` rather than a child. This resolves an `aria-required-children` axe-core violation (`role="none"` is not a valid child of `role="menu"`). Arrow-key navigation via `_menuItems` continues to work because the keyboard handler is panel-scoped. All 11 axe-core tests confirmed green.
- **`_onReadingGuideMove` / `_onReadingGuideTouchMove` rAF throttle** (PRD §7.4): Both handlers now batch DOM writes through `requestAnimationFrame` using a shared `_rgRafScheduled` flag and `_rgRafPendingY` staging variable. Only one rAF callback is scheduled per frame regardless of how many mousemove/touchmove events fire. Two reading-guide tests updated with `jest.spyOn(window, 'requestAnimationFrame')` to keep them synchronous.
- **README CDN documentation** (PRD §9.4): All three CDN examples (unpkg, jsDelivr, self-hosted) updated with: `defer` attribute on script tags; CSS in `<head>` note; `DOMContentLoaded` init wrapper; version-pinned URLs (`@2.9.0`); explanatory tip about version pinning.
- Version bumped to `2.9.0` in `package.json` and `src/index.js`.

---

## [2.8.0] - 2026-02-24

### Added

- **`createWidget()` factory API** (Section 7.5): `AccessibilityWidget.createWidget(options)` creates an independent widget instance without affecting the global singleton. Enables micro-frontend use cases where multiple widgets with different `storageKey` values must coexist on the same page. TypeScript declaration and 7 integration tests added.
- **CHANGELOG.md**: Full version history from v1.0.0 through v2.8.0 following Keep a Changelog format.
- **CONTRIBUTING.md**: Added comprehensive "Adding or Improving Translations" section with all required i18n keys, workflow steps, and feature definition guidelines.
- **SECURITY.md**: Created with responsible disclosure policy, security model, CSP compatibility table, and known limitations.

---

## [2.7.0] - 2026-02-24

### Added

- **`createWidget()` factory API** (Section 7.5): Create independent widget instances for micro-frontend scenarios without affecting the global singleton. `AccessibilityWidget.createWidget(options)` returns a new `WidgetInstance`; caller is responsible for cleanup via `instance.destroy()`.
- **WCAG 2.2 Accessibility Conformance Report** (F-209): `docs/accessibility-conformance-report.md` maps the widget's own UI against all WCAG 2.2 Level A and AA success criteria. Supported by existing axe-core automated test suite.
- **Web Component wrapper** (Section 10.2): `src/element.js` registers the `<a11y-menu>` custom element. Pass `WidgetOptions` JSON via the `config` attribute. Published as `dist/element.js` (ESM) and `dist/element.umd.min.js` (UMD minified).
- **Screen reader announcements** (Section 8.2): `aria-live="polite"` region announces feature enable/disable, reset confirmation, and panel-open summary. Toggle button `aria-label` includes active settings count (e.g. "Accessibility Menu (3 settings active)").
- **First-visit tooltip** (Section 8.5): Optional tooltip near the toggle button on first visit (no saved settings). `showTooltip: boolean` option (default `true`). Auto-dismisses after 5 s. Respects `prefers-reduced-motion`.
- **Custom storage mode** (Section 7.3): `storage` option accepts `'localStorage'` (default), `'sessionStorage'`, `'none'`, or a custom `{ getItem, setItem, removeItem }` object. `setStorageMode()` and `getStorageMode()` exported as named exports.
- **Quick Start built-in presets** (F-103 Layer 1): Five chip-buttons above the feature menu — Low Vision, Dyslexia Friendly, ADHD / Cognitive, Motor / Keyboard, Migraine Safe. Controlled by `showPresets` option. Each preset calls `resetAll()` then `applySettings()`.
- Five new i18n keys in all 40 languages: `settingsActive`, `resetConfirmation`, `featureEnabled`, `featureDisabled`, `tooltipMessage`.
- `./element` sub-path export in `package.json` and `rollup.config.mjs` for Web Component builds.
- `TypeScript` declarations updated: `createWidget()`, `showTooltip`, `showPresets`, `storage`, `CustomStorageProvider`.
- README: updated Features section to list all 28 features in three grouped tables; added WCAG conformance table; expanded API reference (14 instance methods, 10 CustomEvents, Web Component usage, Named Exports).

### Changed

- Version bumped to `2.7.0` in `package.json` and `src/index.js`.

---

## [2.6.0] - 2026-02-21

### Added

- **F-212: Dev Mode Alt Text Audit**: When `devMode: true` (or auto-detected via `NODE_ENV === 'development'`), the widget scans `<img>` and `<svg>` elements for missing alt text / accessible names on init. Violations are outlined with `.a11y-dev-violation`, logged to console, and counted in a badge in the panel header.
- **F-106: Auto-disable `largeCursor` on touch-only devices**: Detects `!window.matchMedia('(hover: hover)').matches` at init and removes `largeCursor` from the enabled feature list on touch-only devices.
- **F-107: Auto-activate `pauseAnimations` on `prefers-reduced-motion: reduce`**: When the OS has reduced motion enabled and no saved preference exists, `pauseAnimations` is activated by default.
- **F-206: Session usage report** (`getReport()`): In-memory per-session report with sessionId, initTimestamp, menuOpenCount, per-feature toggleCount/lastActivated, and current settings snapshot.
- **Enhanced TTS controls** (F-204): Pause/resume button and speed control (0.5× – 2.0×, ±0.25 steps) shown in a TTS controls panel while speech is active.
- **Highlight on Hover** (F-210): `highlightHover` toggle adds `body.a11y-highlight-hover` — CSS highlights the paragraph/heading/list item under the pointer.
- **Reading Guide touch support** (F-106): `touchmove` event handler mirrors `mousemove` for the reading guide bar on touch devices.
- **Branding options** (F-205): `primaryColor`, `panelTitle`, and `disclaimerText` (or `false` to suppress) options.
- TypeScript declarations for all new options and `SessionReport` / `FeatureStat` interfaces.

---

## [2.5.0] - 2026-02-19

### Added

- **Suppress Notifications** (F-211): `suppressNotifications` toggle adds `body.a11y-suppress-notifications` — CSS-only suppression of common chat widgets, cookie banners, and toast selectors. Customizable via `notificationSuppressorSelectors` option.
- **Reduced Transparency**: `reducedTransparency` toggle removes `backdrop-filter` and transparency effects.
- **Sensory-Friendly Mode** (F-110 / F-203): `sensoryFriendly` composite toggle activates `pauseAnimations` + `brightness` reduction + `saturation` reduction in one click.
- **Language Auto-Detection** (F-203): Widget UI language auto-detected from `document.documentElement.lang`, `navigator.language`, then `navigator.languages[0]`; overridden by explicit `defaultLanguage` option.
- **`showLanguageSwitcher` option** (F-207): When `false`, the language selector section is not rendered in the DOM.
- Six new i18n keys in all 40 languages: `sensoryFriendly`, `reducedTransparency`, `suppressNotifications`, `highlightHover`, plus TTS speed keys.
- `notificationSuppressorSelectors?: string[]` option for site-specific extension of the default selector list.

---

## [2.4.0] - 2026-02-18

### Added

- **Readable Font** (F-201): `readableFont` toggle applies `font-family: Arial, Helvetica, sans-serif` to all page elements (excluding the widget itself).
- **Saturation control** (F-202): `saturation` range feature — `filter: saturate(X)` on `body > *:not(.a11y-widget)`, 0 – 200 % in 5 steps (0 = greyscale).
- **Brightness control** (F-202): `brightness` range feature — `filter: brightness(X)` on `body > *:not(.a11y-widget)`, 50 % – 150 % in 5 steps.

---

## [2.3.0] - 2026-02-17

### Added

- **Language Auto-Detection** foundation: priority resolution from `defaultLanguage` option → `document.documentElement.lang` → `navigator.language` → English fallback.
- **`showLanguageSwitcher` option** scaffolding.
- i18n keys for 40 languages expanded with group labels and new feature names.

---

## [2.2.0] - 2026-02-17

### Added

- **F-111: Zoom Lock Warning**: Detects `user-scalable=no` or `maximum-scale < 5` in the viewport `<meta>` tag. Emits `console.warn` in dev mode and optionally shows a non-blocking panel notice on first open (`showZoomLockWarning` option, default `true`).
- **F-108: Section group label i18n**: "Visual", "Content", "Navigation" section headers are now translated in all 40 languages via `this._t()`.

---

## [2.1.0] - 2026-02-17

### Added

- **F-201: Profiles / Presets system**: `saveProfile(name)`, `loadProfile(name)`, `deleteProfile(name)`, `getProfiles()` instance methods. Profiles stored in localStorage under `{storageKey}:profiles`. UI: name input + Save button + per-profile Load / Delete buttons. CustomEvents: `a11y:profilesave`, `a11y:profileload`, `a11y:profiledelete`.
- `saveProfiles`, `loadProfiles`, `clearProfiles` functions added to `storage.js` (100 % coverage).
- i18n keys: `profiles`, `profileNamePlaceholder`, `saveProfile`, `loadProfile`, `deleteProfile`, `noProfiles` in all 40 languages.
- TypeScript declarations for all profile methods and `a11y:profilesave` / `a11y:profileload` / `a11y:profiledelete` CustomEvent detail interfaces.

---

## [2.0.0] - 2026-02-17

### Added

- **F-001: TypeScript declarations** (`src/index.d.ts`, copied to `dist/` by Rollup). Full JSDoc on all exported types.
- **F-002: SSR guard**: `init()` returns `null` when `window` / `document` is undefined.
- **F-004: Widget-scoped `lang`/`dir`**: Widget root element carries `lang` and `dir` attributes; host page `<html>` attributes are never modified.
- **F-005: Custom icon URLs**: `toggleIconUrl` / `toggleIconHoverUrl` options for CSP-safe custom toggle icons.
- **F-006: CustomEvent analytics API**: 7 events dispatched on `window` — `a11y:init`, `a11y:toggle`, `a11y:open`, `a11y:close`, `a11y:reset`, `a11y:langchange`, `a11y:destroy`. All include `event.detail` payload with feature settings snapshot and timestamp.
- **F-007: Touch target size & safe-area insets**: Toggle button minimum 48 × 48 px; `env(safe-area-inset-*)` CSS offsets for iOS Safari.
- **F-008: `accessibilityStatementUrl` option**: When provided, renders a "View Accessibility Statement →" link in the panel footer.
- **F-101: Color Blindness Filters**: `deuteranopia`, `protanopia`, `tritanopia` toggle features using SVG `feColorMatrix` injected into `<head>`. Mutually exclusive via `conflictsWith` configuration.
- **F-102: Granular Typography**: `lineHeight`, `letterSpacing`, `wordSpacing` range controls (0 – 5 levels).
- **F-103 Layer 1 foundation**: Quick Start presets architecture.
- **F-104: Keyboard shortcut**: Default `Alt+A` opens the widget from anywhere on the page. Configurable via `keyboardShortcut` option; `aria-keyshortcuts` attribute on toggle button.
- **F-105: Focus Mode**: `focusMode` toggle dims `header`, `nav`, `aside`, `footer` to 0.08 opacity, leaving `main` / `[role="main"]` / `article` fully visible.
- **F-106: Mobile UX fixes**: Reading guide `touchmove` support; `largeCursor` auto-disabled on hover-incapable (touch-only) devices; `position` option for four viewport corners; CSS safe-area-inset offsets.
- **F-107: `prefers-reduced-motion` auto-activation**: `pauseAnimations` is auto-activated when OS prefers reduced motion (overridable by saved user preference).
- **F-108: i18n — section group labels**: Visual, Content, Navigation headers fully translated in all 40 languages.
- **F-109: Programmatic feature control**: `setFeature(id, value)` and `applySettings(settings)` instance methods.
- **F-110: Sensory-Friendly Mode** (architecture).
- **F-111: Zoom Lock Warning** (`showZoomLockWarning` option).
- **F-208: Development mode validation**: Unknown feature IDs, invalid position strings, and unregistered language codes warned via `console.warn` in non-production environments.
- 40-language i18n pack (up from 2 in v1.0.0). Languages added: zh, hi, es, fr, ar, bn, ru, pt, ur, id, de, pa, ja, mr, te, tl, vi, ms, ko, tr, sw, ta, fa, it, th, gu, pl, uk, nl, ro, el, hu, sv, cs, sr, kk, da, no.

### Changed

- **ARIA fix**: `role="menu"` moved from panel to content area (`_contentEl`) to satisfy `aria-required-children`. Language section uses `role="group"` with `aria-label`.
- **Critical fix**: Widget no longer overwrites host page `<html>` `lang` / `dir` attributes.
- **Major fix**: `destroy()` now calls `resetAllFeatures()` and restores original `lang` / `dir`.
- **Major fix**: Toggle switch CSS selector corrected (parent `.a11y-widget__item--active`).
- **Major fix**: Dark mode / high contrast CSS scoped to avoid universal-selector destructiveness.
- **Major fix**: Font range value display now uses a map (`_rangeValueEls`), not a single DOM reference.
- Package exports map updated with `"."`, `"./element"`, `"./css"`, and `"./dist/*"` entries.
- Rollup config generates: `dist/index.js` (ESM), `dist/index.cjs` (CJS), `dist/index.umd.js`, `dist/index.umd.min.js`.

### Removed

- Nothing removed. All v1.x public API surface is backward compatible.

---

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
