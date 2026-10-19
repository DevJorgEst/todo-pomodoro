import { useEffect, useRef, useState } from 'react'

import { POMODORO_MODE_LABELS } from '../../types/pomodoro'
import type { PomodoroMode } from '../../types/pomodoro'
import { durationOf, formatTime } from '../../utils/pomodoro'
import { PauseIcon, PlayIcon, ResetIcon } from '../ui/icons'

const MODE_ORDER: readonly PomodoroMode[] = [
  'WORK',
  'SHORT_BREAK',
  'LONG_BREAK',
]

interface ModeStyle {
  /** Badge del estado actual: color cálido para WORK, frío para los descansos */
  badge: string
  dot: string
  /** Panel del temporizador: el borde cambia con el modo */
  panel: string
}

const MODE_STYLES: Record<PomodoroMode, ModeStyle> = {
  WORK: {
    badge:
      'bg-red-100 text-red-800 ring-red-300 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900/50',
    dot: 'bg-red-600 dark:bg-red-400',
    panel:
      'border-red-300 bg-red-50/50 dark:border-red-900/60 dark:bg-red-950/20',
  },
  SHORT_BREAK: {
    badge:
      'bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/50',
    dot: 'bg-emerald-600 dark:bg-emerald-400',
    panel:
      'border-emerald-300 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20',
  },
  LONG_BREAK: {
    badge:
      'bg-sky-100 text-sky-800 ring-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/50',
    dot: 'bg-sky-600 dark:bg-sky-400',
    panel:
      'border-sky-300 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20',
  },
}

const CONTROL_BUTTON =
  'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-zinc-400'

const PRIMARY_BUTTON = `${CONTROL_BUTTON} bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white`

const SECONDARY_BUTTON = `${CONTROL_BUTTON} border border-zinc-400 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700`

const MODE_BUTTON =
  'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400'

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

  // El cambio de modo (fin de ciclo o elección manual) se anuncia a lectores
  // de pantalla: sin esto, el final del Pomodoro solo lo delata la campanilla.
  const previousModeRef = useRef(mode)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (previousModeRef.current === mode) return
    previousModeRef.current = mode

    const minutes = Math.round(durationOf(mode) / 60)
    setAnnouncement(
      `${isRunning ? '' : 'Temporizador detenido. '}Modo ${
        POMODORO_MODE_LABELS[mode]
      }, ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}.`,
    )
  }, [mode, isRunning])

  return (
    <section
      aria-label="Temporizador Pomodoro"
      className={`rounded-2xl border-2 p-5 shadow-sm transition-colors duration-300 sm:p-6 ${style.panel}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-700 uppercase dark:text-zinc-300">
          Pomodoro
        </h2>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ${style.badge}`}
        >
          <span
            className={`size-2 rounded-full ${style.dot}`}
            aria-hidden="true"
          />
          {POMODORO_MODE_LABELS[mode]}
        </span>
      </header>

      <p
        role="timer"
        aria-atomic="true"
        className="mt-5 text-center text-5xl font-bold text-zinc-900 tabular-nums sm:text-6xl dark:text-zinc-100"
      >
        {formatTime(timeLeft)}
      </p>

      <p className="mt-2 text-center text-sm">
        {currentTaskTitle === null ? (
          <span className="text-zinc-600 dark:text-zinc-300">
            Elige una tarea para empezar a cronometrar
          </span>
        ) : (
          <span className="text-zinc-600 dark:text-zinc-300">
            Enfocado en:{' '}
            <span className="font-semibold break-words text-zinc-900 dark:text-zinc-100">
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
          <PlayIcon className="size-4" />
          Iniciar
        </button>
        <button
          type="button"
          onClick={onPause}
          disabled={!isRunning}
          aria-label="Pausar el temporizador"
          className={SECONDARY_BUTTON}
        >
          <PauseIcon className="size-4" />
          Pausar
        </button>
        <button
          type="button"
          onClick={onReset}
          aria-label="Reiniciar el temporizador"
          className={SECONDARY_BUTTON}
        >
          <ResetIcon className="size-4" />
          Reiniciar
        </button>
      </div>

      <div className="mt-5">
        <p
          id="pomodoro-mode-label"
          className="text-xs font-medium text-zinc-600 dark:text-zinc-300"
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
                    : 'border-zinc-400 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {POMODORO_MODE_LABELS[option]}
              </button>
            )
          })}
        </div>
      </div>

      <footer className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-300/70 pt-3 text-xs text-zinc-600 dark:border-zinc-600/60 dark:text-zinc-300">
        <span>
          Sesiones completadas: <strong>{sessionsCompleted}</strong>
        </span>
        <span>Cada 4 sesiones toca descanso largo</span>
      </footer>

      <p className="sr-only" role="status">
        {announcement}
      </p>
    </section>
  )
}
