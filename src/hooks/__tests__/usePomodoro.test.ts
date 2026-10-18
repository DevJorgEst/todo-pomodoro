import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { usePomodoro } from '../usePomodoro'
import { POMODORO_DURATIONS } from '../../types/pomodoro'
import { nextPomodoroMode } from '../../utils/pomodoro'

const WORK_SECONDS = POMODORO_DURATIONS.WORK
const SHORT_BREAK_SECONDS = POMODORO_DURATIONS.SHORT_BREAK
const LONG_BREAK_SECONDS = POMODORO_DURATIONS.LONG_BREAK

function renderPomodoro() {
  return renderHook(() => usePomodoro())
}

type PomodoroResult = ReturnType<typeof renderPomodoro>['result']

/** Ejecuta una sesión completa de trabajo hasta llegar a LONG_BREAK (4 sesiones). */
function reachLongBreak(result: PomodoroResult): void {
  for (let session = 1; session <= 4; session += 1) {
    act(() => {
      result.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(WORK_SECONDS * 1000)
    })

    if (session === 4) return

    act(() => {
      result.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(SHORT_BREAK_SECONDS * 1000)
    })
  }
}

beforeEach(() => {
  // Date también debe estar controlado: el hook calcula contra Date.now()
  vi.useFakeTimers({
    toFake: [
      'Date',
      'setInterval',
      'clearInterval',
      'setTimeout',
      'clearTimeout',
    ],
  })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('usePomodoro › estado inicial', () => {
  it('arranca en WORK con 25 minutos, detenido y sin sesiones', () => {
    const { result } = renderPomodoro()

    expect(result.current.mode).toBe('WORK')
    expect(result.current.timeLeft).toBe(25 * 60)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.sessionsCompleted).toBe(0)
    expect(result.current.currentTaskId).toBeNull()
  })

  it('usa las duraciones definidas: WORK 25 min, SHORT_BREAK 5 min, LONG_BREAK 15 min', () => {
    expect(POMODORO_DURATIONS).toEqual({
      WORK: 25 * 60,
      SHORT_BREAK: 5 * 60,
      LONG_BREAK: 15 * 60,
    })
  })
})

describe('usePomodoro › cuenta atrás', () => {
  it('descuenta el tiempo transcurrido al iniciar', () => {
    const { result } = renderPomodoro()

    act(() => {
      result.current.start()
    })
    expect(result.current.isRunning).toBe(true)

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.timeLeft).toBe(WORK_SECONDS - 3)
    expect(result.current.isRunning).toBe(true)
  })

  it('no se retrasa si el hilo principal se bloquea: calcula contra Date.now()', () => {
    const { result } = renderPomodoro()
    act(() => {
      result.current.start()
    })
    const startedAt = Date.now()

    // El navegador pausa el hilo principal 10 s: no llega ningún tick…
    act(() => {
      vi.setSystemTime(startedAt + 10_000)
    })
    // …y al despertar llega un único tic retrasado
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Un enfoque ingenuo (-1 por tick ejecutado) habría quedado en 1499
    expect(result.current.timeLeft).toBe(WORK_SECONDS - 11)
  })
})

describe('usePomodoro › pausa y reanudación', () => {
  it('la pausa congela el tiempo y la reanudación continúa desde ese punto', () => {
    const { result } = renderPomodoro()
    act(() => {
      result.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    act(() => {
      result.current.pause()
    })
    expect(result.current.isRunning).toBe(false)
    expect(result.current.timeLeft).toBe(WORK_SECONDS - 5)

    // El tiempo avanza sin que el temporizador se mueva
    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(result.current.timeLeft).toBe(WORK_SECONDS - 5)

    act(() => {
      result.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.isRunning).toBe(true)
    expect(result.current.timeLeft).toBe(WORK_SECONDS - 7)
  })
})

describe('usePomodoro › transiciones de ciclo', () => {
  it('al llegar a 0 en WORK pasa a SHORT_BREAK, suma una sesión y se detiene', () => {
    const { result } = renderPomodoro()
    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(WORK_SECONDS * 1000)
    })

    expect(result.current.mode).toBe('SHORT_BREAK')
    expect(result.current.timeLeft).toBe(SHORT_BREAK_SECONDS)
    expect(result.current.sessionsCompleted).toBe(1)
    expect(result.current.isRunning).toBe(false)
  })

  it('al terminar un descanso vuelve a WORK sin tocar el contador', () => {
    const { result } = renderPomodoro()
    act(() => {
      result.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(WORK_SECONDS * 1000)
    })
    expect(result.current.mode).toBe('SHORT_BREAK')

    act(() => {
      result.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(SHORT_BREAK_SECONDS * 1000)
    })

    expect(result.current.mode).toBe('WORK')
    expect(result.current.timeLeft).toBe(WORK_SECONDS)
    expect(result.current.sessionsCompleted).toBe(1)
    expect(result.current.isRunning).toBe(false)
  })

  it('tras 4 sesiones de WORK la siguiente es obligatoriamente LONG_BREAK', () => {
    const { result } = renderPomodoro()

    // Tres bloques WORK + SHORT_BREAK completos
    for (let session = 1; session < 4; session += 1) {
      act(() => {
        result.current.start()
      })
      act(() => {
        vi.advanceTimersByTime(WORK_SECONDS * 1000)
      })
      expect(result.current.sessionsCompleted).toBe(session)
      expect(result.current.mode).toBe('SHORT_BREAK')

      act(() => {
        result.current.start()
      })
      act(() => {
        vi.advanceTimersByTime(SHORT_BREAK_SECONDS * 1000)
      })
      expect(result.current.mode).toBe('WORK')
    }

    // Cuarta sesión de trabajo: toca descanso largo
    act(() => {
      result.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(WORK_SECONDS * 1000)
    })

    expect(result.current.sessionsCompleted).toBe(4)
    expect(result.current.mode).toBe('LONG_BREAK')
    expect(result.current.timeLeft).toBe(LONG_BREAK_SECONDS)
  })

  it('tras el descanso largo el ciclo vuelve a empezar en WORK', () => {
    const { result } = renderPomodoro()
    act(() => {
      result.current.linkTask('task-1')
    })

    // Cuatro sesiones de trabajo hasta activar el descanso largo
    reachLongBreak(result)
    expect(result.current.mode).toBe('LONG_BREAK')
    expect(result.current.sessionsCompleted).toBe(4)

    act(() => {
      result.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(LONG_BREAK_SECONDS * 1000)
    })

    expect(result.current.mode).toBe('WORK')
    expect(result.current.timeLeft).toBe(WORK_SECONDS)
    expect(result.current.sessionsCompleted).toBe(4)
    expect(result.current.currentTaskId).toBe('task-1')
  })
})

describe('usePomodoro › reset y linkTask', () => {
  it('reset detiene el temporizador y restaura el tiempo completo del modo', () => {
    const { result } = renderPomodoro()
    act(() => {
      result.current.linkTask('task-42')
    })
    act(() => {
      result.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.isRunning).toBe(false)
    expect(result.current.timeLeft).toBe(WORK_SECONDS)
    expect(result.current.mode).toBe('WORK')
    // Conserva la tarea enlazada
    expect(result.current.currentTaskId).toBe('task-42')

    // Y ya no sigue descontando
    act(() => {
      vi.advanceTimersByTime(10_000)
    })
    expect(result.current.timeLeft).toBe(WORK_SECONDS)
  })

  it('linkTask enlaza y desenlaza la tarea', () => {
    const { result } = renderPomodoro()

    act(() => {
      result.current.linkTask('abc')
    })
    expect(result.current.currentTaskId).toBe('abc')

    act(() => {
      result.current.linkTask(null)
    })
    expect(result.current.currentTaskId).toBeNull()
  })
})

describe('usePomodoro › regla de negocio nextPomodoroMode', () => {
  it('del WORK sale a SHORT_BREAK, salvo cada 4 sesiones que es LONG_BREAK', () => {
    expect(nextPomodoroMode('WORK', 1)).toBe('SHORT_BREAK')
    expect(nextPomodoroMode('WORK', 2)).toBe('SHORT_BREAK')
    expect(nextPomodoroMode('WORK', 3)).toBe('SHORT_BREAK')
    expect(nextPomodoroMode('WORK', 4)).toBe('LONG_BREAK')
    expect(nextPomodoroMode('WORK', 8)).toBe('LONG_BREAK')
  })

  it('cualquier descanso termina en WORK', () => {
    expect(nextPomodoroMode('SHORT_BREAK', 1)).toBe('WORK')
    expect(nextPomodoroMode('LONG_BREAK', 4)).toBe('WORK')
  })
})
