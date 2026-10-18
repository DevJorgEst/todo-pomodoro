export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

export type TodoFilter = 'all' | 'active' | 'completed'

export const TODO_FILTERS = [
  'all',
  'active',
  'completed',
] as const satisfies readonly TodoFilter[]

export const TODO_FILTER_LABELS: Record<TodoFilter, string> = {
  all: 'Todas',
  active: 'Pendientes',
  completed: 'Completadas',
}

export function isTodoFilter(value: unknown): value is TodoFilter {
  return TODO_FILTERS.includes(value as TodoFilter)
}

export function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false

  const candidate = value as Partial<Todo>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.completed === 'boolean' &&
    typeof candidate.createdAt === 'number'
  )
}
