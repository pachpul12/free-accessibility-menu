/**
 * Tests for examples/index.html.
 *
 * Covers:
 *  1. Asset paths  – CSS and UMD script hrefs are correct
 *  2. HTML structure – landmark regions, sections, images, form labels
 *  3. Widget init   – the example's exact options work without errors
 *  4. axe-core      – the full example page + widget has no a11y violations
 */

import fs from 'fs';
import path from 'path';
import { axe, toHaveNoViolations } from 'jest-axe';
import AccessibilityWidget from '../src/index.js';

expect.extend(toHaveNoViolations);

// ---------------------------------------------------------------------------
// Read and parse the example page
// ---------------------------------------------------------------------------

var HTML_PATH = path.resolve(__dirname, '../examples/index.html');
var rawHtml = fs.readFileSync(HTML_PATH, 'utf8');

function parseExamplePage() {
  return new DOMParser().parseFromString(rawHtml, 'text/html');
}

// ---------------------------------------------------------------------------
// Global cleanup
// ---------------------------------------------------------------------------

afterEach(() => {
  AccessibilityWidget.destroy();
  document.body.innerHTML = '';
  document.body.className = '';
  document.documentElement.removeAttribute('lang');
  document.documentElement.removeAttribute('dir');
  localStorage.clear();
});

// ===========================================================================
// 1. Asset paths
// ===========================================================================

describe('examples/index.html: asset paths', () => {
  var doc;
  beforeEach(() => {
    doc = parseExamplePage();
  });

  test('CSS link points to the correct dist file', () => {
    var link = doc.querySelector('link[rel="stylesheet"]');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('../dist/a11y-widget.css');
  });

  test('UMD script src points to the correct dist file', () => {
    var script = doc.querySelector('script[src]');
    expect(script).not.toBeNull();
    expect(script.getAttribute('src')).toBe('../dist/index.umd.js');
  });
});

// ===========================================================================
// 2. HTML structure
// ===========================================================================

describe('examples/index.html: HTML structure', () => {
  var doc;
  beforeEach(() => {
    doc = parseExamplePage();
  });

  test('html element has lang="en"', () => {
    expect(doc.documentElement.getAttribute('lang')).toBe('en');
  });

  test('charset meta tag is present', () => {
    expect(doc.querySelector('meta[charset]')).not.toBeNull();
  });

  test('viewport meta tag is present', () => {
    expect(doc.querySelector('meta[name="viewport"]')).not.toBeNull();
  });

  test('page has a non-empty <title>', () => {
    expect(doc.title.trim().length).toBeGreaterThan(0);
  });

  test('page has a <header> landmark', () => {
    expect(doc.querySelector('header')).not.toBeNull();
  });

  test('page has a <main> landmark', () => {
    expect(doc.querySelector('main')).not.toBeNull();
  });

  test('page has a <footer> landmark', () => {
    expect(doc.querySelector('footer')).not.toBeNull();
  });

  test('all four content sections are present', () => {
    ['about', 'features', 'gallery', 'contact'].forEach(function (id) {
      expect(doc.getElementById(id)).not.toBeNull();
    });
  });

  test('every <nav> element has an aria-label', () => {
    var navs = Array.from(doc.querySelectorAll('nav'));
    expect(navs.length).toBeGreaterThan(0);
    navs.forEach(function (nav) {
      expect(nav.getAttribute('aria-label')).toBeTruthy();
    });
  });

  test('every <img> has a non-empty alt attribute', () => {
    var imgs = Array.from(doc.querySelectorAll('img'));
    expect(imgs.length).toBeGreaterThan(0);
    imgs.forEach(function (img) {
      expect(img.getAttribute('alt')).toBeTruthy();
    });
  });

  test('every form input/select/textarea has an associated <label>', () => {
    var controls = Array.from(doc.querySelectorAll('input, select, textarea'));
    expect(controls.length).toBeGreaterThan(0);
    controls.forEach(function (ctrl) {
      var id = ctrl.getAttribute('id');
      expect(id).toBeTruthy();
      expect(doc.querySelector('label[for="' + id + '"]')).not.toBeNull();
    });
  });

  test('contact form has a submit button', () => {
    expect(doc.querySelector('button[type="submit"]')).not.toBeNull();
  });
});

// ===========================================================================
// 3. Widget initialization with the example's options
// ===========================================================================

describe('examples/index.html: widget initialization', () => {
  test('widget initializes with example options without throwing', () => {
    expect(function () {
      AccessibilityWidget.init({
        defaultLanguage: 'en',
        onToggle: function () {},
      });
    }).not.toThrow();
  });

  test('widget toggle button is injected into the DOM after init', () => {
    AccessibilityWidget.init({ defaultLanguage: 'en', onToggle: function () {} });
    expect(document.querySelector('.a11y-widget__toggle')).not.toBeNull();
  });

  test('menu can be opened', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en', onToggle: function () {} });
    w.openMenu();
    var root = document.querySelector('.a11y-widget');
    expect(root).not.toBeNull();
    expect(root.classList.contains('a11y-widget--open')).toBe(true);
    expect(document.querySelector('.a11y-widget__toggle').getAttribute('aria-expanded')).toBe('true');
  });

  test('all 10 built-in languages appear in the language switcher', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en', onToggle: function () {} });
    w.openMenu();
    var sel = document.querySelector('.a11y-widget__lang-select');
    var values = Array.from(sel.options).map(function (o) { return o.value; });
    ['en', 'he', 'zh', 'es', 'ar', 'pt', 'fr', 'de', 'ja', 'ru'].forEach(function (code) {
      expect(values).toContain(code);
    });
  });

  test('onToggle callback fires when a feature is toggled', () => {
    var onToggle = jest.fn();
    var w = AccessibilityWidget.init({ defaultLanguage: 'en', onToggle: onToggle });
    w.openMenu();
    var btn = document.querySelector('[data-feature="highContrast"]');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onToggle).toHaveBeenCalledWith('highContrast', true);
  });
});

// ===========================================================================
// 4. axe-core with the full example page content
// ===========================================================================

describe('examples/index.html: axe-core accessibility', () => {
  var AXE_OPTIONS = { rules: { region: { enabled: false } } };
  var EXAMPLE_OPTIONS = {
    defaultLanguage: 'en',
    onToggle: function () {},
  };

  beforeEach(() => {
    // Inject the example page's body markup into the jsdom document.
    // Script tags are included in innerHTML but not executed; we call
    // AccessibilityWidget.init() explicitly in each test that needs it.
    var exampleDoc = parseExamplePage();
    document.body.innerHTML = exampleDoc.body.innerHTML;
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');
  });

  test('example page body has no axe violations (no widget)', async () => {
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });

  test('example page + widget (closed) has no axe violations', async () => {
    AccessibilityWidget.init(EXAMPLE_OPTIONS);
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });

  test('example page + widget (open) has no axe violations', async () => {
    var w = AccessibilityWidget.init(EXAMPLE_OPTIONS);
    w.openMenu();
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });
});
