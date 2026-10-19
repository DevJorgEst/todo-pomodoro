import type { PomodoroMode } from '../../types/pomodoro'
import { formatTime } from '../../utils/pomodoro'

const MODE_ORDER: readonly PomodoroMode[] = [
  'WORK',
  'SHORT_BREAK',
  'LONG_BREAK',
]

interface ModeStyle {
  label: string
  /** Badge del estado actual: color cálido para WORK, frío para los descansos */
  badge: string
  dot: string
  /** Panel del temporizador: el borde cambia con el modo */
  panel: string
}

const MODE_STYLES: Record<PomodoroMode, ModeStyle> = {
  WORK: {
    label: 'Trabajo',
    badge:
      'bg-red-100 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900/50',
    dot: 'bg-red-500 dark:bg-red-400',
    panel:
      'border-red-300 bg-red-50/50 dark:border-red-900/60 dark:bg-red-950/20',
  },
  SHORT_BREAK: {
    label: 'Descanso corto',
    badge:
      'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/50',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
    panel:
      'border-emerald-300 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20',
  },
  LONG_BREAK: {
    label: 'Descanso largo',
    badge:
      'bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/50',
    dot: 'bg-sky-500 dark:bg-sky-400',
    panel:
      'border-sky-300 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20',
  },
}

const CONTROL_BUTTON =
  'rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-40 dark:focus:ring-zinc-500'

const PRIMARY_BUTTON = `${CONTROL_BUTTON} bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white`

const SECONDARY_BUTTON = `${CONTROL_BUTTON} border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700`

const MODE_BUTTON =
  'rounded-full border px-3 py-1 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500'

export interface PomodoroTimerProps {
  /** Segundos restantes del ciclo actual. */
  timeLeft: number
  mode: PomodoroMode
  isRunning: boolean
  sessionsCompleted: number
  /** Título de la tarea enlazada, o null si no hay ninguna. */
  currentTaskTitle: string | null
  onSelectMode: (mode: PomodoroMode) => void
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export function PomodoroTimer({
  timeLeft,
  mode,
  isRunning,
  sessionsCompleted,
  currentTaskTitle,
  onSelectMode,
  onStart,
  onPause,
  onReset,
}: PomodoroTimerProps) {
  const style = MODE_STYLES[mode]

  return (
    <section
      aria-label="Temporizador Pomodoro"
      className={`rounded-2xl border-2 p-6 shadow-sm transition-colors duration-300 ${style.panel}`}
    >
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-600 uppercase dark:text-zinc-400">
          Pomodoro
        </h2>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ${style.badge}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${style.dot}`}
            aria-hidden="true"
          />
          {style.label}
        </span>
      </header>

      <p
        role="timer"
        aria-atomic="true"
        className="mt-5 text-center text-6xl font-bold text-zinc-900 tabular-nums dark:text-zinc-100"
      >
        {formatTime(timeLeft)}
      </p>

      <p className="mt-2 text-center text-sm" aria-live="polite">
        {currentTaskTitle === null ? (
          <span className="text-zinc-500 dark:text-zinc-400">
            Elige una tarea para empezar a cronometrar
          </span>
        ) : (
          <span className="text-zinc-600 dark:text-zinc-400">
            Enfocado en:{' '}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {currentTaskTitle}
            </span>
          </span>
        )}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={onStart}
          disabled={isRunning}
          aria-label="Iniciar el temporizador"
          className={PRIMARY_BUTTON}
        >
          ▶ Iniciar
        </button>
        <button
          type="button"
          onClick={onPause}
          disabled={!isRunning}
          aria-label="Pausar el temporizador"
          className={SECONDARY_BUTTON}
        >
          ⏸ Pausar
        </button>
        <button
          type="button"
          onClick={onReset}
          aria-label="Reiniciar el temporizador"
          className={SECONDARY_BUTTON}
        >
          ↺ Reiniciar
        </button>
      </div>

      <div className="mt-5">
        <p
          id="pomodoro-mode-label"
          className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
        >
          Cambiar de modo
        </p>
        <div
          role="group"
          aria-labelledby="pomodoro-mode-label"
          className="mt-2 flex flex-wrap gap-2"
        >
          {MODE_ORDER.map((option) => {
            const isActive = option === mode

            return (
              <button
                key={option}
                type="button"
                onClick={() => onSelectMode(option)}
                aria-pressed={isActive}
                className={`${MODE_BUTTON} ${
                  isActive
                    ? 'border-transparent bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                {MODE_STYLES[option].label}
              </button>
            )
          })}
        </div>
      </div>

      <footer className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200/70 pt-3 text-xs text-zinc-500 dark:border-zinc-700/60 dark:text-zinc-400">
        <span>
          Sesiones completadas: <strong>{sessionsCompleted}</strong>
        </span>
        <span>Cada 4 sesiones toca descanso largo</span>
      </footer>
    </section>
  )
}
