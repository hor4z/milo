import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
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
})
