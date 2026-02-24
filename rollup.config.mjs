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

/**
 * Plugin that copies the JSON Schema file from src/ to dist/.
 */
function copySchema() {
  return {
    name: 'copy-schema',
    writeBundle() {
      const srcPath = resolve(__dirname, 'src/config.schema.json');
      const destDir = resolve(__dirname, 'dist');
      const destPath = resolve(destDir, 'config.schema.json');

      if (!existsSync(srcPath)) {
        console.warn('[copy-schema] src/config.schema.json not found -- skipping.');
        return;
      }

      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }

      writeFileSync(destPath, readFileSync(srcPath, 'utf-8'));
      console.log('[copy-schema] Copied config.schema.json to dist/');
    },
  };
}

/**
 * Plugin that copies the TypeScript declaration file from src/ to dist/.
 */
function copyDTS() {
  return {
    name: 'copy-dts',
    writeBundle() {
      const srcPath = resolve(__dirname, 'src/index.d.ts');
      const destDir = resolve(__dirname, 'dist');
      const destPath = resolve(destDir, 'index.d.ts');

      if (!existsSync(srcPath)) {
        console.warn('[copy-dts] src/index.d.ts not found -- skipping.');
        return;
      }

      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }

      writeFileSync(destPath, readFileSync(srcPath, 'utf-8'));
      console.log('[copy-dts] Copied index.d.ts to dist/');
    },
  };
}

export default [
  // ── ESM (for modern bundlers and import statements) ──────────────────────
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [copyCSS(), copyDTS(), copySchema()],
  },

  // ── CJS (for Node.js require()) ───────────────────────────────────────────
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'auto',
    },
  },

  // ── UMD (unminified - for script tags and legacy) ─────────────────────────
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'AccessibilityWidget',
      sourcemap: true,
    },
  },

  // ── UMD (minified - for CDNs like unpkg/jsdelivr) ─────────────────────────
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'AccessibilityWidget',
      sourcemap: true,
    },
    plugins: [terser()],
  },

  // ── Web Component (ESM — for direct <script type="module"> use) ───────────
  {
    input: 'src/element.js',
    output: {
      file: 'dist/element.js',
      format: 'es',
      sourcemap: true,
    },
  },

  // ── Web Component (UMD minified — for CDN script tag use) ─────────────────
  {
    input: 'src/element.js',
    output: {
      file: 'dist/element.umd.min.js',
      format: 'umd',
      name: 'AccessibilityWidgetElement',
      sourcemap: true,
    },
    plugins: [terser()],
  },
];
