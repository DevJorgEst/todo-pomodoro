import { useLayoutEffect, useRef } from 'react'

import type { Todo, TodoFilter } from '../../types/todo'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  filter: TodoFilter
  /** Id de la tarea enlazada al Pomodoro, si la hay. */
  activeTaskId: string | null
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onSelectTask: (id: string) => void
}

/**
 * Mensaje de lista vacía por filtro. Cada caso dice qué pasa y qué hacer, en
 * lugar de concatenar la etiqueta del filtro ("No hay tareas todas").
 */
const EMPTY_MESSAGES: Record<TodoFilter, string> = {
  all: 'Aún no hay tareas. Añade la primera para empezar.',
  active: 'No quedan tareas pendientes. Buen trabajo.',
  completed: 'Todavía no has completado ninguna tarea.',
}

export function TodoList({
  todos,
  filter,
  activeTaskId,
  onToggle,
  onRemove,
  onSelectTask,
}: TodoListProps) {
  // Al borrar una tarea el navegador deja el foco en <body>: recordamos la
  // posición borrada y devolvemos el foco a la tarea que ocupa su lugar (o al
  // campo de texto si la lista queda vacía) para no perder el hilo con teclado.
  const listRef = useRef<HTMLUListElement | null>(null)
  const focusIndexRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    const index = focusIndexRef.current
    if (index === null) return
    focusIndexRef.current = null

    const checkboxes = listRef.current?.querySelectorAll<HTMLInputElement>(
      '[data-todo-checkbox]',
    )
    const target =
      checkboxes && checkboxes.length > 0
        ? checkboxes[Math.min(index, checkboxes.length - 1)]
        : null

    if (target) target.focus()
    else document.getElementById('new-todo')?.focus()
  })

  function handleRemove(index: number, id: string): void {
    focusIndexRef.current = index
    onRemove(id)
  }

  if (todos.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
        {EMPTY_MESSAGES[filter]}
      </p>
    )
  }

  return (
    <ul
      ref={listRef}
      className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-sm dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-800"
    >
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isActiveTask={todo.id === activeTaskId}
          onToggle={onToggle}
          onRemove={(id) => handleRemove(index, id)}
          onSelect={onSelectTask}
        />
      ))}
    </ul>
  )
}
