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

describe('Sheet', () => {
  it('abre, se nombra y cierra con Escape', async () => {
    const onClose = vi.fn()
    const { Sheet, SheetHeader, SheetBody, SheetFooter } = await import('../overlay')
    render(
      <Sheet open onClose={onClose} label="Nueva actividad">
        <SheetHeader title="Nueva actividad" onClose={onClose} />
        <SheetBody>contenido</SheetBody>
        <SheetFooter><Button>Guardar</Button></SheetFooter>
      </Sheet>,
    )
    expect(screen.getByRole('dialog', { name: 'Nueva actividad' })).toBeInTheDocument()
    expect(screen.getByText('contenido')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('cerrado no monta nada', async () => {
    const { Sheet } = await import('../overlay')
    render(<Sheet open={false} onClose={() => {}} label="x"><p>hola</p></Sheet>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('ConfirmDialog', () => {
  it('pregunta, confirma y cancela', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const { ConfirmDialog } = await import('../overlay')
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
    const { ConfirmDialog } = await import('../overlay')
    render(<ConfirmDialog open onCancel={onCancel} onConfirm={() => {}} title="¿Seguro?" />)
    await userEvent.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalled()
  })
})

describe('ConfirmDialog destructivo', () => {
  it('arranca con el foco en la salida segura', async () => {
    const { ConfirmDialog } = await import('../overlay')
    render(
      <ConfirmDialog open onCancel={() => {}} onConfirm={() => {}} title="¿Borrar?" confirmLabel="Borrar" tone="bad" />,
    )
    await waitFor(() => expect(document.activeElement).toHaveTextContent('Cancelar'))
  })

  it('sin peligro arranca en el que confirma', async () => {
    const { ConfirmDialog } = await import('../overlay')
    render(<ConfirmDialog open onCancel={() => {}} onConfirm={() => {}} title="¿Publicar?" confirmLabel="Publicar" />)
    await waitFor(() => expect(document.activeElement).toHaveTextContent('Publicar'))
  })
})
