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
   * When omitted, **all 14 features** are enabled.
   * Set a feature's value to `false` to hide it from the panel.
   *
   * Valid IDs: `"highContrast"`, `"darkMode"`, `"fontSize"`,
   * `"pauseAnimations"`, `"invertColors"`, `"dyslexiaFont"`,
   * `"underlineLinks"`, `"hideImages"`, `"textSpacing"`,
   * `"highlightHeadings"`, `"focusOutline"`, `"largeCursor"`,
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
};

export default AccessibilityWidget;
