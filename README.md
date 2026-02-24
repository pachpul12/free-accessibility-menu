# Free Accessibility Menu

A free, lightweight, client-side accessibility menu widget.

This project provides **user-controlled interface adjustments**
(contrast, font size, reading aids, etc.) that may help improve
usability for some users.

It is a **UI enhancement tool**, not a compliance solution.

------------------------------------------------------------------------

## ⚠️ Important Legal Notice

This project:

-   **Does NOT guarantee compliance** with WCAG, ADA, EN 301 549,
    Israeli accessibility regulations, Section 508, or any other legal
    standard worldwide.
-   **Does NOT replace a professional accessibility audit.**
-   **Does NOT constitute legal advice.**
-   **Does NOT protect against accessibility-related claims or
    lawsuits.**

Website owners remain solely responsible for implementing, testing, and
maintaining full accessibility compliance in accordance with applicable
laws and standards.

Use of this software is entirely at your own risk.

------------------------------------------------------------------------

## What This Project Is

-   A client-side accessibility menu
-   A collection of optional visual and reading adjustments
-   A usability enhancement layer
-   A zero-dependency JavaScript widget

------------------------------------------------------------------------

## What This Project Is NOT

-   Not a legal compliance framework\
-   Not an ADA/WCAG certification tool\
-   Not a substitute for proper semantic HTML, ARIA, keyboard handling,
    or accessible design\
-   Not a shield against lawsuits

Accessibility compliance requires proper development practices across
the entire website.

------------------------------------------------------------------------

## Features

-   28 optional interface adjustment features
-   Zero runtime dependencies (vanilla JS + CSS)
-   Keyboard operable menu
-   RTL and i18n support (40 built-in languages: English, Hebrew, Chinese, Spanish, Arabic, Portuguese, French, German, Japanese, Russian, Hindi, Bengali, Punjabi, Indonesian, Urdu, Turkish, Vietnamese, Korean, Italian, Persian, Thai, Tamil, Marathi, Telugu, Gujarati, Polish, Malay, Dutch, Filipino, Ukrainian, Swahili, Swedish, Danish, Romanian, Greek, Czech, Hungarian, Kazakh, Serbian, Norwegian)
-   LocalStorage-based persistence
-   No tracking, no cookies, no external calls
-   Automated accessibility testing included in the test suite
    (axe-core)

------------------------------------------------------------------------

## Responsibility of Integrators

If you integrate this widget into a website:

You are responsible for:

-   Ensuring semantic HTML structure
-   Ensuring proper ARIA usage
-   Ensuring full keyboard navigation across your site
-   Providing text alternatives for media
-   Testing with assistive technologies
-   Performing WCAG audits if required
-   Consulting accessibility professionals when necessary

This widget does not evaluate or modify your site's structural
accessibility.

------------------------------------------------------------------------

## Accessibility Testing

This project includes automated accessibility testing using `axe-core`
within the test suite.

Automated testing does not guarantee legal compliance.

Manual accessibility testing is always required for full compliance.

------------------------------------------------------------------------

## Browser Support

Tested on modern versions of Chrome, Firefox, Edge, and Safari.

------------------------------------------------------------------------

## No Warranty / Limitation of Liability

To the maximum extent permitted by applicable law:

-   This software is provided **"AS IS"**.
-   The author makes **no warranties**, express or implied.
-   The author shall **not be liable for any claim, damages, losses, or
    other liability**, whether in contract, tort, or otherwise, arising
    from or related to the use of this software.
-   The author assumes no responsibility for how this software is used.

If you require legally guaranteed accessibility compliance, you must
engage qualified accessibility and legal professionals.

------------------------------------------------------------------------

## Quick Start

### npm / yarn

```bash
npm install free-accessibility-menu
# or
yarn add free-accessibility-menu
```

**ESM (recommended for modern bundlers):**

```js
import AccessibilityWidget from 'free-accessibility-menu';
import 'free-accessibility-menu/css';

AccessibilityWidget.init({ defaultLanguage: 'en' });
```

**CommonJS (Node.js):**

```js
const AccessibilityWidget = require('free-accessibility-menu');
// CSS must be included separately in your build pipeline

AccessibilityWidget.init({ defaultLanguage: 'en' });
```

### CDN (unpkg)

Add the stylesheet in `<head>` and load the script with `defer` so it never
blocks page render. The inline init script uses `DOMContentLoaded` as a
belt-and-suspenders guard for environments that strip `defer`.

```html
<head>
  <!-- CSS must be in <head> to prevent a flash of unstyled content -->
  <link rel="stylesheet" href="https://unpkg.com/free-accessibility-menu@2.9.0/dist/a11y-widget.css">
</head>
<body>
  <!-- defer keeps the parser unblocked; the script executes after HTML is parsed -->
  <script defer src="https://unpkg.com/free-accessibility-menu@2.9.0/dist/index.umd.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      AccessibilityWidget.init({ defaultLanguage: 'en' });
    });
  </script>
</body>
```

> **Tip — pin to a specific version** (shown above as `@2.9.0`) so that breaking
> changes in future releases cannot affect your page automatically.
> Remove the version tag to always pull the latest release.

### CDN (jsDelivr)

```html
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/free-accessibility-menu@2.9.0/dist/a11y-widget.css">
</head>
<body>
  <script defer src="https://cdn.jsdelivr.net/npm/free-accessibility-menu@2.9.0/dist/index.umd.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      AccessibilityWidget.init({ defaultLanguage: 'en' });
    });
  </script>
</body>
```

### Self-Hosted (Script Tag)

```html
<head>
  <link rel="stylesheet" href="dist/a11y-widget.css">
</head>
<body>
  <script defer src="dist/index.umd.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      AccessibilityWidget.init({ defaultLanguage: 'en' });
    });
  </script>
</body>
```

## Setting the Initial Language

Pass `defaultLanguage` to `init()` with a two-letter BCP-47 language code to
open the widget UI in that language from the very first render:

```js
AccessibilityWidget.init({
  defaultLanguage: 'he',   // start in Hebrew
});
```

The widget renders its title, all feature labels, and the language selector in
the chosen language immediately — no user interaction required.

- **Default**: `'en'` (English) when `defaultLanguage` is omitted.
- **Built-in codes**:

  | Code | Language          | Direction |
  |------|-------------------|-----------|
  | `en` | English           | LTR       |
  | `zh` | Chinese           | LTR       |
  | `hi` | Hindi             | LTR       |
  | `es` | Spanish           | LTR       |
  | `fr` | French            | LTR       |
  | `ar` | Arabic            | RTL       |
  | `bn` | Bengali           | LTR       |
  | `ru` | Russian           | LTR       |
  | `pt` | Portuguese        | LTR       |
  | `ur` | Urdu              | RTL       |
  | `id` | Indonesian        | LTR       |
  | `de` | German            | LTR       |
  | `pa` | Punjabi           | LTR       |
  | `ja` | Japanese          | LTR       |
  | `mr` | Marathi           | LTR       |
  | `te` | Telugu            | LTR       |
  | `tl` | Filipino/Tagalog  | LTR       |
  | `vi` | Vietnamese        | LTR       |
  | `ms` | Malay             | LTR       |
  | `ko` | Korean            | LTR       |
  | `tr` | Turkish           | LTR       |
  | `sw` | Swahili           | LTR       |
  | `ta` | Tamil             | LTR       |
  | `fa` | Persian/Farsi     | RTL       |
  | `it` | Italian           | LTR       |
  | `th` | Thai              | LTR       |
  | `gu` | Gujarati          | LTR       |
  | `pl` | Polish            | LTR       |
  | `uk` | Ukrainian         | LTR       |
  | `nl` | Dutch             | LTR       |
  | `ro` | Romanian          | LTR       |
  | `el` | Greek             | LTR       |
  | `hu` | Hungarian         | LTR       |
  | `sv` | Swedish           | LTR       |
  | `cs` | Czech             | LTR       |
  | `sr` | Serbian           | LTR       |
  | `kk` | Kazakh            | LTR       |
  | `he` | Hebrew            | RTL       |
  | `da` | Danish            | LTR       |
  | `no` | Norwegian         | LTR       |

- **Custom languages**: register additional codes at runtime with
  `registerLanguage()` — see [Adding Languages](#adding-languages).

------------------------------------------------------------------------

## Features

28 optional interface adjustment features across four groups.

### Visual Adjustments

| Feature ID | Type | Description |
|---|---|---|
| `highContrast` | Toggle | White background, black text, high-contrast borders |
| `darkMode` | Toggle | Dark colour scheme to reduce eye strain |
| `fontSize` | Range (0–5) | Scales text from 100 % up to 175 % |
| `pauseAnimations` | Toggle | Stops CSS animations and transitions |
| `invertColors` | Toggle | Inverts all page colours via CSS `invert()` filter |
| `deuteranopia` | Toggle | SVG colour-matrix correction for green-blind users |
| `protanopia` | Toggle | SVG colour-matrix correction for red-blind users |
| `tritanopia` | Toggle | SVG colour-matrix correction for blue-blind users |
| `saturation` | Range (0–5) | De-saturates page colours (0 = greyscale) |
| `brightness` | Range (0–5) | Reduces screen brightness for photosensitive users |

### Content Adjustments

| Feature ID | Type | Description |
|---|---|---|
| `dyslexiaFont` | Toggle | Applies OpenDyslexic / dyslexia-friendly font family |
| `readableFont` | Toggle | High-legibility system-native font stack |
| `underlineLinks` | Toggle | Underlines all hyperlinks with a thick text decoration |
| `hideImages` | Toggle | Hides images, SVGs, videos, and background images |
| `textSpacing` | Toggle | Applies WCAG minimum text spacing values |
| `highlightHeadings` | Toggle | Outlines h1–h6 elements with a border and background |
| `lineHeight` | Range (0–5) | Independent line-height control |
| `letterSpacing` | Range (0–5) | Independent letter-spacing control |
| `wordSpacing` | Range (0–5) | Independent word-spacing control |
| `highlightHover` | Toggle | Highlights the paragraph under the pointer |
| `suppressNotifications` | Toggle | CSS-only suppression of common chat widgets and banners |
| `reducedTransparency` | Toggle | Removes backdrop-filter and transparency effects |
| `sensoryFriendly` | Toggle | Combined motion + colour + notification reduction |

### Navigation Aids

| Feature ID | Type | Description |
|---|---|---|
| `focusOutline` | Toggle | Adds a bright orange 3 px outline on focused elements |
| `largeCursor` | Toggle | Enlarges the mouse cursor via a custom SVG data URI |
| `readingGuide` | Toggle | Horizontal bar follows the mouse to aid line tracking |
| `textToSpeech` | Toggle | Click any text to have it read aloud (Web Speech API) |
| `focusMode` | Toggle | Dims non-content regions (header/nav/aside/footer) |

## WCAG Conformance

The widget's own UI conforms to WCAG 2.2 Level AA. See
[`docs/accessibility-conformance-report.md`](docs/accessibility-conformance-report.md)
for the full Accessibility Conformance Report (ACR).

The features above provide user-controlled adjustments that **assist** with the following WCAG Success Criteria on the host page:

| Feature | WCAG SC Assisted | Level |
|---|---|---|
| High Contrast | 1.4.3 Contrast (Minimum) | AA |
| Dark Mode | 1.4.3 Contrast (Minimum) | AA |
| Font Size | 1.4.4 Resize Text | AA |
| Pause Animations | 2.3.3 Animation from Interactions | AAA |
| Invert Colors | 1.4.3 Contrast (Minimum) | AA |
| Deuteranopia / Protanopia / Tritanopia filters | 1.4.1 Use of Color | A |
| Dyslexia Font / Readable Font | 1.4.8 Visual Presentation | AAA |
| Underline Links | 1.4.1 Use of Color | A |
| Text Spacing | 1.4.12 Text Spacing | AA |
| Line Height / Letter Spacing / Word Spacing | 1.4.12 Text Spacing | AA |
| Highlight Headings | 1.3.1 Info and Relationships | A |
| Focus Outline | 2.4.7 Focus Visible | AA |
| Reading Guide | 2.4.3 Focus Order | A |
| Focus Mode | 1.4.3 Contrast (Minimum) | AA |

> **Important:** These are user-activated preferences, not automatic remediations. They do not make host pages WCAG-conformant. Site owners remain responsible for the accessibility of their own content.

## API

### `AccessibilityWidget.init(options)`

Initializes the widget and appends it to the page. Returns the widget instance.

```js
var widget = AccessibilityWidget.init({
  // Language code for the initial UI language (default: 'en')
  defaultLanguage: 'en',

  // Disable specific features (all 28 are enabled by default)
  features: {
    textToSpeech: false,   // hides TTS from the menu
    readingGuide: false    // hides reading guide
  },

  // Widget position: 'bottom-right' (default), 'bottom-left', 'top-right', 'top-left'
  position: 'bottom-right',

  // Custom localStorage key (default: 'a11yWidgetSettings')
  storageKey: 'myAppA11y',

  // Storage backend: 'localStorage' (default), 'sessionStorage', 'none', or custom object
  storage: 'localStorage',

  // URL of your site's accessibility statement (renders a link in the panel footer)
  accessibilityStatementUrl: '/accessibility',

  // Keyboard shortcut to toggle the menu (default: 'Alt+A'; false = disabled)
  keyboardShortcut: 'Alt+A',

  // Show quick-start preset buttons (default: true)
  showPresets: true,

  // Show language switcher in the panel (default: true)
  showLanguageSwitcher: true,

  // Show first-visit tooltip (default: true; suppressed if settings already exist)
  showTooltip: true,

  // Enable development-mode alt text audit (default: auto-detects NODE_ENV)
  devMode: false,

  // Callback when any feature is toggled
  onToggle: function (featureId, newValue) {
    console.log(featureId + ': ' + newValue);
  },

  // Callback when the menu opens
  onOpenMenu: function () { console.log('Menu opened'); },

  // Callback when the menu closes
  onCloseMenu: function () { console.log('Menu closed'); },
});
```

### `AccessibilityWidget.getInstance()`

Returns the current widget instance, or `null` if not initialized.

### `AccessibilityWidget.destroy()`

Removes the widget from the DOM, detaches all event listeners, and restores the original `lang`/`dir` attributes.

### `AccessibilityWidget.getReport()`

Returns an in-session usage report object (feature activation counts, timestamps), or `null` if no instance exists.

### Instance Methods

| Method | Description |
|---|---|
| `widget.openMenu()` | Opens the accessibility panel |
| `widget.closeMenu()` | Closes the panel |
| `widget.toggleMenu()` | Toggles open/close |
| `widget.setLanguage(code)` | Switches UI language (e.g. `'he'`) |
| `widget.getSettings()` | Returns a snapshot of current feature states |
| `widget.setFeature(id, value)` | Programmatically set a feature on/off or to a range value |
| `widget.applySettings(settings)` | Apply a batch of feature values at once |
| `widget.resetAll()` | Resets all features to defaults and clears storage |
| `widget.saveProfile(name)` | Saves current settings as a named profile |
| `widget.loadProfile(name)` | Restores a previously saved profile |
| `widget.deleteProfile(name)` | Deletes a named profile |
| `widget.getProfiles()` | Returns an object of all saved profiles |
| `widget.getReport()` | Returns the session usage report |
| `widget.destroy()` | Tears down the widget completely |

### CustomEvents

The widget dispatches namespaced `CustomEvent`s on `window`:

| Event | `event.detail` | Fired when |
|---|---|---|
| `a11y:init` | `{ settings }` | Widget mounted to DOM |
| `a11y:toggle` | `{ featureId, value, settings }` | A feature is enabled/disabled/adjusted |
| `a11y:open` | `{}` | Panel opens |
| `a11y:close` | `{}` | Panel closes |
| `a11y:reset` | `{ settings }` | All features reset to defaults |
| `a11y:langchange` | `{ language }` | Active language changes |
| `a11y:destroy` | `{}` | Widget about to be torn down |
| `a11y:profilesave` | `{ name, settings }` | A profile is saved |
| `a11y:profileload` | `{ name, settings }` | A profile is loaded |
| `a11y:profiledelete` | `{ name }` | A profile is deleted |

```js
window.addEventListener('a11y:toggle', function (e) {
  console.log(e.detail.featureId, '→', e.detail.value);
});
```

### Web Component

An `<a11y-menu>` custom element is available as a zero-config HTML integration:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/free-accessibility-menu/dist/a11y-widget.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/free-accessibility-menu/dist/element.js"></script>
<a11y-menu config='{"defaultLanguage":"fr","showTooltip":false}'></a11y-menu>
```

The `config` attribute accepts a JSON string of `WidgetOptions`. The element re-initialises the widget when the attribute changes, making it compatible with SPA router-managed page transitions.

### Named Exports (ESM)

```js
import {
  registerLanguage,
  getAvailableLanguages,
  getNativeName,
  isRTL,
  setStorageMode,
  getStorageMode,
} from 'free-accessibility-menu';
```

| Export | Description |
|---|---|
| `registerLanguage(code, translations)` | Add a custom language at runtime |
| `getAvailableLanguages()` | Returns an array of all registered language codes |
| `getNativeName(code)` | Returns the native name of a language (e.g. `'עברית'` for `'he'`) |
| `isRTL(code)` | Returns `true` if the language is right-to-left |
| `setStorageMode(mode)` | Switch storage backend: `'localStorage'`, `'sessionStorage'`, `'none'`, or a custom object |
| `getStorageMode()` | Returns the current storage backend object |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus to / away from the widget |
| `Enter` / `Space` | Open/close menu, toggle features |
| `Arrow Down` | Move to next menu item (wraps) |
| `Arrow Up` | Move to previous menu item (wraps) |
| `Home` | Jump to first menu item |
| `End` | Jump to last menu item |
| `Escape` | Close menu, return focus to toggle button |

## Adding Languages

The 40 languages listed above are built-in. Register additional languages at
runtime using the i18n API:

```js
import { registerLanguage } from 'free-accessibility-menu/dist/a11y-widget.esm.js';

registerLanguage('it', {
  menuTitle: 'Menu di accessibilit\u00e0',
  highContrast: 'Alto contrasto',
  darkMode: 'Modalit\u00e0 scura',
  fontSize: 'Dimensione carattere',
  // ... add all keys (see src/i18n.js for the full list)
  resetAll: 'Reimposta tutto',
  closeMenu: 'Chiudi menu',
  language: 'Lingua',
  disclaimer: 'Questo widget non garantisce la piena conformit\u00e0 all\u2019accessibilit\u00e0.'
});
```

Missing keys automatically fall back to English.

## CSS Customization

Override CSS custom properties on the `.a11y-widget` selector:

```css
.a11y-widget {
  --a11y-primary: #0066cc;         /* Primary accent colour */
  --a11y-primary-hover: #004999;   /* Hover state */
  --a11y-bg: #ffffff;              /* Panel background */
  --a11y-bg-dark: #1e1e1e;        /* Panel background in dark mode */
  --a11y-text: #333333;           /* Text colour */
  --a11y-text-dark: #f0f0f0;      /* Text colour in dark mode */
  --a11y-border: #e0e0e0;         /* Border colour */
  --a11y-active-bg: #e8f0fe;      /* Active item background */
  --a11y-shadow: 0 4px 20px rgba(0,0,0,0.15);
  --a11y-radius: 12px;            /* Panel border radius */
  --a11y-toggle-size: 42px;       /* Toggle button size */
}
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint
npm run lint

# Build (UMD + ESM + minified)
npm run build

# Dev mode with file watching
npm run dev
```

### Project Structure

```
src/
  index.js          Entry point, singleton API (init/getInstance/destroy)
  widget.js         Core Widget class — DOM, events, lifecycle, profiles
  features.js       28 feature definitions and body-class logic
  element.js        <a11y-menu> Web Component wrapper
  storage.js        Swappable storage backend (localStorage / sessionStorage / none / custom)
  i18n.js           Translation registry — 40 languages, RTL detection
  a11y-widget.css   All styles (BEM, CSS variables, feature classes)
  index.d.ts        TypeScript declarations
docs/
  accessibility-conformance-report.md   WCAG 2.2 AA conformance report
test/
  i18n.test.js          i18n module tests
  storage.test.js       Storage module tests
  features.test.js      Feature definitions and application tests
  widget.test.js        Widget integration tests (400+ cases)
  a11y.test.js          axe-core accessibility tests
  visual-features.test.js   Visual feature rendering tests
  example-page.test.js      Example page integration tests
  themes-page.test.js       Themes example page tests
dist/
  index.js            ESM bundle
  index.cjs           CJS bundle (Node.js require())
  index.umd.js        UMD bundle (unminified)
  index.umd.min.js    UMD bundle (minified, for CDNs)
  element.js          Web Component — ESM
  element.umd.min.js  Web Component — UMD minified
  a11y-widget.css     Stylesheet
  index.d.ts          TypeScript declarations
```

## Browser Support

Tested on modern versions of Chrome, Firefox, Edge, and Safari. The widget uses standard DOM APIs and should work in any browser that supports ES5, `classList`, `localStorage`, and `DOMParser`.

## Disclaimer

> **This widget does not guarantee full accessibility compliance.** It is provided "AS IS" without warranty of any kind. The widget helps implement various accessibility features but does NOT ensure compliance with ADA, WCAG, Section 508, or any other accessibility standard. It is the responsibility of site owners to test and ensure accessibility. No support or guarantee is provided; using this tool is at the user's own risk.

## License

[MIT](LICENSE)
