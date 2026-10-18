import type { Todo } from '../types/todo'
import { createId } from './id'

export function createTodo(title: string): Todo {
  return {
    id: createId(),
    title,
    completed: false,
    createdAt: Date.now(),
  }
}
