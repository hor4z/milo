import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Stepper } from './stepper'

const poner = (props = {}) => {
  const onChange = vi.fn()
  render(<Stepper value={5} onChange={onChange} label="Intentos" {...props} />)
  return { onChange }
}

describe('Stepper', () => {
  it('es un `spinbutton` que dice dónde está y hasta dónde llega', () => {
    poner({ min: 1, max: 10 })
    const campo = screen.getByRole('spinbutton', { name: 'Intentos' })
    expect(campo).toHaveAttribute('aria-valuenow', '5')
    expect(campo).toHaveAttribute('aria-valuemin', '1')
    expect(campo).toHaveAttribute('aria-valuemax', '10')
  })

  it('los botones suben y bajan de a un paso', async () => {
    const { onChange } = poner()
    await userEvent.click(screen.getByRole('button', { name: 'Subir Intentos' }))
    expect(onChange).toHaveBeenCalledWith(6)
    await userEvent.click(screen.getByRole('button', { name: 'Bajar Intentos' }))
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('las flechas hacen lo mismo sin tocar los botones', async () => {
    const { onChange } = poner()
    screen.getByRole('spinbutton').focus()
    await userEvent.keyboard('{ArrowUp}')
    expect(onChange).toHaveBeenCalledWith(6)
    await userEvent.keyboard('{ArrowDown}')
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('Re Pág y Av Pág van de a diez, para no apretar veinte veces', async () => {
    const { onChange } = poner({ max: 99 })
    screen.getByRole('spinbutton').focus()
    await userEvent.keyboard('{PageUp}')
    expect(onChange).toHaveBeenCalledWith(15)
  })

  it('Inicio y Fin van a los extremos', async () => {
    const { onChange } = poner({ min: 1, max: 10 })
    screen.getByRole('spinbutton').focus()
    await userEvent.keyboard('{Home}')
    expect(onChange).toHaveBeenCalledWith(1)
    await userEvent.keyboard('{End}')
    expect(onChange).toHaveBeenCalledWith(10)
  })

  it('no se sale del rango ni escribiendo', async () => {
    const { onChange } = poner({ min: 1, max: 10 })
    const campo = screen.getByRole('spinbutton')
    await userEvent.clear(campo)
    await userEvent.type(campo, '40')
    expect(onChange).toHaveBeenLastCalledWith(10)
  })

  it('en el tope, el botón de ese lado se apaga', () => {
    poner({ value: 10, min: 1, max: 10 })
    expect(screen.getByRole('button', { name: 'Subir Intentos' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Bajar Intentos' })).not.toBeDisabled()
  })

  it('los botones no son paradas de tabulación: el campo del medio ya lo hace todo', () => {
    poner()
    for (const b of screen.getAllByRole('button')) expect(b).toHaveAttribute('tabindex', '-1')
  })

  it('lo que quedó a medio escribir vuelve al último número bueno', async () => {
    poner()
    const campo = screen.getByRole('spinbutton')
    await userEvent.clear(campo)
    expect(campo).toHaveValue('')
    await userEvent.tab()
    expect(campo).toHaveValue('5')
  })

  it('el sufijo se lee con el número y no aparte', () => {
    poner({ suffix: 'min' })
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-valuetext', '5 min')
  })
})
