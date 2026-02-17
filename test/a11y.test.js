/**
 * Accessibility integration tests using axe-core via jest-axe.
 *
 * These tests verify that the widget's generated DOM conforms to WCAG 2.1
 * automated checks. They do NOT replace manual testing with screen readers
 * but they catch many common ARIA and markup mistakes automatically.
 *
 * Note: The "region" rule is disabled because the widget cannot control
 * whether the host page wraps its content in landmark regions.
 */

import { axe, toHaveNoViolations } from 'jest-axe';
import AccessibilityWidget from '../src/index.js';

expect.extend(toHaveNoViolations);

// Shared axe configuration: disable "region" rule (host page concern, not widget)
var AXE_OPTIONS = {
  rules: {
    region: { enabled: false },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function simulateClick(element) {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function getFeatureItem(featureId) {
  return document.querySelector('[data-feature="' + featureId + '"]');
}

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
// 1. Widget closed state
// ===========================================================================

describe('axe-core: Widget closed state', () => {
  test('widget toggle button has no accessibility violations', async () => {
    AccessibilityWidget.init();
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });
});

// ===========================================================================
// 2. Widget open state
// ===========================================================================

describe('axe-core: Widget open state', () => {
  test('open panel has no accessibility violations', async () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });

  test('open panel in Hebrew (RTL) has no accessibility violations', async () => {
    var w = AccessibilityWidget.init({
      defaultLanguage: 'he',
      languages: { en: 'English', he: '\u05E2\u05D1\u05E8\u05D9\u05EA' },
    });
    w.openMenu();
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });
});

// ===========================================================================
// 3. Widget with active features
// ===========================================================================

describe('axe-core: Widget with active features', () => {
  test('high contrast mode has no violations', async () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    simulateClick(getFeatureItem('highContrast'));
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });

  test('dark mode has no violations', async () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    simulateClick(getFeatureItem('darkMode'));
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });

  test('multiple features active simultaneously has no violations', async () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    simulateClick(getFeatureItem('highContrast'));
    simulateClick(getFeatureItem('underlineLinks'));
    simulateClick(getFeatureItem('focusOutline'));
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });

  test('font size increased has no violations', async () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    var plusBtn = document.querySelector('.a11y-widget__font-btn[data-action="increase"]');
    simulateClick(plusBtn);
    simulateClick(plusBtn);
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });
});

// ===========================================================================
// 4. Widget with page content
// ===========================================================================

describe('axe-core: Widget with surrounding page content', () => {
  var pageContent;

  beforeEach(() => {
    pageContent = document.createElement('main');
    pageContent.innerHTML =
      '<h1>Test Page</h1>' +
      '<p>Some paragraph text with a <a href="#">link</a>.</p>' +
      '<form>' +
      '<label for="test-input">Name</label>' +
      '<input type="text" id="test-input" />' +
      '</form>';
    document.body.appendChild(pageContent);
  });

  afterEach(() => {
    if (pageContent && pageContent.parentNode) {
      pageContent.parentNode.removeChild(pageContent);
    }
  });

  test('widget + page content has no violations', async () => {
    AccessibilityWidget.init();
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });

  test('widget open + page content has no violations', async () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });

  test('dark mode + page content has no violations', async () => {
    var w = AccessibilityWidget.init();
    w.openMenu();
    simulateClick(getFeatureItem('darkMode'));
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });
});

// ===========================================================================
// 5. Widget with features disabled
// ===========================================================================

describe('axe-core: Widget with subset of features', () => {
  test('widget with only visual features has no violations', async () => {
    var w = AccessibilityWidget.init({
      features: {
        dyslexiaFont: false,
        underlineLinks: false,
        hideImages: false,
        textSpacing: false,
        highlightHeadings: false,
        readingGuide: false,
        textToSpeech: false,
      },
    });
    w.openMenu();
    var results = await axe(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });
});
