export type PomodoroMode = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'

/** Duración de cada modo en segundos. */
export const POMODORO_DURATIONS: Record<PomodoroMode, number> = {
  WORK: 25 * 60,
  SHORT_BREAK: 5 * 60,
  LONG_BREAK: 15 * 60,
}

/** Número de sesiones de trabajo tras el que se concede un descanso largo. */
export const LONG_BREAK_EVERY = 4

export interface PomodoroState {
  /** Segundos restantes del ciclo actual. */
  timeLeft: number
  mode: PomodoroMode
  isRunning: boolean
  sessionsCompleted: number
  /** Tarea del ToDo enlazada a este temporizador, si la hay. */
  currentTaskId: string | null
}

export function isPomodoroMode(value: unknown): value is PomodoroMode {
  return value === 'WORK' || value === 'SHORT_BREAK' || value === 'LONG_BREAK'
}
