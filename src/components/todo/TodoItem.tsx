import type { Todo } from '../../types/todo'
import { CheckIcon, CloseIcon } from '../ui/icons'

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
      } ${isActiveTask ? 'ring-1 ring-amber-400 ring-inset dark:ring-amber-400/50' : ''}`}
    >
      <input
        id={checkboxId}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Marcar "${todo.title}" como ${
          todo.completed ? 'pendiente' : 'completada'
        }`}
        className="size-6 shrink-0 cursor-pointer rounded border-zinc-500 accent-zinc-900 focus:ring-2 focus:ring-zinc-500 focus:ring-offset-1 focus:outline-none dark:border-zinc-400 dark:bg-zinc-900 dark:accent-zinc-100 dark:focus:ring-zinc-400 dark:focus:ring-offset-zinc-900 pointer-coarse:size-7"
      />

      <label
        htmlFor={checkboxId}
        className={`min-w-0 flex-1 cursor-pointer text-sm break-words ${
          todo.completed
            ? 'text-zinc-500 line-through dark:text-zinc-400'
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
        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors focus:ring-2 focus:ring-amber-500 focus:outline-none dark:focus:ring-amber-400 ${
          isActiveTask
            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-700/60 dark:hover:text-zinc-100'
        }`}
      >
        {isActiveTask && <CheckIcon className="size-3.5" />}
        {isActiveTask ? 'En el Pomodoro' : 'Cronometrar'}
      </button>

      <button
        type="button"
        onClick={() => onRemove(todo.id)}
        aria-label={`Eliminar tarea "${todo.title}"`}
        title="Eliminar tarea"
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-700 focus:opacity-100 focus:ring-2 focus:ring-red-500 focus:outline-none dark:text-zinc-400 dark:hover:bg-red-950/40 dark:hover:text-red-300 dark:focus:ring-red-400 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100"
      >
        <CloseIcon className="size-4" />
      </button>
    </li>
  )
}
