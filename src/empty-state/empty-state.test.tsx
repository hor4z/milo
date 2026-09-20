import { render, screen } from '@testing-library/react'
import s from './empty-state.module.css'
import { describe, expect, it } from 'vitest'
import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  it('lleva su salida y el icono no se anuncia', () => {
    render(
      <EmptyState icon="inbox">
        <EmptyState.Title>Nada acá</EmptyState.Title>
        <EmptyState.Body>Todavía no llegó nada.</EmptyState.Body>
        <EmptyState.Action><button>Crear</button></EmptyState.Action>
      </EmptyState>,
    )
    expect(screen.getByText('Nada acá')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Crear' })).toBeInTheDocument()
  })

  it('el chico no lleva la caja punteada y el grande sí', () => {
    const { container, rerender } = render(<EmptyState size="sm" >
  <EmptyState.Title>Nada</EmptyState.Title>
  <EmptyState.Body>Nada acá</EmptyState.Body>
</EmptyState>)
    expect((container.firstChild as HTMLElement).className).not.toContain(s.bordered)
    rerender(<EmptyState >
  <EmptyState.Title>Nada</EmptyState.Title>
  <EmptyState.Body>Nada acá</EmptyState.Body>
</EmptyState>)
    expect((container.firstChild as HTMLElement).className).toContain(s.bordered)
  })

  it('el título y el cuerpo se leen los dos', () => {
    render(<EmptyState >
  <EmptyState.Title>Nada acá</EmptyState.Title>
  <EmptyState.Body>Todavía no llegó nada.</EmptyState.Body>
</EmptyState>)
    expect(screen.getByText('Nada acá')).toBeInTheDocument()
    expect(screen.getByText('Todavía no llegó nada.')).toBeInTheDocument()
  })
})
