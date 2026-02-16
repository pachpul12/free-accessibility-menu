import terser from '@rollup/plugin-terser';
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Simple plugin that copies the CSS file from src/ to dist/.
 * Keeps the build pipeline free of heavy CSS-processing dependencies.
 */
function copyCSS() {
  return {
    name: 'copy-css',
    writeBundle() {
      const srcPath = resolve(__dirname, 'src/a11y-widget.css');
      const destDir = resolve(__dirname, 'dist');
      const destPath = resolve(destDir, 'a11y-widget.css');

      if (!existsSync(srcPath)) {
        console.warn('[copy-css] src/a11y-widget.css not found -- skipping.');
        return;
      }

      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }

      writeFileSync(destPath, readFileSync(srcPath, 'utf-8'));
      console.log('[copy-css] Copied a11y-widget.css to dist/');
    },
  };
}

export default [
  // ── UMD (unminified) ──────────────────────────────────────────────────
  {
    input: 'src/index.js',
    output: {
      file: 'dist/a11y-widget.umd.js',
      format: 'umd',
      name: 'AccessibilityWidget',
      sourcemap: true,
    },
    plugins: [copyCSS()],
  },

  // ── UMD (minified) ────────────────────────────────────────────────────
  {
    input: 'src/index.js',
    output: {
      file: 'dist/a11y-widget.umd.min.js',
      format: 'umd',
      name: 'AccessibilityWidget',
      sourcemap: true,
    },
    plugins: [terser()],
  },

  // ── ESM ────────────────────────────────────────────────────────────────
  {
    input: 'src/index.js',
    output: {
      file: 'dist/a11y-widget.esm.js',
      format: 'es',
      sourcemap: true,
    },
  },
];
