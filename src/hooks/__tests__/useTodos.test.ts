import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useTodos } from '../useTodos'

const TODOS_STORAGE_KEY = 'todo-pomodoro/todos'
const FILTER_STORAGE_KEY = 'todo-pomodoro/filter'

function renderTodos() {
  return renderHook(() => useTodos())
}

beforeEach(() => {
  // Aísla cada test: el hook persiste en localStorage
  window.localStorage.clear()
})

function readStoredTodos(): unknown[] {
  const raw = window.localStorage.getItem(TODOS_STORAGE_KEY)
  if (raw === null) return []

  return JSON.parse(raw) as unknown[]
}

function readStoredFilter(): unknown {
  const raw = window.localStorage.getItem(FILTER_STORAGE_KEY)
  if (raw === null) return null

  return JSON.parse(raw) as unknown
}

describe('entorno de pruebas', () => {
  it('registra los matchers de jest-dom desde src/setupTests.ts', () => {
    renderTodos()

    // renderHook monta un contenedor real adjunto a document.body
    expect(document.body).not.toBeEmptyDOMElement()
  })
})

describe('useTodos › añadir tareas', () => {
  it('añade una tarea: incrementa el contador y la persiste en localStorage', () => {
    const { result } = renderTodos()

    expect(result.current.counts.total).toBe(0)
    expect(result.current.todos).toEqual([])

    act(() => {
      result.current.addTodo('Comprar pan')
    })

    expect(result.current.counts).toEqual({ total: 1, active: 1, completed: 0 })
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].title).toBe('Comprar pan')
    expect(result.current.todos[0].completed).toBe(false)
    expect(result.current.todos[0].id).not.toBe('')

    const stored = readStoredTodos()
    expect(stored).toHaveLength(1)
    expect(stored[0]).toMatchObject({ title: 'Comprar pan', completed: false })
  })

  it('rechaza entradas vacías o con solo espacios sin modificar el estado', () => {
    const { result } = renderTodos()

    let added = true
    act(() => {
      added = result.current.addTodo('   ')
    })

    expect(added).toBe(false)
    expect(result.current.counts.total).toBe(0)
    expect(readStoredTodos()).toEqual([])
  })

  it('recupera las tareas persistidas en un montaje nuevo', () => {
    const first = renderTodos()
    act(() => {
      first.result.current.addTodo('Tarea persistente')
    })
    first.unmount()

    const second = renderTodos()

    expect(second.result.current.todos).toHaveLength(1)
    expect(second.result.current.todos[0].title).toBe('Tarea persistente')
  })
})

describe('useTodos › toggleTodo', () => {
  it('alterna el estado de completado y lo persiste', () => {
    const { result } = renderTodos()
    act(() => {
      result.current.addTodo('Terminar informe')
    })

    const todo = result.current.todos[0]
    expect(todo.completed).toBe(false)

    act(() => {
      result.current.toggleTodo(todo.id)
    })

    expect(result.current.todos[0].completed).toBe(true)
    expect(result.current.counts).toEqual({ total: 1, active: 0, completed: 1 })
    expect(readStoredTodos()[0]).toMatchObject({ completed: true })

    // Segundo toggle vuelve al estado original
    act(() => {
      result.current.toggleTodo(todo.id)
    })

    expect(result.current.todos[0].completed).toBe(false)
    expect(result.current.counts).toEqual({ total: 1, active: 1, completed: 0 })
  })

  it('solo modifica la tarea indicada, no el resto', () => {
    const { result } = renderTodos()
    act(() => {
      result.current.addTodo('Una')
      result.current.addTodo('Dos')
    })

    // Las tareas se añaden por la cabeza: [0] = "Dos", [1] = "Una"
    const primera = result.current.todos[0]
    const segunda = result.current.todos[1]
    expect(primera.title).toBe('Dos')
    expect(segunda.title).toBe('Una')

    act(() => {
      result.current.toggleTodo(segunda.id)
    })

    expect(
      result.current.todos.map((todo) => [todo.title, todo.completed]),
    ).toEqual([
      ['Dos', false],
      ['Una', true],
    ])
  })
})

describe('useTodos › removeTodo', () => {
  it('elimina solo la tarea indicada y actualiza contadores y storage', () => {
    const { result } = renderTodos()
    act(() => {
      result.current.addTodo('Borrar esta')
      result.current.addTodo('Conservar esta')
    })

    // Las tareas se añaden por la cabeza: [0] = "Conservar esta", [1] = "Borrar esta"
    const aBorrar = result.current.todos[1]
    expect(aBorrar.title).toBe('Borrar esta')

    act(() => {
      result.current.removeTodo(aBorrar.id)
    })

    expect(result.current.counts.total).toBe(1)
    expect(result.current.todos.map((todo) => todo.title)).toEqual([
      'Conservar esta',
    ])
    expect(readStoredTodos()).toHaveLength(1)
    expect(readStoredTodos()[0]).toMatchObject({ title: 'Conservar esta' })
  })
})

describe('useTodos › filtros', () => {
  it('filtra correctamente Todas / Pendientes / Completadas', () => {
    const { result } = renderTodos()
    act(() => {
      result.current.addTodo('Comprar pan')
      result.current.addTodo('Estudiar TypeScript')
    })

    const activa = result.current.todos[0]
    expect(activa.title).toBe('Estudiar TypeScript')
    act(() => {
      result.current.toggleTodo(activa.id)
    })

    expect(result.current.counts).toEqual({ total: 2, active: 1, completed: 1 })

    act(() => {
      result.current.setFilter('active')
    })
    expect(result.current.filter).toBe('active')
    expect(result.current.filteredTodos.map((todo) => todo.title)).toEqual([
      'Comprar pan',
    ])

    act(() => {
      result.current.setFilter('completed')
    })
    expect(result.current.filteredTodos.map((todo) => todo.title)).toEqual([
      'Estudiar TypeScript',
    ])

    act(() => {
      result.current.setFilter('all')
    })
    expect(result.current.filteredTodos).toHaveLength(2)
  })

  it('persiste el filtro seleccionado en localStorage', () => {
    const { result } = renderTodos()

    act(() => {
      result.current.setFilter('completed')
    })

    expect(readStoredFilter()).toBe('completed')

    const remontado = renderTodos()
    expect(remontado.result.current.filter).toBe('completed')
  })
})

describe('useTodos › clearCompleted', () => {
  it('elimina únicamente las tareas completadas', () => {
    const { result } = renderTodos()
    act(() => {
      result.current.addTodo('Pendiente')
      result.current.addTodo('Hecha')
    })

    const hecha = result.current.todos[0]
    act(() => {
      result.current.toggleTodo(hecha.id)
    })
    act(() => {
      result.current.clearCompleted()
    })

    expect(result.current.todos.map((todo) => todo.title)).toEqual([
      'Pendiente',
    ])
    expect(result.current.counts).toEqual({ total: 1, active: 1, completed: 0 })
    expect(readStoredTodos()).toHaveLength(1)
  })
})

describe('useTodos › localStorage corrupto o inválido', () => {
  it('usa el fallback de lista vacía si el JSON es ilegible', () => {
    window.localStorage.setItem(TODOS_STORAGE_KEY, '{"tareas": [no es json')

    const { result } = renderTodos()

    expect(result.current.todos).toEqual([])
    expect(result.current.counts.total).toBe(0)
  })

  it('descarta datos con forma válida de JSON pero inválida como tareas', () => {
    window.localStorage.setItem(
      TODOS_STORAGE_KEY,
      JSON.stringify(['solo', 'strings', 42]),
    )

    const { result } = renderTodos()

    expect(result.current.todos).toEqual([])
  })

  it('usa el filtro por defecto si el valor guardado no es un filtro conocido', () => {
    window.localStorage.setItem(
      FILTER_STORAGE_KEY,
      JSON.stringify('filtro-inexistente'),
    )

    const { result } = renderTodos()

    expect(result.current.filter).toBe('all')
  })

  it('sigue siendo operativo tras datos corruptos y sobrescribe el storage', () => {
    window.localStorage.setItem(TODOS_STORAGE_KEY, 'no-json')
    window.localStorage.setItem(FILTER_STORAGE_KEY, '[]')

    const { result } = renderTodos()

    act(() => {
      result.current.addTodo('Nueva tras la corrupción')
    })

    expect(result.current.counts.total).toBe(1)
    expect(readStoredTodos()).toHaveLength(1)
    expect(readStoredTodos()[0]).toMatchObject({
      title: 'Nueva tras la corrupción',
    })
    expect(readStoredFilter()).toBe('all')
  })
})
