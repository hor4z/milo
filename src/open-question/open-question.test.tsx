import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OpenQuestion } from './open-question'

const Pregunta = (props: Partial<Parameters<typeof OpenQuestion>[0]> = {}) => (
  <OpenQuestion value="" onChange={() => {}} {...props}>
    <OpenQuestion.Prompt>¿Por qué ese y no otro?</OpenQuestion.Prompt>
  </OpenQuestion>
)

describe('OpenQuestion', () => {
  it('el enunciado nombra al campo: sin eso un lector dice "cuadro de texto" y nada más', () => {
    render(<Pregunta />)
    expect(screen.getByRole('textbox', { name: '¿Por qué ese y no otro?' })).toBeInTheDocument()
  })

  it('devuelve el texto y no el evento', async () => {
    const onChange = vi.fn()
    render(<Pregunta onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'a')
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('el tope no es una sorpresa: el campo avisa cuando queda poco', async () => {
    render(<Pregunta value={'x'.repeat(235)} maxLength={240} />)
    expect(screen.getAllByText('te quedan 5').length).toBeGreaterThan(0)
  })

  it('de solo lectura se lee y no se escribe', () => {
    render(<Pregunta value="Porque ahí se junta todo el curso" readOnly />)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByText('Porque ahí se junta todo el curso')).toBeInTheDocument()
  })

  it('sin onChange también se lee: una consigna cerrada no necesita pasar readOnly', () => {
    render(
      <OpenQuestion value="Algo escrito">
        <OpenQuestion.Prompt>¿Por qué?</OpenQuestion.Prompt>
      </OpenQuestion>,
    )
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('una entrega vacía lo dice, porque una caja en blanco no se distingue de un campo sin usar', () => {
    render(<Pregunta value="   " readOnly />)
    expect(screen.getByText('Sin responder')).toBeInTheDocument()
  })

  it('la línea de apoyo es opcional y no deja el hueco cuando no está', () => {
    const { container } = render(<Pregunta />)
    expect(container.querySelectorAll('p')).toHaveLength(1)
  })
})
