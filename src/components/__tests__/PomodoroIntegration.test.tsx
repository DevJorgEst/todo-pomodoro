import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import App from '../../App'

type User = Awaited<ReturnType<typeof userEvent.setup>>

const NEUTRAL_TASK_MESSAGE = 'Elige una tarea para empezar a cronometrar'

beforeEach(() => {
  // useTodos persiste en localStorage: aísla cada test
  window.localStorage.clear()
})

async function addTask(user: User, title: string): Promise<void> {
  await user.type(screen.getByRole('textbox', { name: 'Nueva tarea' }), title)
  await user.click(screen.getByRole('button', { name: 'Añadir' }))
}

function getTimerRegion(): HTMLElement {
  return screen.getByRole('region', { name: 'Temporizador Pomodoro' })
}

/**
 * El botón de enlace usa `aria-label` propio (anula el texto visible), así que
 * el nombre accesible es el mismo en estado inactivo y activo.
 */
function getTaskAction(title: string): HTMLElement {
  return screen.getByRole('button', {
    name: `Establecer "${title}" como tarea activa del Pomodoro`,
  })
}

describe('integración App: ToDo + Pomodoro', () => {
  it('crea una tarea, la enlaza y el temporizador pasa a "Enfocado en: …"', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Estado inicial: contador de trabajo y mensaje neutral
    expect(screen.getByRole('timer')).toHaveTextContent('25:00')
    expect(screen.getByText(NEUTRAL_TASK_MESSAGE)).toBeInTheDocument()

    // 1. Crear la tarea escribiendo y pulsando "Añadir"
    await addTask(user, 'Preparar la demo')

    expect(
      screen.getByRole('checkbox', {
        name: 'Marcar "Preparar la demo" como completada',
      }),
    ).toBeInTheDocument()
    // Todavía sin enlazar: el mensaje neutral persiste
    expect(screen.getByText(NEUTRAL_TASK_MESSAGE)).toBeInTheDocument()

    // 2. Enlazarla con el Pomodoro
    await user.click(getTaskAction('Preparar la demo'))

    // 3. El temporizador refleja el enlace de inmediato
    const timer = getTimerRegion()
    expect(within(timer).getByText(/^Enfocado en:/)).toBeInTheDocument()
    expect(within(timer).getByText('Preparar la demo')).toBeInTheDocument()
    expect(screen.queryByText(NEUTRAL_TASK_MESSAGE)).not.toBeInTheDocument()

    // Y el botón de la tarea queda como activo (aria-pressed)
    expect(getTaskAction('Preparar la demo')).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('volver a pulsar el botón de la tarea activa desenlaza el Pomodoro', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTask(user, 'Llamar al dentista')
    await user.click(getTaskAction('Llamar al dentista'))
    expect(
      within(getTimerRegion()).getByText('Llamar al dentista'),
    ).toBeInTheDocument()

    await user.click(getTaskAction('Llamar al dentista'))

    expect(screen.getByText(NEUTRAL_TASK_MESSAGE)).toBeInTheDocument()
    expect(getTaskAction('Llamar al dentista')).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('completar la tarea enlazada no rompe el enlace con el temporizador', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTask(user, 'Enviar el informe')
    await user.click(getTaskAction('Enviar el informe'))

    // Marcar como completada desde la lista
    await user.click(
      screen.getByRole('checkbox', {
        name: 'Marcar "Enviar el informe" como completada',
      }),
    )

    // El checkbox refleja el estado…
    expect(
      screen.getByRole('checkbox', {
        name: 'Marcar "Enviar el informe" como pendiente',
      }),
    ).toBeChecked()

    // …el título se tacha en la lista…
    const list = screen.getByRole('list')
    expect(within(list).getByText('Enviar el informe')).toHaveClass(
      'line-through',
    )

    // …las estadísticas se actualizan…
    expect(screen.getByText('¡Todo completado! 🎉')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Limpiar completadas/ }),
    ).toBeInTheDocument()

    // …y el Pomodoro sigue enfocado en la misma tarea
    expect(
      within(getTimerRegion()).getByText('Enviar el informe'),
    ).toBeInTheDocument()
  })

  it('eliminar la tarea enlazada limpia el enlace del temporizador', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTask(user, 'Tarea efímera')
    await user.click(getTaskAction('Tarea efímera'))

    await user.click(
      screen.getByRole('button', { name: 'Eliminar tarea "Tarea efímera"' }),
    )

    // Sin rastro de la tarea ni en la lista ni en el temporizador
    expect(screen.queryByText('Tarea efímera')).not.toBeInTheDocument()
    expect(screen.getByText(NEUTRAL_TASK_MESSAGE)).toBeInTheDocument()
    expect(screen.getByText(/No hay tareas todas/)).toBeInTheDocument()
  })

  it('el selector de modo manual cambia el temporizador y su aspecto', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Aspecto cálido (WORK) por defecto
    expect(getTimerRegion()).toHaveClass('border-red-300')

    await user.click(screen.getByRole('button', { name: 'Descanso corto' }))

    expect(screen.getByRole('timer')).toHaveTextContent('05:00')
    expect(getTimerRegion()).toHaveClass('border-emerald-300')
    expect(
      screen.getByRole('button', { name: 'Descanso corto' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Trabajo' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
