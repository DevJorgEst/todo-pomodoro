import { jsx as _jsx } from "react/jsx-runtime";
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../App';
import { markUserInteraction, playChime } from '../../utils/feedback';
// El feedback auditivo se testea en profundidad en utils/__tests__/feedback.test.ts;
// aquí solo interesa que se dispara en el momento exacto del fin de ciclo.
vi.mock('../../utils/feedback', () => ({
    markUserInteraction: vi.fn(),
    playChime: vi.fn(),
}));
const NEUTRAL_TASK_MESSAGE = 'Elige una tarea para empezar a cronometrar';
/** Mismos fakes que usa el hook: Date debe viajar con los timers. */
const TIMER_FAKES = [
    'Date',
    'setInterval',
    'clearInterval',
    'setTimeout',
    'clearTimeout',
];
beforeEach(() => {
    // useTodos persiste en localStorage: aísla cada test
    window.localStorage.clear();
    vi.clearAllMocks();
});
afterEach(() => {
    vi.useRealTimers();
});
async function addTask(user, title) {
    await user.type(screen.getByRole('textbox', { name: 'Nueva tarea' }), title);
    await user.click(screen.getByRole('button', { name: 'Añadir' }));
}
function getTimerRegion() {
    return screen.getByRole('region', { name: 'Temporizador Pomodoro' });
}
/**
 * El botón de enlace usa `aria-label` propio (anula el texto visible), así que
 * el nombre accesible es el mismo en estado inactivo y activo.
 */
function getTaskAction(title) {
    return screen.getByRole('button', {
        name: `Establecer "${title}" como tarea activa del Pomodoro`,
    });
}
describe('integración App: ToDo + Pomodoro', () => {
    it('crea una tarea, la enlaza y el temporizador pasa a "Enfocado en: …"', async () => {
        const user = userEvent.setup();
        render(_jsx(App, {}));
        // Estado inicial: contador de trabajo y mensaje neutral
        expect(screen.getByRole('timer')).toHaveTextContent('25:00');
        expect(screen.getByText(NEUTRAL_TASK_MESSAGE)).toBeInTheDocument();
        // 1. Crear la tarea escribiendo y pulsando "Añadir"
        await addTask(user, 'Preparar la demo');
        expect(screen.getByRole('checkbox', {
            name: 'Marcar "Preparar la demo" como completada',
        })).toBeInTheDocument();
        // Todavía sin enlazar: el mensaje neutral persiste
        expect(screen.getByText(NEUTRAL_TASK_MESSAGE)).toBeInTheDocument();
        // 2. Enlazarla con el Pomodoro
        await user.click(getTaskAction('Preparar la demo'));
        // 3. El temporizador refleja el enlace de inmediato
        const timer = getTimerRegion();
        expect(within(timer).getByText(/^Enfocado en:/)).toBeInTheDocument();
        expect(within(timer).getByText('Preparar la demo')).toBeInTheDocument();
        expect(screen.queryByText(NEUTRAL_TASK_MESSAGE)).not.toBeInTheDocument();
        // Y el botón de la tarea queda como activo (aria-pressed)
        expect(getTaskAction('Preparar la demo')).toHaveAttribute('aria-pressed', 'true');
    });
    it('volver a pulsar el botón de la tarea activa desenlaza el Pomodoro', async () => {
        const user = userEvent.setup();
        render(_jsx(App, {}));
        await addTask(user, 'Llamar al dentista');
        await user.click(getTaskAction('Llamar al dentista'));
        expect(within(getTimerRegion()).getByText('Llamar al dentista')).toBeInTheDocument();
        await user.click(getTaskAction('Llamar al dentista'));
        expect(screen.getByText(NEUTRAL_TASK_MESSAGE)).toBeInTheDocument();
        expect(getTaskAction('Llamar al dentista')).toHaveAttribute('aria-pressed', 'false');
    });
    it('completar la tarea enlazada no rompe el enlace con el temporizador', async () => {
        const user = userEvent.setup();
        render(_jsx(App, {}));
        await addTask(user, 'Enviar el informe');
        await user.click(getTaskAction('Enviar el informe'));
        // Marcar como completada desde la lista
        await user.click(screen.getByRole('checkbox', {
            name: 'Marcar "Enviar el informe" como completada',
        }));
        // El checkbox refleja el estado…
        expect(screen.getByRole('checkbox', {
            name: 'Marcar "Enviar el informe" como pendiente',
        })).toBeChecked();
        // …el título se tacha en la lista…
        const list = screen.getByRole('list');
        expect(within(list).getByText('Enviar el informe')).toHaveClass('line-through');
        // …las estadísticas se actualizan…
        expect(screen.getByText('¡Todo completado! 🎉')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Limpiar completadas/ })).toBeInTheDocument();
        // …y el Pomodoro sigue enfocado en la misma tarea
        expect(within(getTimerRegion()).getByText('Enviar el informe')).toBeInTheDocument();
    });
    it('eliminar la tarea enlazada limpia el enlace del temporizador', async () => {
        const user = userEvent.setup();
        render(_jsx(App, {}));
        await addTask(user, 'Tarea efímera');
        await user.click(getTaskAction('Tarea efímera'));
        await user.click(screen.getByRole('button', { name: 'Eliminar tarea "Tarea efímera"' }));
        // Sin rastro de la tarea ni en la lista ni en el temporizador
        expect(screen.queryByText('Tarea efímera')).not.toBeInTheDocument();
        expect(screen.getByText(NEUTRAL_TASK_MESSAGE)).toBeInTheDocument();
        expect(screen.getByText(/No hay tareas todas/)).toBeInTheDocument();
    });
    it('el selector de modo manual cambia el temporizador y su aspecto', async () => {
        const user = userEvent.setup();
        render(_jsx(App, {}));
        // Aspecto cálido (WORK) por defecto
        expect(getTimerRegion()).toHaveClass('border-red-300');
        await user.click(screen.getByRole('button', { name: 'Descanso corto' }));
        expect(screen.getByRole('timer')).toHaveTextContent('05:00');
        expect(getTimerRegion()).toHaveClass('border-emerald-300');
        expect(screen.getByRole('button', { name: 'Descanso corto' })).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', { name: 'Trabajo' })).toHaveAttribute('aria-pressed', 'false');
    });
});
describe('integración App: feedback en segundo plano', () => {
    // Con reloj falso se usa fireEvent (síncrono): user-event espera timers
    // reales. La interacción realista con user-event ya cubren los tests anteriores.
    it('el título de la pestaña sigue al temporizador mientras corre', () => {
        vi.useFakeTimers({ toFake: [...TIMER_FAKES] });
        render(_jsx(App, {}));
        // Al montar: marca por defecto
        expect(document.title).toBe('To-Do + Pomodoro');
        // Al iniciar: tiempo y modo
        fireEvent.click(screen.getByRole('button', { name: 'Iniciar el temporizador' }));
        expect(document.title).toBe('(25:00) ¡A trabajar! | To-Do + Pomodoro');
        // El título descuenta con el reloj
        act(() => {
            vi.advanceTimersByTime(15_000);
        });
        expect(document.title).toBe('(24:45) ¡A trabajar! | To-Do + Pomodoro');
        // Al pausar vuelve a la marca por defecto
        fireEvent.click(screen.getByRole('button', { name: 'Pausar el temporizador' }));
        expect(document.title).toBe('To-Do + Pomodoro');
    });
    it('suena la campanilla exactamente al completarse el ciclo', () => {
        vi.useFakeTimers({ toFake: [...TIMER_FAKES] });
        render(_jsx(App, {}));
        fireEvent.click(screen.getByRole('button', { name: 'Iniciar el temporizador' }));
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(playChime).not.toHaveBeenCalled();
        // Completar el ciclo WORK (25 min en total)
        act(() => {
            vi.advanceTimersByTime((25 * 60 - 1) * 1000);
        });
        // Una sola campanilla, en el instante exacto del 00:00
        expect(playChime).toHaveBeenCalledTimes(1);
        // Y la app queda en descanso corto, detenida, con el título por defecto
        expect(screen.getByRole('timer')).toHaveTextContent('05:00');
        expect(document.title).toBe('To-Do + Pomodoro');
    });
    it('el primer gesto del usuario desbloquea el audio (política de autoplay)', async () => {
        const user = userEvent.setup();
        render(_jsx(App, {}));
        expect(markUserInteraction).not.toHaveBeenCalled();
        // Cualquier interacción sirve como gesto de desbloqueo
        await user.click(screen.getByRole('button', { name: 'Descanso corto' }));
        expect(markUserInteraction).toHaveBeenCalled();
    });
});
