import { useCallback, useEffect, useState } from 'react';
import { isTheme } from '../types/theme';
import { loadFromStorage, saveToStorage } from '../utils/storage';
const THEME_STORAGE_KEY = 'todo-pomodoro/theme';
const DARK_CLASS = 'dark';
const DARK_QUERY = '(prefers-color-scheme: dark)';
/**
 * Preferencia del sistema operativo. El guard `typeof window.matchMedia`
 * evita romper en entornos sin esa API (jsdom, SSR, navegadores antiguos).
 */
function getSystemTheme() {
    if (typeof window === 'undefined' ||
        typeof window.matchMedia !== 'function') {
        return 'light';
    }
    return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}
/**
 * Inicialización segura: la elección explícita del usuario (localStorage)
 * tiene prioridad; si no existe o está corrupta, se cae a la del sistema.
 */
function getInitialTheme() {
    return loadFromStorage(THEME_STORAGE_KEY, getSystemTheme(), isTheme);
}
export function useTheme() {
    const [theme, setTheme] = useState(getInitialTheme);
    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle(DARK_CLASS, theme === 'dark');
        // Alinea scrollbars y controles nativos (inputs, selects) con el tema activo
        root.style.colorScheme = theme;
        saveToStorage(THEME_STORAGE_KEY, theme);
    }, [theme]);
    const toggleTheme = useCallback(() => {
        setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
    }, []);
    return { theme, toggleTheme };
}
