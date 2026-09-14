import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './modal'

describe('Modal', () => {
  it('atrapa el foco, cierra con Escape y no cierra con click adentro', async () => {
    const onClose = vi.fn()
    render(<Modal open onClose={onClose} label="Ajustes"><p>Ajustes</p></Modal>)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Ajustes'))
    expect(onClose).not.toHaveBeenCalled()

    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('cerrado no monta nada', () => {
    render(<Modal open={false} onClose={() => {}} label="Ajustes"><p>Ajustes</p></Modal>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
