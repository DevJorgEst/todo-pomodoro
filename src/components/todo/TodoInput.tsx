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
        className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
      <button
        type="submit"
        disabled={!canSubmit}
        className="shrink-0 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Añadir
      </button>
    </form>
  )
}
