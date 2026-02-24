/**
 * Injects screen-reader announcement and first-visit tooltip i18n keys into
 * all 38 non-en/he language blocks in src/i18n.js.
 *
 * Keys injected (before the existing `resetAll:` anchor):
 *   settingsActive, resetConfirmation, featureEnabled, featureDisabled, tooltipMessage
 *
 * Run once: node scripts/add-sr-tooltip-i18n.cjs
 */

'use strict';

const fs = require('fs');
const path = require('path');

const FILE = path.resolve(__dirname, '../src/i18n.js');

// Translations for each of the 38 language codes.
// Format: [settingsActive, resetConfirmation, featureEnabled, featureDisabled, tooltipMessage]
const TRANSLATIONS = {
  zh: ['设置激活中', '所有无障碍设置已重置', '已启用', '已禁用', '自定义您的无障碍设置'],
  es: ['configuraciones activas', 'Todas las configuraciones de accesibilidad han sido restablecidas', 'activado', 'desactivado', 'Personaliza tu configuración de accesibilidad'],
  ar: ['\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0646\u0634\u0637\u0629', '\u062A\u0645 \u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u062C\u0645\u064A\u0639 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u0627\u0644\u0648\u0635\u0648\u0644', '\u0645\u0641\u0639\u0651\u0644', '\u0645\u0639\u0637\u0651\u0644', '\u062E\u0635\u0635 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u0627\u0644\u0648\u0635\u0648\u0644 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0643'],
  pt: ['configurações ativas', 'Todas as configurações de acessibilidade foram redefinidas', 'ativado', 'desativado', 'Personalize suas configurações de acessibilidade'],
  fr: ['paramètres actifs', 'Tous les paramètres d\'accessibilité ont été réinitialisés', 'activé', 'désactivé', 'Personnalisez vos paramètres d\'accessibilité'],
  de: ['Einstellungen aktiv', 'Alle Barrierefreiheitseinstellungen wurden zurückgesetzt', 'aktiviert', 'deaktiviert', 'Passen Sie Ihre Barrierefreiheitseinstellungen an'],
  ja: ['設定が有効', 'すべてのアクセシビリティ設定がリセットされました', '有効', '無効', 'アクセシビリティ設定をカスタマイズ'],
  ru: ['\u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u0430\u043A\u0442\u0438\u0432\u043D\u043E', '\u0412\u0441\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0445 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0435\u0439 \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u044B', '\u0432\u043A\u043B\u044E\u0447\u0435\u043D\u043E', '\u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E', '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u0442\u0435 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438'],
  hi: ['\u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938 \u0938\u0915\u094D\u0930\u093F\u092F', '\u0938\u092D\u0940 \u0905\u092D\u093F\u0917\u092E\u094D\u092F\u0924\u093E \u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938 \u0930\u0940\u0938\u0947\u091F \u0915\u0940 \u0917\u0908\u0902', '\u0938\u0915\u094D\u0937\u092E', '\u0905\u0915\u094D\u0937\u092E', '\u0905\u092A\u0928\u0940 \u0905\u092D\u093F\u0917\u092E\u094D\u092F\u0924\u093E \u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938 \u0915\u0938\u094D\u091F\u092E\u093E\u0907\u091C\u093C \u0915\u0930\u0947\u0902'],
  bn: ['\u09B8\u09C7\u099F\u09BF\u0982\u09B8 \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC', '\u09B8\u09AE\u09B8\u09CD\u09A4 \u0985্\u09AF\u09CB\u0997\u09CD\u09AF\u09A4\u09BE \u09B8\u09C7\u099F\u09BF\u0982\u09B8 \u09B0\u09BF\u09B8\u09C7\u099F \u09B9\u09AF\u09BC\u09C7\u099B\u09C7', '\u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC', '\u09A8\u09BF\u09B7\u09CD\u0995\u09CD\u09B0\u09BF\u09AF\u09BC', '\u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09AC\u09C7\u09B6\u09AF\u09CB\u0997\u09CD\u09AF\u09A4\u09BE \u09B8\u09C7\u099F\u09BF\u0982\u09B8 \u0995\u09BE\u09B8\u09CD\u099F\u09AE\u09BE\u0987\u099C \u0995\u09B0\u09C1\u09A8'],
  pa: ['\u0A38\u0A47\u0A1F\u0A3F\u0A70\u0A17\u0A1C\u200D \u0A38\u0A30\u0A17\u0A30\u0A2E', '\u0A38\u0A2D \u0A2A\u0A39\u0A41\u0A70\u0A1A\u0A2F\u0ACB\u0A17\u0A24\u0A3E \u0A38\u0A47\u0A1F\u0A3F\u0A70\u0A17\u0A1C\u200D \u0A30\u0A40\u0A38\u0A48\u0A1F \u0A39\u0ACB \u0A17\u0A08\u0A06\u0A02', '\u0A38\u0A15\u0A3F\u0A30\u0A15', '\u0A05\u0A15\u0A3F\u0A30\u0A15', '\u0A05\u0A2A\u0A23\u0A40\u0A06\u0A02 \u0A2A\u0A39\u0A41\u0A70\u0A1A\u0A2F\u0ACB\u0A17\u0A24\u0A3E \u0A38\u0A47\u0A1F\u0A3F\u0A70\u0A17\u0A1C\u200D \u0A15\u0A38\u0A1F\u0A2E\u0A3E\u0A08\u0A1C\u200D \u0A15\u0A30\u0A4B'],
  id: ['pengaturan aktif', 'Semua pengaturan aksesibilitas telah direset', 'diaktifkan', 'dinonaktifkan', 'Sesuaikan pengaturan aksesibilitas Anda'],
  ur: ['\u0633\u06CC\u0679\u0646\u06AF\u0632 \u0641\u0639\u0627\u0644', '\u062A\u0645\u0627\u0645 \u0627\u06CC\u06A9\u0633\u06CC\u0633\u0628\u0644\u06CC\u0679\u06CC \u0633\u06CC\u0679\u0646\u06AF\u0632 \u0631\u06CC\u0633\u06CC\u0679 \u06A9\u0631 \u062F\u06CC \u06AF\u0626\u06CC \u06C1\u06CC\u06BA', '\u0641\u0639\u0627\u0644', '\u063A\u06CC\u0631 \u0641\u0639\u0627\u0644', '\u0627\u067E\u0646\u06CC \u0627\u06CC\u06A9\u0633\u06CC\u0633\u0628\u0644\u06CC\u0679\u06CC \u0633\u06CC\u0679\u0646\u06AF\u0632 \u06A9\u0633\u0679\u0645\u0627\u0626\u0632 \u06A9\u0631\u06CC\u06BA'],
  tr: ['ayarlar etkin', 'Tüm erişilebilirlik ayarları sıfırlandı', 'etkinleştirildi', 'devre dışı bırakıldı', 'Erişilebilirlik ayarlarınızı özelleştirin'],
  vi: ['cài đặt đang hoạt động', 'Tất cả cài đặt khả năng truy cập đã được đặt lại', 'đã bật', 'đã tắt', 'Tùy chỉnh cài đặt khả năng truy cập của bạn'],
  ko: ['\ud65c\uc131 \uc124\uc815', '\ubaa8\ub4e0 \uc811\uadfc\uc131 \uc124\uc815\uc774 \ucd08\uae30\ud654\ub418\uc5c8\uc2b5\ub2c8\ub2e4', '\ud65c\uc131\ud654\ub428', '\ube44\ud65c\uc131\ud654\ub428', '\uc811\uadfc\uc131 \uc124\uc815\uc744 \uc0ac\uc6a9\uc790 \uc9c0\uc815\ud558\uc138\uc694'],
  it: ['impostazioni attive', 'Tutte le impostazioni di accessibilità sono state reimpostate', 'abilitato', 'disabilitato', 'Personalizza le tue impostazioni di accessibilità'],
  fa: ['\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0641\u0639\u0627\u0644', '\u062A\u0645\u0627\u0645 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u062F\u0633\u062A\u0631\u0633\u06CC\u200C\u067E\u0630\u06CC\u0631\u06CC \u0628\u0627\u0632\u0646\u0634\u0627\u0646\u06CC \u0634\u062F\u0646\u062F', '\u0641\u0639\u0627\u0644', '\u063A\u06CC\u0631\u0641\u0639\u0627\u0644', '\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u062F\u0633\u062A\u0631\u0633\u06CC\u200C\u067E\u0630\u06CC\u0631\u06CC \u062E\u0648\u062F \u0631\u0627 \u0633\u0641\u0627\u0631\u0634\u06CC\u200C\u0633\u0627\u0632\u06CC \u06A9\u0646\u06CC\u062F'],
  th: ['\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19', '\u0E23\u0E35\u0E40\u0E0B\u0E47\u0E15\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E01\u0E32\u0E23\u0E40\u0E02\u0E49\u0E32\u0E16\u0E36\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\u0E41\u0E25\u0E49\u0E27', '\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19', '\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19', '\u0E1B\u0E23\u0E31\u0E1A\u0E41\u0E15\u0E48\u0E07\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E01\u0E32\u0E23\u0E40\u0E02\u0E49\u0E32\u0E16\u0E36\u0E07\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13'],
  ta: ['\u0B85\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD \u0B9A\u0BC1\u0BB1\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0BA9\u0BB0\u0BCD', '\u0B85\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1 \u0B85\u0BA3\u0BC1\u0B95\u0BB2\u0BCD \u0B85\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BC1\u0BAE\u0BCD \u0BAE\u0BC0\u0B9F\u0BCD\u0B9F\u0BAE\u0BC8\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA9', '\u0B87\u0BAF\u0B95\u0BCD\u0B95\u0BAE\u0BCD', '\u0B87\u0BAF\u0B95\u0BCD\u0B95\u0BAE\u0BB1\u0BCD\u0BB1\u0BAE\u0BCD', '\u0B89\u0B99\u0B95\u0BB3\u0BCD \u0B85\u0BA3\u0BC1\u0B95\u0BB2\u0BCD \u0B85\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BC8 \u0BA4\u0BA9\u0BBF\u0BAF\u0BBE\u0B95\u0BCD\u0B95\u0BC1\u0B95'],
  mr: ['\u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938 \u0938\u0915\u094D\u0930\u093F\u092F', '\u0938\u0930\u094D\u0935 \u0905\u092D\u093F\u0917\u092E\u094D\u092F\u0924\u093E \u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938 \u0930\u0940\u0938\u0947\u091F \u0915\u0947\u0932\u094D\u092F\u093E', '\u0938\u0915\u094D\u0937\u092E', '\u0905\u0915\u094D\u0937\u092E', '\u0906\u092A\u0932\u094D\u092F\u093E \u0905\u092D\u093F\u0917\u092E\u094D\u092F\u0924\u093E \u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938 \u0915\u0938\u094D\u091F\u092E\u093E\u0907\u091D \u0915\u0930\u093E'],
  te: ['\u0C38\u0C46\u0C1F\u0C4D\u0C1F\u0C3F\u0C02\u0C17\u0C4D\u0C38\u0C41 \u0C38\u0C15\u0C4D\u0C30\u0C3F\u0C2F\u0C02\u0C17\u0C3E \u0C09\u0C28\u0C4D\u0C28\u0C3E\u0C2F\u0C3F', '\u0C05\u0C28\u0C4D\u0C28\u0C3F \u0C2A\u0C4D\u0C30\u0C3E\u0C2A\u0C4D\u0C2F\u0C24 \u0C38\u0C46\u0C1F\u0C4D\u0C1F\u0C3F\u0C02\u0C17\u0C4D\u0C38\u0C41 \u0C30\u0C40\u0C38\u0C46\u0C1F\u0C4D \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C4D\u0C21\u0C3E\u0C2F\u0C3F', '\u0C38\u0C15\u0C4D\u0C30\u0C3F\u0C2F\u0C2E\u0C48\u0C02\u0C26\u0C3F', '\u0C28\u0C3F\u0C37\u0C4D\u0C15\u0C4D\u0C30\u0C3F\u0C2F\u0C2E\u0C48\u0C02\u0C26\u0C3F', '\u0C2E\u0C40 \u0C2A\u0C4D\u0C30\u0C3E\u0C2A\u0C4D\u0C2F\u0C24 \u0C38\u0C46\u0C1F\u0C4D\u0C1F\u0C3F\u0C02\u0C17\u0C4D\u0C38\u0C41\u0C28\u0C41 \u0C05\u0C28\u0C41\u0C15\u0C42\u0C32\u0C40\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F'],
  gu: ['\u0AB8\u0AC7\u0A9F\u0ABF\u0A82\u0A97\u0ACD\u0AB8 \u0AB8\u0A95\u0ACD\u0AB0\u0ABF\u0AAF', '\u0A8F\u0AB2\u0ABE \u0A8F\u0A95\u0ACD\u0AB8\u0AC7\u0AB8\u0ABF\u0AAC\u0ABF\u0AB2\u0ABF\u0A9F\u0AC0 \u0AB8\u0AC7\u0A9F\u0ABF\u0A82\u0A97\u0ACD\u0AB8 \u0AB0\u0AC0\u0AB8\u0AC7\u0A9F \u0AA5\u0AAF\u0ABE\u0A82', '\u0AB8\u0A95\u0ACD\u0AB7\u0AAE', '\u0A85\u0A95\u0ACD\u0AB7\u0AAE', '\u0AA4\u0AAE\u0ABE\u0AB0\u0ABE \u0A8F\u0A95\u0ACD\u0AB8\u0AC7\u0AB8\u0ABF\u0AAC\u0ABF\u0AB2\u0ABF\u0A9F\u0AC0 \u0AB8\u0AC7\u0A9F\u0ABF\u0A82\u0A97\u0ACD\u0AB8 \u0A95\u0AB8\u0ACD\u0A9F\u0AAE\u0ABE\u0AAF\u0AB5 \u0A95\u0AB0\u0ACB'],
  pl: ['ustawień aktywnych', 'Wszystkie ustawienia dostępności zostały zresetowane', 'włączono', 'wyłączono', 'Dostosuj ustawienia dostępności'],
  ms: ['tetapan aktif', 'Semua tetapan kebolehcapaian telah ditetapkan semula', 'diaktifkan', 'dinyahaktifkan', 'Sesuaikan tetapan kebolehcapaian anda'],
  nl: ['instellingen actief', 'Alle toegankelijkheidsinstellingen zijn opnieuw ingesteld', 'ingeschakeld', 'uitgeschakeld', 'Pas uw toegankelijkheidsinstellingen aan'],
  fil: ['aktibong mga setting', 'Nai-reset na ang lahat ng accessibility settings', 'pinagana', 'hindi pinagana', 'I-customize ang iyong mga accessibility settings'],
  uk: ['\u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u044C \u0430\u043A\u0442\u0438\u0432\u043D\u043E', '\u0423\u0441\u0456 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0456 \u0441\u043A\u0438\u043D\u0443\u0442\u043E', '\u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E', '\u0432\u0438\u043C\u043A\u043D\u0435\u043D\u043E', '\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0439\u0442\u0435 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0456'],
  sw: ['mipangilio inayotumika', 'Mipangilio yote ya ufikiaji imewekwa upya', 'imewezeshwa', 'imezimwa', 'Binafsisha mipangilio yako ya ufikiaji'],
  sv: ['inställningar aktiva', 'Alla tillgänglighetsinställningar har återställts', 'aktiverad', 'inaktiverad', 'Anpassa dina tillgänglighetsinställningar'],
  da: ['indstillinger aktive', 'Alle tilgængelighedsindstillinger er nulstillet', 'aktiveret', 'deaktiveret', 'Tilpas dine tilgængelighedsindstillinger'],
  ro: ['setări active', 'Toate setările de accesibilitate au fost resetate', 'activat', 'dezactivat', 'Personalizați setările dvs. de accesibilitate'],
  el: ['\u03C1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2 \u03B5\u03BD\u03B5\u03C1\u03B3\u03AD\u03C2', '\u038C\u03BB\u03B5\u03C2 \u03BF\u03B9 \u03C1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2 \u03C0\u03C1\u03BF\u03C3\u03B2\u03B1\u03C3\u03B9\u03BC\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2 \u03B5\u03C0\u03B1\u03BD\u03B1\u03C6\u03AD\u03C1\u03B8\u03B7\u03BA\u03B1\u03BD', '\u03B5\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03AE\u03B8\u03B7\u03BA\u03B5', '\u03B1\u03C0\u03B5\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03AE\u03B8\u03B7\u03BA\u03B5', '\u03A0\u03C1\u03BF\u03C3\u03B1\u03C1\u03BC\u03CC\u03C3\u03C4\u03B5 \u03C4\u03B9\u03C2 \u03C1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2 \u03C0\u03C1\u03BF\u03C3\u03B2\u03B1\u03C3\u03B9\u03BC\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2 \u03C3\u03B1\u03C2'],
  cs: ['nastavení aktivní', 'Všechna nastavení přístupnosti byla resetována', 'povoleno', 'zakázáno', 'Přizpůsobte nastavení přístupnosti'],
  hu: ['aktív beállítások', 'Minden akadálymentesítési beállítás visszaállítva', 'engedélyezve', 'letiltva', 'Testreszabhatja az akadálymentesítési beállításokat'],
  kk: ['\u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u043B\u0435\u0440 \u0431\u0435\u043B\u0441\u0435\u043D\u0434\u0456', '\u0411\u0430\u0440\u043B\u044B\u049B \u049B\u043E\u043B\u0436\u0435\u0442\u0456\u043C\u0434\u0456\u043B\u0456\u043A \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u043B\u0435\u0440\u0456 \u049B\u0430\u043B\u043F\u044B\u043D\u0430 \u043A\u0435\u043B\u0442\u0456\u0440\u0456\u043B\u0434\u0456', '\u049B\u043E\u0441\u044B\u043B\u0493\u0430\u043D', '\u04E9\u0448\u0456\u0440\u0456\u043B\u0433\u0435\u043D', '\u049A\u043E\u043B\u0436\u0435\u0442\u0456\u043C\u0434\u0456\u043B\u0456\u043A \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u043B\u0435\u0440\u0456\u04A3\u0456\u0437\u0434\u0456 \u0431\u0430\u043F\u0442\u0430\u043F'],
  sr: ['\u0430\u043A\u0442\u0438\u0432\u043D\u0430 \u043F\u043E\u0434\u0435\u0448\u0430\u0432\u0430\u045A\u0430', '\u0421\u0432\u0435 \u043F\u043E\u0441\u0442\u0430\u0432\u043A\u0435 \u043F\u0440\u0438\u0441\u0442\u0443\u043F\u0430\u0447\u043D\u043E\u0441\u0442\u0438 \u0441\u0443 \u043F\u043E\u043D\u0438\u0448\u0442\u0435\u043D\u0435', '\u043E\u043C\u043E\u0433\u0443\u045B\u0435\u043D\u043E', '\u043E\u043D\u0435\u043C\u043E\u0433\u0443\u045B\u0435\u043D\u043E', '\u041F\u0440\u0438\u043B\u0430\u0433\u043E\u0434\u0438\u0442\u0435 \u043F\u043E\u0441\u0442\u0430\u0432\u043A\u0435 \u043F\u0440\u0438\u0441\u0442\u0443\u043F\u0430\u0447\u043D\u043E\u0441\u0442\u0438'],
  no: ['innstillinger aktive', 'Alle tilgjengelighetsinnstillinger er tilbakestilt', 'aktivert', 'deaktivert', 'Tilpass tilgjengelighetsinnstillingene dine'],
};

const src = fs.readFileSync(FILE, 'utf8');
let result = src;
let modified = 0;

for (const [lang, [settingsActive, resetConfirmation, featureEnabled, featureDisabled, tooltipMessage]] of Object.entries(TRANSLATIONS)) {
  const anchor = `resetAll:`;
  // Find the language block by looking for the lang code followed by :{
  const langBlockRe = new RegExp(`(?<=\\n  ${lang}:\\s*\\{[\\s\\S]*?)    noProfiles:.*\\n`, 'g');

  // Simpler approach: find the noProfiles line inside the current lang block
  // and insert new keys after it, before resetAll
  // Use the pattern: find "    noProfiles: '...'" line in the block for this language
  // The blocks are separated by "  xx: {" patterns.

  // Check if already injected (idempotent)
  if (result.includes(`// --- ${lang} block`) || false) continue;

  // Strategy: find the anchor "    resetAll:" that is preceded by "    noProfiles:" for THIS language block.
  // We look for the specific anchor sequence within the language block.
  // Language block: starts with "  {lang}: {" and ends with "  },"
  const blockStart = result.indexOf(`\n  ${lang}: {`);
  if (blockStart === -1) {
    console.warn(`Language block not found: ${lang}`);
    continue;
  }

  // Find the end of the language block (next "  },")
  const blockEndSearch = result.indexOf('\n  },', blockStart + 1);
  const blockEnd = blockEndSearch === -1 ? result.length : blockEndSearch;

  const block = result.slice(blockStart, blockEnd);

  // Check if already has settingsActive
  if (block.includes('settingsActive:')) {
    console.log(`Skipping ${lang} (already has settingsActive)`);
    continue;
  }

  // Find "    resetAll:" within this block
  const localResetAllIdx = block.indexOf('    resetAll:');
  if (localResetAllIdx === -1) {
    console.warn(`resetAll not found in ${lang} block`);
    continue;
  }

  // Build insertion text
  const q = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  const injection =
    `    settingsActive: ${q(settingsActive)},\n` +
    `    resetConfirmation: ${q(resetConfirmation)},\n` +
    `    featureEnabled: ${q(featureEnabled)},\n` +
    `    featureDisabled: ${q(featureDisabled)},\n` +
    `    tooltipMessage: ${q(tooltipMessage)},\n`;

  // Insert before resetAll in the block
  const insertPos = blockStart + localResetAllIdx;
  result = result.slice(0, insertPos) + injection + result.slice(insertPos);
  modified++;
  console.log(`✓ ${lang}`);
}

fs.writeFileSync(FILE, result, 'utf8');
console.log(`\nDone. Modified ${modified} language blocks.`);
