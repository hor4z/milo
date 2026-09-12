import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Field } from '../field/field'
import { Slider } from './slider'

describe('Slider', () => {
  it('es un input de rango con su nombre y avisa el valor nuevo', () => {
    const onChange = vi.fn()
    render(<Slider value={40} onChange={onChange} label="Duración" />)
    const s = screen.getByRole('slider', { name: 'Duración' })
    expect(s).toHaveValue('40')
    fireEvent.change(s, { target: { value: '55' } })
    expect(onChange).toHaveBeenCalledWith(55)
  })

  it('el rango y el paso son los que se le pasan', () => {
    render(<Slider value={12} onChange={() => {}} min={12} max={40} step={2} label="Tamaño" />)
    const s = screen.getByRole('slider')
    expect(s).toHaveAttribute('min', '12')
    expect(s).toHaveAttribute('max', '40')
    expect(s).toHaveAttribute('step', '2')
  })

  it('adentro de un Field toma su id y su descripción', () => {
    render(
      <Field label="Duración" hint="En minutos">
        <Slider value={30} onChange={() => {}} />
      </Field>,
    )
    const s = screen.getByRole('slider', { name: 'Duración' })
    expect(s).toHaveAccessibleDescription('En minutos')
  })

  it('apagado no recibe cambios', () => {
    render(<Slider value={40} onChange={() => {}} label="Duración" disabled />)
    expect(screen.getByRole('slider')).toBeDisabled()
  })
})
