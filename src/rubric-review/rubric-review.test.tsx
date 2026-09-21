import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RubricReview, type Criterion, type Mark } from './rubric-review'

const criteria: Criterion[] = [
  {
    id: 'datos',
    icon: 'timer',
    label: 'Toma de datos',
    weight: 3,
    color: 'green',
    levels: ['Una sola medición', 'Las tres, sin el error', 'Las tres, con el error'],
  },
  {
    id: 'grafico',
    icon: 'analytics',
    label: 'Gráfico',
    weight: 1,
    color: 'teal',
    levels: ['Altura contra tiempo', 'Altura contra tiempo al cuadrado'],
  },
]

const amelia = { name: 'Amelia', assistant: true }

const corregida: Record<string, Mark> = {
  datos: {
    met: [true, true, undefined],
    note: { by: amelia, text: 'Están las tres, falta estimar el error.' },
  },
  grafico: { met: [true, true] },
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

  it('cada renglón dice si está cumplido, y no solo con el tilde', () => {
    arma()
    expect(screen.getByText('Las tres, sin el error').textContent).toContain('cumplido')
    expect(screen.getByText('Las tres, con el error').textContent).toContain('todavía no')
  })

  it('en qué anda cada aspecto se ve sin abrirlo', () => {
    arma()
    expect(screen.getByText('2 de 3')).toBeInTheDocument()
  })

  it('la cabecera dice cuánto falta corregir', () => {
    render(
      <RubricReview criteria={criteria} marks={{ datos: { met: [true, false, false] } }}>
        <RubricReview.Title>Cómo te fue</RubricReview.Title>
      </RubricReview>,
    )
    expect(screen.getByText('1 de 2 aspectos')).toBeInTheDocument()
  })

  it('corregida entera lo dice sin números', () => {
    arma()
    expect(screen.getByText('corregida')).toBeInTheDocument()
  })

  it('corrigiendo, cada renglón se marca con el tilde o con la cruz', async () => {
    const onMet = vi.fn()
    render(
      <RubricReview criteria={criteria} marks={corregida} onMet={onMet}>
        <RubricReview.Title>Cómo te fue</RubricReview.Title>
      </RubricReview>,
    )
    const fila = screen.getByRole('radiogroup', { name: 'Cómo quedó: Las tres, con el error' })
    await userEvent.click(within(fila).getByRole('radio', { name: 'Lo hizo' }))
    expect(onMet).toHaveBeenCalledWith('datos', 2, true)

    await userEvent.click(within(fila).getByRole('radio', { name: 'No lo hizo' }))
    expect(onMet).toHaveBeenCalledWith('datos', 2, false)
  })

  it('la cruz es del que corrige: quien entregó no la recibe', () => {
    render(
      <RubricReview criteria={criteria} marks={{ datos: { met: [true, false, undefined] } }}>
        <RubricReview.Title>Cómo te fue</RubricReview.Title>
      </RubricReview>,
    )
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(screen.getByText('Las tres, sin el error').textContent).toContain('todavía no')
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
    expect(screen.queryByLabelText('Comentario sobre Toma de datos')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Borrar el comentario de Toma de datos' }))
    expect(onClearNote).toHaveBeenCalledWith('datos')
  })

  it('el comentario se firma con quien está corrigiendo, sea persona o agente', async () => {
    const onNote = vi.fn()
    render(
      <RubricReview criteria={criteria} marks={corregida} by={amelia} onNote={onNote}>
        <RubricReview.Title>Cómo te fue</RubricReview.Title>
      </RubricReview>,
    )
    const campo = screen.getByLabelText('Comentario sobre Gráfico')
    const enviar = screen.getAllByRole('button', { name: 'Comentar' })[0]

    expect(enviar).toBeDisabled()
    await userEvent.type(campo, 'Sumá el cálculo del error')
    await userEvent.click(enviar)

    expect(onNote).toHaveBeenCalledWith('grafico', 'Sumá el cálculo del error')
    expect(screen.getAllByText('Amelia').length).toBeGreaterThan(0)
  })

  it('un agente se anuncia como asistente y no como alguien del curso', () => {
    arma()
    expect(screen.getByText('asistente')).toBeInTheDocument()
  })
})
