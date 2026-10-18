import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  css: {
    // Forzamos esbuild para evitar que lightningcss descarte las directivas v4
    minify: 'esbuild'
  }
});
