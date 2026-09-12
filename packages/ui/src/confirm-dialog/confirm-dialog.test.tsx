import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './confirm-dialog'

describe('ConfirmDialog', () => {
  it('pregunta, confirma y cancela', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        open
        onCancel={onCancel}
        onConfirm={onConfirm}
        title="¿Borrar «Fracciones equivalentes»?"
        body="Se borran también las 18 entregas."
        confirmLabel="Borrar"
        tone="bad"
      />,
    )
    expect(screen.getByRole('alertdialog', { name: /Fracciones equivalentes/ })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Borrar' }))
    expect(onConfirm).toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('Escape cancela', async () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog open onCancel={onCancel} onConfirm={() => {}} title="¿Seguro?" />)
    await userEvent.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalled()
  })
})

describe('ConfirmDialog destructivo', () => {
  it('arranca con el foco en la salida segura', async () => {
    render(
      <ConfirmDialog open onCancel={() => {}} onConfirm={() => {}} title="¿Borrar?" confirmLabel="Borrar" tone="bad" />,
    )
    await waitFor(() => expect(document.activeElement).toHaveTextContent('Cancelar'))
  })

  it('sin peligro arranca en el que confirma', async () => {
    render(<ConfirmDialog open onCancel={() => {}} onConfirm={() => {}} title="¿Publicar?" confirmLabel="Publicar" />)
    await waitFor(() => expect(document.activeElement).toHaveTextContent('Publicar'))
  })
})
