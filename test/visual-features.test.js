/**
 * Tests for the three visual feature bugs:
 *
 *  1. High Contrast – broad selector must cover all page elements,
 *     not just named tags, so background-colors on cards/containers are
 *     overridden.
 *
 *  2. Dark Mode – same root cause: named-element selectors only set `color`
 *     but never `background-color`, leaving white container backgrounds.
 *     The fix uses a broad *:not(.a11y-widget) rule to override both.
 *
 *  3. Invert Colors – applying `filter` to `body` creates a new CSS stacking
 *     context that traps position:fixed descendants, pushing the widget
 *     off-screen.  The fix moves the filter to `body > *:not(.a11y-widget)`.
 *
 * Two test categories are included:
 *  a) CSS structure tests – parse the stylesheet to verify the correct
 *     selectors and property values are present (catches regressions).
 *  b) DOM behavior tests  – activate/deactivate each feature via the real
 *     widget and verify class toggling and widget integrity.
 */

import fs from 'fs';
import path from 'path';
import AccessibilityWidget from '../src/index.js';
import { applyFeature, removeFeature } from '../src/features.js';

// ---------------------------------------------------------------------------
// Read CSS source once for structural assertions
// ---------------------------------------------------------------------------

var CSS_PATH = path.resolve(__dirname, '../src/a11y-widget.css');
var cssSource = fs.readFileSync(CSS_PATH, 'utf8');

// ---------------------------------------------------------------------------
// Shared cleanup
// ---------------------------------------------------------------------------

afterEach(() => {
  AccessibilityWidget.destroy();
  document.body.innerHTML = '';
  document.body.className = '';
  document.documentElement.className = '';
  localStorage.clear();
});

// ===========================================================================
// a) CSS structure tests
// ===========================================================================

// ---------------------------------------------------------------------------
// High Contrast
// ---------------------------------------------------------------------------

describe('CSS structure: High Contrast', () => {
  test('uses broad *:not(.a11y-widget):not(.a11y-widget *) selector', () => {
    expect(cssSource).toMatch(
      /body\.a11y-high-contrast \*:not\(\.a11y-widget\):not\(\.a11y-widget \*\)\s*\{/,
    );
  });

  test('broad rule overrides both background-color and color', () => {
    var match = cssSource.match(
      /body\.a11y-high-contrast \*:not\(\.a11y-widget\):not\(\.a11y-widget \*\)\s*\{([^}]+)\}/,
    );
    expect(match).not.toBeNull();
    var rule = match[1];
    expect(rule).toContain('background-color');
    expect(rule).toContain('#ffffff');
    expect(rule).toContain('color');
    expect(rule).toContain('#000000');
  });

  test('broad rule uses !important on background-color', () => {
    var match = cssSource.match(
      /body\.a11y-high-contrast \*:not\(\.a11y-widget\):not\(\.a11y-widget \*\)\s*\{([^}]+)\}/,
    );
    expect(match).not.toBeNull();
    // background-color line should include !important
    expect(match[1]).toMatch(/background-color\s*:[^;]+!important/);
  });
});

// ---------------------------------------------------------------------------
// Dark Mode
// ---------------------------------------------------------------------------

describe('CSS structure: Dark Mode', () => {
  test('uses broad *:not(.a11y-widget):not(.a11y-widget *) selector', () => {
    expect(cssSource).toMatch(
      /body\.a11y-dark-mode \*:not\(\.a11y-widget\):not\(\.a11y-widget \*\)\s*\{/,
    );
  });

  test('broad rule overrides both background-color and color', () => {
    var match = cssSource.match(
      /body\.a11y-dark-mode \*:not\(\.a11y-widget\):not\(\.a11y-widget \*\)\s*\{([^}]+)\}/,
    );
    expect(match).not.toBeNull();
    var rule = match[1];
    expect(rule).toContain('background-color');
    expect(rule).toContain('#1e1e1e');
    expect(rule).toContain('color');
    expect(rule).toContain('#f0f0f0');
  });

  test('broad rule uses !important on background-color', () => {
    var match = cssSource.match(
      /body\.a11y-dark-mode \*:not\(\.a11y-widget\):not\(\.a11y-widget \*\)\s*\{([^}]+)\}/,
    );
    expect(match).not.toBeNull();
    expect(match[1]).toMatch(/background-color\s*:[^;]+!important/);
  });
});

// ---------------------------------------------------------------------------
// Invert Colors
// ---------------------------------------------------------------------------

describe('CSS structure: Invert Colors', () => {
  test('body.a11y-invert-colors rule does NOT contain a filter property', () => {
    // Applying filter to body breaks position:fixed (new stacking context).
    // The body rule should only set background-color, not filter.
    var bodyRule = cssSource.match(/body\.a11y-invert-colors\s*\{([^}]+)\}/);
    expect(bodyRule).not.toBeNull();
    expect(bodyRule[1]).not.toMatch(/filter\s*:/);
  });

  test('filter is applied to body > *:not(.a11y-widget):not(.a11y-reading-guide-bar)', () => {
    expect(cssSource).toContain(
      'body.a11y-invert-colors > *:not(.a11y-widget):not(.a11y-reading-guide-bar)',
    );
  });

  test('the body > * rule applies invert(1) hue-rotate(180deg)', () => {
    var match = cssSource.match(
      /body\.a11y-invert-colors > \*:not\(\.a11y-widget\):not\(\.a11y-reading-guide-bar\)\s*\{([^}]+)\}/,
    );
    expect(match).not.toBeNull();
    var rule = match[1];
    expect(rule).toContain('filter');
    expect(rule).toContain('invert(1)');
    expect(rule).toContain('hue-rotate(180deg)');
  });

  test('there is no rule applying filter directly to .a11y-widget', () => {
    // The old (broken) approach had a rule re-inverting the widget element.
    // This rule is no longer needed and should not exist.
    expect(cssSource).not.toMatch(
      /body\.a11y-invert-colors\s+\.a11y-widget\s*\{[^}]*filter\s*:/,
    );
  });
});

// ===========================================================================
// b) DOM behavior tests — feature class toggling
// ===========================================================================

// ---------------------------------------------------------------------------
// High Contrast DOM tests
// ---------------------------------------------------------------------------

describe('High Contrast: DOM behaviour', () => {
  test('body gets a11y-high-contrast class when feature is applied', () => {
    applyFeature('highContrast', true);
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(true);
  });

  test('body loses a11y-high-contrast class when feature is removed', () => {
    applyFeature('highContrast', true);
    applyFeature('highContrast', false);
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(false);
  });

  test('widget toggle adds class; widget panel remains in DOM', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    var btn = document.querySelector('[data-feature="highContrast"]');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(true);
    expect(document.querySelector('.a11y-widget__panel')).not.toBeNull();
  });

  test('widget toggle removes class on second click', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    var btn = document.querySelector('[data-feature="highContrast"]');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(false);
  });

  test('resetAll removes the high-contrast class', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    var btn = document.querySelector('[data-feature="highContrast"]');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    w.resetAll();
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Dark Mode DOM tests
// ---------------------------------------------------------------------------

describe('Dark Mode: DOM behaviour', () => {
  test('body gets a11y-dark-mode class when feature is applied', () => {
    applyFeature('darkMode', true);
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(true);
  });

  test('body loses a11y-dark-mode class when feature is removed', () => {
    applyFeature('darkMode', true);
    applyFeature('darkMode', false);
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(false);
  });

  test('widget panel remains in DOM after dark mode is toggled', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    var btn = document.querySelector('[data-feature="darkMode"]');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(true);
    expect(document.querySelector('.a11y-widget__panel')).not.toBeNull();
  });

  test('widget toggle removes class on second click', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    var btn = document.querySelector('[data-feature="darkMode"]');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(false);
  });

  test('resetAll removes the dark-mode class', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    var btn = document.querySelector('[data-feature="darkMode"]');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    w.resetAll();
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Invert Colors DOM tests
// ---------------------------------------------------------------------------

describe('Invert Colors: DOM behaviour', () => {
  test('body gets a11y-invert-colors class when feature is applied', () => {
    applyFeature('invertColors', true);
    expect(document.body.classList.contains('a11y-invert-colors')).toBe(true);
  });

  test('body loses a11y-invert-colors class when feature is removed', () => {
    applyFeature('invertColors', true);
    applyFeature('invertColors', false);
    expect(document.body.classList.contains('a11y-invert-colors')).toBe(false);
  });

  test('body does not receive an inline filter style (filter is CSS-only)', () => {
    // Inline filter on body would break position:fixed — the fix is CSS-only.
    applyFeature('invertColors', true);
    expect(document.body.style.filter).toBeFalsy();
  });

  test('widget element does not receive an inline filter style', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    applyFeature('invertColors', true);
    var widgetEl = document.querySelector('.a11y-widget');
    expect(widgetEl).not.toBeNull();
    expect(widgetEl.style.filter).toBeFalsy();
  });

  test('widget panel remains in DOM after invert colors is toggled', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    var btn = document.querySelector('[data-feature="invertColors"]');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.body.classList.contains('a11y-invert-colors')).toBe(true);
    expect(document.querySelector('.a11y-widget__panel')).not.toBeNull();
  });

  test('widget toggle removes class on second click', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    var btn = document.querySelector('[data-feature="invertColors"]');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.body.classList.contains('a11y-invert-colors')).toBe(false);
  });

  test('resetAll removes the invert-colors class', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    w.openMenu();
    var btn = document.querySelector('[data-feature="invertColors"]');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    w.resetAll();
    expect(document.body.classList.contains('a11y-invert-colors')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Combination: high contrast + dark mode (mutual exclusivity is a UI concern;
// both classes can technically coexist at the CSS level)
// ---------------------------------------------------------------------------

describe('Visual features: combination behaviour', () => {
  test('high contrast and dark mode can both be active simultaneously', () => {
    applyFeature('highContrast', true);
    applyFeature('darkMode', true);
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(true);
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(true);
  });

  test('invert colors and high contrast can both be active simultaneously', () => {
    applyFeature('invertColors', true);
    applyFeature('highContrast', true);
    expect(document.body.classList.contains('a11y-invert-colors')).toBe(true);
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(true);
  });

  test('resetAll removes all three visual feature classes at once', () => {
    var w = AccessibilityWidget.init({ defaultLanguage: 'en' });
    applyFeature('highContrast', true);
    applyFeature('darkMode', true);
    applyFeature('invertColors', true);
    w.resetAll();
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(false);
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(false);
    expect(document.body.classList.contains('a11y-invert-colors')).toBe(false);
  });
});
