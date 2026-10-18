import type { Todo } from '../../types/todo'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  filterLabel: string
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export function TodoList({
  todos,
  filterLabel,
  onToggle,
  onRemove,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-slate-400">
        No hay tareas {filterLabel.toLowerCase()}.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRemove={onRemove}
        />
      ))}
    </ul>
  )
}
