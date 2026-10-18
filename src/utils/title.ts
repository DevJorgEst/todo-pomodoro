import type { PomodoroMode } from '../types/pomodoro'
import { formatTime } from './pomodoro'

/** Título por defecto de la pestaña (el mismo que define index.html). */
export const DEFAULT_TITLE = 'To-Do + Pomodoro'

/** Texto de modo para el título: corto y orientado a la acción. */
const RUNNING_TITLES: Record<PomodoroMode, string> = {
  WORK: '¡A trabajar!',
  SHORT_BREAK: 'Descanso',
  LONG_BREAK: 'Descanso largo',
}

/**
 * Título dinámico de la pestaña: mientras el temporizador corre muestra tiempo
 * y modo —p. ej. "(24:45) ¡A trabajar!"—; si está pausado o detenido vuelve a
 * la marca por defecto.
 */
export function buildDocumentTitle(
  isRunning: boolean,
  timeLeft: number,
  mode: PomodoroMode,
): string {
  if (!isRunning) return DEFAULT_TITLE

  return `(${formatTime(timeLeft)}) ${RUNNING_TITLES[mode]} | ${DEFAULT_TITLE}`
}
