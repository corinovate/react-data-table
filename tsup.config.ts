import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts', styles: 'src/styles.css' },
  format: ['esm', 'cjs'],
  dts: { entry: { index: 'src/index.ts' } },
  sourcemap: true,
  clean: true,
  target: 'es2019',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  banner: { js: '"use client";' },
});
