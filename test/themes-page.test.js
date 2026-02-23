/**
 * Automated tests for examples/themes.html.
 *
 * This file exercises the widget against the multi-theme page that was
 * specifically designed to verify visual features (high contrast, dark mode,
 * invert colors, hide images) work across diverse card styles and backgrounds.
 *
 * Coverage:
 *  1. Page structure   – all six themed sections are present
 *  2. Widget init      – initialises on the themed page without errors
 *  3. Feature classes  – each feature adds/removes the correct body class
 *  4. Widget isolation – widget itself is excluded from feature CSS selectors
 *  5. CustomEvents     – a11y:toggle, a11y:open, a11y:close, a11y:reset,
 *                         a11y:init, a11y:destroy, a11y:langchange all fire
 *  6. New P0 options   – toggleIconUrl, accessibilityStatementUrl
 *  7. Host page safety – document.documentElement lang/dir never modified
 *  8. SSR guard        – init() returns null when window is absent
 *  9. Themed elements  – colored, dark, and blue-white cards are present
 * 10. axe-core         – no accessibility violations on themed page + widget
 */

import fs from 'fs';
import path from 'path';
import { axe, toHaveNoViolations } from 'jest-axe';
import AccessibilityWidget from '../src/index.js';
import { applyFeature } from '../src/features.js';

expect.extend(toHaveNoViolations);

// ---------------------------------------------------------------------------
// Load the themed example page once
// ---------------------------------------------------------------------------

var THEMES_PATH = path.resolve(__dirname, '../examples/themes.html');
var rawHtml = fs.readFileSync(THEMES_PATH, 'utf8');

function parseThemesPage() {
  return new DOMParser().parseFromString(rawHtml, 'text/html');
}

// ---------------------------------------------------------------------------
// Global cleanup
// ---------------------------------------------------------------------------

afterEach(() => {
  AccessibilityWidget.destroy();
  document.body.innerHTML = '';
  document.body.className = '';
  document.documentElement.className = '';
  localStorage.clear();
});

// ===========================================================================
// 1. Page structure
// ===========================================================================

describe('themes.html: page structure', () => {
  var doc;
  beforeEach(() => { doc = parseThemesPage(); });

  test('page has a <main> landmark', () => {
    expect(doc.querySelector('main')).not.toBeNull();
  });

  test('page has a <header role="banner">', () => {
    expect(doc.querySelector('header[role="banner"]')).not.toBeNull();
  });

  test('page has a <footer role="contentinfo">', () => {
    expect(doc.querySelector('footer[role="contentinfo"]')).not.toBeNull();
  });

  test('all six themed sections are present', () => {
    expect(doc.querySelector('#blue-white')).not.toBeNull();
    expect(doc.querySelector('#coloured')).not.toBeNull();
    expect(doc.querySelector('#dark')).not.toBeNull();
    expect(doc.querySelector('#images')).not.toBeNull();
    expect(doc.querySelector('#form')).not.toBeNull();
    expect(doc.querySelector('#prose')).not.toBeNull();
  });

  test('blue-white section contains at least 4 cards', () => {
    var cards = doc.querySelectorAll('.theme-blue-white .card');
    expect(cards.length).toBeGreaterThanOrEqual(4);
  });

  test('coloured section contains green, orange, purple and red cards', () => {
    expect(doc.querySelector('.card--green')).not.toBeNull();
    expect(doc.querySelector('.card--orange')).not.toBeNull();
    expect(doc.querySelector('.card--purple')).not.toBeNull();
    expect(doc.querySelector('.card--red')).not.toBeNull();
  });

  test('dark section contains dark-themed cards', () => {
    var cards = doc.querySelectorAll('.theme-dark .card');
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });

  test('image section contains <img> elements with alt text', () => {
    var imgs = doc.querySelectorAll('#images img');
    expect(imgs.length).toBeGreaterThanOrEqual(3);
    for (var i = 0; i < imgs.length; i++) {
      expect(imgs[i].getAttribute('alt')).toBeTruthy();
    }
  });

  test('form section contains labelled inputs', () => {
    var inputs = doc.querySelectorAll('#form input, #form select, #form textarea');
    expect(inputs.length).toBeGreaterThanOrEqual(3);
    for (var j = 0; j < inputs.length; j++) {
      var id = inputs[j].getAttribute('id');
      expect(id).toBeTruthy();
      expect(doc.querySelector('label[for="' + id + '"]')).not.toBeNull();
    }
  });

  test('prose section contains headings and paragraph text', () => {
    var headings = doc.querySelectorAll('#prose h3');
    var paragraphs = doc.querySelectorAll('#prose p');
    expect(headings.length).toBeGreaterThanOrEqual(1);
    expect(paragraphs.length).toBeGreaterThanOrEqual(1);
  });

  test('UMD script tag references dist/index.umd.js', () => {
    var script = doc.querySelector('script[src]');
    expect(script).not.toBeNull();
    expect(script.getAttribute('src')).toContain('index.umd');
  });

  test('CSS link references dist/a11y-widget.css', () => {
    var link = doc.querySelector('link[rel="stylesheet"]');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toContain('a11y-widget.css');
  });
});

// ===========================================================================
// 2. Widget initialisation on the themed page
// ===========================================================================

describe('themes.html: widget initialisation', () => {
  beforeEach(() => {
    var doc = parseThemesPage();
    document.body.innerHTML = doc.body.innerHTML;
  });

  test('widget init on themed page does not throw', () => {
    expect(() => {
      AccessibilityWidget.init({ defaultLanguage: 'en' });
    }).not.toThrow();
  });

  test('widget root (.a11y-widget) is appended to body', () => {
    AccessibilityWidget.init({ defaultLanguage: 'en' });
    expect(document.querySelector('.a11y-widget')).not.toBeNull();
  });

  test('init returns the widget instance (not null)', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    expect(w).not.toBeNull();
  });

  test('getInstance() returns the same instance', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    expect(AccessibilityWidget.getInstance()).toBe(w);
  });

  test('second init() destroys the first widget', () => {
    var w1 = AccessibilityWidget.init({ defaultLanguage: 'en' });
    var w2 = AccessibilityWidget.init({ defaultLanguage: 'en' });
    expect(w1).not.toBe(w2);
    expect(document.querySelectorAll('.a11y-widget').length).toBe(1);
  });
});

// ===========================================================================
// 3. Feature class toggling on the themed page
// ===========================================================================

describe('themes.html: feature class toggling', () => {
  var w;
  beforeEach(() => {
    var doc = parseThemesPage();
    document.body.innerHTML = doc.body.innerHTML;
    w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
  });

  function clickFeature(featureId) {
    var btn = document.querySelector('[data-feature="' + featureId + '"]');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return btn;
  }

  // High Contrast

  test('high contrast: body gets a11y-high-contrast on first click', () => {
    clickFeature('highContrast');
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(true);
  });

  test('high contrast: body loses a11y-high-contrast on second click', () => {
    clickFeature('highContrast');
    clickFeature('highContrast');
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(false);
  });

  test('high contrast: widget panel is still in DOM after toggle', () => {
    clickFeature('highContrast');
    expect(document.querySelector('.a11y-widget__panel')).not.toBeNull();
  });

  // Dark Mode

  test('dark mode: body gets a11y-dark-mode on first click', () => {
    clickFeature('darkMode');
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(true);
  });

  test('dark mode: body loses a11y-dark-mode on second click', () => {
    clickFeature('darkMode');
    clickFeature('darkMode');
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(false);
  });

  test('dark mode: widget panel is still in DOM after toggle', () => {
    clickFeature('darkMode');
    expect(document.querySelector('.a11y-widget__panel')).not.toBeNull();
  });

  // Invert Colors

  test('invert colors: body gets a11y-invert-colors on first click', () => {
    clickFeature('invertColors');
    expect(document.body.classList.contains('a11y-invert-colors')).toBe(true);
  });

  test('invert colors: widget panel is still in DOM after toggle', () => {
    clickFeature('invertColors');
    expect(document.querySelector('.a11y-widget__panel')).not.toBeNull();
  });

  test('invert colors: body has no inline filter style (CSS-only approach)', () => {
    clickFeature('invertColors');
    expect(document.body.style.filter).toBeFalsy();
  });

  test('invert colors: widget element has no inline filter style', () => {
    clickFeature('invertColors');
    var widgetEl = document.querySelector('.a11y-widget');
    expect(widgetEl.style.filter).toBeFalsy();
  });

  // Hide Images

  test('hide images: body gets a11y-hide-images on first click', () => {
    clickFeature('hideImages');
    expect(document.body.classList.contains('a11y-hide-images')).toBe(true);
  });

  test('hide images: body loses a11y-hide-images on second click', () => {
    clickFeature('hideImages');
    clickFeature('hideImages');
    expect(document.body.classList.contains('a11y-hide-images')).toBe(false);
  });

  // Dyslexia Font

  test('dyslexia font: body gets a11y-dyslexia-font on first click', () => {
    clickFeature('dyslexiaFont');
    expect(document.body.classList.contains('a11y-dyslexia-font')).toBe(true);
  });

  // Text Spacing

  test('text spacing: body gets a11y-text-spacing on first click', () => {
    clickFeature('textSpacing');
    expect(document.body.classList.contains('a11y-text-spacing')).toBe(true);
  });

  // Pause Animations

  test('pause animations: body gets a11y-pause-animations on first click', () => {
    clickFeature('pauseAnimations');
    expect(document.body.classList.contains('a11y-pause-animations')).toBe(true);
  });

  // Focus Outline

  test('focus outline: body gets a11y-focus-outline on first click', () => {
    clickFeature('focusOutline');
    expect(document.body.classList.contains('a11y-focus-outline')).toBe(true);
  });

  // Underline Links

  test('underline links: body gets a11y-underline-links on first click', () => {
    clickFeature('underlineLinks');
    expect(document.body.classList.contains('a11y-underline-links')).toBe(true);
  });

  // Highlight Headings

  test('highlight headings: body gets a11y-highlight-headings on first click', () => {
    clickFeature('highlightHeadings');
    expect(document.body.classList.contains('a11y-highlight-headings')).toBe(true);
  });

  // Large Cursor

  test('large cursor: body gets a11y-large-cursor on first click', () => {
    clickFeature('largeCursor');
    expect(document.body.classList.contains('a11y-large-cursor')).toBe(true);
  });

  // All 14 features reset

  test('resetAll clears all feature classes from body on themed page', () => {
    var featureIds = [
      'highContrast', 'darkMode', 'invertColors', 'dyslexiaFont',
      'underlineLinks', 'hideImages', 'focusOutline', 'textSpacing',
      'pauseAnimations', 'largeCursor', 'highlightHeadings',
    ];
    featureIds.forEach(function (id) { clickFeature(id); });
    w.resetAll();
    featureIds.forEach(function (id) {
      var feature = document.querySelector('[data-feature="' + id + '"]');
      expect(feature.getAttribute('aria-checked')).toBe('false');
    });
    // Spot-check body classes
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(false);
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(false);
    expect(document.body.classList.contains('a11y-invert-colors')).toBe(false);
  });
});

// ===========================================================================
// 4. Widget isolation from feature selectors
// ===========================================================================

describe('themes.html: widget isolation from feature CSS', () => {
  beforeEach(() => {
    var doc = parseThemesPage();
    document.body.innerHTML = doc.body.innerHTML;
    AccessibilityWidget.init({ defaultLanguage: 'en' });
  });

  test('widget root (.a11y-widget) has class .a11y-widget for CSS exclusion', () => {
    expect(document.querySelector('.a11y-widget')).not.toBeNull();
  });

  test('high contrast does not apply inline styles to widget', () => {
    applyFeature('highContrast', true);
    var widgetEl = document.querySelector('.a11y-widget');
    expect(widgetEl.style.backgroundColor).toBeFalsy();
    expect(widgetEl.style.color).toBeFalsy();
  });

  test('dark mode does not apply inline styles to widget', () => {
    applyFeature('darkMode', true);
    var widgetEl = document.querySelector('.a11y-widget');
    expect(widgetEl.style.backgroundColor).toBeFalsy();
  });

  test('widget panel remains present after all visual features are activated', () => {
    applyFeature('highContrast', true);
    applyFeature('darkMode', true);
    applyFeature('invertColors', true);
    expect(document.querySelector('.a11y-widget__panel')).not.toBeNull();
  });
});

// ===========================================================================
// 5. CustomEvent API (F-006)
// ===========================================================================

describe('themes.html: CustomEvent API', () => {
  var w;
  beforeEach(() => {
    var doc = parseThemesPage();
    document.body.innerHTML = doc.body.innerHTML;
  });

  afterEach(() => {
    window.removeEventListener('a11y:init', null);
    window.removeEventListener('a11y:toggle', null);
    window.removeEventListener('a11y:open', null);
    window.removeEventListener('a11y:close', null);
    window.removeEventListener('a11y:reset', null);
    window.removeEventListener('a11y:destroy', null);
    window.removeEventListener('a11y:langchange', null);
  });

  test('a11y:init fires when widget initialises', () => {
    var fired = false;
    var detail = null;
    window.addEventListener('a11y:init', function (e) {
      fired = true;
      detail = e.detail;
    });
    AccessibilityWidget.init({ defaultLanguage: 'en' });
    expect(fired).toBe(true);
    expect(detail).not.toBeNull();
    expect(typeof detail.settings).toBe('object');
  });

  test('a11y:toggle fires when a feature is toggled', () => {
    var events = [];
    window.addEventListener('a11y:toggle', function (e) { events.push(e.detail); });
    w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    var btn = document.querySelector('[data-feature="highContrast"]');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(events.length).toBe(1);
    expect(events[0].featureId).toBe('highContrast');
    expect(events[0].value).toBe(true);
    expect(typeof events[0].settings).toBe('object');
  });

  test('a11y:toggle fires again on second click (value=false)', () => {
    var events = [];
    window.addEventListener('a11y:toggle', function (e) { events.push(e.detail); });
    w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    var btn = document.querySelector('[data-feature="darkMode"]');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(events.length).toBe(2);
    expect(events[0].value).toBe(true);
    expect(events[1].value).toBe(false);
  });

  test('a11y:toggle settings snapshot includes all feature states', () => {
    var lastDetail = null;
    window.addEventListener('a11y:toggle', function (e) { lastDetail = e.detail; });
    w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    var btn = document.querySelector('[data-feature="highContrast"]');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(lastDetail.settings).toHaveProperty('highContrast');
    expect(lastDetail.settings).toHaveProperty('darkMode');
    expect(lastDetail.settings).toHaveProperty('fontSize');
  });

  test('a11y:open fires when menu is opened', () => {
    var fired = false;
    window.addEventListener('a11y:open', function () { fired = true; });
    w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    expect(fired).toBe(true);
  });

  test('a11y:close fires when menu is closed', () => {
    var fired = false;
    window.addEventListener('a11y:close', function () { fired = true; });
    w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    w.closeMenu();
    expect(fired).toBe(true);
  });

  test('a11y:reset fires when resetAll is called', () => {
    var detail = null;
    window.addEventListener('a11y:reset', function (e) { detail = e.detail; });
    w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.resetAll();
    expect(detail).not.toBeNull();
  });

  test('a11y:destroy fires when widget is destroyed', () => {
    var fired = false;
    window.addEventListener('a11y:destroy', function () { fired = true; });
    w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.destroy();
    expect(fired).toBe(true);
  });

  test('a11y:langchange fires when language changes', () => {
    var detail = null;
    window.addEventListener('a11y:langchange', function (e) { detail = e.detail; });
    w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.setLanguage('he');
    expect(detail).not.toBeNull();
    expect(detail.language).toBe('he');
  });

  test('a11y:toggle detail has correct featureId for fontSize range', () => {
    var events = [];
    window.addEventListener('a11y:toggle', function (e) { events.push(e.detail); });
    w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    var plusBtn = document.querySelector('[data-feature="fontSize"][data-action="increase"]');
    plusBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(events.length).toBe(1);
    expect(events[0].featureId).toBe('fontSize');
    expect(events[0].value).toBe(1);
  });
});

// ===========================================================================
// 6. New P0 options: toggleIconUrl, accessibilityStatementUrl
// ===========================================================================

describe('themes.html: toggleIconUrl option', () => {
  beforeEach(() => {
    var doc = parseThemesPage();
    document.body.innerHTML = doc.body.innerHTML;
  });

  test('custom toggleIconUrl is used as the toggle button img src', () => {
    AccessibilityWidget.init({
      defaultLanguage: 'en',
      toggleIconUrl: '/custom-icon.png',
    });
    var img = document.querySelector('.a11y-widget__toggle img');
    expect(img.src).toContain('custom-icon.png');
  });

  test('when toggleIconUrl is omitted the default data URI is used', () => {
    AccessibilityWidget.init({ defaultLanguage: 'en' });
    var img = document.querySelector('.a11y-widget__toggle img');
    expect(img.src).toContain('data:image/png');
  });

  test('toggle button img has empty alt and aria-hidden', () => {
    AccessibilityWidget.init({ defaultLanguage: 'en' });
    var img = document.querySelector('.a11y-widget__toggle img');
    expect(img.getAttribute('alt')).toBe('');
    expect(img.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('themes.html: accessibilityStatementUrl option', () => {
  beforeEach(() => {
    var doc = parseThemesPage();
    document.body.innerHTML = doc.body.innerHTML;
  });

  test('accessibility statement link is rendered when URL is provided', () => {
    AccessibilityWidget.init({
      defaultLanguage: 'en',
      accessibilityStatementUrl: 'https://example.com/accessibility',
    });
    var link = document.querySelector('.a11y-widget__statement-link');
    expect(link).not.toBeNull();
  });

  test('statement link has correct href', () => {
    AccessibilityWidget.init({
      defaultLanguage: 'en',
      accessibilityStatementUrl: 'https://example.com/accessibility',
    });
    var link = document.querySelector('.a11y-widget__statement-link');
    expect(link.getAttribute('href')).toBe('https://example.com/accessibility');
  });

  test('statement link opens in a new tab (target=_blank)', () => {
    AccessibilityWidget.init({
      defaultLanguage: 'en',
      accessibilityStatementUrl: 'https://example.com/accessibility',
    });
    var link = document.querySelector('.a11y-widget__statement-link');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  test('statement link has rel="noopener noreferrer"', () => {
    AccessibilityWidget.init({
      defaultLanguage: 'en',
      accessibilityStatementUrl: 'https://example.com/accessibility',
    });
    var link = document.querySelector('.a11y-widget__statement-link');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  test('statement link has non-empty text content', () => {
    AccessibilityWidget.init({
      defaultLanguage: 'en',
      accessibilityStatementUrl: 'https://example.com/accessibility',
    });
    var link = document.querySelector('.a11y-widget__statement-link');
    expect(link.textContent.trim().length).toBeGreaterThan(0);
  });

  test('statement link is not rendered when URL is omitted', () => {
    AccessibilityWidget.init({ defaultLanguage: 'en' });
    var link = document.querySelector('.a11y-widget__statement-link');
    expect(link).toBeNull();
  });

  test('statement link is in the footer (after the reset button)', () => {
    AccessibilityWidget.init({
      defaultLanguage: 'en',
      accessibilityStatementUrl: 'https://example.com/accessibility',
    });
    var footer = document.querySelector('.a11y-widget__footer');
    var link = footer.querySelector('.a11y-widget__statement-link');
    expect(link).not.toBeNull();
  });

  test('statement link text updates when language changes to Hebrew', () => {
    var w = AccessibilityWidget.init({
      defaultLanguage: 'en',
      accessibilityStatementUrl: 'https://example.com/accessibility',
    });
    var englishText = document.querySelector('.a11y-widget__statement-link').textContent;
    w.setLanguage('he');
    var hebrewText = document.querySelector('.a11y-widget__statement-link').textContent;
    expect(hebrewText).not.toBe(englishText);
    expect(hebrewText.length).toBeGreaterThan(0);
  });
});

// ===========================================================================
// 7. Host page safety — document.documentElement.lang/dir never modified
// ===========================================================================

describe('themes.html: host page lang/dir safety', () => {
  beforeEach(() => {
    var doc = parseThemesPage();
    document.body.innerHTML = doc.body.innerHTML;
  });

  test('document.documentElement.lang is unchanged after init with defaultLanguage:en', () => {
    var originalLang = document.documentElement.getAttribute('lang');
    AccessibilityWidget.init({ defaultLanguage: 'en' });
    expect(document.documentElement.getAttribute('lang')).toBe(originalLang);
  });

  test('document.documentElement.lang is unchanged after setLanguage to Hebrew', () => {
    document.documentElement.setAttribute('lang', 'en');
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.setLanguage('he');
    expect(document.documentElement.getAttribute('lang')).toBe('en');
  });

  test('document.documentElement.dir is unchanged after setLanguage to Arabic', () => {
    document.documentElement.setAttribute('dir', 'ltr');
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.setLanguage('ar');
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
  });

  test('widget root gets lang attribute scoped to itself', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    var root = document.querySelector('.a11y-widget');
    expect(root.getAttribute('lang')).toBe('en');
    w.setLanguage('he');
    expect(root.getAttribute('lang')).toBe('he');
  });

  test('widget root gets dir=rtl for Hebrew, dir=ltr for English', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    var root = document.querySelector('.a11y-widget');
    expect(root.getAttribute('dir')).toBe('ltr');
    w.setLanguage('he');
    expect(root.getAttribute('dir')).toBe('rtl');
    w.setLanguage('en');
    expect(root.getAttribute('dir')).toBe('ltr');
  });

  test('document.documentElement.lang is unchanged after destroy', () => {
    document.documentElement.setAttribute('lang', 'fr');
    var w = AccessibilityWidget.init({ defaultLanguage: 'he' });
    w.destroy();
    expect(document.documentElement.getAttribute('lang')).toBe('fr');
  });
});

// ===========================================================================
// 8. SSR guard (F-002)
// ===========================================================================

describe('SSR guard', () => {
  test('init() returns null when window is undefined', () => {
    // Temporarily shadow window
    var originalWindow = global.window;
    delete global.window;
    var result = AccessibilityWidget.init({ defaultLanguage: 'en' });
    global.window = originalWindow;
    expect(result).toBeNull();
  });

  test('getInstance() returns null when no init has run', () => {
    expect(AccessibilityWidget.getInstance()).toBeNull();
  });

  test('destroy() is safe to call when no instance exists', () => {
    expect(() => AccessibilityWidget.destroy()).not.toThrow();
  });
});

// ===========================================================================
// 9. Themed element presence (DOM integrity checks)
// ===========================================================================

describe('themes.html: themed element presence after widget init', () => {
  beforeEach(() => {
    var doc = parseThemesPage();
    document.body.innerHTML = doc.body.innerHTML;
    AccessibilityWidget.init({ defaultLanguage: 'en' });
  });

  test('blue-white cards are still in DOM after widget init', () => {
    expect(document.querySelectorAll('.theme-blue-white .card').length).toBeGreaterThanOrEqual(4);
  });

  test('coloured cards are still in DOM after widget init', () => {
    expect(document.querySelector('.card--green')).not.toBeNull();
    expect(document.querySelector('.card--orange')).not.toBeNull();
    expect(document.querySelector('.card--purple')).not.toBeNull();
    expect(document.querySelector('.card--red')).not.toBeNull();
  });

  test('dark cards are still in DOM after widget init', () => {
    expect(document.querySelectorAll('.theme-dark .card').length).toBeGreaterThanOrEqual(2);
  });

  test('image section imgs are still in DOM after widget init', () => {
    expect(document.querySelectorAll('#images img').length).toBeGreaterThanOrEqual(3);
  });

  test('form inputs are still accessible after widget init', () => {
    expect(document.querySelector('#tc-name')).not.toBeNull();
    expect(document.querySelector('#tc-email')).not.toBeNull();
  });

  test('widget does not steal aria-label from page landmarks', () => {
    var nav = document.querySelector('nav[aria-label]');
    expect(nav).not.toBeNull();
    // The widget adds its own nav-less menu; page's nav remains
    expect(document.querySelector('nav[aria-label="Site navigation"]')).not.toBeNull();
  });
});

// ===========================================================================
// 10. axe-core accessibility on themed page + widget
// ===========================================================================

describe('themes.html: axe-core accessibility', () => {
  var AXE_OPTIONS = {
    rules: {
      // The region rule is a host-page concern, not a widget concern
      region: { enabled: false },
    },
  };

  beforeEach(() => {
    var doc = parseThemesPage();
    document.body.innerHTML = doc.body.innerHTML;
  });

  test('themed page + widget (panel closed) has no axe violations', async () => {
    AccessibilityWidget.init({ defaultLanguage: 'en' });
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });

  test('themed page + widget (panel open) has no axe violations', async () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });

  test('themed page + widget in Hebrew (RTL, panel open) has no axe violations', async () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'he' });
    w.openMenu();
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });

  test('themed page + high contrast active has no axe violations', async () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    document.querySelector('[data-feature="highContrast"]')
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });

  test('themed page + dark mode active has no axe violations', async () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    document.querySelector('[data-feature="darkMode"]')
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });

  test('themed page + statement link has no axe violations', async () => {
    var w = AccessibilityWidget.init({
      defaultLanguage: 'en',
      accessibilityStatementUrl: 'https://example.com/accessibility',
    });
    w.openMenu();
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });
});
