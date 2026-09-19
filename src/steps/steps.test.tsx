import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Steps } from './steps'

const stages = [
  { label: 'Empatizar', hint: 'Escuchar a quien tiene el problema' },
  { label: 'Definir' },
  { label: 'Idear' },
  { label: 'Prototipar' },
]

describe('Steps', () => {
  it('es una lista ordenada con nombre', () => {
    render(<Steps steps={stages} current={1} label="Etapas del proyecto" />)
    expect(screen.getByRole('list', { name: 'Etapas del proyecto' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('la etapa en curso se marca con `aria-current`, y una sola', () => {
    render(<Steps steps={stages} current={1} label="Etapas" />)
    const marked = screen.getAllByRole('listitem').filter(li => li.getAttribute('aria-current') === 'step')
    expect(marked).toHaveLength(1)
    expect(marked[0]).toHaveTextContent('Definir')
  })

  it('el estado de cada etapa se dice con palabras y no solo con color', () => {
    render(<Steps steps={stages} current={1} label="Etapas" />)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('hecha')
    expect(items[1]).toHaveTextContent('en curso')
    expect(items[2]).toHaveTextContent('pendiente')
  })

  it('sin `onSelect` no hay nada que tocar: es un indicador', () => {
    render(<Steps steps={stages} current={1} label="Etapas" />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('con `onSelect` cada etapa es un botón y devuelve su índice', async () => {
    const onSelect = vi.fn()
    render(<Steps steps={stages} current={1} label="Etapas" onSelect={onSelect} />)
    expect(screen.getAllByRole('button')).toHaveLength(4)
    await userEvent.click(screen.getAllByRole('button')[2])
    expect(onSelect).toHaveBeenCalledWith(2)
  })

  it('la primera etapa no cuelga una línea hacia atrás', () => {
    const { container } = render(<Steps steps={stages} current={0} label="Etapas" />)
    const first = container.querySelectorAll('li')[0]
    expect(first.querySelector('[aria-hidden]')).toBeNull()
  })
})
