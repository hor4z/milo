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

  it('tocar la caja enfoca el campo, que es lo que promete el cursor', async () => {
    const { container } = render(<TextField icon="search" placeholder="Buscar" />)
    const box = container.querySelector('.field') as HTMLElement
    await userEvent.click(box)
    expect(screen.getByPlaceholderText('Buscar')).toHaveFocus()
  })

  it('tocar lo que hay adentro no le roba el foco al que lo recibe', async () => {
    const onClick = vi.fn()
    render(
      <TextField
        placeholder="Buscar"
        suffix={<button type="button" onClick={onClick}>Limpiar</button>}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar' }))
    expect(onClick).toHaveBeenCalledOnce()
    expect(screen.getByPlaceholderText('Buscar')).not.toHaveFocus()
  })
})
