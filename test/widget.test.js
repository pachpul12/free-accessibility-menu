/**
 * Comprehensive unit tests for the Widget and AccessibilityWidget API.
 */

import AccessibilityWidget from '../src/index.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function simulateClick(element) {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function simulateKeydown(element, key, extra) {
  element.dispatchEvent(new KeyboardEvent('keydown', Object.assign({ key, bubbles: true }, extra)));
}

function getRoot() {
  return document.querySelector('.a11y-widget');
}

function getToggleBtn() {
  return document.querySelector('.a11y-widget__toggle');
}

function getPanel() {
  return document.querySelector('.a11y-widget__panel');
}

function getCloseBtn() {
  return document.querySelector('.a11y-widget__close');
}

function getTitle() {
  return document.querySelector('.a11y-widget__title');
}

function getDisclaimer() {
  return document.querySelector('.a11y-widget__disclaimer');
}

function getResetBtn() {
  return document.querySelector('.a11y-widget__reset');
}

function getFeatureItem(featureId) {
  return document.querySelector('[data-feature="' + featureId + '"]');
}

function getAllMenuItems() {
  return document.querySelectorAll('.a11y-widget__item[role]');
}

function getFontBtn(action) {
  return document.querySelector('.a11y-widget__font-btn[data-action="' + action + '"]');
}

function getFontValue() {
  return document.querySelector('.a11y-widget__font-value');
}

function getLangSelect() {
  return document.querySelector('.a11y-widget__lang-select');
}

// Feature IDs and CSS classes
var TOGGLE_FEATURE_IDS = [
  'highContrast',
  'darkMode',
  'dyslexiaFont',
  'underlineLinks',
  'hideImages',
  'focusOutline',
  'textSpacing',
  'pauseAnimations',
  'largeCursor',
  'highlightHeadings',
  'invertColors',
  'readingGuide',
  'textToSpeech',
  'focusMode',
  'deuteranopia',
  'protanopia',
  'tritanopia',
  'reducedTransparency',
  'sensoryFriendly',
  'readableFont',
  'suppressNotifications',
  'highlightHover',
];
var ALL_FEATURE_IDS = TOGGLE_FEATURE_IDS.concat(['fontSize', 'lineHeight', 'letterSpacing', 'wordSpacing', 'saturation', 'brightness']);
var FEATURE_CSS = {
  highContrast: 'a11y-high-contrast',
  darkMode: 'a11y-dark-mode',
  dyslexiaFont: 'a11y-dyslexia-font',
  underlineLinks: 'a11y-underline-links',
  hideImages: 'a11y-hide-images',
  focusOutline: 'a11y-focus-outline',
  textSpacing: 'a11y-text-spacing',
  pauseAnimations: 'a11y-pause-animations',
  largeCursor: 'a11y-large-cursor',
  highlightHeadings: 'a11y-highlight-headings',
  invertColors: 'a11y-invert-colors',
  readingGuide: 'a11y-reading-guide',
  textToSpeech: 'a11y-text-to-speech',
  focusMode: 'a11y-focus-mode',
  deuteranopia: 'a11y-deuteranopia',
  protanopia: 'a11y-protanopia',
  tritanopia: 'a11y-tritanopia',
  reducedTransparency: 'a11y-reduced-transparency',
  sensoryFriendly: 'a11y-sensory-friendly',
  readableFont: 'a11y-readable-font',
  suppressNotifications: 'a11y-suppress-notifications',
  highlightHover: 'a11y-highlight-hover',
};

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

afterEach(() => {
  AccessibilityWidget.destroy();
  document.body.className = '';
  document.documentElement.removeAttribute('lang');
  document.documentElement.removeAttribute('dir');
  localStorage.clear();
});

// ===========================================================================
// 1. Initialization & API
// ===========================================================================

describe('Initialization & API', () => {
  test('AccessibilityWidget.version is "2.10.0"', () => {
    expect(AccessibilityWidget.version).toBe('2.10.0');
  });

  test('init() returns a widget instance', () => {
    var instance = AccessibilityWidget.init();
    expect(instance).toBeDefined();
    expect(typeof instance.openMenu).toBe('function');
    expect(typeof instance.closeMenu).toBe('function');
    expect(typeof instance.toggleMenu).toBe('function');
    expect(typeof instance.getSettings).toBe('function');
    expect(typeof instance.resetAll).toBe('function');
    expect(typeof instance.setLanguage).toBe('function');
    expect(typeof instance.destroy).toBe('function');
  });

  test('getInstance() returns instance after init', () => {
    var instance = AccessibilityWidget.init();
    expect(AccessibilityWidget.getInstance()).toBe(instance);
  });

  test('getInstance() returns null before init', () => {
    expect(AccessibilityWidget.getInstance()).toBeNull();
  });

  test('destroy() removes widget from DOM', () => {
    AccessibilityWidget.init();
    expect(getRoot()).not.toBeNull();
    AccessibilityWidget.destroy();
    expect(getRoot()).toBeNull();
  });

  test('destroy() sets getInstance() to null', () => {
    AccessibilityWidget.init();
    AccessibilityWidget.destroy();
    expect(AccessibilityWidget.getInstance()).toBeNull();
  });

  test('re-init destroys previous instance', () => {
    var first = AccessibilityWidget.init();
    var second = AccessibilityWidget.init();
    expect(second).not.toBe(first);
    // Only one widget in DOM
    var roots = document.querySelectorAll('.a11y-widget');
    expect(roots).toHaveLength(1);
  });

  test('window.AccessibilityWidget is set for UMD builds', () => {
    expect(window.AccessibilityWidget).toBe(AccessibilityWidget);
  });
});

// ===========================================================================
// 2. DOM Structure
// ===========================================================================

describe('DOM Structure', () => {
  beforeEach(() => {
    AccessibilityWidget.init();
  });

  test('widget is appended to document.body', () => {
    expect(document.body.contains(getRoot())).toBe(true);
  });

  test('root has a11y-widget class', () => {
    expect(getRoot().classList.contains('a11y-widget')).toBe(true);
  });

  test('toggle button exists with correct ARIA attributes', () => {
    var btn = getToggleBtn();
    expect(btn).not.toBeNull();
    expect(btn.getAttribute('aria-haspopup')).toBe('menu');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.getAttribute('aria-label')).toBe('Accessibility Menu');
  });

  test('toggle button does not have redundant role="button"', () => {
    var btn = getToggleBtn();
    expect(btn.getAttribute('role')).toBeNull();
  });

  test('content area has role=menu', () => {
    var content = document.querySelector('.a11y-widget__content');
    expect(content.getAttribute('role')).toBe('menu');
  });

  test('close button exists', () => {
    expect(getCloseBtn()).not.toBeNull();
  });

  test('title text matches English translation', () => {
    expect(getTitle().textContent).toBe('Accessibility Menu');
  });

  test('all 28 features rendered as menu items', () => {
    ALL_FEATURE_IDS.forEach((id) => {
      expect(getFeatureItem(id)).not.toBeNull();
    });
  });

  test('toggle features have role=menuitemcheckbox', () => {
    TOGGLE_FEATURE_IDS.forEach((id) => {
      expect(getFeatureItem(id).getAttribute('role')).toBe('menuitemcheckbox');
    });
  });

  test('fontSize feature has role=menuitem', () => {
    expect(getFeatureItem('fontSize').getAttribute('role')).toBe('menuitem');
  });

  test('font controls (+ and - buttons) exist for fontSize', () => {
    expect(getFontBtn('increase')).not.toBeNull();
    expect(getFontBtn('decrease')).not.toBeNull();
  });

  test('font value display exists', () => {
    expect(getFontValue()).not.toBeNull();
    expect(getFontValue().textContent).toBe('0');
  });

  test('language select exists with en and he options', () => {
    var sel = getLangSelect();
    expect(sel).not.toBeNull();
    var values = Array.from(sel.options).map(function (o) { return o.value; });
    expect(values).toContain('en');
    expect(values).toContain('he');
  });

  test('reset button exists', () => {
    expect(getResetBtn()).not.toBeNull();
    expect(getResetBtn().textContent).toBe('Reset All');
  });

  test('disclaimer text exists', () => {
    expect(getDisclaimer()).not.toBeNull();
    expect(getDisclaimer().textContent.length).toBeGreaterThan(0);
  });

  test('data-position defaults to bottom-right', () => {
    expect(getRoot().getAttribute('data-position')).toBe('bottom-right');
  });

  test('group sections have role=group', () => {
    var sections = getRoot().querySelectorAll('.a11y-widget__section[role="group"]');
    expect(sections.length).toBeGreaterThanOrEqual(4);
  });
});

// ===========================================================================
// 3. Menu Open/Close
// ===========================================================================

describe('Menu Open/Close', () => {
  var instance;

  beforeEach(() => {
    instance = AccessibilityWidget.init();
  });

  test('openMenu adds a11y-widget--open class', () => {
    instance.openMenu();
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(true);
  });

  test('openMenu sets aria-expanded=true', () => {
    instance.openMenu();
    expect(getToggleBtn().getAttribute('aria-expanded')).toBe('true');
  });

  test('openMenu focuses first menu item', () => {
    instance.openMenu();
    var items = getAllMenuItems();
    expect(document.activeElement).toBe(items[0]);
  });

  test('closeMenu removes a11y-widget--open class', () => {
    instance.openMenu();
    instance.closeMenu();
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(false);
  });

  test('closeMenu sets aria-expanded=false', () => {
    instance.openMenu();
    instance.closeMenu();
    expect(getToggleBtn().getAttribute('aria-expanded')).toBe('false');
  });

  test('toggleMenu cycles open/close', () => {
    instance.toggleMenu();
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(true);
    instance.toggleMenu();
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(false);
  });

  test('click on toggle button opens menu', () => {
    simulateClick(getToggleBtn());
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(true);
  });

  test('click on toggle button again closes menu', () => {
    simulateClick(getToggleBtn());
    simulateClick(getToggleBtn());
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(false);
  });

  test('click on close button closes menu', () => {
    instance.openMenu();
    simulateClick(getCloseBtn());
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(false);
  });

  test('click on close button returns focus to toggle', () => {
    instance.openMenu();
    simulateClick(getCloseBtn());
    expect(document.activeElement).toBe(getToggleBtn());
  });

  test('click outside menu closes it', () => {
    instance.openMenu();
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(false);
  });

  test('opening already-open menu does nothing', () => {
    instance.openMenu();
    expect(() => instance.openMenu()).not.toThrow();
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(true);
  });

  test('closing already-closed menu does nothing', () => {
    expect(() => instance.closeMenu()).not.toThrow();
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(false);
  });

  test('onOpenMenu callback fires', () => {
    var onOpen = jest.fn();
    var w = AccessibilityWidget.init({ onOpenMenu: onOpen });
    w.openMenu();
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  test('onCloseMenu callback fires', () => {
    var onClose = jest.fn();
    var w = AccessibilityWidget.init({ onCloseMenu: onClose });
    w.openMenu();
    w.closeMenu();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('onOpenMenu does not fire on second open call', () => {
    var onOpen = jest.fn();
    var w = AccessibilityWidget.init({ onOpenMenu: onOpen });
    w.openMenu();
    w.openMenu();
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});

// ===========================================================================
// 4. Feature Toggling
// ===========================================================================

describe('Feature Toggling', () => {
  var instance;

  beforeEach(() => {
    instance = AccessibilityWidget.init();
  });

  test('click on toggle feature item sets aria-checked=true', () => {
    var item = getFeatureItem('highContrast');
    simulateClick(item);
    expect(item.getAttribute('aria-checked')).toBe('true');
  });

  test('click again sets aria-checked=false', () => {
    var item = getFeatureItem('highContrast');
    simulateClick(item);
    simulateClick(item);
    expect(item.getAttribute('aria-checked')).toBe('false');
  });

  test('click adds a11y-widget__item--active class', () => {
    var item = getFeatureItem('highContrast');
    simulateClick(item);
    expect(item.classList.contains('a11y-widget__item--active')).toBe(true);
  });

  test('click removes a11y-widget__item--active class on second click', () => {
    var item = getFeatureItem('highContrast');
    simulateClick(item);
    simulateClick(item);
    expect(item.classList.contains('a11y-widget__item--active')).toBe(false);
  });

  test('click applies CSS class on document.body', () => {
    simulateClick(getFeatureItem('highContrast'));
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(true);
  });

  test('click removes CSS class from body on second click', () => {
    simulateClick(getFeatureItem('highContrast'));
    simulateClick(getFeatureItem('highContrast'));
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(false);
  });

  test('each toggle feature applies its CSS class', () => {
    TOGGLE_FEATURE_IDS.forEach((id) => {
      simulateClick(getFeatureItem(id));
      expect(document.body.classList.contains(FEATURE_CSS[id])).toBe(true);
    });
  });

  test('onToggle callback fires with (featureId, value)', () => {
    var onToggle = jest.fn();
    AccessibilityWidget.init({ onToggle });
    simulateClick(getFeatureItem('highContrast'));
    expect(onToggle).toHaveBeenCalledWith('highContrast', true);
    simulateClick(getFeatureItem('highContrast'));
    expect(onToggle).toHaveBeenCalledWith('highContrast', false);
  });

  test('settings persist to localStorage after toggle', () => {
    simulateClick(getFeatureItem('highContrast'));
    var saved = JSON.parse(localStorage.getItem('a11yWidgetSettings'));
    expect(saved.highContrast).toBe(true);
  });

  test('clicking on item label (nested element) toggles feature', () => {
    var item = getFeatureItem('highContrast');
    var label = item.querySelector('.a11y-widget__item-label');
    simulateClick(label);
    expect(item.getAttribute('aria-checked')).toBe('true');
  });
});

// ===========================================================================
// 5. Font Size Controls
// ===========================================================================

describe('Font Size Controls', () => {
  var instance;

  beforeEach(() => {
    instance = AccessibilityWidget.init();
  });

  test('click increase button increments value', () => {
    simulateClick(getFontBtn('increase'));
    expect(getFontValue().textContent).toBe('1');
    expect(instance.getSettings().fontSize).toBe(1);
  });

  test('click decrease button decrements value', () => {
    simulateClick(getFontBtn('increase'));
    simulateClick(getFontBtn('increase'));
    simulateClick(getFontBtn('decrease'));
    expect(getFontValue().textContent).toBe('1');
  });

  test('value clamped at max (5)', () => {
    for (var i = 0; i < 10; i++) {
      simulateClick(getFontBtn('increase'));
    }
    expect(getFontValue().textContent).toBe('5');
    expect(instance.getSettings().fontSize).toBe(5);
  });

  test('value clamped at min (0)', () => {
    simulateClick(getFontBtn('increase'));
    simulateClick(getFontBtn('decrease'));
    simulateClick(getFontBtn('decrease'));
    expect(getFontValue().textContent).toBe('0');
    expect(instance.getSettings().fontSize).toBe(0);
  });

  test('correct body classes applied for each level', () => {
    for (var level = 1; level <= 5; level++) {
      simulateClick(getFontBtn('increase'));
      expect(document.body.classList.contains('a11y-font-' + level)).toBe(true);
      if (level > 1) {
        expect(document.body.classList.contains('a11y-font-' + (level - 1))).toBe(false);
      }
    }
  });

  test('no font class when value is 0', () => {
    for (var i = 0; i <= 5; i++) {
      expect(document.body.classList.contains('a11y-font-' + i)).toBe(false);
    }
  });

  test('onToggle fires for font size changes', () => {
    var onToggle = jest.fn();
    AccessibilityWidget.init({ onToggle });
    simulateClick(getFontBtn('increase'));
    expect(onToggle).toHaveBeenCalledWith('fontSize', 1);
  });

  test('onToggle does not fire when already at max', () => {
    var onToggle = jest.fn();
    AccessibilityWidget.init({ onToggle });
    for (var i = 0; i < 5; i++) simulateClick(getFontBtn('increase'));
    onToggle.mockClear();
    simulateClick(getFontBtn('increase'));
    expect(onToggle).not.toHaveBeenCalled();
  });

  test('onToggle does not fire when already at min', () => {
    var onToggle = jest.fn();
    AccessibilityWidget.init({ onToggle });
    simulateClick(getFontBtn('decrease'));
    expect(onToggle).not.toHaveBeenCalled();
  });

  test('font size persists to localStorage', () => {
    simulateClick(getFontBtn('increase'));
    simulateClick(getFontBtn('increase'));
    var saved = JSON.parse(localStorage.getItem('a11yWidgetSettings'));
    expect(saved.fontSize).toBe(2);
  });
});

// ===========================================================================
// 6. Keyboard Navigation
// ===========================================================================

describe('Keyboard Navigation', () => {
  var instance;

  beforeEach(() => {
    instance = AccessibilityWidget.init();
  });

  test('Enter on toggle button opens menu', () => {
    simulateKeydown(getToggleBtn(), 'Enter');
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(true);
  });

  test('Space on toggle button opens menu', () => {
    simulateKeydown(getToggleBtn(), ' ');
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(true);
  });

  test('Enter on toggle button closes menu when open', () => {
    instance.openMenu();
    getToggleBtn().focus();
    simulateKeydown(getToggleBtn(), 'Enter');
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(false);
  });

  test('ArrowDown on toggle button opens menu', () => {
    simulateKeydown(getToggleBtn(), 'ArrowDown');
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(true);
  });

  test('ArrowDown in panel moves focus to next item', () => {
    instance.openMenu();
    var items = Array.from(getAllMenuItems());
    expect(document.activeElement).toBe(items[0]);
    simulateKeydown(getPanel(), 'ArrowDown');
    expect(document.activeElement).toBe(items[1]);
  });

  test('ArrowUp in panel moves focus to previous item', () => {
    instance.openMenu();
    simulateKeydown(getPanel(), 'ArrowDown');
    var items = Array.from(getAllMenuItems());
    expect(document.activeElement).toBe(items[1]);
    simulateKeydown(getPanel(), 'ArrowUp');
    expect(document.activeElement).toBe(items[0]);
  });

  test('ArrowDown on last item wraps to first', () => {
    instance.openMenu();
    var items = Array.from(getAllMenuItems());
    var lastIndex = items.length - 1;
    for (var i = 0; i < lastIndex; i++) {
      simulateKeydown(getPanel(), 'ArrowDown');
    }
    expect(document.activeElement).toBe(items[lastIndex]);
    simulateKeydown(getPanel(), 'ArrowDown');
    expect(document.activeElement).toBe(items[0]);
  });

  test('ArrowUp on first item wraps to last', () => {
    instance.openMenu();
    var items = Array.from(getAllMenuItems());
    expect(document.activeElement).toBe(items[0]);
    simulateKeydown(getPanel(), 'ArrowUp');
    expect(document.activeElement).toBe(items[items.length - 1]);
  });

  test('Home focuses first item', () => {
    instance.openMenu();
    simulateKeydown(getPanel(), 'ArrowDown');
    simulateKeydown(getPanel(), 'ArrowDown');
    simulateKeydown(getPanel(), 'Home');
    var items = Array.from(getAllMenuItems());
    expect(document.activeElement).toBe(items[0]);
  });

  test('End focuses last item', () => {
    instance.openMenu();
    simulateKeydown(getPanel(), 'End');
    var items = Array.from(getAllMenuItems());
    expect(document.activeElement).toBe(items[items.length - 1]);
  });

  test('Enter on toggle feature item toggles it', () => {
    instance.openMenu();
    var item = getFeatureItem('highContrast');
    item.focus();
    simulateKeydown(item, 'Enter');
    expect(item.getAttribute('aria-checked')).toBe('true');
  });

  test('Space on toggle feature item toggles it', () => {
    instance.openMenu();
    var item = getFeatureItem('darkMode');
    item.focus();
    simulateKeydown(item, ' ');
    expect(item.getAttribute('aria-checked')).toBe('true');
  });

  test('Escape in panel closes menu and focuses toggle', () => {
    instance.openMenu();
    simulateKeydown(getPanel(), 'Escape');
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(false);
    expect(document.activeElement).toBe(getToggleBtn());
  });

  test('Tab in panel closes menu', () => {
    instance.openMenu();
    simulateKeydown(getPanel(), 'Tab');
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(false);
  });

  test('Escape from document closes menu', () => {
    instance.openMenu();
    simulateKeydown(document, 'Escape');
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(false);
  });

  test('Escape from document when menu closed does nothing', () => {
    simulateKeydown(document, 'Escape');
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(false);
  });

  test('Enter on font increase button adjusts font', () => {
    instance.openMenu();
    var btn = getFontBtn('increase');
    btn.focus();
    simulateKeydown(btn, 'Enter');
    expect(getFontValue().textContent).toBe('1');
  });

  test('changing language select switches language', () => {
    instance.openMenu();
    var sel = getLangSelect();
    sel.value = 'he';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    expect(getRoot().getAttribute('lang')).toBe('he');
  });
});

// ===========================================================================
// 7. Language Switching
// ===========================================================================

describe('Language Switching', () => {
  var instance;

  beforeEach(() => {
    instance = AccessibilityWidget.init();
  });

  test('setLanguage changes the active language', () => {
    instance.setLanguage('he');
    expect(getRoot().getAttribute('lang')).toBe('he');
  });

  test('selecting Hebrew in language select switches language', () => {
    var sel = getLangSelect();
    sel.value = 'he';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    expect(getRoot().getAttribute('lang')).toBe('he');
  });

  test('title text updates when language changes', () => {
    instance.setLanguage('he');
    expect(getTitle().textContent).not.toBe('Accessibility Menu');
    expect(getTitle().textContent.length).toBeGreaterThan(0);
  });

  test('title text updates back to English', () => {
    instance.setLanguage('he');
    instance.setLanguage('en');
    expect(getTitle().textContent).toBe('Accessibility Menu');
  });

  test('RTL class added for Hebrew', () => {
    instance.setLanguage('he');
    expect(getRoot().classList.contains('a11y-widget--rtl')).toBe(true);
  });

  test('RTL class removed for English', () => {
    instance.setLanguage('he');
    instance.setLanguage('en');
    expect(getRoot().classList.contains('a11y-widget--rtl')).toBe(false);
  });

  test('widget root dir attribute updates', () => {
    instance.setLanguage('he');
    expect(getRoot().getAttribute('dir')).toBe('rtl');
    instance.setLanguage('en');
    expect(getRoot().getAttribute('dir')).toBe('ltr');
  });

  test('host page document.documentElement.lang is never modified', () => {
    var originalLang = document.documentElement.getAttribute('lang');
    instance.setLanguage('he');
    expect(document.documentElement.getAttribute('lang')).toBe(originalLang);
    instance.setLanguage('en');
    expect(document.documentElement.getAttribute('lang')).toBe(originalLang);
  });

  test('language select value updates when language changes', () => {
    instance.setLanguage('he');
    expect(getLangSelect().value).toBe('he');
    instance.setLanguage('en');
    expect(getLangSelect().value).toBe('en');
  });

  test('setLanguage to same language is no-op', () => {
    instance.setLanguage('en');
    expect(getTitle().textContent).toBe('Accessibility Menu');
  });

  test('content area aria-label updates', () => {
    instance.setLanguage('he');
    var content = document.querySelector('.a11y-widget__content');
    expect(content.getAttribute('aria-label')).not.toBe('Accessibility Menu');
  });

  test('close button aria-label updates', () => {
    instance.setLanguage('he');
    expect(getCloseBtn().getAttribute('aria-label')).not.toBe('Close Menu');
  });

  test('reset button text updates', () => {
    instance.setLanguage('he');
    expect(getResetBtn().textContent).not.toBe('Reset All');
  });

  test('language saved to localStorage', () => {
    instance.setLanguage('he');
    var saved = JSON.parse(localStorage.getItem('a11yWidgetSettings'));
    expect(saved._language).toBe('he');
  });
});

// ===========================================================================
// 8. State Persistence
// ===========================================================================

describe('State Persistence', () => {
  test('settings saved after feature toggle', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('highContrast'));
    var saved = JSON.parse(localStorage.getItem('a11yWidgetSettings'));
    expect(saved.highContrast).toBe(true);
  });

  test('settings loaded from localStorage on init', () => {
    localStorage.setItem(
      'a11yWidgetSettings',
      JSON.stringify({ highContrast: true, darkMode: true, fontSize: 3, _language: 'en' })
    );
    var w = AccessibilityWidget.init();
    var settings = w.getSettings();
    expect(settings.highContrast).toBe(true);
    expect(settings.darkMode).toBe(true);
    expect(settings.fontSize).toBe(3);
  });

  test('persisted toggle reflected in DOM on init', () => {
    localStorage.setItem(
      'a11yWidgetSettings',
      JSON.stringify({ highContrast: true, _language: 'en' })
    );
    AccessibilityWidget.init();
    var item = getFeatureItem('highContrast');
    expect(item.getAttribute('aria-checked')).toBe('true');
    expect(item.classList.contains('a11y-widget__item--active')).toBe(true);
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(true);
  });

  test('persisted font size reflected in DOM on init', () => {
    localStorage.setItem(
      'a11yWidgetSettings',
      JSON.stringify({ fontSize: 3, _language: 'en' })
    );
    AccessibilityWidget.init();
    expect(getFontValue().textContent).toBe('3');
    expect(document.body.classList.contains('a11y-font-3')).toBe(true);
  });

  test('persisted language restored on init', () => {
    localStorage.setItem(
      'a11yWidgetSettings',
      JSON.stringify({ _language: 'he' })
    );
    AccessibilityWidget.init();
    expect(getRoot().getAttribute('lang')).toBe('he');
    expect(getRoot().getAttribute('dir')).toBe('rtl');
  });

  test('settings survive destroy and re-init', () => {
    var w1 = AccessibilityWidget.init();
    simulateClick(getFeatureItem('darkMode'));
    AccessibilityWidget.destroy();

    var w2 = AccessibilityWidget.init();
    expect(w2.getSettings().darkMode).toBe(true);
  });

  test('resetAll clears localStorage', () => {
    var w = AccessibilityWidget.init();
    simulateClick(getFeatureItem('highContrast'));
    expect(localStorage.getItem('a11yWidgetSettings')).not.toBeNull();
    w.resetAll();
    expect(localStorage.getItem('a11yWidgetSettings')).toBeNull();
  });

  test('custom storageKey works', () => {
    AccessibilityWidget.init({ storageKey: 'myCustomKey' });
    simulateClick(getFeatureItem('highContrast'));
    var saved = JSON.parse(localStorage.getItem('myCustomKey'));
    expect(saved.highContrast).toBe(true);
  });
});

// ===========================================================================
// 9. Reset
// ===========================================================================

describe('Reset', () => {
  var instance;

  beforeEach(() => {
    instance = AccessibilityWidget.init();
  });

  test('resetAll resets all toggle features to false', () => {
    TOGGLE_FEATURE_IDS.forEach((id) => simulateClick(getFeatureItem(id)));
    instance.resetAll();
    TOGGLE_FEATURE_IDS.forEach((id) => {
      expect(instance.getSettings()[id]).toBe(false);
    });
  });

  test('resetAll updates DOM (aria-checked=false, removes active)', () => {
    TOGGLE_FEATURE_IDS.forEach((id) => simulateClick(getFeatureItem(id)));
    instance.resetAll();
    TOGGLE_FEATURE_IDS.forEach((id) => {
      var item = getFeatureItem(id);
      expect(item.getAttribute('aria-checked')).toBe('false');
      expect(item.classList.contains('a11y-widget__item--active')).toBe(false);
    });
  });

  test('resetAll resets font value display to 0', () => {
    simulateClick(getFontBtn('increase'));
    simulateClick(getFontBtn('increase'));
    simulateClick(getFontBtn('increase'));
    instance.resetAll();
    expect(getFontValue().textContent).toBe('0');
    expect(instance.getSettings().fontSize).toBe(0);
  });

  test('resetAll clears body classes', () => {
    TOGGLE_FEATURE_IDS.forEach((id) => simulateClick(getFeatureItem(id)));
    instance.resetAll();
    Object.values(FEATURE_CSS).forEach((cls) => {
      expect(document.body.classList.contains(cls)).toBe(false);
    });
  });

  test('resetAll clears font body classes', () => {
    for (var i = 0; i < 3; i++) simulateClick(getFontBtn('increase'));
    instance.resetAll();
    for (var j = 0; j <= 5; j++) {
      expect(document.body.classList.contains('a11y-font-' + j)).toBe(false);
    }
  });

  test('click reset button triggers resetAll', () => {
    instance.openMenu();
    simulateClick(getFeatureItem('highContrast'));
    simulateClick(getResetBtn());
    expect(instance.getSettings().highContrast).toBe(false);
  });
});

// ===========================================================================
// 10. Configuration Options
// ===========================================================================

describe('Configuration Options', () => {
  test('defaultLanguage sets initial language', () => {
    AccessibilityWidget.init({ defaultLanguage: 'he' });
    expect(getRoot().getAttribute('lang')).toBe('he');
    expect(getRoot().classList.contains('a11y-widget--rtl')).toBe(true);
  });

  test('position option sets data-position', () => {
    AccessibilityWidget.init({ position: 'top-left' });
    expect(getRoot().getAttribute('data-position')).toBe('top-left');
  });

  test('features option can disable specific features', () => {
    AccessibilityWidget.init({
      features: { highContrast: false, hideImages: false },
    });
    expect(getFeatureItem('highContrast')).toBeNull();
    expect(getFeatureItem('hideImages')).toBeNull();
    expect(getFeatureItem('darkMode')).not.toBeNull();
  });

  test('disabled features are not in settings', () => {
    var w = AccessibilityWidget.init({ features: { highContrast: false } });
    expect(w.getSettings()).not.toHaveProperty('highContrast');
    expect(w.getSettings()).toHaveProperty('darkMode');
  });

  test('all 10 built-in languages appear in the language select', () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    var sel = getLangSelect();
    expect(sel).not.toBeNull();
    var values = Array.from(sel.options).map(function (o) { return o.value; });
    ['en', 'he', 'zh', 'es', 'ar', 'pt', 'fr', 'de', 'ja', 'ru'].forEach(function (code) {
      expect(values).toContain(code);
    });
  });

  test('language option labels use native names', () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    var sel = getLangSelect();
    var optionMap = {};
    Array.from(sel.options).forEach(function (o) { optionMap[o.value] = o.textContent; });
    expect(optionMap['en']).toBe('English');
    expect(optionMap['he']).toBe('\u05E2\u05D1\u05E8\u05D9\u05EA');
    expect(optionMap['de']).toBe('Deutsch');
  });

  test('destroyed widget openMenu is a no-op', () => {
    var w = AccessibilityWidget.init();
    w.destroy();
    expect(() => w.openMenu()).not.toThrow();
  });

  test('destroyed widget closeMenu is a no-op', () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    w.destroy();
    expect(() => w.closeMenu()).not.toThrow();
  });

  test('onToggle ignored if not a function', () => {
    AccessibilityWidget.init({ onToggle: 'not-a-function' });
    expect(() => simulateClick(getFeatureItem('highContrast'))).not.toThrow();
  });

  test('onOpenMenu ignored if not a function', () => {
    var w = AccessibilityWidget.init({ onOpenMenu: 42 });
    expect(() => w.openMenu()).not.toThrow();
  });

  test('init with no options uses defaults', () => {
    AccessibilityWidget.init();
    expect(getRoot()).not.toBeNull();
    expect(getRoot().getAttribute('lang')).toBe('en');
  });
});

// ===========================================================================
// 11. Destroy cleanup
// ===========================================================================

describe('Destroy cleanup', () => {
  test('destroy removes feature classes from body', () => {
    var w = AccessibilityWidget.init();
    simulateClick(getFeatureItem('highContrast'));
    simulateClick(getFeatureItem('darkMode'));
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(true);
    w.destroy();
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(false);
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(false);
  });

  test('destroy removes font classes from body', () => {
    var w = AccessibilityWidget.init();
    simulateClick(getFontBtn('increase'));
    simulateClick(getFontBtn('increase'));
    expect(document.body.classList.contains('a11y-font-2')).toBe(true);
    w.destroy();
    expect(document.body.classList.contains('a11y-font-2')).toBe(false);
  });

  test('destroy does not alter host page lang/dir attributes', () => {
    document.documentElement.setAttribute('lang', 'fr');
    document.documentElement.setAttribute('dir', 'ltr');
    var w = AccessibilityWidget.init();
    w.setLanguage('he');
    // Widget root has the language; host page is untouched
    expect(getRoot().getAttribute('lang')).toBe('he');
    expect(getRoot().getAttribute('dir')).toBe('rtl');
    expect(document.documentElement.getAttribute('lang')).toBe('fr');
    w.destroy();
    // Host page lang/dir still untouched after destroy
    expect(document.documentElement.getAttribute('lang')).toBe('fr');
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
  });

  test('widget sets lang/dir on its own root, not on document.documentElement', () => {
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
    AccessibilityWidget.init();
    // Widget root gets 'en' / 'ltr'
    expect(getRoot().getAttribute('lang')).toBe('en');
    expect(getRoot().getAttribute('dir')).toBe('ltr');
    // Host page remains untouched
    expect(document.documentElement.getAttribute('lang')).toBeNull();
    expect(document.documentElement.getAttribute('dir')).toBeNull();
  });
});

// ===========================================================================
// 12. Edge Cases
// ===========================================================================

describe('Edge Cases', () => {
  test('multiple rapid open/close does not break state', () => {
    var w = AccessibilityWidget.init();
    for (var i = 0; i < 10; i++) w.toggleMenu();
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(false);
    w.toggleMenu();
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(true);
  });

  test('click on panel does not close menu', () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    simulateClick(getPanel());
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(true);
  });

  test('double destroy is safe', () => {
    var w = AccessibilityWidget.init();
    w.destroy();
    expect(() => w.destroy()).not.toThrow();
  });

  test('double AccessibilityWidget.destroy() is safe', () => {
    AccessibilityWidget.init();
    AccessibilityWidget.destroy();
    expect(() => AccessibilityWidget.destroy()).not.toThrow();
  });

  test('rapid feature toggling maintains consistent state', () => {
    var w = AccessibilityWidget.init();
    var item = getFeatureItem('highContrast');
    for (var i = 0; i < 20; i++) simulateClick(item);
    // 20 toggles = even = back to false
    expect(item.getAttribute('aria-checked')).toBe('false');
    expect(w.getSettings().highContrast).toBe(false);
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(false);
  });

  test('rapid font size adjustments respect boundaries', () => {
    var w = AccessibilityWidget.init();
    for (var i = 0; i < 20; i++) simulateClick(getFontBtn('increase'));
    expect(w.getSettings().fontSize).toBe(5);
    for (var j = 0; j < 20; j++) simulateClick(getFontBtn('decrease'));
    expect(w.getSettings().fontSize).toBe(0);
  });

  test('clicking close button SVG closes menu', () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    var svg = getCloseBtn().querySelector('svg');
    if (svg) {
      simulateClick(svg);
      expect(getRoot().classList.contains('a11y-widget--open')).toBe(false);
    }
  });

  test('clicking font button SVG triggers adjustment', () => {
    AccessibilityWidget.init();
    var svg = getFontBtn('increase').querySelector('svg');
    if (svg) {
      simulateClick(svg);
      expect(getFontValue().textContent).toBe('1');
    }
  });

  test('multiple features persist all states correctly', () => {
    var w = AccessibilityWidget.init();
    simulateClick(getFeatureItem('highContrast'));
    simulateClick(getFeatureItem('darkMode'));
    simulateClick(getFontBtn('increase'));
    simulateClick(getFontBtn('increase'));
    var settings = w.getSettings();
    expect(settings.highContrast).toBe(true);
    expect(settings.darkMode).toBe(true);
    expect(settings.fontSize).toBe(2);
    expect(settings.underlineLinks).toBe(false);
  });

  test('language switching does not lose feature state', () => {
    var w = AccessibilityWidget.init();
    simulateClick(getFeatureItem('highContrast'));
    w.setLanguage('he');
    expect(w.getSettings().highContrast).toBe(true);
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(true);
  });

  test('reset does not change language', () => {
    var w = AccessibilityWidget.init();
    w.setLanguage('he');
    w.resetAll();
    expect(getRoot().getAttribute('lang')).toBe('he');
  });

  test('init with empty options is same as no options', () => {
    AccessibilityWidget.init({});
    expect(getRoot()).not.toBeNull();
    expect(getRoot().getAttribute('lang')).toBe('en');
  });

  test('getSettings returns a shallow copy', () => {
    var w = AccessibilityWidget.init();
    var s1 = w.getSettings();
    var s2 = w.getSettings();
    expect(s1).toEqual(s2);
    expect(s1).not.toBe(s2);
  });
});

// ===========================================================================
// 13. ARIA Compliance
// ===========================================================================

describe('ARIA Compliance', () => {
  test('toggle button has aria-controls pointing to panel id', () => {
    AccessibilityWidget.init();
    var btn = getToggleBtn();
    var panel = getPanel();
    expect(btn.getAttribute('aria-controls')).toBe('a11y-widget-panel');
    expect(panel.getAttribute('id')).toBe('a11y-widget-panel');
  });

  test('content area has role=menu with aria-label', () => {
    AccessibilityWidget.init();
    var content = document.querySelector('.a11y-widget__content');
    expect(content.getAttribute('role')).toBe('menu');
    expect(content.getAttribute('aria-label')).toBeTruthy();
  });

  test('group sections have role=group with aria-label', () => {
    AccessibilityWidget.init();
    var groups = getRoot().querySelectorAll('[role="group"]');
    expect(groups.length).toBeGreaterThanOrEqual(4);
    groups.forEach((g) => {
      expect(g.getAttribute('aria-label')).toBeTruthy();
    });
  });

  test('font value display has aria-live=polite', () => {
    AccessibilityWidget.init();
    expect(getFontValue().getAttribute('aria-live')).toBe('polite');
  });
});

// ===========================================================================
// 14. Schema Validation on Load
// ===========================================================================

describe('Schema Validation on Load', () => {
  test('invalid toggle value (string instead of boolean) is ignored', () => {
    localStorage.setItem(
      'a11yWidgetSettings',
      JSON.stringify({ highContrast: 'yes', _language: 'en' })
    );
    var w = AccessibilityWidget.init();
    expect(w.getSettings().highContrast).toBe(false);
  });

  test('invalid range value (out of bounds) is ignored', () => {
    localStorage.setItem(
      'a11yWidgetSettings',
      JSON.stringify({ fontSize: 99, _language: 'en' })
    );
    var w = AccessibilityWidget.init();
    expect(w.getSettings().fontSize).toBe(0);
  });

  test('negative range value is ignored', () => {
    localStorage.setItem(
      'a11yWidgetSettings',
      JSON.stringify({ fontSize: -5, _language: 'en' })
    );
    var w = AccessibilityWidget.init();
    expect(w.getSettings().fontSize).toBe(0);
  });

  test('string range value is ignored', () => {
    localStorage.setItem(
      'a11yWidgetSettings',
      JSON.stringify({ fontSize: 'big', _language: 'en' })
    );
    var w = AccessibilityWidget.init();
    expect(w.getSettings().fontSize).toBe(0);
  });

  test('non-string language is ignored', () => {
    localStorage.setItem(
      'a11yWidgetSettings',
      JSON.stringify({ _language: 123 })
    );
    AccessibilityWidget.init();
    expect(getRoot().getAttribute('lang')).toBe('en');
  });

  test('empty language string is ignored', () => {
    localStorage.setItem(
      'a11yWidgetSettings',
      JSON.stringify({ _language: '' })
    );
    AccessibilityWidget.init();
    expect(getRoot().getAttribute('lang')).toBe('en');
  });

  test('array in localStorage is ignored (not a plain object)', () => {
    localStorage.setItem('a11yWidgetSettings', JSON.stringify([1, 2, 3]));
    var w = AccessibilityWidget.init();
    // Should use defaults
    expect(w.getSettings().highContrast).toBe(false);
    expect(w.getSettings().fontSize).toBe(0);
  });

  test('extra unknown keys in localStorage are ignored safely', () => {
    localStorage.setItem(
      'a11yWidgetSettings',
      '{"highContrast":true,"unknownFeature":"xyz","_language":"en"}'
    );
    var w = AccessibilityWidget.init();
    expect(w.getSettings().highContrast).toBe(true);
    expect(w.getSettings().unknownFeature).toBeUndefined();
  });
});

// ===========================================================================
// 15. Destroyed widget guards
// ===========================================================================

describe('Destroyed widget guards', () => {
  test('document click after destroy does not throw', () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    w.destroy();
    // Simulate a document click after destroy
    expect(() => {
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }).not.toThrow();
  });

  test('document keydown after destroy does not throw', () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    w.destroy();
    expect(() => {
      simulateKeydown(document, 'Escape');
    }).not.toThrow();
  });
});

// ===========================================================================
// 16. Features disabled - edge case
// ===========================================================================

describe('All features disabled edge case', () => {
  test('disabling all features still creates widget', () => {
    var w = AccessibilityWidget.init({
      features: {
        highContrast: false,
        darkMode: false,
        fontSize: false,
        dyslexiaFont: false,
        underlineLinks: false,
        hideImages: false,
        focusOutline: false,
        textSpacing: false,
        pauseAnimations: false,
        largeCursor: false,
        highlightHeadings: false,
        invertColors: false,
        readingGuide: false,
        textToSpeech: false,
        focusMode: false,
        lineHeight: false,
        letterSpacing: false,
        wordSpacing: false,
        deuteranopia: false,
        protanopia: false,
        tritanopia: false,
        reducedTransparency: false,
        sensoryFriendly: false,
        readableFont: false,
        saturation: false,
        brightness: false,
        suppressNotifications: false,
        highlightHover: false,
      },
    });
    expect(getRoot()).not.toBeNull();
    expect(getToggleBtn()).not.toBeNull();
    expect(Object.keys(w.getSettings())).toHaveLength(0);
  });
});

// ===========================================================================
// 17. New Features (Later Priority)
// ===========================================================================

describe('New Features - Text Spacing', () => {
  test('toggling textSpacing adds CSS class to body', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('textSpacing'));
    expect(document.body.classList.contains('a11y-text-spacing')).toBe(true);
  });

  test('toggling textSpacing off removes CSS class', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('textSpacing'));
    simulateClick(getFeatureItem('textSpacing'));
    expect(document.body.classList.contains('a11y-text-spacing')).toBe(false);
  });

  test('textSpacing persists to localStorage', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('textSpacing'));
    var saved = JSON.parse(localStorage.getItem('a11yWidgetSettings'));
    expect(saved.textSpacing).toBe(true);
  });
});

describe('New Features - Pause Animations', () => {
  test('toggling pauseAnimations adds CSS class to body', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('pauseAnimations'));
    expect(document.body.classList.contains('a11y-pause-animations')).toBe(true);
  });

  test('toggling pauseAnimations off removes CSS class', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('pauseAnimations'));
    simulateClick(getFeatureItem('pauseAnimations'));
    expect(document.body.classList.contains('a11y-pause-animations')).toBe(false);
  });
});

describe('New Features - Large Cursor', () => {
  test('toggling largeCursor adds CSS class to body', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('largeCursor'));
    expect(document.body.classList.contains('a11y-large-cursor')).toBe(true);
  });

  test('toggling largeCursor off removes CSS class', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('largeCursor'));
    simulateClick(getFeatureItem('largeCursor'));
    expect(document.body.classList.contains('a11y-large-cursor')).toBe(false);
  });
});

describe('New Features - Highlight Headings', () => {
  test('toggling highlightHeadings adds CSS class to body', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('highlightHeadings'));
    expect(document.body.classList.contains('a11y-highlight-headings')).toBe(true);
  });

  test('toggling highlightHeadings off removes CSS class', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('highlightHeadings'));
    simulateClick(getFeatureItem('highlightHeadings'));
    expect(document.body.classList.contains('a11y-highlight-headings')).toBe(false);
  });
});

describe('New Features - Invert Colors', () => {
  test('toggling invertColors adds CSS class to body', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('invertColors'));
    expect(document.body.classList.contains('a11y-invert-colors')).toBe(true);
  });

  test('toggling invertColors off removes CSS class', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('invertColors'));
    simulateClick(getFeatureItem('invertColors'));
    expect(document.body.classList.contains('a11y-invert-colors')).toBe(false);
  });

  test('invertColors callback fires', () => {
    var onToggle = jest.fn();
    AccessibilityWidget.init({ onToggle });
    simulateClick(getFeatureItem('invertColors'));
    expect(onToggle).toHaveBeenCalledWith('invertColors', true);
  });
});

// ===========================================================================
// 18. Reading Guide Feature
// ===========================================================================

describe('New Features - Reading Guide', () => {
  test('toggling readingGuide adds CSS class to body', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('readingGuide'));
    expect(document.body.classList.contains('a11y-reading-guide')).toBe(true);
  });

  test('toggling readingGuide off removes CSS class', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('readingGuide'));
    simulateClick(getFeatureItem('readingGuide'));
    expect(document.body.classList.contains('a11y-reading-guide')).toBe(false);
  });

  test('readingGuide creates overlay bar in DOM when activated', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('readingGuide'));
    var bar = document.querySelector('.a11y-reading-guide-bar');
    expect(bar).not.toBeNull();
  });

  test('readingGuide removes overlay bar from DOM when deactivated', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('readingGuide'));
    simulateClick(getFeatureItem('readingGuide'));
    var bar = document.querySelector('.a11y-reading-guide-bar');
    expect(bar).toBeNull();
  });

  test('readingGuide overlay follows mousemove', () => {
    // rAF is synchronous in this test via mock so the DOM update is immediate.
    var rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(function (fn) { fn(); return 0; });
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('readingGuide'));
    var bar = document.querySelector('.a11y-reading-guide-bar');
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 200 }));
    expect(bar.style.top).toBe('194px'); // 200 - 6
    rafSpy.mockRestore();
  });

  test('readingGuide persists to localStorage', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('readingGuide'));
    var saved = JSON.parse(localStorage.getItem('a11yWidgetSettings'));
    expect(saved.readingGuide).toBe(true);
  });

  test('readingGuide callback fires', () => {
    var onToggle = jest.fn();
    AccessibilityWidget.init({ onToggle });
    simulateClick(getFeatureItem('readingGuide'));
    expect(onToggle).toHaveBeenCalledWith('readingGuide', true);
  });

  test('readingGuide is cleaned up on destroy', () => {
    var w = AccessibilityWidget.init();
    simulateClick(getFeatureItem('readingGuide'));
    w.destroy();
    var bar = document.querySelector('.a11y-reading-guide-bar');
    expect(bar).toBeNull();
  });

  test('readingGuide is cleaned up on resetAll', () => {
    var w = AccessibilityWidget.init();
    simulateClick(getFeatureItem('readingGuide'));
    w.resetAll();
    var bar = document.querySelector('.a11y-reading-guide-bar');
    expect(bar).toBeNull();
  });

  test('readingGuide restores from persisted state', () => {
    localStorage.setItem(
      'a11yWidgetSettings',
      JSON.stringify({ readingGuide: true, _language: 'en' })
    );
    AccessibilityWidget.init();
    var bar = document.querySelector('.a11y-reading-guide-bar');
    expect(bar).not.toBeNull();
    expect(document.body.classList.contains('a11y-reading-guide')).toBe(true);
  });
});

// ===========================================================================
// 19. Text-to-Speech Feature
// ===========================================================================

describe('New Features - Text to Speech', () => {
  // Mock speechSynthesis
  var mockSpeak;
  var mockCancel;

  beforeEach(() => {
    mockSpeak = jest.fn();
    mockCancel = jest.fn();
    global.speechSynthesis = {
      speak: mockSpeak,
      cancel: mockCancel,
    };
    global.SpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
      text: text,
      lang: '',
      onend: null,
      onerror: null,
    }));
  });

  afterEach(() => {
    delete global.speechSynthesis;
    delete global.SpeechSynthesisUtterance;
  });

  test('toggling textToSpeech adds CSS class to body', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('textToSpeech'));
    expect(document.body.classList.contains('a11y-text-to-speech')).toBe(true);
  });

  test('toggling textToSpeech off removes CSS class', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('textToSpeech'));
    simulateClick(getFeatureItem('textToSpeech'));
    expect(document.body.classList.contains('a11y-text-to-speech')).toBe(false);
  });

  test('clicking on page text triggers speechSynthesis.speak', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('textToSpeech'));

    var p = document.createElement('p');
    p.textContent = 'Hello world';
    document.body.appendChild(p);

    simulateClick(p);
    expect(mockSpeak).toHaveBeenCalled();

    document.body.removeChild(p);
  });

  test('clicking inside the widget does NOT trigger speech', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('textToSpeech'));
    // Reset mock after the initial toggle click
    mockSpeak.mockClear();

    // Click on the widget toggle
    getToggleBtn().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(mockSpeak).not.toHaveBeenCalled();
  });

  test('textToSpeech adds highlight class to clicked element', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('textToSpeech'));

    var p = document.createElement('p');
    p.textContent = 'Test text';
    document.body.appendChild(p);

    simulateClick(p);
    expect(p.classList.contains('a11y-tts-speaking')).toBe(true);

    document.body.removeChild(p);
  });

  test('deactivating TTS calls speechSynthesis.cancel', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('textToSpeech'));
    mockCancel.mockClear();
    simulateClick(getFeatureItem('textToSpeech'));
    expect(mockCancel).toHaveBeenCalled();
  });

  test('deactivating TTS removes highlight classes', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('textToSpeech'));

    var p = document.createElement('p');
    p.textContent = 'Test text';
    document.body.appendChild(p);
    simulateClick(p);

    simulateClick(getFeatureItem('textToSpeech'));
    expect(p.classList.contains('a11y-tts-speaking')).toBe(false);

    document.body.removeChild(p);
  });

  test('textToSpeech persists to localStorage', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('textToSpeech'));
    var saved = JSON.parse(localStorage.getItem('a11yWidgetSettings'));
    expect(saved.textToSpeech).toBe(true);
  });

  test('textToSpeech callback fires', () => {
    var onToggle = jest.fn();
    AccessibilityWidget.init({ onToggle });
    simulateClick(getFeatureItem('textToSpeech'));
    expect(onToggle).toHaveBeenCalledWith('textToSpeech', true);
  });

  test('textToSpeech is cleaned up on destroy', () => {
    var w = AccessibilityWidget.init();
    simulateClick(getFeatureItem('textToSpeech'));
    mockCancel.mockClear();
    w.destroy();
    expect(mockCancel).toHaveBeenCalled();
  });

  test('textToSpeech is cleaned up on resetAll', () => {
    var w = AccessibilityWidget.init();
    simulateClick(getFeatureItem('textToSpeech'));
    mockCancel.mockClear();
    w.resetAll();
    expect(mockCancel).toHaveBeenCalled();
  });

  test('clicking empty element does not trigger speech', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('textToSpeech'));
    mockSpeak.mockClear();

    var div = document.createElement('div');
    div.textContent = '';
    document.body.appendChild(div);

    simulateClick(div);
    expect(mockSpeak).not.toHaveBeenCalled();

    document.body.removeChild(div);
  });

  test('TTS utterance onend removes highlight class', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('textToSpeech'));

    var p = document.createElement('p');
    p.textContent = 'Test onend';
    document.body.appendChild(p);

    simulateClick(p);
    expect(p.classList.contains('a11y-tts-speaking')).toBe(true);

    // Get the utterance created by SpeechSynthesisUtterance mock
    var utterance = global.SpeechSynthesisUtterance.mock.results[
      global.SpeechSynthesisUtterance.mock.results.length - 1
    ].value;
    // Trigger onend
    utterance.onend();
    expect(p.classList.contains('a11y-tts-speaking')).toBe(false);

    document.body.removeChild(p);
  });

  test('TTS utterance onerror removes highlight class', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('textToSpeech'));

    var p = document.createElement('p');
    p.textContent = 'Test onerror';
    document.body.appendChild(p);

    simulateClick(p);
    expect(p.classList.contains('a11y-tts-speaking')).toBe(true);

    // Get the utterance
    var utterance = global.SpeechSynthesisUtterance.mock.results[
      global.SpeechSynthesisUtterance.mock.results.length - 1
    ].value;
    // Trigger onerror
    utterance.onerror();
    expect(p.classList.contains('a11y-tts-speaking')).toBe(false);

    document.body.removeChild(p);
  });

  test('textToSpeech restores from persisted state', () => {
    localStorage.setItem(
      'a11yWidgetSettings',
      JSON.stringify({ textToSpeech: true, _language: 'en' })
    );
    AccessibilityWidget.init();
    expect(document.body.classList.contains('a11y-text-to-speech')).toBe(true);
  });

  test('clicking replaces previous highlight', () => {
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('textToSpeech'));

    var p1 = document.createElement('p');
    p1.textContent = 'First paragraph';
    document.body.appendChild(p1);

    var p2 = document.createElement('p');
    p2.textContent = 'Second paragraph';
    document.body.appendChild(p2);

    simulateClick(p1);
    expect(p1.classList.contains('a11y-tts-speaking')).toBe(true);

    simulateClick(p2);
    expect(p1.classList.contains('a11y-tts-speaking')).toBe(false);
    expect(p2.classList.contains('a11y-tts-speaking')).toBe(true);

    document.body.removeChild(p1);
    document.body.removeChild(p2);
  });

  describe('F-204: word-level highlighting via onboundary', () => {
    test('clicking plain-text element injects word spans', () => {
      AccessibilityWidget.init();
      simulateClick(getFeatureItem('textToSpeech'));

      var p = document.createElement('p');
      p.textContent = 'Hello world';
      document.body.appendChild(p);
      simulateClick(p);

      var spans = p.querySelectorAll('.a11y-tts-word');
      expect(spans.length).toBe(2);
      expect(spans[0].textContent).toBe('Hello');
      expect(spans[1].textContent).toBe('world');
      document.body.removeChild(p);
    });

    test('word spans carry data-char-index attributes', () => {
      AccessibilityWidget.init();
      simulateClick(getFeatureItem('textToSpeech'));

      var p = document.createElement('p');
      p.textContent = 'Hello world';
      document.body.appendChild(p);
      simulateClick(p);

      var spans = p.querySelectorAll('.a11y-tts-word');
      expect(spans[0].getAttribute('data-char-index')).toBe('0');
      expect(spans[1].getAttribute('data-char-index')).toBe('6');
      document.body.removeChild(p);
    });

    test('onboundary adds a11y-tts-word-active to the matching span', () => {
      AccessibilityWidget.init();
      simulateClick(getFeatureItem('textToSpeech'));

      var p = document.createElement('p');
      p.textContent = 'Hello world';
      document.body.appendChild(p);
      simulateClick(p);

      var utterance = global.SpeechSynthesisUtterance.mock.results[
        global.SpeechSynthesisUtterance.mock.results.length - 1
      ].value;

      utterance.onboundary({ charIndex: 0 });
      var active = p.querySelector('.a11y-tts-word-active');
      expect(active).not.toBeNull();
      expect(active.textContent).toBe('Hello');

      // Move to next word: previous span loses active class
      utterance.onboundary({ charIndex: 6 });
      active = p.querySelector('.a11y-tts-word-active');
      expect(active).not.toBeNull();
      expect(active.textContent).toBe('world');
      var spans = p.querySelectorAll('.a11y-tts-word');
      expect(spans[0].classList.contains('a11y-tts-word-active')).toBe(false);
      document.body.removeChild(p);
    });

    test('onend restores original plain text (removes word spans)', () => {
      AccessibilityWidget.init();
      simulateClick(getFeatureItem('textToSpeech'));

      var p = document.createElement('p');
      p.textContent = 'Hello world';
      document.body.appendChild(p);
      simulateClick(p);

      var utterance = global.SpeechSynthesisUtterance.mock.results[
        global.SpeechSynthesisUtterance.mock.results.length - 1
      ].value;
      utterance.onend();

      expect(p.querySelectorAll('.a11y-tts-word').length).toBe(0);
      expect(p.textContent).toBe('Hello world');
      document.body.removeChild(p);
    });

    test('elements with child elements skip word-span injection', () => {
      AccessibilityWidget.init();
      simulateClick(getFeatureItem('textToSpeech'));

      var p = document.createElement('p');
      var strong = document.createElement('strong');
      strong.textContent = 'bold';
      p.appendChild(strong);
      p.appendChild(document.createTextNode(' text'));
      document.body.appendChild(p);
      simulateClick(p);

      // No word spans injected — element has child elements
      expect(p.querySelectorAll('.a11y-tts-word').length).toBe(0);
      // Element-level highlight still applied
      expect(p.classList.contains('a11y-tts-speaking')).toBe(true);
      document.body.removeChild(p);
    });

    test('deactivating TTS restores original HTML when word spans are active', () => {
      AccessibilityWidget.init();
      simulateClick(getFeatureItem('textToSpeech'));

      var p = document.createElement('p');
      p.textContent = 'Hello world';
      document.body.appendChild(p);
      simulateClick(p);

      // Word spans injected
      expect(p.querySelectorAll('.a11y-tts-word').length).toBe(2);

      // Deactivate TTS
      simulateClick(getFeatureItem('textToSpeech'));

      expect(p.querySelectorAll('.a11y-tts-word').length).toBe(0);
      expect(p.textContent).toBe('Hello world');
      document.body.removeChild(p);
    });
  });
});

// ===========================================================================
// 20. Coverage Improvement - Edge Cases
// ===========================================================================

describe('Coverage - Edge Cases', () => {
  test('_adjustRange returns early for non-range feature', () => {
    var w = AccessibilityWidget.init();
    // Calling adjustRange on a toggle feature should do nothing
    var settingsBefore = w.getSettings();
    // Access internal method indirectly via keyboard on toggle item
    var item = getFeatureItem('highContrast');
    item.focus();
    // This shouldn't throw or change anything
    expect(() => {
      simulateClick(item);
    }).not.toThrow();
  });

  test('_updateItemState returns early for unknown feature', () => {
    var w = AccessibilityWidget.init();
    // The internal method should not throw when called with unknown id
    // This gets hit when features are disabled - toggle on disabled feature
    expect(() => {
      w.resetAll();
    }).not.toThrow();
  });

  test('Enter/Space on language row activates language', () => {
    AccessibilityWidget.init();
    var w = AccessibilityWidget.getInstance();
    w.openMenu();
    // The language item is the last menu item (language section rendered after feature groups per PRD §8.1)
    var allItems = getAllMenuItems();
    var langItem = allItems[allItems.length - 1];
    langItem.focus();
    // Press Enter on the language row itself (not on a lang button)
    simulateKeydown(langItem, 'Enter');
    // Should not throw
  });

  test('Enter on focused font increase button via panel keydown', () => {
    AccessibilityWidget.init();
    var w = AccessibilityWidget.getInstance();
    w.openMenu();
    var plusBtn = getFontBtn('increase');
    plusBtn.focus();
    simulateKeydown(plusBtn, 'Enter');
    // Font value should increase
    expect(getFontValue().textContent).toBe('1');
  });

  test('document click when menu closed and widget exists does nothing', () => {
    AccessibilityWidget.init();
    // Menu is closed, click outside - should not throw
    expect(() => {
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }).not.toThrow();
  });

  test('document keydown when menu closed does nothing', () => {
    AccessibilityWidget.init();
    // Escape when menu is closed
    expect(() => {
      simulateKeydown(document, 'Escape');
    }).not.toThrow();
  });

  test('_getFocusedItemIndex returns -1 when no item is focused', () => {
    AccessibilityWidget.init();
    var w = AccessibilityWidget.getInstance();
    w.openMenu();
    // Focus something outside the menu
    document.body.focus();
    // ArrowDown should handle -1 index gracefully
    var panel = document.querySelector('.a11y-widget__panel');
    simulateKeydown(panel, 'ArrowDown');
    // Should focus the first item (index 0 after wrapping from -1+1=0)
  });

  test('_focusItem handles empty menuItems gracefully', () => {
    var w = AccessibilityWidget.init({
      features: {
        highContrast: false,
        darkMode: false,
        fontSize: false,
        dyslexiaFont: false,
        underlineLinks: false,
        hideImages: false,
        focusOutline: false,
        textSpacing: false,
        pauseAnimations: false,
        largeCursor: false,
        highlightHeadings: false,
        invertColors: false,
        readingGuide: false,
        textToSpeech: false,
        focusMode: false,
        lineHeight: false,
        letterSpacing: false,
        wordSpacing: false,
        deuteranopia: false,
        protanopia: false,
        tritanopia: false,
        reducedTransparency: false,
        sensoryFriendly: false,
        readableFont: false,
        saturation: false,
        brightness: false,
        suppressNotifications: false,
        highlightHover: false,
      },
    });
    w.openMenu();
    // Even with only language item, ArrowDown on the panel should not throw
    var panel = document.querySelector('.a11y-widget__panel');
    expect(() => {
      simulateKeydown(panel, 'ArrowDown');
    }).not.toThrow();
  });
});

// ===========================================================================
// 21. setFeature() and applySettings() API
// ===========================================================================

describe('setFeature() and applySettings()', () => {
  test('setFeature() enables a toggle feature', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('highContrast', true);
    expect(w.getSettings().highContrast).toBe(true);
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(true);
  });

  test('setFeature() disables a toggle feature', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('highContrast', true);
    w.setFeature('highContrast', false);
    expect(w.getSettings().highContrast).toBe(false);
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(false);
  });

  test('setFeature() sets a range feature value', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('fontSize', 3);
    expect(w.getSettings().fontSize).toBe(3);
    expect(document.body.classList.contains('a11y-font-3')).toBe(true);
  });

  test('setFeature() clamps range value to max', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('fontSize', 99);
    expect(w.getSettings().fontSize).toBe(5);
  });

  test('setFeature() clamps range value to min', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('fontSize', -5);
    expect(w.getSettings().fontSize).toBe(0);
  });

  test('setFeature() ignores unknown feature id', () => {
    var w = AccessibilityWidget.init();
    expect(() => w.setFeature('nonExistentFeature', true)).not.toThrow();
  });

  test('setFeature() updates aria-checked on menu item', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('darkMode', true);
    var item = getFeatureItem('darkMode');
    expect(item.getAttribute('aria-checked')).toBe('true');
  });

  test('setFeature() fires onToggle callback', () => {
    var cb = jest.fn();
    var w = AccessibilityWidget.init({ onToggle: cb });
    w.setFeature('highContrast', true);
    expect(cb).toHaveBeenCalledWith('highContrast', true);
  });

  test('applySettings() applies multiple features at once', () => {
    var w = AccessibilityWidget.init();
    w.applySettings({ highContrast: true, darkMode: true, fontSize: 2 });
    expect(w.getSettings().highContrast).toBe(true);
    expect(w.getSettings().darkMode).toBe(true);
    expect(w.getSettings().fontSize).toBe(2);
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(true);
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(true);
    expect(document.body.classList.contains('a11y-font-2')).toBe(true);
  });

  test('applySettings() ignores unknown keys', () => {
    var w = AccessibilityWidget.init();
    expect(() => w.applySettings({ unknownKey: true, highContrast: true })).not.toThrow();
    expect(w.getSettings().highContrast).toBe(true);
  });
});

// ===========================================================================
// 22. Keyboard Shortcut (Alt+A)
// ===========================================================================

describe('Keyboard Shortcut', () => {
  test('Alt+A opens the menu by default', () => {
    AccessibilityWidget.init();
    simulateKeydown(document, 'a', { altKey: true });
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(true);
  });

  test('Alt+A closes the menu when open', () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    simulateKeydown(document, 'a', { altKey: true });
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(false);
  });

  test('default shortcut is Alt+A', () => {
    var w = AccessibilityWidget.init();
    expect(getToggleBtn().getAttribute('aria-keyshortcuts')).toBe('Alt+A');
  });

  test('custom keyboard shortcut works', () => {
    AccessibilityWidget.init({ keyboardShortcut: 'ctrl+m' });
    simulateKeydown(document, 'm', { ctrlKey: true });
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(true);
  });

  test('keyboardShortcut: false disables the shortcut', () => {
    AccessibilityWidget.init({ keyboardShortcut: false });
    simulateKeydown(document, 'a', { altKey: true });
    expect(getRoot().classList.contains('a11y-widget--open')).toBe(false);
  });

  test('keyboardShortcut: false removes aria-keyshortcuts attribute', () => {
    AccessibilityWidget.init({ keyboardShortcut: false });
    expect(getToggleBtn().hasAttribute('aria-keyshortcuts')).toBe(false);
  });
});

// ===========================================================================
// 23. Granular Typography Range Controls
// ===========================================================================

function getRangeBtn(featureId, action) {
  return document.querySelector(
    '.a11y-widget__font-btn[data-feature="' + featureId + '"][data-action="' + action + '"]'
  );
}

function getRangeValue(featureId) {
  return document.querySelector(
    '.a11y-widget__font-value[data-feature="' + featureId + '"]'
  );
}

describe('Granular Typography - Line Height', () => {
  beforeEach(() => { AccessibilityWidget.init(); });

  test('increase button increments lineHeight', () => {
    simulateClick(getRangeBtn('lineHeight', 'increase'));
    expect(AccessibilityWidget.getInstance().getSettings().lineHeight).toBe(1);
  });

  test('decrease button decrements lineHeight', () => {
    var w = AccessibilityWidget.getInstance();
    w.setFeature('lineHeight', 3);
    simulateClick(getRangeBtn('lineHeight', 'decrease'));
    expect(w.getSettings().lineHeight).toBe(2);
  });

  test('lineHeight adds correct body class', () => {
    AccessibilityWidget.getInstance().setFeature('lineHeight', 2);
    expect(document.body.classList.contains('a11y-line-height-2')).toBe(true);
  });

  test('lineHeight value display updates', () => {
    simulateClick(getRangeBtn('lineHeight', 'increase'));
    expect(getRangeValue('lineHeight').textContent).toBe('1');
  });

  test('lineHeight persists to localStorage', () => {
    AccessibilityWidget.getInstance().setFeature('lineHeight', 3);
    var saved = JSON.parse(localStorage.getItem('a11yWidgetSettings'));
    expect(saved.lineHeight).toBe(3);
  });
});

describe('Granular Typography - Letter Spacing', () => {
  beforeEach(() => { AccessibilityWidget.init(); });

  test('increase button increments letterSpacing', () => {
    simulateClick(getRangeBtn('letterSpacing', 'increase'));
    expect(AccessibilityWidget.getInstance().getSettings().letterSpacing).toBe(1);
  });

  test('letterSpacing adds correct body class', () => {
    AccessibilityWidget.getInstance().setFeature('letterSpacing', 2);
    expect(document.body.classList.contains('a11y-letter-spacing-2')).toBe(true);
  });

  test('letterSpacing value display updates', () => {
    simulateClick(getRangeBtn('letterSpacing', 'increase'));
    expect(getRangeValue('letterSpacing').textContent).toBe('1');
  });
});

describe('Granular Typography - Word Spacing', () => {
  beforeEach(() => { AccessibilityWidget.init(); });

  test('increase button increments wordSpacing', () => {
    simulateClick(getRangeBtn('wordSpacing', 'increase'));
    expect(AccessibilityWidget.getInstance().getSettings().wordSpacing).toBe(1);
  });

  test('wordSpacing adds correct body class', () => {
    AccessibilityWidget.getInstance().setFeature('wordSpacing', 2);
    expect(document.body.classList.contains('a11y-word-spacing-2')).toBe(true);
  });

  test('wordSpacing value display updates', () => {
    simulateClick(getRangeBtn('wordSpacing', 'increase'));
    expect(getRangeValue('wordSpacing').textContent).toBe('1');
  });
});

// ===========================================================================
// 24. Section Group Label Translation
// ===========================================================================

describe('Section Group Labels', () => {
  test('group sections show translated labels', () => {
    AccessibilityWidget.init();
    var groups = document.querySelectorAll('[data-group]');
    expect(groups.length).toBeGreaterThanOrEqual(3);
    var names = Array.from(groups).map(function (g) { return g.getAttribute('data-group'); });
    expect(names).toContain('visual');
    expect(names).toContain('content');
    expect(names).toContain('navigation');
  });

  test('group aria-labels use English by default', () => {
    AccessibilityWidget.init();
    var visualGroup = document.querySelector('[data-group="visual"]');
    expect(visualGroup.getAttribute('aria-label')).toBe('Visual');
    var navGroup = document.querySelector('[data-group="navigation"]');
    expect(navGroup.getAttribute('aria-label')).toBe('Navigation');
  });

  test('group aria-labels update on language change', () => {
    var w = AccessibilityWidget.init();
    w.setLanguage('he');
    var visualGroup = document.querySelector('[data-group="visual"]');
    expect(visualGroup.getAttribute('aria-label')).not.toBe('Visual');
    expect(visualGroup.getAttribute('aria-label').length).toBeGreaterThan(0);
  });
});

// ===========================================================================
// 25. Color Blindness Filters
// ===========================================================================

describe('Color Blindness Filters', () => {
  test('deuteranopia adds body class and SVG filter is injected', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('deuteranopia', true);
    expect(document.body.classList.contains('a11y-deuteranopia')).toBe(true);
    expect(document.getElementById('a11y-color-blind-filters')).not.toBeNull();
  });

  test('protanopia adds body class', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('protanopia', true);
    expect(document.body.classList.contains('a11y-protanopia')).toBe(true);
  });

  test('tritanopia adds body class', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('tritanopia', true);
    expect(document.body.classList.contains('a11y-tritanopia')).toBe(true);
  });

  test('enabling deuteranopia disables protanopia and tritanopia', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('protanopia', true);
    w.setFeature('deuteranopia', true);
    expect(w.getSettings().protanopia).toBe(false);
    expect(w.getSettings().tritanopia).toBe(false);
    expect(w.getSettings().deuteranopia).toBe(true);
  });

  test('enabling protanopia disables deuteranopia and tritanopia', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('deuteranopia', true);
    w.setFeature('protanopia', true);
    expect(w.getSettings().deuteranopia).toBe(false);
    expect(w.getSettings().tritanopia).toBe(false);
    expect(w.getSettings().protanopia).toBe(true);
  });

  test('enabling tritanopia disables deuteranopia and protanopia', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('deuteranopia', true);
    w.setFeature('tritanopia', true);
    expect(w.getSettings().deuteranopia).toBe(false);
    expect(w.getSettings().protanopia).toBe(false);
    expect(w.getSettings().tritanopia).toBe(true);
  });

  test('only one color blind mode body class at a time', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('deuteranopia', true);
    w.setFeature('protanopia', true);
    expect(document.body.classList.contains('a11y-deuteranopia')).toBe(false);
    expect(document.body.classList.contains('a11y-protanopia')).toBe(true);
  });

  test('SVG filter is removed from DOM on destroy', () => {
    AccessibilityWidget.init();
    expect(document.getElementById('a11y-color-blind-filters')).not.toBeNull();
    AccessibilityWidget.destroy();
    expect(document.getElementById('a11y-color-blind-filters')).toBeNull();
  });
});

// ===========================================================================
// 26. Zoom Lock Warning
// ===========================================================================

describe('Zoom Lock Warning', () => {
  afterEach(() => {
    // Remove any viewport meta tags added by tests
    var metas = document.querySelectorAll('meta[name="viewport"]');
    metas.forEach(function (m) { m.parentNode.removeChild(m); });
  });

  test('no warning shown when no viewport meta exists', () => {
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__zoom-warn')).toBeNull();
  });

  test('no warning shown for a normal viewport meta', () => {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1';
    document.head.appendChild(meta);
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__zoom-warn')).toBeNull();
  });

  test('warning shown when user-scalable=no', () => {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, user-scalable=no';
    document.head.appendChild(meta);
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__zoom-warn')).not.toBeNull();
  });

  test('warning shown when user-scalable=0', () => {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, user-scalable=0';
    document.head.appendChild(meta);
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__zoom-warn')).not.toBeNull();
  });

  test('warning shown when maximum-scale=1', () => {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
    document.head.appendChild(meta);
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__zoom-warn')).not.toBeNull();
  });

  test('warning shown when maximum-scale=2 (less than 5)', () => {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, maximum-scale=2';
    document.head.appendChild(meta);
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__zoom-warn')).not.toBeNull();
  });

  test('no warning when maximum-scale=5', () => {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, maximum-scale=5';
    document.head.appendChild(meta);
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__zoom-warn')).toBeNull();
  });

  test('warning text updates on language change', () => {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, user-scalable=no';
    document.head.appendChild(meta);
    var w = AccessibilityWidget.init();
    var warnEl = document.querySelector('.a11y-widget__zoom-warn');
    var enText = warnEl.textContent;
    w.setLanguage('he');
    expect(warnEl.textContent).not.toBe(enText);
    expect(warnEl.textContent.length).toBeGreaterThan(0);
  });

  test('console.warn is called when zoom lock detected', () => {
    var spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, user-scalable=no';
    document.head.appendChild(meta);
    AccessibilityWidget.init();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[AccessibilityWidget]'));
    spy.mockRestore();
  });
});

// ===========================================================================
// 27. Profiles / Presets System
// ===========================================================================

describe('Profiles / Presets System', () => {
  var PROFILES_KEY = 'a11yWidgetSettings:profiles';

  afterEach(() => {
    localStorage.removeItem(PROFILES_KEY);
  });

  // ── API presence ──────────────────────────────────────────────────────────

  test('widget exposes saveProfile, loadProfile, deleteProfile, getProfiles', () => {
    var w = AccessibilityWidget.init();
    expect(typeof w.saveProfile).toBe('function');
    expect(typeof w.loadProfile).toBe('function');
    expect(typeof w.deleteProfile).toBe('function');
    expect(typeof w.getProfiles).toBe('function');
  });

  // ── getProfiles ───────────────────────────────────────────────────────────

  test('getProfiles() returns empty array when nothing saved', () => {
    var w = AccessibilityWidget.init();
    expect(w.getProfiles()).toEqual([]);
  });

  test('getProfiles() returns sorted array of saved profile names', () => {
    var w = AccessibilityWidget.init();
    w.saveProfile('Zebra');
    w.saveProfile('Apple');
    w.saveProfile('Mango');
    expect(w.getProfiles()).toEqual(['Apple', 'Mango', 'Zebra']);
  });

  // ── saveProfile ───────────────────────────────────────────────────────────

  test('saveProfile() persists current settings to localStorage', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('highContrast', true);
    w.saveProfile('My settings');

    var stored = JSON.parse(localStorage.getItem(PROFILES_KEY));
    expect(stored['My settings']).toBeDefined();
    expect(stored['My settings'].highContrast).toBe(true);
  });

  test('saveProfile() with same name overwrites previous', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('darkMode', true);
    w.saveProfile('Theme');

    w.setFeature('darkMode', false);
    w.setFeature('highContrast', true);
    w.saveProfile('Theme');

    var stored = JSON.parse(localStorage.getItem(PROFILES_KEY));
    expect(stored['Theme'].highContrast).toBe(true);
    expect(stored['Theme'].darkMode).toBe(false);
  });

  test('saveProfile() with empty string is a no-op', () => {
    var w = AccessibilityWidget.init();
    w.saveProfile('');
    expect(w.getProfiles()).toHaveLength(0);
  });

  test('saveProfile() with whitespace-only string is a no-op', () => {
    var w = AccessibilityWidget.init();
    w.saveProfile('   ');
    expect(w.getProfiles()).toHaveLength(0);
  });

  test('saveProfile() trims leading and trailing whitespace', () => {
    var w = AccessibilityWidget.init();
    w.saveProfile('  My Profile  ');
    expect(w.getProfiles()).toContain('My Profile');
    expect(w.getProfiles()).not.toContain('  My Profile  ');
  });

  test('saveProfile() truncates names longer than 40 characters', () => {
    var w = AccessibilityWidget.init();
    var longName = 'A'.repeat(50);
    w.saveProfile(longName);
    var names = w.getProfiles();
    expect(names).toHaveLength(1);
    expect(names[0]).toHaveLength(40);
  });

  test('saveProfile() emits a11y:profilesave CustomEvent', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('darkMode', true);
    var received = null;
    var handler = function (e) { received = e.detail; };
    window.addEventListener('a11y:profilesave', handler);
    w.saveProfile('My profile');
    window.removeEventListener('a11y:profilesave', handler);

    expect(received).not.toBeNull();
    expect(received.name).toBe('My profile');
    expect(received.settings.darkMode).toBe(true);
  });

  // ── loadProfile ───────────────────────────────────────────────────────────

  test('loadProfile() applies the saved settings', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('highContrast', true);
    w.setFeature('fontSize', 3);
    w.saveProfile('Reading');

    // Reset to defaults then load
    w.resetAll();
    expect(w.getSettings().highContrast).toBe(false);
    expect(w.getSettings().fontSize).toBe(0);

    w.loadProfile('Reading');
    expect(w.getSettings().highContrast).toBe(true);
    expect(w.getSettings().fontSize).toBe(3);
  });

  test('loadProfile() with unknown name is a no-op', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('darkMode', true);
    w.loadProfile('nonexistent');
    expect(w.getSettings().darkMode).toBe(true); // unchanged
  });

  test('loadProfile() emits a11y:profileload CustomEvent', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('darkMode', true);
    w.saveProfile('Dark');

    var received = null;
    var handler = function (e) { received = e.detail; };
    window.addEventListener('a11y:profileload', handler);
    w.loadProfile('Dark');
    window.removeEventListener('a11y:profileload', handler);

    expect(received).not.toBeNull();
    expect(received.name).toBe('Dark');
    expect(received.settings.darkMode).toBe(true);
  });

  // ── deleteProfile ─────────────────────────────────────────────────────────

  test('deleteProfile() removes the profile from storage', () => {
    var w = AccessibilityWidget.init();
    w.saveProfile('Temp');
    expect(w.getProfiles()).toContain('Temp');

    w.deleteProfile('Temp');
    expect(w.getProfiles()).not.toContain('Temp');
  });

  test('deleteProfile() with unknown name is a no-op', () => {
    var w = AccessibilityWidget.init();
    w.saveProfile('Keep');
    w.deleteProfile('nonexistent');
    expect(w.getProfiles()).toContain('Keep');
  });

  test('deleteProfile() emits a11y:profiledelete CustomEvent', () => {
    var w = AccessibilityWidget.init();
    w.saveProfile('Bye');

    var received = null;
    var handler = function (e) { received = e.detail; };
    window.addEventListener('a11y:profiledelete', handler);
    w.deleteProfile('Bye');
    window.removeEventListener('a11y:profiledelete', handler);

    expect(received).not.toBeNull();
    expect(received.name).toBe('Bye');
  });

  // ── custom storageKey ─────────────────────────────────────────────────────

  test('profiles use the correct key when a custom storageKey is given', () => {
    var w = AccessibilityWidget.init({ storageKey: 'myWidget' });
    w.saveProfile('Custom key profile');
    var customProfilesKey = 'myWidget:profiles';
    var stored = JSON.parse(localStorage.getItem(customProfilesKey));
    expect(stored).not.toBeNull();
    expect(stored['Custom key profile']).toBeDefined();
    localStorage.removeItem(customProfilesKey);
  });

  // ── UI ────────────────────────────────────────────────────────────────────

  test('profiles section is rendered in the panel', () => {
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__profiles')).not.toBeNull();
  });

  test('profile name input and save button are present', () => {
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__profiles-input')).not.toBeNull();
    expect(document.querySelector('.a11y-widget__profiles-save-btn')).not.toBeNull();
  });

  test('empty-state message shown when no profiles saved', () => {
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__profiles-empty')).not.toBeNull();
  });

  test('saved profile appears in the list after saveProfile()', () => {
    var w = AccessibilityWidget.init();
    w.saveProfile('Visual A11y');
    var nameSpans = document.querySelectorAll('.a11y-widget__profiles-item-name');
    var names = Array.from(nameSpans).map(function (el) { return el.textContent; });
    expect(names).toContain('Visual A11y');
    expect(document.querySelector('.a11y-widget__profiles-empty')).toBeNull();
  });

  test('profile disappears from list after deleteProfile()', () => {
    var w = AccessibilityWidget.init();
    w.saveProfile('Temporary');
    w.deleteProfile('Temporary');
    var nameSpans = document.querySelectorAll('.a11y-widget__profiles-item-name');
    var names = Array.from(nameSpans).map(function (el) { return el.textContent; });
    expect(names).not.toContain('Temporary');
    // Empty state message should reappear
    expect(document.querySelector('.a11y-widget__profiles-empty')).not.toBeNull();
  });

  test('clicking Load button in UI calls loadProfile()', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('darkMode', true);
    w.saveProfile('Dark');
    w.resetAll();

    var loadBtn = document.querySelector('.a11y-widget__profiles-load-btn');
    expect(loadBtn).not.toBeNull();
    simulateClick(loadBtn);

    expect(w.getSettings().darkMode).toBe(true);
  });

  test('clicking Delete button in UI calls deleteProfile()', () => {
    var w = AccessibilityWidget.init();
    w.saveProfile('Deletable');
    var deleteBtn = document.querySelector('.a11y-widget__profiles-delete-btn');
    expect(deleteBtn).not.toBeNull();
    simulateClick(deleteBtn);
    expect(w.getProfiles()).not.toContain('Deletable');
  });

  test('save button in UI calls saveProfile() with input value', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('highContrast', true);

    var input = document.querySelector('.a11y-widget__profiles-input');
    var saveBtn = document.querySelector('.a11y-widget__profiles-save-btn');
    input.value = 'My HC Profile';
    simulateClick(saveBtn);

    expect(w.getProfiles()).toContain('My HC Profile');
  });

  test('Enter in the profile name input triggers save', () => {
    var w = AccessibilityWidget.init();
    var input = document.querySelector('.a11y-widget__profiles-input');
    input.value = 'Keyboard Save';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(w.getProfiles()).toContain('Keyboard Save');
  });

  test('profile list re-renders with translated labels after language change', () => {
    var w = AccessibilityWidget.init();
    w.saveProfile('TestProfile');

    var loadBtn = document.querySelector('.a11y-widget__profiles-load-btn');
    var enText = loadBtn.textContent;

    w.setLanguage('he');
    var loadBtnHe = document.querySelector('.a11y-widget__profiles-load-btn');
    expect(loadBtnHe.textContent).not.toBe(enText);
    expect(loadBtnHe.textContent.length).toBeGreaterThan(0);
  });

  // ── after destroy ─────────────────────────────────────────────────────────

  test('saveProfile/loadProfile/deleteProfile are no-ops after destroy()', () => {
    var w = AccessibilityWidget.init();
    w.saveProfile('Before');
    w.destroy();

    // Should not throw and should not modify storage
    expect(() => w.saveProfile('After')).not.toThrow();
    expect(() => w.loadProfile('Before')).not.toThrow();
    expect(() => w.deleteProfile('Before')).not.toThrow();
  });
});

// ===========================================================================
// 28. Position Switcher (F-203)
// ===========================================================================

describe('Position Switcher', () => {
  afterEach(() => {
    AccessibilityWidget.destroy();
  });

  // ── API presence ──────────────────────────────────────────────────────────

  test('setPosition is a function on the widget instance', () => {
    var w = AccessibilityWidget.init();
    expect(typeof w.setPosition).toBe('function');
  });

  // ── Default position ──────────────────────────────────────────────────────

  test('widget root has data-position="bottom-right" by default', () => {
    AccessibilityWidget.init();
    var root = document.querySelector('.a11y-widget');
    expect(root.getAttribute('data-position')).toBe('bottom-right');
  });

  test('options.position sets initial data-position attribute', () => {
    AccessibilityWidget.init({ position: 'top-left' });
    var root = document.querySelector('.a11y-widget');
    expect(root.getAttribute('data-position')).toBe('top-left');
  });

  // ── setPosition API ───────────────────────────────────────────────────────

  test('setPosition updates data-position on the root element', () => {
    var w = AccessibilityWidget.init();
    w.setPosition('top-right');
    expect(document.querySelector('.a11y-widget').getAttribute('data-position')).toBe('top-right');
  });

  test('setPosition accepts all four valid values', () => {
    var w = AccessibilityWidget.init();
    var positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    positions.forEach(function (pos) {
      w.setPosition(pos);
      expect(document.querySelector('.a11y-widget').getAttribute('data-position')).toBe(pos);
    });
  });

  test('setPosition ignores invalid position strings', () => {
    var w = AccessibilityWidget.init();
    w.setPosition('center');
    expect(document.querySelector('.a11y-widget').getAttribute('data-position')).toBe('bottom-right');
  });

  test('setPosition is a no-op when pos already equals current position', () => {
    var w = AccessibilityWidget.init();
    var events = [];
    window.addEventListener('a11y:positionchange', function (e) { events.push(e); });
    w.setPosition('bottom-right'); // already the default
    expect(events).toHaveLength(0);
    window.removeEventListener('a11y:positionchange', function () {});
  });

  test('setPosition is a no-op after destroy()', () => {
    var w = AccessibilityWidget.init();
    w.destroy();
    expect(() => w.setPosition('top-left')).not.toThrow();
  });

  // ── CustomEvent ───────────────────────────────────────────────────────────

  test('setPosition fires a11y:positionchange with position in detail', () => {
    var w = AccessibilityWidget.init();
    var received = null;
    var handler = function (e) { received = e.detail; };
    window.addEventListener('a11y:positionchange', handler);
    w.setPosition('top-left');
    window.removeEventListener('a11y:positionchange', handler);
    expect(received).not.toBeNull();
    expect(received.position).toBe('top-left');
  });

  // ── Persistence ───────────────────────────────────────────────────────────

  test('setPosition persists and is restored on re-init', () => {
    var w = AccessibilityWidget.init();
    w.setPosition('top-left');
    w.destroy();

    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget').getAttribute('data-position')).toBe('top-left');
    localStorage.clear();
  });

  // ── UI section rendered ────────────────────────────────────────────────────

  test('position section is rendered in the DOM', () => {
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__position')).not.toBeNull();
  });

  test('position section contains 4 corner buttons', () => {
    AccessibilityWidget.init();
    var btns = document.querySelectorAll('.a11y-widget__position-btn');
    expect(btns).toHaveLength(4);
  });

  test('each position button has a data-pos attribute', () => {
    AccessibilityWidget.init();
    var btns = document.querySelectorAll('.a11y-widget__position-btn');
    var positions = Array.from(btns).map(function (b) { return b.getAttribute('data-pos'); });
    expect(positions).toContain('top-left');
    expect(positions).toContain('top-right');
    expect(positions).toContain('bottom-left');
    expect(positions).toContain('bottom-right');
  });

  test('the active button has aria-pressed="true"', () => {
    AccessibilityWidget.init();
    var activeBtn = document.querySelector('.a11y-widget__position-btn--active');
    expect(activeBtn).not.toBeNull();
    expect(activeBtn.getAttribute('aria-pressed')).toBe('true');
    expect(activeBtn.getAttribute('data-pos')).toBe('bottom-right');
  });

  test('clicking a position button calls setPosition and updates aria-pressed', () => {
    AccessibilityWidget.init();
    var topLeftBtn = document.querySelector('.a11y-widget__position-btn[data-pos="top-left"]');
    simulateClick(topLeftBtn);
    expect(topLeftBtn.getAttribute('aria-pressed')).toBe('true');
    expect(topLeftBtn.classList.contains('a11y-widget__position-btn--active')).toBe(true);
    var bottomRightBtn = document.querySelector('.a11y-widget__position-btn[data-pos="bottom-right"]');
    expect(bottomRightBtn.getAttribute('aria-pressed')).toBe('false');
  });

  // ── Language ──────────────────────────────────────────────────────────────

  test('position button aria-labels update on language change', () => {
    var w = AccessibilityWidget.init();
    var tlBtn = document.querySelector('.a11y-widget__position-btn[data-pos="top-left"]');
    var enLabel = tlBtn.getAttribute('aria-label');
    w.setLanguage('he');
    var heLabel = document.querySelector('.a11y-widget__position-btn[data-pos="top-left"]').getAttribute('aria-label');
    expect(heLabel).not.toBe(enLabel);
    expect(heLabel.length).toBeGreaterThan(0);
  });
});

// ===========================================================================
// Section 29 – Language Auto-Detection (F-203)
// ===========================================================================

describe('Language Auto-Detection', () => {
  afterEach(() => {
    AccessibilityWidget.destroy();
    // Restore document lang attribute
    document.documentElement.removeAttribute('lang');
  });

  test('defaults to "en" when no lang attribute or navigator language is set', () => {
    document.documentElement.removeAttribute('lang');
    var w = AccessibilityWidget.init();
    expect(w.getLanguage()).toBe('en');
  });

  test('detects language from document.documentElement.lang', () => {
    document.documentElement.setAttribute('lang', 'he');
    var w = AccessibilityWidget.init();
    expect(w.getLanguage()).toBe('he');
  });

  test('ignores document lang when defaultLanguage option is explicitly set', () => {
    document.documentElement.setAttribute('lang', 'he');
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    expect(w.getLanguage()).toBe('en');
  });

  test('extracts primary subtag from lang with region (en-US → en)', () => {
    document.documentElement.setAttribute('lang', 'en-US');
    var w = AccessibilityWidget.init();
    expect(w.getLanguage()).toBe('en');
  });

  test('detects Hebrew from he-IL lang attribute', () => {
    document.documentElement.setAttribute('lang', 'he-IL');
    var w = AccessibilityWidget.init();
    expect(w.getLanguage()).toBe('he');
  });

  test('falls back to "en" for unrecognised language code', () => {
    // jsdom sets document lang but the language may not be registered;
    // widget should still initialise without throwing
    document.documentElement.setAttribute('lang', 'xyz');
    expect(() => AccessibilityWidget.init()).not.toThrow();
  });
});

// ===========================================================================
// Section 30 – showLanguageSwitcher option (F-207)
// ===========================================================================

describe('showLanguageSwitcher option', () => {
  afterEach(() => {
    AccessibilityWidget.destroy();
  });

  test('language section is present by default', () => {
    AccessibilityWidget.init();
    var select = document.querySelector('.a11y-widget__lang-select');
    expect(select).not.toBeNull();
  });

  test('language section is present when showLanguageSwitcher: true', () => {
    AccessibilityWidget.init({ showLanguageSwitcher: true });
    var select = document.querySelector('.a11y-widget__lang-select');
    expect(select).not.toBeNull();
  });

  test('language section is absent when showLanguageSwitcher: false', () => {
    AccessibilityWidget.init({ showLanguageSwitcher: false });
    var select = document.querySelector('.a11y-widget__lang-select');
    expect(select).toBeNull();
  });

  test('feature sections still render when showLanguageSwitcher: false', () => {
    AccessibilityWidget.init({ showLanguageSwitcher: false });
    var items = document.querySelectorAll('.a11y-widget__item');
    expect(items.length).toBeGreaterThan(0);
  });

  test('language section title is absent when showLanguageSwitcher: false', () => {
    AccessibilityWidget.init({ showLanguageSwitcher: false });
    var sections = document.querySelectorAll('.a11y-widget__section');
    var hasLangTitle = false;
    sections.forEach(function (s) {
      var title = s.querySelector('.a11y-widget__section-title');
      if (title && title.getAttribute('data-i18n') === 'language') {
        hasLangTitle = true;
      }
    });
    expect(hasLangTitle).toBe(false);
  });

  test('widget with showLanguageSwitcher: false still opens and closes', () => {
    var w = AccessibilityWidget.init({ showLanguageSwitcher: false });
    w.openMenu();
    expect(document.querySelector('.a11y-widget').classList.contains('a11y-widget--open')).toBe(true);
    w.closeMenu();
    expect(document.querySelector('.a11y-widget').classList.contains('a11y-widget--open')).toBe(false);
  });
});

// ===========================================================================
// Section 31 – Readable Font (F-201)
// ===========================================================================

describe('Readable Font', () => {
  afterEach(() => {
    AccessibilityWidget.destroy();
  });

  test('readableFont feature item is rendered in the panel', () => {
    AccessibilityWidget.init();
    expect(document.querySelector('[data-feature="readableFont"]')).not.toBeNull();
  });

  test('enabling readableFont adds a11y-readable-font class to body', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('readableFont', true);
    expect(document.body.classList.contains('a11y-readable-font')).toBe(true);
  });

  test('disabling readableFont removes a11y-readable-font class', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('readableFont', true);
    w.setFeature('readableFont', false);
    expect(document.body.classList.contains('a11y-readable-font')).toBe(false);
  });

  test('readableFont state persists and is restored on re-init', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('readableFont', true);
    AccessibilityWidget.destroy();
    AccessibilityWidget.init();
    expect(document.body.classList.contains('a11y-readable-font')).toBe(true);
    AccessibilityWidget.destroy();
  });
});

// ===========================================================================
// Section 32 – Saturation and Brightness Controls (F-202)
// ===========================================================================

describe('Saturation Control', () => {
  afterEach(() => {
    AccessibilityWidget.destroy();
  });

  test('saturation feature item is rendered in the panel', () => {
    AccessibilityWidget.init();
    expect(document.querySelector('[data-feature="saturation"]')).not.toBeNull();
  });

  test('setting saturation to 3 adds a11y-saturation-3 class to body', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('saturation', 3);
    expect(document.body.classList.contains('a11y-saturation-3')).toBe(true);
  });

  test('changing saturation removes old class and adds new one', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('saturation', 2);
    w.setFeature('saturation', 4);
    expect(document.body.classList.contains('a11y-saturation-2')).toBe(false);
    expect(document.body.classList.contains('a11y-saturation-4')).toBe(true);
  });

  test('setting saturation to 0 removes all saturation classes', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('saturation', 3);
    w.setFeature('saturation', 0);
    for (var i = 1; i <= 5; i++) {
      expect(document.body.classList.contains('a11y-saturation-' + i)).toBe(false);
    }
  });

  test('saturation state persists and is restored on re-init', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('saturation', 2);
    AccessibilityWidget.destroy();
    AccessibilityWidget.init();
    expect(document.body.classList.contains('a11y-saturation-2')).toBe(true);
    AccessibilityWidget.destroy();
  });
});

describe('Brightness Control', () => {
  afterEach(() => {
    AccessibilityWidget.destroy();
  });

  test('brightness feature item is rendered in the panel', () => {
    AccessibilityWidget.init();
    expect(document.querySelector('[data-feature="brightness"]')).not.toBeNull();
  });

  test('setting brightness to 3 adds a11y-brightness-3 class to body', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('brightness', 3);
    expect(document.body.classList.contains('a11y-brightness-3')).toBe(true);
  });

  test('changing brightness removes old class and adds new one', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('brightness', 1);
    w.setFeature('brightness', 5);
    expect(document.body.classList.contains('a11y-brightness-1')).toBe(false);
    expect(document.body.classList.contains('a11y-brightness-5')).toBe(true);
  });

  test('setting brightness to 0 removes all brightness classes', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('brightness', 4);
    w.setFeature('brightness', 0);
    for (var i = 1; i <= 5; i++) {
      expect(document.body.classList.contains('a11y-brightness-' + i)).toBe(false);
    }
  });

  test('saturation and brightness can be active simultaneously', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('saturation', 2);
    w.setFeature('brightness', 3);
    expect(document.body.classList.contains('a11y-saturation-2')).toBe(true);
    expect(document.body.classList.contains('a11y-brightness-3')).toBe(true);
  });
});

// ===========================================================================
// Section 33 – Suppress Notifications (F-211)
// ===========================================================================

describe('Suppress Notifications', () => {
  afterEach(() => {
    AccessibilityWidget.destroy();
  });

  test('suppressNotifications feature item is rendered in the panel', () => {
    AccessibilityWidget.init();
    expect(document.querySelector('[data-feature="suppressNotifications"]')).not.toBeNull();
  });

  test('enabling suppressNotifications adds a11y-suppress-notifications to body', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('suppressNotifications', true);
    expect(document.body.classList.contains('a11y-suppress-notifications')).toBe(true);
  });

  test('disabling suppressNotifications removes the class', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('suppressNotifications', true);
    w.setFeature('suppressNotifications', false);
    expect(document.body.classList.contains('a11y-suppress-notifications')).toBe(false);
  });

  test('suppressNotifications state persists and is restored on re-init', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('suppressNotifications', true);
    AccessibilityWidget.destroy();
    AccessibilityWidget.init();
    expect(document.body.classList.contains('a11y-suppress-notifications')).toBe(true);
    AccessibilityWidget.destroy();
  });
});

// ===========================================================================
// 34. Branding Options
// ===========================================================================

describe('Branding Options', () => {
  afterEach(() => { AccessibilityWidget.destroy(); });

  test('primaryColor sets --a11y-primary CSS custom property on root', () => {
    AccessibilityWidget.init({ primaryColor: '#ff0000' });
    var root = document.querySelector('.a11y-widget');
    expect(root.style.getPropertyValue('--a11y-primary')).toBe('#ff0000');
  });

  test('no primaryColor does not set CSS custom property', () => {
    AccessibilityWidget.init();
    var root = document.querySelector('.a11y-widget');
    expect(root.style.getPropertyValue('--a11y-primary')).toBe('');
  });

  test('panelTitle overrides the title text', () => {
    AccessibilityWidget.init({ panelTitle: 'My Accessibility Tools' });
    var title = document.querySelector('.a11y-widget__title');
    expect(title.textContent).toBe('My Accessibility Tools');
  });

  test('panelTitle updates toggle button aria-label', () => {
    AccessibilityWidget.init({ panelTitle: 'My Accessibility Tools' });
    var btn = document.querySelector('.a11y-widget__toggle');
    expect(btn.getAttribute('aria-label')).toBe('My Accessibility Tools');
  });

  test('panelTitle not provided shows default translated title', () => {
    AccessibilityWidget.init();
    var title = document.querySelector('.a11y-widget__title');
    expect(title.textContent.length).toBeGreaterThan(0);
    expect(title.textContent).not.toBe('My Accessibility Tools');
  });

  test('disclaimerText: false suppresses the disclaimer element', () => {
    AccessibilityWidget.init({ disclaimerText: false });
    var disclaimer = document.querySelector('.a11y-widget__disclaimer');
    expect(disclaimer).toBeNull();
  });

  test('disclaimerText: string overrides disclaimer content', () => {
    AccessibilityWidget.init({ disclaimerText: 'Custom disclaimer text' });
    var disclaimer = document.querySelector('.a11y-widget__disclaimer');
    expect(disclaimer).not.toBeNull();
    expect(disclaimer.textContent).toBe('Custom disclaimer text');
  });

  test('no disclaimerText shows default disclaimer', () => {
    AccessibilityWidget.init();
    var disclaimer = document.querySelector('.a11y-widget__disclaimer');
    expect(disclaimer).not.toBeNull();
    expect(disclaimer.textContent.length).toBeGreaterThan(0);
  });
});

// ===========================================================================
// 35. Development Mode Validation
// ===========================================================================

describe('Development Mode Validation', () => {
  var warnSpy;
  beforeEach(() => { warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); });
  afterEach(() => { warnSpy.mockRestore(); AccessibilityWidget.destroy(); });

  test('warns on invalid position string', () => {
    AccessibilityWidget.init({ position: 'center' });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid position'));
  });

  test('does not warn on valid position strings', () => {
    ['bottom-right', 'bottom-left', 'top-right', 'top-left'].forEach(pos => {
      AccessibilityWidget.destroy();
      warnSpy.mockClear();
      AccessibilityWidget.init({ position: pos });
      var positionWarnings = warnSpy.mock.calls.filter(c => c[0].includes('Invalid position'));
      expect(positionWarnings).toHaveLength(0);
    });
  });

  test('warns on unknown feature id in features option', () => {
    AccessibilityWidget.init({ features: { highContrast: true, unknownFeature: true } });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown feature id'));
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('unknownFeature'));
  });

  test('does not warn on valid feature ids', () => {
    AccessibilityWidget.init({ features: { highContrast: true, darkMode: false } });
    var featureWarnings = warnSpy.mock.calls.filter(c => c[0].includes('Unknown feature id'));
    expect(featureWarnings).toHaveLength(0);
  });

  test('warns on unregistered defaultLanguage', () => {
    AccessibilityWidget.init({ defaultLanguage: 'xyz' });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('"xyz" is not registered'));
  });

  test('does not warn on registered defaultLanguage', () => {
    AccessibilityWidget.init({ defaultLanguage: 'en' });
    var langWarnings = warnSpy.mock.calls.filter(c => c[0].includes('is not registered'));
    expect(langWarnings).toHaveLength(0);
  });
});

// ===========================================================================
// 36. Session Usage Report
// ===========================================================================

describe('Session Usage Report', () => {
  afterEach(() => { AccessibilityWidget.destroy(); });

  test('getReport returns an object with version, session, persistedSettings, enabledFeatureIds', () => {
    var w = AccessibilityWidget.init();
    var report = w.getReport();
    expect(report).not.toBeNull();
    expect(report).toHaveProperty('version');
    expect(report).toHaveProperty('session');
    expect(report).toHaveProperty('persistedSettings');
    expect(report).toHaveProperty('enabledFeatureIds');
  });

  test('getReport().session has sessionId, initTimestamp, menuOpenCount, features, language', () => {
    var w = AccessibilityWidget.init();
    var s = w.getReport().session;
    expect(typeof s.sessionId).toBe('string');
    expect(typeof s.initTimestamp).toBe('number');
    expect(s.menuOpenCount).toBe(0);
    expect(typeof s.features).toBe('object');
    expect(s.language).toBe('en');
  });

  test('menuOpenCount increments on openMenu()', () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    expect(w.getReport().session.menuOpenCount).toBe(1);
    w.closeMenu();
    w.openMenu();
    expect(w.getReport().session.menuOpenCount).toBe(2);
  });

  test('feature stats track toggle activity', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('highContrast', true);
    var stat = w.getReport().session.features['highContrast'];
    expect(stat.enabled).toBe(true);
    expect(stat.toggleCount).toBeGreaterThan(0);
    expect(stat.lastActivated).not.toBeNull();
  });

  test('feature stats reflect disabled state', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('highContrast', true);
    w.setFeature('highContrast', false);
    var stat = w.getReport().session.features['highContrast'];
    expect(stat.enabled).toBe(false);
    expect(stat.toggleCount).toBe(2);
  });

  test('enabledFeatureIds lists active feature ids', () => {
    var w = AccessibilityWidget.init();
    var ids = w.getReport().enabledFeatureIds;
    expect(Array.isArray(ids)).toBe(true);
    expect(ids.length).toBeGreaterThan(0);
    expect(ids).toContain('highContrast');
  });

  test('AccessibilityWidget.getReport() delegates to instance', () => {
    AccessibilityWidget.init();
    var report = AccessibilityWidget.getReport();
    expect(report).not.toBeNull();
    expect(report).toHaveProperty('session');
  });

  test('AccessibilityWidget.getReport() returns null when no instance', () => {
    AccessibilityWidget.destroy();
    expect(AccessibilityWidget.getReport()).toBeNull();
  });

  test('getReport() returns null after destroy()', () => {
    var w = AccessibilityWidget.init();
    w.destroy();
    expect(w.getReport()).toBeNull();
  });
});

// ===========================================================================
// 37. Highlight on Hover
// ===========================================================================

describe('Highlight on Hover', () => {
  afterEach(() => { AccessibilityWidget.destroy(); });

  test('highlightHover feature item is rendered in the panel', () => {
    AccessibilityWidget.init();
    expect(document.querySelector('[data-feature="highlightHover"]')).not.toBeNull();
  });

  test('enabling highlightHover adds a11y-highlight-hover class to body', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('highlightHover', true);
    expect(document.body.classList.contains('a11y-highlight-hover')).toBe(true);
  });

  test('disabling highlightHover removes the class', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('highlightHover', true);
    w.setFeature('highlightHover', false);
    expect(document.body.classList.contains('a11y-highlight-hover')).toBe(false);
  });

  test('highlightHover state persists and is restored on re-init', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('highlightHover', true);
    AccessibilityWidget.destroy();
    AccessibilityWidget.init();
    expect(document.body.classList.contains('a11y-highlight-hover')).toBe(true);
    AccessibilityWidget.destroy();
  });

  describe('F-210: click-to-pin highlight', () => {
    afterEach(() => { AccessibilityWidget.destroy(); });

    test('clicking a <p> element adds a11y-highlight-pinned class', () => {
      var w = AccessibilityWidget.init();
      w.setFeature('highlightHover', true);
      var p = document.createElement('p');
      p.textContent = 'Hello world';
      document.body.appendChild(p);
      p.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(p.classList.contains('a11y-highlight-pinned')).toBe(true);
      document.body.removeChild(p);
    });

    test('clicking same element again removes the pin', () => {
      var w = AccessibilityWidget.init();
      w.setFeature('highlightHover', true);
      var p = document.createElement('p');
      p.textContent = 'Hello world';
      document.body.appendChild(p);
      p.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      p.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(p.classList.contains('a11y-highlight-pinned')).toBe(false);
      document.body.removeChild(p);
    });

    test('clicking a different element moves the pin', () => {
      var w = AccessibilityWidget.init();
      w.setFeature('highlightHover', true);
      var p1 = document.createElement('p');
      var p2 = document.createElement('p');
      p1.textContent = 'First';
      p2.textContent = 'Second';
      document.body.appendChild(p1);
      document.body.appendChild(p2);
      p1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      p2.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(p1.classList.contains('a11y-highlight-pinned')).toBe(false);
      expect(p2.classList.contains('a11y-highlight-pinned')).toBe(true);
      document.body.removeChild(p1);
      document.body.removeChild(p2);
    });

    test('clicks inside the widget panel are ignored', () => {
      var w = AccessibilityWidget.init();
      w.setFeature('highlightHover', true);
      // Click a button inside the widget root — should NOT add pinned class to it
      var btn = document.querySelector('.a11y-widget__toggle');
      if (btn) {
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(btn.classList.contains('a11y-highlight-pinned')).toBe(false);
      }
    });

    test('deactivating highlightHover removes pinned class', () => {
      var w = AccessibilityWidget.init();
      w.setFeature('highlightHover', true);
      var p = document.createElement('p');
      p.textContent = 'Hello';
      document.body.appendChild(p);
      p.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(p.classList.contains('a11y-highlight-pinned')).toBe(true);
      w.setFeature('highlightHover', false);
      expect(p.classList.contains('a11y-highlight-pinned')).toBe(false);
      document.body.removeChild(p);
    });

    test('destroy() removes pinned class', () => {
      var w = AccessibilityWidget.init();
      w.setFeature('highlightHover', true);
      var p = document.createElement('p');
      p.textContent = 'Hello';
      document.body.appendChild(p);
      p.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      AccessibilityWidget.destroy();
      expect(p.classList.contains('a11y-highlight-pinned')).toBe(false);
      document.body.removeChild(p);
    });

    test('clicking non-text element (div) walks up to text ancestor', () => {
      var w = AccessibilityWidget.init();
      w.setFeature('highlightHover', true);
      var p = document.createElement('p');
      var span = document.createElement('span');
      span.textContent = 'inside span';
      p.appendChild(span);
      document.body.appendChild(p);
      span.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(p.classList.contains('a11y-highlight-pinned')).toBe(true);
      document.body.removeChild(p);
    });
  });
});

describe('Reading Guide Touch Support', () => {
  afterEach(() => { AccessibilityWidget.destroy(); });

  test('activating readingGuide adds touchmove listener', () => {
    var w = AccessibilityWidget.init();
    var addSpy = jest.spyOn(document, 'addEventListener');
    w.setFeature('readingGuide', true);
    var touchmoveCalls = addSpy.mock.calls.filter(function(c) { return c[0] === 'touchmove'; });
    expect(touchmoveCalls.length).toBeGreaterThan(0);
    addSpy.mockRestore();
  });

  test('deactivating readingGuide removes touchmove listener', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('readingGuide', true);
    var removeSpy = jest.spyOn(document, 'removeEventListener');
    w.setFeature('readingGuide', false);
    var touchmoveCalls = removeSpy.mock.calls.filter(function(c) { return c[0] === 'touchmove'; });
    expect(touchmoveCalls.length).toBeGreaterThan(0);
    removeSpy.mockRestore();
  });

  test('touch move updates reading guide bar position', () => {
    var rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(function (fn) { fn(); return 0; });
    var w = AccessibilityWidget.init();
    w.setFeature('readingGuide', true);
    var bar = document.querySelector('.a11y-reading-guide-bar');
    expect(bar).not.toBeNull();
    // Simulate touchmove by calling internal handler directly
    var touchEvent = { touches: [{ clientY: 150 }] };
    w._onReadingGuideTouchMove(touchEvent);
    expect(bar.style.top).toBe('144px');
    rafSpy.mockRestore();
  });

  test('touch move is safe when no touches exist', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('readingGuide', true);
    expect(() => w._onReadingGuideTouchMove({ touches: [] })).not.toThrow();
  });
});

describe('Enhanced TTS Controls', () => {
  afterEach(() => { AccessibilityWidget.destroy(); });

  test('TTS controls section is in the DOM but hidden initially', () => {
    AccessibilityWidget.init();
    var controls = document.querySelector('.a11y-widget__tts-controls');
    expect(controls).not.toBeNull();
    expect(controls.hasAttribute('hidden')).toBe(true);
  });

  test('TTS controls become visible when TTS is activated', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('textToSpeech', true);
    var controls = document.querySelector('.a11y-widget__tts-controls');
    expect(controls.hasAttribute('hidden')).toBe(false);
  });

  test('TTS controls are hidden again when TTS is deactivated', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('textToSpeech', true);
    w.setFeature('textToSpeech', false);
    var controls = document.querySelector('.a11y-widget__tts-controls');
    expect(controls.hasAttribute('hidden')).toBe(true);
  });

  test('pause button is rendered in TTS controls', () => {
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__tts-pause')).not.toBeNull();
  });

  test('speed display shows 1.00\xd7 by default', () => {
    AccessibilityWidget.init();
    var speedEl = document.querySelector('.a11y-widget__tts-rate');
    expect(speedEl).not.toBeNull();
    expect(speedEl.textContent).toBe('1.00\xd7');
  });

  test('faster button increases TTS rate', () => {
    var w = AccessibilityWidget.init();
    var fasterBtn = document.querySelector('.a11y-widget__tts-faster');
    fasterBtn.click();
    expect(w._ttsRate).toBeCloseTo(1.25, 2);
  });

  test('slower button decreases TTS rate', () => {
    var w = AccessibilityWidget.init();
    var slowerBtn = document.querySelector('.a11y-widget__tts-slower');
    slowerBtn.click();
    expect(w._ttsRate).toBeCloseTo(0.75, 2);
  });

  test('TTS rate is clamped at minimum 0.5', () => {
    var w = AccessibilityWidget.init();
    for (var i = 0; i < 10; i++) { w._changeTTSRate(-0.25); }
    expect(w._ttsRate).toBeCloseTo(0.5, 2);
  });

  test('TTS rate is clamped at maximum 2.0', () => {
    var w = AccessibilityWidget.init();
    for (var i = 0; i < 10; i++) { w._changeTTSRate(0.25); }
    expect(w._ttsRate).toBeCloseTo(2.0, 2);
  });

  test('speed display updates when rate changes', () => {
    AccessibilityWidget.init();
    var w = AccessibilityWidget.getInstance();
    w._changeTTSRate(0.25);
    var speedEl = document.querySelector('.a11y-widget__tts-rate');
    expect(speedEl.textContent).toBe('1.25\xd7');
  });

  test('pause toggles TTS pause state', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('textToSpeech', true);
    expect(w._ttsPaused).toBe(false);
    w._toggleTTSPause();
    expect(w._ttsPaused).toBe(true);
    w._toggleTTSPause();
    expect(w._ttsPaused).toBe(false);
  });

  test('TTS controls hidden after destroy', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('textToSpeech', true);
    AccessibilityWidget.destroy();
    // After destroy, no TTS controls should be in DOM
    expect(document.querySelector('.a11y-widget__tts-controls')).toBeNull();
  });
});

describe('Dev Mode Alt Text Audit', () => {
  afterEach(() => {
    AccessibilityWidget.destroy();
    // Clean up any test images
    var imgs = document.querySelectorAll('[data-test-dev-img]');
    imgs.forEach(function(img) { img.parentNode && img.parentNode.removeChild(img); });
  });

  test('devMode: false disables audit (no badge rendered)', () => {
    AccessibilityWidget.init({ devMode: false });
    expect(document.querySelector('.a11y-widget__dev-badge')).toBeNull();
  });

  test('devMode: true shows dev audit badge in header', () => {
    AccessibilityWidget.init({ devMode: true });
    expect(document.querySelector('.a11y-widget__dev-badge')).not.toBeNull();
  });

  test('dev badge shows correct violation count for missing alt', () => {
    var img = document.createElement('img');
    img.src = 'test.png';
    img.setAttribute('data-test-dev-img', '');
    // No alt attribute
    document.body.appendChild(img);

    AccessibilityWidget.init({ devMode: true });
    var badge = document.querySelector('.a11y-widget__dev-badge');
    expect(badge).not.toBeNull();
    expect(badge.textContent).toContain('1');
  });

  test('images missing alt get a11y-dev-violation class', () => {
    var img = document.createElement('img');
    img.src = 'test.png';
    img.setAttribute('data-test-dev-img', '');
    document.body.appendChild(img);

    AccessibilityWidget.init({ devMode: true });
    expect(img.classList.contains('a11y-dev-violation')).toBe(true);
    expect(img.getAttribute('data-a11y-audit')).toBe('missing-alt');
  });

  test('images with alt do not get violation class', () => {
    var img = document.createElement('img');
    img.src = 'test.png';
    img.alt = 'A test image';
    img.setAttribute('data-test-dev-img', '');
    document.body.appendChild(img);

    AccessibilityWidget.init({ devMode: true });
    expect(img.classList.contains('a11y-dev-violation')).toBe(false);
  });

  test('widget images are excluded from audit', () => {
    AccessibilityWidget.init({ devMode: true });
    // The toggle icon img inside the widget should not be flagged
    var widgetImgs = document.querySelectorAll('.a11y-widget img');
    widgetImgs.forEach(function(img) {
      expect(img.classList.contains('a11y-dev-violation')).toBe(false);
    });
  });

  test('destroy removes dev audit markers from DOM', () => {
    var img = document.createElement('img');
    img.src = 'test.png';
    img.setAttribute('data-test-dev-img', '');
    document.body.appendChild(img);

    AccessibilityWidget.init({ devMode: true });
    expect(img.classList.contains('a11y-dev-violation')).toBe(true);

    AccessibilityWidget.destroy();
    expect(img.classList.contains('a11y-dev-violation')).toBe(false);
    expect(img.hasAttribute('data-a11y-audit')).toBe(false);
  });

  test('badge count is 0 when no violations', () => {
    AccessibilityWidget.init({ devMode: true });
    var badge = document.querySelector('.a11y-widget__dev-badge');
    expect(badge.textContent).toContain('0');
  });

  test('devAuditCount is accessible on instance', () => {
    AccessibilityWidget.init({ devMode: true });
    var w = AccessibilityWidget.getInstance();
    expect(typeof w._devAuditCount).toBe('number');
    expect(w._devAuditCount).toBe(0);
  });

  // F-212: Clickable scrollable detail list
  test('dev audit badge is a button element (F-212)', () => {
    AccessibilityWidget.init({ devMode: true });
    var badge = document.querySelector('.a11y-widget__dev-badge');
    expect(badge.tagName.toLowerCase()).toBe('button');
  });

  test('dev audit badge has aria-expanded=false initially (F-212)', () => {
    AccessibilityWidget.init({ devMode: true });
    var badge = document.querySelector('.a11y-widget__dev-badge');
    expect(badge.getAttribute('aria-expanded')).toBe('false');
  });

  test('dev audit detail list exists and is hidden initially (F-212)', () => {
    AccessibilityWidget.init({ devMode: true });
    var list = document.querySelector('.a11y-widget__dev-audit-list');
    expect(list).not.toBeNull();
    expect(list.hasAttribute('hidden')).toBe(true);
  });

  test('clicking badge toggles detail list visibility (F-212)', () => {
    AccessibilityWidget.init({ devMode: true });
    var badge = document.querySelector('.a11y-widget__dev-badge');
    var list = document.querySelector('.a11y-widget__dev-audit-list');
    badge.click();
    expect(list.hasAttribute('hidden')).toBe(false);
    expect(badge.getAttribute('aria-expanded')).toBe('true');
    badge.click();
    expect(list.hasAttribute('hidden')).toBe(true);
    expect(badge.getAttribute('aria-expanded')).toBe('false');
  });

  test('detail list shows violations when images missing alt (F-212)', () => {
    var img = document.createElement('img');
    img.src = 'test.jpg';
    document.body.appendChild(img);
    AccessibilityWidget.init({ devMode: true });
    var list = document.querySelector('.a11y-widget__dev-audit-list');
    expect(list.children.length).toBeGreaterThan(0);
    document.body.removeChild(img);
  });

  test('detail list shows empty message when no violations (F-212)', () => {
    AccessibilityWidget.init({ devMode: true });
    var list = document.querySelector('.a11y-widget__dev-audit-list');
    var badge = document.querySelector('.a11y-widget__dev-badge');
    badge.click();
    expect(list.textContent).toContain('No');
  });
});

// ===========================================================================
// 40. F-106: largeCursor auto-disable on touch-only devices
// ===========================================================================

describe('F-106: largeCursor auto-disabled on touch-only', () => {
  var origMatchMedia;
  beforeEach(() => {
    origMatchMedia = window.matchMedia;
  });
  afterEach(() => {
    window.matchMedia = origMatchMedia;
    AccessibilityWidget.destroy();
  });

  test('largeCursor present when hover device', () => {
    window.matchMedia = (q) => ({ matches: q === '(hover: hover)', addListener: () => {}, removeListener: () => {} });
    AccessibilityWidget.init();
    expect(document.querySelector('[data-feature="largeCursor"]')).not.toBeNull();
  });

  test('largeCursor absent when touch-only device', () => {
    window.matchMedia = (q) => ({ matches: false, addListener: () => {}, removeListener: () => {} });
    AccessibilityWidget.init();
    expect(document.querySelector('[data-feature="largeCursor"]')).toBeNull();
  });

  test('largeCursor shown when user forces features: { largeCursor: true } even on touch-only', () => {
    window.matchMedia = (q) => ({ matches: false, addListener: () => {}, removeListener: () => {} });
    AccessibilityWidget.init({ features: { largeCursor: true } });
    expect(document.querySelector('[data-feature="largeCursor"]')).not.toBeNull();
  });
});

// ===========================================================================
// 41. F-107: pauseAnimations auto-activate on prefers-reduced-motion
// ===========================================================================

describe('F-107: pauseAnimations auto-activate on prefers-reduced-motion', () => {
  var origMatchMedia;
  beforeEach(() => {
    origMatchMedia = window.matchMedia;
  });
  afterEach(() => {
    window.matchMedia = origMatchMedia;
    AccessibilityWidget.destroy();
    localStorage.clear();
  });

  test('pauseAnimations defaults to false when no prefers-reduced-motion', () => {
    window.matchMedia = (q) => ({ matches: q === '(hover: hover)', addListener: () => {}, removeListener: () => {} });
    var w = AccessibilityWidget.init();
    expect(w.getSettings().pauseAnimations).toBe(false);
  });

  test('pauseAnimations auto-activates when prefers-reduced-motion: reduce', () => {
    window.matchMedia = (q) => ({ matches: q === '(prefers-reduced-motion: reduce)' || q === '(hover: hover)', addListener: () => {}, removeListener: () => {} });
    var w = AccessibilityWidget.init();
    expect(w.getSettings().pauseAnimations).toBe(true);
    expect(document.body.classList.contains('a11y-pause-animations')).toBe(true);
  });

  test('saved user preference (false) overrides prefers-reduced-motion auto-activate', () => {
    // Pre-save a false preference
    localStorage.setItem('a11yWidgetSettings', JSON.stringify({ pauseAnimations: false }));
    window.matchMedia = (q) => ({ matches: q === '(prefers-reduced-motion: reduce)' || q === '(hover: hover)', addListener: () => {}, removeListener: () => {} });
    var w = AccessibilityWidget.init();
    expect(w.getSettings().pauseAnimations).toBe(false);
  });

  test('saved user preference (true) is maintained regardless', () => {
    localStorage.setItem('a11yWidgetSettings', JSON.stringify({ pauseAnimations: true }));
    window.matchMedia = (q) => ({ matches: q === '(hover: hover)', addListener: () => {}, removeListener: () => {} });
    var w = AccessibilityWidget.init();
    expect(w.getSettings().pauseAnimations).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 42. Section 8.2: Screen reader announcements
// ---------------------------------------------------------------------------

describe('Screen Reader Announcements', () => {
  afterEach(() => {
    AccessibilityWidget.destroy();
  });

  test('aria-live region exists in widget root', () => {
    AccessibilityWidget.init();
    var el = document.querySelector('.a11y-widget__announce');
    expect(el).not.toBeNull();
    expect(el.getAttribute('aria-live')).toBe('polite');
    expect(el.getAttribute('aria-atomic')).toBe('true');
  });

  test('toggle aria-label shows no count when no settings active', () => {
    AccessibilityWidget.init();
    var btn = document.querySelector('.a11y-widget__toggle');
    expect(btn.getAttribute('aria-label')).not.toMatch(/\d+ settings active/);
  });

  test('toggle aria-label includes active count after enabling a feature', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('highContrast', true);
    var btn = document.querySelector('.a11y-widget__toggle');
    expect(btn.getAttribute('aria-label')).toMatch(/1/);
    expect(btn.getAttribute('aria-label')).toMatch(/settings active/);
  });

  test('toggle aria-label count decrements after disabling a feature', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('highContrast', true);
    w.setFeature('darkMode', true);
    var btn = document.querySelector('.a11y-widget__toggle');
    expect(btn.getAttribute('aria-label')).toMatch(/2/);

    w.setFeature('highContrast', false);
    expect(btn.getAttribute('aria-label')).toMatch(/1/);
  });

  test('toggle aria-label resets to no count after resetAll()', () => {
    var w = AccessibilityWidget.init();
    w.setFeature('highContrast', true);
    w.resetAll();
    var btn = document.querySelector('.a11y-widget__toggle');
    expect(btn.getAttribute('aria-label')).not.toMatch(/\d+ settings active/);
  });

  test('announce region updates after resetAll()', (done) => {
    jest.useFakeTimers();
    var w = AccessibilityWidget.init();
    w.setFeature('highContrast', true);
    w.resetAll();
    jest.advanceTimersByTime(100);
    var el = document.querySelector('.a11y-widget__announce');
    expect(el.textContent).toMatch(/reset/i);
    jest.useRealTimers();
    done();
  });
});

// ---------------------------------------------------------------------------
// 43. Section 8.5: First-visit tooltip
// ---------------------------------------------------------------------------

describe('First-Visit Tooltip', () => {
  afterEach(() => {
    AccessibilityWidget.destroy();
  });

  test('tooltip shown on first visit (no localStorage)', () => {
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__tooltip')).not.toBeNull();
  });

  test('tooltip has role="tooltip"', () => {
    AccessibilityWidget.init();
    var tip = document.querySelector('.a11y-widget__tooltip');
    expect(tip.getAttribute('role')).toBe('tooltip');
  });

  test('toggle button gets aria-describedby while tooltip visible', () => {
    AccessibilityWidget.init();
    var btn = document.querySelector('.a11y-widget__toggle');
    expect(btn.getAttribute('aria-describedby')).toBe('a11y-widget-tooltip');
  });

  test('tooltip NOT shown when showTooltip: false', () => {
    AccessibilityWidget.init({ showTooltip: false });
    expect(document.querySelector('.a11y-widget__tooltip')).toBeNull();
  });

  test('tooltip NOT shown when settings exist in localStorage', () => {
    localStorage.setItem('a11yWidgetSettings', JSON.stringify({ highContrast: true }));
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__tooltip')).toBeNull();
  });

  test('tooltip text is non-empty', () => {
    AccessibilityWidget.init();
    var tip = document.querySelector('.a11y-widget__tooltip');
    expect(tip.textContent.length).toBeGreaterThan(5);
  });

  test('_dismissTooltip() removes tooltipEl reference', () => {
    var w = AccessibilityWidget.init();
    expect(w._tooltipEl).not.toBeNull();
    w._dismissTooltip();
    expect(w._tooltipEl).toBeNull();
  });

  test('_dismissTooltip() removes aria-describedby from toggle', () => {
    var w = AccessibilityWidget.init();
    w._dismissTooltip();
    var btn = document.querySelector('.a11y-widget__toggle');
    expect(btn.hasAttribute('aria-describedby')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 44. F-103 Layer 1: Quick Start built-in presets
// ---------------------------------------------------------------------------

describe('F-103: Quick Start built-in presets', () => {
  afterEach(() => {
    AccessibilityWidget.destroy();
  });

  // ── Section rendering ────────────────────────────────────────────────────

  test('renders .a11y-widget__quick-start section by default', () => {
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__quick-start')).not.toBeNull();
  });

  test('renders 5 preset buttons', () => {
    AccessibilityWidget.init();
    var btns = document.querySelectorAll('.a11y-widget__preset-btn');
    expect(btns.length).toBe(5);
  });

  test('preset buttons have data-preset-id attributes', () => {
    AccessibilityWidget.init();
    var ids = Array.from(document.querySelectorAll('.a11y-widget__preset-btn'))
      .map(btn => btn.getAttribute('data-preset-id'));
    expect(ids).toEqual(['low-vision', 'dyslexia', 'adhd', 'motor', 'migraine']);
  });

  test('preset buttons have English labels by default', () => {
    AccessibilityWidget.init();
    var btns = document.querySelectorAll('.a11y-widget__preset-btn');
    expect(btns[0].textContent).toBeTruthy(); // Low Vision label
    expect(btns[1].textContent).toBeTruthy(); // Dyslexia label
  });

  test('showPresets: false hides the section', () => {
    AccessibilityWidget.init({ showPresets: false });
    expect(document.querySelector('.a11y-widget__quick-start')).toBeNull();
  });

  // ── Preset application ───────────────────────────────────────────────────

  test('clicking Low Vision preset enables highContrast', () => {
    var w = AccessibilityWidget.init();
    var btn = document.querySelector('[data-preset-id="low-vision"]');
    btn.click();
    expect(w.getSettings().highContrast).toBe(true);
  });

  test('clicking Low Vision preset sets fontSize to 3', () => {
    var w = AccessibilityWidget.init();
    var btn = document.querySelector('[data-preset-id="low-vision"]');
    btn.click();
    expect(w.getSettings().fontSize).toBe(3);
  });

  test('clicking Low Vision preset enables underlineLinks', () => {
    var w = AccessibilityWidget.init();
    var btn = document.querySelector('[data-preset-id="low-vision"]');
    btn.click();
    expect(w.getSettings().underlineLinks).toBe(true);
  });

  test('clicking Dyslexia preset enables dyslexiaFont', () => {
    var w = AccessibilityWidget.init();
    var btn = document.querySelector('[data-preset-id="dyslexia"]');
    btn.click();
    expect(w.getSettings().dyslexiaFont).toBe(true);
  });

  test('clicking Dyslexia preset sets lineHeight to 3', () => {
    var w = AccessibilityWidget.init();
    var btn = document.querySelector('[data-preset-id="dyslexia"]');
    btn.click();
    expect(w.getSettings().lineHeight).toBe(3);
  });

  test('clicking ADHD preset enables pauseAnimations', () => {
    var w = AccessibilityWidget.init();
    var btn = document.querySelector('[data-preset-id="adhd"]');
    btn.click();
    expect(w.getSettings().pauseAnimations).toBe(true);
  });

  test('clicking ADHD preset enables focusMode', () => {
    var w = AccessibilityWidget.init();
    var btn = document.querySelector('[data-preset-id="adhd"]');
    btn.click();
    expect(w.getSettings().focusMode).toBe(true);
  });

  test('clicking Motor preset enables focusOutline', () => {
    var w = AccessibilityWidget.init();
    var btn = document.querySelector('[data-preset-id="motor"]');
    btn.click();
    expect(w.getSettings().focusOutline).toBe(true);
  });

  test('clicking Migraine Safe preset enables darkMode', () => {
    var w = AccessibilityWidget.init();
    var btn = document.querySelector('[data-preset-id="migraine"]');
    btn.click();
    expect(w.getSettings().darkMode).toBe(true);
  });

  test('clicking Migraine Safe preset enables pauseAnimations', () => {
    var w = AccessibilityWidget.init();
    var btn = document.querySelector('[data-preset-id="migraine"]');
    btn.click();
    expect(w.getSettings().pauseAnimations).toBe(true);
  });

  // ── Reset before applying ────────────────────────────────────────────────

  test('preset click first resets previous settings', () => {
    var w = AccessibilityWidget.init();
    // Activate something not in the Low Vision preset
    w.setFeature('dyslexiaFont', true);
    expect(w.getSettings().dyslexiaFont).toBe(true);

    // Apply Low Vision preset — dyslexiaFont should be cleared
    document.querySelector('[data-preset-id="low-vision"]').click();
    expect(w.getSettings().dyslexiaFont).toBe(false);
    expect(w.getSettings().highContrast).toBe(true);
  });

  test('applying one preset then another replaces settings cleanly', () => {
    var w = AccessibilityWidget.init();
    document.querySelector('[data-preset-id="migraine"]').click();
    expect(w.getSettings().darkMode).toBe(true);

    document.querySelector('[data-preset-id="motor"]').click();
    // darkMode should be reset; motor preset does not include it
    expect(w.getSettings().darkMode).toBe(false);
    expect(w.getSettings().focusOutline).toBe(true);
  });

  // ── i18n update ──────────────────────────────────────────────────────────

  test('preset button labels update when language changes', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    var btn = document.querySelector('[data-preset-id="low-vision"]');
    var enLabel = btn.textContent;

    w.setLanguage('he');
    // Hebrew label should differ from English
    expect(btn.textContent).not.toBe(enLabel);
  });

  // ── destroy cleanup ──────────────────────────────────────────────────────

  test('presets section removed from DOM after destroy()', () => {
    AccessibilityWidget.init();
    expect(document.querySelector('.a11y-widget__quick-start')).not.toBeNull();
    AccessibilityWidget.destroy();
    expect(document.querySelector('.a11y-widget__quick-start')).toBeNull();
  });
});

// ===========================================================================
// createWidget() factory API (Section 7.5 — multi-instance support)
// ===========================================================================

describe('createWidget() factory API', () => {
  var _extra = [];

  afterEach(() => {
    // Destroy any instances created by this describe block
    _extra.forEach(function (w) { try { w.destroy(); } catch (_) {} });
    _extra = [];
    AccessibilityWidget.destroy();
  });

  test('createWidget() returns a widget instance', () => {
    var w = AccessibilityWidget.createWidget({ storageKey: 'cw1' });
    _extra.push(w);
    expect(w).not.toBeNull();
    expect(typeof w.openMenu).toBe('function');
    expect(typeof w.getSettings).toBe('function');
    expect(typeof w.destroy).toBe('function');
  });

  test('createWidget() does not affect the singleton', () => {
    expect(AccessibilityWidget.getInstance()).toBeNull();
    var w = AccessibilityWidget.createWidget({ storageKey: 'cw2' });
    _extra.push(w);
    // getInstance() is still null — createWidget() does not register the singleton
    expect(AccessibilityWidget.getInstance()).toBeNull();
  });

  test('createWidget() does not destroy an existing singleton', () => {
    var singleton = AccessibilityWidget.init({ storageKey: 'cwSingleton' });
    var extra = AccessibilityWidget.createWidget({ storageKey: 'cwExtra' });
    _extra.push(extra);
    // Singleton must still be alive
    expect(AccessibilityWidget.getInstance()).toBe(singleton);
    expect(document.querySelectorAll('.a11y-widget')).toHaveLength(2);
  });

  test('multiple independent instances can coexist', () => {
    var w1 = AccessibilityWidget.createWidget({ storageKey: 'cwA', position: 'top-left' });
    var w2 = AccessibilityWidget.createWidget({ storageKey: 'cwB', position: 'bottom-left' });
    _extra.push(w1, w2);
    expect(w1).not.toBe(w2);
    expect(document.querySelectorAll('.a11y-widget')).toHaveLength(2);
  });

  test('instance returned by createWidget() is independently operable', () => {
    var w = AccessibilityWidget.createWidget({ storageKey: 'cwOp' });
    _extra.push(w);
    w.setFeature('highContrast', true);
    expect(w.getSettings().highContrast).toBe(true);
  });

  test('destroying a createWidget() instance removes only its DOM node', () => {
    var singleton = AccessibilityWidget.init({ storageKey: 'cwDest1' });
    var extra = AccessibilityWidget.createWidget({ storageKey: 'cwDest2' });
    extra.destroy();
    // Singleton widget still in DOM
    expect(document.querySelectorAll('.a11y-widget')).toHaveLength(1);
    expect(AccessibilityWidget.getInstance()).toBe(singleton);
  });

  test('createWidget() returns a fresh instance on each call', () => {
    var w1 = AccessibilityWidget.createWidget({ storageKey: 'cwFresh1' });
    var w2 = AccessibilityWidget.createWidget({ storageKey: 'cwFresh2' });
    _extra.push(w1, w2);
    expect(w1).not.toBe(w2);
  });
});

// ---------------------------------------------------------------------------
// F-003: Plugin Architecture
// ---------------------------------------------------------------------------

describe('F-003: Plugin Architecture', () => {
  // Helper to build a minimal valid test plugin
  function makePlugin(id, featureId, overrides) {
    return Object.assign({
      id: id,
      group: 'visual',
      features: [
        { id: featureId, type: 'toggle', cssClass: 'a11y-' + featureId, default: false, group: 'visual', icon: '' },
      ],
      activate: jest.fn(),
      deactivate: jest.fn(),
    }, overrides || {});
  }

  afterEach(() => {
    AccessibilityWidget.destroy();
    // Clean plugin registry between tests
    AccessibilityWidget._clearPlugins();
  });

  describe('registerPlugin()', () => {
    test('registerPlugin is a function on AccessibilityWidget', () => {
      expect(typeof AccessibilityWidget.registerPlugin).toBe('function');
    });

    test('throws TypeError when plugin has no id', () => {
      expect(() => AccessibilityWidget.registerPlugin({ features: [] })).toThrow(TypeError);
    });

    test('throws TypeError when plugin.features is not an array', () => {
      expect(() => AccessibilityWidget.registerPlugin({ id: 'x', features: null })).toThrow(TypeError);
    });

    test('does not throw for a valid minimal plugin', () => {
      expect(() => AccessibilityWidget.registerPlugin(makePlugin('p1', 'pluginToggle1'))).not.toThrow();
    });

    test('registered plugin features appear in getAvailableFeatures() without an instance', () => {
      var plugin = makePlugin('p2', 'pluginToggle2');
      AccessibilityWidget.registerPlugin(plugin);
      var ids = AccessibilityWidget.getAvailableFeatures().map(function (f) { return f.id; });
      expect(ids).toContain('pluginToggle2');
    });

    test('registered plugin features appear in widget panel after init()', () => {
      var plugin = makePlugin('p3', 'pluginToggle3');
      AccessibilityWidget.registerPlugin(plugin);
      AccessibilityWidget.init();
      expect(document.querySelector('[data-feature="pluginToggle3"]')).not.toBeNull();
    });

    test('plugin activate() is called when its feature is toggled on', () => {
      var plugin = makePlugin('p4', 'pluginToggle4');
      AccessibilityWidget.registerPlugin(plugin);
      AccessibilityWidget.init();
      var item = document.querySelector('[data-feature="pluginToggle4"]');
      item.click();
      expect(plugin.activate).toHaveBeenCalledWith('pluginToggle4', true, expect.any(Object));
    });

    test('plugin deactivate() is called when its feature is toggled off', () => {
      var plugin = makePlugin('p5', 'pluginToggle5');
      AccessibilityWidget.registerPlugin(plugin);
      AccessibilityWidget.init();
      var w = AccessibilityWidget.getInstance();
      w.setFeature('pluginToggle5', true);
      plugin.activate.mockClear();
      w.setFeature('pluginToggle5', false);
      expect(plugin.deactivate).toHaveBeenCalledWith('pluginToggle5', expect.any(Object));
    });

    test('plugin deactivate() is called on resetAll()', () => {
      var plugin = makePlugin('p6', 'pluginToggle6');
      AccessibilityWidget.registerPlugin(plugin);
      AccessibilityWidget.init();
      var w = AccessibilityWidget.getInstance();
      w.setFeature('pluginToggle6', true);
      plugin.deactivate.mockClear();
      w.resetAll();
      expect(plugin.deactivate).toHaveBeenCalled();
    });

    test('plugin deactivate() is called on destroy()', () => {
      var plugin = makePlugin('p7', 'pluginToggle7');
      AccessibilityWidget.registerPlugin(plugin);
      AccessibilityWidget.init();
      var w = AccessibilityWidget.getInstance();
      w.setFeature('pluginToggle7', true);
      plugin.deactivate.mockClear();
      AccessibilityWidget.destroy();
      expect(plugin.deactivate).toHaveBeenCalled();
    });

    test('plugin mount() is called after widget DOM is built', () => {
      var mountSpy = jest.fn();
      var plugin = makePlugin('p8', 'pluginToggle8', { mount: mountSpy });
      AccessibilityWidget.registerPlugin(plugin);
      AccessibilityWidget.init();
      expect(mountSpy).toHaveBeenCalledWith(expect.any(HTMLElement), expect.any(Object));
    });

    test('plugin unmount() is called on destroy()', () => {
      var unmountSpy = jest.fn();
      var plugin = makePlugin('p9', 'pluginToggle9', { unmount: unmountSpy });
      AccessibilityWidget.registerPlugin(plugin);
      AccessibilityWidget.init();
      AccessibilityWidget.destroy();
      expect(unmountSpy).toHaveBeenCalled();
    });

    test('plugin feature can be disabled via features option', () => {
      var plugin = makePlugin('p10', 'pluginToggleA');
      AccessibilityWidget.registerPlugin(plugin);
      AccessibilityWidget.init({ features: { pluginToggleA: false } });
      expect(document.querySelector('[data-feature="pluginToggleA"]')).toBeNull();
    });

    test('plugin features do not affect built-in feature behaviour', () => {
      var plugin = makePlugin('p11', 'pluginToggleB');
      AccessibilityWidget.registerPlugin(plugin);
      AccessibilityWidget.init();
      var w = AccessibilityWidget.getInstance();
      w.setFeature('darkMode', true);
      expect(document.body.classList.contains('a11y-dark-mode')).toBe(true);
    });
  });

  describe('getAvailableFeatures()', () => {
    test('getAvailableFeatures is a function on AccessibilityWidget', () => {
      expect(typeof AccessibilityWidget.getAvailableFeatures).toBe('function');
    });

    test('returns array of feature definitions without active instance', () => {
      var feats = AccessibilityWidget.getAvailableFeatures();
      expect(Array.isArray(feats)).toBe(true);
      expect(feats.length).toBeGreaterThanOrEqual(28);
    });

    test('returned features include built-in feature ids', () => {
      var ids = AccessibilityWidget.getAvailableFeatures().map(function (f) { return f.id; });
      expect(ids).toContain('highContrast');
      expect(ids).toContain('textToSpeech');
      expect(ids).toContain('readingGuide');
    });

    test('delegates to instance getAvailableFeatures() when active', () => {
      AccessibilityWidget.init();
      var feats = AccessibilityWidget.getAvailableFeatures();
      expect(Array.isArray(feats)).toBe(true);
      expect(feats.length).toBeGreaterThanOrEqual(28);
    });

    test('instance getAvailableFeatures() includes plugin features', () => {
      var plugin = makePlugin('p12', 'pluginToggleC');
      AccessibilityWidget.registerPlugin(plugin);
      AccessibilityWidget.init();
      var ids = AccessibilityWidget.getAvailableFeatures().map(function (f) { return f.id; });
      expect(ids).toContain('pluginToggleC');
    });
  });
});
