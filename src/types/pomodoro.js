/** Duración de cada modo en segundos. */
export const POMODORO_DURATIONS = {
    WORK: 25 * 60,
    SHORT_BREAK: 5 * 60,
    LONG_BREAK: 15 * 60,
};
/** Número de sesiones de trabajo tras el que se concede un descanso largo. */
export const LONG_BREAK_EVERY = 4;
export function isPomodoroMode(value) {
    return value === 'WORK' || value === 'SHORT_BREAK' || value === 'LONG_BREAK';
}
