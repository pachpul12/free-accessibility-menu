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
import { FEATURES } from './features.js';
import { getAvailableLanguages } from './i18n.js';

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
 *
 * @property {boolean} [showAttribution=false]
 *   When `true`, renders a small attribution link at the very bottom of the
 *   widget footer (below the disclaimer and reset button).  Off by default —
 *   opt-in only.  Enabling it helps support the open-source project.
 *
 * @property {string} [attributionUrl='https://github.com/pachpul12/free-accessibility-menu']
 *   URL for the attribution link.  Ignored when `showAttribution` is falsy.
 *
 * @property {string} [attributionText='Free Accessibility Menu™']
 *   Visible link text for the attribution row.  Ignored when `showAttribution`
 *   is falsy.
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
  version: '2.11.0',

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

    // Development mode option validation
    if (options && (typeof process === 'undefined' || process.env.NODE_ENV !== 'production')) {
      var _validPositions = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
      if (options.position && _validPositions.indexOf(options.position) === -1) {
        console.warn('[AccessibilityWidget] Invalid position: "' + options.position + '". Valid values: ' + _validPositions.join(', '));
      }
      if (options.features && typeof options.features === 'object') {
        var _validFeatureIds = FEATURES.map(function(f) { return f.id; });
        Object.keys(options.features).forEach(function(key) {
          if (_validFeatureIds.indexOf(key) === -1) {
            console.warn('[AccessibilityWidget] Unknown feature id: "' + key + '". Valid ids: ' + _validFeatureIds.join(', '));
          }
        });
      }
      if (options.defaultLanguage) {
        var _registeredLangs = getAvailableLanguages();
        if (_registeredLangs.indexOf(options.defaultLanguage) === -1) {
          console.warn('[AccessibilityWidget] Language "' + options.defaultLanguage + '" is not registered. Available languages: ' + _registeredLangs.join(', '));
        }
      }
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

  /**
   * Return an in-memory session usage report, or null if no instance exists.
   *
   * @returns {Object|null}
   */
  getReport() {
    return _instance ? _instance.getReport() : null;
  },

  /**
   * Create a new, **independent** widget instance without affecting the
   * singleton managed by `init()` / `getInstance()` / `destroy()`.
   *
   * Unlike `init()`, `createWidget()`:
   * - Does **not** destroy any existing singleton instance.
   * - Does **not** register the new instance as the singleton.
   * - Does **not** change the value returned by `getInstance()`.
   *
   * Use this factory for **micro-frontend** scenarios where multiple
   * independent widgets must coexist on the same page with different
   * `storageKey` values.  The caller is responsible for managing the
   * returned instance's lifecycle (call `instance.destroy()` when the
   * component unmounts).
   *
   * **SSR-safe**: returns `null` when `window` or `document` is not defined.
   *
   * @param {WidgetOptions} [options={}] - Configuration for the new widget.
   * @returns {Widget|null} The newly created instance, or `null` in
   *   non-browser environments.
   *
   * @example <caption>Micro-frontend — two widgets with separate storage keys</caption>
   * var headerWidget = AccessibilityWidget.createWidget({
   *   storageKey: 'headerA11y',
   *   position: 'top-right',
   * });
   * var footerWidget = AccessibilityWidget.createWidget({
   *   storageKey: 'footerA11y',
   *   position: 'bottom-left',
   * });
   *
   * // Clean up when components unmount:
   * headerWidget.destroy();
   * footerWidget.destroy();
   */
  createWidget(options) {
    // SSR guard — do nothing outside a browser context
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return null;
    }
    return new Widget(options);
  },

  /**
   * Register an external plugin that contributes new features to the widget.
   *
   * Call this **before** `init()` so that the plugin's features are included
   * when the widget DOM is built.  Plugins registered after `init()` will
   * take effect the next time a new widget instance is created.
   *
   * @param {Object} plugin - Plugin object conforming to the `A11yPlugin` interface.
   * @param {string}   plugin.id       - Unique plugin identifier.
   * @param {string}   plugin.group    - Feature group key for display grouping.
   * @param {Array}    plugin.features - Array of `FeatureDefinition` objects.
   * @param {function} [plugin.activate]   - `activate(featureId, value, widgetInstance)`
   * @param {function} [plugin.deactivate] - `deactivate(featureId, widgetInstance)`
   * @param {function} [plugin.mount]      - `mount(panelElement, widgetInstance)` — called after DOM build.
   * @param {function} [plugin.unmount]    - `unmount(widgetInstance)` — called before destroy.
   * @throws {TypeError} If plugin is missing required `id` or `features` properties.
   *
   * @example
   * AccessibilityWidget.registerPlugin({
   *   id: 'cursor-size',
   *   group: 'visual',
   *   features: [
   *     { id: 'largeCursor2', type: 'toggle', cssClass: 'a11y-cursor-xl', default: false, group: 'visual', icon: '' }
   *   ],
   *   activate: function (featureId, value) {
   *     document.body.style.cursor = 'url(/cursors/xl.png), auto';
   *   },
   *   deactivate: function (featureId) {
   *     document.body.style.cursor = '';
   *   },
   * });
   * AccessibilityWidget.init();
   */
  registerPlugin(plugin) {
    if (!plugin || typeof plugin.id !== 'string' || !Array.isArray(plugin.features)) {
      throw new TypeError(
        '[AccessibilityWidget] registerPlugin: plugin must have an `id` (string) and `features` (Array).'
      );
    }
    Widget._externalPlugins.push(plugin);
  },

  /**
   * Return all available feature definitions — built-in features plus any
   * features contributed by registered external plugins.
   *
   * When an active widget instance exists, delegates to the instance's
   * `getAvailableFeatures()` (which reflects the enabled-feature filter
   * passed to `init()`).  When no instance is active, returns the full
   * unfiltered built-in + plugin feature list.
   *
   * @returns {import('./features.js').FeatureDefinition[]}
   *
   * @example
   * var features = AccessibilityWidget.getAvailableFeatures();
   * console.log(features.map(function (f) { return f.id; }));
   */
  getAvailableFeatures() {
    if (_instance) {
      return _instance.getAvailableFeatures();
    }
    // No active instance — return built-in + registered plugin features
    var all = FEATURES.slice();
    var plugins = Widget._externalPlugins;
    for (var i = 0; i < plugins.length; i++) {
      var feats = plugins[i].features || [];
      for (var j = 0; j < feats.length; j++) {
        all.push(feats[j]);
      }
    }
    return all;
  },

  /**
   * Remove all registered external plugins.
   *
   * Intended for use in test environments only.  Clears `Widget._externalPlugins`
   * so that plugins registered in one test do not bleed into subsequent tests.
   *
   * @internal
   */
  _clearPlugins() {
    Widget._externalPlugins = [];
  },
};

// ---------------------------------------------------------------------------
// UMD / global fallback
// ---------------------------------------------------------------------------

if (typeof window !== 'undefined') {
  window.AccessibilityWidget = AccessibilityWidget;
}

export default AccessibilityWidget;

// Named re-exports for consumers who need direct access to i18n and storage utilities
export { registerLanguage, getAvailableLanguages, getNativeName, isRTL } from './i18n.js';
export { setStorageMode, getStorageMode } from './storage.js';
