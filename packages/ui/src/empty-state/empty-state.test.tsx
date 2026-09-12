import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  it('lleva su salida y el icono no se anuncia', () => {
    render(<EmptyState icon="inbox" title="Nada acá" body="Todavía no llegó nada." action={<button>Crear</button>} />)
    expect(screen.getByText('Nada acá')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Crear' })).toBeInTheDocument()
  })

  it('el chico no lleva la caja punteada y el grande sí', () => {
    const { container, rerender } = render(<EmptyState title="Nada" body="Nada acá" size="sm" />)
    expect((container.firstChild as HTMLElement).className).not.toContain('border-dashed')
    rerender(<EmptyState title="Nada" body="Nada acá" />)
    expect((container.firstChild as HTMLElement).className).toContain('border-dashed')
  })

  it('el título y el cuerpo se leen los dos', () => {
    render(<EmptyState title="Nada acá" body="Todavía no llegó nada." />)
    expect(screen.getByText('Nada acá')).toBeInTheDocument()
    expect(screen.getByText('Todavía no llegó nada.')).toBeInTheDocument()
  })
})
