import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './modal'

function Ajustes({ onClose }: { onClose?: () => void }) {
  return (
    <Modal open onClose={onClose ?? (() => {})}>
      <Modal.Header><Modal.Title>Ajustes</Modal.Title></Modal.Header>
      <Modal.Body><p>El cuerpo</p></Modal.Body>
      <Modal.Footer><button type="button">Guardar</button></Modal.Footer>
    </Modal>
  )
}

describe('Modal', () => {
  it('atrapa el foco, cierra con Escape y no cierra con click adentro', async () => {
    const onClose = vi.fn()
    render(<Ajustes onClose={onClose} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await userEvent.click(screen.getByText('El cuerpo'))
    expect(onClose).not.toHaveBeenCalled()

    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('el nombre sale del título, no de una prop aparte', () => {
    render(<Ajustes />)
    const caja = screen.getByRole('dialog')
    const id = caja.getAttribute('aria-labelledby')
    expect(id).toBeTruthy()
    expect(document.getElementById(id!)).toHaveTextContent('Ajustes')
    expect(screen.getByRole('dialog', { name: 'Ajustes' })).toBeInTheDocument()
  })

  it('la X del header cierra', async () => {
    const onClose = vi.fn()
    render(<Ajustes onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('sin título, el nombre lo pone label', () => {
    render(
      <Modal open onClose={() => {}} label="Ajustes">
        <Modal.Body>Sin cabecera</Modal.Body>
      </Modal>,
    )
    expect(screen.getByRole('dialog', { name: 'Ajustes' })).toBeInTheDocument()
  })

  it('cerrado no monta nada', () => {
    render(
      <Modal open={false} onClose={() => {}} label="Ajustes">
        <Modal.Body>Ajustes</Modal.Body>
      </Modal>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
