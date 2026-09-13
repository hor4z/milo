import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TaskList } from './task-list'

const pasos = [
  { id: 'leer', label: 'Leer la consigna', done: true },
  { id: 'resolver', label: 'Resolver los tres ejercicios' },
  { id: 'revisar', label: 'Revisar antes de entregar' },
]

describe('TaskList', () => {
  it('es una lista con nombre: «lista, tres elementos» no dice de qué', () => {
    render(<TaskList items={pasos} onToggle={() => {}} label="Pasos de la entrega" />)
    expect(screen.getByRole('list', { name: 'Pasos de la entrega' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('cada casilla se nombra con su propio texto', () => {
    render(<TaskList items={pasos} onToggle={() => {}} label="Pasos" />)
    expect(screen.getByRole('checkbox', { name: 'Resolver los tres ejercicios' })).toBeInTheDocument()
  })

  it('marcar devuelve el id y si quedó hecha', async () => {
    const onToggle = vi.fn()
    render(<TaskList items={pasos} onToggle={onToggle} label="Pasos" />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Revisar antes de entregar' }))
    expect(onToggle).toHaveBeenCalledWith('revisar', true)
  })

  it('desmarcar también, y devuelve false', async () => {
    const onToggle = vi.fn()
    render(<TaskList items={pasos} onToggle={onToggle} label="Pasos" />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Leer la consigna' }))
    expect(onToggle).toHaveBeenCalledWith('leer', false)
  })

  it('el texto también es zona de click, que es la mitad del área útil', async () => {
    const onToggle = vi.fn()
    render(<TaskList items={pasos} onToggle={onToggle} label="Pasos" />)
    await userEvent.click(screen.getByText('Resolver los tres ejercicios'))
    expect(onToggle).toHaveBeenCalledWith('resolver', true)
  })

  it('apagada se lee y no se toca', async () => {
    const onToggle = vi.fn()
    render(<TaskList items={pasos} onToggle={onToggle} label="Pasos" readOnly />)
    expect(screen.getByRole('checkbox', { name: 'Leer la consigna' })).toBeDisabled()
    await userEvent.click(screen.getByText('Resolver los tres ejercicios'))
    expect(onToggle).not.toHaveBeenCalled()
  })
})
