import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { Reorder, type ReorderItem } from './reorder'

const inicial: ReorderItem[] = [
  { id: 'a', label: 'Título' },
  { id: 'b', label: 'Consigna' },
  { id: 'c', label: 'Tareas' },
]

function Vivo({ onReorder }: { onReorder?: (x: ReorderItem[]) => void }) {
  const [items, setItems] = useState(inicial)
  return (
    <Reorder
      items={items}
      label="Bloques"
      onReorder={x => { setItems(x); onReorder?.(x) }}
    >
      {item => <span>{item.label}</span>}
    </Reorder>
  )
}

const orden = () => screen.getAllByRole('listitem').map(li => li.textContent?.replace(/^.*?(Título|Consigna|Tareas)/, '$1'))

describe('Reorder', () => {
  it('la lista tiene nombre y cada manija dice qué mueve y dónde está', () => {
    render(<Vivo />)
    expect(screen.getByRole('list', { name: 'Bloques' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mover Consigna, posición 2 de 3' })).toBeInTheDocument()
  })

  it('las flechas mueven de lugar', async () => {
    render(<Vivo />)
    screen.getByRole('button', { name: /Mover Título/ }).focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(orden()).toEqual(['Consigna', 'Título', 'Tareas'])
    await userEvent.keyboard('{ArrowUp}')
    expect(orden()).toEqual(['Título', 'Consigna', 'Tareas'])
  })

  it('en los extremos no se sale de la lista', async () => {
    const onReorder = vi.fn()
    render(<Vivo onReorder={onReorder} />)
    screen.getByRole('button', { name: /Mover Título/ }).focus()
    await userEvent.keyboard('{ArrowUp}')
    expect(onReorder).not.toHaveBeenCalled()
    expect(orden()).toEqual(['Título', 'Consigna', 'Tareas'])
  })

  it('el foco sigue a la fila que se movió', async () => {
    render(<Vivo />)
    screen.getByRole('button', { name: /Mover Título/ }).focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: 'Mover Título, posición 2 de 3' })).toHaveFocus()
  })

  it('el cambio se anuncia, porque la pantalla cambió sola', async () => {
    render(<Vivo />)
    screen.getByRole('button', { name: /Mover Tareas/ }).focus()
    await userEvent.keyboard('{ArrowUp}')
    expect(await screen.findByText('Tareas, posición 2 de 3')).toBeInTheDocument()
  })

  it('la manija dice con qué teclas se mueve', () => {
    render(<Vivo />)
    const manija = screen.getByRole('button', { name: /Mover Título/ })
    const ayuda = document.getElementById(manija.getAttribute('aria-describedby')!)
    expect(ayuda?.textContent).toMatch(/flechas/i)
  })

  it('una lista de uno no ofrece moverlo a ningún lado', async () => {
    const onReorder = vi.fn()
    render(
      <Reorder items={[{ id: 'a', label: 'Solo' }]} label="Uno" onReorder={onReorder}>
        {item => <span>{item.label}</span>}
      </Reorder>,
    )
    screen.getByRole('button', { name: /Mover Solo/ }).focus()
    await userEvent.keyboard('{ArrowDown}{ArrowUp}')
    expect(onReorder).not.toHaveBeenCalled()
  })

  it('una lista vacía no rompe', () => {
    render(<Reorder items={[]} label="Nada" onReorder={() => {}}>{() => null}</Reorder>)
    expect(screen.getByRole('list', { name: 'Nada' })).toBeEmptyDOMElement()
  })
})
