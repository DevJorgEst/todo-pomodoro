import type { TodoCounts } from '../../hooks/useTodos'

interface TodoStatsProps {
  counts: TodoCounts
  onClearCompleted: () => void
}

export function TodoStats({ counts, onClearCompleted }: TodoStatsProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs text-slate-500" aria-live="polite">
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
        className="text-xs text-slate-500 underline-offset-2 transition hover:text-slate-900 hover:underline focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40"
      >
        Limpiar completadas ({counts.completed})
      </button>
    </div>
  )
}
