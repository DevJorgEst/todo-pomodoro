export const TODO_FILTERS = ['all', 'active', 'completed']
export const TODO_FILTER_LABELS = {
  all: 'Todas',
  active: 'Pendientes',
  completed: 'Completadas',
}
export function isTodoFilter(value) {
  return TODO_FILTERS.includes(value)
}
export function isTodo(value) {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.completed === 'boolean' &&
    typeof candidate.createdAt === 'number'
  )
}
