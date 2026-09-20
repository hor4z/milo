import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Rubric, type Criterion } from './rubric'

const criteria: Criterion[] = [
  {
    id: 'datos',
    label: 'Toma de datos',
    weight: 3,
    color: 'green',
    icon: 'timer',
    levels: ['Una sola medición', 'Las tres, sin el error', 'Las tres, con el error'],
  },
  {
    id: 'grafico',
    label: 'Gráfico',
    weight: 1,
    color: 'teal',
    icon: 'analytics',
    levels: ['Altura contra tiempo', 'Altura contra tiempo al cuadrado'],
  },
]

const arma = (props: Record<string, unknown> = {}) => {
  const onAdd = vi.fn()
  const onRemove = vi.fn()
  render(
    <Rubric criteria={criteria} onAdd={onAdd} onRemove={onRemove} {...props}>
      <Rubric.Title>Qué vamos a mirar</Rubric.Title>
    </Rubric>,
  )
  return { onAdd, onRemove }
}

describe('Rubric', () => {
  it('el contador sale de los criterios y no de una prop', () => {
    arma()
    expect(screen.getByText('2 criterios')).toBeInTheDocument()
  })

  it('el porcentaje de cada criterio sale de su peso, para quien no ve la barra', () => {
    arma()
    expect(screen.getByText(', vale 75% de la nota')).toBeInTheDocument()
    expect(screen.getByText(', vale 25% de la nota')).toBeInTheDocument()
  })

  it('la cabecera pliega el cuerpo, y plegado no junta foco', async () => {
    arma()
    const disparador = screen.getByRole('button', { name: 'Qué vamos a mirar' })
    expect(disparador).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(disparador)
    expect(disparador).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById(disparador.getAttribute('aria-controls')!))
      .toHaveAttribute('inert')
  })

  it('sacar un criterio avisa con el criterio entero, no con su id', async () => {
    const { onRemove } = arma()
    await userEvent.click(screen.getByRole('button', { name: 'Sacar Gráfico de la rúbrica' }))
    expect(onRemove).toHaveBeenCalledWith(criteria[1])
  })

  it('el alta abre con el foco en el primer campo y Escape la cierra', async () => {
    arma()
    await userEvent.click(screen.getByRole('button', { name: 'Agregar criterio' }))

    const campo = screen.getByLabelText('Qué vas a mirar')
    expect(campo).toHaveFocus()

    await userEvent.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: 'Agregar criterio' })).toHaveFocus()
  })

  it('el alta devuelve lo escrito, y el nivel vacío queda dicho', async () => {
    const { onAdd } = arma()
    await userEvent.click(screen.getByRole('button', { name: 'Agregar criterio' }))
    await userEvent.type(screen.getByLabelText('Qué vas a mirar'), 'Trabajo en equipo')
    await userEvent.type(screen.getByLabelText('Nivel 1'), 'Trabajó solo')
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(onAdd).toHaveBeenCalledWith({
      label: 'Trabajo en equipo',
      weight: 3,
      levels: [
        'Trabajó solo',
        'Sin descriptor para el nivel 2',
        'Sin descriptor para el nivel 3',
        'Sin descriptor para el nivel 4',
      ],
    })
  })

  it('sin nombre no agrega nada y el foco vuelve al campo', async () => {
    const { onAdd } = arma()
    await userEvent.click(screen.getByRole('button', { name: 'Agregar criterio' }))
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(onAdd).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Qué vas a mirar')).toHaveFocus()
  })

  it('sin onAdd ni onRemove la rúbrica se lee y no se edita', () => {
    render(
      <Rubric criteria={criteria}>
        <Rubric.Title>Qué vamos a mirar</Rubric.Title>
      </Rubric>,
    )
    expect(screen.queryByRole('button', { name: 'Agregar criterio' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Sacar/ })).not.toBeInTheDocument()
  })
})
