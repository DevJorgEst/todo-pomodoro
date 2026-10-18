import { useCallback, useEffect, useRef, useState } from 'react';
import { computeTimeLeft, durationOf, nextPomodoroMode, } from '../utils/pomodoro';
/** Cadencia del tick. La precisión no depende de ella: se calcula contra Date.now(). */
const TICK_MS = 1000;
function createInitialState() {
    return {
        timeLeft: durationOf('WORK'),
        mode: 'WORK',
        isRunning: false,
        sessionsCompleted: 0,
        completedCycles: 0,
        currentTaskId: null,
    };
}
/** Aplica las reglas de negocio al llegar a 0 y detiene el temporizador. */
function completeCycle(state) {
    const sessionsCompleted = state.mode === 'WORK'
        ? state.sessionsCompleted + 1
        : state.sessionsCompleted;
    const mode = nextPomodoroMode(state.mode, sessionsCompleted);
    return {
        ...state,
        mode,
        sessionsCompleted,
        completedCycles: state.completedCycles + 1,
        timeLeft: durationOf(mode),
        isRunning: false,
    };
}
export function usePomodoro() {
    const [state, setState] = useState(createInitialState);
    const anchorRef = useRef(null);
    useEffect(() => {
        if (!state.isRunning)
            return;
        const tick = () => {
            const anchor = anchorRef.current;
            if (anchor === null)
                return;
            // Resiliente al retraso del hilo principal: manda el reloj, no el número de ticks
            const timeLeft = computeTimeLeft(anchor, Date.now());
            if (timeLeft > 0) {
                setState((previous) => previous.isRunning ? { ...previous, timeLeft } : previous);
                return;
            }
            // Fin de ciclo: un solo avance por disparo, sin encadenar ciclos en segundo plano
            anchorRef.current = null;
            setState((previous) => previous.isRunning ? completeCycle(previous) : previous);
        };
        const id = setInterval(tick, TICK_MS);
        // En segundo plano los navegadores reducen el tick de setInterval a ~1/min.
        // Al volver a la pestaña se resincroniza al instante contra el reloj, así
        // que ni el tiempo mostrado ni el fin de ciclo quedan retrasados.
        const resyncOnVisible = () => {
            if (document.visibilityState === 'visible')
                tick();
        };
        document.addEventListener('visibilitychange', resyncOnVisible);
        return () => {
            clearInterval(id);
            document.removeEventListener('visibilitychange', resyncOnVisible);
        };
    }, [state.isRunning]);
    const start = useCallback(() => {
        if (state.isRunning)
            return;
        anchorRef.current = {
            startedAt: Date.now(),
            secondsAtStart: state.timeLeft,
        };
        setState((previous) => previous.isRunning ? previous : { ...previous, isRunning: true });
    }, [state.isRunning, state.timeLeft]);
    const pause = useCallback(() => {
        if (!state.isRunning)
            return;
        const anchor = anchorRef.current;
        const timeLeft = anchor
            ? computeTimeLeft(anchor, Date.now())
            : state.timeLeft;
        anchorRef.current = null;
        setState((previous) => previous.isRunning
            ? { ...previous, isRunning: false, timeLeft }
            : previous);
    }, [state.isRunning, state.timeLeft]);
    const reset = useCallback(() => {
        anchorRef.current = null;
        setState((previous) => ({
            ...previous,
            timeLeft: durationOf(previous.mode),
            isRunning: false,
        }));
    }, []);
    const linkTask = useCallback((taskId) => {
        setState((previous) => ({ ...previous, currentTaskId: taskId }));
    }, []);
    const selectMode = useCallback((nextMode) => {
        anchorRef.current = null;
        setState((previous) => ({
            ...previous,
            mode: nextMode,
            timeLeft: durationOf(nextMode),
            isRunning: false,
        }));
    }, []);
    return { ...state, start, pause, reset, linkTask, selectMode };
}
