/**
 * Unit tests for the storage module.
 */

import {
  saveSettings,
  loadSettings,
  clearSettings,
  setStorageKey,
  getStorageKey,
  STORAGE_KEY,
} from '../src/storage.js';

// Reset storage key after each test to avoid pollution
afterEach(() => {
  try {
    setStorageKey('a11yWidgetSettings');
  } catch (_e) {
    // ignore
  }
  localStorage.clear();
});

// ===========================================================================
// 1. Default STORAGE_KEY
// ===========================================================================

describe('STORAGE_KEY default', () => {
  test('default value is "a11yWidgetSettings"', () => {
    expect(STORAGE_KEY).toBe('a11yWidgetSettings');
  });
});

// ===========================================================================
// 2. getStorageKey
// ===========================================================================

describe('getStorageKey', () => {
  test('returns the current storage key', () => {
    expect(getStorageKey()).toBe('a11yWidgetSettings');
  });

  test('returns updated key after setStorageKey', () => {
    setStorageKey('custom-key');
    expect(getStorageKey()).toBe('custom-key');
  });
});

// ===========================================================================
// 3. setStorageKey
// ===========================================================================

describe('setStorageKey', () => {
  test('sets a valid non-empty string key', () => {
    setStorageKey('myKey');
    expect(getStorageKey()).toBe('myKey');
  });

  test('throws on empty string', () => {
    expect(() => setStorageKey('')).toThrow('Storage key must be a non-empty string.');
  });

  test('throws on non-string (number)', () => {
    expect(() => setStorageKey(123)).toThrow('Storage key must be a non-empty string.');
  });

  test('throws on non-string (null)', () => {
    expect(() => setStorageKey(null)).toThrow('Storage key must be a non-empty string.');
  });

  test('throws on non-string (undefined)', () => {
    expect(() => setStorageKey(undefined)).toThrow('Storage key must be a non-empty string.');
  });

  test('throws on non-string (boolean)', () => {
    expect(() => setStorageKey(true)).toThrow('Storage key must be a non-empty string.');
  });

  test('throws on non-string (object)', () => {
    expect(() => setStorageKey({})).toThrow('Storage key must be a non-empty string.');
  });

  test('does not change key when it throws', () => {
    const originalKey = getStorageKey();
    try {
      setStorageKey('');
    } catch (_e) {
      // expected
    }
    expect(getStorageKey()).toBe(originalKey);
  });
});

// ===========================================================================
// 4. saveSettings
// ===========================================================================

describe('saveSettings', () => {
  test('stores JSON in localStorage under the current key', () => {
    const settings = { highContrast: true, fontSize: 3 };
    saveSettings(settings);
    const stored = localStorage.getItem('a11yWidgetSettings');
    expect(stored).toBe(JSON.stringify(settings));
  });

  test('stores an empty object', () => {
    saveSettings({});
    expect(localStorage.getItem('a11yWidgetSettings')).toBe('{}');
  });

  test('stores nested objects', () => {
    const settings = { nested: { deep: { value: 42 } } };
    saveSettings(settings);
    expect(JSON.parse(localStorage.getItem('a11yWidgetSettings'))).toEqual(settings);
  });

  test('stores arrays', () => {
    const settings = { items: [1, 2, 3] };
    saveSettings(settings);
    expect(JSON.parse(localStorage.getItem('a11yWidgetSettings'))).toEqual(settings);
  });

  test('stores booleans and numbers', () => {
    const settings = { active: true, inactive: false, count: 0, level: 5 };
    saveSettings(settings);
    expect(JSON.parse(localStorage.getItem('a11yWidgetSettings'))).toEqual(settings);
  });

  test('overwrites previous value', () => {
    saveSettings({ first: true });
    saveSettings({ second: true });
    const stored = JSON.parse(localStorage.getItem('a11yWidgetSettings'));
    expect(stored).toEqual({ second: true });
    expect(stored.first).toBeUndefined();
  });

  test('silently fails when localStorage.setItem throws', () => {
    const original = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error('QuotaExceeded');
    };
    expect(() => saveSettings({ test: true })).not.toThrow();
    localStorage.setItem = original;
  });

  test('uses custom key after setStorageKey', () => {
    setStorageKey('myCustom');
    saveSettings({ custom: true });
    expect(localStorage.getItem('myCustom')).toBe(JSON.stringify({ custom: true }));
    expect(localStorage.getItem('a11yWidgetSettings')).toBeNull();
  });
});

// ===========================================================================
// 5. loadSettings
// ===========================================================================

describe('loadSettings', () => {
  test('returns parsed object from localStorage', () => {
    const settings = { highContrast: true, fontSize: 2 };
    localStorage.setItem('a11yWidgetSettings', JSON.stringify(settings));
    expect(loadSettings()).toEqual(settings);
  });

  test('returns null when no data exists', () => {
    expect(loadSettings()).toBeNull();
  });

  test('returns null when stored value is invalid JSON', () => {
    localStorage.setItem('a11yWidgetSettings', 'not-valid-json{{{');
    expect(loadSettings()).toBeNull();
  });

  test('returns null when stored value is empty string', () => {
    localStorage.setItem('a11yWidgetSettings', '');
    expect(loadSettings()).toBeNull();
  });

  test('silently returns null when localStorage.getItem throws', () => {
    const original = localStorage.getItem;
    localStorage.getItem = () => {
      throw new Error('SecurityError');
    };
    expect(loadSettings()).toBeNull();
    localStorage.getItem = original;
  });

  test('loads from custom key after setStorageKey', () => {
    localStorage.setItem('customKey', JSON.stringify({ val: 99 }));
    setStorageKey('customKey');
    expect(loadSettings()).toEqual({ val: 99 });
  });

  test('returns exact parsed JSON types', () => {
    const settings = { bool: true, num: 42, str: 'hello', arr: [1, 2], obj: { a: 1 } };
    localStorage.setItem('a11yWidgetSettings', JSON.stringify(settings));
    const loaded = loadSettings();
    expect(loaded.bool).toBe(true);
    expect(loaded.num).toBe(42);
    expect(loaded.str).toBe('hello');
    expect(loaded.arr).toEqual([1, 2]);
    expect(loaded.obj).toEqual({ a: 1 });
  });
});

// ===========================================================================
// 6. clearSettings
// ===========================================================================

describe('clearSettings', () => {
  test('removes the key from localStorage', () => {
    saveSettings({ test: true });
    expect(localStorage.getItem('a11yWidgetSettings')).not.toBeNull();
    clearSettings();
    expect(localStorage.getItem('a11yWidgetSettings')).toBeNull();
  });

  test('does not throw when key does not exist', () => {
    expect(() => clearSettings()).not.toThrow();
  });

  test('silently fails when localStorage.removeItem throws', () => {
    const original = localStorage.removeItem;
    localStorage.removeItem = () => {
      throw new Error('SecurityError');
    };
    expect(() => clearSettings()).not.toThrow();
    localStorage.removeItem = original;
  });

  test('clears custom key after setStorageKey', () => {
    setStorageKey('myKey');
    saveSettings({ data: true });
    expect(localStorage.getItem('myKey')).not.toBeNull();
    clearSettings();
    expect(localStorage.getItem('myKey')).toBeNull();
  });
});

// ===========================================================================
// 7. Integration / Multi-operation
// ===========================================================================

describe('Multi-operation scenarios', () => {
  test('save then load returns same data', () => {
    const data = { highContrast: true, darkMode: false, fontSize: 3 };
    saveSettings(data);
    expect(loadSettings()).toEqual(data);
  });

  test('save, clear, load returns null', () => {
    saveSettings({ test: true });
    clearSettings();
    expect(loadSettings()).toBeNull();
  });

  test('multiple save/load cycles work correctly', () => {
    saveSettings({ round: 1 });
    expect(loadSettings()).toEqual({ round: 1 });

    saveSettings({ round: 2 });
    expect(loadSettings()).toEqual({ round: 2 });

    saveSettings({ round: 3 });
    expect(loadSettings()).toEqual({ round: 3 });
  });

  test('key isolation - different keys do not interfere', () => {
    saveSettings({ key1: true });

    setStorageKey('otherKey');
    saveSettings({ key2: true });

    // Load from otherKey
    expect(loadSettings()).toEqual({ key2: true });

    // Switch back and verify original data
    setStorageKey('a11yWidgetSettings');
    expect(loadSettings()).toEqual({ key1: true });
  });

  test('changing key between save and load reads from new key', () => {
    saveSettings({ original: true });
    setStorageKey('newKey');
    expect(loadSettings()).toBeNull();

    saveSettings({ newData: true });
    expect(loadSettings()).toEqual({ newData: true });
  });
});
