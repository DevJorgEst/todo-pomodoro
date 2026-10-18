import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    cssMinify: 'esbuild',
  },
  test: {
    // Entorno DOM para pruebas de React (Testing Library)
    environment: 'jsdom',
    // Configuración global: matchers de jest-dom
    setupFiles: './src/setupTests.ts',
    // Limpieza automática de componentes entre tests
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    restoreMocks: true,
  },
})
