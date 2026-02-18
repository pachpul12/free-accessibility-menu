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
 * @typedef {Object} WidgetOptions
 * @property {string}  [defaultLanguage='en']  - Initial language code.
 * @property {Record<string, boolean>} [features] - Enable/disable features
 *   by id.  Omit or set to `true` to enable; set `false` to disable.
 * @property {Function} [onToggle]    - Callback fired when a feature changes.
 * @property {Function} [onOpenMenu]  - Callback fired when the menu opens.
 * @property {Function} [onCloseMenu] - Callback fired when the menu closes.
 * @property {string}   [storageKey]  - Custom localStorage key.
 * @property {string}   [position='bottom-right'] - Widget position hint.
 */

const AccessibilityWidget = {
  /**
   * Semantic version of the library.
   * @type {string}
   */
  version: '1.0.0',

  /**
   * Initialise the accessibility widget and append it to the page.
   *
   * If a widget instance already exists it will be destroyed first so
   * that only one widget is active at a time.
   *
   * @param {WidgetOptions} [options]
   * @returns {Widget} The created widget instance.
   */
  init(options) {
    // Destroy any previous instance
    if (_instance) {
      _instance.destroy();
      _instance = null;
    }

    _instance = new Widget(options);
    return _instance;
  },

  /**
   * Return the currently active widget instance, or `null`.
   *
   * @returns {Widget|null}
   */
  getInstance() {
    return _instance;
  },

  /**
   * Destroy the active widget instance and remove it from the DOM.
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
