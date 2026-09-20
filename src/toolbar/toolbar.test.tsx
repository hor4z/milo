import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Toolbar } from './toolbar'

function Bar({ onBold = () => {} }) {
  return (
    <Toolbar label="Formato del texto">
      <Toolbar.Button icon="format_bold" label="Negrita" pressed onClick={onBold} />
      <Toolbar.Button icon="format_italic" label="Cursiva" pressed={false} />
      <Toolbar.Separator />
      <Toolbar.Button icon="link" label="Enlace" />
      <Toolbar.Button icon="delete" label="Borrar" disabled />
    </Toolbar>
  )
}

describe('Toolbar', () => {
  it('tiene nombre: dos barras sin nombre se leen como una sola', () => {
    render(<Bar />)
    expect(screen.getByRole('toolbar', { name: 'Formato del texto' })).toBeInTheDocument()
  })

  it('lo que se puede activar lo dice, y lo que solo pasa no finge estado', () => {
    render(<Bar />)
    expect(screen.getByRole('button', { name: 'Negrita' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Cursiva' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Enlace' })).not.toHaveAttribute('aria-pressed')
  })

  it('se puede entrar con Tab: hay una parada, y una sola', () => {
    render(<Bar />)
    const enabled = screen.getAllByRole('button').filter(b => !(b as HTMLButtonElement).disabled)
    expect(enabled.filter(b => b.tabIndex === 0)).toHaveLength(1)
    expect(enabled[0].tabIndex).toBe(0)
  })

  it('la parada se mueve con el foco: Tab devuelve al último que se tocó', async () => {
    render(<Bar />)
    const link = screen.getByRole('button', { name: 'Enlace' })
    link.focus()
    expect(link.tabIndex).toBe(0)
    expect(screen.getByRole('button', { name: 'Negrita' }).tabIndex).toBe(-1)
  })

  it('es una sola parada de tabulación y adentro se mueve con flechas', async () => {
    render(<Bar />)
    const bold = screen.getByRole('button', { name: 'Negrita' })
    bold.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Cursiva' })).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(bold).toHaveFocus()
  })

  it('las flechas saltean lo apagado y dan la vuelta', async () => {
    render(<Bar />)
    screen.getByRole('button', { name: 'Enlace' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Negrita' })).toHaveFocus()
  })

  it('Home y End van a los extremos', async () => {
    render(<Bar />)
    screen.getByRole('button', { name: 'Cursiva' }).focus()
    await userEvent.keyboard('{End}')
    expect(screen.getByRole('button', { name: 'Enlace' })).toHaveFocus()
    await userEvent.keyboard('{Home}')
    expect(screen.getByRole('button', { name: 'Negrita' })).toHaveFocus()
  })

  it('el botón hace lo suyo', async () => {
    const onBold = vi.fn()
    render(<Bar onBold={onBold} />)
    await userEvent.click(screen.getByRole('button', { name: 'Negrita' }))
    expect(onBold).toHaveBeenCalled()
  })
})
