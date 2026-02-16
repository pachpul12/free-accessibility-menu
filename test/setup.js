/**
 * Jest setup file -- executed before every test suite.
 *
 * Provides a minimal localStorage mock and any other jsdom shims required
 * by the accessibility widget during tests.
 */

// ── localStorage mock ───────────────────────────────────────────────────────
const localStorageMock = (() => {
  let store = {};

  return {
    getItem(key) {
      return store[key] ?? null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key(index) {
      return Object.keys(store)[index] ?? null;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// ── matchMedia mock (jsdom does not implement it) ───────────────────────────
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),    // deprecated but still used by some libraries
    removeListener: jest.fn(), // deprecated but still used by some libraries
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ── Reset localStorage between tests ────────────────────────────────────────
// Note: beforeEach is available in setupFiles when using jest-environment-jsdom
// but we expose the mock for manual clearing if needed.
if (typeof beforeEach !== 'undefined') {
  beforeEach(() => {
    localStorageMock.clear();
  });
}
