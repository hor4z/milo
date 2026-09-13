import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Button } from '../button/button'
import { Popover } from './popover'

describe('Popover', () => {
  it('abre, cierra con Escape y devuelve el foco', async () => {
    render(
      <Popover trigger={({ onClick, ref, ...r }) => <Button ref={ref} onClick={onClick} {...r}>Abrir</Button>}>
        {() => <div>Contenido</div>}
      </Popover>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }))
    expect(screen.getByText('Contenido')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByText('Contenido')).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'Abrir' })).toHaveFocus()
  })

  it('al cerrar con el foco adentro, el foco vuelve al disparador', async () => {
    render(
      <Popover trigger={({ onClick, ref, ...r }) => <Button ref={ref} onClick={onClick} {...r}>Insertar</Button>}>
        {close => <button type="button" onClick={close}>Elegir</button>}
      </Popover>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Insertar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Elegir' }))
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Elegir' })).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'Insertar' })).toHaveFocus()
  })

  it('al cerrar tocando afuera no le mueve el foco a nadie', async () => {
    render(
      <>
        <input aria-label="Otro campo" />
        <Popover trigger={({ onClick, ref, ...r }) => <Button ref={ref} onClick={onClick} {...r}>Abrir</Button>}>
          {() => <div>Contenido</div>}
        </Popover>
      </>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }))
    await userEvent.click(screen.getByRole('textbox', { name: 'Otro campo' }))
    await waitFor(() => expect(screen.queryByText('Contenido')).not.toBeInTheDocument())
    expect(screen.getByRole('textbox', { name: 'Otro campo' })).toHaveFocus()
  })

  it('cierra al apuntar afuera', async () => {
    render(
      <Popover trigger={({ onClick, ref, ...r }) => <Button ref={ref} onClick={onClick} {...r}>Abrir</Button>}>
        {() => <div>Contenido</div>}
      </Popover>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }))
    await userEvent.click(document.body)
    await waitFor(() => expect(screen.queryByText('Contenido')).not.toBeInTheDocument())
  })
})
