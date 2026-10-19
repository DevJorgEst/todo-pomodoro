import type { TodoCounts } from '../../hooks/useTodos'

interface TodoStatsProps {
  counts: TodoCounts
  onClearCompleted: () => void
}

export function TodoStats({ counts, onClearCompleted }: TodoStatsProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p
        className="text-xs text-zinc-500 dark:text-zinc-400"
        aria-live="polite"
      >
        {counts.active === 0
          ? '¡Todo completado! 🎉'
          : `${counts.active} de ${counts.total} ${
              counts.active === 1 ? 'tarea pendiente' : 'tareas pendientes'
            }`}
      </p>

      <button
        type="button"
        onClick={onClearCompleted}
        disabled={counts.completed === 0}
        className="text-xs text-zinc-500 underline-offset-2 transition hover:text-zinc-900 hover:underline focus:ring-2 focus:ring-zinc-400 focus:outline-none disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40 dark:text-zinc-400 dark:hover:text-zinc-100 dark:focus:ring-zinc-500"
      >
        Limpiar completadas ({counts.completed})
      </button>
    </div>
  )
}
