const fs = require('fs');
let content = fs.readFileSync('C:/projects/free-accessibility-menu/src/i18n.js', 'utf8');

const labels = {
  en: ['Line Height', 'Letter Spacing', 'Word Spacing'],
  he: ['\u05D2\u05D5\u05D1\u05D4 \u05E9\u05D5\u05E8\u05D4', '\u05DE\u05E8\u05D5\u05D5\u05D7 \u05D0\u05D5\u05EA\u05D9\u05D5\u05EA', '\u05DE\u05E8\u05D5\u05D5\u05D7 \u05DE\u05D9\u05DC\u05D9\u05DD'],
  zh: ['\u884C\u9AD8', '\u5B57\u95F4\u8DDD', '\u5B57\u8BCD\u95F4\u8DDD'],
  es: ['Altura de l\u00EDnea', 'Espacio entre letras', 'Espacio entre palabras'],
  ar: ['\u0627\u0631\u062A\u0641\u0627\u0639 \u0627\u0644\u062E\u0637', '\u062A\u0628\u0627\u0639\u062F \u0627\u0644\u062D\u0631\u0648\u0641', '\u062A\u0628\u0627\u0639\u062F \u0627\u0644\u0643\u0644\u0645\u0627\u062A'],
  pt: ['Altura da linha', 'Espa\u00E7amento de letras', 'Espa\u00E7amento de palavras'],
  fr: ['Interligne', 'Espacement des lettres', 'Espacement des mots'],
  de: ['Zeilenabstand', 'Buchstabenabstand', 'Wortabstand'],
  ja: ['\u884C\u306E\u9AD8\u3055', '\u6587\u5B57\u9593\u9694', '\u5358\u8A9E\u9593\u9694'],
  ru: ['\u0412\u044B\u0441\u043E\u0442\u0430 \u0441\u0442\u0440\u043E\u043A\u0438', '\u041C\u0435\u0436\u0431\u0443\u043A\u0432\u0435\u043D\u043D\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B', '\u041C\u0435\u0436\u0441\u043B\u043E\u0432\u043D\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B'],
  hi: ['\u0932\u093E\u0907\u0928 \u0915\u0940 \u0909\u0902\u091A\u093E\u0908', '\u0905\u0915\u094D\u0937\u0930 \u0905\u0902\u0924\u0930\u093E\u0932', '\u0936\u092C\u094D\u0926 \u0905\u0902\u0924\u0930\u093E\u0932'],
  bn: ['\u09B2\u09BE\u0987\u09A8\u09C7\u09B0 \u0989\u099A\u09CD\u099A\u09A4\u09BE', '\u0985\u0995\u09CD\u09B7\u09B0\u09C7\u09B0 \u09AC\u09CD\u09AF\u09AC\u09A7\u09BE\u09A8', '\u09B6\u09AC\u09CD\u09A6\u09C7\u09B0 \u09AC\u09CD\u09AF\u09AC\u09A7\u09BE\u09A8'],
  pa: ['\u0A32\u0A3E\u0A08\u0A28 \u0A26\u0A40 \u0A09\u0A1A\u0A3E\u0A08', '\u0A05\u0A71\u0A16\u0A30 \u0A26\u0A42\u0A30\u0A40', '\u0A38\u0A3C\u0A2C\u0A26 \u0A26\u0A42\u0A30\u0A40'],
  id: ['Tinggi Baris', 'Jarak Huruf', 'Jarak Kata'],
  ur: ['\u0644\u0627\u0626\u0646 \u06A9\u06CC \u0627\u0648\u0646\u0686\u0627\u0626\u06CC', '\u062D\u0631\u0641 \u06A9\u0627 \u0641\u0627\u0635\u0644\u06C1', '\u0644\u0641\u0638 \u06A9\u0627 \u0641\u0627\u0635\u0644\u06C1'],
  tr: ['Sat\u0131r Y\u00FCksekli\u011Fi', 'Harf Aral\u0131\u011F\u0131', 'Kelime Aral\u0131\u011F\u0131'],
  vi: ['Chi\u1EC1u cao d\u00F2ng', 'Kho\u1EA3ng c\u00E1ch ch\u1EEF', 'Kho\u1EA3ng c\u00E1ch t\u1EEB'],
  ko: ['\uC904 \uB192\uC774', '\uc790\uac04', '\ub2e8\uc5b4 \uac04\uaca9'],
  it: ['Altezza riga', 'Spaziatura lettere', 'Spaziatura parole'],
  fa: ['\u0627\u0631\u062A\u0641\u0627\u0639 \u062E\u0637', '\u0641\u0627\u0635\u0644\u0647 \u062D\u0631\u0648\u0641', '\u0641\u0627\u0635\u0644\u0647 \u06A9\u0644\u0645\u0627\u062A'],
  th: ['\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E39\u0E07\u0E1A\u0E23\u0E23\u0E17\u0E31\u0E14', '\u0E23\u0E30\u0E22\u0E30\u0E2B\u0E48\u0E32\u0E07\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23', '\u0E23\u0E30\u0E22\u0E30\u0E2B\u0E48\u0E32\u0E07\u0E04\u0E33'],
  ta: ['\u0BB5\u0BB0\u0BBF \u0B89\u0BAF\u0BB0\u0BAE\u0BCD', '\u0B8E\u0BB4\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1 \u0B87\u0B9F\u0BC8\u0BB5\u0BC6\u0BB3\u0BBF', '\u0B9A\u0BCA\u0BB2\u0BCD \u0B87\u0B9F\u0BC8\u0BB5\u0BC6\u0BB3\u0BBF'],
  mr: ['\u0913\u0933\u0940\u091A\u0940 \u0909\u0902\u091A\u0940', '\u0905\u0915\u094D\u0937\u0930 \u0905\u0902\u0924\u0930', '\u0936\u092C\u094D\u0926 \u0905\u0902\u0924\u0930'],
  te: ['\u0C32\u0C48\u0C28\u0C4D \u0C39\u0C48\u0C1F\u0C4D', '\u0C05\u0C15\u0C4D\u0C37\u0C30 \u0C05\u0C02\u0C24\u0C30\u0C02', '\u0C2A\u0C26\u0C02 \u0C05\u0C02\u0C24\u0C30\u0C02'],
  gu: ['\u0AB2\u0ABE\u0A87\u0AA8 \u0A8A\u0A82\u0A9A\u0ABE\u0A88', '\u0A85\u0A95\u0ACD\u0AB7\u0AB0 \u0A85\u0A82\u0AA4\u0AB0', '\u0AB6\u0AAC\u0ACD\u0AA6 \u0A85\u0A82\u0AA4\u0AB0'],
  pl: ['Wysoko\u015B\u0107 linii', 'Odst\u0119p liter', 'Odst\u0119p s\u0142\u00F3w'],
  ms: ['Tinggi Baris', 'Jarak Huruf', 'Jarak Perkataan'],
  nl: ['Regelhoogte', 'Letterafstand', 'Woordafstand'],
  tl: ['Taas ng Linya', 'Espasyo ng Titik', 'Espasyo ng Salita'],
  uk: ['\u0412\u0438\u0441\u043E\u0442\u0430 \u0440\u044F\u0434\u043A\u0430', '\u0412\u0456\u0434\u0441\u0442\u0430\u043D\u044C \u043C\u0456\u0436 \u043B\u0456\u0442\u0435\u0440\u0430\u043C\u0438', '\u0412\u0456\u0434\u0441\u0442\u0430\u043D\u044C \u043C\u0456\u0436 \u0441\u043B\u043E\u0432\u0430\u043C\u0438'],
  sw: ['Urefu wa Mstari', 'Nafasi ya Herufi', 'Nafasi ya Maneno'],
  sv: ['Radh\u00F6jd', 'Bokstavsavst\u00E5nd', 'Ordavst\u00E5nd'],
  da: ['Linjeafstand', 'Bogstavafstand', 'Ordafstand'],
  ro: ['\u00CEnăl\u021Bime linie', 'Spa\u021Biere litere', 'Spa\u021Biere cuvinte'],
  el: ['\u038D\u03C8\u03BF\u03C2 \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE\u03C2', '\u0394\u03B9\u03B1\u03C3\u03C4\u03BF\u03AF\u03C7\u03B9\u03C3\u03B7', '\u0391\u03BD\u03B1\u03BB\u03BF\u03B3\u03AF\u03B1 \u03BB\u03AD\u03BE\u03B5\u03C9\u03BD'],
  cs: ['V\u00FD\u0161ka \u0159\u00E1dku', 'Mezery mezi p\u00EDsmeny', 'Mezery mezi slovy'],
  hu: ['Sorm\u00E1k', 'Bet\u0171k\u00F6z', 'Sz\u00F3k\u00F6z'],
  kk: ['\u0416\u043E\u043B \u0431\u0438\u0456\u043A\u0442\u0456\u0433\u0456', '\u04D8\u0440\u0456\u043F \u0430\u0440\u0430\u043B\u044B\u0493\u044B', '\u0421\u04E9\u0437\u0434\u0435\u0440 \u0430\u0440\u0430\u043B\u044B\u0493\u044B'],
  sr: ['\u0412\u0438\u0441\u0438\u043D\u0430 \u0440\u0435\u0434\u0430', '\u0420\u0430\u0437\u043C\u0430\u043A \u0441\u043B\u043E\u0432\u0430', '\u0420\u0430\u0437\u043C\u0430\u043A \u0440\u0435\u0447\u0438'],
  no: ['Linjeh\u00F8yde', 'Bokstavavstand', 'Ordavstand'],
};

const actionsEN = ['Increase Line Height','Decrease Line Height','Increase Letter Spacing','Decrease Letter Spacing','Increase Word Spacing','Decrease Word Spacing'];
const actionsHE = ['\u05D4\u05D2\u05D3\u05DC \u05D2\u05D5\u05D1\u05D4 \u05E9\u05D5\u05E8\u05D4','\u05D4\u05E7\u05D8\u05DF \u05D2\u05D5\u05D1\u05D4 \u05E9\u05D5\u05E8\u05D4','\u05D4\u05D2\u05D3\u05DC \u05DE\u05E8\u05D5\u05D5\u05D7 \u05D0\u05D5\u05EA\u05D9\u05D5\u05EA','\u05D4\u05E7\u05D8\u05DF \u05DE\u05E8\u05D5\u05D5\u05D7 \u05D0\u05D5\u05EA\u05D9\u05D5\u05EA','\u05D4\u05D2\u05D3\u05DC \u05DE\u05E8\u05D5\u05D5\u05D7 \u05DE\u05D9\u05DC\u05D9\u05DD','\u05D4\u05E7\u05D8\u05DF \u05DE\u05E8\u05D5\u05D5\u05D7 \u05DE\u05D9\u05DC\u05D9\u05DD'];
const actionKeys = ['increaseLineHeight','decreaseLineHeight','increaseLetterSpacing','decreaseLetterSpacing','increaseWordSpacing','decreaseWordSpacing'];

const linesArr = content.split('\n');
const newLines = [];
let modified = 0;

for (let i = 0; i < linesArr.length; i++) {
  newLines.push(linesArr[i]);

  if (linesArr[i].trim().startsWith('focusMode:') &&
      i+1 < linesArr.length && linesArr[i+1].trim().startsWith('resetAll:')) {
    let lang = null;
    for (let j = i; j >= 0; j--) {
      const m = linesArr[j].match(/^  (\w+):/);
      if (m) { lang = m[1]; break; }
    }
    if (lang && labels[lang]) {
      const L = labels[lang];
      newLines.push("    lineHeight: '" + L[0] + "',");
      newLines.push("    letterSpacing: '" + L[1] + "',");
      newLines.push("    wordSpacing: '" + L[2] + "',");
      const actions = lang === 'en' ? actionsEN : (lang === 'he' ? actionsHE : null);
      if (actions) {
        for (let k=0; k<actionKeys.length; k++) {
          newLines.push('    ' + actionKeys[k] + ": '" + actions[k] + "',");
        }
      }
      modified++;
    }
  }
}

fs.writeFileSync('C:/projects/free-accessibility-menu/src/i18n.js', newLines.join('\n'), 'utf8');
console.log('Modified', modified, 'blocks');
