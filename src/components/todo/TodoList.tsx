import type { Todo } from '../../types/todo'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  filterLabel: string
  /** Id de la tarea enlazada al Pomodoro, si la hay. */
  activeTaskId: string | null
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onSelectTask: (id: string) => void
}

export function TodoList({
  todos,
  filterLabel,
  activeTaskId,
  onToggle,
  onRemove,
  onSelectTask,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-zinc-400 dark:text-zinc-500">
        No hay tareas {filterLabel.toLowerCase()}.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-zinc-100 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-800">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isActiveTask={todo.id === activeTaskId}
          onToggle={onToggle}
          onRemove={onRemove}
          onSelect={onSelectTask}
        />
      ))}
    </ul>
  )
}
