import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../button/button'
import { Sheet, SheetBody, SheetFooter, SheetHeader } from './sheet'

describe('Sheet', () => {
  it('abre, se nombra y cierra con Escape', async () => {
    const onClose = vi.fn()
    render(
      <Sheet open onClose={onClose} label="Nueva actividad">
        <SheetHeader title="Nueva actividad" onClose={onClose} />
        <SheetBody>contenido</SheetBody>
        <SheetFooter><Button>Guardar</Button></SheetFooter>
      </Sheet>,
    )
    expect(screen.getByRole('dialog', { name: 'Nueva actividad' })).toBeInTheDocument()
    expect(screen.getByText('contenido')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('cerrado no monta nada', async () => {
    render(<Sheet open={false} onClose={() => {}} label="x"><p>hola</p></Sheet>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
