import { PomodoroTimer } from './components/pomodoro/PomodoroTimer'
import { TodoFilters } from './components/todo/TodoFilters'
import { TodoInput } from './components/todo/TodoInput'
import { TodoList } from './components/todo/TodoList'
import { TodoStats } from './components/todo/TodoStats'
import { usePomodoro } from './hooks/usePomodoro'
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
    todos,
  } = useTodos()

  const {
    timeLeft,
    mode,
    isRunning,
    sessionsCompleted,
    currentTaskId,
    start,
    pause,
    reset,
    linkTask,
    selectMode,
  } = usePomodoro()

  const linkedTaskTitle =
    todos.find((todo) => todo.id === currentTaskId)?.title ?? null

  function handleSelectTask(taskId: string): void {
    // Volver a pulsar la tarea activa la desenlaza del Pomodoro
    linkTask(taskId === currentTaskId ? null : taskId)
  }

  function handleRemoveTask(taskId: string): void {
    removeTodo(taskId)
    if (taskId === currentTaskId) linkTask(null)
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            To-Do + Pomodoro
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Organiza tus tareas y trabaja en bloques concentrados.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <PomodoroTimer
            timeLeft={timeLeft}
            mode={mode}
            isRunning={isRunning}
            sessionsCompleted={sessionsCompleted}
            currentTaskTitle={linkedTaskTitle}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onSelectMode={selectMode}
          />

          <main className="space-y-4">
            <TodoInput onAdd={addTodo} />

            <TodoList
              todos={filteredTodos}
              filterLabel={TODO_FILTER_LABELS[filter]}
              activeTaskId={currentTaskId}
              onToggle={toggleTodo}
              onRemove={handleRemoveTask}
              onSelectTask={handleSelectTask}
            />

            <TodoStats counts={counts} onClearCompleted={clearCompleted} />

            <div className="flex justify-center pt-1">
              <TodoFilters
                filter={filter}
                counts={counts}
                onChange={setFilter}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
