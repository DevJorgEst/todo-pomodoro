import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useTheme } from '../useTheme'

const THEME_STORAGE_KEY = 'todo-pomodoro/theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

// matchMedia nativo (jsdom no lo implementa; se guarda para restaurarlo)
const originalMatchMedia = window.matchMedia

/** Lee el tema persistido tal cual lo escribe el hook (JSON). */
function readStoredTheme(): unknown {
  const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (raw === null) return null

  return JSON.parse(raw) as unknown
}

/**
 * Mockea `window.matchMedia` de forma dinámica: devuelve un MediaQueryList
 * conforme al contrato del DOM cuyo `matches` refleja la preferencia indicada.
 * Necesario porque jsdom no implementa `matchMedia`.
 */
function mockMatchMedia(prefersDark: boolean): void {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: query === DARK_QUERY ? prefersDark : false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

beforeEach(() => {
  // Aislamiento riguroso: sin estado persistido ni residuo en el DOM raíz
  window.localStorage.clear()
  document.documentElement.className = ''
  document.documentElement.style.colorScheme = ''
})

afterEach(() => {
  if (originalMatchMedia) {
    window.matchMedia = originalMatchMedia
  } else {
    Reflect.deleteProperty(window, 'matchMedia')
  }
})

describe('useTheme › entorno de pruebas', () => {
  it('expone el contrato del hook y aplica el tema al <html>', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBeTypeOf('string')
    expect(result.current.toggleTheme).toBeTypeOf('function')
  })
})

describe('useTheme › inicialización desde localStorage', () => {
  it('arranca en oscuro si el tema guardado es válido y lo aplica al <html>', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify('dark'))

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
    expect(readStoredTheme()).toBe('dark')
  })

  it('arranca en claro si el tema guardado es "light" y no añade la clase dark', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify('light'))

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
    expect(document.documentElement).not.toHaveClass('dark')
    expect(document.documentElement.style.colorScheme).toBe('light')
  })

  it('tiene prioridad sobre la preferencia del sistema operativo', () => {
    mockMatchMedia(true)
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify('light'))

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('descarta un valor inválido y cae en la preferencia del sistema', () => {
    mockMatchMedia(true)
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify('solarized'))

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('descarta un JSON corrupto sin romper el hook y cae en el sistema', () => {
    mockMatchMedia(true)
    window.localStorage.setItem(THEME_STORAGE_KEY, '{"tema": no-es-json')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
  })
})

describe('useTheme › fallback a la preferencia del sistema operativo', () => {
  it('usa "dark" cuando localStorage está vacío y el SO prefiere oscuro', () => {
    mockMatchMedia(true)

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
    expect(readStoredTheme()).toBe('dark')
  })

  it('usa "light" cuando localStorage está vacío y el SO prefiere claro', () => {
    mockMatchMedia(false)

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
    expect(document.documentElement).not.toHaveClass('dark')
    expect(document.documentElement.style.colorScheme).toBe('light')
  })

  it('usa "light" si el navegador no implementa matchMedia', () => {
    Reflect.deleteProperty(window, 'matchMedia')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })
})

describe('useTheme › toggleTheme', () => {
  it('alterna estado, clase en <html>, colorScheme y persistencia JSON', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
    expect(readStoredTheme()).toBe('dark')

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('light')
    expect(document.documentElement).not.toHaveClass('dark')
    expect(document.documentElement.style.colorScheme).toBe('light')
    expect(readStoredTheme()).toBe('light')
  })

  it('persiste la elección y la restaura en un montaje nuevo (entre sesiones)', () => {
    mockMatchMedia(false)
    const first = renderHook(() => useTheme())

    act(() => {
      first.result.current.toggleTheme()
    })
    expect(first.result.current.theme).toBe('dark')
    first.unmount()

    // Nuevo montaje con el SO prefiriendo claro: manda la elección persistida
    mockMatchMedia(false)
    const second = renderHook(() => useTheme())

    expect(second.result.current.theme).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('es estable entre renders (referencia estable gracias a useCallback)', () => {
    const { result, rerender } = renderHook(() => useTheme())
    const firstToggle = result.current.toggleTheme

    rerender()

    expect(result.current.toggleTheme).toBe(firstToggle)
  })
})
