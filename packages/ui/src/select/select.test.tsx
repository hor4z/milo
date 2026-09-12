import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Select } from './select'

describe('Select', () => {
  it('abre, elige con el teclado y cierra con Escape', async () => {
    const onChange = vi.fn()
    render(<Select value="Uno" onChange={onChange} options={['Uno', 'Dos', 'Tres']} />)
    const trigger = screen.getByRole('button', { name: /Uno/ })

    await userEvent.click(trigger)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenCalledWith('Dos')
  })

  it('con loading no abre', async () => {
    render(<Select value="Cargando" loading options={[]} />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('muestra el leading que le pasan', () => {
    render(<Select value="x" options={['x']} leading={<span data-testid="leading" />} />)
    expect(screen.getByTestId('leading')).toBeInTheDocument()
  })
})
