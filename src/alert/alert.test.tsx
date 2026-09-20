import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Alert } from './alert'
import { Button } from '../button/button'

describe('Alert', () => {
  it('se compone con título, cuerpo y acciones', () => {
    render(
      <Alert tone="bad">
        <Alert.Title>No se pudo guardar</Alert.Title>
        <Alert.Body>Revisá la conexión.</Alert.Body>
        <Alert.Actions><Button size="sm">Reintentar</Button></Alert.Actions>
      </Alert>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo guardar')
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument()
  })

  it('un aviso que no es error no interrumpe: va como status', () => {
    render(<Alert tone="ok"><Alert.Title>Listo</Alert.Title></Alert>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('se puede descartar', async () => {
    const onDismiss = vi.fn()
    render(<Alert onDismiss={onDismiss}><Alert.Title>Hola</Alert.Title></Alert>)
    await userEvent.click(screen.getByRole('button', { name: 'Descartar' }))
    expect(onDismiss).toHaveBeenCalled()
  })
})
