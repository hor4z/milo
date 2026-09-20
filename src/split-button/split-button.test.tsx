import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SplitButton } from './split-button'

const items = [
  { label: 'Publicar como borrador', onSelect: vi.fn() },
  { label: 'Programar', onSelect: vi.fn() },
]

describe('SplitButton', () => {
  it('la acción principal se toca directo, sin pasar por el menú', async () => {
    const onClick = vi.fn()
    render(<SplitButton label="Publicar" onClick={onClick} items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))
    expect(onClick).toHaveBeenCalled()
  })

  it('las dos mitades van juntas, en un grupo con nombre', () => {
    render(<SplitButton label="Publicar" items={items} />)
    expect(screen.getByRole('group', { name: 'Publicar' })).toBeInTheDocument()
  })

  it('la flecha dice que abre un menú, y lo abre', async () => {
    render(<SplitButton label="Publicar" items={items} />)
    const flecha = screen.getByRole('button', { name: 'Más opciones de Publicar' })
    expect(flecha).toHaveAttribute('aria-haspopup', 'menu')
    await userEvent.click(flecha)
    expect(screen.getByRole('menuitem', { name: 'Programar' })).toBeInTheDocument()
  })

  it('apagado apaga las dos mitades', () => {
    render(<SplitButton label="Publicar" items={items} disabled />)
    for (const b of screen.getAllByRole('button')) expect(b).toBeDisabled()
  })
})
