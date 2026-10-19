import { useState } from 'react'
import type { FormEvent } from 'react'

interface TodoInputProps {
  onAdd: (title: string) => boolean
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [draft, setDraft] = useState('')
  const canSubmit = draft.trim().length > 0

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (onAdd(draft)) setDraft('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Añadir tarea"
      className="flex items-center gap-2"
    >
      <label htmlFor="new-todo" className="sr-only">
        Nueva tarea
      </label>
      <input
        id="new-todo"
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="¿Qué necesitas hacer?"
        autoComplete="off"
        maxLength={200}
        className="min-w-0 flex-1 rounded-lg border border-zinc-500 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-600 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-500 focus:outline-none dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
      />
      <button
        type="submit"
        disabled={!canSubmit}
        className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:focus:ring-zinc-400"
      >
        Añadir
      </button>
    </form>
  )
}
