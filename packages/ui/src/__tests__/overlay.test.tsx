import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../primitives'
import { Dropdown, Modal, Popover, Tooltip } from '../overlay'

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

describe('Dropdown', () => {
  it('corre la acción de la opción elegida', async () => {
    const onSelect = vi.fn()
    render(
      <Dropdown
        items={[{ label: 'Salir', onSelect }]}
        trigger={({ onClick, ref, ...r }) => <Button ref={ref} onClick={onClick} {...r}>Menú</Button>}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Menú' }))
    await userEvent.click(screen.getByText('Salir'))
    expect(onSelect).toHaveBeenCalled()
  })
})

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

describe('Tooltip', () => {
  it('aparece con el foco de teclado y lo describe', async () => {
    render(<Tooltip label="Buscar en todo"><button>Buscar</button></Tooltip>)
    await userEvent.tab()
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Buscar en todo'))
    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby')
  })

  it('se va al salir el foco', async () => {
    render(<><Tooltip label="Ayuda"><button>Uno</button></Tooltip><button>Dos</button></>)
    await userEvent.tab()
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument())
    await userEvent.tab()
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  })
})
