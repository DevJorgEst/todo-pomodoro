import { describe, expect, it } from 'vitest'
import { computeTimeLeft, formatTime } from '../pomodoro'
describe('computeTimeLeft', () => {
  it('descuenta los segundos transcurridos desde el ancla', () => {
    const anchor = { startedAt: 1_000_000, secondsAtStart: 1500 }
    expect(computeTimeLeft(anchor, 1_003_000)).toBe(1497)
  })
  it('redondea hacia abajo los segundos incompletos', () => {
    const anchor = { startedAt: 1_000_000, secondsAtStart: 1500 }
    expect(computeTimeLeft(anchor, 1_000_999)).toBe(1500)
    expect(computeTimeLeft(anchor, 1_001_001)).toBe(1499)
  })
  it('nunca devuelve valores negativos', () => {
    const anchor = { startedAt: 1_000_000, secondsAtStart: 1500 }
    // 2000 s transcurridos sobre un ciclo de 1500 s: se queda en 0
    expect(computeTimeLeft(anchor, 3_000_000)).toBe(0)
  })
})
describe('formatTime', () => {
  it('formatea como contador digital MM:SS con relleno de ceros', () => {
    expect(formatTime(1500)).toBe('25:00')
    expect(formatTime(900)).toBe('15:00')
    expect(formatTime(305)).toBe('05:05')
    expect(formatTime(59)).toBe('00:59')
    expect(formatTime(0)).toBe('00:00')
  })
})
