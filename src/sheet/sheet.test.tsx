import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../button/button'
import { Sheet } from './sheet'

describe('Sheet', () => {
  it('se nombra con el título que se ve, no con una prop aparte', async () => {
    const onClose = vi.fn()
    render(
      <Sheet open onClose={onClose}>
        <Sheet.Header><Sheet.Title>Nueva actividad</Sheet.Title></Sheet.Header>
        <Sheet.Body>contenido</Sheet.Body>
        <Sheet.Footer><Button>Guardar</Button></Sheet.Footer>
      </Sheet>,
    )
    expect(screen.getByRole('dialog', { name: 'Nueva actividad' })).toBeInTheDocument()
    expect(screen.getByText('contenido')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('sin título a la vista, el nombre sale de label', () => {
    render(<Sheet open onClose={() => {}} label="Filtros"><Sheet.Body>x</Sheet.Body></Sheet>)
    expect(screen.getByRole('dialog', { name: 'Filtros' })).toBeInTheDocument()
  })

  it('cerrado no monta nada', async () => {
    render(<Sheet open={false} onClose={() => {}}><p>hola</p></Sheet>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
