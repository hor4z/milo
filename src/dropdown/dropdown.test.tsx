import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../button/button'
import { Dropdown } from './dropdown'

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

  it('Escape cierra y el foco vuelve al disparador', async () => {
    render(
      <Dropdown
        items={[{ label: 'Salir', onSelect: () => {} }]}
        trigger={({ onClick, ref, ...r }) => <Button ref={ref} onClick={onClick} {...r}>Menú</Button>}
      />,
    )
    const trigger = screen.getByRole('button', { name: 'Menú' })
    await userEvent.click(trigger)
    expect(screen.getByText('Salir')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByText('Salir')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('elegir una opción cierra el menú', async () => {
    render(
      <Dropdown
        items={[{ label: 'Salir', onSelect: () => {} }]}
        trigger={({ onClick, ref, ...r }) => <Button ref={ref} onClick={onClick} {...r}>Menú</Button>}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Menú' }))
    await userEvent.click(screen.getByText('Salir'))
    expect(screen.queryByText('Salir')).not.toBeInTheDocument()
  })

  it('una opción apagada no corre su acción', async () => {
    const onSelect = vi.fn()
    render(
      <Dropdown
        items={[{ label: 'Borrar', onSelect, disabled: true }]}
        trigger={({ onClick, ref, ...r }) => <Button ref={ref} onClick={onClick} {...r}>Menú</Button>}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Menú' }))
    await userEvent.click(screen.getByText('Borrar'))
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('el disparador dice si está abierto', async () => {
    render(
      <Dropdown
        items={[{ label: 'Salir' }]}
        trigger={({ onClick, ref, ...r }) => <Button ref={ref} onClick={onClick} {...r}>Menú</Button>}
      />,
    )
    const trigger = screen.getByRole('button', { name: 'Menú' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })
})

describe('Dropdown · un item sin atajo no deja el hueco', () => {
  it('sin shortcut no dibuja un Kbd vacío', async () => {
    render(
      <Dropdown
        label="Cuenta"
        items={[{ label: 'Ajustes' }, { label: 'Cerrar sesión' }]}
        trigger={props => <button type="button" {...props}>Abrir</button>}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }))
    const menu = screen.getByRole('menu')
    expect(menu.querySelectorAll('kbd')).toHaveLength(0)
  })

  it('con shortcut sí lo dibuja', async () => {
    render(
      <Dropdown
        label="Cuenta"
        items={[{ label: 'Ajustes', shortcut: '⌘,' }]}
        trigger={props => <button type="button" {...props}>Abrir</button>}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }))
    expect(screen.getByText('⌘,')).toBeInTheDocument()
  })
})
