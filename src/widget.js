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
import { saveSettings, loadSettings, clearSettings, setStorageKey, getStorageKey, saveProfiles, loadProfiles } from './storage.js';
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

const TOGGLE_ICON_HOVER_PNG = 'data:image/png;base64,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';

const CLOSE_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

const MINUS_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/></svg>';

const PLUS_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';

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

  // Determine which features are enabled
  this._enabledFeatures = this._resolveEnabledFeatures(options.features);

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

  // -- Profiles section DOM refs --------------------------------------------
  this._profilesSection = null;
  this._profileNameInput = null;
  this._profileListEl = null;

  // -- Position section DOM refs --------------------------------------------
  this._positionSection = null;
  this._positionBtns = {};   // pos string -> <button> element

  // -- Reading Guide state ---------------------------------------------------
  this._readingGuideEl = null;
  this._handleReadingGuideMove = this._onReadingGuideMove.bind(this);

  // -- Text-to-Speech state --------------------------------------------------
  this._ttsEnabled = false;
  this._handleTTSClick = this._onTTSClick.bind(this);

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

  this._emit('a11y:init', { settings: this.getSettings() });
}

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
  if (!featureOptions) {
    return FEATURES.slice();
  }

  var result = [];
  for (var i = 0; i < FEATURES.length; i++) {
    var f = FEATURES[i];
    if (featureOptions[f.id] !== false) {
      result.push(f);
    }
  }
  return result;
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

    // Activate special features if persisted as active
    if (f.id === 'readingGuide' && this._settings[f.id]) {
      this._activateReadingGuide();
    }
    if (f.id === 'textToSpeech' && this._settings[f.id]) {
      this._activateTTS();
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
  this._root.setAttribute('data-position', this._position);

  // --- Toggle button -------------------------------------------------------
  var toggleAttrs = {
    'aria-haspopup': 'menu',
    'aria-expanded': 'false',
    'aria-label': this._t('menuTitle'),
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
  this._titleEl.textContent = this._t('menuTitle');
  header.appendChild(this._titleEl);

  this._closeBtn = createElement('button', 'a11y-widget__close', {
    'aria-label': this._t('closeMenu'),
  });
  this._closeBtn.appendChild(parseSVG(CLOSE_ICON_SVG));
  header.appendChild(this._closeBtn);

  this._panel.appendChild(header);

  // Content wrapper (the actual menu role container)
  this._contentEl = createElement('div', 'a11y-widget__content', {
    'role': 'menu',
    'aria-label': this._t('menuTitle'),
  });

  // Language section
  if (this._showLanguageSwitcher) {
    this._buildLanguageSection(this._contentEl);
  }

  // Feature sections, grouped
  var groups = getGroups(this._enabledFeatures);
  for (var g = 0; g < groups.length; g++) {
    this._buildGroupSection(groups[g], this._contentEl);
  }

  this._panel.appendChild(this._contentEl);

  // Profiles section (between content and footer)
  this._buildProfilesSection(this._panel);

  // Position switcher section
  this._buildPositionSection(this._panel);

  // Footer
  var footer = createElement('div', 'a11y-widget__footer');

  this._disclaimerEl = createElement('p', 'a11y-widget__disclaimer');
  this._disclaimerEl.textContent = this._t('disclaimer');
  footer.appendChild(this._disclaimerEl);

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

  var item = createElement('div', 'a11y-widget__item', {
    'role': 'menuitem',
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

  // Feature item (toggle)
  var item = this._findAncestorWithAttr(target, 'data-feature');
  if (item) {
    var fId = item.getAttribute('data-feature');
    var feature = getFeature(fId);
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

  applyFeature(featureId, newValue);
  this._updateItemState(featureId, newValue);

  // Mutual exclusivity: disable conflicting features when enabling this one
  if (newValue) {
    var def = getFeature(featureId);
    if (def && def.conflictsWith) {
      for (var c = 0; c < def.conflictsWith.length; c++) {
        var conflictId = def.conflictsWith[c];
        if (this._settings[conflictId]) {
          this._settings[conflictId] = false;
          applyFeature(conflictId, false);
          this._updateItemState(conflictId, false);
        }
      }
    }
  }

  // Special handling for Reading Guide
  if (featureId === 'readingGuide') {
    if (newValue) {
      this._activateReadingGuide();
    } else {
      this._deactivateReadingGuide();
    }
  }

  // Special handling for Text-to-Speech
  if (featureId === 'textToSpeech') {
    if (newValue) {
      this._activateTTS();
    } else {
      this._deactivateTTS();
    }
  }

  this._saveState();

  if (this._onToggle) {
    this._onToggle(featureId, newValue);
  }

  this._emit('a11y:toggle', { featureId: featureId, value: newValue, settings: this.getSettings() });
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
  this._titleEl.textContent = this._t('menuTitle');
  this._toggleBtn.setAttribute('aria-label', this._t('menuTitle'));
  this._contentEl.setAttribute('aria-label', this._t('menuTitle'));
  this._closeBtn.setAttribute('aria-label', this._t('closeMenu'));
  this._disclaimerEl.textContent = this._t('disclaimer');
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
};

/**
 * Deactivate the reading guide overlay.
 */
Widget.prototype._deactivateReadingGuide = function () {
  document.removeEventListener('mousemove', this._handleReadingGuideMove);
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
  if (this._readingGuideEl) {
    this._readingGuideEl.style.top = (e.clientY - 6) + 'px';
  }
};

// ---------------------------------------------------------------------------
// Internal: Text-to-Speech
// ---------------------------------------------------------------------------

/**
 * Activate text-to-speech mode (click-to-speak).
 */
Widget.prototype._activateTTS = function () {
  this._ttsEnabled = true;
  document.addEventListener('click', this._handleTTSClick);
};

/**
 * Deactivate text-to-speech mode.
 */
Widget.prototype._deactivateTTS = function () {
  this._ttsEnabled = false;
  document.removeEventListener('click', this._handleTTSClick);
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.cancel();
  }
  // Remove any speaking highlights
  var highlighted = document.querySelectorAll('.a11y-tts-speaking');
  for (var i = 0; i < highlighted.length; i++) {
    highlighted[i].classList.remove('a11y-tts-speaking');
  }
};

/**
 * Handle click events for text-to-speech: read aloud the clicked element's text.
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

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  // Remove previous highlights
  var prev = document.querySelectorAll('.a11y-tts-speaking');
  for (var i = 0; i < prev.length; i++) {
    prev[i].classList.remove('a11y-tts-speaking');
  }

  // Highlight the target element
  target.classList.add('a11y-tts-speaking');

  var utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = this._language;

  utterance.onend = function () {
    target.classList.remove('a11y-tts-speaking');
  };
  utterance.onerror = function () {
    target.classList.remove('a11y-tts-speaking');
  };

  speechSynthesis.speak(utterance);
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
  this._isOpen = true;
  this._root.classList.add(OPEN_MODIFIER);
  this._toggleBtn.setAttribute('aria-expanded', 'true');

  // Focus the first menu item
  if (this._menuItems.length > 0) {
    this._menuItems[0].focus();
  }

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
  var feature = getFeature(featureId);
  if (!feature) {
    return;
  }

  if (feature.type === 'toggle') {
    var newBool = !!value;
    if (!!this._settings[featureId] === newBool) {
      return;
    }
    this._settings[featureId] = newBool;
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

    if (featureId === 'readingGuide') {
      if (newBool) {
        this._activateReadingGuide();
      } else {
        this._deactivateReadingGuide();
      }
    }
    if (featureId === 'textToSpeech') {
      if (newBool) {
        this._activateTTS();
      } else {
        this._deactivateTTS();
      }
    }

    this._saveState();
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
    applyFeature(featureId, numVal);

    var valueEl = this._rangeValueEls[featureId];
    if (valueEl) {
      valueEl.textContent = String(numVal);
    }

    this._saveState();
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
  // Deactivate special features before resetting
  this._deactivateReadingGuide();
  this._deactivateTTS();

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

  // Clean up reading guide
  this._deactivateReadingGuide();

  // Clean up text-to-speech
  this._deactivateTTS();

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
  this._profilesSection = null;
  this._profileNameInput = null;
  this._profileListEl = null;
  this._positionSection = null;
  this._positionBtns = {};
};

export default Widget;
