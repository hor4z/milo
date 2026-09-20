import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SplitButton } from './split-button'

const arma = (props: Record<string, unknown> = {}, onSelect = vi.fn(), onClick = vi.fn()) => {
  render(
    <SplitButton {...props}>
      <SplitButton.Action onClick={onClick}>Publicar</SplitButton.Action>
      <SplitButton.Item icon="draft">Guardar como borrador</SplitButton.Item>
      <SplitButton.Item onSelect={onSelect}>Programar</SplitButton.Item>
    </SplitButton>,
  )
  return { onSelect, onClick }
}

describe('SplitButton', () => {
  it('la acción principal se toca directo, sin pasar por el menú', async () => {
    const { onClick } = arma()
    await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))
    expect(onClick).toHaveBeenCalled()
  })

  it('las dos mitades van juntas, en un grupo con el nombre de la acción', () => {
    arma()
    expect(screen.getByRole('group', { name: 'Publicar' })).toBeInTheDocument()
  })

  it('la flecha dice que abre un menú, y lo abre', async () => {
    arma()
    const flecha = screen.getByRole('button', { name: 'Más opciones de Publicar' })
    expect(flecha).toHaveAttribute('aria-haspopup', 'menu')
    await userEvent.click(flecha)
    expect(screen.getByRole('menuitem', { name: 'Programar' })).toBeInTheDocument()
  })

  it('elegir una opción la ejecuta y cierra el menú', async () => {
    const { onSelect } = arma()
    await userEvent.click(screen.getByRole('button', { name: 'Más opciones de Publicar' }))
    await userEvent.click(screen.getByRole('menuitem', { name: 'Programar' }))
    expect(onSelect).toHaveBeenCalled()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('apagado apaga las dos mitades', () => {
    arma({ disabled: true })
    for (const b of screen.getAllByRole('button')) expect(b).toBeDisabled()
  })
})
