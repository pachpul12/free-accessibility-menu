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
import { saveSettings, loadSettings, clearSettings, setStorageKey, getStorageKey } from './storage.js';
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

// ---------------------------------------------------------------------------
// Widget class
// ---------------------------------------------------------------------------

/**
 * @class Widget
 *
 * Encapsulates the entire accessibility menu lifecycle: DOM creation,
 * event binding, state management, i18n, and public API.
 */
function Widget(options) {
  options = options || {};

  // -- Configuration --------------------------------------------------------
  this._language = options.defaultLanguage || 'en';
  this._onToggle = typeof options.onToggle === 'function' ? options.onToggle : null;
  this._onOpenMenu = typeof options.onOpenMenu === 'function' ? options.onOpenMenu : null;
  this._onCloseMenu = typeof options.onCloseMenu === 'function' ? options.onCloseMenu : null;
  this._position = options.position || 'bottom-right';

  // Determine which features are enabled
  this._enabledFeatures = this._resolveEnabledFeatures(options.features);

  // Save original storage key and override if provided
  this._originalStorageKey = getStorageKey();
  if (options.storageKey) {
    setStorageKey(options.storageKey);
  }

  // -- State ----------------------------------------------------------------
  this._settings = {};
  this._isOpen = false;
  this._destroyed = false;

  // Save original document lang/dir so we can restore on destroy
  this._originalLang = document.documentElement.getAttribute('lang');
  this._originalDir = document.documentElement.getAttribute('dir');

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
  this._toggleBtn = createElement('button', 'a11y-widget__toggle', {
    'aria-haspopup': 'menu',
    'aria-expanded': 'false',
    'aria-label': this._t('menuTitle'),
    'aria-controls': 'a11y-widget-panel',
  });
  var toggleIcon = document.createElement('img');
  toggleIcon.src = TOGGLE_ICON_PNG;
  toggleIcon.alt = '';
  toggleIcon.setAttribute('aria-hidden', 'true');
  toggleIcon.width = 28;
  toggleIcon.height = 28;
  this._toggleBtn.appendChild(toggleIcon);

  // Preload hover image
  var hoverPreload = new Image();
  hoverPreload.src = TOGGLE_ICON_HOVER_PNG;

  this._toggleBtn.addEventListener('mouseenter', function () {
    toggleIcon.src = TOGGLE_ICON_HOVER_PNG;
  });
  this._toggleBtn.addEventListener('mouseleave', function () {
    toggleIcon.src = TOGGLE_ICON_PNG;
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
  this._buildLanguageSection(this._contentEl);

  // Feature sections, grouped
  var groups = getGroups(this._enabledFeatures);
  for (var g = 0; g < groups.length; g++) {
    this._buildGroupSection(groups[g], this._contentEl);
  }

  this._panel.appendChild(this._contentEl);

  // Footer
  var footer = createElement('div', 'a11y-widget__footer');

  this._disclaimerEl = createElement('p', 'a11y-widget__disclaimer');
  this._disclaimerEl.textContent = this._t('disclaimer');
  footer.appendChild(this._disclaimerEl);

  this._resetBtn = createElement('button', 'a11y-widget__reset');
  this._resetBtn.textContent = this._t('resetAll');
  footer.appendChild(this._resetBtn);

  this._panel.appendChild(footer);
  this._root.appendChild(this._panel);

  // Append to body
  document.body.appendChild(this._root);
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
Widget.prototype._buildGroupSection = function (groupName, parent) {
  var section = createElement('div', 'a11y-widget__section', {
    'role': 'group',
    'aria-label': capitalise(groupName),
  });

  var title = createElement('div', 'a11y-widget__section-title', {
    'role': 'presentation',
  });
  title.textContent = capitalise(groupName);
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
    // Font-size controls
    var controls = createElement('div', 'a11y-widget__font-controls');

    var minusBtn = createElement('button', 'a11y-widget__font-btn', {
      'data-action': 'decrease',
      'data-feature': feature.id,
      'aria-label': this._t('decreaseFontSize'),
      'type': 'button',
    });
    minusBtn.appendChild(parseSVG(MINUS_ICON_SVG));

    var valueSpan = createElement('span', 'a11y-widget__font-value');
    valueSpan.textContent = String(currentValue);
    valueSpan.setAttribute('aria-live', 'polite');
    this._rangeValueEls[feature.id] = valueSpan;

    var plusBtn = createElement('button', 'a11y-widget__font-btn', {
      'data-action': 'increase',
      'data-feature': feature.id,
      'aria-label': this._t('increaseFontSize'),
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

  // Update document-level attributes
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');

  // Update widget RTL modifier
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

  // Update font control labels
  var decreaseBtns = this._root.querySelectorAll('[data-action="decrease"]');
  for (var d = 0; d < decreaseBtns.length; d++) {
    decreaseBtns[d].setAttribute('aria-label', this._t('decreaseFontSize'));
  }
  var increaseBtns = this._root.querySelectorAll('[data-action="increase"]');
  for (var u = 0; u < increaseBtns.length; u++) {
    increaseBtns[u].setAttribute('aria-label', this._t('increaseFontSize'));
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
 * Open the accessibility menu panel and move focus to the first item.
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
};

/**
 * Close the accessibility menu panel.
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
};

/**
 * Toggle the menu open/closed.
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
 * Return a shallow copy of the current settings object.
 *
 * @returns {Record<string, *>}
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
 * Reset all features to their defaults, clear persisted settings, and
 * update the UI.
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
};

// ---------------------------------------------------------------------------
// Public API: Language
// ---------------------------------------------------------------------------

/**
 * Switch the widget and document language.
 *
 * @param {string} code - BCP-47 language code (e.g. "en", "he").
 */
Widget.prototype.setLanguage = function (code) {
  if (code === this._language) {
    return;
  }
  this._language = code;
  this._applyLanguage(code);
  this._saveState();
};

// ---------------------------------------------------------------------------
// Public API: Lifecycle
// ---------------------------------------------------------------------------

/**
 * Remove the widget from the DOM and clean up all event listeners.
 * After calling `destroy()`, the instance should not be reused.
 */
Widget.prototype.destroy = function () {
  if (this._destroyed) {
    return;
  }
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

  // Restore original document lang/dir
  if (this._originalLang !== null) {
    document.documentElement.setAttribute('lang', this._originalLang);
  } else {
    document.documentElement.removeAttribute('lang');
  }
  if (this._originalDir !== null) {
    document.documentElement.setAttribute('dir', this._originalDir);
  } else {
    document.documentElement.removeAttribute('dir');
  }

  // Remove the DOM node
  if (this._root && this._root.parentNode) {
    this._root.parentNode.removeChild(this._root);
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
};

export default Widget;
