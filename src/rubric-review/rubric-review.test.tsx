import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RubricReview, type Criterion, type Mark } from './rubric-review'

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

const amelia = { name: 'Amelia', assistant: true }

const corregida: Record<string, Mark> = {
  datos: {
    level: 1,
    note: { by: amelia, text: 'Están las tres, falta estimar el error.' },
  },
  grafico: { level: 1 },
}

const arma = (props: Record<string, unknown> = {}) =>
  render(
    <RubricReview criteria={criteria} marks={corregida} {...props}>
      <RubricReview.Title>Cómo te fue</RubricReview.Title>
    </RubricReview>,
  )

describe('RubricReview', () => {
  it('sin callbacks es la devolución: se lee y no se toca', () => {
    arma()
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByText('Están las tres, falta estimar el error.')).toBeInTheDocument()
  })

  it('el nivel en el que quedó se dice en texto, no solo con el tilde', () => {
    arma()
    expect(screen.getByText('Las tres, sin el error').textContent).toContain('es el nivel en el que quedó')
  })

  it('los niveles son excluyentes: los otros no dicen nada de más', () => {
    arma()
    expect(screen.getByText('Una sola medición').textContent).not.toContain('nivel en el que quedó')
    expect(screen.getByText('Las tres, con el error').textContent).not.toContain('nivel en el que quedó')
  })

  it('en qué nivel quedó cada aspecto se ve sin abrirlo', () => {
    render(
      <RubricReview criteria={[{ ...criteria[0], levels: ['a', 'b', 'c', 'd'] }]} marks={{ datos: { level: 2 } }}>
        <RubricReview.Title>Cómo te fue</RubricReview.Title>
      </RubricReview>,
    )
    expect(screen.getAllByText('Bueno').length).toBeGreaterThan(0)
  })

  it('sin cuatro renglones no hay nombre de nivel que poner, así que dice cuál es', () => {
    arma()
    expect(screen.getAllByText('nivel 2').length).toBeGreaterThan(0)
  })

  it('la cabecera dice cuánto falta corregir', () => {
    render(
      <RubricReview criteria={criteria} marks={{ datos: { level: 0 } }}>
        <RubricReview.Title>Cómo te fue</RubricReview.Title>
      </RubricReview>,
    )
    expect(screen.getByText('1 de 2 aspectos')).toBeInTheDocument()
  })

  it('un aspecto sin tocar lo dice, y no se lee como el nivel más bajo', () => {
    render(
      <RubricReview criteria={criteria} marks={{}}>
        <RubricReview.Title>Cómo te fue</RubricReview.Title>
      </RubricReview>,
    )
    expect(screen.getAllByText('sin corregir')).toHaveLength(2)
  })

  it('corregida entera lo dice sin números', () => {
    arma()
    expect(screen.getByText('corregida')).toBeInTheDocument()
  })

  it('corrigiendo, elegir un nivel devuelve el aspecto y el nivel', async () => {
    const onLevel = vi.fn()
    render(
      <RubricReview criteria={criteria} marks={corregida} onLevel={onLevel}>
        <RubricReview.Title>Cómo te fue</RubricReview.Title>
      </RubricReview>,
    )
    const grupo = screen.getByRole('radiogroup', { name: 'En qué nivel quedó Toma de datos' })
    await userEvent.click(within(grupo).getByRole('radio', { name: /Las tres, con el error/ }))
    expect(onLevel).toHaveBeenCalledWith('datos', 2)
  })

  it('solo uno queda tildado: son cuatro descripciones del mismo estado', async () => {
    const onLevel = vi.fn()
    render(
      <RubricReview criteria={criteria} marks={corregida} onLevel={onLevel}>
        <RubricReview.Title>Cómo te fue</RubricReview.Title>
      </RubricReview>,
    )
    const grupo = screen.getByRole('radiogroup', { name: 'En qué nivel quedó Toma de datos' })
    const marcados = within(grupo).getAllByRole('radio').filter(r => r.getAttribute('aria-checked') === 'true')
    expect(marcados).toHaveLength(1)
  })

  it('un comentario se borra y se escribe de nuevo: no se edita', async () => {
    const onClearNote = vi.fn()
    render(
      <RubricReview
        criteria={criteria}
        marks={corregida}
        by={amelia}
        onNote={vi.fn()}
        onClearNote={onClearNote}
      >
        <RubricReview.Title>Cómo te fue</RubricReview.Title>
      </RubricReview>,
    )
    expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Borrar el comentario de Toma de datos' }))
    expect(onClearNote).toHaveBeenCalledWith('datos')
  })

  it('el agente firma con texto y no solo con un glifo', () => {
    arma()
    expect(screen.getByText('Amelia')).toBeInTheDocument()
    expect(screen.getByText('asistente')).toBeInTheDocument()
  })
})
