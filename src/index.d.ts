/**
 * Type declarations for free-accessibility-menu.
 *
 * The library is authored in plain JavaScript; these hand-maintained
 * declarations provide full IDE support and type checking for TypeScript
 * and JavaScript-with-JSDoc consumers.
 *
 * ### Quick start
 * ```ts
 * import AccessibilityWidget from 'free-accessibility-menu';
 * // or: import type { WidgetOptions, WidgetInstance } from 'free-accessibility-menu';
 *
 * const widget = AccessibilityWidget.init({ defaultLanguage: 'en' });
 * widget?.openMenu();
 * ```
 *
 * ### CustomEvents
 * The widget dispatches namespaced events on `window`. All events are
 * non-bubbling and non-cancelable.
 *
 * | Event              | When fired                              | `detail` type           |
 * |--------------------|-----------------------------------------|-------------------------|
 * | `a11y:init`        | Widget mounts to the DOM                | `A11yInitDetail`        |
 * | `a11y:toggle`      | A feature is enabled/disabled/adjusted  | `A11yToggleDetail`      |
 * | `a11y:open`        | Menu panel opens                        | `A11yOpenDetail`        |
 * | `a11y:close`       | Menu panel closes                       | `A11yCloseDetail`       |
 * | `a11y:reset`       | All features reset to defaults          | `A11yResetDetail`       |
 * | `a11y:langchange`  | Active language changes                 | `A11yLangchangeDetail`  |
 * | `a11y:destroy`     | Widget is about to be torn down         | `A11yDestroyDetail`     |
 */

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

/**
 * A bring-your-own storage backend for persisting accessibility settings.
 * Implement this interface to use IndexedDB, cookie-based stores, or any
 * custom persistence layer as the storage backend.
 *
 * @example
 * const myProvider: CustomStorageProvider = {
 *   getItem: (key) => myDB.get(key),
 *   setItem: (key, value) => myDB.set(key, value),
 *   removeItem: (key) => myDB.delete(key),
 * };
 * AccessibilityWidget.init({ storage: myProvider });
 */
export interface CustomStorageProvider {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Configuration options accepted by {@link AccessibilityWidget.init}.
 *
 * All properties are optional; sensible defaults apply when omitted.
 */
export interface WidgetOptions {
  /**
   * BCP-47 language code for the initial UI language.
   * Built-in: `"en"`, `"he"`, `"zh"`, `"es"`, `"ar"`, `"pt"`, `"fr"`,
   * `"de"`, `"ja"`, `"ru"` and more. Register additional locales with
   * `registerLanguage()` from `src/i18n.js` before calling `init()`.
   * @default 'en'
   */
  defaultLanguage?: string;

  /**
   * Fine-grained feature enable/disable map.
   * When omitted, **all 28 features** are enabled.
   * Set a feature's value to `false` to hide it from the panel.
   *
   * Valid IDs (Visual): `"highContrast"`, `"darkMode"`, `"fontSize"`,
   * `"pauseAnimations"`, `"invertColors"`, `"deuteranopia"`,
   * `"protanopia"`, `"tritanopia"`, `"saturation"`, `"brightness"`,
   * `"reducedTransparency"`.
   *
   * Valid IDs (Content): `"dyslexiaFont"`, `"underlineLinks"`,
   * `"hideImages"`, `"textSpacing"`, `"highlightHeadings"`,
   * `"focusMode"`, `"lineHeight"`, `"letterSpacing"`, `"wordSpacing"`,
   * `"readableFont"`, `"sensoryFriendly"`, `"suppressNotifications"`,
   * `"highlightHover"`.
   *
   * Valid IDs (Navigation): `"focusOutline"`, `"largeCursor"`,
   * `"readingGuide"`, `"textToSpeech"`.
   *
   * @example
   * features: { textToSpeech: false, readingGuide: false }
   */
  features?: Record<string, boolean>;

  /**
   * Callback invoked synchronously whenever a feature value changes.
   * Receives `(featureId, newValue)` where `newValue` is a `boolean` for
   * toggle features or a `number` for range features (e.g. `fontSize`).
   *
   * Prefer the `a11y:toggle` CustomEvent for decoupled integrations.
   */
  onToggle?: (featureId: string, value: boolean | number) => void;

  /**
   * Callback invoked when the menu panel opens.
   * Prefer the `a11y:open` CustomEvent for decoupled integrations.
   */
  onOpenMenu?: () => void;

  /**
   * Callback invoked when the menu panel closes.
   * Prefer the `a11y:close` CustomEvent for decoupled integrations.
   */
  onCloseMenu?: () => void;

  /**
   * Custom `localStorage` key for persisted user preferences.
   * Useful when multiple independent widget instances must coexist on the
   * same origin (e.g. embedded iframes or micro-frontends).
   * @default 'a11yWidgetSettings'
   */
  storageKey?: string;

  /**
   * Corner of the viewport where the toggle button is placed.
   * The widget automatically mirrors to the opposite horizontal side when
   * the active language uses an RTL script.
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

  /**
   * URL (or data URI) of the toggle button icon in its default state.
   * When omitted, the built-in data URI PNG is used.
   * Provide a self-hosted path when the page's Content-Security-Policy
   * blocks inline `data:` URIs.
   */
  toggleIconUrl?: string;

  /**
   * URL (or data URI) of the toggle button icon on pointer hover.
   * Falls back to the built-in data URI PNG when omitted.
   */
  toggleIconHoverUrl?: string;

  /**
   * URL of the site's published accessibility statement page.
   * When provided, a labelled link is rendered in the widget panel footer
   * that opens the page in a new tab with `rel="noopener noreferrer"`.
   * When omitted, no link is rendered.
   */
  accessibilityStatementUrl?: string;

  /**
   * Keyboard shortcut string that opens/closes the widget menu.
   * Use `+` as separator (e.g. `"alt+a"`, `"ctrl+shift+a"`).
   * The shortcut is matched case-insensitively.
   * Set to `false` or an empty string to disable.
   * @default 'alt+a'
   */
  keyboardShortcut?: string | false;

  /**
   * Override the primary brand colour used for interactive elements such as
   * the toggle button background and the TTS pause button.
   * Accepts any valid CSS `<color>` value (hex, `rgb()`, named colour, etc.).
   * Sets the `--a11y-primary` CSS custom property on the widget's root element.
   *
   * @example
   * primaryColor: '#7c3aed'  // purple brand
   */
  primaryColor?: string;

  /**
   * Override the panel header title and the toggle button's `aria-label`.
   * When provided, the value is used verbatim and is **not** re-translated
   * when `setLanguage()` is called.
   * When omitted, the built-in translated `menuTitle` string is used.
   *
   * @example
   * panelTitle: 'Accessibility Tools'
   */
  panelTitle?: string;

  /**
   * Control the disclaimer paragraph rendered in the widget footer.
   *
   * - `undefined` (default) — show the built-in translated disclaimer.
   * - `false` — suppress the disclaimer element entirely.
   * - `string` — show a custom static disclaimer text (not translated).
   *
   * @example
   * disclaimerText: false           // hide the disclaimer
   * disclaimerText: 'Beta feature'  // custom text
   */
  disclaimerText?: string | false;

  /**
   * Storage backend for persisting settings and profiles.
   *
   * - `'localStorage'` *(default)* — browser `localStorage`.
   * - `'sessionStorage'` — browser `sessionStorage` (cleared when tab closes).
   * - `'none'` — disables persistence; settings live only in memory for the
   *   current page session.
   * - `CustomStorageProvider` — any object implementing
   *   `{ getItem, setItem, removeItem }` for custom backends (IndexedDB
   *   adapters, cookie-based stores, etc.).
   *
   * @default 'localStorage'
   */
  storage?: 'localStorage' | 'sessionStorage' | 'none' | CustomStorageProvider;

  /**
   * Show a first-visit tooltip near the toggle button with the text
   * "Customize your accessibility settings" (translated).
   *
   * The tooltip is only shown when no settings are saved in localStorage
   * (genuine first visit). It auto-dismisses after 5 seconds or on the
   * first click / keydown anywhere in the page.
   *
   * Respects `prefers-reduced-motion`: the fade-in animation is omitted
   * when the OS has reduced motion enabled.
   *
   * Set to `false` to suppress the tooltip entirely.
   *
   * @default true
   */
  showTooltip?: boolean;

  /**
   * Show the Quick Start presets section above the feature menu.
   * The section renders five chip-buttons (Low Vision, Dyslexia, ADHD/Cognitive,
   * Motor/Keyboard, Migraine Safe) that apply a curated combination of features
   * with a single click.
   *
   * Set to `false` to hide the section entirely.
   *
   * @default true
   */
  showPresets?: boolean;

  /**
   * Enable developer-mode features: automatic alt-text / accessible-name
   * audit on page load, red outline on violating elements, and a violation
   * count badge in the panel header.
   *
   * - `undefined` (default) — auto-detect: enabled when
   *   `process.env.NODE_ENV === 'development'`.
   * - `true` — always enable.
   * - `false` — always disable.
   *
   * @example
   * devMode: true
   */
  devMode?: boolean;

  /**
   * Render a small attribution link at the very bottom of the widget footer.
   *
   * When `true`, a subtle one-line link is appended below the disclaimer and
   * reset button. The link opens in a new tab with
   * `rel="nofollow noopener noreferrer"`.
   *
   * Off by default — enabling it is entirely optional and helps support the
   * open-source project.
   *
   * @default false
   * @example
   * AccessibilityWidget.init({
   *   showAttribution: true,
   *   attributionUrl:  'https://www.advertease-tech.com/',
   *   attributionText: 'Built with Free Accessibility Menu™',
   * });
   */
  showAttribution?: boolean;

  /**
   * URL opened when the attribution link is clicked.
   * Ignored when `showAttribution` is `false`.
   *
   * @default 'https://github.com/pachpul12/free-accessibility-menu'
   */
  attributionUrl?: string;

  /**
   * Visible text for the attribution link.
   * Ignored when `showAttribution` is `false`.
   *
   * @default 'Free Accessibility Menu™'
   */
  attributionText?: string;
}

// ---------------------------------------------------------------------------
// Feature Definition
// ---------------------------------------------------------------------------

/**
 * Describes a single accessibility feature (built-in or plugin-contributed).
 *
 * Built-in feature definitions are held in `src/features.js`.  Plugin authors
 * should follow the same schema when registering features via
 * {@link A11yPlugin.features}.
 */
export interface FeatureDefinition {
  /** Unique feature identifier (e.g. `"highContrast"`, `"fontSize"`). */
  id: string;

  /** i18n translation key used to look up the feature label. */
  label: string;

  /** Feature type: `"toggle"` for on/off, `"range"` for stepped values. */
  type: 'toggle' | 'range';

  /** Visual group the feature belongs to: `"visual"`, `"content"`, or `"navigation"`. */
  group: 'visual' | 'content' | 'navigation' | string;

  /** CSS class applied to `<body>` when the feature is active (toggle) or at any non-zero level (range). */
  cssClass?: string;

  /** Minimum value for range features. */
  min?: number;

  /** Maximum value for range features. */
  max?: number;

  /** Default value for range features. */
  default?: number;

  /** Feature IDs that must be deactivated when this feature activates. */
  conflictsWith?: string[];
}

// ---------------------------------------------------------------------------
// Instance API
// ---------------------------------------------------------------------------

/**
 * The public instance API returned by {@link AccessibilityWidget.init}.
 *
 * All methods are safe to call regardless of menu state — they guard
 * internally against being called after `destroy()`.
 */
export interface WidgetInstance {
  /**
   * Open the accessibility menu panel and move focus to the first menu item.
   *
   * No-op when the panel is already open or the widget has been destroyed.
   * Sets `aria-expanded="true"` on the toggle button and dispatches
   * the `a11y:open` CustomEvent.
   *
   * @example
   * widget.openMenu(); // programmatically open
   */
  openMenu(): void;

  /**
   * Close the accessibility menu panel.
   *
   * No-op when the panel is already closed or the widget has been destroyed.
   * Sets `aria-expanded="false"` on the toggle button and dispatches
   * the `a11y:close` CustomEvent.
   *
   * @example
   * widget.closeMenu(); // programmatically close
   */
  closeMenu(): void;

  /**
   * Toggle the menu panel between open and closed.
   *
   * Delegates to `openMenu()` when closed, `closeMenu()` when open,
   * firing the corresponding CustomEvent in each case.
   */
  toggleMenu(): void;

  /**
   * Switch the widget to a different language.
   *
   * Updates all visible UI strings and adjusts layout for RTL scripts.
   * Scopes `lang` / `dir` attributes to the widget's own root element —
   * the host page's `<html>` element is **never** modified.
   *
   * No-op when `code` already matches the active language.
   * Persists the new language to localStorage.
   *
   * @param code BCP-47 language code (e.g. `"en"`, `"he"`, `"ar"`).
   *   Must be a registered code or will fall back to English strings.
   *
   * @example
   * widget.setLanguage('he'); // switch to Hebrew (RTL)
   * widget.setLanguage('en'); // switch back to English (LTR)
   */
  setLanguage(code: string): void;

  /**
   * Return a shallow copy of the current feature settings.
   *
   * Keys are enabled feature IDs; values are:
   * - `boolean` for toggle features (`true` = active, `false` = inactive)
   * - `number`  for range features (e.g. `fontSize` current step)
   *
   * The object is a snapshot — subsequent widget changes are **not**
   * reflected in previously returned copies.
   *
   * @returns Settings snapshot.
   *
   * @example
   * const settings = widget.getSettings();
   * // { highContrast: false, darkMode: true, fontSize: 2, ... }
   * if (settings.highContrast) { ... }
   */
  getSettings(): Record<string, boolean | number>;

  /**
   * Programmatically set a single feature to an explicit value.
   *
   * For **toggle** features `value` is coerced to boolean; for **range**
   * features it is coerced to a number and clamped to the feature's
   * `[min, max]` range. No-op when the value is already at the target.
   *
   * Fires `onToggle` callback and the `a11y:toggle` CustomEvent — the same
   * side-effects as a user interaction.
   *
   * @param featureId One of the 28 built-in feature IDs.
   * @param value Desired value.
   *
   * @example
   * widget.setFeature('darkMode', true);
   * widget.setFeature('fontSize', 3);
   */
  setFeature(featureId: string, value: boolean | number): void;

  /**
   * Apply multiple feature values in one call.
   *
   * Iterates the supplied `settings` map and calls `setFeature` for each
   * entry.  Unknown feature IDs and invalid values are silently skipped.
   *
   * @param settings Map of feature ID → value.
   *
   * @example
   * widget.applySettings({ darkMode: true, fontSize: 2, highContrast: false });
   */
  applySettings(settings: Record<string, boolean | number>): void;

  /**
   * Reset all features to their defaults, clear persisted settings, and
   * update the UI.
   *
   * Specifically: deactivates Reading Guide and TTS, removes all feature
   * CSS classes from `document.body`, resets internal state to feature
   * defaults, updates the menu item visual states, and removes the
   * localStorage entry so the reset survives page reloads.
   *
   * Dispatches the `a11y:reset` CustomEvent after completing.
   *
   * @example
   * document.getElementById('reset-btn')?.addEventListener('click', () => {
   *   AccessibilityWidget.getInstance()?.resetAll();
   * });
   */
  resetAll(): void;

  /**
   * Return an in-memory session usage report for analytics or debugging.
   *
   * The report is never persisted to localStorage — it reflects only the
   * current browser session.  Returns `null` after `destroy()` is called.
   *
   * @returns Session report, or `null` after destruction.
   *
   * @example
   * const report = widget.getReport();
   * if (report) {
   *   analytics.track('a11y_session', report.session);
   * }
   */
  getReport(): SessionReport | null;

  /**
   * Save the current feature settings as a named profile.
   *
   * Profiles are persisted in localStorage under
   * `{storageKey}:profiles`.  If a profile with `name` already exists it
   * is overwritten.  Dispatches the `a11y:profilesave` CustomEvent.
   *
   * @param name Unique profile name (non-empty string).
   *
   * @example
   * widget.saveProfile('High Contrast Setup');
   */
  saveProfile(name: string): void;

  /**
   * Load a previously saved profile and apply its settings.
   *
   * Calls `applySettings()` internally, fires `a11y:profileload`.
   * Returns `false` when no profile with `name` exists.
   *
   * @param name Profile name to load.
   * @returns `true` on success, `false` when the profile is not found.
   *
   * @example
   * const loaded = widget.loadProfile('High Contrast Setup');
   */
  loadProfile(name: string): boolean;

  /**
   * Delete a saved profile by name.
   *
   * Dispatches `a11y:profiledelete`.
   * Returns `false` when no profile with `name` exists.
   *
   * @param name Profile name to delete.
   * @returns `true` on success, `false` when the profile is not found.
   *
   * @example
   * widget.deleteProfile('Old Profile');
   */
  deleteProfile(name: string): boolean;

  /**
   * Return the names of all saved profiles.
   *
   * @returns Array of profile names, empty array when none exist.
   *
   * @example
   * const profiles = widget.getProfiles();
   * console.log(profiles); // ['High Contrast Setup', 'Low Vision']
   */
  getProfiles(): string[];

  /**
   * Return the BCP-47 language code of the currently active UI language.
   *
   * @returns Active language code (e.g. `"en"`, `"he"`, `"fr"`).
   *
   * @example
   * const lang = widget.getLanguage(); // 'en'
   */
  getLanguage(): string;

  /**
   * Return the array of {@link FeatureDefinition} objects for all features
   * that are currently **enabled** in this instance (F-003).
   *
   * The list respects the `features` option passed to `init()` / `createWidget()`,
   * and includes any features contributed by registered plugins.
   *
   * @returns Shallow copy of the enabled feature definitions.
   *
   * @example
   * const w = AccessibilityWidget.init({ features: { textToSpeech: false } });
   * const ids = w.getAvailableFeatures().map(f => f.id);
   * // ids does NOT include 'textToSpeech'
   */
  getAvailableFeatures(): FeatureDefinition[];

  /**
   * Remove the widget from the DOM and release all resources.
   *
   * Teardown order:
   * 1. Dispatches `a11y:destroy` on `window`.
   * 2. Sets the internal destroyed guard.
   * 3. Removes all DOM event listeners.
   * 4. Deactivates Reading Guide and Text-to-Speech.
   * 5. Resets all feature CSS classes on `document.body`.
   * 6. Restores the original `localStorage` key.
   * 7. Removes the root DOM node.
   * 8. Nulls all internal references.
   *
   * **Safe to call multiple times** — subsequent calls are silently ignored.
   * Prefer {@link AccessibilityWidget.destroy} so the singleton ref is cleared.
   *
   * @example
   * // SPA route-change cleanup:
   * AccessibilityWidget.destroy();
   */
  destroy(): void;
}

// ---------------------------------------------------------------------------
// Session Report
// ---------------------------------------------------------------------------

/**
 * Per-feature statistics collected during the current browser session.
 * Part of {@link SessionReport}.
 */
export interface FeatureStat {
  /** Whether the feature is currently enabled. */
  enabled: boolean;
  /** Number of times this feature has been toggled (on or off) this session. */
  toggleCount: number;
  /** `Date.now()` timestamp of the most recent activation, or `null`. */
  lastActivated: number | null;
}

/**
 * In-memory session usage report returned by {@link WidgetInstance.getReport}
 * and {@link AccessibilityWidget.getReport}.
 *
 * This object is never written to `localStorage` — it covers only the current
 * page session and is reset on every `init()` call.
 */
export interface SessionReport {
  /** Library version that generated this report (e.g. `"2.6.0"`). */
  version: string;
  /** Session-level telemetry. */
  session: {
    /** Random session ID (UUID v4 when `crypto.randomUUID` is available). */
    sessionId: string;
    /** `Date.now()` timestamp at widget construction time. */
    initTimestamp: number;
    /** How many times the menu panel has been opened this session. */
    menuOpenCount: number;
    /** Per-feature interaction statistics, keyed by feature ID. */
    features: Record<string, FeatureStat>;
    /** BCP-47 code of the active UI language. */
    language: string;
  };
  /** Current persisted feature settings snapshot (same as `getSettings()`). */
  persistedSettings: Record<string, boolean | number>;
  /** IDs of all features currently registered in the panel. */
  enabledFeatureIds: string[];
}

// ---------------------------------------------------------------------------
// CustomEvent detail shapes
// ---------------------------------------------------------------------------

/**
 * Detail for the `a11y:init` event.
 * Fired once after the widget mounts to the DOM.
 *
 * @example
 * window.addEventListener('a11y:init', (e: CustomEvent<A11yInitDetail>) => {
 *   console.log('Initial settings:', e.detail.settings);
 * });
 */
export interface A11yInitDetail {
  /** Initial feature settings snapshot at startup. */
  settings: Record<string, boolean | number>;
}

/**
 * Detail for the `a11y:toggle` event.
 * Fired whenever a feature is enabled, disabled, or its range value changes.
 *
 * @example
 * window.addEventListener('a11y:toggle', (e: CustomEvent<A11yToggleDetail>) => {
 *   const { featureId, value, settings } = e.detail;
 *   analytics.track('a11y_toggle', { featureId, value });
 * });
 */
export interface A11yToggleDetail {
  /** The ID of the feature that changed (e.g. `"highContrast"`). */
  featureId: string;
  /** New value: `boolean` for toggle features, `number` for range features. */
  value: boolean | number;
  /** Full settings snapshot **after** the change. */
  settings: Record<string, boolean | number>;
}

/**
 * Detail for the `a11y:open` event.
 * Fired when the menu panel transitions from closed to open.
 * `event.detail` is an empty object.
 */
export type A11yOpenDetail = Record<never, never>;

/**
 * Detail for the `a11y:close` event.
 * Fired when the menu panel transitions from open to closed.
 * `event.detail` is an empty object.
 */
export type A11yCloseDetail = Record<never, never>;

/**
 * Detail for the `a11y:reset` event.
 * Fired after `resetAll()` completes.
 *
 * @example
 * window.addEventListener('a11y:reset', (e: CustomEvent<A11yResetDetail>) => {
 *   console.log('Post-reset state:', e.detail.settings);
 * });
 */
export interface A11yResetDetail {
  /** Post-reset settings snapshot (all features at their defaults). */
  settings: Record<string, boolean | number>;
}

/**
 * Detail for the `a11y:langchange` event.
 * Fired after `setLanguage()` switches to a new locale.
 *
 * @example
 * window.addEventListener('a11y:langchange', (e: CustomEvent<A11yLangchangeDetail>) => {
 *   document.documentElement.lang = e.detail.language;
 * });
 */
export interface A11yLangchangeDetail {
  /** The new BCP-47 language code. */
  language: string;
}

/**
 * Detail for the `a11y:destroy` event.
 * Fired at the very start of `destroy()`, before any teardown occurs.
 * `event.detail` is an empty object.
 */
export type A11yDestroyDetail = Record<never, never>;

// ---------------------------------------------------------------------------
// Module default export
// ---------------------------------------------------------------------------

/**
 * The public singleton API for the Accessibility Menu Widget.
 *
 * Attach to `window.AccessibilityWidget` automatically for UMD builds, or
 * import as an ES module:
 * ```ts
 * import AccessibilityWidget from 'free-accessibility-menu';
 * ```
 */
declare const AccessibilityWidget: {
  /**
   * Semantic version string of the installed library (e.g. `"1.1.0"`).
   */
  readonly version: string;

  /**
   * Mount the accessibility widget and append it to `document.body`.
   *
   * - Enforces singleton: any existing instance is destroyed before the new
   *   one is created.
   * - SSR-safe: returns `null` when `window` / `document` is unavailable.
   * - Dispatches `a11y:init` on `window` after mounting.
   *
   * @param options Configuration for the widget. All properties are optional.
   * @returns The created instance, or `null` in non-browser environments.
   *
   * @example
   * // Minimal — English, all features, bottom-right
   * const widget = AccessibilityWidget.init();
   *
   * @example
   * // Custom locale, statement link, and feature subset
   * const widget = AccessibilityWidget.init({
   *   defaultLanguage: 'fr',
   *   accessibilityStatementUrl: '/accessibility',
   *   features: { textToSpeech: false },
   * });
   */
  init(options?: WidgetOptions): WidgetInstance | null;

  /**
   * Return the currently active widget instance, or `null` if none exists.
   *
   * Useful for controlling the widget from code that does not hold the
   * reference returned by `init()`.
   *
   * @example
   * const w = AccessibilityWidget.getInstance();
   * if (w) { w.openMenu(); }
   */
  getInstance(): WidgetInstance | null;

  /**
   * Return the session usage report from the active instance, or `null` when
   * no instance exists.
   *
   * Delegates to {@link WidgetInstance.getReport}.
   *
   * @returns Session report, or `null` when no instance is active.
   *
   * @example
   * const report = AccessibilityWidget.getReport();
   */
  getReport(): SessionReport | null;

  /**
   * Destroy the active widget instance and remove it from the DOM.
   *
   * Delegates to `WidgetInstance.destroy()` then clears the singleton ref.
   * Safe to call when no instance exists.
   *
   * @example
   * // SPA route-change cleanup:
   * AccessibilityWidget.destroy();
   */
  destroy(): void;

  /**
   * Create a new, **independent** widget instance without affecting the
   * singleton managed by `init()` / `getInstance()` / `destroy()`.
   *
   * Unlike `init()`, `createWidget()`:
   * - Does **not** destroy any existing singleton instance.
   * - Does **not** register the new instance as the singleton.
   * - Does **not** change the value returned by `getInstance()`.
   *
   * Use this factory for micro-frontend scenarios where multiple independent
   * widgets must coexist on the same page with different `storageKey` values.
   * The caller is responsible for managing the returned instance's lifecycle
   * (call `instance.destroy()` when the component unmounts).
   *
   * SSR-safe: returns `null` when `window` / `document` is unavailable.
   *
   * @param options Configuration for the widget. All properties are optional.
   * @returns The created instance, or `null` in non-browser environments.
   *
   * @example
   * // Micro-frontend: two widgets with separate storage keys
   * const w1 = AccessibilityWidget.createWidget({ storageKey: 'mfeA', position: 'top-right' });
   * const w2 = AccessibilityWidget.createWidget({ storageKey: 'mfeB', position: 'bottom-left' });
   * // Caller must clean up:
   * w1?.destroy();
   * w2?.destroy();
   */
  createWidget(options?: WidgetOptions): WidgetInstance | null;

  /**
   * Register an external plugin that contributes new accessibility features
   * to every widget instance created **after** this call (F-003).
   *
   * A plugin must provide:
   * - `id` — a unique string identifier for the plugin itself.
   * - `features` — an array of {@link FeatureDefinition} objects describing
   *   the features the plugin adds.
   * - `handlers` — a map of `featureId → { activate, deactivate }` functions
   *   that are called when the feature is toggled on or off.
   * - `mount(container, widget)` — called once after the widget DOM is built;
   *   use this to inject plugin-specific UI into `container`.
   * - `unmount(widget)` — called when the widget instance is destroyed.
   *
   * All plugin features are merged into the enabled feature list and are
   * accessible via `setFeature()`, `applySettings()`, `resetAll()`, and
   * `getAvailableFeatures()`.
   *
   * @param plugin The plugin descriptor to register.
   * @throws {TypeError} If `plugin.id` is not a string or `plugin.features` is not an array.
   *
   * @example
   * AccessibilityWidget.registerPlugin({
   *   id: 'my-plugin',
   *   features: [{ id: 'customFeature', label: 'Custom', type: 'toggle', group: 'visual' }],
   *   handlers: {
   *     customFeature: {
   *       activate:   (id, value, widget) => document.body.classList.add('custom-on'),
   *       deactivate: (id, widget)        => document.body.classList.remove('custom-on'),
   *     },
   *   },
   *   mount:   (container, widget) => { /* inject plugin UI *\/ },
   *   unmount: (widget) => { /* clean up *\/ },
   * });
   * AccessibilityWidget.init();
   */
  registerPlugin(plugin: A11yPlugin): void;

  /**
   * Return the array of all available {@link FeatureDefinition} objects,
   * including built-in features and any registered plugin features (F-003).
   *
   * When a widget instance is active, delegates to
   * `WidgetInstance.getAvailableFeatures()` which respects the `features`
   * option passed to `init()`. When no instance is active, returns the full
   * set of built-in + registered plugin features.
   *
   * @returns Array of feature definitions.
   *
   * @example
   * const features = AccessibilityWidget.getAvailableFeatures();
   * const ids = features.map(f => f.id);
   * console.log(ids); // ['highContrast', 'darkMode', ...]
   */
  getAvailableFeatures(): FeatureDefinition[];

  /**
   * Remove all registered external plugins.
   *
   * **For testing only.** Resets `Widget._externalPlugins` to an empty array
   * so that test suites can start each test from a clean plugin registry.
   * Do not call this in production code.
   *
   * @internal
   */
  _clearPlugins(): void;
};

// ---------------------------------------------------------------------------
// Plugin Architecture (F-003)
// ---------------------------------------------------------------------------

/**
 * Handler pair for a single plugin-contributed feature.
 *
 * `activate` is called with `(featureId, value, widgetInstance)` when the
 * feature is turned on or its range value changes.
 * `deactivate` is called with `(featureId, widgetInstance)` when it is
 * turned off.
 */
export interface A11yPluginHandler {
  activate(featureId: string, value: boolean | number, widget: WidgetInstance): void;
  deactivate(featureId: string, widget: WidgetInstance): void;
}

/**
 * An external plugin that extends the widget with additional accessibility
 * features.  Register with `AccessibilityWidget.registerPlugin(plugin)` before
 * calling `init()`.
 */
export interface A11yPlugin {
  /** Unique identifier for this plugin. */
  id: string;

  /**
   * Feature definitions contributed by this plugin.
   * Each entry follows the same schema as built-in {@link FeatureDefinition} objects.
   */
  features: FeatureDefinition[];

  /**
   * Map of `featureId → handler` pairs.  Must cover every feature id listed
   * in {@link features}.
   */
  handlers?: Record<string, A11yPluginHandler>;

  /**
   * Called once after the widget DOM is built.
   * Use this hook to inject plugin-specific UI into the widget panel.
   *
   * @param container The widget panel root element.
   * @param widget    The active {@link WidgetInstance}.
   */
  mount?(container: HTMLElement, widget: WidgetInstance): void;

  /**
   * Called when the widget instance is destroyed.
   * Use this hook to clean up any DOM or event listeners added in `mount`.
   *
   * @param widget The {@link WidgetInstance} being destroyed.
   */
  unmount?(widget: WidgetInstance): void;
}

export default AccessibilityWidget;
