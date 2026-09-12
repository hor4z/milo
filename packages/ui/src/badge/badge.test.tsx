import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './badge'

describe('Badge', () => {
  it('dice su estado con texto y no solo con color', () => {
    render(<Badge tone="ok" icon="check_circle">Corregida</Badge>)
    expect(screen.getByText('Corregida')).toBeInTheDocument()
  })

  it('el neutral es el default y no pinta de estado', () => {
    render(<Badge>Borrador</Badge>)
    expect(screen.getByText('Borrador').className).toContain('bg-muted')
  })

  it('el glifo no se lee: lo que se anuncia es el texto', () => {
    const { container } = render(<Badge tone="warn" icon="schedule">Vence mañana</Badge>)
    expect(container.querySelector('.ms-icon')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('Vence mañana')).toBeInTheDocument()
  })
})
