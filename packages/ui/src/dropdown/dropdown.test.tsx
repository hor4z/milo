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
    const disparador = screen.getByRole('button', { name: 'Menú' })
    await userEvent.click(disparador)
    expect(screen.getByText('Salir')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByText('Salir')).not.toBeInTheDocument()
    expect(disparador).toHaveFocus()
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
    const disparador = screen.getByRole('button', { name: 'Menú' })
    expect(disparador).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(disparador)
    expect(disparador).toHaveAttribute('aria-expanded', 'true')
  })
})
