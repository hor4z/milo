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
