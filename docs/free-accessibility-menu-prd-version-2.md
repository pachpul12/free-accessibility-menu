# Free Accessibility Menu — Product Requirements Document
## Version 2.0

**Date:** February 2026
**Status:** Draft for Review
**Authors:** Synthesized from Competitive Analysis, UX Research, Business Analysis, Customer Success, Sales Engineering, Product Management, and Trend Analysis research

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Strategic Positioning](#2-product-vision--strategic-positioning)
3. [Market Context & Regulatory Drivers](#3-market-context--regulatory-drivers)
4. [Competitive Landscape](#4-competitive-landscape)
5. [Target Users & Personas](#5-target-users--personas)
6. [v2.0 Feature Requirements](#6-v20-feature-requirements)
   - [P0 — Must Ship](#p0--must-ship-architectural-prerequisites--critical-fixes)
   - [P1 — High Priority](#p1--high-priority-new-features)
   - [P2 — Standard Priority](#p2--standard-priority-enhancements)
   - [P3 — Future / Post-v2.0](#p3--future--post-v20)
7. [Technical Requirements](#7-technical-requirements)
8. [UX & Accessibility Requirements](#8-ux--accessibility-requirements)
9. [Developer Experience Requirements](#9-developer-experience-requirements)
10. [Platform & Ecosystem Integration](#10-platform--ecosystem-integration)
11. [Breaking Changes Policy & Migration Strategy](#11-breaking-changes-policy--migration-strategy)
12. [Success Metrics](#12-success-metrics)
13. [Non-Goals for v2.0](#13-non-goals-for-v20)

---

## 1. Executive Summary

Free Accessibility Menu is a pure vanilla JS/CSS accessibility preference widget with zero runtime dependencies. Version 1.1.0 shipped 14 features across 5 files with 98%+ test coverage, full WAI-ARIA compliance, 40-language i18n, and RTL support.

**Version 2.0 objectives:**

1. **Developer adoption**: Add TypeScript declarations, React/Vue adapters, SSR compatibility, and a proper event system — removing every friction point that prevents professional developers from adopting the package.
2. **Feature parity with paid tools on key dimensions**: Add color blindness filters, cognitive accessibility features, granular typography controls, profile presets, and keyboard shortcuts — closing the gaps that matter most to end users.
3. **Architectural sustainability**: Introduce a plugin architecture enabling modular feature loading, custom feature registration, and a future ecosystem of community-built extensions.
4. **Trust & positioning**: Explicitly differentiate from the discredited "overlay" category through transparent documentation, honest claims, and a published WCAG conformance report.

The v2.0 release should position `free-accessibility-menu` as the definitive developer-first accessibility preference panel: free, zero-dependency, framework-agnostic, and built with the honesty and craft that the paid overlay market has repeatedly failed to deliver.

---

## 2. Product Vision & Strategic Positioning

### 2.1 Positioning Statement

> **Free Accessibility Menu is the honest accessibility widget**: it gives real users real control over real CSS — with zero dependencies, full source transparency, and no compliance snake oil. The only free, npm-native, framework-agnostic accessibility preference panel with 40+ languages, full WAI-ARIA compliance, and axe-core verified quality.

### 2.2 What This Product Is (and Is Not)

**What it is:**
- A user-controlled preference panel that modifies the visual presentation of any website
- A client-side, localStorage-backed state manager for accessibility settings
- A well-tested, WAI-ARIA compliant, keyboard-navigable UI widget
- An MIT-licensed, zero-dependency, self-hostable open source library

**What it is NOT:**
- An "accessibility overlay" that auto-remediates inaccessible code
- A WCAG compliance solution — it does not make any page compliant
- An AI system that patches DOM structure, ARIA attributes, or alt text
- A replacement for accessible design and development practices

This distinction must appear prominently in README, documentation, and website copy to differentiate from the commercially discredited overlay category.

### 2.3 Strategic Differentiation (vs. Paid Competitors)

| Differentiator | Free Accessibility Menu | Paid Overlays (accessiBe, UserWay) |
|---|---|---|
| Pricing | Free forever (MIT) | $49–$199/month |
| Privacy | Zero data collection, no CDN beacons | Sends usage data to vendor CDN |
| Self-hostable | Yes | No (CDN-only) |
| Source auditable | Yes (MIT, open source) | No (proprietary) |
| DOM remediation claims | None (honest) | Yes (frequently false) |
| AT compatibility risk | Low (no DOM patching) | High (known AT conflicts) |
| Bundle size | <30KB gzip | 200–500KB |
| Framework support (v2.0) | React, Vue, vanilla, CDN | CDN only |

---

## 3. Market Context & Regulatory Drivers

### 3.1 Legal Landscape

- **Americans with Disabilities Act (ADA)**: US web accessibility lawsuits exceed 4,000/year. Overlays do not constitute a legal defense (established by Robles v. Domino's, Murphy v. Samara Brothers).
- **European Accessibility Act (EAA)**: Mandatory for new digital products from **June 2025**; existing products must comply by **June 2027**. Covers all B2C digital services in EU member states.
- **Section 508 (US Federal)**: Applies to all US federal agency websites and federally funded digital services.
- **EN 301 549 (EU standard)**: References WCAG 2.1 AA as the baseline, with WCAG 2.2 increasingly cited.
- **UK Equality Act / PSBAR**: UK public sector websites must meet WCAG 2.1 AA.

### 3.2 WCAG 2.2 New Success Criteria Addressed in v2.0

| SC | Title | Level | Addressed by |
|---|---|---|---|
| 2.4.11 | Focus Appearance | AA | Enhanced focus outline feature |
| 2.5.7 | Draggable Components | AA | Draggable widget position |
| 2.5.8 | Target Size (Minimum) | AA | Larger toggle/control buttons (48px) |

### 3.3 The Overlay Backlash Opportunity

The Overlay Fact Sheet (signed by 800+ accessibility professionals including WCAG authors) explicitly warns against overlay products. This has created a trust vacuum that an honest, transparent, open-source tool can fill. Version 2.0 should capitalize on this positioning by publishing a WCAG Conformance Table for the widget's own UI and explicitly acknowledging what the widget does and does not do.

---

## 4. Competitive Landscape

### 4.1 Feature Gap Analysis

The following capabilities exist in paid tools but are **absent from all significant open-source alternatives**, making them high-priority differentiation opportunities for v2.0:

| Gap | Present in Paid Tools | v2.0 Priority |
|---|---|---|
| Color blindness filters (deuteranopia, protanopia, tritanopia) | accessiBe, UserWay, EqualWeb | P1 |
| Granular typography (line height, letter spacing, word spacing) | All major paid tools | P1 |
| Accessibility profile presets (Low Vision, Dyslexia, ADHD) | FACIL'iti, accessiBe, UserWay | P1 |
| Keyboard shortcut to open widget | UserWay (Alt+1) | P1 |
| Readable/legible font mode (system sans-serif override) | UserWay, EqualWeb | P2 |
| Brightness/saturation sliders | accessiBe, EqualWeb, AudioEye | P2 |
| Configurable widget position (4 corners) | UserWay, EqualWeb | P1 |
| Focus mode / distraction reduction | FACIL'iti | P1 |
| Natural-voice TTS improvements | Recite Me | P2 |
| Language auto-detect from browser/document | accessiBe, UserWay | P2 |

### 4.2 Where We Already Win

- Only zero-dependency, framework-agnostic, npm-publishable free widget
- More built-in languages than most paid competitors (40 languages)
- axe-core integration tests — more rigorous QA than any paid competitor's widget
- Self-hostable (GDPR/CCPA compliant by design — no third-party data transmission)
- MIT licensed — embeddable in any commercial project without vendor agreements
- No DOM remediation claims that conflict with native AT

---

## 5. Target Users & Personas

### 5.1 End Users (Widget Consumers)

| Persona | Primary Need | Key Features |
|---|---|---|
| Low Vision User | High contrast, larger text, focus visibility | highContrast, fontSize, focusOutline |
| Dyslexia / Reading Difficulty | Alternative fonts, spacing, reading aids | dyslexiaFont, textSpacing, readingGuide |
| Color Blind User | Color-safe filtering | colorBlindMode (new v2.0) |
| ADHD / Cognitive | Distraction reduction, focus aids | focusMode (new), pauseAnimations, readingGuide |
| Motor Impaired | Large targets, keyboard-only nav | largeCursor, focusOutline, switchAccess (new) |
| Low Vision + Migraine | Dark mode, reduced motion | darkMode, pauseAnimations |
| Elderly / General Aging | Larger text, higher contrast | fontSize, highContrast, largeCursor |

### 5.2 Developers (Widget Integrators)

| Persona | Primary Need | Key Requirement |
|---|---|---|
| React/Next.js Developer | Idiomatic integration, SSR safe | React adapter, SSR guard |
| Vue/Nuxt Developer | Composition API, SSR safe | Vue plugin, SSR guard |
| TypeScript Developer | Type safety, IDE support | `.d.ts` declarations |
| Agency Developer | White-label, client configs | Branding options, config API |
| Enterprise Developer | CSP compliance, audit support | CSP nonce, VPAT, security docs |
| CMS Developer | WordPress/Shopify integration | WP plugin, CDN UMD build |
| Vanilla HTML Developer | Simple CDN drop-in | `<script>` tag usage |

---

## 6. v2.0 Feature Requirements

### P0 — Must Ship: Architectural Prerequisites & Critical Fixes

---

#### F-001: TypeScript Declarations (.d.ts)

**Problem:** TypeScript has become the default for serious JavaScript projects (78%+ of new projects as of 2025). The absence of type definitions forces TS developers to write `declare module` stubs or accept `any` throughout. This is the single largest adoption blocker for the professional developer audience.

**Solution:** Generate TypeScript declaration files from JSDoc annotations (already present in source) via `tsc --declaration`. Publish with a `"types"` field in `package.json`.

**Required types:**
- `WidgetOptions` — full `init()` configuration interface
- `WidgetInstance` — all instance methods with typed signatures
- `FeatureDefinition` — feature config structure
- `FeatureId` — string union type of all 14 feature IDs
- `LanguageCode` — string union for all 40 built-in language codes
- `A11yPlugin` — plugin API contract (for plugin architecture)
- `FeatureSettings` — `Record<FeatureId, boolean | number>`

**Acceptance criteria:**
- `import AccessibilityWidget from 'free-accessibility-menu'` works in a TypeScript project with `strict: true`
- All public API methods have typed parameters and return types
- `package.json` includes `"types": "dist/index.d.ts"`
- No `any` types in the public API surface

**Effort:** Low (3–5 days; JSDoc is already present)

---

#### F-002: SSR Compatibility Guard

**Problem:** `init()` calls `document.body.appendChild()`, `localStorage.getItem()`, and `document.addEventListener()` — all of which throw on Node.js. This makes the package completely incompatible with Next.js App Router, Nuxt, SvelteKit, and any SSR framework where components execute server-side.

**Solution:** Add a browser environment guard at the top of `init()`:

```js
init(options) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[AccessibilityWidget] init() was called outside a browser environment and was skipped.');
    }
    return null;
  }
  // ... existing logic
}
```

Also update `WidgetOptions` TypeScript type: `init()` returns `WidgetInstance | null`.

**Acceptance criteria:**
- `import AccessibilityWidget from 'free-accessibility-menu'` in a Node.js environment does not throw
- `AccessibilityWidget.init()` called during SSR returns `null` and logs a warning in development
- `AccessibilityWidget.getInstance()` returns `null` if init was skipped
- Tests in a Node-only environment pass

**Effort:** Very low (1–2 hours)

---

#### F-003: Plugin Architecture

**Problem:** At 14 features and a roadmap of 8+ more, the monolithic `features.js` approach becomes untenable. The tight coupling of `readingGuide` and `textToSpeech` special-cases inside `widget.js` must be encapsulated. Custom feature registration is consistently requested by developers.

**Solution:** Introduce a plugin contract that encapsulates feature lifecycle:

```typescript
interface A11yPlugin {
  id: string;                          // e.g. 'visual', 'content', 'cognitive'
  group: string;                       // Display group label key
  features: FeatureDefinition[];
  activate?(featureId: FeatureId, value: unknown): void;
  deactivate?(featureId: FeatureId): void;
  mount?(container: HTMLElement): void;
  unmount?(): void;
}
```

**Package strategy:** Start with Option B (single package, deep exports via `"exports"` map). The default import `free-accessibility-menu` remains the full kitchen-sink bundle for backward compatibility. Framework adapters ship as sub-path exports: `free-accessibility-menu/react`, `free-accessibility-menu/vue`.

**Public API additions:**
- `AccessibilityWidget.registerPlugin(plugin: A11yPlugin): void`
- `AccessibilityWidget.getAvailableFeatures(): FeatureDefinition[]`

**Acceptance criteria:**
- All 14 existing features work identically after plugin refactor
- `registerPlugin()` allows third-party features to appear in the widget panel
- The `readingGuide` and `textToSpeech` special-cases are removed from `widget.js` and live in their own plugin's `activate`/`deactivate` methods
- Community plugin can be registered without modifying source

**Effort:** High (2–3 weeks; this is the most significant architectural change)

---

#### F-004: Fix `_applyLanguage` — Stop Writing to `<html lang>`

**Problem:** The widget currently overwrites the host page's `lang` and `dir` attributes on `<html>`. This is documented as a critical bug in MEMORY.md. It can break host page screen reader language announcements, SEO, and HTML validation.

**Solution:** Remove `document.documentElement.setAttribute('lang', ...)` and `document.documentElement.setAttribute('dir', ...)` from the widget entirely. The widget's internal i18n and RTL needs must be scoped to the `.a11y-widget` root element only.

**Acceptance criteria:**
- `document.documentElement.lang` is never modified by the widget at any point (init, language change, destroy)
- `document.documentElement.dir` is never modified
- The widget correctly applies `dir="rtl"` to its own `.a11y-widget` root element when a RTL language is selected
- Test verifies `document.documentElement.lang` is unchanged after language switch

**Effort:** Very low (hours; bug fix)

---

#### F-005: CSP Compatibility — `toggleIconUrl` Option

**Problem:** The toggle button PNG icons are embedded as `data:image/png;base64,...` URIs in `widget.js`. Strict Content Security Policies with `img-src 'self'` block `data:` URIs, causing silent failures in enterprise and government deployments.

**Solution:**
1. Add `toggleIconUrl` and `toggleIconHoverUrl` options to `WidgetOptions`
2. The default behavior (data URI) is preserved for zero-config deployments
3. Publish the PNG assets in `dist/` so self-hosters can reference them

```typescript
interface WidgetOptions {
  toggleIconUrl?:      string; // default: embedded data URI
  toggleIconHoverUrl?: string; // default: embedded data URI
}
```

**Also add** a `cspNonce?: string` option to `WidgetOptions` for future use if `<style>` injection is ever added.

**Acceptance criteria:**
- A site with `img-src 'self'` can use the widget by passing `toggleIconUrl` pointing to a self-hosted PNG
- When `toggleIconUrl` is not provided, the data URI fallback works exactly as before
- PNG assets are included in `dist/` with the release

**Effort:** Low (half day)

---

#### F-006: CustomEvent Analytics API

**Problem:** The current `onToggle`, `onOpenMenu`, `onCloseMenu` callbacks require wiring at `init()` time. Post-init instrumentation (e.g. adding GA4 after a GDPR consent banner) is impossible. GTM, Segment, and other analytics tag managers cannot hook in without access to the `init()` call.

**Solution:** Emit standard browser `CustomEvent` events on `window` for all significant widget actions:

```
a11y:toggle      — any feature state changes
a11y:open        — menu opens
a11y:close       — menu closes
a11y:reset       — resetAll() is called
a11y:init        — widget initializes
a11y:destroy     — widget is destroyed
a11y:langchange  — language is changed
```

**Event detail shapes:**

```typescript
// a11y:toggle
{ featureId: FeatureId, value: boolean | number, settings: FeatureSettings, timestamp: number }

// a11y:init
{ version: string, settings: FeatureSettings, timestamp: number }

// a11y:langchange
{ language: string, timestamp: number }
```

Also add an `eventPrefix?: string` option (default: `'a11y'`) for white-label namespace isolation.

**Backward compatibility:** Existing `onToggle`, `onOpenMenu`, `onCloseMenu` callbacks are preserved as-is. CustomEvents are additive.

**Acceptance criteria:**
- `window.addEventListener('a11y:toggle', handler)` fires on every feature toggle
- Events fire after the callback equivalent fires
- GTM can listen to these events without accessing the init call
- Events include a full settings snapshot in `detail`

**Effort:** Low (1 day)

---

#### F-007: WCAG 2.5.8 — Touch Target Size (48px minimum)

**Problem:** The toggle button is approximately 42px. The `+`/`-` font size controls are even smaller. WCAG 2.2 SC 2.5.8 (AA) requires a minimum 24px touch target with sufficient spacing, and the recommended accessible minimum is 44–48px.

**Solution:**
- Increase the toggle button minimum size to 48×48px
- Increase `+`/`-` increment buttons to minimum 36×36px
- Ensure 8px minimum spacing between adjacent interactive controls
- Apply `env(safe-area-inset-bottom)` and `env(safe-area-inset-right)` offsets to the widget position on mobile

**Acceptance criteria:**
- Toggle button is minimum 48×48px in all states
- `+`/`-` controls meet the 24px minimum with appropriate spacing
- On iOS Safari, the widget is not obscured by the browser navigation bar
- Automated test verifies element dimensions

**Effort:** Low (CSS changes, 1 day)

---

#### F-008: `accessibilityStatementUrl` Option

**Problem:** The European Accessibility Act (EAA, mandatory from June 2025) requires organizations to publish an accessibility statement — a public document explaining conformance status, known limitations, and a feedback/contact mechanism. No current free widget surfaces a link to this statement, creating a gap between the legal requirement and the user-facing experience. This is also considered best practice for WCAG 3.0 and the forthcoming W3C Accessibility Guidelines.

**Solution:** Add `accessibilityStatementUrl?: string` to `WidgetOptions`. When provided, a link appears in the widget panel footer: "View Accessibility Statement →". The link opens in a new tab with `target="_blank" rel="noopener noreferrer"`.

```typescript
interface WidgetOptions {
  accessibilityStatementUrl?: string;  // EAA 2025 compliance link
}
```

**Acceptance criteria:**
- When `accessibilityStatementUrl` is set, a link appears in the widget panel footer
- Link is keyboard-focusable and part of the tab order within the panel
- Link text is translated via the i18n system (key: `accessibilityStatementLinkLabel`)
- When not set, no link renders (no empty element in DOM)
- `getReport()` output includes the configured URL when present

**Effort:** Very low (half day)

---

### P1 — High Priority New Features

---

#### F-101: Color Blindness Filters

**Problem:** Color blindness affects 8% of males (predominantly deuteranopia — red/green). No free open-source accessibility widget provides color blindness correction or simulation. This is the most-requested missing feature across the accessibility widget ecosystem.

**Solution:** Apply CSS `filter` with SVG `feColorMatrix` for three major types:

- **Deuteranopia** (red-green, most common at ~6% of males)
- **Protanopia** (red-blind, ~2% of males)
- **Tritanopia** (blue-yellow, rare but impactful)

Implementation uses inline SVG filters injected once into `document.head`, then referenced via `filter: url(#a11y-filter-deuteranopia)` CSS class on `body > *`. No external dependencies. Zero new JavaScript logic beyond the existing `applyFeature`/`removeFeature` pattern.

**Feature group:** Visual (new sub-group: Color Vision)

**Feature ID:** `colorBlindMode` with a sub-selector for type (range control with labels, or three separate toggle buttons)

**UX consideration:** Offer as three separate toggle items labeled "Red-Green (Deuteranopia)", "Red-Blind (Protanopia)", "Blue-Yellow (Tritanopia)". Only one can be active at a time (mutual exclusivity via `conflictsWith` in plugin API).

**Acceptance criteria:**
- Three color blind mode toggles appear in the Visual section
- Only one can be active at a time; activating one deactivates others
- `body.a11y-color-blind-deuteranopia`, `body.a11y-color-blind-protanopia`, `body.a11y-color-blind-tritanopia` classes applied to `body`
- SVG filter is injected once, not re-injected on each toggle
- Widget UI is excluded from the filter (`not(.a11y-widget)`)
- axe-core test covers the new features
- Feature works on Chrome, Firefox, Safari (SVG filter CSS is widely supported)

**Effort:** Medium (3–4 days)

---

#### F-102: Granular Typography Controls

**Problem:** The current `textSpacing` feature is a binary toggle applying WCAG 1.4.12 minimum values. Users need granular control over individual typography dimensions. WCAG 1.4.12 explicitly covers: letter spacing, word spacing, line height, and paragraph spacing as independent axes.

**Solution:** Replace (or supplement) the single `textSpacing` toggle with three new range controls:

| Feature ID | Label | Range | CSS Property | Default |
|---|---|---|---|---|
| `lineHeight` | Line Height | 1.0× – 2.5× (5 steps) | `line-height` on `body > *` | 1.5× |
| `letterSpacing` | Letter Spacing | 0 – 5px (5 steps) | `letter-spacing` on `body > *` | 0 |
| `wordSpacing` | Word Spacing | 0 – 10px (5 steps) | `word-spacing` on `body > *` | 0 |

**Backward compatibility:** The existing `textSpacing` toggle remains. It applies the WCAG 1.4.12 minimum values as a batch preset. The new controls are additive in the Content section.

**Acceptance criteria:**
- Three new range controls appear in the Content section
- Each operates independently; combined state is stored in settings
- CSS classes: `body.a11y-line-height-N`, `body.a11y-letter-spacing-N`, `body.a11y-word-spacing-N`
- `aria-live` region announces current value with context: "Line height: 1.5× (level 2 of 5)"
- Settings persist in localStorage
- Range values are restored on page load

**Effort:** Low (2 days; follows existing `fontSize` range pattern)

---

#### F-103: Accessibility Profile Presets

**Problem:** Users with multiple accessibility needs must individually toggle many features. Switching from a "reading focus" configuration to a "video viewing" configuration requires many interactions. Profile presets are the top user-requested feature across all paid overlay tools.

**Solution:** A presets system with two layers:

**Layer 1: Built-in presets** — One-click activation of curated feature sets:

| Preset | Features Activated |
|---|---|
| Low Vision | highContrast + fontSize(3) + underlineLinks + focusOutline |
| Dyslexia Friendly | dyslexiaFont + lineHeight(3) + letterSpacing(3) + wordSpacing(2) + readingGuide |
| ADHD / Cognitive | pauseAnimations + readingGuide + focusMode + readable font |
| Motor / Keyboard | focusOutline + largeCursor + keyboardShortcut active |
| Migraine Safe | darkMode + pauseAnimations |

**Layer 2: User-saved profiles** — Users can save their current settings as a named profile and switch between saved profiles.

**API additions:**
- `widget.saveProfile(name: string): void`
- `widget.loadProfile(name: string): void`
- `widget.deleteProfile(name: string): void`
- `widget.getProfiles(): string[]`

**Storage:** Profile objects stored in `localStorage` under a separate key `a11yWidgetProfiles` (distinct from the existing `a11yWidgetSettings` key — backward compatible).

**Acceptance criteria:**
- Built-in presets appear as a "Quick Start" section at the top of the panel
- Activating a preset applies all associated features and shows each as active
- "Save Current" button appears when any feature is active
- Saved profiles appear in a named list with "Load" and "Delete" buttons
- Profiles persist across page loads
- Preset activation fires `a11y:toggle` events for each affected feature

**Effort:** Medium (3–4 days)

---

#### F-104: Keyboard Shortcut to Open Widget

**Problem:** Keyboard-only users must Tab through all interactive elements on the page to reach the toggle button. On pages with many focusable elements, this can require 50+ Tab presses. This is an ironic accessibility barrier for an accessibility widget. UserWay uses `Alt+1` for this purpose.

**Solution:**
- Default shortcut: `Alt+A` (uses modifier key, so exempt from WCAG 2.2 SC 2.1.4)
- Configurable via `init({ keyboardShortcut: 'alt+a' })` — set to `false` to disable
- When activated, opens the panel and moves focus to the first menu item
- `aria-keyshortcuts="Alt+A"` attribute on the toggle button
- Optional skip link: inject a visually-hidden-until-focused "Skip to Accessibility Settings" link as the first focusable element in `body`

**Acceptance criteria:**
- `Alt+A` (default) opens the widget from anywhere on the page
- Focus moves to the first menu item after opening
- `aria-keyshortcuts` is set on the toggle button
- The shortcut is announced in the widget panel header ("Press Alt+A to open")
- Setting `keyboardShortcut: false` disables the feature entirely

**Effort:** Low (1 day)

---

#### F-105: Focus Mode (Distraction Reduction)

**Problem:** Users with ADHD, autism spectrum conditions, anxiety disorders, and cognitive disabilities report that visual clutter and peripheral distractions on web pages cause attention fatigue. No free widget addresses this population. The W3C COGA User Needs document lists "reduce distractions" as Priority 1 for these users.

**Solution:** A "Focus Mode" feature that dims all page content except the main content area:

```css
body.a11y-focus-mode > *:not(main):not([role="main"]):not(article):not(.a11y-widget) {
  opacity: 0.08 !important;
  pointer-events: none !important;
}
body.a11y-focus-mode main,
body.a11y-focus-mode [role="main"],
body.a11y-focus-mode article {
  opacity: 1 !important;
  pointer-events: auto !important;
}
```

If no `<main>` or `[role="main"]` exists on the page, fall back to reducing opacity on all top-level `body` children except the largest text-containing element.

**Feature group:** Content (or new "Cognitive" group in P1)

**Acceptance criteria:**
- Focus mode toggle appears in the Content section
- Non-main content dims to near-invisible; main content remains fully visible
- Widget itself is excluded from dimming
- Graceful fallback if no semantic main element exists
- Feature persists in localStorage

**Effort:** Low (1 day — primarily CSS)

---

#### F-106: Mobile UX Fixes

**Problem:** Several mobile-specific failures exist in v1.x:

1. **Reading guide broken on mobile**: Uses `mousemove` event; no `touchmove` equivalent. Static bar never moves on touch devices.
2. **Large cursor meaningless on touchscreens**: `cursor: url(...)` CSS has no effect on touchscreen devices.
3. **Widget obscured by iOS Safari navigation bar**: Fixed positioning at `bottom: 20px` is hidden behind the browser UI on some devices.

**Solution:**

1. **Reading guide touch support**: Add `touchmove` event listener alongside `mousemove`. Use `e.touches[0].clientY` for touch position. On touch-only devices, add a dedicated drag handle on the reading guide bar.

2. **Auto-disable `largeCursor` on touch-only devices**: During `init()`, detect `!window.matchMedia('(hover: hover)').matches` and remove `largeCursor` from the enabled features list on touch-only devices.

3. **Safe area insets**: Update CSS:
   ```css
   .a11y-widget {
     bottom: calc(20px + env(safe-area-inset-bottom, 0px));
     right: calc(20px + env(safe-area-inset-right, 0px));
   }
   ```

4. **Configurable position**: Add `position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'` option to `init()` with appropriate CSS for each position.

**Acceptance criteria:**
- Reading guide bar follows touch position on mobile devices
- `largeCursor` does not appear in the feature list on touch-only devices (e.g., iPhone, iPad)
- Widget toggle button is fully visible and tappable on iOS Safari with bottom navigation bar
- `position: 'bottom-left'` option correctly repositions the widget

**Effort:** Medium (2–3 days)

---

#### F-107: `prefers-reduced-motion` CSS Override

**Problem:** The panel uses `transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease`. There is no `@media (prefers-reduced-motion: reduce)` override. This is a WCAG 2.3.3 violation (AAA level, but a best practice widely expected in 2026).

**Solution:** Add to `a11y-widget.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .a11y-widget__panel {
    transition: opacity 0.1s ease, visibility 0.1s ease;
    transform: none !important;
  }
  .a11y-widget__toggle {
    transition: none;
  }
}
```

Also ensure the `pauseAnimations` feature toggle itself respects `prefers-reduced-motion` (i.e., if the user's OS has reduced motion enabled, `pauseAnimations` should be pre-activated by default, or at minimum not conflict with OS-level preference).

**Acceptance criteria:**
- No CSS transitions or transforms on any widget element when `prefers-reduced-motion: reduce` is set
- Test verifies this CSS rule exists in the stylesheet (CSS structure test, same pattern as visual-features.test.js)

**Effort:** Very low (hours)

---

#### F-108: i18n — Translate Section Group Labels

**Problem:** Section group labels ("Visual", "Content", "Navigation") are set via `capitalise(groupName)` — raw programmatic strings, not translated. When a user switches to French or Hebrew, the section headers remain in English. This is a UX inconsistency.

**Solution:**
- Add `visual`, `content`, `navigation` (and any new groups) as keys to all 40 language translation dictionaries
- Thread section labels through the `this._t(key)` system
- Ensure section labels are re-rendered when the language changes

**Acceptance criteria:**
- Switching to French: section headings display in French
- Switching to Hebrew (RTL): section headings display in Hebrew and flow right-to-left
- All 40 built-in languages have entries for all group labels
- axe-core test verifies ARIA labels on groups are in the active language

**Effort:** Low (1–2 days, primarily translation content)

---

#### F-109: Programmatic Feature Control API

**Problem:** There is no way to set feature states from outside the widget. This blocks: server-side preference loading, OS dark mode sync (`prefers-color-scheme` matching), URL-parameter-based sharing, and integration with application state management.

**Solution:**
- `widget.setFeature(featureId: FeatureId, value: boolean | number): void` — Set a single feature state
- `widget.applySettings(settings: Partial<FeatureSettings>): void` — Apply a full settings map
- `widget.getSettings(): FeatureSettings` — Return current settings (already partially possible via `getInstance()`)

**Use case examples:**
```js
// Sync with OS dark mode preference
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  widget.setFeature('darkMode', true);
}

// Load user preferences from server
const prefs = await fetch('/api/user/preferences').then(r => r.json());
widget.applySettings(prefs.widgetSettings);
```

**Acceptance criteria:**
- `setFeature('highContrast', true)` applies the feature and updates the UI toggle state
- `applySettings({ fontSize: 3, darkMode: true })` applies all specified features
- Settings applied via `setFeature` persist in localStorage (unless `storage: 'none'` is set)
- `a11y:toggle` events fire for each changed feature

**Effort:** Low (1–2 days)

---

#### F-110: Sensory-Friendly Mode

**Problem:** Users with autism spectrum conditions, sensory processing differences, and anxiety disorders require a composite set of environmental modifications simultaneously: eliminating movement, reducing visual intensity, and suppressing overstimulating effects. The W3C COGA Task Force identifies "control of motion and flashing content" and "reduced visual complexity" as Priority 1 needs for users with neurodevelopmental conditions. Currently, users must individually toggle 3–4 features to achieve this configuration — an unnecessarily high interaction cost during moments of sensory stress.

**Solution:** A single "Sensory-Friendly" toggle that activates a curated composite of modifications:
- `pauseAnimations` — eliminates CSS animations and transitions
- `brightness(75%)` — reduces screen intensity (CSS filter on `body > *:not(.a11y-widget)`)
- `saturation(60%)` — desaturates vivid colors
- Applies `body.a11y-sensory-friendly` class (additive; does not replace individual class states)

**Feature group:** Content (new "Cognitive" sub-group, alongside Focus Mode)

**Interaction with individual features:** Each constituent feature can still be individually toggled. Activating Sensory-Friendly Mode sets the composite at once; deactivating it reverts the composite to the pre-activation state without disturbing features the user had individually set.

**Profile integration:** "Sensory Friendly" is automatically listed as a built-in preset in the Profile Presets system (F-103).

**Acceptance criteria:**
- Single toggle activates all constituent effects simultaneously
- `body.a11y-sensory-friendly` class is applied to body
- Widget UI is excluded from brightness/saturation filters
- Individual feature toggles correctly reflect their state when Sensory-Friendly Mode is active
- Deactivating the toggle reverts only the composite-applied effects
- Feature persists in localStorage
- axe-core test verifies the mode does not create contrast violations within the widget panel itself

**Effort:** Low (1–2 days; composing existing feature implementations)

---

#### F-111: Zoom Lock Warning

**Problem:** Some websites include `<meta name="viewport" content="user-scalable=no">` or `maximum-scale=1`, blocking browser zoom — a direct violation of WCAG 1.4.4 (Resize Text, AA). When users with low vision activate the `fontSize` feature, they reasonably expect browser-level zoom to also work. A widget that silently coexists with a zoom-blocking viewport meta tag undermines trust and fails the user. Developers are often unaware this pattern exists in their own HTML templates.

**Solution:** During `init()`, inspect the viewport `<meta name="viewport">` content:

1. **Development warning**: If user-scalable is disabled, emit:
   ```
   console.warn('[a11y-widget] WCAG 1.4.4 violation: <meta name="viewport"> contains "user-scalable=no"
   or "maximum-scale=1". This blocks browser zoom for low-vision users. Remove this restriction.')
   ```
2. **Panel notice** (configurable): On first panel open per session, show a non-blocking notice: "Note: Browser zoom is disabled on this page. Use Text Size below to adjust text."
3. Add `showZoomLockWarning?: boolean` to `WidgetOptions` to control the panel notice (default: `true`). The `console.warn` always fires in development mode regardless of this option.

**Acceptance criteria:**
- A `console.warn` fires in development mode on pages with zoom-blocking viewport meta
- `showZoomLockWarning: true` (default): a non-blocking panel notice appears on first open
- `showZoomLockWarning: false`: panel notice suppressed (dev console warning still fires)
- Notice only appears once per session (dismissed automatically on subsequent opens)
- No warning appears on pages without zoom restrictions

**Effort:** Low (1 day)

---

### P2 — Standard Priority Enhancements

---

#### F-201: Readable Font Mode

**Problem:** Many users with cognitive disabilities prefer a clean, generic sans-serif font over brand fonts or serif fonts, but do not need the OpenDyslexic font. A "Readable Font" toggle that applies `font-family: Arial, Helvetica, sans-serif` is distinct from the dyslexia font and was commonly requested across the ecosystem.

**Solution:** New boolean toggle:
- Feature ID: `readableFont`
- CSS: `body.a11y-readable-font *:not(.a11y-widget):not(.a11y-widget *) { font-family: Arial, Helvetica, sans-serif !important; }`
- Group: Content

**Effort:** Very low (half day)

---

#### F-202: Saturation and Brightness Controls

**Problem:** Users with light sensitivity, sensory processing differences, or visual fatigue benefit from being able to reduce screen brightness/saturation on a per-site basis without adjusting OS-level settings.

**Solution:**
- `saturation` range feature: `filter: saturate(X)` on `body > *` (range: 0% – 200%, default 100%)
- `brightness` range feature: `filter: brightness(X)` on `body > *` (range: 50% – 150%, default 100%)
- These use the same `filter` application pattern as `invertColors` (applied to `body > *:not(.a11y-widget)`)

**Effort:** Low (1–2 days; follows existing range control pattern)

---

#### F-203: Language Auto-Detection

**Problem:** On first visit, the widget defaults to the `defaultLanguage` option or English. Many sites with multilingual audiences would benefit from automatic language detection so the widget UI matches the page language.

**Solution:** Auto-detect priority order:
1. `defaultLanguage` option (explicit override wins)
2. `document.documentElement.lang`
3. `navigator.language` (BCP-47, normalize to match registered language codes)
4. `navigator.languages[0]`
5. Fallback to English

**Acceptance criteria:**
- A page with `<html lang="fr">` shows the widget in French by default (when 40-language pack is registered)
- Explicit `defaultLanguage: 'en'` always overrides auto-detection
- Graceful fallback to English if detected language is not registered

**Effort:** Very low (hours)

---

#### F-204: Enhanced TTS Controls

**Problem:** The current text-to-speech feature starts reading the page but offers no controls once started. Users cannot pause, resume, adjust speed, or click to read a specific section.

**Solution:**
- Pause/resume button visible in the widget panel when TTS is active
- Speed control: 0.5× – 2.0× using `utterance.rate` (Web Speech API)
- Click-to-read: when TTS is active, clicking any text element reads that element
- Visual word highlighting: sync a CSS highlight with `SpeechSynthesisUtterance` boundary events

**Effort:** Medium (3–4 days)

---

#### F-205: White-Label and Branding Options

**Problem:** Agencies and enterprise deployments cannot brand the widget or adjust the disclaimer text without forking the source. This is a blocker for commercial integrators.

**Solution:** New `branding` option in `WidgetOptions`:

```typescript
interface BrandingOptions {
  toggleIconUrl?:       string;
  toggleIconHoverUrl?:  string;
  primaryColor?:        string;  // applied as CSS custom property on .a11y-widget root
  panelTitle?:          string;  // overrides "Accessibility Menu" in all languages
  disclaimerText?:      string | false; // false to suppress
  logoUrl?:             string;
}
```

CSS custom property injection via `this._root.style.setProperty('--a11y-primary', ...)` — CSP-safe (DOM style writes are not governed by `style-src`).

**Effort:** Low (1 day)

---

#### F-206: Session Usage Report (`getReport()`)

**Problem:** Enterprise customers and developers building analytics dashboards have no visibility into widget usage. There is no API for capturing session-level engagement data.

**Solution:**

```typescript
interface WidgetReport {
  version:           string;
  session: {
    sessionId:       string;        // crypto.randomUUID() at init
    initTimestamp:   number;
    menuOpenCount:   number;
    features: Record<FeatureId, {
      enabled:       boolean;
      toggleCount:   number;
      lastActivated: number | null;
    }>;
    language:        string;
  };
  persistedSettings: FeatureSettings;
  enabledFeatureIds: FeatureId[];
}
```

- `widget.getReport(): WidgetReport` on the instance
- `AccessibilityWidget.getReport(): WidgetReport | null` on the module
- Session data is in-memory only (never persisted to localStorage)
- Pairs with `a11y:destroy` event for session-end reporting via `navigator.sendBeacon`

**Effort:** Medium (2 days)

---

#### F-207: `showLanguageSwitcher` Option

**Problem:** Single-language sites (the majority) have no use for the language switcher section. There is no option to hide it. Removing it requires registering only one language, which conflicts with the multi-language architecture.

**Solution:**
```typescript
interface WidgetOptions {
  showLanguageSwitcher?: boolean; // default: true
}
```

When `false`, the language section is not rendered in the DOM (not just hidden).

**Effort:** Very low (hours)

---

#### F-208: Development Mode Validation

**Problem:** Passing an invalid feature ID, an unknown option key, or an invalid position string silently does nothing. This is a common source of hard-to-diagnose integration bugs.

**Solution:** In development mode (`process.env.NODE_ENV !== 'production'`), validate all `init()` options:
- Unknown feature IDs in `features` option: `console.warn('[a11y-widget] Unknown feature id: "hghContrast". Did you mean "highContrast"?')`
- Invalid `position` value: `console.warn('[a11y-widget] Invalid position "bottom-center". Valid values: bottom-right, bottom-left, top-right, top-left')`
- Invalid `defaultLanguage` code: warn with list of registered languages

**Effort:** Low (1 day)

---

#### F-209: VPAT / Accessibility Conformance Report (ACR)

**Problem:** Enterprise procurement in US federal and regulated industries requires a Voluntary Product Accessibility Template (VPAT) mapping the product against WCAG criteria. The axe-core test suite provides the evidentiary foundation but the document itself does not exist.

**Solution:** Publish `docs/accessibility-conformance-report.md` mapping the widget's own UI (not the host page) against WCAG 2.2 AA criteria. Supported by the existing axe-core test results.

Also add a WCAG conformance table to the README:

| Feature | WCAG SC Assisted | Level | Notes |
|---|---|---|---|
| High Contrast | 1.4.3 Contrast (Minimum) | AA | User-activated; does not modify page markup |
| Font Size | 1.4.4 Resize Text | AA | User-controlled scaling |
| Text Spacing | 1.4.12 Text Spacing | AA | Applies WCAG minimum values |
| ... | ... | ... | ... |

**Effort:** Medium (2–3 days of documentation work)

---

#### F-210: Highlight on Hover / Paragraph Tracker

**Problem:** Users with ADHD, low vision, or cognitive processing differences lose their place when reading. A paragraph highlight tracker (distinct from the reading guide) provides a different interaction model for non-linear readers.

**Solution:** When active, hovering over or clicking a text element highlights that element with a configurable background color. CSS class `body.a11y-highlight-hover` combined with a JS event listener that adds/removes a highlight class from the element under focus/hover.

**Effort:** Low (1 day)

---

#### F-211: Notification / Alert Suppressor

**Problem:** Pop-up chat widgets (Intercom, Drift, Zendesk), cookie consent banners, and auto-appearing toast notifications are common sources of distraction and sensory stress for users with anxiety disorders, ADHD, and sensory processing differences. These elements frequently appear with animations, sounds, and unpredictable timing — precisely the conditions most disruptive to this population.

**Solution:** A "Suppress Notifications" toggle that hides common notification and chat widget containers via CSS only:
- Target via stable selector patterns: `[id*="intercom"]`, `[id*="drift"]`, `[id*="crisp"]`, `[class*="chat-widget"]`, `[class*="cookie-banner"]`, `[role="alert"]:not([aria-live])`, common toast selectors
- Implementation: `body.a11y-suppress-notifications [selector] { display: none !important; }` — no DOM mutation, fully reversible
- Add `notificationSuppressorSelectors?: string[]` to `WidgetOptions` for site-specific extension or override of the default selector list

**Important caveats (displayed in panel):**
- "This may hide important site notices, including cookie consent banners"
- Does not suppress ARIA live region announcements used by assistive technology
- Does not affect browser-native notifications or OS-level alerts

**Acceptance criteria:**
- Common chat widgets and banners are visually hidden when feature is active
- CSS-only approach: no JS manipulation of third-party widget instances
- Widget's own panel and toggle are excluded from suppression
- Custom selectors are addable via `notificationSuppressorSelectors` option
- Feature persists in localStorage
- Brief disclaimer is shown within the panel when feature is active

**Effort:** Low (1–2 days)

---

#### F-212: Dev Mode / Alt Text Audit

**Problem:** Missing image alt text is the most prevalent WCAG failure — WebAIM's annual Million report consistently finds missing alt on 20%+ of home pages. Developers integrating the accessibility widget may be unaware their page has images without alt text. There is no tool in the current widget to surface this gap during development, and full auditing tools (axe DevTools, WAVE) require separate installation.

**Solution:** When `devMode: true` is passed to `init()` (or auto-detected when `process.env.NODE_ENV === 'development'`), activate a lightweight page-level alt text audit:

1. **Visual overlay**: Apply a red outline and `data-a11y-audit` label to all `<img>` elements missing `alt`, all decorative `<img alt="">` that appear visually significant (non-zero dimensions, in viewport), and all `<svg>` without an accessible name.

2. **Console report**: On init, log a summary and element array:
   ```
   [a11y-widget devMode] Alt text audit: 3 violations found.
   ```

3. **Panel indicator**: A "Dev Audit" badge in the widget panel header showing violation count. Clicking opens a scrollable detail list.

```typescript
interface WidgetOptions {
  devMode?: boolean;  // default: auto-detected from NODE_ENV
}
```

**Scope limit:** Alt text audit only. Full WCAG auditing is explicitly out of scope (axe DevTools, WAVE, and sa11y serve that purpose).

**Acceptance criteria:**
- In dev mode, all `<img>` missing alt attribute receive a visible red outline
- Console report fires once on init
- `devMode: false` explicitly disables all audit behavior even in development environments
- Dev overlays are completely absent from production builds
- Panel badge is keyboard-accessible and announces issue count to screen readers

**Effort:** Medium (2–3 days)

---

### P3 — Future / Post-v2.0

These items are acknowledged in the research but deferred to maintain v2.0 scope:

- **F-301: WordPress Plugin** — High-leverage but requires separate PHP packaging infrastructure and WordPress.org review process. Target v2.1.
- **F-302: Angular NgModule Adapter** — After React and Vue adapters establish the pattern.
- **F-303: Analytics SaaS** — Opt-in hosted analytics service. Separate product; requires backend infrastructure. Target post-v2.0.
- **F-304: Draggable Widget Position** — Nice-to-have WCAG 2.5.7 compliance. Complex pointer event handling. Defer unless time permits.
- **F-305: AI-Powered Accessible Content Simplification** — WebLLM/Transformers.js integration. Experimental; too early for v2.0.
- **F-306: Text Magnifier / Hover Zoom** — Medium complexity; lower priority vs. color blindness and typography.
- **F-307: Cross-Device Profile Sync** — Requires auth layer; incompatible with zero-backend principle for v2.0.
- **F-308: Shopify App** — App Store review process; evaluate after WordPress plugin proves the CMS model.
- **F-309: WCAG Contrast Ratio Checker** — In-widget inline tool; high complexity.
- **F-310: Voice Command Mode** — Voice-activated feature toggling via Web Speech API `SpeechRecognition`: "Enable high contrast", "Reset all settings". Risks: Chrome-only browser support (~75% coverage in 2026 but Firefox/Safari absent), always-on microphone permission prompt, false activation rate, and privacy concerns around audio capture. If pursued, must be strictly opt-in (`voiceCommands: true`), clearly document browser limitations in UI, and auto-disable on page unload. Defer pending broader browser support.
- **F-311: `window.ai` Progressive Enhancement** — The emerging browser-native Prompt API (`window.ai`, available in Chrome 127+ behind an origin trial flag) could enable on-device content simplification (a W3C COGA Priority 1 need) without any external API calls or privacy trade-offs. Available to ~0% of stable browser users as of 2026. Track for v3.0 when stable coverage exceeds 30%; monitor W3C Web Machine Learning Working Group specification progress.

---

## 7. Technical Requirements

### 7.1 Bundle Size Budget

The zero-dependency, lightweight positioning is a core product differentiator and must be protected as a measurable constraint:

| Artifact | v1.x Estimated | v2.0 Target |
|---|---|---|
| Core JS (minified, gzip) | ~18–25KB | <15KB (after extracting PNG data URIs) |
| Full kitchen-sink bundle (minified, gzip) | ~25–30KB | <35KB |
| CSS (minified, gzip) | ~5–8KB | <8KB |
| **Combined (JS + CSS, gzip)** | **~30–35KB** | **<40KB** |

For comparison: accessiBe ~500KB, UserWay ~200KB. Being under 40KB combined is a concrete, measurable, marketable advantage.

### 7.2 Build System Updates

- Add `@rollup/plugin-typescript` for TS compilation
- Add `.d.ts` output alongside `.js` in `dist/`
- Extract PNG assets to `dist/` (reduces JS bundle size, fixes CSP issue F-005)
- Add source maps to `dist/` for production debugging
- Inject `version` from `package.json` at build time (fix for hardcoded `'1.0.0'` in source)
- Publish JSON Schema (`dist/config.schema.json`) for tooling integrations

### 7.3 Storage API Extension

Current `storage.js` must be extended to support:

```typescript
type StorageMode = 'localStorage' | 'sessionStorage' | 'none' | CustomStorageProvider;

interface CustomStorageProvider {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
```

Add `storage?: StorageMode` to `WidgetOptions`. Default: `'localStorage'` (backward compatible). Profile data uses a separate key (`a11yWidgetProfiles`) alongside the existing `a11yWidgetSettings` key.

### 7.4 Performance Requirements

- `init()` must complete in < 50ms on a mid-range mobile device (Chrome DevTools throttled)
- The Reading Guide `mousemove` handler must be wrapped in `requestAnimationFrame` to prevent INP regression
- The toggle button and panel must not cause Cumulative Layout Shift (CLS) — use `position: fixed` only
- Script tag usage must be documented with `defer` attribute to prevent render blocking

### 7.5 Singleton Pattern Update

The singleton enforcement can be relaxed: `init()` supports multiple independent instances when different `storageKey` values are provided. The default behavior (single global instance, `init()` destroys and recreates) is preserved for backward compatibility. A `createWidget(options)` factory API returning independent instances is added for micro-frontend use cases.

---

## 8. UX & Accessibility Requirements

### 8.1 Panel Layout Reorder

Based on usage analytics from commercial providers (font size and contrast are used by 70%+ of users), the panel section order should change for v2.0:

1. **Quick Access** — Top 3 most-used features (configurable per site; defaults: fontSize, highContrast, focusOutline)
2. **Visual** — highContrast, darkMode, fontSize, invertColors, colorBlindMode, saturation, brightness, pauseAnimations
3. **Content** — dyslexiaFont, readableFont, textSpacing (+ lineHeight, letterSpacing, wordSpacing), underlineLinks, highlightHeadings, hideImages, focusMode
4. **Navigation** — focusOutline, largeCursor, readingGuide, textToSpeech, keyboardShortcut
5. **Language** — (moved to bottom; least frequently changed)

### 8.2 Screen Reader Announcement Improvements

1. **Range control context**: Change `aria-live` content from bare number to: "Font size: level 3 of 5" or "Line height: 1.8× (level 3 of 5)"
2. **Active settings count**: Toggle button `aria-label` should include count: "Accessibility Menu (3 settings active)"
3. **Reset confirmation**: After `resetAll()`, announce "All accessibility settings have been reset"
4. **Panel open summary**: On panel open, an initial `aria-live` announcement: "Accessibility settings panel — 3 settings currently active"
5. **Feature activation**: When a toggle is changed, the feature name + state is announced: "High Contrast enabled"

### 8.3 Language Select ARIA Fix

The `<select>` element inside a `div[role="menuitem"]` creates an ARIA nesting violation. Fix:
- Remove `role="menuitem"` from the language item `div` (or change to `role="none"`)
- The `<select>` becomes a direct tabstop in keyboard navigation
- Arrow key navigation should reach the language `<select>` as part of the menu flow

### 8.4 Focus Trap Consideration

The current `Tab` key behavior (closes the menu) follows the WAI-ARIA Menu pattern strictly. However, the panel functions more like a persistent `dialog` than a menu. For v2.0, evaluate whether `role="dialog"` with a focus trap better serves users who expect Tab to navigate within the panel. This is a significant change requiring consultation with accessibility practitioners.

**Decision for v2.0:** Keep `role="menu"` with current Tab behavior but improve the Tab handling to cycle through interactive controls within the panel rather than immediately closing. Document the keyboard interaction model explicitly.

### 8.5 First-Visit Tooltip

On first visit (no existing localStorage entry), show a brief tooltip near the toggle button: "Customize your accessibility settings." The tooltip:
- Disappears after 5 seconds or on first interaction
- Respects `prefers-reduced-motion` (no animation, instant appear/disappear)
- Has `role="tooltip"` and is referenced via `aria-describedby` from the toggle button
- Is controlled by a new `showTooltip: boolean` option (default: `true`)

---

## 9. Developer Experience Requirements

### 9.1 TypeScript Integration

See F-001. Additionally:
- All exported symbols have `@since 2.0.0` JSDoc tags where applicable
- Migration path documented for any type changes from JSDoc-implicit types
- `package.json` exports map includes type declarations for all sub-path exports

### 9.2 React Adapter (`free-accessibility-menu/react`)

Minimum viable API via sub-path export:

```tsx
import { useAccessibilityWidget, AccessibilityWidgetProvider } from 'free-accessibility-menu/react';

// Hook usage
function App() {
  const { widget, isOpen, openMenu, closeMenu, resetAll } = useAccessibilityWidget({
    defaultLanguage: 'en',
    onToggle: (featureId, value) => analytics.track('a11y_toggle', { featureId, value })
  });
  return <>{widget && <div>Active features: {widget.getSettings()}</div>}</>;
}

// Provider usage
<AccessibilityWidgetProvider options={{ defaultLanguage: 'en' }}>
  <App />
</AccessibilityWidgetProvider>
```

**SSR safety:** Wrap `init()` in `useEffect` (runs only client-side). Handle server `null` return gracefully.

### 9.3 Vue 3 Adapter (`free-accessibility-menu/vue`)

```typescript
// Plugin installation
import { AccessibilityWidgetPlugin } from 'free-accessibility-menu/vue';
createApp(App).use(AccessibilityWidgetPlugin, { defaultLanguage: 'fr' }).mount('#app');

// Composable
import { useA11yWidget } from 'free-accessibility-menu/vue';
const { widget, isOpen } = useA11yWidget();
```

**SSR safety:** Use `.client.js` Nuxt plugin convention. Guard with `onMounted`.

### 9.4 CDN Usage Documentation

```html
<!-- In <head> to prevent FOUC -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/free-accessibility-menu@2/dist/a11y-widget.css">

<!-- Before </body> with defer -->
<script defer src="https://cdn.jsdelivr.net/npm/free-accessibility-menu@2/dist/index.umd.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    AccessibilityWidget.init({ defaultLanguage: 'en' });
  });
</script>
```

Release notes must include SRI hash values for CDN consumers requiring Subresource Integrity.

### 9.5 Changelog

Add `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format. Publish with every release. Maintained alongside `MIGRATION.md` for breaking changes.

### 9.6 Community Infrastructure

- Enable GitHub Discussions (replaces issues for "how do I..." questions)
- Add `CONTRIBUTING.md` with translation contribution workflow
- Label issues systematically: `good-first-issue`, `help-wanted`, `bug`, `feature`, `translation`
- Add All-Contributors recognition in README
- Add `SECURITY.md` with responsible disclosure policy
- Publish v2.0 public roadmap as GitHub Project

---

## 10. Platform & Ecosystem Integration

### 10.1 CMS Integration Priority

| Integration | Priority | Notes |
|---|---|---|
| React adapter (`free-accessibility-menu/react`) | P0 | npm sub-path export |
| Vue 3 adapter (`free-accessibility-menu/vue`) | P1 | npm sub-path export |
| Next.js documentation + example | P1 | Docs only; `useEffect` + `dynamic({ ssr: false })` pattern |
| Nuxt documentation + `.client.js` plugin | P1 | Docs only |
| WordPress plugin | P3 (v2.1) | Requires separate PHP packaging; high adoption value |
| Shopify app | P3 | App Store review process; UMD CDN build + `ScriptTag` |
| Webflow custom code | P2 (docs only) | CDN UMD build drop-in |
| Angular NgModule | P3 | After React/Vue patterns are established |

### 10.2 Web Component Wrapper

A minimal Web Component for CMS integrations that don't support npm:

```js
// dist/a11y-widget-element.js
class AccessibilityWidgetElement extends HTMLElement {
  connectedCallback() {
    const opts = JSON.parse(this.getAttribute('config') || '{}');
    AccessibilityWidget.init(opts);
  }
  disconnectedCallback() { AccessibilityWidget.destroy(); }
}
customElements.define('a11y-menu', AccessibilityWidgetElement);
```

Usage: `<a11y-menu config='{"defaultLanguage":"en"}'></a11y-menu>`

Published as a separate build entry: `dist/a11y-widget-element.js`.

### 10.3 Enterprise Requirements

- **CSP nonce support**: `cspNonce?: string` in `WidgetOptions` applied to any dynamically created `<style>` elements
- **SRI hashes**: SHA-384 hashes published for all CDN-served files in release notes
- **White-labeling**: See F-205
- **Multi-instance support**: See section 7.5
- **Audit logging**: Via `a11y:toggle` CustomEvents with timestamps (see F-006)
- **VPAT**: See F-209

---

## 11. Breaking Changes Policy & Migration Strategy

### 11.1 Sacred Contract — Must Not Break

The following v1.x behaviors are the backward compatibility guarantee:

1. **npm package name**: `free-accessibility-menu` — no rename
2. **`AccessibilityWidget.init(options)` signature** — all existing option names work unchanged
3. **`AccessibilityWidget.getInstance()`, `.destroy()`** — preserved
4. **`window.AccessibilityWidget` global** — UMD build must maintain
5. **`a11yWidgetSettings` localStorage key** — never renamed (v2.0 adds `a11yWidgetProfiles` as a new key)
6. **All 14 existing feature IDs** — IDs are external API surface for `onToggle` callbacks; never renamed
7. **CSS class names on `document.body`** — `a11y-high-contrast`, `a11y-dark-mode`, etc. — preserved (host page CSS may target these)
8. **All 40 built-in language codes** — `defaultLanguage` values must continue to work

### 11.2 Intentional Breaking Changes

1. **Widget stops writing to `<html lang>`/`<html dir>`** — This was always a bug (MEMORY.md documents it as "Critical"). Migration: if the host page relied on this behavior (unusual), explicitly set `document.documentElement.lang` in the `onInit` callback.
2. **`init()` can return `null` in SSR** — Previously always returned a `WidgetInstance`. Update: TypeScript return type is `WidgetInstance | null`; add null checks in consuming code.

### 11.3 Migration Guide Structure (`MIGRATION.md`)

```
## Migrating from v1.x to v2.0

### Zero-change upgrade (most users)
If you use the CDN script tag with default options, no changes are required.
The window.AccessibilityWidget API is identical.

### TypeScript users
[How to import types from v2.0 .d.ts]

### Behavioral changes
1. The widget no longer modifies <html lang> or <html dir>. [Details]
2. init() returns null in SSR environments instead of throwing. [Details]

### New features
[Pointer to new features and how to enable them]
```

### 11.4 Release Timeline

| Milestone | Target |
|---|---|
| v2.0.0-alpha.1 (TypeScript + SSR guard + plugin arch) | 8 weeks from kickoff |
| v2.0.0-alpha.2 (color blindness + typography + profiles + keyboard shortcut) | 12 weeks |
| v2.0.0-beta.1 (React adapter + mobile fixes + cognitive features) | 18 weeks |
| v2.0.0-RC.1 (feature freeze, docs complete, VPAT published) | 22 weeks |
| v2.0.0 stable | 26 weeks |

---

## 12. Success Metrics

### 12.1 Technical Quality Metrics

| Metric | v1.x Status | v2.0 Target |
|---|---|---|
| Test coverage (statements) | 98.48% | ≥ 95% |
| Test coverage (branches) | 90.81% | ≥ 92% |
| axe-core violations (widget itself) | 0 | 0 (must maintain) |
| TypeScript coverage | 0% (JSDoc) | 100% public API typed |
| WCAG 2.2 SCs explicitly addressed | 0 (by feature) | 3 (2.4.11, 2.5.7, 2.5.8) |
| Bundle size (JS + CSS, gzip) | ~30–35KB | <40KB |
| Time to widget mount | Not measured | < 50ms on throttled mobile |

### 12.2 Community Adoption Metrics (90 days post-v2.0 stable)

| Metric | Baseline | 90-day Target | 180-day Target |
|---|---|---|---|
| npm weekly downloads | ~500/week | 2,000/week | 5,000/week |
| GitHub stars | Current | +200 | +500 |
| Community plugins published | 0 | 3 | 10 |
| React adapter downloads/week | 0 | 200/week | 800/week |
| Open issues > 30 days old | — | < 10 | < 10 |

### 12.3 Developer Experience Metrics

| Metric | v1.x Status | v2.0 Target |
|---|---|---|
| TypeScript support | None | Full `.d.ts` published |
| Framework wrappers | None | React + Vue published |
| Time-to-first-widget (CDN path) | ~5 minutes | < 2 minutes |
| Time-to-first-widget (npm/React) | ~15 minutes (manual setup) | < 5 minutes |

---

## 13. Non-Goals for v2.0

The following are explicitly out of scope for v2.0 to maintain focus:

- **AI/ML features**: No AI-generated alt text, no DOM remediation, no AI content simplification. This is not the product category.
- **Compliance certification**: No WCAG conformance claims for host pages, no accessibility statements generator (v3.0 consideration), no legal cover.
- **Backend infrastructure**: No hosted analytics service, no user accounts, no cross-device sync in v2.0.
- **WordPress plugin**: High-value but requires separate PHP packaging and WordPress.org review process. Target v2.1.
- **Screen reader AT integration**: No detection of JAWS/NVDA/VoiceOver, no custom screen reader mode.
- **Page-level accessibility auditing**: The widget is not an accessibility testing tool. sa11y, axe DevTools, and WAVE serve that purpose.
- **Full TypeScript source rewrite**: v2.0 generates `.d.ts` from JSDoc. Full TS migration is ideal but optional for the initial v2.0 release — shipping types is the requirement, source language is an implementation detail.

---

## Appendix A: Complete v2.0 Feature Inventory

| ID | Feature | Priority | New/Existing | Effort |
|---|---|---|---|---|
| F-001 | TypeScript declarations | P0 | New | Low |
| F-002 | SSR compatibility guard | P0 | Fix | Very Low |
| F-003 | Plugin architecture | P0 | New | High |
| F-004 | Fix `_applyLanguage` `<html>` mutation | P0 | Fix | Very Low |
| F-005 | CSP `toggleIconUrl` option | P0 | New | Low |
| F-006 | CustomEvent analytics API | P0 | New | Low |
| F-007 | WCAG 2.5.8 touch target 48px | P0 | Fix | Low |
| F-008 | `accessibilityStatementUrl` option (EAA 2025) | P0 | New | Very Low |
| F-101 | Color blindness filters | P1 | New | Medium |
| F-102 | Granular typography (line height, letter/word spacing) | P1 | New | Low |
| F-103 | Profile presets system | P1 | New | Medium |
| F-104 | Keyboard shortcut to open widget | P1 | New | Low |
| F-105 | Focus mode (distraction reduction) | P1 | New | Low |
| F-106 | Mobile UX fixes (touch reading guide, safe area, position) | P1 | Fix | Medium |
| F-107 | `prefers-reduced-motion` CSS | P1 | Fix | Very Low |
| F-108 | i18n section group label translations | P1 | Fix | Low |
| F-109 | Programmatic `setFeature`/`applySettings` API | P1 | New | Low |
| F-110 | Sensory-Friendly Mode (composite cognitive toggle) | P1 | New | Low |
| F-111 | Zoom Lock Warning (WCAG 1.4.4 viewport detection) | P1 | New | Low |
| F-201 | Readable font mode | P2 | New | Very Low |
| F-202 | Saturation/brightness sliders | P2 | New | Low |
| F-203 | Language auto-detection | P2 | New | Very Low |
| F-204 | Enhanced TTS controls | P2 | Enhance | Medium |
| F-205 | White-label branding options | P2 | New | Low |
| F-206 | Session usage report (`getReport()`) | P2 | New | Medium |
| F-207 | `showLanguageSwitcher` option | P2 | New | Very Low |
| F-208 | Development mode validation | P2 | New | Low |
| F-209 | VPAT / Accessibility Conformance Report | P2 | Docs | Medium |
| F-210 | Highlight on hover / paragraph tracker | P2 | New | Low |
| F-211 | Notification / alert suppressor | P2 | New | Low |
| F-212 | Dev mode / alt text audit | P2 | New | Medium |
| F-301 | WordPress plugin | P3 | New | High |
| F-302 | Angular adapter | P3 | New | Medium |
| F-303 | Analytics SaaS (opt-in hosted) | P3 | New | Very High |
| F-304 | Draggable widget position | P3 | New | Medium |
| F-305 | AI content simplification | P3 | New | Very High |
| F-306 | Text magnifier / hover zoom | P3 | New | Medium |
| F-307 | Cross-device profile sync | P3 | New | Very High |
| F-308 | Shopify app | P3 | New | High |
| F-309 | WCAG contrast ratio checker | P3 | New | High |
| F-310 | Voice command mode | P3 | New | High |
| F-311 | `window.ai` progressive enhancement | P3 | Experimental | Very High |

---

## Appendix B: Research Sources

This PRD was synthesized from research conducted by 6 specialized analysis agents:

1. **Competitive Analysis** — Full feature comparison across 10 competitors including accessiBe, UserWay, EqualWeb, AudioEye, Recite Me, FACIL'iti, WP Accessibility Helper, and One Click Accessibility; pricing analysis; overlay controversy assessment; differentiation opportunities.

2. **UX Research** — Disability personas and feature impact ranking; discoverability research; mobile UX audit; ARIA/keyboard gaps; cognitive accessibility needs (W3C COGA); screen reader interaction quality; 30 prioritized feature recommendations.

3. **Business Analysis** — Product gap analysis; developer experience requirements; integration priority matrix; monetization models; enterprise requirements; KPI framework; open source sustainability models.

4. **Customer Success Analysis** — Adoption drivers; abandonment reasons; end user retention patterns; onboarding improvements; documentation gaps; community building strategies; trust and credibility signals.

5. **Sales Engineering Analysis** — TypeScript packaging; SSR/Next.js/Nuxt compatibility analysis; CSP deep dive; CustomEvent API design; framework adapter code examples; CMS integration constraints; performance requirements; enterprise security posture.

6. **Product Management Strategy** — Plugin architecture design; P0/P1/P2/P3 feature prioritization; 10 detailed feature specifications; breaking changes policy; versioning and migration strategy; competitive positioning; success metrics.

7. **Trend Analysis** — Emerging regulatory requirements (EAA 2025, WCAG 3.0 preview); neurodiversity and cognitive accessibility trends (W3C COGA roadmap); developer tooling trends (devMode auditing, `window.ai`); mobile and sensory accessibility patterns; voice interface and browser-native AI horizons; zoom lock as a prevalent WCAG 1.4.4 failure pattern; accessibility statement as an emerging UX standard.

All research was based on: direct codebase inspection of v1.1.0 source files, training knowledge of the accessibility widget market and overlay controversy (through August 2025), WCAG 2.2 specification, W3C ARIA Authoring Practices Guide, W3C COGA Task Force publications, WebAIM Screen Reader User Surveys, and best practices from Deque Systems, Inclusive Components, and the National Federation of the Blind.
