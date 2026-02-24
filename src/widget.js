/**
 * Main Widget module for the Accessibility Menu.
 *
 * Creates the full DOM structure, handles keyboard/mouse interaction,
 * manages feature state and persistence, and exposes a public API for
 * programmatic control.
 *
 * @module widget
 */

import { FEATURES, getFeature, applyFeature, resetAllFeatures } from './features.js';
import { saveSettings, loadSettings, clearSettings, setStorageKey, getStorageKey, saveProfiles, loadProfiles, setStorageMode } from './storage.js';
import { getTranslation, getAvailableLanguages, getNativeName, isRTL } from './i18n.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WIDGET_CLASS = 'a11y-widget';
const OPEN_MODIFIER = 'a11y-widget--open';
const RTL_MODIFIER = 'a11y-widget--rtl';
const ACTIVE_MODIFIER = 'a11y-widget__item--active';

// ---------------------------------------------------------------------------
// Icons used by the widget chrome (toggle button, close button, controls)
// ---------------------------------------------------------------------------

const TOGGLE_ICON_PNG = 'data:image/png;base64,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';

const TOGGLE_ICON_HOVER_PNG = TOGGLE_ICON_PNG;

const CLOSE_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

const MINUS_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/></svg>';

const PLUS_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';

// ---------------------------------------------------------------------------
// Built-in Quick Start presets (F-103 Layer 1)
// ---------------------------------------------------------------------------

/**
 * Five built-in "quick start" presets that apply a curated combination of
 * features for common accessibility needs.  Each preset is rendered as a
 * chip/button in the Quick Start section above the feature menu.
 *
 * Applying a preset first resets all active features, then calls
 * `applySettings` with the preset's settings object.
 *
 * @type {Array<{id: string, labelKey: string, settings: Object}>}
 */
const BUILT_IN_PRESETS = [
  {
    id: 'low-vision',
    labelKey: 'presetLowVision',
    settings: { highContrast: true, fontSize: 3, underlineLinks: true, focusOutline: true },
  },
  {
    id: 'dyslexia',
    labelKey: 'presetDyslexia',
    settings: { dyslexiaFont: true, lineHeight: 3, letterSpacing: 3, wordSpacing: 2, readingGuide: true },
  },
  {
    id: 'adhd',
    labelKey: 'presetAdhd',
    settings: { pauseAnimations: true, readingGuide: true, focusMode: true, readableFont: true },
  },
  {
    id: 'motor',
    labelKey: 'presetMotor',
    settings: { focusOutline: true, largeCursor: true },
  },
  {
    id: 'migraine',
    labelKey: 'presetMigraine',
    settings: { darkMode: true, pauseAnimations: true },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Safely create an element from an SVG string by parsing it with
 * DOMParser and importing the resulting node.  This avoids innerHTML on
 * live elements and is CSP-safe.
 *
 * @param {string} svgString
 * @returns {SVGElement}
 */
function parseSVG(svgString) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(svgString, 'image/svg+xml');
  return document.importNode(doc.documentElement, true);
}

/**
 * Detect the user's preferred language from the page/browser environment.
 * Tries (in order): document.documentElement.lang → navigator.language →
 * navigator.languages[0] → 'en'.
 * Only the primary subtag (e.g. "en" from "en-US") is returned.
 *
 * @returns {string} BCP-47 primary subtag, lower-cased.
 */
function detectLanguage() {
  var candidates = [
    typeof document !== 'undefined' && document.documentElement && document.documentElement.lang,
    typeof navigator !== 'undefined' && navigator.language,
    typeof navigator !== 'undefined' && navigator.languages && navigator.languages[0],
  ];
  for (var i = 0; i < candidates.length; i++) {
    var lang = candidates[i];
    if (lang && typeof lang === 'string') {
      var primary = lang.split('-')[0].toLowerCase();
      if (primary) return primary;
    }
  }
  return 'en';
}

/**
 * Create a DOM element with optional class name(s) and attributes.
 *
 * @param {string}  tag
 * @param {string}  [className]
 * @param {Record<string, string>} [attrs]
 * @returns {HTMLElement}
 */
function createElement(tag, className, attrs) {
  var el = document.createElement(tag);
  if (className) {
    el.className = className;
  }
  if (attrs) {
    var keys = Object.keys(attrs);
    for (var i = 0; i < keys.length; i++) {
      el.setAttribute(keys[i], attrs[keys[i]]);
    }
  }
  return el;
}

/**
 * Derive the ordered list of unique groups from the FEATURES array,
 * preserving definition order.
 *
 * @param {import('./features.js').FeatureDefinition[]} features
 * @returns {string[]}
 */
function getGroups(features) {
  var seen = {};
  var groups = [];
  for (var i = 0; i < features.length; i++) {
    if (!seen[features[i].group]) {
      seen[features[i].group] = true;
      groups.push(features[i].group);
    }
  }
  return groups;
}

/**
 * Capitalise the first letter of a string.
 *
 * @param {string} str
 * @returns {string}
 */
function capitalise(str) {
  if (!str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Parse a keyboard shortcut string (e.g. `"alt+a"`) into its component parts.
 *
 * @param {string|null|false} shortcut
 * @returns {{ alt: boolean, ctrl: boolean, shift: boolean, meta: boolean, key: string }|null}
 */
function parseShortcut(shortcut) {
  if (!shortcut || typeof shortcut !== 'string') {
    return null;
  }
  var parts = shortcut.toLowerCase().split('+');
  var key = parts[parts.length - 1];
  if (!key) {
    return null;
  }
  return {
    alt: parts.indexOf('alt') !== -1,
    ctrl: parts.indexOf('ctrl') !== -1,
    shift: parts.indexOf('shift') !== -1,
    meta: parts.indexOf('meta') !== -1,
    key: key,
  };
}

// ---------------------------------------------------------------------------
// F-003: Plugin Architecture — built-in feature handlers + dispatch table
// ---------------------------------------------------------------------------

/**
 * Built-in feature handlers for features whose activation requires complex
 * DOM side-effects beyond a simple CSS class toggle.  Each entry maps a
 * feature ID to `activate(featureId, value, widgetInstance)` and
 * `deactivate(featureId, widgetInstance)` callbacks that are called through
 * the same interface used by external plugins registered via
 * `AccessibilityWidget.registerPlugin()`.
 *
 * Extracting these from the if-else chains inside `_toggleFeature` and
 * `setFeature` satisfies PRD F-003 acceptance criteria:
 *   "The readingGuide and textToSpeech special-cases are removed from
 *    widget.js and live in their own plugin's activate/deactivate methods."
 *
 * @type {Object.<string, {activate?: function, deactivate?: function}>}
 */
var _HIGHLIGHT_HOVER_TAGS = ['P', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'TD'];

var _BUILTIN_FEATURE_HANDLERS = {
  readingGuide: {
    activate:   function (id, value, w) { w._activateReadingGuide(); },
    deactivate: function (id, w)        { w._deactivateReadingGuide(); },
  },
  textToSpeech: {
    activate:   function (id, value, w) { w._activateTTS(); },
    deactivate: function (id, w)        { w._deactivateTTS(); },
  },
  // F-210: JS click handler supplements the CSS :hover rule to pin a highlight
  // on the clicked text element until another element is clicked or the feature
  // is turned off.
  highlightHover: {
    activate:   function (id, value, w) { w._activateHighlightHover(); },
    deactivate: function (id, w)        { w._deactivateHighlightHover(); },
  },
};

// ---------------------------------------------------------------------------
// Widget class
// ---------------------------------------------------------------------------

/**
 * @class Widget
 *
 * Encapsulates the entire accessibility menu lifecycle: DOM construction,
 * event binding, feature state management, i18n, persistence, and the
 * public instance API.
 *
 * Consumers should **not** instantiate `Widget` directly — use
 * {@link AccessibilityWidget.init} which enforces the singleton contract and
 * provides the SSR guard.
 *
 * @param {import('./index.js').WidgetOptions} [options={}]
 * @fires {CustomEvent} a11y:init - Dispatched on `window` at the end of the
 *   constructor once the widget is fully mounted.
 *   `event.detail` is an {@link A11yInitDetail} object.
 */
function Widget(options) {
  options = options || {};

  // -- Configuration --------------------------------------------------------
  this._language = options.defaultLanguage || detectLanguage();
  this._onToggle = typeof options.onToggle === 'function' ? options.onToggle : null;
  this._onOpenMenu = typeof options.onOpenMenu === 'function' ? options.onOpenMenu : null;
  this._onCloseMenu = typeof options.onCloseMenu === 'function' ? options.onCloseMenu : null;
  this._position = options.position || 'bottom-right';
  this._showLanguageSwitcher = options.showLanguageSwitcher !== false;
  this._toggleIconUrl = options.toggleIconUrl || TOGGLE_ICON_PNG;
  this._toggleIconHoverUrl = options.toggleIconHoverUrl || TOGGLE_ICON_HOVER_PNG;
  this._accessibilityStatementUrl = options.accessibilityStatementUrl || null;
  this._keyboardShortcut = options.keyboardShortcut !== undefined ? options.keyboardShortcut : 'alt+a';
  this._parsedShortcut = parseShortcut(this._keyboardShortcut);
  this._primaryColor = options.primaryColor || null;
  this._panelTitle = options.panelTitle || null;
  // disclaimerText: undefined = use i18n, false = suppress, string = custom
  this._disclaimerText = (options.disclaimerText !== undefined) ? options.disclaimerText : undefined;
  this._showPresets = options.showPresets !== false;
  this._showTooltip = options.showTooltip !== false;

  // Determine which features are enabled (built-in + registered plugins)
  this._enabledFeatures = this._resolveEnabledFeatures(options.features);

  // Build plugin handler map: featureId → handler object.
  // Starts with built-in handlers; external plugins overlay on top.
  this._pluginHandlerMap = Object.create(null);
  var _bfhKeys = Object.keys(_BUILTIN_FEATURE_HANDLERS);
  for (var _bk = 0; _bk < _bfhKeys.length; _bk++) {
    this._pluginHandlerMap[_bfhKeys[_bk]] = _BUILTIN_FEATURE_HANDLERS[_bfhKeys[_bk]];
  }
  var _extPlugins = Widget._externalPlugins;
  for (var _ep = 0; _ep < _extPlugins.length; _ep++) {
    var _epFeatures = _extPlugins[_ep].features || [];
    for (var _epf = 0; _epf < _epFeatures.length; _epf++) {
      this._pluginHandlerMap[_epFeatures[_epf].id] = _extPlugins[_ep];
    }
  }

  // Configure storage backend before setting the key
  if (options.storage !== undefined) {
    try {
      setStorageMode(options.storage);
    } catch (e) {
      if (this._devMode) {
        console.warn('[AccessibilityWidget devMode] Invalid storage option:', e.message);
      }
    }
  }

  // Save original storage key and override if provided
  this._originalStorageKey = getStorageKey();
  if (options.storageKey) {
    setStorageKey(options.storageKey);
  }

  // Profiles localStorage key (derived from the effective storage key)
  this._profilesKey = getStorageKey() + ':profiles';

  // -- State ----------------------------------------------------------------
  this._settings = {};
  this._isOpen = false;
  this._destroyed = false;

  // -- Session tracking (in-memory, never persisted) -------------------------
  this._sessionId = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : ('s' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9));
  this._initTimestamp = Date.now();
  this._menuOpenCount = 0;
  this._featureStats = {};

  // -- DOM refs (populated by _buildDOM) ------------------------------------
  this._root = null;
  this._toggleBtn = null;
  this._panel = null;
  this._closeBtn = null;
  this._contentEl = null;
  this._disclaimerEl = null;
  this._resetBtn = null;
  this._titleEl = null;
  this._menuItems = [];       // ordered list of focusable menu items
  this._itemElements = {};    // featureId -> item DOM element
  this._rangeValueEls = {};   // featureId -> value display element
  this._langSelect = null;    // <select> element for language switcher
  this._statementLinkEl = null; // <a> for accessibility statement (optional)

  // -- Color blindness SVG filter element ------------------------------------
  this._colorBlindSvgEl = null;

  // -- Zoom lock warning element (optional, shown if viewport blocks zoom) ---
  this._zoomWarnEl = null;

  // -- First-visit tooltip ---------------------------------------------------
  this._tooltipEl = null;
  this._tooltipTimer = null;

  // -- Screen-reader live region (aria-live="polite") -----------------------
  this._announceEl = null;

  // -- Profiles section DOM refs --------------------------------------------
  this._profilesSection = null;
  this._profileNameInput = null;
  this._profileListEl = null;

  // -- Quick Start presets section DOM ref ----------------------------------
  this._presetsSection = null;

  // -- Position section DOM refs --------------------------------------------
  this._positionSection = null;
  this._positionBtns = {};   // pos string -> <button> element

  // -- Highlight Hover (F-210) state -----------------------------------------
  this._highlightedEl = null;           // currently click-pinned element
  this._handleHighlightClick = this._onHighlightHoverClick.bind(this);

  // -- Reading Guide state ---------------------------------------------------
  this._readingGuideEl = null;
  this._handleReadingGuideMove = this._onReadingGuideMove.bind(this);
  this._handleReadingGuideTouchMove = this._onReadingGuideTouchMove.bind(this);
  this._rgRafScheduled = false;
  this._rgRafPendingY = 0;

  // -- Text-to-Speech state --------------------------------------------------
  this._ttsEnabled = false;
  this._ttsRate = 1.0;
  this._ttsPaused = false;
  this._ttsControlsEl = null;
  this._ttsPauseBtn = null;
  this._ttsSpeedDisplay = null;
  this._ttsCurrentTarget = null;   // element being spoken right now
  this._ttsOriginalHTML = null;    // saved innerHTML before word-span injection
  this._handleTTSClick = this._onTTSClick.bind(this);

  // -- Dev mode state --------------------------------------------------------
  // devMode: true = enabled, false = disabled, undefined = auto-detect
  this._devMode = (options.devMode !== undefined)
    ? options.devMode
    : (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development');
  this._devAuditBadgeEl = null;
  this._devAuditListEl = null;   // scrollable violation detail list (F-212)
  this._devAuditCount = 0;

  // -- Bound event handlers (for clean removal) -----------------------------
  this._handleDocumentClick = this._onDocumentClick.bind(this);
  this._handleDocumentKeydown = this._onDocumentKeydown.bind(this);
  this._handleToggleClick = this._onToggleClick.bind(this);
  this._handleToggleKeydown = this._onToggleKeydown.bind(this);
  this._handlePanelKeydown = this._onPanelKeydown.bind(this);
  this._handlePanelClick = this._onPanelClick.bind(this);

  // -- Initialise -----------------------------------------------------------
  this._loadState();
  this._buildDOM();
  this._attachEvents();
  this._applyAllFeatures();
  this._applyLanguage(this._language);

  // Call mount() on external plugins so they can inject custom panel UI
  for (var _mp = 0; _mp < _extPlugins.length; _mp++) {
    if (typeof _extPlugins[_mp].mount === 'function') {
      _extPlugins[_mp].mount(this._panel, this);
    }
  }

  // Run dev mode audit after widget is fully mounted
  if (this._devMode) {
    this._runAltTextAudit();
  }

  // Show first-visit tooltip (only when no saved settings exist)
  if (this._showTooltip && this._getActiveCount() === 0 && !loadSettings()) {
    this._buildTooltip();
  }

  // Initialize featureStats after state is loaded (to capture persisted enabled state)
  for (var i = 0; i < this._enabledFeatures.length; i++) {
    var _fId = this._enabledFeatures[i].id;
    this._featureStats[_fId] = {
      enabled: !!(this._settings[_fId]),
      toggleCount: 0,
      lastActivated: (this._settings[_fId]) ? this._initTimestamp : null,
    };
  }

  this._emit('a11y:init', { settings: this.getSettings() });
}

/**
 * Global registry of externally-registered plugins (F-003).
 * Populated by `AccessibilityWidget.registerPlugin()` in `index.js`.
 * The Widget constructor reads this array at instantiation time.
 *
 * @type {Array}
 */
Widget._externalPlugins = [];

// ---------------------------------------------------------------------------
// Internal: Feature resolution
// ---------------------------------------------------------------------------

/**
 * Determine which features are enabled based on the user-supplied options.
 *
 * When `options.features` is not provided, all features are enabled.
 * When it is an object, only features whose key is truthy are enabled.
 *
 * @param {Object|undefined} featureOptions
 * @returns {import('./features.js').FeatureDefinition[]}
 */
Widget.prototype._resolveEnabledFeatures = function (featureOptions) {
  var result;
  if (!featureOptions) {
    result = FEATURES.slice();
  } else {
    result = [];
    for (var i = 0; i < FEATURES.length; i++) {
      var f = FEATURES[i];
      if (featureOptions[f.id] !== false) {
        result.push(f);
      }
    }
  }

  // F-106: Auto-disable largeCursor on touch-only devices (CSS cursor has no effect).
  // Only filter when the host explicitly did NOT pass features: { largeCursor: true }.
  var userForcedLargeCursor = featureOptions && featureOptions['largeCursor'] === true;
  if (!userForcedLargeCursor &&
      typeof window !== 'undefined' &&
      window.matchMedia &&
      !window.matchMedia('(hover: hover)').matches) {
    result = result.filter(function (f) { return f.id !== 'largeCursor'; });
  }

  // F-003: Merge features from registered external plugins
  var extPlugins = Widget._externalPlugins;
  for (var ep = 0; ep < extPlugins.length; ep++) {
    var pluginFeatures = extPlugins[ep].features || [];
    for (var pf = 0; pf < pluginFeatures.length; pf++) {
      var pfeat = pluginFeatures[pf];
      if (!featureOptions || featureOptions[pfeat.id] !== false) {
        result.push(pfeat);
      }
    }
  }

  return result;
};

// ---------------------------------------------------------------------------
// Internal: State management
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// F-003: Plugin dispatch helpers
// ---------------------------------------------------------------------------

/**
 * Return the feature definition for `featureId`, searching both the built-in
 * FEATURES list and any registered external plugin feature lists.
 *
 * @param {string} featureId
 * @returns {import('./features.js').FeatureDefinition|undefined}
 */
Widget.prototype._getFeatureDefinition = function (featureId) {
  var def = getFeature(featureId);
  if (def) { return def; }
  // Search external plugin feature lists
  var plugins = Widget._externalPlugins;
  for (var p = 0; p < plugins.length; p++) {
    var feats = plugins[p].features || [];
    for (var f = 0; f < feats.length; f++) {
      if (feats[f].id === featureId) { return feats[f]; }
    }
  }
  return undefined;
};

/**
 * Invoke the plugin handler (built-in or external) for a feature ID.
 *
 * If no handler is registered for `featureId` the call is a safe no-op.
 * `activate(featureId, value, widgetInstance)` is called when `activate` is
 * truthy; `deactivate(featureId, widgetInstance)` otherwise.
 *
 * External plugins may ignore the `widgetInstance` third argument — it is
 * provided for built-in handlers that need access to internal widget state.
 *
 * @param {string}  featureId
 * @param {boolean} activate  - `true` to activate, `false` to deactivate.
 * @param {*}       [value]   - Feature value (passed to activate only).
 */
Widget.prototype._callFeatureHandler = function (featureId, activate, value) {
  var handler = this._pluginHandlerMap[featureId];
  if (!handler) { return; }
  if (activate) {
    if (typeof handler.activate === 'function') {
      handler.activate(featureId, value, this);
    }
  } else {
    if (typeof handler.deactivate === 'function') {
      handler.deactivate(featureId, this);
    }
  }
};

/**
 * Return all feature definitions available to this widget instance,
 * including features contributed by registered external plugins.
 *
 * @returns {import('./features.js').FeatureDefinition[]}
 */
Widget.prototype.getAvailableFeatures = function () {
  return this._enabledFeatures.slice();
};

// ---------------------------------------------------------------------------
// Internal: State management
// ---------------------------------------------------------------------------

/**
 * Load persisted settings from localStorage and merge with defaults.
 */
Widget.prototype._loadState = function () {
  // Start with defaults
  var defaults = {};
  for (var i = 0; i < this._enabledFeatures.length; i++) {
    var f = this._enabledFeatures[i];
    defaults[f.id] = f.default;
  }

  // F-107: Pre-activate pauseAnimations when the OS prefers reduced motion and
  // pauseAnimations is available in the enabled-feature list.
  if (defaults.hasOwnProperty('pauseAnimations') &&
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    defaults['pauseAnimations'] = true;
  }

  var saved = loadSettings();
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    // Restore language if saved and valid
    if (typeof saved._language === 'string' && saved._language.length > 0) {
      this._language = saved._language;
    }
    // Restore position if saved and valid
    var VALID_POS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    if (typeof saved._position === 'string' && VALID_POS.indexOf(saved._position) !== -1) {
      this._position = saved._position;
    }
    // Merge saved feature values with type validation
    for (var j = 0; j < this._enabledFeatures.length; j++) {
      var feat = this._enabledFeatures[j];
      var val = saved[feat.id];
      if (val === undefined) {
        continue;
      }
      if (feat.type === 'toggle' && typeof val === 'boolean') {
        defaults[feat.id] = val;
      } else if (feat.type === 'range' && typeof val === 'number' && val >= feat.min && val <= feat.max) {
        defaults[feat.id] = val;
      }
    }
  }

  this._settings = defaults;
};

/**
 * Persist current settings to localStorage.
 */
Widget.prototype._saveState = function () {
  var toSave = {};
  var keys = Object.keys(this._settings);
  for (var i = 0; i < keys.length; i++) {
    toSave[keys[i]] = this._settings[keys[i]];
  }
  toSave._language = this._language;
  toSave._position = this._position;
  saveSettings(toSave);
};

/**
 * Apply all currently-active features to the DOM.
 */
Widget.prototype._applyAllFeatures = function () {
  for (var i = 0; i < this._enabledFeatures.length; i++) {
    var f = this._enabledFeatures[i];
    applyFeature(f.id, this._settings[f.id]);

    // If the feature has a plugin handler and is currently active,
    // call activate() to trigger any DOM side-effects.
    if (this._settings[f.id]) {
      this._callFeatureHandler(f.id, true, this._settings[f.id]);
    }
  }
};

// ---------------------------------------------------------------------------
// Internal: DOM construction
// ---------------------------------------------------------------------------

/**
 * Build the complete widget DOM tree and append it to `document.body`.
 */
Widget.prototype._buildDOM = function () {
  // Root container
  this._root = createElement('div', WIDGET_CLASS);
  if (this._primaryColor) {
    this._root.style.setProperty('--a11y-primary', this._primaryColor);
  }
  this._root.setAttribute('data-position', this._position);

  // --- Toggle button -------------------------------------------------------
  var toggleAttrs = {
    'aria-haspopup': 'menu',
    'aria-expanded': 'false',
    'aria-label': this._panelTitle || this._t('menuTitle'),
    'aria-controls': 'a11y-widget-panel',
  };
  if (this._keyboardShortcut) {
    toggleAttrs['aria-keyshortcuts'] = this._keyboardShortcut
      .split('+')
      .map(function (p) { return p.charAt(0).toUpperCase() + p.slice(1); })
      .join('+');
  }
  this._toggleBtn = createElement('button', 'a11y-widget__toggle', toggleAttrs);
  var normalIconUrl = this._toggleIconUrl;
  var hoverIconUrl = this._toggleIconHoverUrl;

  var toggleIcon = document.createElement('img');
  toggleIcon.src = normalIconUrl;
  toggleIcon.alt = '';
  toggleIcon.setAttribute('aria-hidden', 'true');
  toggleIcon.width = 28;
  toggleIcon.height = 28;
  this._toggleBtn.appendChild(toggleIcon);

  // Preload hover image
  var hoverPreload = new Image();
  hoverPreload.src = hoverIconUrl;

  this._toggleBtn.addEventListener('mouseenter', function () {
    toggleIcon.src = hoverIconUrl;
  });
  this._toggleBtn.addEventListener('mouseleave', function () {
    toggleIcon.src = normalIconUrl;
  });
  this._root.appendChild(this._toggleBtn);

  // --- Panel ---------------------------------------------------------------
  this._panel = createElement('div', 'a11y-widget__panel', {
    'id': 'a11y-widget-panel',
  });

  // Header
  var header = createElement('div', 'a11y-widget__header');

  this._titleEl = createElement('span', 'a11y-widget__title');
  this._titleEl.textContent = this._panelTitle || this._t('menuTitle');
  header.appendChild(this._titleEl);

  this._closeBtn = createElement('button', 'a11y-widget__close', {
    'aria-label': this._t('closeMenu'),
  });
  this._closeBtn.appendChild(parseSVG(CLOSE_ICON_SVG));
  header.appendChild(this._closeBtn);

  if (this._devMode) {
    // Badge is a <button> so keyboard users can expand the detail list (F-212)
    this._devAuditBadgeEl = createElement('button', 'a11y-widget__dev-badge', {
      'type': 'button',
      'aria-expanded': 'false',
      'aria-controls': 'a11y-dev-audit-list',
    });
    this._devAuditBadgeEl.setAttribute('aria-live', 'polite');
    var self = this;
    this._devAuditBadgeEl.addEventListener('click', function () {
      self._toggleDevAuditList();
    });
    header.appendChild(this._devAuditBadgeEl);

    // Scrollable detail list (hidden by default)
    this._devAuditListEl = createElement('div', 'a11y-widget__dev-audit-list', {
      'id': 'a11y-dev-audit-list',
      'role': 'list',
      'hidden': '',
    });
    header.appendChild(this._devAuditListEl);
  }

  this._panel.appendChild(header);

  // Content wrapper (the actual menu role container)
  this._contentEl = createElement('div', 'a11y-widget__content', {
    'role': 'menu',
    'aria-label': this._panelTitle || this._t('menuTitle'),
  });

  // Feature sections, grouped (Visual → Content → Navigation)
  var groups = getGroups(this._enabledFeatures);
  for (var g = 0; g < groups.length; g++) {
    this._buildGroupSection(groups[g], this._contentEl);
  }

  // Quick Start presets section (above the feature menu)
  if (this._showPresets) {
    this._buildPresetsSection(this._panel);
  }

  this._panel.appendChild(this._contentEl);

  // Language section — appended to panel OUTSIDE role="menu" (PRD §8.1, §8.3).
  // Placing a <select> inside role="menuitem" violates aria-required-children;
  // placing it outside the menu avoids the violation while keeping arrow-key
  // reachability via _menuItems (which is panel-scoped, not menu-scoped).
  if (this._showLanguageSwitcher) {
    this._buildLanguageSection(this._panel);
  }

  // TTS controls (hidden by default, shown when TTS is active)
  this._buildTTSControls();

  // Profiles section (between content and footer)
  this._buildProfilesSection(this._panel);

  // Position switcher section
  this._buildPositionSection(this._panel);

  // Footer
  var footer = createElement('div', 'a11y-widget__footer');

  if (this._disclaimerText !== false) {
    this._disclaimerEl = createElement('p', 'a11y-widget__disclaimer');
    this._disclaimerEl.textContent = (typeof this._disclaimerText === 'string') ? this._disclaimerText : this._t('disclaimer');
    footer.appendChild(this._disclaimerEl);
  }

  this._resetBtn = createElement('button', 'a11y-widget__reset');
  this._resetBtn.textContent = this._t('resetAll');
  footer.appendChild(this._resetBtn);

  if (this._accessibilityStatementUrl) {
    this._statementLinkEl = createElement('a', 'a11y-widget__statement-link', {
      'href': this._accessibilityStatementUrl,
      'target': '_blank',
      'rel': 'noopener noreferrer',
      'data-i18n': 'accessibilityStatementLink',
    });
    this._statementLinkEl.textContent = this._t('accessibilityStatementLink');
    footer.appendChild(this._statementLinkEl);
  }

  this._panel.appendChild(footer);
  this._root.appendChild(this._panel);

  // Append to body
  document.body.appendChild(this._root);

  // Screen-reader live region (visually hidden, announced by AT)
  this._announceEl = createElement('div', 'a11y-widget__announce', {
    'aria-live': 'polite',
    'aria-atomic': 'true',
    'aria-relevant': 'text',
  });
  this._root.appendChild(this._announceEl);

  // Inject SVG color-blind filter definitions
  this._injectColorBlindFilters();

  // Show zoom-lock warning notice if the page restricts user scaling
  if (this._checkViewportScaling()) {
    this._zoomWarnEl = createElement('div', 'a11y-widget__zoom-warn');
    this._zoomWarnEl.textContent = this._t('zoomLockWarning');
    this._panel.insertBefore(this._zoomWarnEl, this._contentEl);
  }
};

/**
 * Build the language-switcher section.
 *
 * @param {HTMLElement} parent
 */
Widget.prototype._buildLanguageSection = function (parent) {
  var self = this;
  var section = createElement('div', 'a11y-widget__section', {
    'role': 'group',
    'aria-label': this._t('language'),
  });

  var title = createElement('div', 'a11y-widget__section-title', {
    'role': 'presentation',
  });
  title.setAttribute('data-i18n', 'language');
  title.textContent = this._t('language');
  section.appendChild(title);

  // role="none" — the <select> is the interactive control; wrapping it in a
  // role="menuitem" creates an ARIA nesting violation (menuitem may not own
  // an element with listbox/combobox semantics). The <select> is a natural
  // tabstop and is reached via arrow-key navigation through _menuItems.
  var item = createElement('div', 'a11y-widget__item', {
    'role': 'none',
    'tabindex': '-1',
  });

  // All registered languages, sorted alphabetically by native name
  var langs = getAvailableLanguages().slice().sort(function (a, b) {
    var na = getNativeName(a);
    var nb = getNativeName(b);
    return na.localeCompare(nb);
  });

  var select = createElement('select', 'a11y-widget__lang-select', {
    'aria-label': this._t('language'),
  });

  for (var i = 0; i < langs.length; i++) {
    var code = langs[i];
    var label = getNativeName(code);
    var option = document.createElement('option');
    option.value = code;
    option.textContent = label;
    if (code === this._language) {
      option.selected = true;
    }
    select.appendChild(option);
  }

  select.addEventListener('change', function () {
    self.setLanguage(select.value);
  });

  this._langSelect = select;
  item.appendChild(select);
  section.appendChild(item);
  this._menuItems.push(item);

  parent.appendChild(section);
};

/**
 * Build a grouped section of feature items.
 *
 * @param {string}      groupName
 * @param {HTMLElement}  parent
 */
/**
 * Inject a hidden `<svg>` element with color-blind simulation filter
 * definitions into `document.head`.  Each filter is referenced by a CSS
 * `filter: url(#a11y-filter-{featureId})` rule.
 *
 * Called once from `_buildDOM`; cleaned up in `destroy`.
 */
Widget.prototype._injectColorBlindFilters = function () {
  if (this._colorBlindSvgEl) {
    return;
  }
  var svgNS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  svg.id = 'a11y-color-blind-filters';

  var defs = document.createElementNS(svgNS, 'defs');

  var filters = [
    {
      id: 'a11y-filter-deuteranopia',
      matrix: '0.625 0.375 0 0 0  0.700 0.300 0 0 0  0 0.300 0.700 0 0  0 0 0 1 0',
    },
    {
      id: 'a11y-filter-protanopia',
      matrix: '0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0',
    },
    {
      id: 'a11y-filter-tritanopia',
      matrix: '0.950 0.050 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0',
    },
  ];

  for (var i = 0; i < filters.length; i++) {
    var filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', filters[i].id);
    filter.setAttribute('color-interpolation-filters', 'linearRGB');
    var feMatrix = document.createElementNS(svgNS, 'feColorMatrix');
    feMatrix.setAttribute('type', 'matrix');
    feMatrix.setAttribute('values', filters[i].matrix);
    filter.appendChild(feMatrix);
    defs.appendChild(filter);
  }

  svg.appendChild(defs);
  document.head.appendChild(svg);
  this._colorBlindSvgEl = svg;
};

/**
 * Inspect the page's `<meta name="viewport">` for accessibility-hostile
 * zoom-lock settings (`user-scalable=no` / `maximum-scale` < 5).
 * Emits `console.warn` when a violation is found.
 *
 * @returns {boolean} `true` if zoom is locked, `false` otherwise.
 */
Widget.prototype._checkViewportScaling = function () {
  var meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    return false;
  }
  var content = (meta.getAttribute('content') || '').toLowerCase();
  var parts = content.split(',');
  var map = {};
  for (var i = 0; i < parts.length; i++) {
    var pair = parts[i].trim().split('=');
    if (pair.length === 2) {
      map[pair[0].trim()] = pair[1].trim();
    }
  }
  var userScalable = map['user-scalable'];
  var zoomDisabled = userScalable === 'no' || userScalable === '0';
  var maxScale = parseFloat(map['maximum-scale']);
  var maxScaleTooLow = !isNaN(maxScale) && maxScale < 5;
  if (zoomDisabled || maxScaleTooLow) {
    console.warn(
      '[AccessibilityWidget] Zoom lock detected in <meta name="viewport">. ' +
      'user-scalable=no or maximum-scale < 5 violates WCAG 2.1 SC 1.4.4 ' +
      '(Resize Text). Remove these constraints to improve accessibility.'
    );
    return true;
  }
  return false;
};

Widget.prototype._buildGroupSection = function (groupName, parent) {
  var translatedLabel = this._t(groupName);
  var section = createElement('div', 'a11y-widget__section', {
    'role': 'group',
    'aria-label': translatedLabel,
    'data-group': groupName,
  });

  var title = createElement('div', 'a11y-widget__section-title', {
    'role': 'presentation',
    'data-i18n': groupName,
  });
  title.textContent = translatedLabel;
  section.appendChild(title);

  var features = this._enabledFeatures.filter(function (f) {
    return f.group === groupName;
  });

  for (var i = 0; i < features.length; i++) {
    var f = features[i];
    var item = this._buildFeatureItem(f);
    section.appendChild(item);
    this._menuItems.push(item);
    this._itemElements[f.id] = item;
  }

  parent.appendChild(section);
};

/**
 * Build the profiles (named presets) section and append it to `parent`.
 *
 * The section contains:
 *  - A text input + "Save" button to create a new named profile.
 *  - A list of saved profiles, each with "Load" and "Delete" buttons.
 *
 * @param {HTMLElement} parent
 */
/**
 * Build and show the first-visit tooltip near the toggle button.
 *
 * The tooltip is shown only when:
 *   1. `showTooltip` option is true (default).
 *   2. No settings are stored in localStorage (first visit).
 *
 * It auto-dismisses after 5 s, or immediately on any click / keydown anywhere
 * in the document.  Respects `prefers-reduced-motion`: when motion is reduced
 * the tooltip appears instantly without a CSS transition.
 */
Widget.prototype._buildTooltip = function () {
  var self = this;

  var tooltip = createElement('div', 'a11y-widget__tooltip', {
    'role': 'tooltip',
    'id': 'a11y-widget-tooltip',
  });
  tooltip.textContent = this._t('tooltipMessage');

  // Reference the tooltip from the toggle button for AT
  this._toggleBtn.setAttribute('aria-describedby', 'a11y-widget-tooltip');

  this._root.appendChild(tooltip);
  this._tooltipEl = tooltip;

  // Respect prefers-reduced-motion: skip animation class
  var reduceMotion = typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    tooltip.classList.add('a11y-widget__tooltip--animated');
  }
  // Trigger show
  requestAnimationFrame(function () {
    if (self._tooltipEl) {
      self._tooltipEl.classList.add('a11y-widget__tooltip--visible');
    }
  });

  // Auto-dismiss after 5 s
  this._tooltipTimer = setTimeout(function () {
    self._dismissTooltip();
  }, 5000);

  // Dismiss on any document interaction
  this._handleTooltipDismiss = function () {
    self._dismissTooltip();
  };
  document.addEventListener('click', this._handleTooltipDismiss, { once: true });
  document.addEventListener('keydown', this._handleTooltipDismiss, { once: true });
};

/**
 * Dismiss and remove the first-visit tooltip.
 */
Widget.prototype._dismissTooltip = function () {
  if (this._tooltipTimer) {
    clearTimeout(this._tooltipTimer);
    this._tooltipTimer = null;
  }
  if (this._tooltipEl) {
    this._tooltipEl.classList.remove('a11y-widget__tooltip--visible');
    var el = this._tooltipEl;
    // Remove from DOM after transition (or immediately if no transition)
    var onEnd = function () {
      if (el.parentNode) { el.parentNode.removeChild(el); }
    };
    el.addEventListener('transitionend', onEnd, { once: true });
    // Fallback: force remove after 300 ms in case transitionend doesn't fire
    setTimeout(onEnd, 300);
    this._tooltipEl = null;
  }
  if (this._toggleBtn) {
    this._toggleBtn.removeAttribute('aria-describedby');
  }
  if (this._handleTooltipDismiss) {
    document.removeEventListener('click', this._handleTooltipDismiss);
    document.removeEventListener('keydown', this._handleTooltipDismiss);
    this._handleTooltipDismiss = null;
  }
};

/**
 * Build the Quick Start presets section and append it to `parent`.
 *
 * Renders a labelled group of preset chip-buttons.  Clicking a preset:
 * 1. Calls `resetAll()` to clear all active features.
 * 2. Calls `applySettings(preset.settings)` to activate the preset.
 *
 * Hidden via `showPresets: false` option.
 *
 * @param {HTMLElement} parent
 */
Widget.prototype._buildPresetsSection = function (parent) {
  var self = this;

  var section = createElement('div', 'a11y-widget__quick-start');

  var titleEl = createElement('div', 'a11y-widget__quick-start-title', {
    'data-i18n': 'quickStart',
  });
  titleEl.textContent = this._t('quickStart');
  section.appendChild(titleEl);

  var grid = createElement('div', 'a11y-widget__quick-start-grid');

  for (var i = 0; i < BUILT_IN_PRESETS.length; i++) {
    (function (preset) {
      var btn = createElement('button', 'a11y-widget__preset-btn', {
        'type': 'button',
        'data-preset-id': preset.id,
        'data-i18n': preset.labelKey,
      });
      btn.textContent = self._t(preset.labelKey);
      btn.addEventListener('click', function () {
        self.resetAll();
        self.applySettings(preset.settings);
      });
      grid.appendChild(btn);
    })(BUILT_IN_PRESETS[i]);
  }

  section.appendChild(grid);
  this._presetsSection = section;
  parent.appendChild(section);
};

Widget.prototype._buildProfilesSection = function (parent) {
  var self = this;

  var section = createElement('div', 'a11y-widget__profiles');

  var titleEl = createElement('div', 'a11y-widget__profiles-title', {
    'data-i18n': 'profiles',
  });
  titleEl.textContent = this._t('profiles');
  section.appendChild(titleEl);

  // Save-form row: [text input] [Save button]
  var saveForm = createElement('div', 'a11y-widget__profiles-save');

  var input = createElement('input', 'a11y-widget__profiles-input', {
    'type': 'text',
    'maxlength': '40',
    'placeholder': this._t('profileNamePlaceholder'),
    'aria-label': this._t('profileNamePlaceholder'),
    'data-i18n-placeholder': 'profileNamePlaceholder',
  });
  this._profileNameInput = input;

  var saveBtn = createElement('button', 'a11y-widget__profiles-save-btn', {
    'type': 'button',
    'data-i18n': 'saveProfile',
  });
  saveBtn.textContent = this._t('saveProfile');

  function doSave() {
    var name = (input.value || '').trim();
    if (name) {
      self.saveProfile(name);
      input.value = '';
    }
  }

  saveBtn.addEventListener('click', doSave);

  // Allow Enter in the input to trigger save
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSave();
    }
  });

  saveForm.appendChild(input);
  saveForm.appendChild(saveBtn);
  section.appendChild(saveForm);

  // Profile list (aria-live so screen readers announce changes)
  var list = createElement('div', 'a11y-widget__profiles-list', {
    'aria-live': 'polite',
  });
  this._profileListEl = list;
  section.appendChild(list);

  this._profilesSection = section;

  // Populate with any already-saved profiles
  this._renderProfileList();

  parent.appendChild(section);
};

/**
 * Build the widget-position switcher section and append it to `parent`.
 *
 * Renders a 2×2 grid of corner buttons (Top-Left, Top-Right,
 * Bottom-Left, Bottom-Right) that let the user reposition the widget
 * toggle button at runtime.
 *
 * @param {HTMLElement} parent
 */
Widget.prototype._buildPositionSection = function (parent) {
  var self = this;
  var VALID_POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  var POS_KEYS = {
    'top-left': 'topLeft',
    'top-right': 'topRight',
    'bottom-left': 'bottomLeft',
    'bottom-right': 'bottomRight',
  };

  var section = createElement('div', 'a11y-widget__position');

  var titleEl = createElement('div', 'a11y-widget__position-title', {
    'data-i18n': 'position',
  });
  titleEl.textContent = this._t('position');
  section.appendChild(titleEl);

  var grid = createElement('div', 'a11y-widget__position-grid');
  // Always use LTR layout for the grid regardless of the widget language direction.
  // In RTL languages the parent widget has direction:rtl which would visually reverse
  // the 2-column grid, making right-column buttons move the widget to the LEFT.
  grid.setAttribute('dir', 'ltr');

  for (var i = 0; i < VALID_POSITIONS.length; i++) {
    var pos = VALID_POSITIONS[i];
    var i18nKey = POS_KEYS[pos];
    var isActive = pos === this._position;

    var btn = createElement('button', 'a11y-widget__position-btn', {
      'type': 'button',
      'data-pos': pos,
      'aria-label': this._t(i18nKey),
      'aria-pressed': isActive ? 'true' : 'false',
    });
    if (isActive) {
      btn.classList.add('a11y-widget__position-btn--active');
    }

    this._positionBtns[pos] = btn;

    // IIFE to capture `pos` in closure
    (function (p) {
      btn.addEventListener('click', function () { self.setPosition(p); });
    })(pos);

    grid.appendChild(btn);
  }

  section.appendChild(grid);
  this._positionSection = section;
  parent.appendChild(section);
};

/**
 * Apply a validated position value to the widget root and update button states.
 *
 * @param {string} pos - One of `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'`.
 */
Widget.prototype._applyPosition = function (pos) {
  if (this._root) {
    this._root.setAttribute('data-position', pos);
  }
  var keys = Object.keys(this._positionBtns);
  for (var i = 0; i < keys.length; i++) {
    var isActive = keys[i] === pos;
    var btn = this._positionBtns[keys[i]];
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    if (isActive) {
      btn.classList.add('a11y-widget__position-btn--active');
    } else {
      btn.classList.remove('a11y-widget__position-btn--active');
    }
  }
};

/**
 * (Re)render the saved-profile list inside `_profileListEl`.
 * Called after every save/delete and on language change.
 */
Widget.prototype._renderProfileList = function () {
  if (!this._profileListEl) {
    return;
  }

  var self = this;

  // Clear existing children
  while (this._profileListEl.firstChild) {
    this._profileListEl.removeChild(this._profileListEl.firstChild);
  }

  var names = this.getProfiles();

  if (names.length === 0) {
    var emptyEl = createElement('p', 'a11y-widget__profiles-empty', {
      'data-i18n': 'noProfiles',
    });
    emptyEl.textContent = this._t('noProfiles');
    this._profileListEl.appendChild(emptyEl);
    return;
  }

  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    var item = createElement('div', 'a11y-widget__profiles-item');

    var nameSpan = createElement('span', 'a11y-widget__profiles-item-name');
    nameSpan.textContent = name;
    item.appendChild(nameSpan);

    var btnGroup = createElement('div', 'a11y-widget__profiles-item-btns');

    var loadBtn = createElement('button', 'a11y-widget__profiles-load-btn', {
      'type': 'button',
    });
    loadBtn.textContent = this._t('loadProfile');
    loadBtn.setAttribute('aria-label', this._t('loadProfile') + ': ' + name);

    var deleteBtn = createElement('button', 'a11y-widget__profiles-delete-btn', {
      'type': 'button',
    });
    deleteBtn.textContent = this._t('deleteProfile');
    deleteBtn.setAttribute('aria-label', this._t('deleteProfile') + ': ' + name);

    // Use IIFE to correctly capture `name` in the closure
    (function (n) {
      loadBtn.addEventListener('click', function () { self.loadProfile(n); });
      deleteBtn.addEventListener('click', function () { self.deleteProfile(n); });
    })(name);

    btnGroup.appendChild(loadBtn);
    btnGroup.appendChild(deleteBtn);
    item.appendChild(btnGroup);

    this._profileListEl.appendChild(item);
  }
};

/**
 * Build a single feature menu item element.
 *
 * @param {import('./features.js').FeatureDefinition} feature
 * @returns {HTMLElement}
 */
Widget.prototype._buildFeatureItem = function (feature) {
  var isRange = feature.type === 'range';
  var currentValue = this._settings[feature.id];

  var item = createElement('div', 'a11y-widget__item', {
    'role': isRange ? 'menuitem' : 'menuitemcheckbox',
    'tabindex': '-1',
    'data-feature': feature.id,
  });

  if (!isRange) {
    item.setAttribute('aria-checked', currentValue ? 'true' : 'false');
    if (currentValue) {
      item.classList.add(ACTIVE_MODIFIER);
    }
  }

  // Icon
  var iconSpan = createElement('span', 'a11y-widget__item-icon');
  iconSpan.appendChild(parseSVG(feature.icon));
  item.appendChild(iconSpan);

  // Label
  var labelSpan = createElement('span', 'a11y-widget__item-label');
  labelSpan.setAttribute('data-i18n', feature.id);
  labelSpan.textContent = this._t(feature.id);
  item.appendChild(labelSpan);

  if (isRange) {
    // Range controls (font size, line height, letter spacing, word spacing, …)
    var controls = createElement('div', 'a11y-widget__font-controls');

    var decKey = 'decrease' + capitalise(feature.id);
    var incKey = 'increase' + capitalise(feature.id);

    var minusBtn = createElement('button', 'a11y-widget__font-btn', {
      'data-action': 'decrease',
      'data-feature': feature.id,
      'data-i18n-action': decKey,
      'aria-label': this._t(decKey),
      'type': 'button',
    });
    minusBtn.appendChild(parseSVG(MINUS_ICON_SVG));

    var valueSpan = createElement('span', 'a11y-widget__font-value');
    valueSpan.textContent = String(currentValue);
    valueSpan.setAttribute('aria-live', 'polite');
    valueSpan.setAttribute('data-feature', feature.id);
    this._rangeValueEls[feature.id] = valueSpan;

    var plusBtn = createElement('button', 'a11y-widget__font-btn', {
      'data-action': 'increase',
      'data-feature': feature.id,
      'data-i18n-action': incKey,
      'aria-label': this._t(incKey),
      'type': 'button',
    });
    plusBtn.appendChild(parseSVG(PLUS_ICON_SVG));

    controls.appendChild(minusBtn);
    controls.appendChild(valueSpan);
    controls.appendChild(plusBtn);

    item.appendChild(controls);
  } else {
    // Toggle indicator
    var toggleIndicator = createElement('span', 'a11y-widget__item-toggle', {
      'aria-hidden': 'true',
    });
    item.appendChild(toggleIndicator);
  }

  return item;
};

// ---------------------------------------------------------------------------
// Internal: Event binding
// ---------------------------------------------------------------------------

/**
 * Attach all event listeners.
 */
Widget.prototype._attachEvents = function () {
  // Toggle button
  this._toggleBtn.addEventListener('click', this._handleToggleClick);
  this._toggleBtn.addEventListener('keydown', this._handleToggleKeydown);

  // Panel (delegated clicks and keyboard nav)
  this._panel.addEventListener('click', this._handlePanelClick);
  this._panel.addEventListener('keydown', this._handlePanelKeydown);

  // Document-level: close on outside click and Escape
  document.addEventListener('click', this._handleDocumentClick);
  document.addEventListener('keydown', this._handleDocumentKeydown);
};

/**
 * Detach all event listeners.
 */
Widget.prototype._detachEvents = function () {
  this._toggleBtn.removeEventListener('click', this._handleToggleClick);
  this._toggleBtn.removeEventListener('keydown', this._handleToggleKeydown);
  this._panel.removeEventListener('click', this._handlePanelClick);
  this._panel.removeEventListener('keydown', this._handlePanelKeydown);
  document.removeEventListener('click', this._handleDocumentClick);
  document.removeEventListener('keydown', this._handleDocumentKeydown);
};

// ---------------------------------------------------------------------------
// Internal: Event handlers
// ---------------------------------------------------------------------------

/**
 * Handle click on the toggle button.
 *
 * @param {MouseEvent} e
 */
Widget.prototype._onToggleClick = function (e) {
  e.stopPropagation();
  this.toggleMenu();
};

/**
 * Handle keydown on the toggle button.
 * Enter/Space open the menu; Down arrow also opens it.
 *
 * @param {KeyboardEvent} e
 */
Widget.prototype._onToggleKeydown = function (e) {
  switch (e.key) {
  case 'Enter':
  case ' ':
    e.preventDefault();
    this.toggleMenu();
    break;
  case 'ArrowDown':
    e.preventDefault();
    this.openMenu();
    break;
  }
};

/**
 * Handle delegated clicks inside the panel.
 *
 * @param {MouseEvent} e
 */
Widget.prototype._onPanelClick = function (e) {
  e.stopPropagation();
  var target = e.target;

  // Close button
  if (target === this._closeBtn || this._closeBtn.contains(target)) {
    this.closeMenu();
    this._toggleBtn.focus();
    return;
  }

  // Reset button
  if (target === this._resetBtn || this._resetBtn.contains(target)) {
    this.resetAll();
    return;
  }

  // Font size +/- buttons
  var fontBtn = this._findAncestorWithClass(target, 'a11y-widget__font-btn');
  if (fontBtn) {
    var action = fontBtn.getAttribute('data-action');
    var featureId = fontBtn.getAttribute('data-feature');
    if (action && featureId) {
      this._adjustRange(featureId, action);
    }
    return;
  }

  // Feature item (toggle) — use _getFeatureDefinition to support plugin features (F-003)
  var item = this._findAncestorWithAttr(target, 'data-feature');
  if (item) {
    var fId = item.getAttribute('data-feature');
    var feature = this._getFeatureDefinition(fId);
    if (feature && feature.type === 'toggle') {
      this._toggleFeature(fId);
    }
  }
};

/**
 * Handle keyboard navigation inside the panel.
 *
 * @param {KeyboardEvent} e
 */
Widget.prototype._onPanelKeydown = function (e) {
  var currentIndex = this._getFocusedItemIndex();

  switch (e.key) {
  case 'ArrowDown':
    e.preventDefault();
    this._focusItem(currentIndex + 1);
    break;
  case 'ArrowUp':
    e.preventDefault();
    this._focusItem(currentIndex - 1);
    break;
  case 'Home':
    e.preventDefault();
    this._focusItem(0);
    break;
  case 'End':
    e.preventDefault();
    this._focusItem(this._menuItems.length - 1);
    break;
  case 'Enter':
  case ' ':
    e.preventDefault();
    this._activateCurrentItem(e.target);
    break;
  case 'Escape':
    e.preventDefault();
    e.stopPropagation();
    this.closeMenu();
    this._toggleBtn.focus();
    break;
  case 'Tab':
    // Tab out of menu closes it
    this.closeMenu();
    break;
  }
};

/**
 * Close menu when clicking outside the widget.
 *
 * @param {MouseEvent} e
 */
Widget.prototype._onDocumentClick = function (e) {
  if (this._destroyed) {
    return;
  }
  if (this._isOpen && !this._root.contains(e.target)) {
    this.closeMenu();
  }
};

/**
 * Close menu on Escape from anywhere in the document.
 *
 * @param {KeyboardEvent} e
 */
Widget.prototype._onDocumentKeydown = function (e) {
  if (this._destroyed) {
    return;
  }
  if (e.key === 'Escape' && this._isOpen) {
    this.closeMenu();
    this._toggleBtn.focus();
    return;
  }

  // Keyboard shortcut to toggle menu (default: Alt+A)
  if (this._parsedShortcut) {
    var s = this._parsedShortcut;
    if (
      e.key.toLowerCase() === s.key &&
      e.altKey === s.alt &&
      e.ctrlKey === s.ctrl &&
      e.shiftKey === s.shift &&
      e.metaKey === s.meta
    ) {
      e.preventDefault();
      this.toggleMenu();
    }
  }
};

// ---------------------------------------------------------------------------
// Internal: Focus management
// ---------------------------------------------------------------------------

/**
 * Return the index of the currently focused menu item, or -1.
 *
 * @returns {number}
 */
Widget.prototype._getFocusedItemIndex = function () {
  var active = document.activeElement;
  for (var i = 0; i < this._menuItems.length; i++) {
    if (this._menuItems[i] === active || this._menuItems[i].contains(active)) {
      return i;
    }
  }
  return -1;
};

/**
 * Move focus to the menu item at the given index, wrapping around at
 * boundaries.
 *
 * @param {number} index
 */
Widget.prototype._focusItem = function (index) {
  if (this._menuItems.length === 0) {
    return;
  }
  if (index < 0) {
    index = this._menuItems.length - 1;
  }
  if (index >= this._menuItems.length) {
    index = 0;
  }
  this._menuItems[index].focus();
};

/**
 * Activate the item that currently has focus (Enter/Space handler).
 *
 * @param {HTMLElement} target
 */
Widget.prototype._activateCurrentItem = function (target) {
  // Check if target is inside a font control button
  var fontBtn = this._findAncestorWithClass(target, 'a11y-widget__font-btn');
  if (fontBtn) {
    var action = fontBtn.getAttribute('data-action');
    var featureId = fontBtn.getAttribute('data-feature');
    if (action && featureId) {
      this._adjustRange(featureId, action);
    }
    return;
  }

  // Otherwise find the closest item with data-feature
  var item = this._findAncestorWithAttr(target, 'data-feature');
  if (!item) {
    // Maybe the target IS a menu item (language row)
    var idx = this._getFocusedItemIndex();
    if (idx >= 0) {
      item = this._menuItems[idx];
    }
  }

  if (item) {
    var fId = item.getAttribute('data-feature');
    if (fId) {
      var feature = getFeature(fId);
      if (feature && feature.type === 'toggle') {
        this._toggleFeature(fId);
      }
    }
  }
};

// ---------------------------------------------------------------------------
// Internal: DOM traversal helpers
// ---------------------------------------------------------------------------

/**
 * Walk up the DOM from `el` looking for an ancestor (or self) with the
 * specified class name.  Stops at the panel boundary.
 *
 * @param {HTMLElement} el
 * @param {string} className
 * @returns {HTMLElement|null}
 */
Widget.prototype._findAncestorWithClass = function (el, className) {
  while (el && el !== this._panel) {
    if (el.classList && el.classList.contains(className)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
};

/**
 * Walk up the DOM from `el` looking for an ancestor (or self) with the
 * specified attribute.  Stops at the panel boundary.
 *
 * @param {HTMLElement} el
 * @param {string} attrName
 * @returns {HTMLElement|null}
 */
Widget.prototype._findAncestorWithAttr = function (el, attrName) {
  while (el && el !== this._panel) {
    if (el.hasAttribute && el.hasAttribute(attrName)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
};

// ---------------------------------------------------------------------------
// Internal: Feature toggling
// ---------------------------------------------------------------------------

/**
 * Toggle a boolean feature on/off and update state + DOM.
 *
 * @param {string} featureId
 */
Widget.prototype._toggleFeature = function (featureId) {
  var current = !!this._settings[featureId];
  var newValue = !current;
  this._settings[featureId] = newValue;
  this._recordFeature(featureId, newValue);

  applyFeature(featureId, newValue);
  this._updateItemState(featureId, newValue);

  // Mutual exclusivity: disable conflicting features when enabling this one
  if (newValue) {
    var def = this._getFeatureDefinition(featureId);
    if (def && def.conflictsWith) {
      for (var c = 0; c < def.conflictsWith.length; c++) {
        var conflictId = def.conflictsWith[c];
        if (this._settings[conflictId]) {
          this._settings[conflictId] = false;
          applyFeature(conflictId, false);
          this._callFeatureHandler(conflictId, false);
          this._updateItemState(conflictId, false);
        }
      }
    }
  }

  // Dispatch to plugin handler (built-in or external) for features with
  // side-effects beyond the CSS class already applied by applyFeature().
  this._callFeatureHandler(featureId, newValue, newValue);

  this._saveState();

  // Update toggle button aria-label with new active count
  this._updateToggleAriaLabel();

  // Announce feature state change to screen readers
  var featureDef = this._getFeatureDefinition(featureId);
  var featureName = featureDef ? this._t(featureId) : featureId;
  this._announce(featureName + ' ' + this._t(newValue ? 'featureEnabled' : 'featureDisabled'));

  if (this._onToggle) {
    this._onToggle(featureId, newValue);
  }

  this._emit('a11y:toggle', { featureId: featureId, value: newValue, settings: this.getSettings() });
};

/**
 * Record a feature toggle event in the session stats.
 *
 * @param {string}  featureId
 * @param {boolean} active
 */
Widget.prototype._recordFeature = function (featureId, active) {
  var stat = this._featureStats && this._featureStats[featureId];
  if (!stat) { return; }
  stat.enabled = !!active;
  stat.toggleCount++;
  if (active) { stat.lastActivated = Date.now(); }
};

/**
 * Adjust a range feature (increment or decrement).
 *
 * @param {string} featureId
 * @param {'increase'|'decrease'} action
 */
Widget.prototype._adjustRange = function (featureId, action) {
  var feature = getFeature(featureId);
  if (!feature || feature.type !== 'range') {
    return;
  }

  var current = Number(this._settings[featureId]) || 0;
  var next;

  if (action === 'increase') {
    next = Math.min(current + feature.step, feature.max);
  } else {
    next = Math.max(current - feature.step, feature.min);
  }

  if (next === current) {
    return;
  }

  this._settings[featureId] = next;
  applyFeature(featureId, next);

  // Update the displayed value
  var valueEl = this._rangeValueEls[featureId];
  if (valueEl) {
    valueEl.textContent = String(next);
  }

  this._saveState();

  // Update toggle button aria-label with new active count
  this._updateToggleAriaLabel();

  if (this._onToggle) {
    this._onToggle(featureId, next);
  }

  this._emit('a11y:toggle', { featureId: featureId, value: next, settings: this.getSettings() });
};

/**
 * Update the visual state of a toggle item element.
 *
 * @param {string}  featureId
 * @param {boolean} isActive
 */
Widget.prototype._updateItemState = function (featureId, isActive) {
  var item = this._itemElements[featureId];
  if (!item) {
    return;
  }
  item.setAttribute('aria-checked', isActive ? 'true' : 'false');
  if (isActive) {
    item.classList.add(ACTIVE_MODIFIER);
  } else {
    item.classList.remove(ACTIVE_MODIFIER);
  }
};

// ---------------------------------------------------------------------------
// Internal: CustomEvent emitter
// ---------------------------------------------------------------------------

/**
 * Dispatch a namespaced CustomEvent on `window` for external listeners.
 *
 * All events are non-bubbling and non-cancelable.  Errors thrown by event
 * listeners are silently swallowed so they can never crash the widget.
 *
 * Called at: constructor (`a11y:init`), `_toggleFeature` / `_adjustRange`
 * (`a11y:toggle`), `openMenu` (`a11y:open`), `closeMenu` (`a11y:close`),
 * `resetAll` (`a11y:reset`), `setLanguage` (`a11y:langchange`),
 * `destroy` (`a11y:destroy`).
 *
 * @param {string} eventName - Namespaced event name (e.g. `'a11y:toggle'`).
 * @param {Object} [detail={}] - Arbitrary payload attached to `event.detail`.
 */
Widget.prototype._emit = function (eventName, detail) {
  if (typeof window === 'undefined' || typeof CustomEvent === 'undefined') {
    return;
  }
  try {
    window.dispatchEvent(new CustomEvent(eventName, {
      bubbles: false,
      cancelable: false,
      detail: detail || {},
    }));
  } catch (_e) {
    // Silently ignore — never let event emission break the widget
  }
};

// ---------------------------------------------------------------------------
// Internal: i18n helpers
// ---------------------------------------------------------------------------

/**
 * Shorthand for `getTranslation(this._language, key)`.
 *
 * @param {string} key
 * @returns {string}
 */
Widget.prototype._t = function (key) {
  return getTranslation(this._language, key);
};

/**
 * Count the number of features currently set to a truthy / non-zero value.
 *
 * @returns {number}
 */
Widget.prototype._getActiveCount = function () {
  var count = 0;
  var keys = Object.keys(this._settings);
  for (var i = 0; i < keys.length; i++) {
    if (this._settings[keys[i]]) { count++; }
  }
  return count;
};

/**
 * Post a message into the widget's aria-live region so screen readers
 * announce it.  The text is cleared after 3 s to prevent stale announcements
 * from being re-read when the user navigates back.
 *
 * @param {string} text
 */
Widget.prototype._announce = function (text) {
  if (!this._announceEl) { return; }
  var self = this;
  // Reset first so repeated identical strings are re-announced
  this._announceEl.textContent = '';
  // Use a tiny timeout so the DOM change is picked up by AT
  setTimeout(function () {
    if (self._announceEl) {
      self._announceEl.textContent = text;
    }
    // Clear after 3 s so the stale text is not re-read
    setTimeout(function () {
      if (self._announceEl) {
        self._announceEl.textContent = '';
      }
    }, 3000);
  }, 50);
};

/**
 * Refresh the toggle button's aria-label to include the active feature count.
 * Format: "<menuTitle> (<n> <settingsActive>)"
 */
Widget.prototype._updateToggleAriaLabel = function () {
  if (!this._toggleBtn) { return; }
  var title = this._panelTitle || this._t('menuTitle');
  var count = this._getActiveCount();
  var label = count > 0
    ? title + ' (' + count + ' ' + this._t('settingsActive') + ')'
    : title;
  this._toggleBtn.setAttribute('aria-label', label);
};

/**
 * Apply the current language to all text nodes in the widget DOM.
 *
 * @param {string} lang
 */
Widget.prototype._applyLanguage = function (lang) {
  var rtl = isRTL(lang);

  // Scope lang/dir to the widget root element only.
  // The host page's <html lang> and <html dir> are never modified.
  this._root.setAttribute('lang', lang);
  this._root.setAttribute('dir', rtl ? 'rtl' : 'ltr');

  // Update widget RTL modifier class
  if (rtl) {
    this._root.classList.add(RTL_MODIFIER);
  } else {
    this._root.classList.remove(RTL_MODIFIER);
  }

  // Update text content
  if (!this._panelTitle) {
    this._titleEl.textContent = this._t('menuTitle');
    this._contentEl.setAttribute('aria-label', this._t('menuTitle'));
  }
  // Update toggle aria-label (includes active count)
  this._updateToggleAriaLabel();
  this._closeBtn.setAttribute('aria-label', this._t('closeMenu'));
  if (this._disclaimerEl && this._disclaimerText === undefined) {
    this._disclaimerEl.textContent = this._t('disclaimer');
  }
  this._resetBtn.textContent = this._t('resetAll');

  // Update all elements with data-i18n attribute
  var i18nElements = this._root.querySelectorAll('[data-i18n]');
  for (var i = 0; i < i18nElements.length; i++) {
    var el = i18nElements[i];
    var key = el.getAttribute('data-i18n');
    el.textContent = this._t(key);
  }

  // Update range control labels (each button carries its own i18n key)
  var actionBtns = this._root.querySelectorAll('[data-i18n-action]');
  for (var a = 0; a < actionBtns.length; a++) {
    var actionKey = actionBtns[a].getAttribute('data-i18n-action');
    actionBtns[a].setAttribute('aria-label', this._t(actionKey));
  }

  // Update group section aria-labels
  var groupSections = this._root.querySelectorAll('[data-group]');
  for (var g = 0; g < groupSections.length; g++) {
    var groupName = groupSections[g].getAttribute('data-group');
    groupSections[g].setAttribute('aria-label', this._t(groupName));
  }

  // Update zoom-lock warning text if visible
  if (this._zoomWarnEl) {
    this._zoomWarnEl.textContent = this._t('zoomLockWarning');
  }

  // Update input placeholders and their aria-labels
  var placeholderEls = this._root.querySelectorAll('[data-i18n-placeholder]');
  for (var ph = 0; ph < placeholderEls.length; ph++) {
    var phKey = placeholderEls[ph].getAttribute('data-i18n-placeholder');
    placeholderEls[ph].placeholder = this._t(phKey);
    placeholderEls[ph].setAttribute('aria-label', this._t(phKey));
  }

  // Re-render profile list to pick up translated Load/Delete labels
  if (this._profileListEl) {
    this._renderProfileList();
  }

  // Update position button aria-labels
  var POS_KEYS = {
    'top-left': 'topLeft',
    'top-right': 'topRight',
    'bottom-left': 'bottomLeft',
    'bottom-right': 'bottomRight',
  };
  var posBtnKeys = Object.keys(this._positionBtns);
  for (var pb = 0; pb < posBtnKeys.length; pb++) {
    var posBtnKey = POS_KEYS[posBtnKeys[pb]];
    if (posBtnKey) {
      this._positionBtns[posBtnKeys[pb]].setAttribute('aria-label', this._t(posBtnKey));
    }
  }

  // Update language select value
  if (this._langSelect) {
    this._langSelect.value = lang;
  }

  // Update TTS controls labels
  if (this._ttsPauseBtn) {
    this._ttsPauseBtn.textContent = this._ttsPaused ? this._t('ttsResume') : this._t('ttsPause');
  }
};

// ---------------------------------------------------------------------------
// Internal: Reading Guide
// ---------------------------------------------------------------------------

/**
 * Activate the reading guide overlay.
 */
Widget.prototype._activateReadingGuide = function () {
  if (!this._readingGuideEl) {
    this._readingGuideEl = createElement('div', 'a11y-reading-guide-bar');
    this._readingGuideEl.style.top = '-100px';
    document.body.appendChild(this._readingGuideEl);
  }
  document.addEventListener('mousemove', this._handleReadingGuideMove);
  document.addEventListener('touchmove', this._handleReadingGuideTouchMove, { passive: true });
};

/**
 * Deactivate the reading guide overlay.
 */
Widget.prototype._deactivateReadingGuide = function () {
  document.removeEventListener('mousemove', this._handleReadingGuideMove);
  document.removeEventListener('touchmove', this._handleReadingGuideTouchMove);
  if (this._readingGuideEl && this._readingGuideEl.parentNode) {
    this._readingGuideEl.parentNode.removeChild(this._readingGuideEl);
  }
  this._readingGuideEl = null;
};

/**
 * Handle mousemove to reposition the reading guide bar.
 *
 * @param {MouseEvent} e
 */
Widget.prototype._onReadingGuideMove = function (e) {
  if (!this._readingGuideEl) { return; }
  // Store latest Y and schedule a single rAF write to avoid INP regression
  // (PRD §7.4 — mousemove handler must be wrapped in requestAnimationFrame).
  this._rgRafPendingY = e.clientY - 6;
  if (this._rgRafScheduled) { return; }
  this._rgRafScheduled = true;
  var self = this;
  requestAnimationFrame(function () {
    self._rgRafScheduled = false;
    if (self._readingGuideEl) {
      self._readingGuideEl.style.top = self._rgRafPendingY + 'px';
    }
  });
};

/**
 * Handle touchmove to reposition the reading guide bar.
 *
 * @param {TouchEvent} e
 */
Widget.prototype._onReadingGuideTouchMove = function (e) {
  if (!this._readingGuideEl || !e.touches || !e.touches[0]) { return; }
  // Throttle via rAF — shared flag with mousemove handler.
  this._rgRafPendingY = e.touches[0].clientY - 6;
  if (this._rgRafScheduled) { return; }
  this._rgRafScheduled = true;
  var self = this;
  requestAnimationFrame(function () {
    self._rgRafScheduled = false;
    if (self._readingGuideEl) {
      self._readingGuideEl.style.top = self._rgRafPendingY + 'px';
    }
  });
};

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Internal: Highlight Hover (F-210)
// ---------------------------------------------------------------------------

/**
 * Activate click-to-pin highlight behavior for the Highlight on Hover feature.
 *
 * The CSS `:hover` rule already provides hover highlighting via the
 * `a11y-highlight-hover` body class.  This method adds a click listener so
 * that clicking a text element pins a persistent `a11y-highlight-pinned` class
 * on it until another element is clicked or the feature is disabled.
 */
Widget.prototype._activateHighlightHover = function () {
  document.addEventListener('click', this._handleHighlightClick);
};

/**
 * Deactivate click-to-pin highlight and clean up the pinned element.
 */
Widget.prototype._deactivateHighlightHover = function () {
  document.removeEventListener('click', this._handleHighlightClick);
  if (this._highlightedEl) {
    this._highlightedEl.classList.remove('a11y-highlight-pinned');
    this._highlightedEl = null;
  }
};

/**
 * Handle document clicks to pin / unpin highlight on text elements (F-210).
 *
 * @param {MouseEvent} e
 */
Widget.prototype._onHighlightHoverClick = function (e) {
  // Ignore clicks inside the widget panel
  if (this._root && this._root.contains(e.target)) { return; }

  // Walk up to find the nearest text-level element
  var el = e.target;
  while (el && el !== document.body) {
    if (_HIGHLIGHT_HOVER_TAGS.indexOf(el.tagName) !== -1) { break; }
    el = el.parentElement;
  }

  if (!el || el === document.body) { return; }

  // Toggle: clicking the same element unpins it
  if (this._highlightedEl === el) {
    el.classList.remove('a11y-highlight-pinned');
    this._highlightedEl = null;
    return;
  }

  // Move pin to new element
  if (this._highlightedEl) {
    this._highlightedEl.classList.remove('a11y-highlight-pinned');
  }
  el.classList.add('a11y-highlight-pinned');
  this._highlightedEl = el;
};

// ---------------------------------------------------------------------------
// Internal: Text-to-Speech
// ---------------------------------------------------------------------------

/**
 * Activate text-to-speech mode (click-to-speak).
 */
Widget.prototype._activateTTS = function () {
  this._ttsEnabled = true;
  this._ttsPaused = false;
  document.addEventListener('click', this._handleTTSClick);
  if (this._ttsControlsEl) {
    this._ttsControlsEl.removeAttribute('hidden');
    if (this._ttsPauseBtn) {
      this._ttsPauseBtn.textContent = this._t('ttsPause');
    }
  }
};

/**
 * Deactivate text-to-speech mode.
 */
Widget.prototype._deactivateTTS = function () {
  this._ttsEnabled = false;
  this._ttsPaused = false;
  document.removeEventListener('click', this._handleTTSClick);
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.cancel();
  }
  // Clean up current TTS element (word spans + speaking highlight)
  this._cleanupTTSElement();
  // Remove any remaining speaking highlights from other elements
  var highlighted = document.querySelectorAll('.a11y-tts-speaking');
  for (var i = 0; i < highlighted.length; i++) {
    highlighted[i].classList.remove('a11y-tts-speaking');
  }
  if (this._ttsControlsEl) {
    this._ttsControlsEl.setAttribute('hidden', '');
  }
};

/**
 * Inject per-word `<span>` elements into a plain-text element for word-level
 * highlighting during TTS playback (F-204). Only applied when the element has
 * no child elements (purely a text node container) to avoid corrupting markup.
 * Saves original `innerHTML` to `_ttsOriginalHTML` for restoration.
 *
 * @param {Element} el
 */
Widget.prototype._prepareTTSWordSpans = function (el) {
  this._ttsCurrentTarget = el;
  this._ttsOriginalHTML = null;

  // Only wrap plain-text elements (no child elements)
  if (el.children.length > 0) { return; }

  var text = el.textContent || '';
  if (!text.trim()) { return; }

  this._ttsOriginalHTML = el.innerHTML;

  // Build replacement HTML with per-word spans keyed by charIndex
  var wordRe = /\S+/g;
  var match;
  var lastIndex = 0;
  var html = '';

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  while ((match = wordRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      html += escapeHTML(text.slice(lastIndex, match.index));
    }
    html += '<span class="a11y-tts-word" data-char-index="' + match.index + '">'
          + escapeHTML(match[0]) + '</span>';
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    html += escapeHTML(text.slice(lastIndex));
  }

  el.innerHTML = html;
};

/**
 * Remove word spans from `_ttsCurrentTarget` and restore its original HTML.
 * Also removes `.a11y-tts-speaking` and `.a11y-tts-word-active` classes.
 */
Widget.prototype._cleanupTTSElement = function () {
  var el = this._ttsCurrentTarget;
  if (!el) { return; }

  // Remove active word highlight
  var active = el.querySelector('.a11y-tts-word-active');
  if (active) { active.classList.remove('a11y-tts-word-active'); }

  // Restore original markup if we injected word spans
  if (this._ttsOriginalHTML !== null) {
    el.innerHTML = this._ttsOriginalHTML;
    this._ttsOriginalHTML = null;
  }

  el.classList.remove('a11y-tts-speaking');
  this._ttsCurrentTarget = null;
};

/**
 * Handle click events for text-to-speech: read aloud the clicked element's text.
 * Injects per-word spans and uses `onboundary` events for word-level highlighting.
 *
 * @param {MouseEvent} e
 */
Widget.prototype._onTTSClick = function (e) {
  if (this._destroyed || !this._ttsEnabled) {
    return;
  }
  // Ignore clicks inside the widget itself
  if (this._root && this._root.contains(e.target)) {
    return;
  }

  var target = e.target;
  var text = (target.textContent || '').trim();
  if (!text || typeof speechSynthesis === 'undefined') {
    return;
  }

  // Cancel any ongoing speech and clean up previous element
  speechSynthesis.cancel();
  this._cleanupTTSElement();

  // Remove stale speaking highlights from any other elements
  var prev = document.querySelectorAll('.a11y-tts-speaking');
  for (var i = 0; i < prev.length; i++) {
    prev[i].classList.remove('a11y-tts-speaking');
  }

  // Highlight the target element and inject word spans
  target.classList.add('a11y-tts-speaking');
  this._prepareTTSWordSpans(target);

  var utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = this._language;
  utterance.rate = this._ttsRate;

  var self = this;

  // Word-level highlight: fires as each word boundary is reached
  utterance.onboundary = function (boundaryEvent) {
    if (!self._ttsCurrentTarget) { return; }
    var charIndex = boundaryEvent.charIndex;
    var prevActive = self._ttsCurrentTarget.querySelector('.a11y-tts-word-active');
    if (prevActive) { prevActive.classList.remove('a11y-tts-word-active'); }
    var span = self._ttsCurrentTarget.querySelector('[data-char-index="' + charIndex + '"]');
    if (span) { span.classList.add('a11y-tts-word-active'); }
  };

  utterance.onend = function () {
    self._cleanupTTSElement();
  };
  utterance.onerror = function () {
    self._cleanupTTSElement();
  };

  speechSynthesis.speak(utterance);
};

/**
 * Build the TTS controls section (pause/resume + speed).
 */
Widget.prototype._buildTTSControls = function () {
  var self = this;
  var el = createElement('div', 'a11y-widget__tts-controls');
  el.setAttribute('hidden', '');
  el.setAttribute('aria-live', 'polite');

  // Pause/resume button
  var pauseBtn = createElement('button', 'a11y-widget__tts-pause');
  pauseBtn.textContent = this._t('ttsPause');
  pauseBtn.addEventListener('click', function () {
    self._toggleTTSPause();
  });
  el.appendChild(pauseBtn);

  // Speed section
  var speedSection = createElement('div', 'a11y-widget__tts-speed');
  var speedLabel = createElement('span', 'a11y-widget__tts-speed-label');
  speedLabel.textContent = this._t('ttsSpeed') + ': ';
  speedSection.appendChild(speedLabel);

  var slowerBtn = createElement('button', 'a11y-widget__tts-slower');
  slowerBtn.textContent = this._t('ttsSlower');
  slowerBtn.setAttribute('aria-label', this._t('ttsSlower'));
  slowerBtn.addEventListener('click', function () {
    self._changeTTSRate(-0.25);
  });
  speedSection.appendChild(slowerBtn);

  var speedDisplay = createElement('span', 'a11y-widget__tts-rate');
  speedDisplay.textContent = this._ttsRate.toFixed(2) + '\xd7';
  speedSection.appendChild(speedDisplay);

  var fasterBtn = createElement('button', 'a11y-widget__tts-faster');
  fasterBtn.textContent = this._t('ttsFaster');
  fasterBtn.setAttribute('aria-label', this._t('ttsFaster'));
  fasterBtn.addEventListener('click', function () {
    self._changeTTSRate(0.25);
  });
  speedSection.appendChild(fasterBtn);
  el.appendChild(speedSection);

  this._ttsControlsEl = el;
  this._ttsPauseBtn = pauseBtn;
  this._ttsSpeedDisplay = speedDisplay;
  this._panel.appendChild(el);
};

/**
 * Toggle the TTS pause/resume state.
 */
Widget.prototype._toggleTTSPause = function () {
  if (this._ttsPaused) {
    this._ttsPaused = false;
    if (this._ttsPauseBtn) { this._ttsPauseBtn.textContent = this._t('ttsPause'); }
    if (typeof speechSynthesis !== 'undefined') { speechSynthesis.resume(); }
  } else {
    this._ttsPaused = true;
    if (this._ttsPauseBtn) { this._ttsPauseBtn.textContent = this._t('ttsResume'); }
    if (typeof speechSynthesis !== 'undefined') { speechSynthesis.pause(); }
  }
};

/**
 * Adjust TTS playback rate by delta, clamped between 0.5 and 2.0.
 *
 * @param {number} delta
 */
Widget.prototype._changeTTSRate = function (delta) {
  this._ttsRate = Math.min(2.0, Math.max(0.5, Math.round((this._ttsRate + delta) * 100) / 100));
  if (this._ttsSpeedDisplay) {
    this._ttsSpeedDisplay.textContent = this._ttsRate.toFixed(2) + '\xd7';
  }
};

/**
 * Add the dev-mode alt text audit method.
 */
Widget.prototype._runAltTextAudit = function () {
  var violations = [];
  var images = document.querySelectorAll('img');
  for (var i = 0; i < images.length; i++) {
    var img = images[i];
    // Skip images inside the widget itself
    if (this._root && this._root.contains(img)) { continue; }
    // Flag images missing alt attribute entirely
    if (!img.hasAttribute('alt')) {
      img.classList.add('a11y-dev-violation');
      img.setAttribute('data-a11y-audit', 'missing-alt');
      violations.push(img);
    }
  }

  // Also check for <svg> elements without accessible names
  var svgs = document.querySelectorAll('svg:not([aria-hidden="true"])');
  for (var j = 0; j < svgs.length; j++) {
    var svg = svgs[j];
    if (this._root && this._root.contains(svg)) { continue; }
    var hasLabel = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby');
    var hasTitleChild = svg.querySelector('title');
    if (!hasLabel && !hasTitleChild) {
      svg.classList.add('a11y-dev-violation');
      svg.setAttribute('data-a11y-audit', 'missing-accessible-name');
      violations.push(svg);
    }
  }

  this._devAuditCount = violations.length;

  // Console report
  if (violations.length > 0) {
    console.warn('[AccessibilityWidget devMode] Alt text audit: ' + violations.length + ' violation(s) found. Elements marked with .a11y-dev-violation class.');
  } else {
    console.info('[AccessibilityWidget devMode] Alt text audit: No violations found.');
  }

  // Update badge text and ARIA label (F-212)
  if (this._devAuditBadgeEl) {
    var badgeText = this._t('devAuditBadge') + ': ' + violations.length;
    this._devAuditBadgeEl.textContent = badgeText;
    this._devAuditBadgeEl.setAttribute('aria-label', badgeText + ' — click to expand');
  }

  // Populate scrollable detail list (F-212)
  if (this._devAuditListEl) {
    this._devAuditListEl.innerHTML = '';
    if (violations.length === 0) {
      var emptyItem = createElement('div', 'a11y-widget__dev-audit-item', { 'role': 'listitem' });
      emptyItem.textContent = this._t('devAuditNoIssues') || 'No issues found';
      this._devAuditListEl.appendChild(emptyItem);
    } else {
      for (var v = 0; v < violations.length; v++) {
        var el = violations[v];
        var listItem = createElement('div', 'a11y-widget__dev-audit-item', { 'role': 'listitem' });
        var tagInfo = el.tagName.toLowerCase();
        var auditType = el.getAttribute('data-a11y-audit') || 'violation';
        var selector = el.id ? '#' + el.id : (el.className ? '.' + el.className.split(' ')[0] : tagInfo);
        listItem.textContent = tagInfo + '[' + auditType + ']: ' + selector;
        this._devAuditListEl.appendChild(listItem);
      }
    }
  }
};

/**
 * Toggle the dev audit detail list open/closed (F-212).
 * Called when the user clicks the dev audit badge button.
 */
Widget.prototype._toggleDevAuditList = function () {
  if (!this._devAuditListEl || !this._devAuditBadgeEl) { return; }
  var isHidden = this._devAuditListEl.hasAttribute('hidden');
  if (isHidden) {
    this._devAuditListEl.removeAttribute('hidden');
    this._devAuditBadgeEl.setAttribute('aria-expanded', 'true');
  } else {
    this._devAuditListEl.setAttribute('hidden', '');
    this._devAuditBadgeEl.setAttribute('aria-expanded', 'false');
  }
};

// ---------------------------------------------------------------------------
// Public API: Menu control
// ---------------------------------------------------------------------------

/**
 * Open the accessibility menu panel and move focus to the first menu item.
 *
 * - No-op when the panel is already open or the widget has been destroyed.
 * - Sets `aria-expanded="true"` on the toggle button.
 * - Invokes the `onOpenMenu` callback if provided in options.
 *
 * @fires {CustomEvent} a11y:open - Dispatched on `window` after the panel opens.
 *   `event.detail` is an empty object.
 *
 * @example
 * var widget = AccessibilityWidget.init();
 * widget.openMenu(); // programmatically open on page load
 */
Widget.prototype.openMenu = function () {
  if (this._isOpen || this._destroyed) {
    return;
  }
  this._menuOpenCount++;
  this._isOpen = true;
  this._root.classList.add(OPEN_MODIFIER);
  this._toggleBtn.setAttribute('aria-expanded', 'true');

  // Focus the first menu item
  if (this._menuItems.length > 0) {
    this._menuItems[0].focus();
  }

  // Announce panel open with active count to screen readers
  var openCount = this._getActiveCount();
  var openSummary = (this._panelTitle || this._t('menuTitle')) +
    (openCount > 0 ? ' — ' + openCount + ' ' + this._t('settingsActive') : '');
  this._announce(openSummary);

  if (this._onOpenMenu) {
    this._onOpenMenu();
  }

  this._emit('a11y:open', {});
};

/**
 * Close the accessibility menu panel.
 *
 * - No-op when the panel is already closed or the widget has been destroyed.
 * - Sets `aria-expanded="false"` on the toggle button.
 * - Invokes the `onCloseMenu` callback if provided in options.
 *
 * @fires {CustomEvent} a11y:close - Dispatched on `window` after the panel closes.
 *   `event.detail` is an empty object.
 *
 * @example
 * widget.closeMenu(); // programmatically close
 */
Widget.prototype.closeMenu = function () {
  if (!this._isOpen || this._destroyed) {
    return;
  }
  this._isOpen = false;
  this._root.classList.remove(OPEN_MODIFIER);
  this._toggleBtn.setAttribute('aria-expanded', 'false');

  if (this._onCloseMenu) {
    this._onCloseMenu();
  }

  this._emit('a11y:close', {});
};

/**
 * Toggle the menu panel between open and closed states.
 *
 * Delegates to {@link openMenu} when closed, {@link closeMenu} when open.
 * Fires the corresponding `a11y:open` or `a11y:close` CustomEvent.
 *
 * @example
 * // Bind to a custom button
 * document.getElementById('my-a11y-btn').addEventListener('click', function () {
 *   AccessibilityWidget.getInstance().toggleMenu();
 * });
 */
Widget.prototype.toggleMenu = function () {
  if (this._isOpen) {
    this.closeMenu();
  } else {
    this.openMenu();
  }
};

// ---------------------------------------------------------------------------
// Public API: Settings
// ---------------------------------------------------------------------------

/**
 * Return a shallow copy of the current feature settings.
 *
 * The returned object maps each **enabled** feature ID to its current value:
 * - Toggle features → `boolean` (`true` = active, `false` = inactive)
 * - Range features (e.g. `"fontSize"`) → `number` (current step, e.g. `2`)
 *
 * The object is a snapshot — subsequent changes to the widget are **not**
 * reflected in previously returned copies.
 *
 * @returns {Record<string, boolean|number>}
 *
 * @example
 * var settings = widget.getSettings();
 * // { highContrast: false, darkMode: true, fontSize: 2, ... }
 * if (settings.highContrast) {
 *   console.log('High contrast is on');
 * }
 */
Widget.prototype.getSettings = function () {
  var copy = {};
  var keys = Object.keys(this._settings);
  for (var i = 0; i < keys.length; i++) {
    copy[keys[i]] = this._settings[keys[i]];
  }
  return copy;
};

/**
 * Programmatically set a single feature to an explicit value.
 *
 * - For **toggle** features: coerces `value` to boolean; no-ops if the value
 *   is already equal to the current state.
 * - For **range** features: coerces `value` to a number and clamps it to
 *   `[feature.min, feature.max]`; no-ops if already at that clamped value.
 * - Applies the DOM change, updates the panel UI, persists to localStorage,
 *   fires `onToggle` callback, and dispatches the `a11y:toggle` CustomEvent —
 *   exactly the same side-effects as user interaction.
 *
 * No-ops when the widget has been destroyed or the feature ID is unknown.
 *
 * @param {string}         featureId - One of the 14 built-in feature IDs.
 * @param {boolean|number} value     - Desired value.
 * @fires {CustomEvent} a11y:toggle
 *
 * @example
 * widget.setFeature('darkMode', true);   // enable dark mode
 * widget.setFeature('fontSize', 3);      // set font size to step 3
 * widget.setFeature('highContrast', false); // disable high contrast
 */
Widget.prototype.setFeature = function (featureId, value) {
  if (this._destroyed) {
    return;
  }
  // Support both built-in features and external plugin features (F-003)
  var feature = this._getFeatureDefinition(featureId);
  if (!feature) {
    return;
  }

  if (feature.type === 'toggle') {
    var newBool = !!value;
    if (!!this._settings[featureId] === newBool) {
      return;
    }
    this._settings[featureId] = newBool;
    this._recordFeature(featureId, newBool);
    applyFeature(featureId, newBool);
    this._updateItemState(featureId, newBool);

    // Mutual exclusivity
    if (newBool && feature.conflictsWith) {
      for (var ci = 0; ci < feature.conflictsWith.length; ci++) {
        var cId = feature.conflictsWith[ci];
        if (this._settings[cId]) {
          this._settings[cId] = false;
          applyFeature(cId, false);
          this._updateItemState(cId, false);
        }
      }
    }

    // Dispatch to plugin handler (built-in or external)
    this._callFeatureHandler(featureId, newBool, newBool);

    this._saveState();
    this._updateToggleAriaLabel();
    if (this._onToggle) {
      this._onToggle(featureId, newBool);
    }
    this._emit('a11y:toggle', { featureId: featureId, value: newBool, settings: this.getSettings() });
    return;
  }

  if (feature.type === 'range') {
    var numVal = Number(value);
    if (isNaN(numVal)) {
      return;
    }
    numVal = Math.max(feature.min, Math.min(feature.max, numVal));
    if (this._settings[featureId] === numVal) {
      return;
    }
    this._settings[featureId] = numVal;
    this._recordFeature(featureId, numVal > feature.min);
    applyFeature(featureId, numVal);

    var valueEl = this._rangeValueEls[featureId];
    if (valueEl) {
      valueEl.textContent = String(numVal);
    }

    this._saveState();
    this._updateToggleAriaLabel();
    if (this._onToggle) {
      this._onToggle(featureId, numVal);
    }
    this._emit('a11y:toggle', { featureId: featureId, value: numVal, settings: this.getSettings() });
  }
};

/**
 * Apply multiple feature values in one call.
 *
 * Iterates over the supplied `settings` object and calls
 * {@link Widget#setFeature} for each key/value pair.  Unknown feature IDs
 * and invalid values are silently skipped (delegated to `setFeature`).
 *
 * No-ops when the widget has been destroyed.
 *
 * @param {Record<string, boolean|number>} settings - Map of feature ID → value.
 *
 * @example
 * widget.applySettings({ darkMode: true, fontSize: 2, highContrast: false });
 */
Widget.prototype.applySettings = function (settings) {
  if (this._destroyed || !settings || typeof settings !== 'object') {
    return;
  }
  var keys = Object.keys(settings);
  for (var i = 0; i < keys.length; i++) {
    this.setFeature(keys[i], settings[keys[i]]);
  }
};

// ---------------------------------------------------------------------------
// Public API: Profiles / Presets
// ---------------------------------------------------------------------------

/**
 * Save the current feature settings as a named profile in localStorage.
 *
 * If a profile with the same `name` already exists it is overwritten.
 * The `name` is trimmed; empty strings and non-strings are ignored.
 * Names longer than 40 characters are silently truncated.
 *
 * @param {string} name - Human-readable label for the profile.
 * @fires {CustomEvent} a11y:profilesave
 *   `event.detail` → `{ name: string, settings: Record<string, boolean|number> }`
 *
 * @example
 * widget.saveProfile('My reading settings');
 */
Widget.prototype.saveProfile = function (name) {
  if (this._destroyed) {
    return;
  }
  var trimmed = (typeof name === 'string' ? name : '').trim();
  if (!trimmed) {
    return;
  }
  if (trimmed.length > 40) {
    trimmed = trimmed.slice(0, 40);
  }

  var profiles = loadProfiles(this._profilesKey) || {};
  profiles[trimmed] = this.getSettings();
  saveProfiles(profiles, this._profilesKey);

  this._renderProfileList();
  this._emit('a11y:profilesave', { name: trimmed, settings: this.getSettings() });
};

/**
 * Load a previously saved profile and apply its settings.
 *
 * No-op when `name` does not match any saved profile.
 *
 * @param {string} name - The profile name to load.
 * @fires {CustomEvent} a11y:profileload
 *   `event.detail` → `{ name: string, settings: Record<string, boolean|number> }`
 *
 * @example
 * widget.loadProfile('My reading settings');
 */
Widget.prototype.loadProfile = function (name) {
  if (this._destroyed) {
    return;
  }
  var profiles = loadProfiles(this._profilesKey) || {};
  var saved = profiles[name];
  if (!saved || typeof saved !== 'object') {
    return;
  }

  this.applySettings(saved);
  this._emit('a11y:profileload', { name: name, settings: this.getSettings() });
};

/**
 * Delete a saved profile from localStorage.
 *
 * No-op when `name` does not match any saved profile.
 *
 * @param {string} name - The profile name to delete.
 * @fires {CustomEvent} a11y:profiledelete
 *   `event.detail` → `{ name: string }`
 *
 * @example
 * widget.deleteProfile('My reading settings');
 */
Widget.prototype.deleteProfile = function (name) {
  if (this._destroyed) {
    return;
  }
  var profiles = loadProfiles(this._profilesKey) || {};
  if (!Object.prototype.hasOwnProperty.call(profiles, name)) {
    return;
  }

  delete profiles[name];
  saveProfiles(profiles, this._profilesKey);

  this._renderProfileList();
  this._emit('a11y:profiledelete', { name: name });
};

/**
 * Move the widget toggle button to a different viewport corner.
 *
 * Valid positions: `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'`.
 * The new position is persisted to localStorage and reflected immediately in
 * the DOM via `data-position` on the widget root element.
 *
 * No-op when the widget has been destroyed, `pos` is not one of the four
 * valid values, or `pos` already matches the current position.
 *
 * @param {string} pos - Target corner.
 * @fires {CustomEvent} a11y:positionchange
 *   `event.detail` → `{ position: string }`
 *
 * @example
 * widget.setPosition('top-left');
 */
Widget.prototype.setPosition = function (pos) {
  if (this._destroyed) {
    return;
  }
  var VALID_POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  if (VALID_POSITIONS.indexOf(pos) === -1) {
    return;
  }
  if (pos === this._position) {
    return;
  }
  this._position = pos;
  this._applyPosition(pos);
  this._saveState();
  this._emit('a11y:positionchange', { position: pos });
};

/**
 * Return an alphabetically sorted array of all saved profile names.
 *
 * @returns {string[]}
 *
 * @example
 * var names = widget.getProfiles(); // ['Dark theme', 'Reading mode']
 */
Widget.prototype.getProfiles = function () {
  var profiles = loadProfiles(this._profilesKey) || {};
  return Object.keys(profiles).sort();
};

/**
 * Reset all features to their defaults, clear persisted settings, and
 * update the UI.
 *
 * In detail, this method:
 * 1. Deactivates Reading Guide and Text-to-Speech (removes overlay / listeners).
 * 2. Removes all feature CSS classes from `document.body`.
 * 3. Resets every feature in `_settings` to its `FeatureDefinition.default`.
 * 4. Updates `aria-checked` and active-modifier class for all toggle items.
 * 5. Resets the displayed value for all range items.
 * 6. Removes the `localStorage` entry so the reset persists across page loads.
 *
 * @fires {CustomEvent} a11y:reset - Dispatched on `window` after the reset.
 *   `event.detail.settings` is the post-reset snapshot (all feature defaults).
 *
 * @example
 * document.getElementById('reset-btn').addEventListener('click', function () {
 *   AccessibilityWidget.getInstance().resetAll();
 * });
 */
Widget.prototype.resetAll = function () {
  // Deactivate all plugin-handled features (built-in + external) that are active
  var handlerIds = Object.keys(this._pluginHandlerMap);
  for (var hi = 0; hi < handlerIds.length; hi++) {
    this._callFeatureHandler(handlerIds[hi], false);
  }

  // Reset all body classes
  resetAllFeatures();

  // Reset state to defaults
  for (var i = 0; i < this._enabledFeatures.length; i++) {
    var f = this._enabledFeatures[i];
    this._settings[f.id] = f.default;

    // Update item DOM
    if (f.type === 'toggle') {
      this._updateItemState(f.id, false);
    }
  }

  // Reset range value displays
  var rangeKeys = Object.keys(this._rangeValueEls);
  for (var j = 0; j < rangeKeys.length; j++) {
    var rFeature = getFeature(rangeKeys[j]);
    this._rangeValueEls[rangeKeys[j]].textContent = String(rFeature ? rFeature.default : 0);
  }

  // Clear storage
  clearSettings();

  // Update toggle aria-label (count is now 0)
  this._updateToggleAriaLabel();

  // Announce reset to screen readers
  this._announce(this._t('resetConfirmation'));

  this._emit('a11y:reset', { settings: this.getSettings() });
};

// ---------------------------------------------------------------------------
// Public API: Language
// ---------------------------------------------------------------------------

/**
 * Switch the widget to a different language.
 *
 * Updates all visible UI strings and adjusts layout for RTL scripts.
 * The `lang` and `dir` attributes are scoped to the widget's own root
 * element — **the host page's `<html>` element is never modified**.
 *
 * No-op when `code` already matches the active language.
 *
 * After switching, the new language is persisted to localStorage so it
 * survives page reloads.
 *
 * @param {string} code - BCP-47 language code (e.g. `"en"`, `"he"`, `"ar"`).
 *   Must be a code that has been registered — either built-in or via
 *   `registerLanguage()`.  Unregistered codes fall back to English strings.
 * @fires {CustomEvent} a11y:langchange - Dispatched on `window` after the
 *   language is applied. `event.detail.language` is the new code.
 *
 * @example
 * widget.setLanguage('he'); // switch to Hebrew (RTL layout)
 * widget.setLanguage('en'); // switch back to English (LTR)
 */
Widget.prototype.setLanguage = function (code) {
  if (code === this._language) {
    return;
  }
  this._language = code;
  this._applyLanguage(code);
  this._saveState();
  this._emit('a11y:langchange', { language: code });
};

/**
 * Return the currently active language code.
 *
 * @returns {string} BCP-47 primary subtag, e.g. `"en"` or `"he"`.
 *
 * @example
 * var lang = widget.getLanguage(); // "en"
 */
Widget.prototype.getLanguage = function () {
  return this._language;
};

/**
 * Return an in-memory session usage report for analytics integration.
 *
 * @returns {Object|null} Report object, or null after destroy().
 */
Widget.prototype.getReport = function () {
  if (this._destroyed) { return null; }
  var featuresCopy = {};
  var ids = Object.keys(this._featureStats);
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    var s = this._featureStats[id];
    featuresCopy[id] = { enabled: s.enabled, toggleCount: s.toggleCount, lastActivated: s.lastActivated };
  }
  return {
    version: '2.6.0',
    session: {
      sessionId: this._sessionId,
      initTimestamp: this._initTimestamp,
      menuOpenCount: this._menuOpenCount,
      features: featuresCopy,
      language: this._language,
    },
    persistedSettings: this.getSettings(),
    enabledFeatureIds: this._enabledFeatures.map(function (f) { return f.id; }),
  };
};

// ---------------------------------------------------------------------------
// Public API: Lifecycle
// ---------------------------------------------------------------------------

/**
 * Remove the widget from the DOM and release all resources.
 *
 * Performs teardown in the following order:
 * 1. Dispatches `a11y:destroy` on `window` (before any DOM changes).
 * 2. Sets the internal `_destroyed` guard to prevent re-entry.
 * 3. Removes all DOM event listeners (toggle, panel, document-level).
 * 4. Deactivates Reading Guide (removes overlay element and mousemove listener).
 * 5. Deactivates Text-to-Speech (cancels speech and removes click listener).
 * 6. Resets all feature CSS classes on `document.body`.
 * 7. Restores the original `localStorage` storage key.
 * 8. Removes the widget root element from `document.body`.
 * 9. Nulls out all internal DOM references to aid garbage collection.
 *
 * **Safe to call multiple times** — subsequent calls after the first are
 * silently ignored.
 *
 * Prefer {@link AccessibilityWidget.destroy} over calling this method
 * directly so the singleton reference is also cleared.
 *
 * @fires {CustomEvent} a11y:destroy - Dispatched on `window` at step 1,
 *   before any teardown occurs. `event.detail` is an empty object.
 *
 * @example
 * // In a SPA route-change cleanup handler:
 * AccessibilityWidget.destroy();
 *
 * @example
 * // Calling directly on the instance (also clears the singleton ref):
 * var widget = AccessibilityWidget.init();
 * window.addEventListener('a11y:destroy', function () {
 *   console.log('Widget is being removed');
 * });
 * widget.destroy();
 */
Widget.prototype.destroy = function () {
  if (this._destroyed) {
    return;
  }
  this._emit('a11y:destroy', {});
  this._destroyed = true;
  this._detachEvents();

  // Deactivate all plugin-handled features (built-in + external)
  var dHandlerIds = Object.keys(this._pluginHandlerMap);
  for (var dhi = 0; dhi < dHandlerIds.length; dhi++) {
    this._callFeatureHandler(dHandlerIds[dhi], false);
  }

  // Call unmount() on external plugins so they can clean up their own DOM
  var dPlugins = Widget._externalPlugins;
  for (var dmp = 0; dmp < dPlugins.length; dmp++) {
    if (typeof dPlugins[dmp].unmount === 'function') {
      dPlugins[dmp].unmount(this);
    }
  }

  // Remove all feature classes from document.body
  resetAllFeatures();

  // Restore original storage key
  if (this._originalStorageKey) {
    setStorageKey(this._originalStorageKey);
  }

  // Remove the DOM node
  if (this._root && this._root.parentNode) {
    this._root.parentNode.removeChild(this._root);
  }

  // Remove injected color-blind SVG filters
  if (this._colorBlindSvgEl && this._colorBlindSvgEl.parentNode) {
    this._colorBlindSvgEl.parentNode.removeChild(this._colorBlindSvgEl);
  }

  // Remove dev audit markers from DOM
  if (this._devMode) {
    var marked = document.querySelectorAll('[data-a11y-audit]');
    for (var i = 0; i < marked.length; i++) {
      marked[i].classList.remove('a11y-dev-violation');
      marked[i].removeAttribute('data-a11y-audit');
    }
  }

  // Null out references
  this._root = null;
  this._toggleBtn = null;
  this._panel = null;
  this._closeBtn = null;
  this._contentEl = null;
  this._disclaimerEl = null;
  this._resetBtn = null;
  this._titleEl = null;
  this._menuItems = [];
  this._itemElements = {};
  this._rangeValueEls = {};
  this._langSelect = null;
  this._statementLinkEl = null;
  this._colorBlindSvgEl = null;
  this._zoomWarnEl = null;
  this._announceEl = null;
  this._dismissTooltip();
  this._tooltipEl = null;
  this._tooltipTimer = null;
  this._profilesSection = null;
  this._profileNameInput = null;
  this._profileListEl = null;
  this._presetsSection = null;
  this._positionSection = null;
  this._positionBtns = {};
  this._ttsControlsEl = null;
  this._ttsPauseBtn = null;
  this._ttsSpeedDisplay = null;
  this._ttsCurrentTarget = null;
  this._ttsOriginalHTML = null;
  this._devAuditBadgeEl = null;
  this._devAuditListEl = null;
  this._featureStats = null;
};

export default Widget;
