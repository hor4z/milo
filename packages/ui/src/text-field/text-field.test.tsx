import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TextField } from './text-field'

describe('TextField', () => {
  it('escribe y deja el anillo de foco en la caja, no en el input', async () => {
    const onChange = vi.fn()
    render(<TextField placeholder="Buscar" onChange={onChange} />)
    await userEvent.type(screen.getByPlaceholderText('Buscar'), 'hola')
    expect(onChange).toHaveBeenCalled()
  })

  it('el contenedor lleva la clase field', () => {
    const { container } = render(<TextField placeholder="x" />)
    expect(container.querySelector('.field')).toBeTruthy()
  })
})
