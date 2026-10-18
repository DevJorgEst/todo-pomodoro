import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeToggle } from '../theme/ThemeToggle';
const THEME_STORAGE_KEY = 'todo-pomodoro/theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';
// Guarda matchMedia nativo para restaurarlo después
const originalMatchMedia = window.matchMedia;
/** Mockea matchMedia para controlar prefers-color-scheme. */
function mockMatchMedia(prefersDark) {
    window.matchMedia = (query) => ({
        matches: query === DARK_QUERY ? prefersDark : false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => false,
    });
}
beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.style.colorScheme = '';
    if (originalMatchMedia) {
        window.matchMedia = originalMatchMedia;
    }
    else {
        Reflect.deleteProperty(window, 'matchMedia');
    }
});
describe('ThemeToggle', () => {
    it('muestra el botón con aria-label que cambia según el tema', () => {
        mockMatchMedia(false); // tema claro por sistema
        render(_jsx(ThemeToggle, {}));
        const button = screen.getByRole('button');
        // En tema claro por defecto, el siguiente estado es oscuro
        expect(button).toHaveAttribute('aria-label', 'Cambiar a modo oscuro');
        expect(button).toHaveAttribute('aria-pressed', 'false');
    });
    it('al hacer clic alterna el tema y actualiza aria-label/aria-pressed', async () => {
        const user = userEvent.setup();
        mockMatchMedia(false);
        render(_jsx(ThemeToggle, {}));
        const button = screen.getByRole('button');
        expect(document.documentElement).not.toHaveClass('dark');
        expect(button).toHaveAttribute('aria-label', 'Cambiar a modo oscuro');
        expect(button).toHaveAttribute('aria-pressed', 'false');
        await user.click(button);
        expect(document.documentElement).toHaveClass('dark');
        expect(button).toHaveAttribute('aria-label', 'Cambiar a modo claro');
        expect(button).toHaveAttribute('aria-pressed', 'true');
        expect(JSON.parse(window.localStorage.getItem(THEME_STORAGE_KEY) || 'null')).toBe('dark');
        await user.click(button);
        expect(document.documentElement).not.toHaveClass('dark');
        expect(button).toHaveAttribute('aria-label', 'Cambiar a modo oscuro');
        expect(button).toHaveAttribute('aria-pressed', 'false');
        expect(JSON.parse(window.localStorage.getItem(THEME_STORAGE_KEY) || 'null')).toBe('light');
    });
    it('respeta el tema inicial guardado en localStorage', () => {
        window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify('dark'));
        mockMatchMedia(false);
        render(_jsx(ThemeToggle, {}));
        const button = screen.getByRole('button');
        expect(document.documentElement).toHaveClass('dark');
        expect(button).toHaveAttribute('aria-label', 'Cambiar a modo claro');
        expect(button).toHaveAttribute('aria-pressed', 'true');
    });
});
