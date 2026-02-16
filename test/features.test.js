/**
 * Unit tests for the features module.
 */

import {
  FEATURES,
  getFeature,
  applyFeature,
  removeFeature,
  resetAllFeatures,
} from '../src/features.js';

// Clean up body classes between tests
beforeEach(() => {
  document.body.className = '';
});

// ===========================================================================
// 1. FEATURES array structure
// ===========================================================================

describe('FEATURES array structure', () => {
  test('contains exactly 7 features', () => {
    expect(FEATURES).toHaveLength(7);
  });

  test('every feature has required properties', () => {
    FEATURES.forEach((f) => {
      expect(f).toHaveProperty('id');
      expect(f).toHaveProperty('type');
      expect(f).toHaveProperty('cssClass');
      expect(f).toHaveProperty('default');
      expect(f).toHaveProperty('icon');
      expect(f).toHaveProperty('group');
    });
  });

  test('all feature ids are unique', () => {
    const ids = FEATURES.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('all features have non-empty icon strings', () => {
    FEATURES.forEach((f) => {
      expect(typeof f.icon).toBe('string');
      expect(f.icon.length).toBeGreaterThan(0);
      expect(f.icon).toContain('<svg');
    });
  });
});

// ===========================================================================
// 2. Individual feature definitions
// ===========================================================================

describe('Feature definitions', () => {
  test('highContrast is a toggle in visual group', () => {
    const f = getFeature('highContrast');
    expect(f.id).toBe('highContrast');
    expect(f.type).toBe('toggle');
    expect(f.cssClass).toBe('a11y-high-contrast');
    expect(f.default).toBe(false);
    expect(f.group).toBe('visual');
  });

  test('darkMode is a toggle in visual group', () => {
    const f = getFeature('darkMode');
    expect(f.id).toBe('darkMode');
    expect(f.type).toBe('toggle');
    expect(f.cssClass).toBe('a11y-dark-mode');
    expect(f.default).toBe(false);
    expect(f.group).toBe('visual');
  });

  test('fontSize is a range in visual group', () => {
    const f = getFeature('fontSize');
    expect(f.id).toBe('fontSize');
    expect(f.type).toBe('range');
    expect(f.cssClass).toBe('a11y-font');
    expect(f.default).toBe(0);
    expect(f.group).toBe('visual');
    expect(f.min).toBe(0);
    expect(f.max).toBe(5);
    expect(f.step).toBe(1);
  });

  test('dyslexiaFont is a toggle in content group', () => {
    const f = getFeature('dyslexiaFont');
    expect(f.id).toBe('dyslexiaFont');
    expect(f.type).toBe('toggle');
    expect(f.cssClass).toBe('a11y-dyslexia-font');
    expect(f.default).toBe(false);
    expect(f.group).toBe('content');
  });

  test('underlineLinks is a toggle in content group', () => {
    const f = getFeature('underlineLinks');
    expect(f.id).toBe('underlineLinks');
    expect(f.type).toBe('toggle');
    expect(f.cssClass).toBe('a11y-underline-links');
    expect(f.default).toBe(false);
    expect(f.group).toBe('content');
  });

  test('hideImages is a toggle in content group', () => {
    const f = getFeature('hideImages');
    expect(f.id).toBe('hideImages');
    expect(f.type).toBe('toggle');
    expect(f.cssClass).toBe('a11y-hide-images');
    expect(f.default).toBe(false);
    expect(f.group).toBe('content');
  });

  test('focusOutline is a toggle in navigation group', () => {
    const f = getFeature('focusOutline');
    expect(f.id).toBe('focusOutline');
    expect(f.type).toBe('toggle');
    expect(f.cssClass).toBe('a11y-focus-outline');
    expect(f.default).toBe(false);
    expect(f.group).toBe('navigation');
  });
});

// ===========================================================================
// 3. Group distribution
// ===========================================================================

describe('Feature groups', () => {
  test('visual group has 3 features', () => {
    const visual = FEATURES.filter((f) => f.group === 'visual');
    expect(visual).toHaveLength(3);
  });

  test('content group has 3 features', () => {
    const content = FEATURES.filter((f) => f.group === 'content');
    expect(content).toHaveLength(3);
  });

  test('navigation group has 1 feature', () => {
    const nav = FEATURES.filter((f) => f.group === 'navigation');
    expect(nav).toHaveLength(1);
  });
});

// ===========================================================================
// 4. getFeature
// ===========================================================================

describe('getFeature', () => {
  test('returns correct feature for each valid id', () => {
    FEATURES.forEach((f) => {
      expect(getFeature(f.id)).toBe(f);
    });
  });

  test('returns undefined for unknown id', () => {
    expect(getFeature('nonExistent')).toBeUndefined();
  });

  test('returns undefined for empty string', () => {
    expect(getFeature('')).toBeUndefined();
  });

  test('returns undefined for null', () => {
    expect(getFeature(null)).toBeUndefined();
  });

  test('returns undefined for undefined', () => {
    expect(getFeature(undefined)).toBeUndefined();
  });
});

// ===========================================================================
// 5. applyFeature – toggle features
// ===========================================================================

describe('applyFeature – toggle', () => {
  const toggleFeatures = FEATURES.filter((f) => f.type === 'toggle');

  test('true adds CSS class to document.body for each toggle', () => {
    toggleFeatures.forEach((f) => {
      document.body.className = '';
      applyFeature(f.id, true);
      expect(document.body.classList.contains(f.cssClass)).toBe(true);
    });
  });

  test('false removes CSS class from document.body', () => {
    toggleFeatures.forEach((f) => {
      document.body.classList.add(f.cssClass);
      applyFeature(f.id, false);
      expect(document.body.classList.contains(f.cssClass)).toBe(false);
    });
  });

  test('applying true twice does not duplicate class', () => {
    applyFeature('highContrast', true);
    applyFeature('highContrast', true);
    const matches = document.body.className.split(' ').filter((c) => c === 'a11y-high-contrast');
    expect(matches).toHaveLength(1);
  });

  test('applying false when class not present is safe', () => {
    expect(() => applyFeature('highContrast', false)).not.toThrow();
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(false);
  });

  test('truthy values add class (number 1)', () => {
    applyFeature('darkMode', 1);
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(true);
  });

  test('falsy values remove class (0)', () => {
    document.body.classList.add('a11y-dark-mode');
    applyFeature('darkMode', 0);
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(false);
  });
});

// ===========================================================================
// 6. applyFeature – range (fontSize)
// ===========================================================================

describe('applyFeature – range (fontSize)', () => {
  test('value > 0 adds a11y-font-{value} class', () => {
    applyFeature('fontSize', 3);
    expect(document.body.classList.contains('a11y-font-3')).toBe(true);
  });

  test('value 0 does not add any font class', () => {
    applyFeature('fontSize', 0);
    for (let i = 0; i <= 5; i++) {
      expect(document.body.classList.contains('a11y-font-' + i)).toBe(false);
    }
  });

  test('removes old font class before adding new one', () => {
    applyFeature('fontSize', 2);
    expect(document.body.classList.contains('a11y-font-2')).toBe(true);

    applyFeature('fontSize', 4);
    expect(document.body.classList.contains('a11y-font-4')).toBe(true);
    expect(document.body.classList.contains('a11y-font-2')).toBe(false);
  });

  test('each font level from 1 to 5', () => {
    for (let level = 1; level <= 5; level++) {
      applyFeature('fontSize', level);
      expect(document.body.classList.contains('a11y-font-' + level)).toBe(true);
      if (level > 1) {
        expect(document.body.classList.contains('a11y-font-' + (level - 1))).toBe(false);
      }
    }
  });

  test('string number value works', () => {
    applyFeature('fontSize', '3');
    expect(document.body.classList.contains('a11y-font-3')).toBe(true);
  });

  test('setting to 0 after a non-zero removes the class', () => {
    applyFeature('fontSize', 3);
    applyFeature('fontSize', 0);
    expect(document.body.classList.contains('a11y-font-3')).toBe(false);
  });
});

// ===========================================================================
// 7. applyFeature – unknown feature
// ===========================================================================

describe('applyFeature – unknown feature', () => {
  test('does nothing for unknown featureId', () => {
    const classBefore = document.body.className;
    applyFeature('nonExistent', true);
    expect(document.body.className).toBe(classBefore);
  });
});

// ===========================================================================
// 8. removeFeature
// ===========================================================================

describe('removeFeature', () => {
  test('removes toggle class from body', () => {
    document.body.classList.add('a11y-high-contrast');
    removeFeature('highContrast');
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(false);
  });

  test('removes each toggle feature class', () => {
    const toggles = FEATURES.filter((f) => f.type === 'toggle');
    toggles.forEach((f) => {
      document.body.classList.add(f.cssClass);
      removeFeature(f.id);
      expect(document.body.classList.contains(f.cssClass)).toBe(false);
    });
  });

  test('removes range classes from body', () => {
    document.body.classList.add('a11y-font-3');
    removeFeature('fontSize');
    for (let i = 0; i <= 5; i++) {
      expect(document.body.classList.contains('a11y-font-' + i)).toBe(false);
    }
  });

  test('removing when class not present is safe', () => {
    expect(() => removeFeature('highContrast')).not.toThrow();
  });

  test('unknown featureId does nothing', () => {
    const classBefore = document.body.className;
    removeFeature('nonExistent');
    expect(document.body.className).toBe(classBefore);
  });
});

// ===========================================================================
// 9. resetAllFeatures
// ===========================================================================

describe('resetAllFeatures', () => {
  test('removes all feature classes from body', () => {
    // Apply all features
    FEATURES.forEach((f) => {
      if (f.type === 'toggle') {
        applyFeature(f.id, true);
      } else {
        applyFeature(f.id, 3);
      }
    });

    resetAllFeatures();

    // Check all are removed
    FEATURES.forEach((f) => {
      if (f.type === 'toggle') {
        expect(document.body.classList.contains(f.cssClass)).toBe(false);
      }
    });

    // Check font classes are all removed
    for (let i = 0; i <= 5; i++) {
      expect(document.body.classList.contains('a11y-font-' + i)).toBe(false);
    }
  });

  test('is safe when no features are applied', () => {
    expect(() => resetAllFeatures()).not.toThrow();
  });

  test('does not remove non-feature classes from body', () => {
    document.body.classList.add('my-custom-class');
    applyFeature('highContrast', true);
    resetAllFeatures();
    expect(document.body.classList.contains('my-custom-class')).toBe(true);
  });
});

// ===========================================================================
// 10. Multiple features simultaneously
// ===========================================================================

describe('Multiple simultaneous features', () => {
  test('multiple toggle features can be applied at once', () => {
    applyFeature('highContrast', true);
    applyFeature('darkMode', true);
    applyFeature('dyslexiaFont', true);
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(true);
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(true);
    expect(document.body.classList.contains('a11y-dyslexia-font')).toBe(true);
  });

  test('toggle and range features can coexist', () => {
    applyFeature('highContrast', true);
    applyFeature('fontSize', 4);
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(true);
    expect(document.body.classList.contains('a11y-font-4')).toBe(true);
  });

  test('removing one feature does not affect others', () => {
    applyFeature('highContrast', true);
    applyFeature('darkMode', true);
    removeFeature('highContrast');
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(false);
    expect(document.body.classList.contains('a11y-dark-mode')).toBe(true);
  });

  test('apply then remove cycle returns to clean state', () => {
    const toggles = FEATURES.filter((f) => f.type === 'toggle');
    toggles.forEach((f) => applyFeature(f.id, true));
    applyFeature('fontSize', 5);

    toggles.forEach((f) => removeFeature(f.id));
    removeFeature('fontSize');

    toggles.forEach((f) => {
      expect(document.body.classList.contains(f.cssClass)).toBe(false);
    });
    for (let i = 0; i <= 5; i++) {
      expect(document.body.classList.contains('a11y-font-' + i)).toBe(false);
    }
  });
});
