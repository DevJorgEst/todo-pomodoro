import { useEffect, useRef } from 'react'

import type { TodoCounts } from '../../hooks/useTodos'

interface TodoStatsProps {
  counts: TodoCounts
  onClearCompleted: () => void
}

export function TodoStats({ counts, onClearCompleted }: TodoStatsProps) {
  // Sin tareas no hay nada que resumir: el estado vacío de la lista ya guía.
  // Al completar todo sí conviene celebrarlo, y sin tareas no se felicita.
  const summary =
    counts.total === 0
      ? null
      : counts.active === 0
        ? 'Todo completado. Buen trabajo.'
        : `${counts.active} de ${counts.total} ${
            counts.active === 1 ? 'tarea pendiente' : 'tareas pendientes'
          }`

  // Al limpiar, el botón queda deshabilitado y el navegador manda el foco a
  // <body>. Si lo tenía, lo devolvemos al campo de nueva tarea.
  const clearButtonRef = useRef<HTMLButtonElement>(null)
  const restoreFocusRef = useRef(false)

  useEffect(() => {
    if (!restoreFocusRef.current) return
    restoreFocusRef.current = false
    document.getElementById('new-todo')?.focus()
  }, [counts.completed])

  function handleClearCompleted(): void {
    restoreFocusRef.current = document.activeElement === clearButtonRef.current
    onClearCompleted()
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p
        className="text-xs text-zinc-600 dark:text-zinc-300"
        aria-live="polite"
      >
        {summary}
      </p>

      <button
        ref={clearButtonRef}
        type="button"
        onClick={handleClearCompleted}
        disabled={counts.completed === 0}
        className="-my-1 rounded px-1 py-1.5 text-xs text-zinc-600 underline-offset-2 transition-colors hover:text-zinc-900 hover:underline focus:ring-2 focus:ring-zinc-500 focus:outline-none disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50 dark:text-zinc-300 dark:hover:text-zinc-100 dark:focus:ring-zinc-400"
      >
        Limpiar completadas ({counts.completed})
      </button>
    </div>
  )
}
