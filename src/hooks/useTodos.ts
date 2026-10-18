import { useCallback, useEffect, useMemo, useState } from 'react'
import { isTodo, isTodoFilter } from '../types/todo'
import type { Todo, TodoFilter } from '../types/todo'
import { createTodo } from '../utils/todo'
import { loadFromStorage, saveToStorage } from '../utils/storage'

const TODOS_STORAGE_KEY = 'todo-pomodoro/todos'
const FILTER_STORAGE_KEY = 'todo-pomodoro/filter'

export interface TodoCounts {
  total: number
  active: number
  completed: number
}

export interface UseTodosResult {
  todos: Todo[]
  filteredTodos: Todo[]
  filter: TodoFilter
  counts: TodoCounts
  addTodo: (title: string) => boolean
  toggleTodo: (id: string) => void
  removeTodo: (id: string) => void
  clearCompleted: () => void
  setFilter: (filter: TodoFilter) => void
}

export function useTodos(): UseTodosResult {
  const [todos, setTodos] = useState<Todo[]>(() =>
    loadFromStorage<Todo[]>(
      TODOS_STORAGE_KEY,
      [],
      (value): value is Todo[] => Array.isArray(value) && value.every(isTodo),
    ),
  )
  const [filter, setFilter] = useState<TodoFilter>(() =>
    loadFromStorage<TodoFilter>(FILTER_STORAGE_KEY, 'all', isTodoFilter),
  )

  useEffect(() => {
    saveToStorage(TODOS_STORAGE_KEY, todos)
  }, [todos])

  useEffect(() => {
    saveToStorage(FILTER_STORAGE_KEY, filter)
  }, [filter])

  const addTodo = useCallback((title: string): boolean => {
    const trimmed = title.trim()
    if (trimmed.length === 0) return false

    setTodos((previous) => [createTodo(trimmed), ...previous])
    return true
  }, [])

  const toggleTodo = useCallback((id: string): void => {
    setTodos((previous) =>
      previous.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }, [])

  const removeTodo = useCallback((id: string): void => {
    setTodos((previous) => previous.filter((todo) => todo.id !== id))
  }, [])

  const clearCompleted = useCallback((): void => {
    setTodos((previous) => previous.filter((todo) => !todo.completed))
  }, [])

  const counts = useMemo<TodoCounts>(
    () => ({
      total: todos.length,
      active: todos.filter((todo) => !todo.completed).length,
      completed: todos.filter((todo) => todo.completed).length,
    }),
    [todos],
  )

  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.completed)
    if (filter === 'completed') return todos.filter((todo) => todo.completed)
    return todos
  }, [todos, filter])

  return {
    todos,
    filteredTodos,
    filter,
    counts,
    addTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
    setFilter,
  }
}
