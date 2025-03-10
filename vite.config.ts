/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'yas',
      fileName: (format) => `yas.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/__tests__/*',
        '**/tests/*',
        'src/**/*.spec.ts'
      ]
    },
  },
});
