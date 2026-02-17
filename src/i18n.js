/**
 * Internationalization (i18n) module for the Accessibility Menu Widget.
 *
 * Provides translation strings for all UI labels, helper functions for
 * language detection, RTL support, and a registration mechanism for adding
 * new languages at runtime.
 *
 * @module i18n
 */

// ---------------------------------------------------------------------------
// Translation registry
// ---------------------------------------------------------------------------

/**
 * Built-in translations keyed by BCP-47 language code.
 * Each language object maps a translation key to a localised string.
 *
 * @type {Record<string, Record<string, string>>}
 */
const translations = {
  en: {
    menuTitle: 'Accessibility Menu',
    highContrast: 'High Contrast',
    darkMode: 'Dark Mode',
    fontSize: 'Font Size',
    increaseFontSize: 'Increase Font Size',
    decreaseFontSize: 'Decrease Font Size',
    resetFontSize: 'Reset Font Size',
    dyslexiaFont: 'Dyslexia Friendly Font',
    underlineLinks: 'Underline Links',
    focusOutline: 'Focus Outline',
    hideImages: 'Hide Images',
    textSpacing: 'Text Spacing',
    pauseAnimations: 'Pause Animations',
    largeCursor: 'Large Cursor',
    highlightHeadings: 'Highlight Headings',
    invertColors: 'Invert Colors',
    readingGuide: 'Reading Guide',
    textToSpeech: 'Text to Speech',
    resetAll: 'Reset All',
    closeMenu: 'Close Menu',
    language: 'Language',
    disclaimer:
      'This widget does not guarantee full accessibility compliance.',
  },

  he: {
    menuTitle: '\u05EA\u05E4\u05E8\u05D9\u05D8 \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA',
    highContrast: '\u05E0\u05D9\u05D2\u05D5\u05D3\u05D9\u05D5\u05EA \u05D2\u05D1\u05D5\u05D4\u05D4',
    darkMode: '\u05DE\u05E6\u05D1 \u05DB\u05D4\u05D4',
    fontSize: '\u05D2\u05D5\u05D3\u05DC \u05D2\u05D5\u05E4\u05DF',
    increaseFontSize: '\u05D4\u05D2\u05D3\u05DC \u05D2\u05D5\u05E4\u05DF',
    decreaseFontSize: '\u05D4\u05E7\u05D8\u05DF \u05D2\u05D5\u05E4\u05DF',
    resetFontSize: '\u05D0\u05E4\u05E1 \u05D2\u05D5\u05D3\u05DC \u05D2\u05D5\u05E4\u05DF',
    dyslexiaFont: '\u05D2\u05D5\u05E4\u05DF \u05D9\u05D3\u05D9\u05D3\u05D5\u05EA\u05D9 \u05DC\u05D3\u05D9\u05E1\u05DC\u05E7\u05E6\u05D9\u05D4',
    underlineLinks: '\u05E7\u05D5 \u05EA\u05D7\u05EA\u05D5\u05DF \u05DC\u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD',
    focusOutline: '\u05DE\u05E1\u05D2\u05E8\u05EA \u05DE\u05D9\u05E7\u05D5\u05D3',
    hideImages: '\u05D4\u05E1\u05EA\u05E8 \u05EA\u05DE\u05D5\u05E0\u05D5\u05EA',
    textSpacing: '\u05E8\u05D9\u05D5\u05D5\u05D7 \u05D8\u05E7\u05E1\u05D8',
    pauseAnimations: '\u05D4\u05E9\u05D4\u05D4 \u05D0\u05E0\u05D9\u05DE\u05E6\u05D9\u05D5\u05EA',
    largeCursor: '\u05E1\u05DE\u05DF \u05D2\u05D3\u05D5\u05DC',
    highlightHeadings: '\u05D4\u05D3\u05D2\u05E9 \u05DB\u05D5\u05EA\u05E8\u05D5\u05EA',
    invertColors: '\u05D4\u05D9\u05E4\u05D5\u05DA \u05E6\u05D1\u05E2\u05D9\u05DD',
    readingGuide: '\u05DE\u05D3\u05E8\u05D9\u05DA \u05E7\u05E8\u05D9\u05D0\u05D4',
    textToSpeech: '\u05D4\u05E7\u05E8\u05D0\u05D4 \u05D1\u05E7\u05D5\u05DC',
    resetAll: '\u05D0\u05E4\u05E1 \u05D4\u05DB\u05DC',
    closeMenu: '\u05E1\u05D2\u05D5\u05E8 \u05EA\u05E4\u05E8\u05D9\u05D8',
    language: '\u05E9\u05E4\u05D4',
    disclaimer:
      '\u05EA\u05D5\u05E1\u05E3 \u05D6\u05D4 \u05D0\u05D9\u05E0\u05D5 \u05DE\u05D1\u05D8\u05D9\u05D7 \u05E2\u05DE\u05D9\u05D3\u05D4 \u05DE\u05DC\u05D0\u05D4 \u05D1\u05EA\u05E7\u05E0\u05D9 \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA.',
  },
};

// ---------------------------------------------------------------------------
// RTL language codes
// ---------------------------------------------------------------------------

/**
 * Set of language codes whose scripts are written right-to-left.
 * Maintained as a Set for O(1) look-ups and easy expansion.
 *
 * @type {Set<string>}
 */
const RTL_LANGUAGES = new Set(['he', 'ar', 'fa']);

// ---------------------------------------------------------------------------
// Public API -- named exports
// ---------------------------------------------------------------------------

/**
 * Return the translated string for the given language and key.
 *
 * Falls back to English (`en`) when the requested language or key is not
 * found, and returns an empty string as a last resort so callers never
 * receive `undefined`.
 *
 * @param {string} lang - BCP-47 language code (e.g. "en", "he").
 * @param {string} key  - Translation key (e.g. "menuTitle").
 * @returns {string} The localised string, or the English fallback, or "".
 */
export function getTranslation(lang, key) {
  if (translations[lang] && translations[lang][key] !== undefined) {
    return translations[lang][key];
  }

  // Fallback to English
  if (translations.en && translations.en[key] !== undefined) {
    return translations.en[key];
  }

  return '';
}

/**
 * Return an array of all currently registered language codes.
 *
 * @returns {string[]} e.g. ["en", "he"]
 */
export function getAvailableLanguages() {
  return Object.keys(translations);
}

/**
 * Determine whether a language code represents a right-to-left script.
 *
 * @param {string} lang - BCP-47 language code.
 * @returns {boolean} `true` when the language is RTL.
 */
export function isRTL(lang) {
  return RTL_LANGUAGES.has(lang);
}

/**
 * Register (or overwrite) a full set of translations for a language.
 *
 * This allows consumers to add support for new locales at runtime without
 * modifying the source. The supplied object is merged into the registry so
 * that any missing keys will still fall back to the English defaults when
 * retrieved via `getTranslation`.
 *
 * @param {string} code          - BCP-47 language code (e.g. "fr", "de").
 * @param {Record<string, string>} newTranslations - Key/value pairs for
 *   the language. Keys should match those used in the built-in `en` locale.
 * @throws {Error} If `code` is not a non-empty string.
 * @throws {Error} If `newTranslations` is not a plain object.
 */
export function registerLanguage(code, newTranslations) {
  if (typeof code !== 'string' || code.length === 0) {
    throw new Error('Language code must be a non-empty string.');
  }

  if (
    newTranslations === null ||
    typeof newTranslations !== 'object' ||
    Array.isArray(newTranslations)
  ) {
    throw new Error('Translations must be a plain object.');
  }

  translations[code] = { ...translations[code], ...newTranslations };
}

// ---------------------------------------------------------------------------
// Default export -- the translations object itself
// ---------------------------------------------------------------------------

export default translations;
