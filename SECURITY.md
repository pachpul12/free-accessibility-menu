# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 2.x (latest) | Yes — security fixes applied |
| 1.x | No — please upgrade to v2.x |

---

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

To report a security issue responsibly:

1. **Open a private GitHub Security Advisory** at:
   `https://github.com/pachpul12/free-accessibility-menu/security/advisories/new`

   This keeps the report private until a fix is released.

2. Alternatively, e-mail the maintainer directly. Find the contact address in the GitHub profile.

### What to include

- A description of the vulnerability and its potential impact.
- Steps to reproduce or a proof-of-concept (PoC) — a minimal HTML page or test case is ideal.
- Affected version(s).
- Any suggested mitigation or fix, if you have one.

### What to expect

- **Acknowledgement** within 72 hours.
- **Status update** within 7 days (triaged / confirmed / dismissed).
- **Fix and advisory** published within 30 days for confirmed vulnerabilities, sooner for critical issues.
- Credit in the release notes and security advisory (unless you prefer to remain anonymous).

---

## Security Model

Free Accessibility Menu is a **client-side, zero-dependency** JavaScript widget. Its security model is:

### What the widget does

- Reads from and writes to `localStorage` (or the configured storage backend) to persist user preferences.
- Modifies CSS classes on `document.body` to apply accessibility effects.
- Injects a small SVG element into `document.head` for colour-blindness filters (once per init).
- Listens to `mousemove`, `touchmove`, `keydown`, and `click` events for interactive features (reading guide, TTS, keyboard shortcut).
- Dispatches `CustomEvent`s on `window` for analytics integrations.
- Uses `window.speechSynthesis` (Web Speech API) when the Text to Speech feature is active.

### What the widget does NOT do

- Make any network requests (no `fetch`, `XHR`, `WebSocket`, or `<script>` injection).
- Read or exfiltrate user data (no analytics, no tracking, no beacons).
- Modify the host page's DOM in ways that alter semantic meaning or ARIA attributes.
- Load third-party scripts or stylesheets.
- Use `eval()`, `Function()`, `innerHTML` with untrusted content, or any dynamic code execution.
- Store sensitive data: the only values persisted are feature on/off states and range levels.

### Content-Security-Policy (CSP) compatibility

The widget is designed to work within strict CSP environments:

| Directive | Required value | Notes |
|---|---|---|
| `script-src` | Your own origin (or CDN URL) | No `unsafe-eval` or `unsafe-inline` needed for script |
| `style-src` | `'unsafe-inline'` | The widget sets `element.style.*` properties directly (e.g. `--a11y-primary` CSS variable); no external stylesheets are loaded |
| `img-src` | `data:` | The default toggle icon is an inline data URI; pass `toggleIconUrl` to use a hosted image instead |
| `connect-src` | *(none required)* | No network requests are made |

If your CSP prohibits `data:` image sources, supply `toggleIconUrl` and `toggleIconHoverUrl` options pointing to hosted image assets.

### `localStorage` usage

The widget stores only two keys (configurable via the `storageKey` option):

- `a11yWidgetSettings` — a JSON object mapping feature IDs to their current values (`boolean` or `number`).
- `a11yWidgetSettings:profiles` — a JSON object of user-saved profiles.

Both keys contain no personal data and are scoped to the origin. Stored data is validated and sanitised on read; unexpected values fall back to defaults.

### Dependency supply-chain

The **production bundle** has zero runtime dependencies. All `devDependencies` (Rollup, Jest, Babel, ESLint, axe-core) are development-only and are not included in the published npm package.

---

## Known Limitations

- **Third-party code injection via `localStorage`**: If an attacker can already write arbitrary values to `localStorage` on the same origin, they control a wide attack surface beyond this widget. Sanitize and validate any `localStorage` reads before acting on them — the widget does this for its own keys.
- **Text to Speech (`speechSynthesis`)**: The widget passes selected DOM text to `speechSynthesis.speak()`. This is a platform API; no data leaves the browser. However, if the host page contains attacker-controlled text in the DOM and TTS is activated, that text will be spoken. This is expected behaviour.
- **`innerHTML` for SVG icons**: Feature icons are predefined SVG strings in `src/features.js`. They are authored in source and not derived from user input. No runtime user data is passed to `innerHTML`.
