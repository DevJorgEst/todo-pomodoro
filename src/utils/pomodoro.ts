import { LONG_BREAK_EVERY, POMODORO_DURATIONS } from '../types/pomodoro'
import type { PomodoroMode } from '../types/pomodoro'

/**
 * Regla de negocio: modo siguiente a un ciclo recién terminado.
 *
 * - Fin de WORK  -> sesiones completadas ya incrementadas:
 *                   divisible por LONG_BREAK_EVERY => LONG_BREAK, resto => SHORT_BREAK.
 * - Fin de cualquier descanso => WORK.
 */
export function nextPomodoroMode(
  mode: PomodoroMode,
  sessionsCompleted: number,
): PomodoroMode {
  if (mode !== 'WORK') return 'WORK'

  return sessionsCompleted % LONG_BREAK_EVERY === 0
    ? 'LONG_BREAK'
    : 'SHORT_BREAK'
}

/**
 * Tiempo restante calculado contra el reloj real (Date.now) y no contra el
 * número de ticks: si el navegador pausa o retrasa el hilo principal, el
 * temporizador no se desincroniza.
 */
export function computeTimeLeft(
  anchor: { startedAt: number; secondsAtStart: number },
  now: number,
): number {
  const elapsedSeconds = Math.floor((now - anchor.startedAt) / 1000)
  const remaining = anchor.secondsAtStart - elapsedSeconds

  return Math.max(0, remaining)
}

export function durationOf(mode: PomodoroMode): number {
  return POMODORO_DURATIONS[mode]
}

/** Formatea segundos como contador digital MM:SS (ej. 1500 -> "25:00"). */
export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
