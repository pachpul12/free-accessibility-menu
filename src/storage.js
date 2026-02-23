/**
 * LocalStorage persistence module for the Accessibility Widget.
 *
 * Provides a thin wrapper around `localStorage` to save, load, and clear
 * user accessibility settings.  All operations are guarded with try/catch
 * so that environments where storage is unavailable (private browsing,
 * storage quota exceeded, SSR) degrade gracefully.
 *
 * @module storage
 */

// ---------------------------------------------------------------------------
// Default storage key
// ---------------------------------------------------------------------------

/**
 * The default key used to persist settings in localStorage.
 * @type {string}
 */
let STORAGE_KEY = 'a11yWidgetSettings';

// ---------------------------------------------------------------------------
// Public API
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

/**
 * Persist the supplied settings object to localStorage.
 *
 * The object is serialised as JSON.  If localStorage is unavailable or
 * the write fails (e.g. quota exceeded) the error is silently swallowed
 * so that the widget continues to function normally.
 *
 * @param {Record<string, *>} settings - Plain object of feature settings.
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (_err) {
    // Storage unavailable or quota exceeded -- fail silently.
  }
}

/**
 * Load and return previously saved settings from localStorage.
 *
 * Returns `null` when no settings exist or when the stored value cannot
 * be parsed as valid JSON.
 *
 * @returns {Record<string, *>|null}
 */
export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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
 * Remove the settings entry from localStorage.
 */
export function clearSettings() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_err) {
    // Storage unavailable -- fail silently.
  }
}

// ---------------------------------------------------------------------------
// Profiles (named presets) persistence
// ---------------------------------------------------------------------------

/**
 * Persist a profiles map to localStorage under the given key.
 *
 * @param {Record<string, Record<string, *>>} profiles - Map of name → settings.
 * @param {string} key - The localStorage key to write to.
 */
export function saveProfiles(profiles, key) {
  try {
    localStorage.setItem(key, JSON.stringify(profiles));
  } catch (_err) {
    // Storage unavailable or quota exceeded -- fail silently.
  }
}

/**
 * Load a profiles map from localStorage.
 *
 * Returns `null` when no entry exists or when the stored value cannot be
 * parsed as a valid JSON object.
 *
 * @param {string} key - The localStorage key to read from.
 * @returns {Record<string, Record<string, *>>|null}
 */
export function loadProfiles(key) {
  try {
    const raw = localStorage.getItem(key);
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
 * Remove the profiles entry from localStorage.
 *
 * @param {string} key - The localStorage key to remove.
 */
export function clearProfiles(key) {
  try {
    localStorage.removeItem(key);
  } catch (_err) {
    // Storage unavailable -- fail silently.
  }
}

export { STORAGE_KEY };
