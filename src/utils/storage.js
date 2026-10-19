export function loadFromStorage(key, fallback, isValid) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed = JSON.parse(raw)
    if (isValid && !isValid(parsed)) return fallback
    return parsed
  } catch {
    // JSON corrupto o storage bloqueado (modo privado): nunca romper la app
    return fallback
  }
}
export function saveToStorage(key, value) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage lleno o bloqueado: la app sigue funcionando en memoria
  }
}
