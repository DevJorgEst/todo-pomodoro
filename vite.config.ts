import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    // CORRECCIÓN CRÍTICA: Forzamos esbuild dentro del bloque build de producción
    cssMinify: 'esbuild',
  },
  test: {
    // Entorno DOM para pruebas de React (Testing Library)
    environment: 'jsdom',
    // Configuración global: matchers de jest-dom
    setupFiles: './src/setupTests.ts',
    // Limpieza automática de componentes entre tests
    globals: true,
    // Solo fuente TS: los .js en src/ son artefactos compilados, no tests reales
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    restoreMocks: true,
  },
})
