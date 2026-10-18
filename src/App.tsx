import { TodoFilters } from './components/todo/TodoFilters'
import { TodoInput } from './components/todo/TodoInput'
import { TodoList } from './components/todo/TodoList'
import { TodoStats } from './components/todo/TodoStats'
import { useTodos } from './hooks/useTodos'
import { TODO_FILTER_LABELS } from './types/todo'

export default function App() {
  const {
    filteredTodos,
    filter,
    counts,
    addTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
    setFilter,
  } = useTodos()

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            To-Do + Pomodoro
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Organiza tus tareas y trabaja en bloques concentrados.
          </p>
        </header>

        <main className="space-y-4">
          <TodoInput onAdd={addTodo} />

          <TodoList
            todos={filteredTodos}
            filterLabel={TODO_FILTER_LABELS[filter]}
            onToggle={toggleTodo}
            onRemove={removeTodo}
          />

          <TodoStats counts={counts} onClearCompleted={clearCompleted} />

          <div className="flex justify-center pt-1">
            <TodoFilters filter={filter} counts={counts} onChange={setFilter} />
          </div>
        </main>

        <footer className="mt-10 text-center text-xs text-slate-400">
          <p>Temporizador Pomodoro: próximamente (feature/pomodoro)</p>
        </footer>
      </div>
    </div>
  )
}
