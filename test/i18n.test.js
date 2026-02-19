/**
 * Unit tests for the i18n module.
 *
 * Covers:
 *  - Default translations object structure and content
 *  - getTranslation() with valid / invalid language and key combos
 *  - getAvailableLanguages() return value
 *  - isRTL() for known RTL and LTR codes
 *  - registerLanguage() -- adding, merging, and input validation
 */

import translations, {
  getTranslation,
  getAvailableLanguages,
  isRTL,
  registerLanguage,
} from '../src/i18n.js';

// ── Helper: all translation keys that every language must define ────────────
const REQUIRED_KEYS = [
  'nativeName',
  'menuTitle',
  'highContrast',
  'darkMode',
  'fontSize',
  'increaseFontSize',
  'decreaseFontSize',
  'resetFontSize',
  'dyslexiaFont',
  'underlineLinks',
  'focusOutline',
  'hideImages',
  'textSpacing',
  'pauseAnimations',
  'largeCursor',
  'highlightHeadings',
  'invertColors',
  'readingGuide',
  'textToSpeech',
  'resetAll',
  'closeMenu',
  'language',
  'disclaimer',
];

// ============================================================================
// Default export -- translations object
// ============================================================================

describe('translations (default export)', () => {
  test('is a plain object', () => {
    expect(typeof translations).toBe('object');
    expect(translations).not.toBeNull();
    expect(Array.isArray(translations)).toBe(false);
  });

  test('contains all 40 built-in locales', () => {
    ['en', 'he', 'zh', 'es', 'ar', 'pt', 'fr', 'de', 'ja', 'ru',
     'hi', 'bn', 'pa', 'id', 'ur', 'tr', 'vi', 'ko', 'it', 'fa',
     'th', 'ta', 'mr', 'te', 'gu', 'pl', 'ms', 'nl', 'tl', 'uk',
     'sw', 'sv', 'da', 'ro', 'el', 'cs', 'hu', 'kk', 'sr', 'no'].forEach(function (code) {
      expect(translations).toHaveProperty(code);
    });
  });

  // Verify every built-in locale has every required key
  const BUILT_IN_LOCALES = [
    'en', 'he', 'zh', 'es', 'ar', 'pt', 'fr', 'de', 'ja', 'ru',
    'hi', 'bn', 'pa', 'id', 'ur', 'tr', 'vi', 'ko', 'it', 'fa',
    'th', 'ta', 'mr', 'te', 'gu', 'pl', 'ms', 'nl', 'tl', 'uk',
    'sw', 'sv', 'da', 'ro', 'el', 'cs', 'hu', 'kk', 'sr', 'no',
  ];

  test.each(BUILT_IN_LOCALES)(
    '%s locale has all required keys with non-empty strings',
    (locale) => {
      REQUIRED_KEYS.forEach(function (key) {
        expect(translations[locale]).toHaveProperty(key);
        expect(typeof translations[locale][key]).toBe('string');
        expect(translations[locale][key].length).toBeGreaterThan(0);
      });
    },
  );

  // Spot-check menuTitle for each new built-in locale
  test('new locale menuTitles match specification', () => {
    expect(translations.zh.menuTitle).toBe('\u65E0\u969C\u788D\u83DC\u5355');
    expect(translations.es.menuTitle).toBe('Men\u00FA de accesibilidad');
    expect(translations.ar.menuTitle).toBe(
      '\u0642\u0627\u0626\u0645\u0629 \u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u0627\u0644\u0648\u0635\u0648\u0644',
    );
    expect(translations.pt.menuTitle).toBe('Menu de acessibilidade');
    expect(translations.fr.menuTitle).toBe('Menu d\u2019accessibilit\u00E9');
    expect(translations.de.menuTitle).toBe('Barrierefreiheitsmen\u00FC');
    expect(translations.ja.menuTitle).toBe(
      '\u30A2\u30AF\u30BB\u30B7\u30D3\u30EA\u30C6\u30A3\u30E1\u30CB\u30E5\u30FC',
    );
    expect(translations.ru.menuTitle).toBe(
      '\u041C\u0435\u043D\u044E \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0438',
    );
  });

  // Spot-check exact English values
  test('English values match specification', () => {
    expect(translations.en.menuTitle).toBe('Accessibility Menu');
    expect(translations.en.highContrast).toBe('High Contrast');
    expect(translations.en.darkMode).toBe('Dark Mode');
    expect(translations.en.fontSize).toBe('Font Size');
    expect(translations.en.increaseFontSize).toBe('Increase Font Size');
    expect(translations.en.decreaseFontSize).toBe('Decrease Font Size');
    expect(translations.en.resetFontSize).toBe('Reset Font Size');
    expect(translations.en.dyslexiaFont).toBe('Dyslexia Friendly Font');
    expect(translations.en.underlineLinks).toBe('Underline Links');
    expect(translations.en.focusOutline).toBe('Focus Outline');
    expect(translations.en.hideImages).toBe('Hide Images');
    expect(translations.en.resetAll).toBe('Reset All');
    expect(translations.en.closeMenu).toBe('Close Menu');
    expect(translations.en.language).toBe('Language');
    expect(translations.en.disclaimer).toBe(
      'This widget does not guarantee full accessibility compliance.',
    );
  });

  // Spot-check exact Hebrew values
  test('Hebrew values match specification', () => {
    expect(translations.he.menuTitle).toBe('\u05EA\u05E4\u05E8\u05D9\u05D8 \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA');
    expect(translations.he.highContrast).toBe('\u05E0\u05D9\u05D2\u05D5\u05D3\u05D9\u05D5\u05EA \u05D2\u05D1\u05D5\u05D4\u05D4');
    expect(translations.he.darkMode).toBe('\u05DE\u05E6\u05D1 \u05DB\u05D4\u05D4');
    expect(translations.he.fontSize).toBe('\u05D2\u05D5\u05D3\u05DC \u05D2\u05D5\u05E4\u05DF');
    expect(translations.he.increaseFontSize).toBe('\u05D4\u05D2\u05D3\u05DC \u05D2\u05D5\u05E4\u05DF');
    expect(translations.he.decreaseFontSize).toBe('\u05D4\u05E7\u05D8\u05DF \u05D2\u05D5\u05E4\u05DF');
    expect(translations.he.resetFontSize).toBe('\u05D0\u05E4\u05E1 \u05D2\u05D5\u05D3\u05DC \u05D2\u05D5\u05E4\u05DF');
    expect(translations.he.dyslexiaFont).toBe('\u05D2\u05D5\u05E4\u05DF \u05D9\u05D3\u05D9\u05D3\u05D5\u05EA\u05D9 \u05DC\u05D3\u05D9\u05E1\u05DC\u05E7\u05E6\u05D9\u05D4');
    expect(translations.he.underlineLinks).toBe('\u05E7\u05D5 \u05EA\u05D7\u05EA\u05D5\u05DF \u05DC\u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD');
    expect(translations.he.focusOutline).toBe('\u05DE\u05E1\u05D2\u05E8\u05EA \u05DE\u05D9\u05E7\u05D5\u05D3');
    expect(translations.he.hideImages).toBe('\u05D4\u05E1\u05EA\u05E8 \u05EA\u05DE\u05D5\u05E0\u05D5\u05EA');
    expect(translations.he.resetAll).toBe('\u05D0\u05E4\u05E1 \u05D4\u05DB\u05DC');
    expect(translations.he.closeMenu).toBe('\u05E1\u05D2\u05D5\u05E8 \u05EA\u05E4\u05E8\u05D9\u05D8');
    expect(translations.he.language).toBe('\u05E9\u05E4\u05D4');
    expect(translations.he.disclaimer).toBe(
      '\u05EA\u05D5\u05E1\u05E3 \u05D6\u05D4 \u05D0\u05D9\u05E0\u05D5 \u05DE\u05D1\u05D8\u05D9\u05D7 \u05E2\u05DE\u05D9\u05D3\u05D4 \u05DE\u05DC\u05D0\u05D4 \u05D1\u05EA\u05E7\u05E0\u05D9 \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA.',
    );
  });
});

// ============================================================================
// getTranslation()
// ============================================================================

describe('getTranslation(lang, key)', () => {
  test('returns correct English string for valid key', () => {
    expect(getTranslation('en', 'menuTitle')).toBe('Accessibility Menu');
    expect(getTranslation('en', 'resetAll')).toBe('Reset All');
  });

  test('returns correct Hebrew string for valid key', () => {
    expect(getTranslation('he', 'menuTitle')).toBe('\u05EA\u05E4\u05E8\u05D9\u05D8 \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA');
  });

  test('falls back to English when language exists but key does not', () => {
    expect(getTranslation('he', 'nonExistentKey')).toBe('');
    // English also lacks this key so the ultimate fallback is ''
  });

  test('falls back to English when language does not exist', () => {
    expect(getTranslation('zz', 'menuTitle')).toBe('Accessibility Menu');
  });

  test('returns empty string when neither language nor key exist', () => {
    expect(getTranslation('zz', 'bogus')).toBe('');
  });

  test('returns empty string for completely invalid arguments', () => {
    expect(getTranslation(undefined, undefined)).toBe('');
    expect(getTranslation(null, null)).toBe('');
  });
});

// ============================================================================
// getAvailableLanguages()
// ============================================================================

describe('getAvailableLanguages()', () => {
  test('returns an array', () => {
    expect(Array.isArray(getAvailableLanguages())).toBe(true);
  });

  test('contains all 40 built-in language codes', () => {
    const langs = getAvailableLanguages();
    ['en', 'he', 'zh', 'es', 'ar', 'pt', 'fr', 'de', 'ja', 'ru',
     'hi', 'bn', 'pa', 'id', 'ur', 'tr', 'vi', 'ko', 'it', 'fa',
     'th', 'ta', 'mr', 'te', 'gu', 'pl', 'ms', 'nl', 'tl', 'uk',
     'sw', 'sv', 'da', 'ro', 'el', 'cs', 'hu', 'kk', 'sr', 'no'].forEach(function (code) {
      expect(langs).toContain(code);
    });
  });

  test('length is at least 40 (all built-in languages)', () => {
    expect(getAvailableLanguages().length).toBeGreaterThanOrEqual(40);
  });
});

// ============================================================================
// isRTL()
// ============================================================================

describe('isRTL(lang)', () => {
  test('returns true for Hebrew (he)', () => {
    expect(isRTL('he')).toBe(true);
  });

  test('returns true for Arabic (ar)', () => {
    expect(isRTL('ar')).toBe(true);
  });

  test('returns true for Farsi / Persian (fa)', () => {
    expect(isRTL('fa')).toBe(true);
  });

  test('returns false for English (en)', () => {
    expect(isRTL('en')).toBe(false);
  });

  test('returns false for unknown language code', () => {
    expect(isRTL('zz')).toBe(false);
  });

  test('returns false for French (fr)', () => {
    expect(isRTL('fr')).toBe(false);
  });

  test('returns false for undefined / null input', () => {
    expect(isRTL(undefined)).toBe(false);
    expect(isRTL(null)).toBe(false);
  });
});

// ============================================================================
// registerLanguage()
// ============================================================================

describe('registerLanguage(code, translations)', () => {
  test('adds a new language that is then available', () => {
    registerLanguage('fr', {
      menuTitle: 'Menu d\'accessibilit\u00e9',
      resetAll: 'R\u00e9initialiser tout',
    });

    expect(getAvailableLanguages()).toContain('fr');
    expect(getTranslation('fr', 'menuTitle')).toBe('Menu d\'accessibilit\u00e9');
    expect(getTranslation('fr', 'resetAll')).toBe('R\u00e9initialiser tout');
  });

  test('falls back to English for keys missing in a partial registration', () => {
    // Use a non-built-in code so the fallback path is exercised cleanly
    registerLanguage('xx', { menuTitle: 'Test Menu' });

    expect(getTranslation('xx', 'menuTitle')).toBe('Test Menu');
    // 'resetAll' was not provided for 'xx', so English fallback is used
    expect(getTranslation('xx', 'resetAll')).toBe('Reset All');
  });

  test('merges into an existing language without losing prior keys', () => {
    registerLanguage('fr', { closeMenu: 'Fermer le menu' });

    // Previously registered key should still be present
    expect(getTranslation('fr', 'menuTitle')).toBe('Menu d\'accessibilit\u00e9');
    // Newly added key
    expect(getTranslation('fr', 'closeMenu')).toBe('Fermer le menu');
  });

  test('overwrites an existing key when re-registered', () => {
    registerLanguage('fr', { menuTitle: 'Accessibilit\u00e9' });
    expect(getTranslation('fr', 'menuTitle')).toBe('Accessibilit\u00e9');
  });

  test('throws when code is not a string', () => {
    expect(() => registerLanguage(123, {})).toThrow(
      'Language code must be a non-empty string.',
    );
    expect(() => registerLanguage(null, {})).toThrow(
      'Language code must be a non-empty string.',
    );
    expect(() => registerLanguage(undefined, {})).toThrow(
      'Language code must be a non-empty string.',
    );
  });

  test('throws when code is an empty string', () => {
    expect(() => registerLanguage('', {})).toThrow(
      'Language code must be a non-empty string.',
    );
  });

  test('throws when translations argument is not an object', () => {
    expect(() => registerLanguage('es', null)).toThrow(
      'Translations must be a plain object.',
    );
    expect(() => registerLanguage('es', 'string')).toThrow(
      'Translations must be a plain object.',
    );
    expect(() => registerLanguage('es', 42)).toThrow(
      'Translations must be a plain object.',
    );
    expect(() => registerLanguage('es', ['array'])).toThrow(
      'Translations must be a plain object.',
    );
  });

  test('does not throw for a valid empty object', () => {
    expect(() => registerLanguage('it', {})).not.toThrow();
    expect(getAvailableLanguages()).toContain('it');
  });
});
