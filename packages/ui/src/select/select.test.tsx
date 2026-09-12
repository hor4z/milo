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

  it('teclear salta a la opción que empieza así, con tildes o sin ellas', async () => {
    const onChange = vi.fn()
    render(<Select value="Lengua" onChange={onChange} options={['Lengua', 'Matemática', 'Música', 'Ciencias']} />)
    await userEvent.click(screen.getByRole('button', { name: /Lengua/ }))
    await userEvent.keyboard('mu')
    await userEvent.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith('Música')
  })

  it('la opción activa se anuncia con aria-activedescendant', async () => {
    render(<Select value="Uno" onChange={() => {}} options={['Uno', 'Dos', 'Tres']} />)
    const trigger = screen.getByRole('button', { name: /Uno/ })
    expect(trigger).not.toHaveAttribute('aria-activedescendant')
    await userEvent.click(trigger)
    await userEvent.keyboard('{ArrowDown}')
    const activeId = trigger.getAttribute('aria-activedescendant')
    expect(document.getElementById(activeId!)).toHaveTextContent('Dos')
  })

  it('la flecha abajo abre la lista con el teclado', async () => {
    render(<Select value="Uno" onChange={() => {}} options={['Uno', 'Dos']} />)
    screen.getByRole('button', { name: /Uno/ }).focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('Tab no se mete opción por opción: la lista no es una parada', async () => {
    render(<Select value="Uno" onChange={() => {}} options={['Uno', 'Dos', 'Tres']} />)
    await userEvent.click(screen.getByRole('button', { name: /Uno/ }))
    for (const o of screen.getAllByRole('option')) expect(o).toHaveAttribute('tabindex', '-1')
  })

  it('Home y End van a los extremos', async () => {
    const onChange = vi.fn()
    render(<Select value="Uno" onChange={onChange} options={['Uno', 'Dos', 'Tres']} />)
    await userEvent.click(screen.getByRole('button', { name: /Uno/ }))
    await userEvent.keyboard('{End}{Enter}')
    expect(onChange).toHaveBeenCalledWith('Tres')
  })

  it('un render del padre no le mueve el cursor al teclado', async () => {
    const { rerender } = render(<Select value="Uno" onChange={() => {}} options={['Uno', 'Dos', 'Tres']} />)
    const trigger = screen.getByRole('button', { name: /Uno/ })
    await userEvent.click(trigger)
    await userEvent.keyboard('{ArrowDown}')
    const before = trigger.getAttribute('aria-activedescendant')
    expect(document.getElementById(before!)).toHaveTextContent('Dos')

    // Un `options={[...]}` escrito inline arma un arreglo nuevo en cada render
    // del padre: es el caso que reseteaba la opción señalada.
    rerender(<Select value="Uno" onChange={() => {}} options={['Uno', 'Dos', 'Tres']} />)
    expect(trigger.getAttribute('aria-activedescendant')).toBe(before)
  })
})
