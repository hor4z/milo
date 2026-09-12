import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Field } from '../field/field'
import { Switch } from './switch'

describe('Switch', () => {
  it('alterna y expone su estado', async () => {
    const onChange = vi.fn()
    render(<Switch checked={false} onChange={onChange} label="Oscuro" />)
    const sw = screen.getByRole('switch', { name: 'Oscuro' })
    expect(sw).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(sw)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('la barra de espacio lo prende, que es lo que hace un botón', async () => {
    const onChange = vi.fn()
    render(<Switch checked={false} onChange={onChange} label="Oscuro" />)
    screen.getByRole('switch').focus()
    await userEvent.keyboard(' ')
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('apagado no se toca', async () => {
    const onChange = vi.fn()
    render(<Switch checked onChange={onChange} label="Oscuro" disabled />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('adentro de un Field toma su id y se nombra con la etiqueta', () => {
    render(
      <Field label="Entregas fuera de fecha" hint="Después del cierre">
        <Switch checked onChange={() => {}} />
      </Field>,
    )
    const sw = screen.getByRole('switch', { name: 'Entregas fuera de fecha' })
    expect(sw).toHaveAccessibleDescription('Después del cierre')
  })

  it('adentro de un form no manda el form', async () => {
    const enviar = vi.fn(e => e.preventDefault())
    render(
      <form onSubmit={enviar}>
        <Switch checked={false} onChange={() => {}} label="Oscuro" />
      </form>,
    )
    await userEvent.click(screen.getByRole('switch'))
    expect(enviar).not.toHaveBeenCalled()
  })
})
