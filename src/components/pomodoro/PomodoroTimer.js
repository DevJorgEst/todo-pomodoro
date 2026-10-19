import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { formatTime } from '../../utils/pomodoro'
const MODE_ORDER = ['WORK', 'SHORT_BREAK', 'LONG_BREAK']
const MODE_STYLES = {
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
}) {
  const style = MODE_STYLES[mode]
  return _jsxs('section', {
    'aria-label': 'Temporizador Pomodoro',
    className: `rounded-2xl border-2 p-6 shadow-sm transition-colors duration-300 ${style.panel}`,
    children: [
      _jsxs('header', {
        className: 'flex items-center justify-between gap-3',
        children: [
          _jsx('h2', {
            className:
              'text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400',
            children: 'Pomodoro',
          }),
          _jsxs('span', {
            className: `inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ${style.badge}`,
            children: [
              _jsx('span', {
                className: `h-2 w-2 rounded-full ${style.dot}`,
                'aria-hidden': 'true',
              }),
              style.label,
            ],
          }),
        ],
      }),
      _jsx('p', {
        role: 'timer',
        'aria-atomic': 'true',
        className:
          'mt-5 text-center text-6xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100',
        children: formatTime(timeLeft),
      }),
      _jsx('p', {
        className: 'mt-2 text-center text-sm',
        'aria-live': 'polite',
        children:
          currentTaskTitle === null
            ? _jsx('span', {
                className: 'text-zinc-500 dark:text-zinc-400',
                children: 'Elige una tarea para empezar a cronometrar',
              })
            : _jsxs('span', {
                className: 'text-zinc-600 dark:text-zinc-400',
                children: [
                  'Enfocado en:',
                  ' ',
                  _jsx('span', {
                    className: 'font-semibold text-zinc-900 dark:text-zinc-100',
                    children: currentTaskTitle,
                  }),
                ],
              }),
      }),
      _jsxs('div', {
        className: 'mt-5 flex flex-wrap items-center justify-center gap-2',
        children: [
          _jsx('button', {
            type: 'button',
            onClick: onStart,
            disabled: isRunning,
            'aria-label': 'Iniciar el temporizador',
            className: PRIMARY_BUTTON,
            children: '\u25B6 Iniciar',
          }),
          _jsx('button', {
            type: 'button',
            onClick: onPause,
            disabled: !isRunning,
            'aria-label': 'Pausar el temporizador',
            className: SECONDARY_BUTTON,
            children: '\u23F8 Pausar',
          }),
          _jsx('button', {
            type: 'button',
            onClick: onReset,
            'aria-label': 'Reiniciar el temporizador',
            className: SECONDARY_BUTTON,
            children: '\u21BA Reiniciar',
          }),
        ],
      }),
      _jsxs('div', {
        className: 'mt-5',
        children: [
          _jsx('p', {
            id: 'pomodoro-mode-label',
            className: 'text-xs font-medium text-zinc-500 dark:text-zinc-400',
            children: 'Cambiar de modo',
          }),
          _jsx('div', {
            role: 'group',
            'aria-labelledby': 'pomodoro-mode-label',
            className: 'mt-2 flex flex-wrap gap-2',
            children: MODE_ORDER.map((option) => {
              const isActive = option === mode
              return _jsx(
                'button',
                {
                  type: 'button',
                  onClick: () => onSelectMode(option),
                  'aria-pressed': isActive,
                  className: `${MODE_BUTTON} ${
                    isActive
                      ? 'border-transparent bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`,
                  children: MODE_STYLES[option].label,
                },
                option,
              )
            }),
          }),
        ],
      }),
      _jsxs('footer', {
        className:
          'mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200/70 pt-3 text-xs text-zinc-500 dark:border-zinc-700/60 dark:text-zinc-400',
        children: [
          _jsxs('span', {
            children: [
              'Sesiones completadas: ',
              _jsx('strong', { children: sessionsCompleted }),
            ],
          }),
          _jsx('span', { children: 'Cada 4 sesiones toca descanso largo' }),
        ],
      }),
    ],
  })
}
