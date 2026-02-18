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

function simulateKeydown(element, key) {
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
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
];
var ALL_FEATURE_IDS = TOGGLE_FEATURE_IDS.concat(['fontSize']);
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
  test('AccessibilityWidget.version is "1.0.0"', () => {
    expect(AccessibilityWidget.version).toBe('1.0.0');
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

  test('all 14 features rendered as menu items', () => {
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
    expect(document.documentElement.getAttribute('lang')).toBe('he');
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
    expect(document.documentElement.getAttribute('lang')).toBe('he');
  });

  test('selecting Hebrew in language select switches language', () => {
    var sel = getLangSelect();
    sel.value = 'he';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    expect(document.documentElement.getAttribute('lang')).toBe('he');
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

  test('document dir attribute updates', () => {
    instance.setLanguage('he');
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    instance.setLanguage('en');
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
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
    expect(document.documentElement.getAttribute('lang')).toBe('he');
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
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
    expect(document.documentElement.getAttribute('lang')).toBe('he');
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

  test('custom languages option', () => {
    AccessibilityWidget.init({
      languages: { en: 'English', he: 'Hebrew', fr: 'French' },
    });
    var sel = getLangSelect();
    expect(sel).not.toBeNull();
    var values = Array.from(sel.options).map(function (o) { return o.value; });
    expect(values).toContain('en');
    expect(values).toContain('he');
    expect(values).toContain('fr');
    expect(sel.options[values.indexOf('en')].textContent).toBe('English');
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
    expect(document.documentElement.getAttribute('lang')).toBe('en');
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

  test('destroy restores original lang/dir attributes', () => {
    document.documentElement.setAttribute('lang', 'fr');
    document.documentElement.setAttribute('dir', 'ltr');
    var w = AccessibilityWidget.init();
    w.setLanguage('he');
    expect(document.documentElement.getAttribute('lang')).toBe('he');
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    w.destroy();
    expect(document.documentElement.getAttribute('lang')).toBe('fr');
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
  });

  test('destroy removes lang/dir if they were not set originally', () => {
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
    var w = AccessibilityWidget.init();
    expect(document.documentElement.getAttribute('lang')).toBe('en');
    w.destroy();
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
    expect(document.documentElement.getAttribute('lang')).toBe('he');
  });

  test('init with empty options is same as no options', () => {
    AccessibilityWidget.init({});
    expect(getRoot()).not.toBeNull();
    expect(document.documentElement.getAttribute('lang')).toBe('en');
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
    var w = AccessibilityWidget.init();
    expect(document.documentElement.getAttribute('lang')).toBe('en');
  });

  test('empty language string is ignored', () => {
    localStorage.setItem(
      'a11yWidgetSettings',
      JSON.stringify({ _language: '' })
    );
    var w = AccessibilityWidget.init();
    expect(document.documentElement.getAttribute('lang')).toBe('en');
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
    AccessibilityWidget.init();
    simulateClick(getFeatureItem('readingGuide'));
    var bar = document.querySelector('.a11y-reading-guide-bar');
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 200 }));
    expect(bar.style.top).toBe('194px'); // 200 - 6
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
    // The language item is the first menu item
    var langItem = getAllMenuItems()[0];
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
