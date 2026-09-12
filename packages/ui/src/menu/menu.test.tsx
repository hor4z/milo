import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Menu, MenuItem, MenuLabel } from './menu'

describe('Menu', () => {
  it('marca la opción elegida para un lector', () => {
    render(
      <Menu>
        <MenuLabel>Vista</MenuLabel>
        <MenuItem checked>Grilla</MenuItem>
        <MenuItem checked={false}>Lista</MenuItem>
      </Menu>,
    )
    expect(screen.getByRole('menuitemradio', { name: /Grilla/ })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('menuitemradio', { name: /Lista/ })).toHaveAttribute('aria-checked', 'false')
  })

  it('una opción sin estado es un menuitem común', () => {
    render(<Menu><MenuItem>Salir</MenuItem></Menu>)
    expect(screen.getByRole('menuitem', { name: 'Salir' })).toBeInTheDocument()
  })

  it('las flechas recorren el menú y dan la vuelta', async () => {
    render(
      <Menu>
        <MenuItem>Duplicar</MenuItem>
        <MenuItem>Archivar</MenuItem>
        <MenuItem danger>Borrar</MenuItem>
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
        <MenuItem>Duplicar</MenuItem>
        <MenuItem>Archivar</MenuItem>
        <MenuItem>Borrar</MenuItem>
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
        <MenuItem>Duplicar</MenuItem>
        <MenuItem disabled>Archivar</MenuItem>
        <MenuItem>Borrar</MenuItem>
      </Menu>,
    )
    const items = screen.getAllByRole('menuitem')
    items[0].focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(items[2]).toHaveFocus()
  })
})
