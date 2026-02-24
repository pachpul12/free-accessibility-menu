/**
 * LocalStorage persistence module for the Accessibility Widget.
 *
 * Provides a thin wrapper around a swappable storage backend to save, load,
 * and clear user accessibility settings.  The default backend is
 * `localStorage`.  Alternative backends are configured via
 * {@link setStorageMode} before calling `AccessibilityWidget.init()`:
 *
 * ```js
 * import { setStorageMode } from './storage.js';
 *
 * // Use sessionStorage instead:
 * setStorageMode('sessionStorage');
 *
 * // Disable persistence entirely:
 * setStorageMode('none');
 *
 * // Bring-your-own storage provider:
 * setStorageMode({
 *   getItem: (key) => myDB.get(key),
 *   setItem: (key, value) => myDB.set(key, value),
 *   removeItem: (key) => myDB.delete(key),
 * });
 * ```
 *
 * All operations are guarded with try/catch so that environments where
 * storage is unavailable (private browsing, storage quota exceeded, SSR)
 * degrade gracefully.
 *
 * @module storage
 */

// ---------------------------------------------------------------------------
// No-op provider (used when storage mode is 'none')
// ---------------------------------------------------------------------------

const NO_OP_PROVIDER = {
  getItem() { return null; },
  setItem() {},
  removeItem() {},
};

// ---------------------------------------------------------------------------
// Module state
// ---------------------------------------------------------------------------

/**
 * The default key used to persist settings.
 * @type {string}
 */
let STORAGE_KEY = 'a11yWidgetSettings';

/**
 * The active storage provider.
 * Defaults to `localStorage`; falls back to no-op if unavailable (SSR).
 * @type {{ getItem: Function, setItem: Function, removeItem: Function }}
 */
let _provider = _resolveBuiltIn('localStorage');

// ---------------------------------------------------------------------------
// Internal: resolve a named built-in
// ---------------------------------------------------------------------------

/**
 * @param {'localStorage'|'sessionStorage'} name
 * @returns {{ getItem, setItem, removeItem }}
 */
function _resolveBuiltIn(name) {
  try {
    if (typeof window !== 'undefined' && window[name]) {
      return window[name];
    }
  } catch (_e) { /* SSR or restricted */ }
  return NO_OP_PROVIDER;
}

// ---------------------------------------------------------------------------
// Public: configure storage mode
// ---------------------------------------------------------------------------

/**
 * Set the storage backend used by all subsequent save/load/clear operations.
 *
 * Accepted values:
 * - `'localStorage'` *(default)* — browser `localStorage`
 * - `'sessionStorage'` — browser `sessionStorage` (cleared when tab closes)
 * - `'none'` — disables persistence; settings live only in memory
 * - `object` — a custom provider implementing
 *   `{ getItem(key): string|null, setItem(key, value): void, removeItem(key): void }`
 *
 * Must be called **before** `AccessibilityWidget.init()` to take effect.
 *
 * @param {'localStorage'|'sessionStorage'|'none'|Object} mode
 * @throws {Error} If `mode` is an unrecognised string or an invalid object.
 */
export function setStorageMode(mode) {
  if (mode === 'localStorage') {
    _provider = _resolveBuiltIn('localStorage');
  } else if (mode === 'sessionStorage') {
    _provider = _resolveBuiltIn('sessionStorage');
  } else if (mode === 'none') {
    _provider = NO_OP_PROVIDER;
  } else if (
    mode !== null &&
    typeof mode === 'object' &&
    typeof mode.getItem === 'function' &&
    typeof mode.setItem === 'function' &&
    typeof mode.removeItem === 'function'
  ) {
    _provider = mode;
  } else {
    throw new Error(
      'Invalid storage mode. Expected "localStorage", "sessionStorage", "none", ' +
      'or an object with getItem / setItem / removeItem methods.'
    );
  }
}

/**
 * Return the currently active storage provider object.
 *
 * @returns {{ getItem: Function, setItem: Function, removeItem: Function }}
 */
export function getStorageMode() {
  return _provider;
}

// ---------------------------------------------------------------------------
// Storage key management
// ---------------------------------------------------------------------------

/**
 * Override the storage key used for all subsequent save/load/clear
 * operations.  Useful when multiple independent widget instances must
 * coexist on the same origin.
 *
 * @param {string} key - A non-empty string to use as the new storage key.
 * @throws {Error} If `key` is not a non-empty string.
 */
export function setStorageKey(key) {
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('Storage key must be a non-empty string.');
  }
  STORAGE_KEY = key;
}

/**
 * Return the current storage key.
 *
 * @returns {string}
 */
export function getStorageKey() {
  return STORAGE_KEY;
}

// ---------------------------------------------------------------------------
// Settings persistence
// ---------------------------------------------------------------------------

/**
 * Persist the supplied settings object to the active storage backend.
 *
 * The object is serialised as JSON.  If the backend is unavailable or the
 * write fails the error is silently swallowed so the widget continues
 * to function normally.
 *
 * @param {Record<string, *>} settings - Plain object of feature settings.
 */
export function saveSettings(settings) {
  try {
    _provider.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (_err) {
    // Storage unavailable or quota exceeded -- fail silently.
  }
}

/**
 * Load and return previously saved settings from the active backend.
 *
 * Returns `null` when no settings exist or when the stored value cannot
 * be parsed as valid JSON.
 *
 * @returns {Record<string, *>|null}
 */
export function loadSettings() {
  try {
    const raw = _provider.getItem(STORAGE_KEY);
    if (raw === null) {
      return null;
    }
    return JSON.parse(raw);
  } catch (_err) {
    // Invalid JSON or storage unavailable.
    return null;
  }
}

/**
 * Remove the settings entry from the active storage backend.
 */
export function clearSettings() {
  try {
    _provider.removeItem(STORAGE_KEY);
  } catch (_err) {
    // Storage unavailable -- fail silently.
  }
}

// ---------------------------------------------------------------------------
// Profiles (named presets) persistence
// ---------------------------------------------------------------------------

/**
 * Persist a profiles map to the active backend under the given key.
 *
 * @param {Record<string, Record<string, *>>} profiles - Map of name → settings.
 * @param {string} key - The storage key to write to.
 */
export function saveProfiles(profiles, key) {
  try {
    _provider.setItem(key, JSON.stringify(profiles));
  } catch (_err) {
    // Storage unavailable or quota exceeded -- fail silently.
  }
}

/**
 * Load a profiles map from the active backend.
 *
 * Returns `null` when no entry exists or when the stored value cannot be
 * parsed as a valid JSON object.
 *
 * @param {string} key - The storage key to read from.
 * @returns {Record<string, Record<string, *>>|null}
 */
export function loadProfiles(key) {
  try {
    const raw = _provider.getItem(key);
    if (raw === null) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
    return null;
  } catch (_err) {
    return null;
  }
}

/**
 * Remove the profiles entry from the active backend.
 *
 * @param {string} key - The storage key to remove.
 */
export function clearProfiles(key) {
  try {
    _provider.removeItem(key);
  } catch (_err) {
    // Storage unavailable -- fail silently.
  }
}

export { STORAGE_KEY };
