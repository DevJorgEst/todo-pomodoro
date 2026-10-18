import { useCallback, useEffect, useState } from 'react'
import { isTheme } from '../types/theme'
import type { Theme } from '../types/theme'
import { loadFromStorage, saveToStorage } from '../utils/storage'

const THEME_STORAGE_KEY = 'todo-pomodoro/theme'
const DARK_CLASS = 'dark'
const DARK_QUERY = '(prefers-color-scheme: dark)'

export interface UseThemeResult {
  theme: Theme
  toggleTheme: () => void
}

/**
 * Preferencia del sistema operativo. El guard `typeof window.matchMedia`
 * evita romper en entornos sin esa API (jsdom, SSR, navegadores antiguos).
 */
function getSystemTheme(): Theme {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return 'light'
  }

  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

/**
 * Inicialización segura: la elección explícita del usuario (localStorage)
 * tiene prioridad; si no existe o está corrupta, se cae a la del sistema.
 */
function getInitialTheme(): Theme {
  return loadFromStorage<Theme>(THEME_STORAGE_KEY, getSystemTheme(), isTheme)
}

export function useTheme(): UseThemeResult {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle(DARK_CLASS, theme === 'dark')
    // Alinea scrollbars y controles nativos (inputs, selects) con el tema activo
    root.style.colorScheme = theme
    saveToStorage(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback((): void => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme }
}
