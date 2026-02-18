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

  zh: {
    menuTitle: '\u65E0\u969C\u788D\u83DC\u5355',
    highContrast: '\u9AD8\u5BF9\u6BD4\u5EA6',
    darkMode: '\u6DF1\u8272\u6A21\u5F0F',
    fontSize: '\u5B57\u4F53\u5927\u5C0F',
    increaseFontSize: '\u589E\u5927\u5B57\u4F53',
    decreaseFontSize: '\u51CF\u5C0F\u5B57\u4F53',
    resetFontSize: '\u91CD\u7F6E\u5B57\u4F53\u5927\u5C0F',
    dyslexiaFont: '\u9605\u8BFB\u969C\u788D\u53CB\u597D\u5B57\u4F53',
    underlineLinks: '\u94FE\u63A5\u4E0B\u5212\u7EBF',
    focusOutline: '\u7126\u70B9\u8F6E\u5ED3',
    hideImages: '\u9690\u85CF\u56FE\u7247',
    textSpacing: '\u6587\u5B57\u95F4\u8DDD',
    pauseAnimations: '\u6682\u505C\u52A8\u753B',
    largeCursor: '\u5927\u5149\u6807',
    highlightHeadings: '\u9AD8\u4EAE\u6807\u9898',
    invertColors: '\u53CD\u8F6C\u989C\u8272',
    readingGuide: '\u9605\u8BFB\u5F15\u5BFC',
    textToSpeech: '\u6587\u5B57\u8F6C\u8BED\u97F3',
    resetAll: '\u91CD\u7F6E\u5168\u90E8',
    closeMenu: '\u5173\u95ED\u83DC\u5355',
    language: '\u8BED\u8A00',
    disclaimer:
      '\u6B64\u5C0F\u7EC4\u4EF6\u4E0D\u4FDD\u8BC1\u5B8C\u5168\u7B26\u5408\u65E0\u969C\u788D\u6807\u51C6\u3002',
  },

  es: {
    menuTitle: 'Men\u00FA de accesibilidad',
    highContrast: 'Alto contraste',
    darkMode: 'Modo oscuro',
    fontSize: 'Tama\u00F1o de fuente',
    increaseFontSize: 'Aumentar fuente',
    decreaseFontSize: 'Reducir fuente',
    resetFontSize: 'Restablecer fuente',
    dyslexiaFont: 'Fuente para dislexia',
    underlineLinks: 'Subrayar enlaces',
    focusOutline: 'Contorno de foco',
    hideImages: 'Ocultar im\u00E1genes',
    textSpacing: 'Espaciado de texto',
    pauseAnimations: 'Pausar animaciones',
    largeCursor: 'Cursor grande',
    highlightHeadings: 'Resaltar encabezados',
    invertColors: 'Invertir colores',
    readingGuide: 'Gu\u00EDa de lectura',
    textToSpeech: 'Texto a voz',
    resetAll: 'Restablecer todo',
    closeMenu: 'Cerrar men\u00FA',
    language: 'Idioma',
    disclaimer:
      'Este widget no garantiza plena conformidad con la accesibilidad.',
  },

  ar: {
    menuTitle: '\u0642\u0627\u0626\u0645\u0629 \u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u0627\u0644\u0648\u0635\u0648\u0644',
    highContrast: '\u062A\u0628\u0627\u064A\u0646 \u0639\u0627\u0644\u0650',
    darkMode: '\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u062F\u0627\u0643\u0646',
    fontSize: '\u062D\u062C\u0645 \u0627\u0644\u062E\u0637',
    increaseFontSize: '\u062A\u0643\u0628\u064A\u0631 \u0627\u0644\u062E\u0637',
    decreaseFontSize: '\u062A\u0635\u063A\u064A\u0631 \u0627\u0644\u062E\u0637',
    resetFontSize: '\u0625\u0639\u0627\u062F\u0629 \u0636\u0628\u0637 \u062D\u062C\u0645 \u0627\u0644\u062E\u0637',
    dyslexiaFont: '\u062E\u0637 \u0635\u062F\u064A\u0642 \u0644\u0639\u0633\u0631 \u0627\u0644\u0642\u0631\u0627\u0621\u0629',
    underlineLinks: '\u062A\u0633\u0637\u064A\u0631 \u0627\u0644\u0631\u0648\u0627\u0628\u0637',
    focusOutline: '\u0625\u0637\u0627\u0631 \u0627\u0644\u062A\u0631\u0643\u064A\u0632',
    hideImages: '\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0635\u0648\u0631',
    textSpacing: '\u062A\u0628\u0627\u0639\u062F \u0627\u0644\u0646\u0635',
    pauseAnimations: '\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u062D\u0631\u0643\u0627\u062A',
    largeCursor: '\u0645\u0624\u0634\u0631 \u0643\u0628\u064A\u0631',
    highlightHeadings: '\u062A\u0645\u064A\u064A\u0632 \u0627\u0644\u0639\u0646\u0627\u0648\u064A\u0646',
    invertColors: '\u0639\u0643\u0633 \u0627\u0644\u0623\u0644\u0648\u0627\u0646',
    readingGuide: '\u062F\u0644\u064A\u0644 \u0627\u0644\u0642\u0631\u0627\u0621\u0629',
    textToSpeech: '\u062A\u062D\u0648\u064A\u0644 \u0627\u0644\u0646\u0635 \u0625\u0644\u0649 \u0643\u0644\u0627\u0645',
    resetAll: '\u0625\u0639\u0627\u062F\u0629 \u0636\u0628\u0637 \u0627\u0644\u0643\u0644',
    closeMenu: '\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0642\u0627\u0626\u0645\u0629',
    language: '\u0627\u0644\u0644\u063A\u0629',
    disclaimer:
      '\u0647\u0630\u0647 \u0627\u0644\u0623\u062F\u0627\u0629 \u0644\u0627 \u062A\u0636\u0645\u0646 \u0627\u0644\u0627\u0645\u062A\u062B\u0627\u0644 \u0627\u0644\u0643\u0627\u0645\u0644 \u0644\u0645\u0639\u0627\u064A\u064A\u0631 \u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u0627\u0644\u0648\u0635\u0648\u0644.',
  },

  pt: {
    menuTitle: 'Menu de acessibilidade',
    highContrast: 'Alto contraste',
    darkMode: 'Modo escuro',
    fontSize: 'Tamanho da fonte',
    increaseFontSize: 'Aumentar fonte',
    decreaseFontSize: 'Diminuir fonte',
    resetFontSize: 'Redefinir fonte',
    dyslexiaFont: 'Fonte para dislexia',
    underlineLinks: 'Sublinhar links',
    focusOutline: 'Contorno de foco',
    hideImages: 'Ocultar imagens',
    textSpacing: 'Espa\u00E7amento de texto',
    pauseAnimations: 'Pausar anima\u00E7\u00F5es',
    largeCursor: 'Cursor grande',
    highlightHeadings: 'Destacar cabe\u00E7alhos',
    invertColors: 'Inverter cores',
    readingGuide: 'Guia de leitura',
    textToSpeech: 'Texto para fala',
    resetAll: 'Redefinir tudo',
    closeMenu: 'Fechar menu',
    language: 'Idioma',
    disclaimer:
      'Este widget n\u00E3o garante conformidade total com acessibilidade.',
  },

  fr: {
    menuTitle: 'Menu d\u2019accessibilit\u00E9',
    highContrast: 'Contraste \u00E9lev\u00E9',
    darkMode: 'Mode sombre',
    fontSize: 'Taille de police',
    increaseFontSize: 'Augmenter la police',
    decreaseFontSize: 'R\u00E9duire la police',
    resetFontSize: 'R\u00E9initialiser la police',
    dyslexiaFont: 'Police pour dyslexiques',
    underlineLinks: 'Souligner les liens',
    focusOutline: 'Contour de focus',
    hideImages: 'Masquer les images',
    textSpacing: 'Espacement du texte',
    pauseAnimations: 'Mettre en pause les animations',
    largeCursor: 'Grand curseur',
    highlightHeadings: 'Surligner les titres',
    invertColors: 'Inverser les couleurs',
    readingGuide: 'Guide de lecture',
    textToSpeech: 'Synth\u00E8se vocale',
    resetAll: 'R\u00E9initialiser tout',
    closeMenu: 'Fermer le menu',
    language: 'Langue',
    disclaimer:
      'Ce widget ne garantit pas une conformit\u00E9 totale en mati\u00E8re d\u2019accessibilit\u00E9.',
  },

  de: {
    menuTitle: 'Barrierefreiheitsmen\u00FC',
    highContrast: 'Hoher Kontrast',
    darkMode: 'Dunkelmodus',
    fontSize: 'Schriftgr\u00F6\u00DFe',
    increaseFontSize: 'Schrift vergr\u00F6\u00DFern',
    decreaseFontSize: 'Schrift verkleinern',
    resetFontSize: 'Schriftgr\u00F6\u00DFe zur\u00FCcksetzen',
    dyslexiaFont: 'Schrift f\u00FCr Legasthenie',
    underlineLinks: 'Links unterstreichen',
    focusOutline: 'Fokusumrandung',
    hideImages: 'Bilder ausblenden',
    textSpacing: 'Textabstand',
    pauseAnimations: 'Animationen anhalten',
    largeCursor: 'Gro\u00DFer Cursor',
    highlightHeadings: '\u00DCberschriften hervorheben',
    invertColors: 'Farben invertieren',
    readingGuide: 'Lesehilfe',
    textToSpeech: 'Text zu Sprache',
    resetAll: 'Alles zur\u00FCcksetzen',
    closeMenu: 'Men\u00FC schlie\u00DFen',
    language: 'Sprache',
    disclaimer:
      'Dieses Widget garantiert keine vollst\u00E4ndige Barrierefreiheits-Konformit\u00E4t.',
  },

  ja: {
    menuTitle: '\u30A2\u30AF\u30BB\u30B7\u30D3\u30EA\u30C6\u30A3\u30E1\u30CB\u30E5\u30FC',
    highContrast: '\u9AD8\u30B3\u30F3\u30C8\u30E9\u30B9\u30C8',
    darkMode: '\u30C0\u30FC\u30AF\u30E2\u30FC\u30C9',
    fontSize: '\u30D5\u30A9\u30F3\u30C8\u30B5\u30A4\u30BA',
    increaseFontSize: '\u30D5\u30A9\u30F3\u30C8\u3092\u5927\u304D\u304F',
    decreaseFontSize: '\u30D5\u30A9\u30F3\u30C8\u3092\u5C0F\u3055\u304F',
    resetFontSize: '\u30D5\u30A9\u30F3\u30C8\u30B5\u30A4\u30BA\u3092\u30EA\u30BB\u30C3\u30C8',
    dyslexiaFont: '\u30C7\u30A3\u30B9\u30EC\u30AF\u30B7\u30A2\u5BFE\u5FDC\u30D5\u30A9\u30F3\u30C8',
    underlineLinks: '\u30EA\u30F3\u30AF\u306B\u4E0B\u7DDA',
    focusOutline: '\u30D5\u30A9\u30FC\u30AB\u30B9\u679A',
    hideImages: '\u753B\u50CF\u3092\u975E\u8868\u793A',
    textSpacing: '\u6587\u5B57\u9593\u9694',
    pauseAnimations: '\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u3092\u505C\u6B62',
    largeCursor: '\u5927\u304D\u3044\u30AB\u30FC\u30BD\u30EB',
    highlightHeadings: '\u898B\u51FA\u3057\u3092\u5F37\u8ABF',
    invertColors: '\u8272\u3092\u53CD\u8EE2',
    readingGuide: '\u8AAD\u66F8\u30AC\u30A4\u30C9',
    textToSpeech: '\u30C6\u30AD\u30B9\u30C8\u8AAD\u307F\u4E0A\u3052',
    resetAll: '\u3059\u3079\u3066\u30EA\u30BB\u30C3\u30C8',
    closeMenu: '\u30E1\u30CB\u30E5\u30FC\u3092\u9589\u3058\u308B',
    language: '\u8A00\u8A9E',
    disclaimer:
      '\u3053\u306E\u30A6\u30A3\u30B8\u30A7\u30C3\u30C8\u306F\u5B8C\u5168\u306A\u30A2\u30AF\u30BB\u30B7\u30D3\u30EA\u30C6\u30A3\u6E96\u62E0\u3092\u4FDD\u8A3C\u3057\u307E\u305B\u3093\u3002',
  },

  ru: {
    menuTitle: '\u041C\u0435\u043D\u044E \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0438',
    highContrast: '\u0412\u044B\u0441\u043E\u043A\u0438\u0439 \u043A\u043E\u043D\u0442\u0440\u0430\u0441\u0442',
    darkMode: '\u0422\u0451\u043C\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C',
    fontSize: '\u0420\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430',
    increaseFontSize: '\u0423\u0432\u0435\u043B\u0438\u0447\u0438\u0442\u044C \u0448\u0440\u0438\u0444\u0442',
    decreaseFontSize: '\u0423\u043C\u0435\u043D\u044C\u0448\u0438\u0442\u044C \u0448\u0440\u0438\u0444\u0442',
    resetFontSize: '\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0440\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430',
    dyslexiaFont: '\u0428\u0440\u0438\u0444\u0442 \u0434\u043B\u044F \u0434\u0438\u0441\u043B\u0435\u043A\u0441\u0438\u0438',
    underlineLinks: '\u041F\u043E\u0434\u0447\u0435\u0440\u043A\u043D\u0443\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0438',
    focusOutline: '\u041A\u043E\u043D\u0442\u0443\u0440 \u0444\u043E\u043A\u0443\u0441\u0430',
    hideImages: '\u0421\u043A\u0440\u044B\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F',
    textSpacing: '\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0442\u0435\u043A\u0441\u0442\u0430',
    pauseAnimations: '\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0430\u043D\u0438\u043C\u0430\u0446\u0438\u044E',
    largeCursor: '\u0411\u043E\u043B\u044C\u0448\u043E\u0439 \u043A\u0443\u0440\u0441\u043E\u0440',
    highlightHeadings: '\u0412\u044B\u0434\u0435\u043B\u0438\u0442\u044C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0438',
    invertColors: '\u0418\u043D\u0432\u0435\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0446\u0432\u0435\u0442\u0430',
    readingGuide: '\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u044F\u044E\u0449\u0430\u044F \u0447\u0442\u0435\u043D\u0438\u044F',
    textToSpeech: '\u0422\u0435\u043A\u0441\u0442 \u0432 \u0440\u0435\u0447\u044C',
    resetAll: '\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0432\u0441\u0451',
    closeMenu: '\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E',
    language: '\u042F\u0437\u044B\u043A',
    disclaimer:
      '\u042D\u0442\u043E\u0442 \u0432\u0438\u0434\u0436\u0435\u0442 \u043D\u0435 \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u0440\u0443\u0435\u0442 \u043F\u043E\u043B\u043D\u043E\u0433\u043E \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u044F \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u0430\u043C \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0438.',
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
