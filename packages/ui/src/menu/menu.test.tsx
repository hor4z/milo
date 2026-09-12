import { render, screen } from '@testing-library/react'
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
})
