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
            className={`rounded-full px-3 py-1 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-400 ${
              isActive
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {TODO_FILTER_LABELS[option]}{' '}
            <span className={isActive ? 'text-slate-300' : 'text-slate-400'}>
              ({counts[FILTER_COUNTS[option]]})
            </span>
          </button>
        )
      })}
    </div>
  )
}
