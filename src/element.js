/**
 * Web Component wrapper for the Accessibility Widget.
 *
 * Registers a custom element `<a11y-menu>` that can be used in any HTML
 * page — with or without a JavaScript bundler.  All widget options can be
 * supplied as a JSON string via the `config` attribute:
 *
 * ```html
 * <a11y-menu config='{"defaultLanguage":"fr","showTooltip":false}'></a11y-menu>
 * ```
 *
 * The element calls `AccessibilityWidget.init()` in `connectedCallback` and
 * `AccessibilityWidget.destroy()` in `disconnectedCallback`, so it works
 * correctly with SPA router-managed page transitions.
 *
 * ### CDN usage (no bundler required)
 * ```html
 * <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/free-accessibility-menu@2/dist/a11y-widget.css">
 * <script type="module" src="https://cdn.jsdelivr.net/npm/free-accessibility-menu@2/dist/element.js"></script>
 * <a11y-menu></a11y-menu>
 * ```
 *
 * @module element
 */

import AccessibilityWidget from './index.js';

/**
 * `<a11y-menu>` custom element.
 *
 * Observed attributes:
 * - `config` — JSON string with {@link WidgetOptions} (re-initialises widget on change).
 *
 * @example
 * <a11y-menu config='{"defaultLanguage":"es","showTooltip":false}'></a11y-menu>
 */
class AccessibilityWidgetElement extends HTMLElement {
  /**
   * Attributes that trigger `attributeChangedCallback` when they change.
   * @returns {string[]}
   */
  static get observedAttributes() {
    return ['config'];
  }

  connectedCallback() {
    this._initWidget();
  }

  disconnectedCallback() {
    AccessibilityWidget.destroy();
  }

  /**
   * Re-initialise the widget when the `config` attribute changes.
   *
   * @param {string} name
   * @param {string|null} oldValue
   * @param {string|null} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'config' && oldValue !== newValue && this.isConnected) {
      this._initWidget();
    }
  }

  /**
   * @private
   */
  _initWidget() {
    var opts = {};
    var raw = this.getAttribute('config');
    if (raw) {
      try {
        opts = JSON.parse(raw);
      } catch (_e) {
        console.warn('[a11y-menu] Invalid JSON in config attribute:', raw);
      }
    }
    AccessibilityWidget.destroy();
    AccessibilityWidget.init(opts);
  }
}

// Register the custom element (idempotent — safe to import multiple times)
if (typeof customElements !== 'undefined' && !customElements.get('a11y-menu')) {
  customElements.define('a11y-menu', AccessibilityWidgetElement);
}

export { AccessibilityWidgetElement };
export default AccessibilityWidgetElement;
