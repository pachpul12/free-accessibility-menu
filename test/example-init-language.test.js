/**
 * Tests for examples/index-init-language.html.
 *
 * Covers:
 *  1. Asset paths  – CSS and UMD script hrefs are correct
 *  2. HTML structure – lang="he", dir="rtl", landmarks, nav labels
 *  3. Widget init   – widget starts in Hebrew (defaultLanguage: 'he')
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

var HTML_PATH = path.resolve(__dirname, '../examples/index-init-language.html');
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

describe('examples/index-init-language.html: asset paths', () => {
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

describe('examples/index-init-language.html: HTML structure', () => {
  var doc;
  beforeEach(() => {
    doc = parseExamplePage();
  });

  test('html element has lang="he"', () => {
    expect(doc.documentElement.getAttribute('lang')).toBe('he');
  });

  test('html element has dir="rtl"', () => {
    expect(doc.documentElement.getAttribute('dir')).toBe('rtl');
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

  test('every <nav> has an aria-label', () => {
    var navs = Array.from(doc.querySelectorAll('nav'));
    expect(navs.length).toBeGreaterThan(0);
    navs.forEach(function (nav) {
      expect(nav.getAttribute('aria-label')).toBeTruthy();
    });
  });
});

// ===========================================================================
// 3. Widget initialization with defaultLanguage: 'he'
// ===========================================================================

describe('examples/index-init-language.html: widget initialization in Hebrew', () => {
  var EXAMPLE_OPTIONS = {
    defaultLanguage: 'he',
    languages: { en: 'English', he: '\u05E2\u05D1\u05E8\u05D9\u05EA' },
  };

  test('widget initializes with defaultLanguage "he" without throwing', () => {
    expect(function () {
      AccessibilityWidget.init(EXAMPLE_OPTIONS);
    }).not.toThrow();
  });

  test('document lang is set to "he" after init', () => {
    AccessibilityWidget.init(EXAMPLE_OPTIONS);
    expect(document.documentElement.getAttribute('lang')).toBe('he');
  });

  test('document dir is set to "rtl" after init', () => {
    AccessibilityWidget.init(EXAMPLE_OPTIONS);
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
  });

  test('language select has "he" selected after init', () => {
    var w = AccessibilityWidget.init(EXAMPLE_OPTIONS);
    w.openMenu();
    var sel = document.querySelector('.a11y-widget__lang-select');
    expect(sel).not.toBeNull();
    expect(sel.value).toBe('he');
  });

  test('both configured languages appear as options in the select', () => {
    var w = AccessibilityWidget.init(EXAMPLE_OPTIONS);
    w.openMenu();
    var sel = document.querySelector('.a11y-widget__lang-select');
    var values = Array.from(sel.options).map(function (o) { return o.value; });
    expect(values).toContain('en');
    expect(values).toContain('he');
  });

  test('menu title is displayed in Hebrew', () => {
    var w = AccessibilityWidget.init(EXAMPLE_OPTIONS);
    w.openMenu();
    var title = document.querySelector('.a11y-widget__title');
    expect(title).not.toBeNull();
    // Hebrew: "תפריט נגישות"
    expect(title.textContent).toBe('\u05EA\u05E4\u05E8\u05D9\u05D8 \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA');
  });

  test('switching to English via setLanguage updates lang and dir', () => {
    var w = AccessibilityWidget.init(EXAMPLE_OPTIONS);
    w.setLanguage('en');
    expect(document.documentElement.getAttribute('lang')).toBe('en');
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
  });

  test('switching to English via the select updates the widget language', () => {
    var w = AccessibilityWidget.init(EXAMPLE_OPTIONS);
    w.openMenu();
    var sel = document.querySelector('.a11y-widget__lang-select');
    sel.value = 'en';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    expect(document.documentElement.getAttribute('lang')).toBe('en');
    expect(sel.value).toBe('en');
  });
});

// ===========================================================================
// 4. axe-core accessibility
// ===========================================================================

describe('examples/index-init-language.html: axe-core accessibility', () => {
  var AXE_OPTIONS = { rules: { region: { enabled: false } } };
  var EXAMPLE_OPTIONS = {
    defaultLanguage: 'he',
    languages: { en: 'English', he: '\u05E2\u05D1\u05E8\u05D9\u05EA' },
  };

  beforeEach(() => {
    var exampleDoc = parseExamplePage();
    document.body.innerHTML = exampleDoc.body.innerHTML;
    document.documentElement.setAttribute('lang', 'he');
    document.documentElement.setAttribute('dir', 'rtl');
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
