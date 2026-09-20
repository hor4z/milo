import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Menu } from './menu'

describe('Menu', () => {
  it('tiene nombre: con dos abiertos, "menú" y "menú" no se distinguen', () => {
    render(<Menu label="Acciones de la actividad"><Menu.Item>Editar</Menu.Item></Menu>)
    expect(screen.getByRole('menu', { name: 'Acciones de la actividad' })).toBeInTheDocument()
  })

  it('marca la opción elegida para un lector', () => {
    render(
      <Menu>
        <Menu.Label>Vista</Menu.Label>
        <Menu.Item checked>Grilla</Menu.Item>
        <Menu.Item checked={false}>Lista</Menu.Item>
      </Menu>,
    )
    expect(screen.getByRole('menuitemradio', { name: /Grilla/ })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('menuitemradio', { name: /Lista/ })).toHaveAttribute('aria-checked', 'false')
  })

  it('una opción sin estado es un menuitem común', () => {
    render(<Menu><Menu.Item>Salir</Menu.Item></Menu>)
    expect(screen.getByRole('menuitem', { name: 'Salir' })).toBeInTheDocument()
  })

  it('las flechas recorren el menú y dan la vuelta', async () => {
    render(
      <Menu>
        <Menu.Item>Duplicar</Menu.Item>
        <Menu.Item>Archivar</Menu.Item>
        <Menu.Item danger>Borrar</Menu.Item>
      </Menu>,
    )
    const [first, second, third] = screen.getAllByRole('menuitem')
    first.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(second).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    expect(first).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    expect(third).toHaveFocus()
  })

  it('Home y End van a los extremos', async () => {
    render(
      <Menu>
        <Menu.Item>Duplicar</Menu.Item>
        <Menu.Item>Archivar</Menu.Item>
        <Menu.Item>Borrar</Menu.Item>
      </Menu>,
    )
    const items = screen.getAllByRole('menuitem')
    items[1].focus()
    await userEvent.keyboard('{End}')
    expect(items[2]).toHaveFocus()
    await userEvent.keyboard('{Home}')
    expect(items[0]).toHaveFocus()
  })

  it('las flechas saltean lo apagado', async () => {
    render(
      <Menu>
        <Menu.Item>Duplicar</Menu.Item>
        <Menu.Item disabled>Archivar</Menu.Item>
        <Menu.Item>Borrar</Menu.Item>
      </Menu>,
    )
    const items = screen.getAllByRole('menuitem')
    items[0].focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(items[2]).toHaveFocus()
  })
})
