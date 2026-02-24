'use strict';
/**
 * Injects v2.6.0 i18n keys (highlightHover, ttsPause, ttsResume, ttsSpeed,
 * ttsSlower, ttsFaster) into every language block in src/i18n.js that is
 * missing them.  Inserts before the resetAll line (present in all 40 blocks).
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'i18n.js');

// New translations keyed by BCP-47 language code
const NEW_KEYS = {
  zh: {
    highlightHover: '\u60AC\u505C\u9AD8\u4EAE',
    ttsPause: '\u6682\u505C\u670D\u8BFB',
    ttsResume: '\u7EE7\u7EED\u670D\u8BFB',
    ttsSpeed: '\u670D\u8BFB\u901F\u5EA6',
    ttsSlower: '\u66F4\u6162',
    ttsFaster: '\u66F4\u5FEB',
  },
  es: {
    highlightHover: 'Resaltar al pasar',
    ttsPause: 'Pausar lectura',
    ttsResume: 'Reanudar lectura',
    ttsSpeed: 'Velocidad de lectura',
    ttsSlower: 'M\xE1s lento',
    ttsFaster: 'M\xE1s r\xE1pido',
  },
  ar: {
    highlightHover: '\u062A\u0645\u064A\u064A\u0632 \u0639\u0646\u062F \u0627\u0644\u062A\u062D\u0648\u064A\u0645',
    ttsPause: '\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u0642\u0631\u0627\u0621\u0629',
    ttsResume: '\u0627\u0633\u062A\u0626\u0646\u0627\u0641 \u0627\u0644\u0642\u0631\u0627\u0621\u0629',
    ttsSpeed: '\u0633\u0631\u0639\u0629 \u0627\u0644\u0642\u0631\u0627\u0621\u0629',
    ttsSlower: '\u0623\u0628\u0637\u0623',
    ttsFaster: '\u0623\u0633\u0631\u0639',
  },
  pt: {
    highlightHover: 'Destacar ao passar',
    ttsPause: 'Pausar leitura',
    ttsResume: 'Retomar leitura',
    ttsSpeed: 'Velocidade de leitura',
    ttsSlower: 'Mais devagar',
    ttsFaster: 'Mais r\xE1pido',
  },
  fr: {
    highlightHover: 'Surligner au survol',
    ttsPause: 'Pause lecture',
    ttsResume: 'Reprendre la lecture',
    ttsSpeed: 'Vitesse de lecture',
    ttsSlower: 'Plus lent',
    ttsFaster: 'Plus rapide',
  },
  de: {
    highlightHover: 'Hervorheben beim Hovern',
    ttsPause: 'Lesen pausieren',
    ttsResume: 'Lesen fortsetzen',
    ttsSpeed: 'Lesegeschwindigkeit',
    ttsSlower: 'Langsamer',
    ttsFaster: 'Schneller',
  },
  ja: {
    highlightHover: '\u30DB\u30D0\u30FC\u3067\u30CF\u30A4\u30E9\u30A4\u30C8',
    ttsPause: '\u8AAD\u307F\u4E0A\u3052\u3092\u4E00\u6642\u505C\u6B62',
    ttsResume: '\u8AAD\u307F\u4E0A\u3052\u3092\u518D\u958B',
    ttsSpeed: '\u8AAD\u307F\u4E0A\u3052\u901F\u5EA6',
    ttsSlower: '\u9045\u304F',
    ttsFaster: '\u901F\u304F',
  },
  ru: {
    highlightHover: '\u041F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0430 \u043F\u0440\u0438 \u043D\u0430\u0432\u0435\u0434\u0435\u043D\u0438\u0438',
    ttsPause: '\u041F\u0430\u0443\u0437\u0430 \u0447\u0442\u0435\u043D\u0438\u044F',
    ttsResume: '\u0412\u043E\u0437\u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0447\u0442\u0435\u043D\u0438\u0435',
    ttsSpeed: '\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0447\u0442\u0435\u043D\u0438\u044F',
    ttsSlower: '\u041C\u0435\u0434\u043B\u0435\u043D\u043D\u0435\u0435',
    ttsFaster: '\u0411\u044B\u0441\u0442\u0440\u0435\u0435',
  },
  hi: {
    highlightHover: '\u0939\u094B\u0935\u0930 \u092A\u0930 \u0939\u093E\u0907\u0932\u093E\u0907\u091F',
    ttsPause: '\u092A\u0920\u0928 \u0930\u094B\u0915\u0947\u0902',
    ttsResume: '\u092A\u0920\u0928 \u091C\u093E\u0930\u0940 \u0930\u0916\u0947\u0902',
    ttsSpeed: '\u092A\u0920\u0928 \u0917\u0924\u093F',
    ttsSlower: '\u0927\u0940\u092E\u093E',
    ttsFaster: '\u0924\u0947\u091C\u093C',
  },
  bn: {
    highlightHover: '\u09B9\u09CB\u09AD\u09BE\u09B0\u09C7 \u09B9\u09BE\u0987\u09B2\u09BE\u0987\u099F',
    ttsPause: '\u09AA\u09BE\u09A0 \u09A5\u09BE\u09AE\u09BE\u09A8',
    ttsResume: '\u09AA\u09BE\u09A0 \u09AA\u09C1\u09A8\u09B0\u09BE\u09AF\u09BC \u09B6\u09C1\u09B0\u09C1 \u0995\u09B0\u09C1\u09A8',
    ttsSpeed: '\u09AA\u09BE\u09A0\u09C7\u09B0 \u0997\u09A4\u09BF',
    ttsSlower: '\u09A7\u09C0\u09B0',
    ttsFaster: '\u09A6\u09CD\u09B0\u09C1\u09A4',
  },
  pa: {
    highlightHover: '\u0A39\u0A4B\u0A35\u0A30 \u0A24\u0A47 \u0A39\u0A3E\u0A08\u0A32\u0A3E\u0A08\u0A1F',
    ttsPause: '\u0A2A\u0A5C\u0A4D\u0A39\u0A28\u0A3E \u0A30\u0A4B\u0A15\u0A4B',
    ttsResume: '\u0A2A\u0A5C\u0A4D\u0A39\u0A28\u0A3E \u0A1C\u0A3E\u0A30\u0A40 \u0A30\u0A71\u0A16\u0A4B',
    ttsSpeed: '\u0A2A\u0A5C\u0A4D\u0A39\u0A28 \u0A26\u0A40 \u0A17\u0A24\u0A40',
    ttsSlower: '\u0A39\u0A4C\u0A32\u0A40',
    ttsFaster: '\u0A24\u0A47\u0A1C\u0A3C',
  },
  id: {
    highlightHover: 'Sorot saat hover',
    ttsPause: 'Jeda membaca',
    ttsResume: 'Lanjutkan membaca',
    ttsSpeed: 'Kecepatan membaca',
    ttsSlower: 'Lebih lambat',
    ttsFaster: 'Lebih cepat',
  },
  ur: {
    highlightHover: '\u06C1\u0648\u0648\u0631 \u067E\u0631 \u0631\u0648\u0634\u0646\u06CC',
    ttsPause: '\u067E\u0691\u06BE\u0646\u0627 \u0631\u0648\u06A9\u06CC\u06BA',
    ttsResume: '\u067E\u0691\u06BE\u0646\u0627 \u062F\u0648\u0628\u0627\u0631\u06C1 \u0634\u0631\u0648\u0639 \u06A9\u0631\u06CC\u06BA',
    ttsSpeed: '\u067E\u0691\u06BE\u0646\u06D2 \u06A9\u06CC \u0631\u0641\u062A\u0627\u0631',
    ttsSlower: '\u0633\u0633\u062A',
    ttsFaster: '\u062A\u06CC\u0632',
  },
  tr: {
    highlightHover: '\xDCzerine gelince vurgula',
    ttsPause: 'Okumay\u0131 duraklat',
    ttsResume: 'Okumaya devam et',
    ttsSpeed: 'Okuma h\u0131z\u0131',
    ttsSlower: 'Daha yava\u015F',
    ttsFaster: 'Daha h\u0131zl\u0131',
  },
  vi: {
    highlightHover: '\u0110\xE1nh d\u1EA5u khi di chu\u1ED9t',
    ttsPause: 'T\u1EA1m d\u1EEBng \u0111\u1ECDc',
    ttsResume: 'Ti\u1EBFp t\u1EE5c \u0111\u1ECDc',
    ttsSpeed: 'T\u1ED1c \u0111\u1ED9 \u0111\u1ECDc',
    ttsSlower: 'Ch\u1EADm h\u01A1n',
    ttsFaster: 'Nhanh h\u01A1n',
  },
  ko: {
    highlightHover: '\ub9c8\uc6b0\uc2a4 \uc624\ubc84 \uc2dc \uac15\uc870',
    ttsPause: '\uc77d\uae30 \uc77c\uc2dc\uc815\uc9c0',
    ttsResume: '\uc77d\uae30 \uc7ac\uac1c',
    ttsSpeed: '\uc77d\uae30 \uc18d\ub3c4',
    ttsSlower: '\ub354 \ub290\ub9ac\uac8c',
    ttsFaster: '\ub354 \ube60\ub974\uac8c',
  },
  it: {
    highlightHover: 'Evidenzia al passaggio',
    ttsPause: 'Pausa lettura',
    ttsResume: 'Riprendi lettura',
    ttsSpeed: 'Velocit\xE0 lettura',
    ttsSlower: 'Pi\xF9 lento',
    ttsFaster: 'Pi\xF9 veloce',
  },
  fa: {
    highlightHover: '\u0628\u0631\u062C\u0633\u062A\u0647\u200C\u0633\u0627\u0632\u06CC \u0628\u0627 \u0646\u0634\u0627\u0646\u06AF\u0631',
    ttsPause: '\u0645\u06A9\u062B \u062E\u0648\u0627\u0646\u062F\u0646',
    ttsResume: '\u0627\u062F\u0627\u0645\u0647 \u062E\u0648\u0627\u0646\u062F\u0646',
    ttsSpeed: '\u0633\u0631\u0639\u062A \u062E\u0648\u0627\u0646\u062F\u0646',
    ttsSlower: '\u06A9\u0646\u062F\u062A\u0631',
    ttsFaster: '\u0633\u0631\u06CC\u0639\u200C\u062A\u0631',
  },
  th: {
    highlightHover: '\u0E44\u0E2E\u0E44\u0E25\u0E15\u0E4C\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E27\u0E32\u0E07\u0E40\u0E21\u0E32\u0E2A\u0E4C',
    ttsPause: '\u0E2B\u0E22\u0E38\u0E14\u0E2D\u0E48\u0E32\u0E19\u0E0A\u0E31\u0E48\u0E27\u0E04\u0E23\u0E32\u0E27',
    ttsResume: '\u0E2D\u0E48\u0E32\u0E19\u0E15\u0E48\u0E2D',
    ttsSpeed: '\u0E04\u0E27\u0E32\u0E21\u0E40\u0E23\u0E47\u0E27\u0E43\u0E19\u0E01\u0E32\u0E23\u0E2D\u0E48\u0E32\u0E19',
    ttsSlower: '\u0E0A\u0E49\u0E32\u0E25\u0E07',
    ttsFaster: '\u0E40\u0E23\u0E47\u0E27\u0E02\u0E36\u0E49\u0E19',
  },
  ta: {
    highlightHover: '\u0BAE\u0BBF\u0BA4\u0BBF\u0B95\u0BC1\u0BAE\u0BCD\u0BAA\u0BCB\u0BA4\u0BC1 \u0BAE\u0BC1\u0BA9\u0BCD\u0BA9\u0BBF\u0BB2\u0BC8\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1',
    ttsPause: '\u0BB5\u0BBE\u0B9A\u0BBF\u0BAA\u0BCD\u0BAA\u0BC8 \u0B87\u0B9F\u0BC8\u0BA8\u0BBF\u0BB1\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1',
    ttsResume: '\u0BB5\u0BBE\u0B9A\u0BBF\u0BAA\u0BCD\u0BAA\u0BC8 \u0BA4\u0BCA\u0B9F\u0BB0\u0BCD',
    ttsSpeed: '\u0BB5\u0BBE\u0B9A\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1 \u0BB5\u0BC7\u0B95\u0BAE\u0BCD',
    ttsSlower: '\u0BAE\u0BC6\u0BA4\u0BC1\u0BB5\u0BBE\u0B9A',
    ttsFaster: '\u0BB5\u0BC7\u0B95\u0BAE\u0BBE\u0B9A',
  },
  mr: {
    highlightHover: '\u0939\u094B\u0935\u094D\u0939\u0930 \u0935\u0930 \u0939\u093E\u092F\u0932\u093E\u0907\u091F',
    ttsPause: '\u0935\u093E\u091A\u0928 \u0925\u093E\u0902\u092C\u0935\u093E',
    ttsResume: '\u0935\u093E\u091A\u0928 \u0938\u0941\u0930\u0942 \u0920\u0947\u0935\u093E',
    ttsSpeed: '\u0935\u093E\u091A\u0928 \u0917\u0924\u0940',
    ttsSlower: '\u0939\u0933\u0942',
    ttsFaster: '\u091C\u0932\u0926',
  },
  te: {
    highlightHover: '\u0C39\u0C4B\u0C35\u0C30\u0C4D\u200C\u0C32\u0C4B \u0C39\u0C48\u0C32\u0C48\u0C1F\u0C4D',
    ttsPause: '\u0C1A\u0C26\u0C35\u0C21\u0C02 \u0C06\u0C2A\u0C41',
    ttsResume: '\u0C1A\u0C26\u0C35\u0C21\u0C02 \u0C15\u0C4A\u0C28\u0C38\u0C3E\u0C17\u0C3F\u0C02\u0C1A\u0C41',
    ttsSpeed: '\u0C1A\u0C26\u0C35\u0C47 \u0C35\u0C47\u0C17\u0C02',
    ttsSlower: '\u0C28\u0C46\u0C2E\u0C4D\u0C2E\u0C26\u0C3F',
    ttsFaster: '\u0C35\u0C47\u0C17\u0C02\u0C17\u0C3E',
  },
  gu: {
    highlightHover: '\u0AB9\u0ACB\u0AB5\u0AB0 \u0AAA\u0AB0 \u0AB9\u0ABE\u0A87\u0AB2\u0ABE\u0A87\u0A1F',
    ttsPause: '\u0AB5\u0ABE\u0A82\u0A9A\u0AB5\u0AC1\u0A82 \u0A85\u0A9F\u0A95\u0ABE\u0AB5\u0ACB',
    ttsResume: '\u0AB5\u0ABE\u0A82\u0A9A\u0AB5\u0ABE\u0AA8\u0AC1\u0A82 \u0AAB\u0AB0\u0AC0 \u0AB6\u0AB0\u0AC2 \u0A95\u0AB0\u0ACB',
    ttsSpeed: '\u0AB5\u0ABE\u0A82\u0A9A\u0AB5\u0ABE\u0AA8\u0AC0 \u0A9D\u0AA1\u0AAA',
    ttsSlower: '\u0AA7\u0AC0\u0AAE\u0ABE',
    ttsFaster: '\u0A9D\u0AA1\u0AAA\u0AC0',
  },
  pl: {
    highlightHover: 'Pod\u015Bwietl po najechaniu',
    ttsPause: 'Wstrzymaj czytanie',
    ttsResume: 'Wzn\xF3w czytanie',
    ttsSpeed: 'Szybko\u015B\u0107 czytania',
    ttsSlower: 'Wolniej',
    ttsFaster: 'Szybciej',
  },
  ms: {
    highlightHover: 'Sorot semasa hover',
    ttsPause: 'Jeda membaca',
    ttsResume: 'Sambung membaca',
    ttsSpeed: 'Kelajuan membaca',
    ttsSlower: 'Lebih perlahan',
    ttsFaster: 'Lebih cepat',
  },
  nl: {
    highlightHover: 'Markeer bij hover',
    ttsPause: 'Lezen pauzeren',
    ttsResume: 'Lezen hervatten',
    ttsSpeed: 'Leessnelheid',
    ttsSlower: 'Langzamer',
    ttsFaster: 'Sneller',
  },
  tl: {
    highlightHover: 'I-highlight sa hover',
    ttsPause: 'I-pause ang pagbabasa',
    ttsResume: 'Ipagpatuloy ang pagbabasa',
    ttsSpeed: 'Bilis ng pagbabasa',
    ttsSlower: 'Mas mabagal',
    ttsFaster: 'Mas mabilis',
  },
  uk: {
    highlightHover: '\u041F\u0456\u0434\u0441\u0432\u0456\u0442\u043A\u0430 \u043F\u0440\u0438 \u043D\u0430\u0432\u0435\u0434\u0435\u043D\u043D\u0456',
    ttsPause: '\u041F\u0440\u0438\u0437\u0443\u043F\u0438\u043D\u0438\u0442\u0438 \u0447\u0438\u0442\u0430\u043D\u043D\u044F',
    ttsResume: '\u0412\u0456\u0434\u043D\u043E\u0432\u0438\u0442\u0438 \u0447\u0438\u0442\u0430\u043D\u043D\u044F',
    ttsSpeed: '\u0428\u0432\u0438\u0434\u043A\u0456\u0441\u0442\u044C \u0447\u0438\u0442\u0430\u043D\u043D\u044F',
    ttsSlower: '\u041F\u043E\u0432\u0456\u043B\u044C\u043D\u0456\u0448\u0435',
    ttsFaster: '\u0428\u0432\u0438\u0434\u0448\u0435',
  },
  sw: {
    highlightHover: 'Angazia wakati wa kupita',
    ttsPause: 'Simamisha kusoma',
    ttsResume: 'Endelea kusoma',
    ttsSpeed: 'Kasi ya kusoma',
    ttsSlower: 'Polepole zaidi',
    ttsFaster: 'Haraka zaidi',
  },
  sv: {
    highlightHover: 'Markera vid hovring',
    ttsPause: 'Pausa uppläsning',
    ttsResume: '\xC5teruppta uppläsning',
    ttsSpeed: 'Uppläsningshastighet',
    ttsSlower: 'Långsammare',
    ttsFaster: 'Snabbare',
  },
  da: {
    highlightHover: 'Fremhæv ved hover',
    ttsPause: 'Pause oplæsning',
    ttsResume: 'Genoptag oplæsning',
    ttsSpeed: 'Oplæsningshastighed',
    ttsSlower: 'Langsommere',
    ttsFaster: 'Hurtigere',
  },
  ro: {
    highlightHover: 'Eviden\u021Bia\u021Bi la hover',
    ttsPause: 'Pauz\u0103 citire',
    ttsResume: 'Reluare citire',
    ttsSpeed: 'Vitez\u0103 citire',
    ttsSlower: 'Mai lent',
    ttsFaster: 'Mai rapid',
  },
  el: {
    highlightHover: '\u0395\u03C0\u03B9\u03C3\u03AE\u03BC\u03B1\u03BD\u03C3\u03B7 \u03BA\u03B1\u03C4\u03AC \u03C4\u03B7 \u03BC\u03B5\u03C4\u03B1\u03BA\u03AF\u03BD\u03B7\u03C3\u03B7',
    ttsPause: '\u03A0\u03B1\u03CD\u03C3\u03B7 \u03B1\u03BD\u03AC\u03B3\u03BD\u03C9\u03C3\u03B7\u03C2',
    ttsResume: '\u03A3\u03C5\u03BD\u03AD\u03C7\u03B5\u03B9\u03B1 \u03B1\u03BD\u03AC\u03B3\u03BD\u03C9\u03C3\u03B7\u03C2',
    ttsSpeed: '\u03A4\u03B1\u03C7\u03CD\u03C4\u03B7\u03C4\u03B1 \u03B1\u03BD\u03AC\u03B3\u03BD\u03C9\u03C3\u03B7\u03C2',
    ttsSlower: '\u03A0\u03B9\u03BF \u03B1\u03C1\u03B3\u03AC',
    ttsFaster: '\u03A0\u03B9\u03BF \u03B3\u03C1\u03AE\u03B3\u03BF\u03C1\u03B1',
  },
  cs: {
    highlightHover: 'Zvýraznit p\u0159i p\u0159echodu',
    ttsPause: 'Pozastavit \u010Dten\xED',
    ttsResume: 'Obnovit \u010Dten\xED',
    ttsSpeed: 'Rychlost \u010Dten\xED',
    ttsSlower: 'Pomaleji',
    ttsFaster: 'Rychleji',
  },
  hu: {
    highlightHover: 'Kiemel\xE9s leb\xF6get\xE9skor',
    ttsPause: 'Olvas\xE1s sz\xFCneteltet\xE9se',
    ttsResume: 'Olvas\xE1s folytat\xE1sa',
    ttsSpeed: 'Olvas\xE1si sebess\xE9g',
    ttsSlower: 'Lassabb',
    ttsFaster: 'Gyorsabb',
  },
  kk: {
    highlightHover: '\u0422\u0456\u043D\u0442\u0456\u0443\u0456\u0440 \u04AF\u0441\u0442\u0456\u043D\u0434\u0435 \u0431\u04E9\u043B\u0435\u043A\u0442\u0435\u0443',
    ttsPause: '\u041E\u049B\u0443\u0434\u044B \u0442\u043E\u049B\u0442\u0430\u0442\u0443',
    ttsResume: '\u041E\u049B\u0443\u0434\u044B \u0436\u0430\u043B\u0493\u0430\u0441\u0442\u044B\u0440\u0443',
    ttsSpeed: '\u041E\u049B\u0443 \u0436\u044B\u043B\u0434\u0430\u043C\u0434\u044B\u0493\u044B',
    ttsSlower: '\u0411\u0430\u044F\u0443\u044B\u0440\u0430\u049B',
    ttsFaster: '\u0416\u044B\u043B\u0434\u0430\u043C\u044B\u0440\u0430\u049B',
  },
  sr: {
    highlightHover: '\u041E\u0437\u043D\u0430\u0447\u0438 \u043F\u0440\u0438 \u043F\u0440\u0435\u043B\u0430\u0441\u043A\u0443',
    ttsPause: '\u041F\u0430\u0443\u0437\u0438\u0440\u0430\u0458 \u0447\u0438\u0442\u0430\u045A\u0435',
    ttsResume: '\u041D\u0430\u0441\u0442\u0430\u0432\u0438 \u0447\u0438\u0442\u0430\u045A\u0435',
    ttsSpeed: '\u0411\u0440\u0437\u0438\u043D\u0430 \u0447\u0438\u0442\u0430\u045A\u0430',
    ttsSlower: '\u0421\u043F\u043E\u0440\u0438\u0458\u0435',
    ttsFaster: '\u0411\u0440\u0436\u0435',
  },
  no: {
    highlightHover: 'Merk ved hover',
    ttsPause: 'Pause opplesing',
    ttsResume: 'Gjenoppta opplesing',
    ttsSpeed: 'Lesehastighet',
    ttsSlower: 'Langsommere',
    ttsFaster: 'Raskere',
  },
};

// Keys to insert (in order)
const INSERT_KEYS = ['highlightHover', 'ttsPause', 'ttsResume', 'ttsSpeed', 'ttsSlower', 'ttsFaster'];

let src = fs.readFileSync(FILE, 'utf8');
// Normalise to LF for consistent indexing
src = src.replace(/\r\n/g, '\n');

let modified = 0;

for (const [lang, trans] of Object.entries(NEW_KEYS)) {
  // Find language block
  const langBlockMarker = '\n  ' + lang + ': {';
  const langStart = src.indexOf(langBlockMarker);
  if (langStart === -1) {
    console.error('[ERROR] Could not find block for lang: ' + lang);
    continue;
  }

  // Find block end
  const blockEnd = src.indexOf('\n  }', langStart + langBlockMarker.length);

  // Check if highlightHover already present in this block
  const blockSlice = src.slice(langStart, blockEnd);
  if (blockSlice.includes('highlightHover:')) {
    console.log('[SKIP] ' + lang + ': already has highlightHover');
    continue;
  }

  // Find the resetAll line within this block (used as insertion point)
  const resetAllIdx = src.indexOf('\n    resetAll:', langStart);
  if (resetAllIdx === -1 || resetAllIdx > blockEnd) {
    console.error('[ERROR] No resetAll for lang: ' + lang);
    continue;
  }

  // Build insertion string (inserted just before the resetAll line)
  const insertLines = INSERT_KEYS.map(function(key) {
    const val = trans[key];
    const escaped = val.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return "    " + key + ": '" + escaped + "',";
  }).join('\n');

  // Insert after the newline that precedes resetAll
  src = src.slice(0, resetAllIdx + 1) + insertLines + '\n' + src.slice(resetAllIdx + 1);

  console.log('[OK] ' + lang + ': inserted ' + INSERT_KEYS.length + ' keys');
  modified++;
}

fs.writeFileSync(FILE, src, 'utf8');
console.log('\nDone. Modified ' + modified + ' language blocks.');
