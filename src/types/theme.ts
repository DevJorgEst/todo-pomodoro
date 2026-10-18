export type Theme = 'light' | 'dark'

export const THEMES = ['light', 'dark'] as const satisfies readonly Theme[]

export function isTheme(value: unknown): value is Theme {
  return THEMES.includes(value as Theme)
}
