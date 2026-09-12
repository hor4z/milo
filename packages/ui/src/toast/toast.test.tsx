import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../button/button'
import { ToastProvider, useToast } from './toast'

function Disparador({ duration }: { duration?: number }) {
  const { toast } = useToast()
  return <Button onClick={() => toast({ title: 'Guardado', body: 'Ya está', duration })}>Guardar</Button>
}

function ConSalida({ onUndo, duration = 0 }: { onUndo: () => void; duration?: number }) {
  const { toast } = useToast()
  return (
    <Button onClick={() => toast({ title: 'Se archivó', action: { label: 'Deshacer', onClick: onUndo }, duration })}>
      Archivar
    </Button>
  )
}

describe('Toast', () => {
  it('aparece al pedirlo y se anuncia', async () => {
    render(<ToastProvider><Disparador duration={0} /></ToastProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(screen.getByRole('list', { name: 'Avisos' })).toHaveTextContent('Guardado')
  })

  it('se va solo cuando tiene duración', async () => {
    render(<ToastProvider><Disparador duration={60} /></ToastProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(screen.getByText('Guardado')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Guardado')).not.toBeInTheDocument(), { timeout: 2000 })
  })

  it('se cierra a mano', async () => {
    render(<ToastProvider><Disparador duration={0} /></ToastProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar el aviso' }))
    await waitFor(() => expect(screen.queryByText('Guardado')).not.toBeInTheDocument())
  })

  it('no apila más de los que entran', async () => {
    render(<ToastProvider max={2}><Disparador duration={0} /></ToastProvider>)
    const b = screen.getByRole('button', { name: 'Guardar' })
    await userEvent.click(b)
    await userEvent.click(b)
    await userEvent.click(b)
    expect(screen.getAllByText('Guardado')).toHaveLength(2)
  })

  it('la acción corre y se lleva el aviso', async () => {
    const deshacer = vi.fn()
    render(<ToastProvider><ConSalida onUndo={deshacer} /></ToastProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Archivar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Deshacer' }))
    expect(deshacer).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByText('Se archivó')).not.toBeInTheDocument())
  })

  it('el reloj se pausa mientras algo adentro tiene el foco', async () => {
    const deshacer = vi.fn()
    render(<ToastProvider><ConSalida onUndo={deshacer} duration={120} /></ToastProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Archivar' }))
    const salida = screen.getByRole('button', { name: 'Deshacer' })
    salida.focus()
    await new Promise(r => setTimeout(r, 400))
    expect(screen.getByText('Se archivó')).toBeInTheDocument()
    salida.blur()
    await waitFor(() => expect(screen.queryByText('Se archivó')).not.toBeInTheDocument(), { timeout: 2000 })
  })

  it('useToast sin provider avisa', () => {
    const error = console.error
    console.error = () => {}
    expect(() => render(<Disparador />)).toThrow(/ToastProvider/)
    console.error = error
  })
})
