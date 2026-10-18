import { describe, expect, it } from 'vitest';
import { buildDocumentTitle, DEFAULT_TITLE } from '../title';
describe('buildDocumentTitle', () => {
    it('usa el título por defecto cuando el temporizador está pausado o detenido', () => {
        expect(buildDocumentTitle(false, 1485, 'WORK')).toBe(DEFAULT_TITLE);
        expect(buildDocumentTitle(false, 0, 'SHORT_BREAK')).toBe(DEFAULT_TITLE);
    });
    it('muestra el tiempo y el modo mientras corre', () => {
        expect(buildDocumentTitle(true, 1485, 'WORK')).toBe('(24:45) ¡A trabajar! | To-Do + Pomodoro');
        expect(buildDocumentTitle(true, 252, 'SHORT_BREAK')).toBe('(04:12) Descanso | To-Do + Pomodoro');
        expect(buildDocumentTitle(true, 900, 'LONG_BREAK')).toBe('(15:00) Descanso largo | To-Do + Pomodoro');
    });
    it('el título por defecto coincide con el de index.html', () => {
        expect(DEFAULT_TITLE).toBe('To-Do + Pomodoro');
    });
});
