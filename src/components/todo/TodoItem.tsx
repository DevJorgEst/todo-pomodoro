import type { Todo } from '../../types/todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export function TodoItem({ todo, onToggle, onRemove }: TodoItemProps) {
  const checkboxId = `todo-${todo.id}`

  return (
    <li
      className={`group flex items-center gap-3 px-4 py-3 transition ${
        todo.completed ? 'bg-slate-50' : 'bg-white'
      }`}
    >
      <input
        id={checkboxId}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Marcar "${todo.title}" como ${
          todo.completed ? 'pendiente' : 'completada'
        }`}
        className="h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
      />

      <label
        htmlFor={checkboxId}
        className={`min-w-0 flex-1 cursor-pointer break-words text-sm ${
          todo.completed ? 'text-slate-400 line-through' : 'text-slate-800'
        }`}
      >
        {todo.title}
      </label>

      <button
        type="button"
        onClick={() => onRemove(todo.id)}
        aria-label={`Eliminar tarea "${todo.title}"`}
        className="shrink-0 rounded px-2 py-1 text-lg leading-none text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-300 group-hover:opacity-100"
      >
        &times;
      </button>
    </li>
  )
}
