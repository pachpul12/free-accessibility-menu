/**
 * Entry point for the Accessibility Menu Widget.
 *
 * Exports the public API object that consumers use to initialise and
 * control the widget.  For UMD builds Rollup will attach the default
 * export to the global `window.AccessibilityWidget`.
 *
 * @module index
 */

import Widget from './widget.js';

// ---------------------------------------------------------------------------
// Track the active widget instance (singleton by default)
// ---------------------------------------------------------------------------

/** @type {Widget|null} */
let _instance = null;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Options accepted by {@link AccessibilityWidget.init}.
 *
 * All properties are optional; sensible defaults are applied when omitted.
 *
 * @typedef {Object} WidgetOptions
 *
 * @property {string} [defaultLanguage='en']
 *   BCP-47 language code for the initial UI language.
 *   Built-in languages: `"en"`, `"he"`, `"zh"`, `"es"`, `"ar"`, `"pt"`, `"fr"`,
 *   `"de"`, `"ja"`, `"ru"` and more.  Additional locales can be registered at
 *   runtime via `registerLanguage()` from `src/i18n.js`.
 *
 * @property {Record<string, boolean>} [features]
 *   Fine-grained feature enable/disable map.  When omitted, **all 14 features**
 *   are enabled.  Supply an object whose keys are feature IDs to selectively
 *   disable features (set the value to `false`):
 *   ```js
 *   features: { textToSpeech: false, readingGuide: false }
 *   ```
 *   Valid IDs: `highContrast`, `darkMode`, `fontSize`, `pauseAnimations`,
 *   `invertColors`, `dyslexiaFont`, `underlineLinks`, `hideImages`,
 *   `textSpacing`, `highlightHeadings`, `focusOutline`, `largeCursor`,
 *   `readingGuide`, `textToSpeech`.
 *
 * @property {function(string, boolean|number): void} [onToggle]
 *   Callback invoked synchronously whenever a feature value changes.
 *   Receives `(featureId, newValue)`.  For toggle features `newValue` is a
 *   boolean; for range features (e.g. `fontSize`) it is a number.
 *   Prefer the `a11y:toggle` CustomEvent for decoupled integrations.
 *
 * @property {function(): void} [onOpenMenu]
 *   Callback invoked when the menu panel opens.
 *   Prefer the `a11y:open` CustomEvent for decoupled integrations.
 *
 * @property {function(): void} [onCloseMenu]
 *   Callback invoked when the menu panel closes.
 *   Prefer the `a11y:close` CustomEvent for decoupled integrations.
 *
 * @property {string} [storageKey='a11yWidgetSettings']
 *   Custom `localStorage` key for persisting user preferences.  Useful when
 *   multiple independent widgets must coexist on the same origin.
 *
 * @property {'bottom-right'|'bottom-left'|'top-right'|'top-left'} [position='bottom-right']
 *   Corner of the viewport where the widget toggle button is placed.
 *   The widget automatically mirrors to the opposite horizontal side when the
 *   active language is RTL.
 *
 * @property {string} [toggleIconUrl]
 *   URL (or data URI) of the image shown on the toggle button in its default
 *   state.  When omitted the built-in data URI is used.  Provide an absolute
 *   URL or a CSP-safe path when Content-Security-Policy restricts inline data.
 *
 * @property {string} [toggleIconHoverUrl]
 *   URL (or data URI) of the image shown when the pointer hovers over the
 *   toggle button.  Falls back to the default data URI when omitted.
 *
 * @property {string} [accessibilityStatementUrl]
 *   URL of the site's accessibility statement page.  When provided, a labelled
 *   link is rendered in the widget footer that opens the page in a new tab.
 *   When omitted, no link is rendered.
 */

// ---------------------------------------------------------------------------
// CustomEvent detail typedefs (dispatched on `window`)
// ---------------------------------------------------------------------------

/**
 * Detail object for the `a11y:init` event.
 * Fired once immediately after the widget is mounted to the DOM.
 *
 * @typedef {Object} A11yInitDetail
 * @property {Record<string, boolean|number>} settings
 *   Initial feature settings snapshot (all feature IDs mapped to their
 *   loaded-or-default values at startup).
 *
 * @example
 * window.addEventListener('a11y:init', function (e) {
 *   console.log('Widget ready. Settings:', e.detail.settings);
 * });
 */

/**
 * Detail object for the `a11y:toggle` event.
 * Fired whenever a feature is toggled on/off or a range feature is adjusted.
 *
 * @typedef {Object} A11yToggleDetail
 * @property {string}                         featureId
 *   The ID of the feature that changed (e.g. `"highContrast"`, `"fontSize"`).
 * @property {boolean|number}                 value
 *   The new value: `boolean` for toggle features, `number` for range features.
 * @property {Record<string, boolean|number>} settings
 *   Full settings snapshot reflecting the state **after** the change.
 *
 * @example
 * window.addEventListener('a11y:toggle', function (e) {
 *   var d = e.detail; // A11yToggleDetail
 *   console.log(d.featureId, 'is now', d.value);
 *   sendAnalytics('a11y_toggle', d);
 * });
 */

/**
 * Detail object for the `a11y:open` event.
 * Fired when the menu panel transitions from closed to open.
 *
 * @typedef {Object} A11yOpenDetail
 * (empty object — no additional properties)
 *
 * @example
 * window.addEventListener('a11y:open', function () {
 *   console.log('Accessibility menu opened');
 * });
 */

/**
 * Detail object for the `a11y:close` event.
 * Fired when the menu panel transitions from open to closed.
 *
 * @typedef {Object} A11yCloseDetail
 * (empty object — no additional properties)
 */

/**
 * Detail object for the `a11y:reset` event.
 * Fired after {@link WidgetInstance#resetAll} completes.
 *
 * @typedef {Object} A11yResetDetail
 * @property {Record<string, boolean|number>} settings
 *   Post-reset settings snapshot (all features at their default values).
 *
 * @example
 * window.addEventListener('a11y:reset', function (e) {
 *   console.log('All features reset. Defaults:', e.detail.settings);
 * });
 */

/**
 * Detail object for the `a11y:langchange` event.
 * Fired after {@link WidgetInstance#setLanguage} switches to a new locale.
 *
 * @typedef {Object} A11yLangchangeDetail
 * @property {string} language - The new BCP-47 language code.
 *
 * @example
 * window.addEventListener('a11y:langchange', function (e) {
 *   console.log('Language changed to', e.detail.language);
 * });
 */

/**
 * Detail object for the `a11y:destroy` event.
 * Fired at the very start of {@link WidgetInstance#destroy}, before any
 * teardown occurs, giving listeners a chance to react before the DOM node
 * is removed.
 *
 * @typedef {Object} A11yDestroyDetail
 * (empty object — no additional properties)
 */

/**
 * The public singleton API for the Accessibility Menu Widget.
 *
 * Consumers interact exclusively with this object.  For UMD builds Rollup
 * attaches it to `window.AccessibilityWidget`.
 *
 * ### Quick start
 * ```html
 * <script src="dist/index.umd.js"></script>
 * <link rel="stylesheet" href="dist/a11y-widget.css">
 * <script>
 *   AccessibilityWidget.init({ defaultLanguage: 'en' });
 * </script>
 * ```
 *
 * ### CustomEvents
 * The widget dispatches namespaced CustomEvents on `window` for analytics
 * and framework integrations. All events are non-bubbling and non-cancelable.
 *
 * | Event               | Fired when                              | `event.detail` type      |
 * |---------------------|-----------------------------------------|--------------------------|
 * | `a11y:init`         | Widget mounts to the DOM                | {@link A11yInitDetail}   |
 * | `a11y:toggle`       | A feature is enabled/disabled/adjusted  | {@link A11yToggleDetail} |
 * | `a11y:open`         | Menu panel opens                        | {@link A11yOpenDetail}   |
 * | `a11y:close`        | Menu panel closes                       | {@link A11yCloseDetail}  |
 * | `a11y:reset`        | All features reset to defaults          | {@link A11yResetDetail}  |
 * | `a11y:langchange`   | Active language changes                 | {@link A11yLangchangeDetail} |
 * | `a11y:destroy`      | Widget is about to be torn down         | {@link A11yDestroyDetail} |
 */
const AccessibilityWidget = {
  /**
   * Semantic version of the library.
   * @type {string}
   */
  version: '2.0.0',

  /**
   * Mount the accessibility widget and append it to `document.body`.
   *
   * **Singleton enforcement**: if a widget is already active it is destroyed
   * before the new one is created, ensuring at most one widget exists at a time.
   *
   * **SSR-safe**: returns `null` when `window` or `document` is not defined so
   * that server-side rendering frameworks (Next.js, Nuxt, etc.) do not throw.
   *
   * @param {WidgetOptions} [options={}] - Configuration for the new widget.
   * @returns {Widget|null} The newly created widget instance, or `null` in
   *   non-browser environments.
   * @fires {CustomEvent} a11y:init - Dispatched on `window` after mount.
   *   `event.detail` is an {@link A11yInitDetail} object.
   *
   * @example <caption>Minimal init (English, all features, bottom-right)</caption>
   * var widget = AccessibilityWidget.init();
   *
   * @example <caption>Custom language and statement link</caption>
   * var widget = AccessibilityWidget.init({
   *   defaultLanguage: 'he',
   *   accessibilityStatementUrl: '/accessibility',
   *   position: 'bottom-left',
   * });
   *
   * @example <caption>Disable individual features</caption>
   * AccessibilityWidget.init({
   *   features: { textToSpeech: false, readingGuide: false },
   * });
   *
   * @example <caption>Listen for feature changes</caption>
   * window.addEventListener('a11y:toggle', function (e) {
   *   console.log(e.detail.featureId, '→', e.detail.value);
   * });
   * AccessibilityWidget.init();
   *
   * @example <caption>SSR guard pattern</caption>
   * // Safe to call during SSR — returns null on the server, Widget on client
   * var widget = AccessibilityWidget.init();
   * if (widget) { widget.openMenu(); }
   */
  init(options) {
    // SSR guard — do nothing outside a browser context
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return null;
    }

    // Destroy any previous instance
    if (_instance) {
      _instance.destroy();
      _instance = null;
    }

    _instance = new Widget(options);
    return _instance;
  },

  /**
   * Return the currently active widget instance, or `null` if none exists.
   *
   * Useful for controlling the widget from external code without keeping a
   * reference to the value returned by `init()`.
   *
   * @returns {Widget|null}
   * @example
   * var w = AccessibilityWidget.getInstance();
   * if (w) { w.openMenu(); }
   */
  getInstance() {
    return _instance;
  },

  /**
   * Destroy the active widget instance and remove it from the DOM.
   *
   * Delegates to {@link Widget#destroy} on the current instance then clears
   * the internal reference. Safe to call when no instance exists.
   *
   * @fires {CustomEvent} a11y:destroy - Forwarded from the instance's own
   *   `destroy()` call before the DOM node is removed.
   *
   * @example
   * // Tear down the widget (e.g. in a SPA route change handler)
   * AccessibilityWidget.destroy();
   */
  destroy() {
    if (_instance) {
      _instance.destroy();
      _instance = null;
    }
  },
};

// ---------------------------------------------------------------------------
// UMD / global fallback
// ---------------------------------------------------------------------------

if (typeof window !== 'undefined') {
  window.AccessibilityWidget = AccessibilityWidget;
}

export default AccessibilityWidget;
