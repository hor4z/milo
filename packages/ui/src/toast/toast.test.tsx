import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Button } from '../button/button'
import { ToastProvider, useToast } from './toast'

function Disparador({ duration }: { duration?: number }) {
  const { toast } = useToast()
  return <Button onClick={() => toast({ title: 'Guardado', body: 'Ya está', duration })}>Guardar</Button>
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

  it('useToast sin provider avisa', () => {
    const error = console.error
    console.error = () => {}
    expect(() => render(<Disparador />)).toThrow(/ToastProvider/)
    console.error = error
  })
})
