// vite.config.js
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      }
    },
  },
  plugins: [react()],
  build: {
    outDir: 'public',
  },
});
