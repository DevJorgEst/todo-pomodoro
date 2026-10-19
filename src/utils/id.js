export function createId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }
  // Fallback para contextos no seguros (http en red local)
  return `todo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
