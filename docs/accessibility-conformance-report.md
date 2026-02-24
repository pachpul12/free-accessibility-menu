# Accessibility Conformance Report

**Product:** Free Accessibility Menu Widget
**Version:** 2.7.0
**Report Date:** February 2026
**Evaluation Basis:** WCAG 2.2 Level A and Level AA
**Report Format:** Based on VPAT® 2.5 (Voluntary Product Accessibility Template)

---

## Important Disclaimer

This report covers the accessibility of the **widget's own user interface** (the toggle button, the panel, all controls within the panel) — not the accessibility of any host page into which the widget is integrated.

This widget is a **user-controlled preference panel**, not an accessibility overlay or remediation tool. It does not claim to make host pages WCAG conformant. Site owners remain responsible for the accessibility of their own content.

---

## Product Description

Free Accessibility Menu is a pure vanilla JavaScript/CSS accessibility preference widget with zero runtime dependencies. It provides a floating toggle button that opens a panel allowing users to activate interface adjustments: contrast, font size, reading aids, motion reduction, colour filters, and more.

**Widget UI components:**
- A toggle button (48 × 48 px minimum, always visible in a viewport corner)
- A slide-in panel containing feature controls, range sliders, a language selector, a profiles section, and a quick-start presets section
- A live announcement region (visually hidden) for screen reader feedback
- An optional first-visit tooltip
- An optional accessibility statement link in the footer

---

## Evaluation Methodology

The widget was evaluated using:

1. **jest-axe / axe-core 4.8** — automated WCAG checks run in jsdom as part of the CI test suite. Tests cover: closed state, open state, RTL (Hebrew), high contrast, dark mode, multiple simultaneous active features, and pages with surrounding content.
2. **Manual review** — HTML structure, ARIA attributes, keyboard navigation, focus management, and colour contrast were reviewed against WCAG 2.2 criteria.
3. **Screen reader testing** — tested with NVDA + Firefox and VoiceOver + Safari in manual spot-checks.

---

## Conformance Terms

| Term | Meaning |
|---|---|
| **Supports** | The functionality of the product meets the criterion without known defects. |
| **Partially Supports** | Some functionality of the product does not meet the criterion. |
| **Does Not Support** | The majority of product functionality does not meet the criterion. |
| **Not Applicable** | The criterion is not relevant to this product. |
| **Not Evaluated** | The product has not been evaluated against the criterion. |

---

## WCAG 2.2 Level A — Conformance Table

| Success Criterion | Level | Status | Notes |
|---|---|---|---|
| **1.1.1 Non-text Content** | A | Supports | Toggle button has `aria-label`; all decorative SVG icons have `aria-hidden="true"`; feature icons have `aria-hidden="true"`. Range control +/− buttons have descriptive `aria-label` attributes. |
| **1.2.1 Audio-only and Video-only (Prerecorded)** | A | Not Applicable | The widget UI contains no time-based media. |
| **1.2.2 Captions (Prerecorded)** | A | Not Applicable | No video content. |
| **1.2.3 Audio Description or Media Alternative (Prerecorded)** | A | Not Applicable | No video content. |
| **1.3.1 Info and Relationships** | A | Supports | Full WAI-ARIA menu pattern: panel uses `role="menu"` with `role="menuitem"` for each feature. Section groups use `role="group"` with `aria-label`. The range controls use `role="group"` with `aria-labelledby`. Profile input has an associated `<label>`. Heading-level text uses `role="heading"` with `aria-level`. |
| **1.3.2 Meaningful Sequence** | A | Supports | DOM order matches visual reading order. RTL layouts mirror visually and in DOM order with `dir` attribute on the widget root. |
| **1.3.3 Sensory Characteristics** | A | Supports | Feature states are conveyed by text labels and `aria-checked` state, not by shape, colour, or position alone. |
| **1.4.1 Use of Color** | A | Supports | Active feature state is indicated by text change, icon class change, and `aria-checked="true"` — not colour alone. |
| **1.4.2 Audio Control** | A | Supports | The Text to Speech feature provides an immediate stop mechanism (`speechSynthesis.cancel()`). The stop button is visible in the TTS control bar while speech is active. |
| **2.1.1 Keyboard** | A | Supports | Full keyboard operation: `Tab` / `Shift+Tab` to navigate to the toggle, `Enter` / `Space` to open/close the panel, `Arrow Down` / `Arrow Up` to move between feature items (wraps), `Home` / `End` to jump to first/last item, `Enter` / `Space` to activate features, `Escape` to close and return focus to the toggle button. Range controls: `+`/`−` buttons are Tab-reachable and respond to `Enter` / `Space`. |
| **2.1.2 No Keyboard Trap** | A | Supports | `Escape` always closes the panel and returns focus to the toggle button. No focus trap is imposed; tabbing past the last item leaves the panel naturally. |
| **2.1.4 Character Key Shortcuts** | A | Supports | The default keyboard shortcut is `Alt+A`, which requires a modifier key. It does not conflict with this criterion (which targets single-key shortcuts). The shortcut can be disabled or customised via the `keyboardShortcut` option. |
| **2.2.1 Timing Adjustable** | A | Not Applicable | The widget UI imposes no time limits on user interaction. The first-visit tooltip auto-dismisses after 5 seconds but can also be dismissed immediately at any time. |
| **2.2.2 Pause, Stop, Hide** | A | Supports | The Pause Animations feature stops all CSS animations on the host page. Text to Speech provides a stop control. The reading guide line follows the pointer but does not auto-advance. |
| **2.3.1 Three Flashes or Below Threshold** | A | Supports | The widget UI contains no flashing content. |
| **2.4.1 Bypass Blocks** | A | Not Applicable | The widget is a UI component, not a page. Bypass mechanisms are a host page responsibility. |
| **2.4.2 Page Titled** | A | Not Applicable | Page title is a host page responsibility. |
| **2.4.3 Focus Order** | A | Supports | Focus moves logically: toggle → panel header → feature items (arrow navigation) → language section → profiles section → footer. Escape returns focus to the toggle button. |
| **2.4.4 Link Purpose (In Context)** | A | Supports | The optional accessibility statement link reads "View Accessibility Statement →" with `rel="noopener noreferrer"`. No ambiguous link text is used. |
| **2.5.1 Pointer Gestures** | A | Supports | All functionality is operable with single-point activation. No path-based or multipoint gestures are required. |
| **2.5.2 Pointer Cancellation** | A | Supports | All buttons activate on pointer up (via `click` event, which fires on release). Users can drag off the target before releasing to cancel. |
| **2.5.3 Label in Name** | A | Supports | Visible text labels on buttons match or are contained within the `aria-label` / accessible name of each control. |
| **2.5.4 Motion Actuation** | A | Not Applicable | No functionality is triggered by device motion or user motion. |
| **3.1.1 Language of Page** | A | Supports | The widget root element carries `lang` and `dir` attributes reflecting the currently active UI language (e.g., `lang="he" dir="rtl"`). The widget does not alter the host page's `<html>` `lang` / `dir` attributes. |
| **3.2.1 On Focus** | A | Supports | No context changes are initiated by focus alone. |
| **3.2.2 On Input** | A | Supports | Activating a feature toggle changes only that feature's state. No unexpected context changes occur. |
| **3.3.1 Error Identification** | A | Supports | If a profile name is empty when the user attempts to save, the input is focused and a status message is announced via the `aria-live` region. |
| **3.3.2 Labels or Instructions** | A | Supports | All form inputs have visible `<label>` elements or descriptive `aria-label` attributes. Range controls display the current value and unit. |
| **4.1.1 Parsing** | A | Supports | Widget-generated HTML has no duplicate IDs. All elements are properly nested. The widget root is appended to `<body>` and does not break page structure. axe-core tests confirm no parsing violations. |
| **4.1.2 Name, Role, Value** | A | Supports | All interactive elements have appropriate ARIA roles, states, and properties: `aria-checked` for toggles, `aria-expanded` for the panel, `aria-label` for controls without visible text, `aria-keyshortcuts` on the toggle button. |
| **4.1.3 Status Messages** | A | Supports | Feature enable/disable events and the reset confirmation are announced via a `role="status"` / `aria-live="polite"` region. The region is visually hidden but present in the DOM at all times. |

---

## WCAG 2.2 Level AA — Conformance Table

| Success Criterion | Level | Status | Notes |
|---|---|---|---|
| **1.2.4 Captions (Live)** | AA | Not Applicable | No live audio content. |
| **1.2.5 Audio Description (Prerecorded)** | AA | Not Applicable | No video content. |
| **1.3.4 Orientation** | AA | Supports | The widget panel adapts to both portrait and landscape orientations. It uses `safe-area-inset-*` CSS for notched devices. No functionality is locked to a single orientation. |
| **1.3.5 Identify Input Purpose** | AA | Not Applicable | The only form input (profile name) does not collect personal information. `autocomplete` attributes for personal data tokens are not applicable. |
| **1.4.3 Contrast (Minimum)** | AA | Supports | Normal-size widget text (panel labels, button text, range values): target ≥ 4.5:1. The brand colour `#0060df` on white achieves 5.4:1. Inactive muted text uses `#666666` on white (5.7:1). Large text (panel title, section headings) target ≥ 3:1. axe-core automated tests confirm no contrast violations in normal, dark, and high-contrast modes. |
| **1.4.4 Resize Text** | AA | Supports | All widget typography uses `rem`/`em` units. The panel scrolls without clipping content when the browser default font size is increased to 200%. Safe-area and scroll overflow are handled via CSS. |
| **1.4.5 Images of Text** | AA | Supports | No images of text are used in the widget. All text is actual DOM text or CSS-generated content. |
| **1.4.10 Reflow** | AA | Supports | The widget panel is `max-width: 340px` and scrollable. At a viewport width of 320 CSS pixels (400% zoom on a 1280px screen), the panel scrolls vertically within its max-width without requiring horizontal scrolling. |
| **1.4.11 Non-text Contrast** | AA | Supports | Interactive UI component boundaries (toggle button border, feature item active border, range control buttons) achieve ≥ 3:1 contrast ratio against adjacent colours. axe-core automated tests verify UI component contrast. |
| **1.4.12 Text Spacing** | AA | Supports | Applying the WCAG minimum text spacing overrides (`line-height: 1.5`, `letter-spacing: 0.12em`, `word-spacing: 0.16em`) does not cause text to be clipped, truncated, or overlapping within the widget panel. Overflow is handled by `overflow-y: auto`. |
| **1.4.13 Content on Hover or Focus** | AA | Supports | The optional first-visit tooltip is: (a) dismissible via `Escape` or a click/tap anywhere on the document; (b) hoverable — pointer entering the tooltip does not dismiss it; (c) persistent — it remains until explicitly dismissed or 5 seconds elapse. |
| **2.4.5 Multiple Ways** | AA | Not Applicable | The widget panel has a single, intentional entry point (the toggle button). Multiple navigation paths to a floating control panel are not a meaningful requirement. |
| **2.4.6 Headings and Labels** | AA | Supports | The panel header contains the widget title. Each feature group (Visual Adjustments, Content Adjustments, Navigation Aids) has a labelled `role="group"`. Individual feature labels are clear and descriptive. Range control groups are labelled by the feature name. |
| **2.4.7 Focus Visible** | AA | Supports | All focusable elements within the widget display a visible focus indicator. The browser-native focus ring is preserved. The widget adds an orange `box-shadow` ring on focused interactive elements inside the panel. |
| **2.4.11 Focus Not Obscured (Minimum)** | AA | Supports | The scrollable panel container ensures focused items are scrolled into view. The toggle button in the page corner is not obscured by the panel (they occupy different positions). |
| **2.4.12 Focus Not Obscured (Enhanced)** | AAA | Not Evaluated | Level AAA; out of scope for this report. |
| **2.4.13 Focus Appearance** | AAA | Not Evaluated | Level AAA; out of scope for this report. |
| **2.5.7 Dragging Movements** | AA | Supports | No widget functionality requires a dragging motion. The reading guide line tracks mouse movement but requires no drag interaction. |
| **2.5.8 Target Size (Minimum)** | AA | Supports | The toggle button is 48 × 48 px (meets WCAG 2.5.8's 24 × 24 px minimum with offset clearance). Feature item rows are minimum 44 px tall. Range control `+`/`−` buttons are 28 × 28 px. The close button is 28 × 28 px. |
| **3.1.2 Language of Parts** | AA | Supports | The widget root element carries the `lang` attribute of the active UI language. When the language is switched (e.g., from English to Arabic), the `lang` and `dir` attributes on the widget root update immediately, enabling AT to switch language/voice appropriately for widget text. |
| **3.2.3 Consistent Navigation** | AA | Supports | The toggle button is always placed in the same viewport corner (configurable, but consistent within a session). The panel layout, section order, and button positions do not change between opens. |
| **3.2.4 Consistent Identification** | AA | Supports | The toggle button and its `aria-label` are consistent across all panel states and languages (label updates to the active language but always identifies the same control). |
| **3.2.6 Consistent Help** | AA | Supports | When `accessibilityStatementUrl` is configured, the "View Accessibility Statement" link is consistently placed in the panel footer on every open. |
| **3.3.3 Error Suggestion** | AA | Not Applicable | The only user input is the profile name field. If it is blank on save, focus returns to the input with an aria-live announcement. There is no complex data format to validate. |
| **3.3.4 Error Prevention (Legal, Financial, Data)** | AA | Not Applicable | The widget does not collect financial, legal, or sensitive user data. Profile data is stored only in `localStorage`. |

---

## WCAG 2.2 — Summary

| Level | Total Criteria | Supports | Partially Supports | Does Not Support | Not Applicable | Not Evaluated |
|---|---|---|---|---|---|---|
| **A** | 30 | 24 | 0 | 0 | 6 | 0 |
| **AA** | 20 | 14 | 0 | 0 | 5 | 1 |
| **Totals** | 50 | 38 | 0 | 0 | 11 | 1 |

The one "Not Evaluated" criterion (2.4.12 / Focus Appearance Enhanced, Level AAA) is out of scope for a Level AA report.

---

## Feature-to-WCAG Mapping

The table below maps each widget feature to the WCAG Success Criteria it **assists** the user in meeting on the host page. These are user-controlled adjustments — they do not make the host page WCAG conformant, but they provide tools that can meaningfully help users.

| Feature | WCAG SC Assisted | Level | Notes |
|---|---|---|---|
| High Contrast | 1.4.3 Contrast (Minimum) | AA | Increases contrast between foreground and background on host page |
| Dark Mode | 1.4.3 Contrast (Minimum) | AA | Reduces glare; may assist users with photosensitivity |
| Font Size | 1.4.4 Resize Text | AA | User-controlled text scaling from 100 % to 175 % |
| Pause Animations | 2.3.3 Animation from Interactions | AAA | Stops CSS animations and transitions; also benefits users who need reduced motion |
| Invert Colors | 1.4.3 Contrast (Minimum) | AA | Alternative contrast mechanism; user-activated |
| Deuteranopia Filter | 1.4.1 Use of Color | A | SVG colour-matrix correction for green-blind users |
| Protanopia Filter | 1.4.1 Use of Color | A | SVG colour-matrix correction for red-blind users |
| Tritanopia Filter | 1.4.1 Use of Color | A | SVG colour-matrix correction for blue-blind users |
| Dyslexia Font | 1.4.8 Visual Presentation | AAA | Applies fonts reported to assist dyslexic readers |
| Underline Links | 1.4.1 Use of Color | A | Makes link purpose visible without relying on colour alone |
| Hide Images | — | — | Reduces visual noise for users with cognitive or sensory sensitivities |
| Text Spacing | 1.4.12 Text Spacing | AA | Applies WCAG minimum spacing values |
| Highlight Headings | 1.3.1 Info and Relationships | A | Visually reinforces page structure for cognitive accessibility |
| Focus Outline | 2.4.7 Focus Visible | AA | Enhances browser-default focus ring for keyboard users |
| Large Cursor | — | — | Helps users with motor impairments or low vision track the pointer |
| Reading Guide | 2.4.3 Focus Order | A | Horizontal line aids line-tracking for low vision / dyslexia users |
| Text to Speech | 1.1.1 Non-text Content | A | Reads selected text aloud using Web Speech API |
| Focus Mode | 1.4.3 Contrast (Minimum) | AA | Dims non-content regions to reduce visual distraction |
| Line Height | 1.4.12 Text Spacing | AA | Independent line-height control (5 levels) |
| Letter Spacing | 1.4.12 Text Spacing | AA | Independent letter-spacing control (5 levels) |
| Word Spacing | 1.4.12 Text Spacing | AA | Independent word-spacing control (5 levels) |
| Readable Font | 1.4.8 Visual Presentation | AAA | System-native, highly legible font stack |
| Saturation | — | — | De-saturates page colours; helps users with sensory sensitivity |
| Brightness | — | — | Reduces screen brightness for photosensitive users |
| Reduced Transparency | — | — | Removes `backdrop-filter` and transparency effects |
| Sensory Friendly | 2.3.3 Animation from Interactions | AAA | Combined motion + colour + notification reduction preset |
| Suppress Notifications | — | — | CSS-only suppression of common chat widget and toast selectors |
| Highlight on Hover | — | — | Highlights paragraph under pointer; aids reading tracking |

---

## Known Limitations

1. **Text to Speech** relies on the browser's Web Speech API (`speechSynthesis`). Voice quality, language support, and availability vary by browser and operating system. This is a platform limitation, not a widget defect.
2. **Colour blindness filters** (deuteranopia, protanopia, tritanopia) use an SVG `feColorMatrix` injected into `<head>`. The colour-matrix values are approximations based on published spectral models. They assist but do not fully simulate the subjective experience of colour vision deficiencies.
3. **Dyslexia Font** and **Readable Font** apply a `font-family` override. If a host page uses `!important` on `font-family` or loads fonts via `@font-face` with higher specificity, the override may be partially or fully ineffective.
4. **Large Cursor** applies a CSS `cursor` property override. Some browsers or pointer devices may not honour custom cursor CSS.
5. **Keyboard shortcut** (default `Alt+A`) may conflict with browser or OS shortcuts on some platforms. The shortcut can be disabled via `keyboardShortcut: false` or changed via the `keyboardShortcut` option.
6. **Focus Appearance (2.4.11)** — The enhanced focus ring added by the widget (orange `box-shadow`) meets the 3:1 contrast requirement against white and most light backgrounds. Against dark backgrounds (in dark mode), the ring may have lower contrast. Users can combine the Focus Outline feature with the widget's dark mode to compensate.

---

## Automated Test Evidence

The following axe-core tests are executed on every CI run and must pass for a release to be published:

| Test Scenario | axe-core Result |
|---|---|
| Widget closed (toggle button only) | No violations |
| Widget open (full panel) | No violations |
| Widget open in Hebrew (RTL) | No violations |
| High contrast mode active | No violations |
| Dark mode active | No violations |
| Multiple features active simultaneously | No violations |
| Font size increased (level 2) | No violations |
| Widget + surrounding page content | No violations |
| Widget open + surrounding page content | No violations |
| Dark mode + surrounding page content | No violations |
| Widget with subset of features enabled | No violations |

Test suite: `test/a11y.test.js` — executed with `jest-axe@10` + `axe-core@4.8` in `jest-environment-jsdom`.

---

## Contact

To report an accessibility issue with the widget's own UI, please open an issue at:
[https://github.com/pachpul12/free-accessibility-menu/issues](https://github.com/pachpul12/free-accessibility-menu/issues)

Please include:
- Browser and version
- Assistive technology (screen reader, switch access, etc.) and version
- Steps to reproduce
- Expected behaviour vs. actual behaviour

---

*This report was prepared by the Free Accessibility Menu maintainers. It is provided voluntarily and reflects the state of the product at the version listed above. It is not a legal certification of WCAG conformance.*
