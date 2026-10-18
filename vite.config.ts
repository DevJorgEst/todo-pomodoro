import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    // CORRECCIÓN CRÍTICA: Forzamos esbuild dentro del bloque build de producción
    cssMinify: 'esbuild'
  }
});
