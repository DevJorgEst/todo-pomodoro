import { useTheme } from '../../hooks/useTheme'

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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-lg shadow-sm transition-colors duration-200 hover:bg-zinc-100 focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:focus:ring-zinc-500"
    >
      <span aria-hidden="true" className="select-none">
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
