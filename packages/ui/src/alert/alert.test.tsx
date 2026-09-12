import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Alert, AlertActions, AlertBody, AlertTitle } from './alert'
import { Button } from '../button/button'

describe('Alert', () => {
  it('se compone con título, cuerpo y acciones', () => {
    render(
      <Alert tone="bad">
        <AlertTitle>No se pudo guardar</AlertTitle>
        <AlertBody>Revisá la conexión.</AlertBody>
        <AlertActions><Button size="sm">Reintentar</Button></AlertActions>
      </Alert>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo guardar')
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument()
  })

  it('un aviso que no es error no interrumpe: va como status', () => {
    render(<Alert tone="ok"><AlertTitle>Listo</AlertTitle></Alert>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('se puede descartar', async () => {
    const onDismiss = vi.fn()
    render(<Alert onDismiss={onDismiss}><AlertTitle>Hola</AlertTitle></Alert>)
    await userEvent.click(screen.getByRole('button', { name: 'Descartar' }))
    expect(onDismiss).toHaveBeenCalled()
  })
})
