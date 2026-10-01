import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const src = (path: string) => fileURLToPath(new URL(`../../src/${path}`, import.meta.url));

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  // Relative asset paths so the built demo works under GitHub Pages' /react-data-table/ subpath
  base: './',
  build: {
    outDir: fileURLToPath(new URL('../../demo-dist', import.meta.url)),
    emptyOutDir: true,
  },
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@corinovate/react-data-table/styles.css', replacement: src('styles.css') },
      { find: '@corinovate/react-data-table', replacement: src('index.ts') },
    ],
  },
});
