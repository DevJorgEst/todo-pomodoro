import type { Todo } from '../../types/todo'

interface TodoItemProps {
  todo: Todo
  /** Indica si esta tarea es la enlazada al temporizador Pomodoro. */
  isActiveTask: boolean
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onSelect: (id: string) => void
}

export function TodoItem({
  todo,
  isActiveTask,
  onToggle,
  onRemove,
  onSelect,
}: TodoItemProps) {
  const checkboxId = `todo-${todo.id}`

  return (
    <li
      className={`group flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 transition ${
        todo.completed
          ? 'bg-zinc-50 dark:bg-zinc-800/60'
          : 'bg-white dark:bg-zinc-800'
      } ${isActiveTask ? 'ring-1 ring-amber-300 ring-inset dark:ring-amber-400/40' : ''}`}
    >
      <input
        id={checkboxId}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Marcar "${todo.title}" como ${
          todo.completed ? 'pendiente' : 'completada'
        }`}
        className="h-4 w-4 shrink-0 cursor-pointer rounded border-zinc-300 accent-zinc-900 focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:accent-zinc-100 dark:focus:ring-zinc-500 dark:focus:ring-offset-zinc-900"
      />

      <label
        htmlFor={checkboxId}
        className={`min-w-0 flex-1 cursor-pointer text-sm break-words ${
          todo.completed
            ? 'text-zinc-400 line-through dark:text-zinc-500'
            : 'text-zinc-800 dark:text-zinc-200'
        }`}
      >
        {todo.title}
      </label>

      <button
        type="button"
        onClick={() => onSelect(todo.id)}
        aria-pressed={isActiveTask}
        aria-label={`Establecer "${todo.title}" como tarea activa del Pomodoro`}
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition focus:ring-2 focus:ring-amber-400 focus:outline-none dark:focus:ring-amber-400/70 ${
          isActiveTask
            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
            : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-700/60 dark:hover:text-zinc-300'
        }`}
      >
        {isActiveTask ? '✓ En el Pomodoro' : 'Cronometrar'}
      </button>

      <button
        type="button"
        onClick={() => onRemove(todo.id)}
        aria-label={`Eliminar tarea "${todo.title}"`}
        className="shrink-0 rounded px-2 py-1 text-lg leading-none text-zinc-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 focus:opacity-100 focus:ring-2 focus:ring-red-300 focus:outline-none dark:text-zinc-500 dark:hover:bg-red-950/40 dark:hover:text-red-300 dark:focus:ring-red-400/60"
      >
        &times;
      </button>
    </li>
  )
}
