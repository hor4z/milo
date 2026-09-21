import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Rubric, type Criterion } from './rubric'

const criteria: Criterion[] = [
  {
    id: 'datos',
    label: 'Toma de datos',
    weight: 3,
    color: 'green',
    levels: ['Una sola medición', 'Las tres, sin el error', 'Las tres, con el error'],
  },
  {
    id: 'grafico',
    label: 'Gráfico',
    weight: 1,
    color: 'teal',
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
  it('el contador sale de los aspectos y no de una prop', () => {
    arma()
    expect(screen.getByText('2 aspectos')).toBeInTheDocument()
  })

  it('el porcentaje de cada aspecto sale de su peso, para quien no ve la barra', () => {
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

  it('sacar un aspecto avisa con el aspecto entero, no con su id', async () => {
    const { onRemove } = arma()
    await userEvent.click(screen.getByRole('button', { name: 'Sacar Gráfico de la rúbrica' }))
    expect(onRemove).toHaveBeenCalledWith(criteria[1])
  })

  it('el alta abre con el foco en el primer campo y Escape la cierra', async () => {
    arma()
    await userEvent.click(screen.getByRole('button', { name: 'Agregar aspecto' }))

    const campo = screen.getByLabelText('Qué vas a mirar')
    expect(campo).toHaveFocus()

    await userEvent.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: 'Agregar aspecto' })).toHaveFocus()
  })

  it('el alta devuelve lo escrito, y el renglón vacío queda dicho', async () => {
    const { onAdd } = arma()
    await userEvent.click(screen.getByRole('button', { name: 'Agregar aspecto' }))
    await userEvent.type(screen.getByLabelText('Qué vas a mirar'), 'Trabajo en equipo')
    await userEvent.type(screen.getByLabelText('Lo mínimo'), 'Trabajó solo')
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(onAdd).toHaveBeenCalledWith({
      label: 'Trabajo en equipo',
      weight: 3,
      levels: [
        'Trabajó solo',
        'Sin escribir: a mitad de camino',
        'Sin escribir: lo pedido',
        'Sin escribir: lo completo',
      ],
    })
  })

  it('sin nombre no agrega nada y el foco vuelve al campo', async () => {
    const { onAdd } = arma()
    await userEvent.click(screen.getByRole('button', { name: 'Agregar aspecto' }))
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(onAdd).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Qué vas a mirar')).toHaveFocus()
  })

  it('la barra es una sola parada de tabulación, y cada tramo dice cuánto vale', async () => {
    arma()
    const barra = screen.getByRole('toolbar', { name: 'Cuánto vale cada aspecto' })
    const tramos = within(barra).getAllByRole('button')

    expect(tramos.map(b => b.getAttribute('aria-label'))).toEqual([
      'Toma de datos, vale 75% de la nota',
      'Gráfico, vale 25% de la nota',
    ])
    expect(tramos.filter(b => b.tabIndex === 0)).toHaveLength(1)
  })

  it('el foco en un tramo separa a su aspecto de los demás', () => {
    arma()
    const barra = screen.getByRole('toolbar', { name: 'Cuánto vale cada aspecto' })
    const tramos = within(barra).getAllByRole('button')
    const tarjetas = () => screen.getAllByRole('listitem').filter(li => li.className.includes('criterion'))

    expect(tarjetas().filter(li => li.className.includes('criterionDim'))).toHaveLength(0)

    act(() => tramos[1].focus())
    const apagadas = tarjetas().filter(li => li.className.includes('criterionDim'))
    expect(apagadas).toHaveLength(1)
    expect(apagadas[0]).toHaveTextContent('Toma de datos')
  })

  it('al enfocar un tramo, su aspecto se trae a la vista', () => {
    arma()
    const barra = screen.getByRole('toolbar', { name: 'Cuánto vale cada aspecto' })
    const tarjeta = screen.getAllByRole('listitem')
      .filter(li => li.className.includes('criterion'))[1]
    tarjeta.scrollIntoView = vi.fn()

    act(() => within(barra).getAllByRole('button')[1].focus())
    expect(tarjeta.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' })
  })

  it('tocar un tramo con la rúbrica plegada la abre en ese aspecto', async () => {
    arma({ defaultOpen: false })
    const disparador = screen.getByRole('button', { name: 'Qué vamos a mirar' })
    expect(disparador).toHaveAttribute('aria-expanded', 'false')

    const barra = screen.getByRole('toolbar', { name: 'Cuánto vale cada aspecto' })
    await userEvent.click(within(barra).getAllByRole('button')[0])
    expect(disparador).toHaveAttribute('aria-expanded', 'true')
  })

  it('sin onAdd ni onRemove la rúbrica se lee y no se edita', () => {
    render(
      <Rubric criteria={criteria}>
        <Rubric.Title>Qué vamos a mirar</Rubric.Title>
      </Rubric>,
    )
    expect(screen.queryByRole('button', { name: 'Agregar aspecto' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Sacar/ })).not.toBeInTheDocument()
  })
})
