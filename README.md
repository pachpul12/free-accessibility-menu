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

-   14 optional interface adjustment features
-   Zero runtime dependencies (vanilla JS + CSS)
-   Keyboard operable menu
-   RTL and i18n support (English and Hebrew included)
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

AccessibilityWidget.init({
  defaultLanguage: 'en',
  languages: { en: 'English', he: 'עברית' }
});
```

**CommonJS (Node.js):**

```js
const AccessibilityWidget = require('free-accessibility-menu');
// CSS must be included separately in your build pipeline

AccessibilityWidget.init({
  defaultLanguage: 'en',
  languages: { en: 'English', he: 'עברית' }
});
```

### CDN (unpkg)

```html
<link rel="stylesheet" href="https://unpkg.com/free-accessibility-menu/dist/a11y-widget.css">
<script src="https://unpkg.com/free-accessibility-menu"></script>
<script>
  AccessibilityWidget.init({
    defaultLanguage: 'en',
    languages: { en: 'English', he: 'עברית' }
  });
</script>
```

### CDN (jsDelivr)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/free-accessibility-menu/dist/a11y-widget.css">
<script src="https://cdn.jsdelivr.net/npm/free-accessibility-menu"></script>
<script>
  AccessibilityWidget.init({
    defaultLanguage: 'en',
    languages: { en: 'English', he: 'עברית' }
  });
</script>
```

### Self-Hosted (Script Tag)

```html
<link rel="stylesheet" href="dist/a11y-widget.css">
<script src="dist/index.umd.min.js"></script>
<script>
  AccessibilityWidget.init({
    defaultLanguage: 'en',
    languages: { en: 'English', he: 'עברית' }
  });
</script>
```

## Setting the Initial Language

Pass `defaultLanguage` to `init()` with a two-letter BCP-47 language code to
open the widget UI in that language from the very first render:

```js
AccessibilityWidget.init({
  defaultLanguage: 'he',                        // start in Hebrew
  languages: { en: 'English', he: 'עברית' }
});
```

The widget renders its title, all feature labels, and the language selector in
the chosen language immediately — no user interaction required.

- **Default**: `'en'` (English) when `defaultLanguage` is omitted.
- **Built-in codes**: `'en'` (English) and `'he'` (Hebrew, RTL).
- **Custom languages**: register additional codes at runtime with
  `registerLanguage()` — see [Adding Languages](#adding-languages).

------------------------------------------------------------------------

## Features

| Feature | Group | Type | Description |
|---------|-------|------|-------------|
| High Contrast | Visual | Toggle | White background, black text, high-contrast borders |
| Dark Mode | Visual | Toggle | Dark colour scheme to reduce eye strain |
| Font Size | Visual | Range (0-5) | Scales text from 100% up to 175% |
| Pause Animations | Visual | Toggle | Stops CSS animations and transitions |
| Invert Colors | Visual | Toggle | Inverts all page colours via CSS filter |
| Dyslexia Font | Content | Toggle | Applies OpenDyslexic / Comic Sans font family |
| Underline Links | Content | Toggle | Underlines all hyperlinks with thick decoration |
| Hide Images | Content | Toggle | Hides images, SVGs, videos, and background images |
| Text Spacing | Content | Toggle | Increases line height, letter spacing, word spacing |
| Highlight Headings | Content | Toggle | Outlines h1-h6 with a blue border and background |
| Focus Outline | Navigation | Toggle | Adds a bright orange 3px outline on focused elements |
| Large Cursor | Navigation | Toggle | Enlarges the mouse cursor via custom SVG |
| Reading Guide | Navigation | Toggle | Horizontal bar follows the mouse to aid line tracking |
| Text to Speech | Navigation | Toggle | Click any text to hear it read aloud (Web Speech API) |

## API

### `AccessibilityWidget.init(options)`

Initializes the widget and appends it to the page. Returns the widget instance.

```js
var widget = AccessibilityWidget.init({
  // Language code for the initial UI language (default: 'en')
  defaultLanguage: 'en',

  // Map of language codes to display labels
  languages: { en: 'English', he: '\u05E2\u05D1\u05E8\u05D9\u05EA' },

  // Disable specific features (all enabled by default)
  features: {
    textToSpeech: false,   // hides TTS from the menu
    readingGuide: false    // hides reading guide
  },

  // Widget position: 'bottom-right' (default), 'bottom-left', etc.
  position: 'bottom-right',

  // Custom localStorage key (default: 'a11yWidgetSettings')
  storageKey: 'myAppA11y',

  // Callback when any feature is toggled
  onToggle: function (featureName, isActive) {
    console.log(featureName + ': ' + isActive);
  },

  // Callback when the menu opens
  onOpenMenu: function () {
    console.log('Menu opened');
  },

  // Callback when the menu closes
  onCloseMenu: function () {
    console.log('Menu closed');
  }
});
```

### `AccessibilityWidget.getInstance()`

Returns the current widget instance, or `null` if not initialized.

### `AccessibilityWidget.destroy()`

Removes the widget from the DOM, detaches all event listeners, and restores the original `lang`/`dir` attributes.

### Instance Methods

| Method | Description |
|--------|-------------|
| `widget.openMenu()` | Opens the accessibility panel |
| `widget.closeMenu()` | Closes the panel |
| `widget.toggleMenu()` | Toggles open/close |
| `widget.setLanguage(code)` | Switches UI language (e.g. `'he'`) |
| `widget.getSettings()` | Returns a copy of current feature states |
| `widget.resetAll()` | Resets all features to defaults, clears storage |
| `widget.destroy()` | Tears down the widget completely |

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

Register new languages at runtime using the i18n API:

```js
import { registerLanguage } from 'free-accessibility-menu/dist/a11y-widget.esm.js';

registerLanguage('fr', {
  menuTitle: 'Menu d\'accessibilit\u00e9',
  highContrast: 'Contraste \u00e9lev\u00e9',
  darkMode: 'Mode sombre',
  fontSize: 'Taille de police',
  // ... add all keys (see src/i18n.js for the full list)
  resetAll: 'R\u00e9initialiser',
  closeMenu: 'Fermer le menu',
  language: 'Langue',
  disclaimer: 'Ce widget ne garantit pas une conformit\u00e9 totale.'
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
  index.js          Entry point, singleton API
  widget.js         Core Widget class, DOM, events, lifecycle
  features.js       14 feature definitions and body-class logic
  storage.js        localStorage wrapper
  i18n.js           Translation registry and RTL detection
  a11y-widget.css   All styles (BEM, CSS variables, feature classes)
test/
  i18n.test.js      i18n module tests
  storage.test.js   Storage module tests
  features.test.js  Feature definitions and application tests
  widget.test.js    Widget integration tests
  a11y.test.js      axe-core accessibility tests
examples/
  index.html        Demo page
dist/
  a11y-widget.umd.js       UMD bundle
  a11y-widget.umd.min.js   Minified UMD bundle
  a11y-widget.esm.js       ES module bundle
  a11y-widget.css           Stylesheet
```

## Browser Support

Tested on modern versions of Chrome, Firefox, Edge, and Safari. The widget uses standard DOM APIs and should work in any browser that supports ES5, `classList`, `localStorage`, and `DOMParser`.

## Disclaimer

> **This widget does not guarantee full accessibility compliance.** It is provided "AS IS" without warranty of any kind. The widget helps implement various accessibility features but does NOT ensure compliance with ADA, WCAG, Section 508, or any other accessibility standard. It is the responsibility of site owners to test and ensure accessibility. No support or guarantee is provided; using this tool is at the user's own risk.

## License

[MIT](LICENSE)
