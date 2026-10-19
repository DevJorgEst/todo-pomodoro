import { useTheme } from '../../hooks/useTheme'
import { MoonIcon, SunIcon } from '../ui/icons'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === 'dark'
  const label = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-sm transition-colors duration-200 hover:bg-zinc-100 focus:ring-2 focus:ring-zinc-500 focus:ring-offset-1 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:focus:ring-zinc-400 dark:focus:ring-offset-zinc-900"
    >
      {isDark ? (
        <MoonIcon className="size-5" />
      ) : (
        <SunIcon className="size-5" />
      )}
    </button>
  )
}
