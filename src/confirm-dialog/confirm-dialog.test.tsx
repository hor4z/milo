import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  ConfirmDialog, ConfirmDialogBody, ConfirmDialogCancel, ConfirmDialogConfirm,
  ConfirmDialogFooter, ConfirmDialogHeader, ConfirmDialogTitle,
} from './confirm-dialog'

function Borrar({ onCancel, onConfirm, tone = 'bad' }: {
  onCancel?: () => void
  onConfirm?: () => void
  tone?: 'neutral' | 'bad'
}) {
  return (
    <ConfirmDialog open onCancel={onCancel ?? (() => {})} onConfirm={onConfirm ?? (() => {})} tone={tone}>
      <ConfirmDialogHeader>
        <ConfirmDialogTitle>¿Borrar "Fracciones equivalentes"?</ConfirmDialogTitle>
      </ConfirmDialogHeader>
      <ConfirmDialogBody>Se borran también las 18 entregas.</ConfirmDialogBody>
      <ConfirmDialogFooter>
        <ConfirmDialogCancel />
        <ConfirmDialogConfirm>{tone === 'bad' ? 'Borrar' : 'Publicar'}</ConfirmDialogConfirm>
      </ConfirmDialogFooter>
    </ConfirmDialog>
  )
}

describe('ConfirmDialog', () => {
  it('pregunta, confirma y cancela', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(<Borrar onCancel={onCancel} onConfirm={onConfirm} />)
    expect(screen.getByRole('alertdialog', { name: /Fracciones equivalentes/ })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Borrar' }))
    expect(onConfirm).toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('el nombre sale del título, no de una prop aparte', () => {
    render(<Borrar />)
    const caja = screen.getByRole('alertdialog')
    const id = caja.getAttribute('aria-labelledby')
    expect(id).toBeTruthy()
    expect(document.getElementById(id!)).toHaveTextContent('Fracciones equivalentes')
  })

  it('Escape cancela', async () => {
    const onCancel = vi.fn()
    render(<Borrar onCancel={onCancel} />)
    await userEvent.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalled()
  })
})

describe('ConfirmDialog destructivo', () => {
  it('arranca con el foco en la salida segura', async () => {
    render(<Borrar />)
    await waitFor(() => expect(document.activeElement).toHaveTextContent('Cancelar'))
  })

  it('sin peligro arranca en el que confirma', async () => {
    render(<Borrar tone="neutral" />)
    await waitFor(() => expect(document.activeElement).toHaveTextContent('Publicar'))
  })
})
