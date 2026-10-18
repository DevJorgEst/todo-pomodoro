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
    badge: 'bg-red-100 text-red-700 ring-red-200',
    dot: 'bg-red-500',
    panel: 'border-red-300 bg-red-50/50',
  },
  SHORT_BREAK: {
    label: 'Descanso corto',
    badge: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500',
    panel: 'border-emerald-300 bg-emerald-50/50',
  },
  LONG_BREAK: {
    label: 'Descanso largo',
    badge: 'bg-sky-100 text-sky-700 ring-sky-200',
    dot: 'bg-sky-500',
    panel: 'border-sky-300 bg-sky-50/50',
  },
}

const CONTROL_BUTTON =
  'rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-40'

const PRIMARY_BUTTON = `${CONTROL_BUTTON} bg-slate-900 text-white hover:bg-slate-700`

const SECONDARY_BUTTON = `${CONTROL_BUTTON} border border-slate-300 bg-white text-slate-700 hover:bg-slate-100`

const MODE_BUTTON =
  'rounded-full border px-3 py-1 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-400'

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
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
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
        className="mt-5 text-center text-6xl font-bold tabular-nums text-slate-900"
      >
        {formatTime(timeLeft)}
      </p>

      <p className="mt-2 text-center text-sm" aria-live="polite">
        {currentTaskTitle === null ? (
          <span className="text-slate-500">
            Elige una tarea para empezar a cronometrar
          </span>
        ) : (
          <span className="text-slate-600">
            Enfocado en:{' '}
            <span className="font-semibold text-slate-900">
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
          className="text-xs font-medium text-slate-500"
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
                    ? 'border-transparent bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {MODE_STYLES[option].label}
              </button>
            )
          })}
        </div>
      </div>

      <footer className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/70 pt-3 text-xs text-slate-500">
        <span>
          Sesiones completadas: <strong>{sessionsCompleted}</strong>
        </span>
        <span>Cada 4 sesiones toca descanso largo</span>
      </footer>
    </section>
  )
}
