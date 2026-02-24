const fs = require('fs');
let content = fs.readFileSync('C:/projects/free-accessibility-menu/src/i18n.js', 'utf8');

// [deuteranopia, protanopia, tritanopia]
const cbLabels = {
  en: ['Deuteranopia (Green-Blind)', 'Protanopia (Red-Blind)', 'Tritanopia (Blue-Blind)'],
  he: ['\u05D3\u05D9\u05D9\u05D8\u05E8\u05E0\u05D5\u05E4\u05D9\u05D4 (\u05E2\u05D9\u05D5\u05D5\u05E8 \u05D9\u05E8\u05D5\u05E7)', '\u05E4\u05E8\u05D5\u05D8\u05E0\u05D5\u05E4\u05D9\u05D4 (\u05E2\u05D9\u05D5\u05D5\u05E8 \u05D0\u05D3\u05D5\u05DD)', '\u05D8\u05E8\u05D9\u05D8\u05E0\u05D5\u05E4\u05D9\u05D4 (\u05E2\u05D9\u05D5\u05D5\u05E8 \u05DB\u05D7\u05D5\u05DC)'],
  zh: ['\u7EFF\u8272\u76F2', '\u7EA2\u8272\u76F2', '\u84DD\u8272\u76F2'],
  es: ['Deuteranopia (ceguera verde)', 'Protanopia (ceguera roja)', 'Tritanopia (ceguera azul)'],
  ar: ['\u0639\u0645\u0649 \u0627\u0644\u0623\u062E\u0636\u0631', '\u0639\u0645\u0649 \u0627\u0644\u0623\u062D\u0645\u0631', '\u0639\u0645\u0649 \u0627\u0644\u0623\u0632\u0631\u0642'],
  pt: ['Deuteranopia (cegueira verde)', 'Protanopia (cegueira vermelha)', 'Tritanopia (cegueira azul)'],
  fr: ['Dcut\u00E9ranopie (daltonisme vert)', 'Protanopie (daltonisme rouge)', 'Tritanopie (daltonisme bleu)'],
  de: ['Deuteranopie (Gr\u00FCnblindheit)', 'Protanopie (Rotblindheit)', 'Tritanopie (Blaubl indheit)'],
  ja: ['\u7DD1\u8272\u76F2 (Deuteranopia)', '\u8D64\u8272\u76F2 (Protanopia)', '\u9752\u8272\u76F2 (Tritanopia)'],
  ru: ['\u0414\u0435\u0439\u0442\u0435\u0440\u0430\u043D\u043E\u043F\u0438\u044F', '\u041F\u0440\u043E\u0442\u0430\u043D\u043E\u043F\u0438\u044F', '\u0422\u0440\u0438\u0442\u0430\u043D\u043E\u043F\u0438\u044F'],
  hi: ['\u0939\u0930\u093E \u0930\u0902\u0917\u093E\u0902\u0927\u0924\u093E', '\u0932\u093E\u0932 \u0930\u0902\u0917\u093E\u0902\u0927\u0924\u093E', '\u0928\u0940\u0932\u093E \u0930\u0902\u0917\u093E\u0902\u0927\u0924\u093E'],
  bn: ['\u09B8\u09AC\u09C1\u099C \u09AC\u09B0\u09CD\u09A3\u09BE\u09A8\u09CD\u09A7', '\u09B2\u09BE\u09B2 \u09AC\u09B0\u09CD\u09A3\u09BE\u09A8\u09CD\u09A7', '\u09A8\u09C0\u09B2 \u09AC\u09B0\u09CD\u09A3\u09BE\u09A8\u09CD\u09A7'],
  pa: ['\u0A39\u0A30\u0A47 \u0A30\u0A70\u0A17 \u0A05\u0A70\u0A27\u0A32\u0A3E\u0A2A\u0A23', '\u0A32\u0A3E\u0A32 \u0A30\u0A70\u0A17 \u0A05\u0A70\u0A27\u0A32\u0A3E\u0A2A\u0A23', '\u0A28\u0A40\u0A32\u0A3E \u0A30\u0A70\u0A17 \u0A05\u0A70\u0A27\u0A32\u0A3E\u0A2A\u0A23'],
  id: ['Deuteranopia (buta hijau)', 'Protanopia (buta merah)', 'Tritanopia (buta biru)'],
  ur: ['\u0633\u0628\u0632 \u0631\u0646\u06AF \u0627\u0646\u062F\u06BE\u0627 \u067E\u0646', '\u0633\u0631\u062E \u0631\u0646\u06AF \u0627\u0646\u062F\u06BE\u0627 \u067E\u0646', '\u0646\u06CC\u0644\u0627 \u0631\u0646\u06AF \u0627\u0646\u062F\u06BE\u0627 \u067E\u0646'],
  tr: ['Deuteranopi (ye\u015Fil k\u00F6rl\u00FC\u011F\u00FC)', 'Protanopi (k\u0131rm\u0131z\u0131 k\u00F6rl\u00FC\u011F\u00FC)', 'Tritanopi (mavi k\u00F6rl\u00FC\u011F\u00FC)'],
  vi: ['M\u00F9 xanh l\u00E1', 'M\u00F9 \u0111\u1ECF', 'M\u00F9 xanh da tr\u1EDDi'],
  ko: ['\uB179\uC0C9 \uC77C\uC0C9\uC131 \uC2DC\uAC01', '\uBE68\uAC04\uC0C9 \uC77C\uC0C9\uC131 \uC2DC\uAC01', '\uD30C\uB780\uC0C9 \uC77C\uC0C9\uC131 \uC2DC\uAC01'],
  it: ['Deuteranopia (cecit\u00E0 verde)', 'Protanopia (cecit\u00E0 rossa)', 'Tritanopia (cecit\u00E0 blu)'],
  fa: ['\u06A9\u0648\u0631\u06CC \u0633\u0628\u0632', '\u06A9\u0648\u0631\u06CC \u0642\u0631\u0645\u0632', '\u06A9\u0648\u0631\u06CC \u0622\u0628\u06CC'],
  th: ['\u0E15\u0E32\u0E1A\u0E2D\u0E14\u0E2A\u0E35\u0E40\u0E02\u0E35\u0E22\u0E27', '\u0E15\u0E32\u0E1A\u0E2D\u0E14\u0E2A\u0E35\u0E41\u0E14\u0E07', '\u0E15\u0E32\u0E1A\u0E2D\u0E14\u0E2A\u0E35\u0E19\u0E49\u0E33\u0E40\u0E07\u0E34\u0E19'],
  ta: ['Deuteranopia', 'Protanopia', 'Tritanopia'],
  mr: ['\u0939\u093F\u0930\u0935\u0947 \u0930\u0902\u0917\u093E\u0902\u0927\u0924\u093E', '\u0932\u093E\u0932 \u0930\u0902\u0917\u093E\u0902\u0927\u0924\u093E', '\u0928\u093F\u0933\u0947 \u0930\u0902\u0917\u093E\u0902\u0927\u0924\u093E'],
  te: ['\u0C06\u0C15\u0C41 \u0C2A\u0C1A\u0C4D\u0C1A\u0C26\u0C28\u0C02', '\u0C0E\u0C30\u0C41\u0C2A\u0C41 \u0C28\u0C47\u0C24\u0C4D\u0C30\u0C3E\u0C02\u0C27\u0C2E\u0C41', '\u0C28\u0C40\u0C32\u0C02 \u0C28\u0C47\u0C24\u0C4D\u0C30\u0C3E\u0C02\u0C27\u0C2E\u0C41'],
  gu: ['\u0AB2\u0AC0\u0AB2\u0ACB \u0AB0\u0A82\u0A97\u0A85\u0A82\u0AA7\u0AA4\u0ABE', '\u0AB2\u0ABE\u0AB2 \u0AB0\u0A82\u0A97\u0A85\u0A82\u0AA7\u0AA4\u0ABE', '\u0AA8\u0AC0\u0AB2\u0ACB \u0AB0\u0A82\u0A97\u0A85\u0A82\u0AA7\u0AA4\u0ABE'],
  pl: ['Deuteranopia (niewidomo\u015B\u0107 zielona)', 'Protanopia (niewidomo\u015B\u0107 czerwona)', 'Tritanopia (niewidomo\u015B\u0107 niebieska)'],
  ms: ['Deuteranopia (buta hijau)', 'Protanopia (buta merah)', 'Tritanopia (buta biru)'],
  nl: ['Deuteranopie (groen-blind)', 'Protanopie (rood-blind)', 'Tritanopie (blauw-blind)'],
  tl: ['Deuteranopia (bulag sa berde)', 'Protanopia (bulag sa pula)', 'Tritanopia (bulag sa asul)'],
  uk: ['\u0414\u0435\u0439\u0442\u0435\u0440\u0430\u043D\u043E\u043F\u0456\u044F', '\u041F\u0440\u043E\u0442\u0430\u043D\u043E\u043F\u0456\u044F', '\u0422\u0440\u0438\u0442\u0430\u043D\u043E\u043F\u0456\u044F'],
  sw: ['Upofu wa kijani', 'Upofu wa nyekundu', 'Upofu wa bluu'],
  sv: ['Deuteranopi (gr\u00F6nblindhet)', 'Protanopi (r\u00F6dblindhet)', 'Tritanopi (bl\u00E5blindhet)'],
  da: ['Deuteranopi (gr\u00F8nblindhed)', 'Protanopi (r\u00F8dblindhed)', 'Tritanopi (bl\u00E5blindhed)'],
  ro: ['Deuteranopie (orbire verde)', 'Protanopie (orbire ro\u015Fie)', 'Tritanopie (orbire albastr\u0103)'],
  el: ['\u0394\u03B5\u03C5\u03C4\u03B5\u03C1\u03B1\u03BD\u03C9\u03C0\u03AF\u03B1', '\u03A0\u03C1\u03C9\u03C4\u03B1\u03BD\u03C9\u03C0\u03AF\u03B1', '\u03A4\u03C1\u03B9\u03C4\u03B1\u03BD\u03C9\u03C0\u03AF\u03B1'],
  cs: ['Deuteranopie (zelen\u00E1 slepota)', 'Protanopie (\u010Derven\u00E1 slepota)', 'Tritanopie (modr\u00E1 slepota)'],
  hu: ['Deuteranopia (z\u00F6ldvakság)', 'Protanopia (pirosvaság)', 'Tritanopia (k\u00E9kvakság)'],
  kk: ['\u0416\u0430\u0441\u044B\u043B \u0442\u04AF\u0441\u0442\u0456\u043A', '\u049B\u044B\u0437\u044B\u043B \u0442\u04AF\u0441\u0442\u0456\u043A', '\u041A\u04A9\u043A \u0442\u04AF\u0441\u0442\u0456\u043A'],
  sr: ['\u0414\u0435\u0443\u0442\u0435\u0440\u0430\u043D\u043E\u043F\u0438\u0458\u0430', '\u041F\u0440\u043E\u0442\u0430\u043D\u043E\u043F\u0438\u0458\u0430', '\u0422\u0440\u0438\u0442\u0430\u043D\u043E\u043F\u0438\u0458\u0430'],
  no: ['Deuteranopi (gr\u00F8nnblindhet)', 'Protanopi (r\u00F8dblindhet)', 'Tritanopi (bl\u00E5blindhet)'],
};

// Insert after 'navigation:' line and before 'resetAll:'
const linesArr = content.split('\n');
const newLines = [];
let modified = 0;

for (let i = 0; i < linesArr.length; i++) {
  newLines.push(linesArr[i]);

  if (linesArr[i].trim().startsWith('navigation:') &&
      i+1 < linesArr.length && linesArr[i+1].trim().startsWith('resetAll:')) {
    let lang = null;
    for (let j = i; j >= 0; j--) {
      const m = linesArr[j].match(/^  (\w+):/);
      if (m) { lang = m[1]; break; }
    }
    if (lang && cbLabels[lang]) {
      const C = cbLabels[lang];
      newLines.push("    deuteranopia: '" + C[0] + "',");
      newLines.push("    protanopia: '" + C[1] + "',");
      newLines.push("    tritanopia: '" + C[2] + "',");
      modified++;
    }
  }
}

fs.writeFileSync('C:/projects/free-accessibility-menu/src/i18n.js', newLines.join('\n'), 'utf8');
console.log('Modified', modified, 'blocks');
