import { createId } from './id'
export function createTodo(title) {
  return {
    id: createId(),
    title,
    completed: false,
    createdAt: Date.now(),
  }
}
