const fs = require('fs');
let content = fs.readFileSync('C:/projects/free-accessibility-menu/src/i18n.js', 'utf8');

// Group labels: [visual, content, navigation]
const groupLabels = {
  en: ['Visual', 'Content', 'Navigation'],
  he: ['\u05D7\u05D6\u05D5\u05EA\u05D9', '\u05EA\u05D5\u05DB\u05DF', '\u05E0\u05D9\u05D5\u05D5\u05D8'],
  zh: ['\u89C6\u89C9', '\u5185\u5BB9', '\u5BFC\u822A'],
  es: ['Visual', 'Contenido', 'Navegaci\u00F3n'],
  ar: ['\u0645\u0631\u0626\u064A', '\u0645\u062D\u062A\u0648\u0649', '\u062A\u0646\u0642\u0644'],
  pt: ['Visual', 'Conte\u00FAdo', 'Navega\u00E7\u00E3o'],
  fr: ['Visuel', 'Contenu', 'Navigation'],
  de: ['Visuell', 'Inhalt', 'Navigation'],
  ja: ['\u8996\u899A', '\u30B3\u30F3\u30C6\u30F3\u30C4', '\u30CA\u30D3\u30B2\u30FC\u30B7\u30E7\u30F3'],
  ru: ['\u0412\u0438\u0437\u0443\u0430\u043B\u044C\u043D\u044B\u0439', '\u041A\u043E\u043D\u0442\u0435\u043D\u0442', '\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F'],
  hi: ['\u0926\u0943\u0936\u094D\u092F', '\u0938\u093E\u092E\u0917\u094D\u0930\u0940', '\u0928\u0947\u0935\u093F\u0917\u0947\u0936\u0928'],
  bn: ['\u09A6\u09C3\u09B6\u09CD\u09AF', '\u09AC\u09BF\u09B7\u09AF\u09BC\u09AC\u09B8\u09CD\u09A4\u09C1', '\u09A8\u09C7\u09AD\u09BF\u0997\u09C7\u09B6\u09A8'],
  pa: ['\u0A26\u0A3F\u0A71\u0A16', '\u0A38\u0A2E\u0A31\u0A17\u0A30\u0A40', '\u0A28\u0A47\u0A35\u0A40\u0A17\u0A47\u0A38\u0A3C\u0A28'],
  id: ['Visual', 'Konten', 'Navigasi'],
  ur: ['\u0628\u0635\u0631\u06CC', '\u0645\u0648\u0627\u062F', '\u0646\u06CC\u0648\u06CC\u06AF\u06CC\u0634\u0646'],
  tr: ['G\u00F6rsel', '\u0130\u00E7erik', 'Gezinme'],
  vi: ['Tr\u1EF1c quan', 'N\u1ED9i dung', '\u0110i\u1EC1u h\u01B0\u1EDBng'],
  ko: ['\uc2dc\uac01', '\ucf58\ud150\uce20', '\ub124\ube44\uac8c\uc774\uc158'],
  it: ['Visivo', 'Contenuto', 'Navigazione'],
  fa: ['\u0628\u0635\u0631\u06CC', '\u0645\u062D\u062A\u0648\u0627', '\u0646\u0627\u0648\u0628\u0631\u06CC'],
  th: ['\u0E20\u0E32\u0E1E', '\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E2B\u0E32', '\u0E01\u0E32\u0E23\u0E19\u0E33\u0E17\u0E32\u0E07'],
  ta: ['\u0BAA\u0BBE\u0BB0\u0BCD\u0BB5\u0BC8', '\u0B89\u0BB3\u0BCD\u0BB3\u0B9F\u0B95\u0BAE\u0BCD', '\u0BB5\u0BB4\u0BBF\u0B9A\u0BC6\u0BB2\u0BB5\u0BC1'],
  mr: ['\u0926\u0943\u0936\u094D\u092F', '\u0938\u093E\u092E\u0917\u094D\u0930\u0940', '\u0928\u0947\u0935\u093F\u0917\u0947\u0936\u0928'],
  te: ['\u0C26\u0C43\u0C36\u0C4D\u0C2F\u0C2E\u0C3E\u0C28\u0C02', '\u0C35\u0C3F\u0C37\u0C2F\u0C02', '\u0C28\u0C3E\u0C35\u0C3F\u0C17\u0C47\u0C37\u0C28\u0C4D'],
  gu: ['\u0AA6\u0AC3\u0AB6\u0ACD\u0AAF', '\u0AB8\u0ABE\u0AAE\u0A97\u0ACD\u0AB0\u0AC0', '\u0AA8\u0AC7\u0AB5\u0ABF\u0A97\u0AC7\u0AB6\u0AA8'],
  pl: ['Wizualny', 'Tre\u015B\u0107', 'Nawigacja'],
  ms: ['Visual', 'Kandungan', 'Navigasi'],
  nl: ['Visueel', 'Inhoud', 'Navigatie'],
  tl: ['Visual', 'Nilalaman', 'Nabigasyon'],
  uk: ['\u0412\u0456\u0437\u0443\u0430\u043B\u044C\u043D\u0438\u0439', '\u0412\u043C\u0456\u0441\u0442', '\u041D\u0430\u0432\u0456\u0433\u0430\u0446\u0456\u044F'],
  sw: ['Muonekano', 'Maudhui', 'Urambazaji'],
  sv: ['Visuellt', 'Inneh\u00E5ll', 'Navigering'],
  da: ['Visuel', 'Indhold', 'Navigation'],
  ro: ['Vizual', 'Con\u021Binut', 'Navigare'],
  el: ['\u039F\u03C0\u03C4\u03B9\u03BA\u03CC', '\u03A0\u03B5\u03C1\u03B9\u03B5\u03C7\u03CC\u03BC\u03B5\u03BD\u03BF', '\u03A0\u03BB\u03BF\u03AE\u03B3\u03B7\u03C3\u03B7'],
  cs: ['Vizu\u00E1ln\u00ED', 'Obsah', 'Navigace'],
  hu: ['Vizu\u00E1lis', 'Tartalom', 'Navig\u00E1ci\u00F3'],
  kk: ['\u0412\u0438\u0437\u0443\u0430\u043B\u0434\u044B', '\u041C\u0430\u0437\u043C\u04B1\u043D', '\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F'],
  sr: ['\u0412\u0438\u0437\u0443\u0435\u043B\u043D\u043E', '\u0421\u0430\u0434\u0440\u0436\u0430\u0458', '\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u0458\u0430'],
  no: ['Visuell', 'Innhold', 'Navigering'],
};

// Insert after 'wordSpacing:' line in each language block (before 'resetAll:')
// For languages that don't have wordSpacing yet, insert before 'resetAll:'
const linesArr = content.split('\n');
const newLines = [];
let modified = 0;

for (let i = 0; i < linesArr.length; i++) {
  newLines.push(linesArr[i]);

  // Insert after wordSpacing line and before resetAll
  if (linesArr[i].trim().startsWith('wordSpacing:') &&
      i+1 < linesArr.length) {
    // Check if next meaningful line is resetAll or an action key
    let nextIdx = i+1;
    while (nextIdx < linesArr.length && linesArr[nextIdx].trim() === '') nextIdx++;
    // Insert before resetAll (which comes after wordSpacing or action keys)
    // Actually just insert right after wordSpacing and before action keys / resetAll
    // Find lang
    let lang = null;
    for (let j = i; j >= 0; j--) {
      const m = linesArr[j].match(/^  (\w+):/);
      if (m) { lang = m[1]; break; }
    }
    if (lang && groupLabels[lang]) {
      const G = groupLabels[lang];
      newLines.push("    visual: '" + G[0] + "',");
      newLines.push("    content: '" + G[1] + "',");
      newLines.push("    navigation: '" + G[2] + "',");
      modified++;
    }
  }
}

fs.writeFileSync('C:/projects/free-accessibility-menu/src/i18n.js', newLines.join('\n'), 'utf8');
console.log('Modified', modified, 'blocks');
