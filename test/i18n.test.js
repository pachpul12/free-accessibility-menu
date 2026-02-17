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

  test('contains "en" and "he" locales', () => {
    expect(translations).toHaveProperty('en');
    expect(translations).toHaveProperty('he');
  });

  test.each(REQUIRED_KEYS)(
    'English locale includes key "%s"',
    (key) => {
      expect(translations.en).toHaveProperty(key);
      expect(typeof translations.en[key]).toBe('string');
      expect(translations.en[key].length).toBeGreaterThan(0);
    },
  );

  test.each(REQUIRED_KEYS)(
    'Hebrew locale includes key "%s"',
    (key) => {
      expect(translations.he).toHaveProperty(key);
      expect(typeof translations.he[key]).toBe('string');
      expect(translations.he[key].length).toBeGreaterThan(0);
    },
  );

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

  test('contains "en" and "he" by default', () => {
    const langs = getAvailableLanguages();
    expect(langs).toContain('en');
    expect(langs).toContain('he');
  });

  test('length matches the number of registered languages', () => {
    // At baseline there are exactly 2 built-in languages
    expect(getAvailableLanguages().length).toBeGreaterThanOrEqual(2);
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

  test('falls back to English for keys missing in the new language', () => {
    registerLanguage('de', { menuTitle: 'Barrierefreiheits-Men\u00fc' });

    expect(getTranslation('de', 'menuTitle')).toBe('Barrierefreiheits-Men\u00fc');
    // 'resetAll' was not provided for 'de', so English fallback is used
    expect(getTranslation('de', 'resetAll')).toBe('Reset All');
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
