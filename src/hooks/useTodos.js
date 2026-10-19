import { useCallback, useEffect, useMemo, useState } from 'react'
import { isTodo, isTodoFilter } from '../types/todo'
import { createTodo } from '../utils/todo'
import { loadFromStorage, saveToStorage } from '../utils/storage'
const TODOS_STORAGE_KEY = 'todo-pomodoro/todos'
const FILTER_STORAGE_KEY = 'todo-pomodoro/filter'
export function useTodos() {
  const [todos, setTodos] = useState(() =>
    loadFromStorage(
      TODOS_STORAGE_KEY,
      [],
      (value) => Array.isArray(value) && value.every(isTodo),
    ),
  )
  const [filter, setFilter] = useState(() =>
    loadFromStorage(FILTER_STORAGE_KEY, 'all', isTodoFilter),
  )
  useEffect(() => {
    saveToStorage(TODOS_STORAGE_KEY, todos)
  }, [todos])
  useEffect(() => {
    saveToStorage(FILTER_STORAGE_KEY, filter)
  }, [filter])
  const addTodo = useCallback((title) => {
    const trimmed = title.trim()
    if (trimmed.length === 0) return false
    setTodos((previous) => [createTodo(trimmed), ...previous])
    return true
  }, [])
  const toggleTodo = useCallback((id) => {
    setTodos((previous) =>
      previous.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }, [])
  const removeTodo = useCallback((id) => {
    setTodos((previous) => previous.filter((todo) => todo.id !== id))
  }, [])
  const clearCompleted = useCallback(() => {
    setTodos((previous) => previous.filter((todo) => !todo.completed))
  }, [])
  const counts = useMemo(
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
