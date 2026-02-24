/**
 * Feature definitions and DOM application logic for the Accessibility Widget.
 *
 * Each feature describes a single accessibility enhancement that can be
 * toggled or adjusted by the user.  The module also provides helper
 * functions to apply, remove, and reset features on the document body.
 *
 * @module features
 */

// ---------------------------------------------------------------------------
// SVG icon strings (simple, clean, accessibility-related)
// ---------------------------------------------------------------------------

const ICONS = {
  highContrast:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z"/></svg>',

  darkMode:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>',

  dyslexiaFont:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',

  underlineLinks:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',

  focusOutline:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-dasharray="4 2"/><circle cx="12" cy="12" r="3"/></svg>',

  hideImages:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="1" y1="1" x2="23" y2="23"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',

  fontSize:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/><path d="M15 7V4"/><path d="M9 7V4"/></svg>',

  textSpacing:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10H3"/><path d="M21 6H3"/><path d="M21 14H3"/><path d="M21 18H3"/></svg>',

  pauseAnimations:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',

  largeCursor:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4l7 18 2.5-7.5L21 12z"/></svg>',

  highlightHeadings:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4v16"/><path d="M18 4v16"/><path d="M6 12h12"/></svg>',

  invertColors:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M12 2a10 10 0 0 0 0 20" fill="currentColor"/></svg>',

  readingGuide:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="10" width="20" height="4" rx="1"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',

  textToSpeech:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',

  focusMode:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M3 12h2M19 12h2M12 3v2M12 19v2"/><path d="M5.64 5.64l1.42 1.42M16.95 16.95l1.41 1.41M5.64 18.36l1.42-1.42M16.95 7.05l1.41-1.41"/></svg>',

  lineHeight:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/><polyline points="7 3 4 6 7 9"/><polyline points="7 15 4 18 7 21"/></svg>',

  letterSpacing:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/><polyline points="9 5 12 2 15 5"/><polyline points="9 19 12 22 15 19"/><line x1="12" y1="2" x2="12" y2="22"/></svg>',

  wordSpacing:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h6M14 6h6"/><path d="M4 12h6M14 12h6"/><line x1="11" y1="4" x2="11" y2="8"/><line x1="13" y1="4" x2="13" y2="8"/></svg>',

  deuteranopia:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><circle cx="8" cy="10" r="2" fill="currentColor"/><circle cx="16" cy="14" r="2" fill="currentColor"/></svg>',

  protanopia:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><circle cx="9" cy="12" r="2" fill="currentColor"/><circle cx="15" cy="12" r="2" fill="currentColor"/></svg>',

  tritanopia:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><circle cx="8" cy="14" r="2" fill="currentColor"/><circle cx="16" cy="10" r="2" fill="currentColor"/></svg>',

  reducedTransparency:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="8" height="12" rx="1" stroke-dasharray="3 2"/><rect x="13" y="6" width="8" height="12" rx="1"/></svg>',

  sensoryFriendly:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',

  readableFont:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',

  saturation:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/><path d="M12 2.69v13.62" stroke-dasharray="3 2"/></svg>',

  brightness:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',

  suppressNotifications:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',

  highlightHover:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 3h16v2H4z"/><path d="M4 7h16v2H4z"/><path d="M4 11h10v2H4z"/><path d="M14 14l4 7-1.5 1-2.5-4.5L11 21l-1-1 4-6z"/></svg>',
};

// ---------------------------------------------------------------------------
// Feature definitions
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} FeatureDefinition
 * @property {string}  id       - Unique identifier for the feature.
 * @property {string}  type     - 'toggle' for boolean features, 'range' for numeric.
 * @property {string}  cssClass - CSS class applied to `document.body`.
 * @property {*}       default  - Default value (false for toggles, 0 for ranges).
 * @property {string}  icon     - SVG markup for the feature icon.
 * @property {string}  group    - Logical grouping ('visual', 'content', 'navigation').
 * @property {number}  [min]    - Minimum value (range features only).
 * @property {number}  [max]    - Maximum value (range features only).
 * @property {number}  [step]   - Step increment (range features only).
 * @property {string[]} [conflictsWith] - IDs of mutually-exclusive features.
 */

/** @type {FeatureDefinition[]} */
const FEATURES = [
  {
    id: 'highContrast',
    type: 'toggle',
    cssClass: 'a11y-high-contrast',
    default: false,
    icon: ICONS.highContrast,
    group: 'visual',
  },
  {
    id: 'darkMode',
    type: 'toggle',
    cssClass: 'a11y-dark-mode',
    default: false,
    icon: ICONS.darkMode,
    group: 'visual',
  },
  {
    id: 'fontSize',
    type: 'range',
    cssClass: 'a11y-font',
    default: 0,
    icon: ICONS.fontSize,
    group: 'visual',
    min: 0,
    max: 5,
    step: 1,
  },
  {
    id: 'dyslexiaFont',
    type: 'toggle',
    cssClass: 'a11y-dyslexia-font',
    default: false,
    icon: ICONS.dyslexiaFont,
    group: 'content',
  },
  {
    id: 'underlineLinks',
    type: 'toggle',
    cssClass: 'a11y-underline-links',
    default: false,
    icon: ICONS.underlineLinks,
    group: 'content',
  },
  {
    id: 'hideImages',
    type: 'toggle',
    cssClass: 'a11y-hide-images',
    default: false,
    icon: ICONS.hideImages,
    group: 'content',
  },
  {
    id: 'focusOutline',
    type: 'toggle',
    cssClass: 'a11y-focus-outline',
    default: false,
    icon: ICONS.focusOutline,
    group: 'navigation',
  },
  {
    id: 'textSpacing',
    type: 'toggle',
    cssClass: 'a11y-text-spacing',
    default: false,
    icon: ICONS.textSpacing,
    group: 'content',
  },
  {
    id: 'pauseAnimations',
    type: 'toggle',
    cssClass: 'a11y-pause-animations',
    default: false,
    icon: ICONS.pauseAnimations,
    group: 'visual',
  },
  {
    id: 'largeCursor',
    type: 'toggle',
    cssClass: 'a11y-large-cursor',
    default: false,
    icon: ICONS.largeCursor,
    group: 'navigation',
  },
  {
    id: 'highlightHeadings',
    type: 'toggle',
    cssClass: 'a11y-highlight-headings',
    default: false,
    icon: ICONS.highlightHeadings,
    group: 'content',
  },
  {
    id: 'invertColors',
    type: 'toggle',
    cssClass: 'a11y-invert-colors',
    default: false,
    icon: ICONS.invertColors,
    group: 'visual',
  },
  {
    id: 'readingGuide',
    type: 'toggle',
    cssClass: 'a11y-reading-guide',
    default: false,
    icon: ICONS.readingGuide,
    group: 'navigation',
  },
  {
    id: 'textToSpeech',
    type: 'toggle',
    cssClass: 'a11y-text-to-speech',
    default: false,
    icon: ICONS.textToSpeech,
    group: 'navigation',
  },
  {
    id: 'focusMode',
    type: 'toggle',
    cssClass: 'a11y-focus-mode',
    default: false,
    icon: ICONS.focusMode,
    group: 'content',
  },
  {
    id: 'lineHeight',
    type: 'range',
    cssClass: 'a11y-line-height',
    default: 0,
    icon: ICONS.lineHeight,
    group: 'content',
    min: 0,
    max: 5,
    step: 1,
  },
  {
    id: 'letterSpacing',
    type: 'range',
    cssClass: 'a11y-letter-spacing',
    default: 0,
    icon: ICONS.letterSpacing,
    group: 'content',
    min: 0,
    max: 5,
    step: 1,
  },
  {
    id: 'wordSpacing',
    type: 'range',
    cssClass: 'a11y-word-spacing',
    default: 0,
    icon: ICONS.wordSpacing,
    group: 'content',
    min: 0,
    max: 5,
    step: 1,
  },
  {
    id: 'deuteranopia',
    type: 'toggle',
    cssClass: 'a11y-deuteranopia',
    default: false,
    icon: ICONS.deuteranopia,
    group: 'visual',
    conflictsWith: ['protanopia', 'tritanopia'],
  },
  {
    id: 'protanopia',
    type: 'toggle',
    cssClass: 'a11y-protanopia',
    default: false,
    icon: ICONS.protanopia,
    group: 'visual',
    conflictsWith: ['deuteranopia', 'tritanopia'],
  },
  {
    id: 'tritanopia',
    type: 'toggle',
    cssClass: 'a11y-tritanopia',
    default: false,
    icon: ICONS.tritanopia,
    group: 'visual',
    conflictsWith: ['deuteranopia', 'protanopia'],
  },
  {
    id: 'reducedTransparency',
    type: 'toggle',
    cssClass: 'a11y-reduced-transparency',
    default: false,
    icon: ICONS.reducedTransparency,
    group: 'visual',
  },
  {
    id: 'sensoryFriendly',
    type: 'toggle',
    cssClass: 'a11y-sensory-friendly',
    default: false,
    icon: ICONS.sensoryFriendly,
    group: 'content',
  },
  {
    id: 'readableFont',
    type: 'toggle',
    cssClass: 'a11y-readable-font',
    default: false,
    icon: ICONS.readableFont,
    group: 'content',
  },
  {
    id: 'saturation',
    type: 'range',
    cssClass: 'a11y-saturation',
    default: 0,
    icon: ICONS.saturation,
    group: 'visual',
    min: 0,
    max: 5,
    step: 1,
  },
  {
    id: 'brightness',
    type: 'range',
    cssClass: 'a11y-brightness',
    default: 0,
    icon: ICONS.brightness,
    group: 'visual',
    min: 0,
    max: 5,
    step: 1,
  },
  {
    id: 'suppressNotifications',
    type: 'toggle',
    cssClass: 'a11y-suppress-notifications',
    default: false,
    icon: ICONS.suppressNotifications,
    group: 'content',
  },
  {
    id: 'highlightHover',
    type: 'toggle',
    cssClass: 'a11y-highlight-hover',
    default: false,
    icon: ICONS.highlightHover,
    group: 'content',
  },
];

// ---------------------------------------------------------------------------
// Lookup map for O(1) feature retrieval by id
// ---------------------------------------------------------------------------

/** @type {Map<string, FeatureDefinition>} */
const featureMap = new Map();
for (let i = 0; i < FEATURES.length; i++) {
  featureMap.set(FEATURES[i].id, FEATURES[i]);
}

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

/**
 * Return the {@link FeatureDefinition} for the given feature ID.
 *
 * Performs an O(1) lookup via the internal `featureMap`.  Returns
 * `undefined` for unrecognised IDs so callers can guard with a simple
 * truthiness check.
 *
 * @param {string} featureId - One of the 14 built-in feature IDs
 *   (e.g. `"highContrast"`, `"fontSize"`, `"readingGuide"`).
 * @returns {FeatureDefinition|undefined}
 *
 * @example
 * var def = getFeature('fontSize');
 * // { id: 'fontSize', type: 'range', min: 0, max: 5, step: 1, ... }
 */
function getFeature(featureId) {
  return featureMap.get(featureId);
}

/**
 * Remove all level classes for a range feature from `document.body`
 * and `document.documentElement`.
 *
 * Level classes follow the pattern `{feature.cssClass}-{n}` where n
 * iterates from `feature.min` to `feature.max`.
 *
 * @param {FeatureDefinition} feature
 */
function removeRangeClasses(feature) {
  if (!feature) {
    return;
  }
  for (let i = feature.min; i <= feature.max; i++) {
    const cls = feature.cssClass + '-' + i;
    document.body.classList.remove(cls);
    document.documentElement.classList.remove(cls);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Apply a feature to the DOM based on its type and the supplied value.
 *
 * **Toggle features** (`type === 'toggle'`): adds the feature's `cssClass`
 * to `document.body` when `value` is truthy; removes it when falsy.
 *
 * **Range features** (`type === 'range'`, currently only `fontSize`):
 * removes all existing `a11y-font-{n}` classes, then adds
 * `a11y-font-{value}` on both `document.body` and `document.documentElement`
 * (only when `value > feature.min`).
 *
 * Unknown feature IDs are silently ignored.
 *
 * @param {string}         featureId - One of the 14 built-in feature IDs.
 * @param {boolean|number} value     - Value to apply.
 *
 * @example
 * applyFeature('highContrast', true);  // adds 'a11y-high-contrast' to body
 * applyFeature('highContrast', false); // removes it
 * applyFeature('fontSize', 3);         // adds 'a11y-font-3' to body + html
 * applyFeature('fontSize', 0);         // removes all font-size classes
 */
export function applyFeature(featureId, value) {
  const feature = getFeature(featureId);
  if (!feature) {
    return;
  }

  if (feature.type === 'toggle') {
    if (value) {
      document.body.classList.add(feature.cssClass);
    } else {
      document.body.classList.remove(feature.cssClass);
    }
    return;
  }

  if (feature.type === 'range') {
    // Remove all existing range-level classes for this feature
    removeRangeClasses(feature);

    // Apply the new level class only when value is greater than the minimum
    const numericValue = Number(value);
    if (numericValue > feature.min) {
      const cls = feature.cssClass + '-' + numericValue;
      document.body.classList.add(cls);
      document.documentElement.classList.add(cls);
    }
    return;
  }
}

/**
 * Remove a feature from the DOM, restoring its default (inactive) state.
 *
 * Equivalent to calling `applyFeature(featureId, false)` for toggle features
 * or `applyFeature(featureId, 0)` for range features.
 *
 * @param {string} featureId - One of the 14 built-in feature IDs.
 */
export function removeFeature(featureId) {
  const feature = getFeature(featureId);
  if (!feature) {
    return;
  }

  if (feature.type === 'toggle') {
    document.body.classList.remove(feature.cssClass);
    return;
  }

  if (feature.type === 'range') {
    removeRangeClasses(feature);
    return;
  }
}

/**
 * Remove all 14 feature-related classes from `document.body` in one pass,
 * restoring the page to its default visual state.
 *
 * Called internally by {@link Widget#resetAll} and {@link Widget#destroy}.
 * Safe to call even when no features are currently active.
 */
export function resetAllFeatures() {
  for (let i = 0; i < FEATURES.length; i++) {
    removeFeature(FEATURES[i].id);
  }
}

export { FEATURES, getFeature };
export default FEATURES;
