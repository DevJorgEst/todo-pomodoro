import { useEffect, useRef } from 'react'

import { PomodoroTimer } from './components/pomodoro/PomodoroTimer'
import { ThemeToggle } from './components/theme/ThemeToggle'
import { TodoFilters } from './components/todo/TodoFilters'
import { TodoInput } from './components/todo/TodoInput'
import { TodoList } from './components/todo/TodoList'
import { TodoStats } from './components/todo/TodoStats'
import { usePomodoro } from './hooks/usePomodoro'
import { useTheme } from './hooks/useTheme'
import { useTodos } from './hooks/useTodos'
import { markUserInteraction, playChime } from './utils/feedback'
import { buildDocumentTitle, DEFAULT_TITLE } from './utils/title'

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
    completedCycles,
    currentTaskId,
    start,
    pause,
    reset,
    linkTask,
    selectMode,
  } = usePomodoro()

  // Título de la pestaña: sigue al temporizador mientras corre y vuelve a la
  // marca por defecto al pausar o al terminar un ciclo
  useEffect(() => {
    document.title = buildDocumentTitle(isRunning, timeLeft, mode)

    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [isRunning, timeLeft, mode])

  // Campanilla exactamente cuando el contador llega a 00:00 (fin de ciclo)
  const previousCyclesRef = useRef(completedCycles)
  useEffect(() => {
    if (completedCycles > previousCyclesRef.current) playChime()
    previousCyclesRef.current = completedCycles
  }, [completedCycles])

  // Autoplay: los navegadores solo permiten audio tras un gesto del usuario
  useEffect(() => {
    const unlock = () => markUserInteraction()

    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })

    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  const linkedTask = todos.find((todo) => todo.id === currentTaskId) ?? null

  // Cualquier vía de borrado (una tarea, limpiar completadas, hidratación
  // desde storage) deja el enlace huérfano: se suelta aquí, en un solo sitio.
  useEffect(() => {
    if (currentTaskId !== null && linkedTask === null) linkTask(null)
  }, [currentTaskId, linkedTask, linkTask])

  function handleSelectTask(taskId: string): void {
    // Volver a pulsar la tarea activa la desenlaza del Pomodoro
    linkTask(taskId === currentTaskId ? null : taskId)
  }

  useTheme() // Garantiza que el tema se aplique y persista

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-zinc-900 transition-colors duration-200 sm:py-10 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1" aria-hidden="true" />
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                To-Do + Pomodoro
              </h1>
              <p className="mt-1 text-sm text-balance text-zinc-600 dark:text-zinc-300">
                Organiza tus tareas y trabaja en bloques concentrados.
              </p>
            </div>
            <div className="flex flex-1 items-center justify-end">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          <PomodoroTimer
            timeLeft={timeLeft}
            mode={mode}
            isRunning={isRunning}
            sessionsCompleted={sessionsCompleted}
            currentTaskTitle={linkedTask?.title ?? null}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onSelectMode={selectMode}
          />

          <main className="min-w-0 space-y-4">
            <TodoInput onAdd={addTodo} />

            <TodoList
              todos={filteredTodos}
              filter={filter}
              activeTaskId={currentTaskId}
              onToggle={toggleTodo}
              onRemove={removeTodo}
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
