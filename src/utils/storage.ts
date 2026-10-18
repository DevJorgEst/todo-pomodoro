type Validator<T> = (value: unknown) => value is T

export function loadFromStorage<T>(
  key: string,
  fallback: T,
  isValid?: Validator<T>,
): T {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback

    const parsed: unknown = JSON.parse(raw)
    if (isValid && !isValid(parsed)) return fallback

    return parsed as T
  } catch {
    // JSON corrupto o storage bloqueado (modo privado): nunca romper la app
    return fallback
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage lleno o bloqueado: la app sigue funcionando en memoria
  }
}
