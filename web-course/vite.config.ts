import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/curso_de_python/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    port: 3000,
    open: true,
  },
  // O worker do Pyodide importa a distribuição ESM do CDN em tempo de
  // execução (`import(...pyodide.mjs)`), o que exige worker em formato ES
  // tanto no dev quanto no build.
  worker: {
    format: 'es',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Pyodide is loaded from CDN at runtime; we don't bundle it.
    // The wasm/worker assets stay small.
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'codemirror': [
            '@codemirror/state',
            '@codemirror/view',
            '@codemirror/lang-python',
            '@codemirror/commands',
            '@codemirror/theme-one-dark',
          ],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
});