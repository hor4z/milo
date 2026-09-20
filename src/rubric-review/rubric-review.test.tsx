import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RubricReview, type Criterion, type Mark } from './rubric-review'

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

const amelia = { name: 'Amelia', assistant: true }

const corregida: Record<string, Mark> = {
  datos: {
    level: 1,
    notes: [{ id: 'n1', by: amelia, text: 'Están las tres, falta estimar el error.' }],
  },
  grafico: { level: 1 },
}

const arma = (props: Record<string, unknown> = {}) => {
  const onMark = vi.fn()
  const onNote = vi.fn()
  render(
    <RubricReview criteria={criteria} marks={corregida} {...props}>
      <RubricReview.Title>Cómo te fue</RubricReview.Title>
    </RubricReview>,
  )
  return { onMark, onNote }
}

describe('RubricReview', () => {
  it('sin callbacks es la devolución: se lee y no se toca', () => {
    arma()
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByText('Están las tres, falta estimar el error.')).toBeInTheDocument()
  })

  it('el nivel marcado dice que es el actual, y no solo con el color', () => {
    arma()
    const marcado = screen.getByText('Las tres, sin el error')
    expect(marcado).toHaveAttribute('aria-current', 'true')
  })

  it('dice qué sigue, que es lo que el estudiante puede hacer con esto', () => {
    arma()
    expect(screen.getByText(/Para el que sigue: las tres, con el error/)).toBeInTheDocument()
  })

  it('la cabecera dice cuánto falta corregir', () => {
    render(
      <RubricReview criteria={criteria} marks={{ datos: { level: 0 } }}>
        <RubricReview.Title>Cómo te fue</RubricReview.Title>
      </RubricReview>,
    )
    expect(screen.getByText('1 de 2 aspectos')).toBeInTheDocument()
  })

  it('corregida entera lo dice sin números', () => {
    arma()
    expect(screen.getByText('corregida')).toBeInTheDocument()
  })

  it('con onMark los niveles se eligen, y avisa cuál', async () => {
    const onMark = vi.fn()
    render(
      <RubricReview criteria={criteria} marks={corregida} onMark={onMark}>
        <RubricReview.Title>Cómo te fue</RubricReview.Title>
      </RubricReview>,
    )
    await userEvent.click(screen.getByRole('radio', { name: 'Las tres, con el error' }))
    expect(onMark).toHaveBeenCalledWith('datos', 2)
  })

  it('el comentario se firma con quien está corrigiendo, sea persona o agente', async () => {
    const onNote = vi.fn()
    render(
      <RubricReview criteria={criteria} marks={corregida} by={amelia} onNote={onNote}>
        <RubricReview.Title>Cómo te fue</RubricReview.Title>
      </RubricReview>,
    )
    const campo = screen.getByLabelText('Comentario sobre Toma de datos')
    const enviar = screen.getAllByRole('button', { name: 'Comentar' })[0]

    expect(enviar).toBeDisabled()
    await userEvent.type(campo, 'Sumá el cálculo del error')
    await userEvent.click(enviar)

    expect(onNote).toHaveBeenCalledWith('datos', 'Sumá el cálculo del error')
    expect(screen.getAllByText('Amelia').length).toBeGreaterThan(0)
  })

  it('un agente se anuncia como asistente y no como alguien del curso', () => {
    arma()
    expect(screen.getByText('asistente')).toBeInTheDocument()
  })
})
