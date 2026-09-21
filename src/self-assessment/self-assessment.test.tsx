import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SelfAssessment, type Criterion } from './self-assessment'

const criteria: Criterion[] = [
  {
    id: 'idea',
    label: 'La idea',
    weight: 3,
    color: 'green',
    levels: ['Poco clara', 'Se entiende qué vende', 'Clara y posible', 'Clara, posible y propia'],
  },
  {
    id: 'cuentas',
    label: 'Las cuentas',
    weight: 5,
    color: 'blue',
    levels: ['No logra resolverlas', 'Resuelve algunas', 'Resuelve bien', 'Resuelve todo'],
  },
]

const arma = (props: Record<string, unknown> = {}) => {
  const onChange = vi.fn()
  render(
    <SelfAssessment criteria={criteria} value={{}} onChange={onChange} {...props}>
      <SelfAssessment.Title>Dónde estás</SelfAssessment.Title>
    </SelfAssessment>,
  )
  return { onChange }
}

describe('SelfAssessment', () => {
  it('dice qué falta y no cuánto va: lo que sirve es el pendiente', () => {
    arma()
    expect(screen.getByText('2 aspectos')).toBeInTheDocument()
  })

  it('con todos ubicados lo dice sin números', () => {
    arma({ value: { idea: 2, cuentas: 0 } })
    expect(screen.getByText('Los ubicaste todos')).toBeInTheDocument()
  })

  it('el plural sale bien con uno solo', () => {
    arma({ value: { idea: 2 } })
    expect(screen.getByText('1 aspecto')).toBeInTheDocument()
  })

  it('plegado, cada aspecto dice en cuál quedó', () => {
    arma({ value: { idea: 2 } })
    const cerrado = screen.getByRole('button', { name: 'Las cuentas' })
    const abierto = screen.getByRole('button', { name: 'La idea' })
    expect(abierto).toHaveTextContent('Bueno')
    expect(cerrado).toHaveTextContent('sin ubicar')
  })

  it('los niveles son un grupo de opción única, nombrado con el aspecto', () => {
    arma()
    expect(screen.getByRole('radiogroup', { name: 'La idea' })).toBeInTheDocument()
  })

  it('elegir devuelve el aspecto y el nivel', async () => {
    const { onChange } = arma()
    const grupo = screen.getByRole('radiogroup', { name: 'La idea' })
    await userEvent.click(within(grupo).getByRole('radio', { name: /Clara y posible/ }))
    expect(onChange).toHaveBeenCalledWith('idea', 2)
  })

  it('solo uno queda marcado: son cuatro descripciones del mismo estado', () => {
    arma({ value: { idea: 2 } })
    const grupo = screen.getByRole('radiogroup', { name: 'La idea' })
    const marcados = within(grupo).getAllByRole('radio').filter(r => r.getAttribute('aria-checked') === 'true')
    expect(marcados).toHaveLength(1)
  })

  it('una sola abierta por vez: la rúbrica se lee de arriba abajo', async () => {
    arma()
    expect(screen.queryByRole('radiogroup', { name: 'Las cuentas' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Las cuentas' }))
    expect(screen.getByRole('radiogroup', { name: 'Las cuentas' })).toBeInTheDocument()
    expect(screen.queryByRole('radiogroup', { name: 'La idea' })).not.toBeInTheDocument()
  })

  it('sin cuatro renglones no hay nombre de nivel que poner, así que dice cuál es', () => {
    render(
      <SelfAssessment criteria={[{ ...criteria[0], levels: ['a', 'b', 'c'] }]} value={{ idea: 1 }} onChange={() => {}}>
        <SelfAssessment.Title>Dónde estás</SelfAssessment.Title>
      </SelfAssessment>,
    )
    expect(screen.getByText('nivel 2')).toBeInTheDocument()
  })
})
