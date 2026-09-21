import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NumberAnswer } from './number-answer'

const Cuenta = (props: Partial<Parameters<typeof NumberAnswer>[0]> = {}) => (
  <NumberAnswer value="" onChange={() => {}} unit="dB" {...props}>
    <NumberAnswer.Prompt>El promedio del patio</NumberAnswer.Prompt>
  </NumberAnswer>
)

describe('NumberAnswer', () => {
  it('el enunciado nombra al campo', () => {
    render(<Cuenta />)
    expect(screen.getByRole('textbox', { name: 'El promedio del patio' })).toBeInTheDocument()
  })

  it('la unidad va al lado del campo y no adentro del número', async () => {
    const onChange = vi.fn()
    render(<Cuenta onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), '7')
    expect(onChange).toHaveBeenCalledWith('7')
    expect(screen.getByText('dB')).toBeInTheDocument()
  })

  it('sin revelar no corrige: tener la respuesta no es mostrarla', () => {
    render(<Cuenta value="70" expected={72.3} tolerance={0.2} />)
    expect(screen.queryByText(/margen/)).not.toBeInTheDocument()
  })

  it('adentro del margen cuenta como bien, que es para lo que existe el margen', () => {
    render(<Cuenta value="72,4" expected={72.3} tolerance={0.2} revealed />)
    expect(screen.getByText('Cae adentro del margen')).toBeInTheDocument()
  })

  it('afuera del margen dice cuál era, en texto y no solo en color', () => {
    render(<Cuenta value="70" expected={72.3} tolerance={0.2} revealed />)
    expect(screen.getByText('Da 72,3 dB, con 0,2 de margen')).toBeInTheDocument()
  })

  it('el número va escrito como se escribe acá, con coma y no con punto', () => {
    render(<Cuenta value="70" expected={72.3} revealed />)
    expect(screen.getByText('Da 72,3 dB')).toBeInTheDocument()
  })

  it('sin margen la respuesta es exacta', () => {
    render(<Cuenta value="21" expected={22} revealed />)
    expect(screen.getByText('Da 22 dB')).toBeInTheDocument()
  })

  it('corregida no se vuelve a responder, pero sigue legible: es el momento en que se compara', () => {
    render(<Cuenta value="70" expected={72.3} revealed />)
    const campo = screen.getByRole('textbox')
    expect(campo).toHaveAttribute('readonly')
    expect(campo).not.toBeDisabled()
  })

  it('el valor que muestra es el mismo contra el que compara, sin redondearlo', () => {
    render(<Cuenta value="72,4" expected={72.35} revealed />)
    expect(screen.getByText('Da 72,35 dB')).toBeInTheDocument()
  })

  it('la línea de apoyo es opcional y no deja el hueco cuando no está', () => {
    const { container } = render(<Cuenta />)
    expect(container.querySelectorAll('p')).toHaveLength(1)
  })
})
