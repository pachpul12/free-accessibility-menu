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
 * Return the feature definition for the given id, or `undefined` if not found.
 *
 * @param {string} featureId
 * @returns {FeatureDefinition|undefined}
 */
function getFeature(featureId) {
  return featureMap.get(featureId);
}

/**
 * Remove all font-size-level classes from `document.body`.
 * Font-size classes follow the pattern `a11y-font-{0..N}`.
 */
function removeFontSizeClasses() {
  const feature = featureMap.get('fontSize');
  if (!feature) {
    return;
  }
  for (let i = feature.min; i <= feature.max; i++) {
    document.body.classList.remove(feature.cssClass + '-' + i);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Apply a feature to the DOM based on its type and the supplied value.
 *
 * - For toggle features the class is added when `value` is truthy and
 *   removed when falsy.
 * - For the special `fontSize` range feature the previous font-size class
 *   is removed first and the new one (`a11y-font-{value}`) is applied
 *   (only when `value > 0`).
 *
 * @param {string} featureId - The feature identifier.
 * @param {boolean|number} value - The value to apply.
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
    removeFontSizeClasses();

    // Apply the new level class only when value is greater than the minimum
    const numericValue = Number(value);
    if (numericValue > feature.min) {
      document.body.classList.add(feature.cssClass + '-' + numericValue);
    }
    return;
  }
}

/**
 * Remove a feature from the DOM, restoring its default state.
 *
 * @param {string} featureId - The feature identifier.
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
    removeFontSizeClasses();
    return;
  }
}

/**
 * Remove all feature-related classes from `document.body`, resetting to
 * the default visual state.
 */
export function resetAllFeatures() {
  for (let i = 0; i < FEATURES.length; i++) {
    removeFeature(FEATURES[i].id);
  }
}

export { FEATURES, getFeature };
export default FEATURES;
