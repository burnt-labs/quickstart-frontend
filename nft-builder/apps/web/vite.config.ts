import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
      process: 'process/browser',
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    include: ['buffer', 'process', '@burnt-labs/abstraxion'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
});