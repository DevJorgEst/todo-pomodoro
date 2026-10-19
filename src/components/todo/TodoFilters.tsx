import { TODO_FILTER_LABELS, TODO_FILTERS } from '../../types/todo'
import type { TodoCounts } from '../../hooks/useTodos'
import type { TodoFilter } from '../../types/todo'

interface TodoFiltersProps {
  filter: TodoFilter
  counts: TodoCounts
  onChange: (filter: TodoFilter) => void
}

const FILTER_COUNTS: Record<TodoFilter, keyof TodoCounts> = {
  all: 'total',
  active: 'active',
  completed: 'completed',
}

export function TodoFilters({ filter, counts, onChange }: TodoFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filtrar tareas"
      className="flex flex-wrap gap-2"
    >
      {TODO_FILTERS.map((option) => {
        const isActive = option === filter

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={isActive}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus:ring-2 focus:ring-zinc-500 focus:outline-none dark:focus:ring-zinc-400 ${
              isActive
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            {TODO_FILTER_LABELS[option]}{' '}
            <span
              className={
                isActive
                  ? 'text-zinc-300 dark:text-zinc-600'
                  : 'text-zinc-600 dark:text-zinc-400'
              }
            >
              ({counts[FILTER_COUNTS[option]]})
            </span>
          </button>
        )
      })}
    </div>
  )
}
