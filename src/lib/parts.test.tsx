import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Field } from '../field/field'
import { TextField } from '../text-field/text-field'

describe('la separación de partes', () => {
  it('encuentra una parte adentro de un fragment', () => {
    render(
      <Field>
        <>
          <Field.Label>Nombre</Field.Label>
          <Field.Hint>Lo ven los estudiantes</Field.Hint>
        </>
        <TextField />
      </Field>,
    )
    expect(screen.getByRole('textbox', { name: 'Nombre' })).toBeInTheDocument()
    expect(screen.getByText('Lo ven los estudiantes')).toBeInTheDocument()
  })

  it('encuentra una parte que vino de un map', () => {
    render(
      <Field>
        {['Nombre'].map(n => <Field.Label key={n}>{n}</Field.Label>)}
        <TextField />
      </Field>,
    )
    expect(screen.getByRole('textbox', { name: 'Nombre' })).toBeInTheDocument()
  })

  it('una parte vacía cuenta como ausente', () => {
    const { container } = render(
      <Field>
        <Field.Label>Nombre</Field.Label>
        <Field.Hint>{undefined}</Field.Hint>
        <TextField />
      </Field>,
    )
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby')
    expect(container.querySelectorAll('p')).toHaveLength(0)
  })

  it('lo que no es una parte se queda donde estaba', () => {
    render(
      <Field>
        <Field.Label>Nombre</Field.Label>
        <TextField />
        <span>algo más</span>
      </Field>,
    )
    expect(screen.getByText('algo más')).toBeInTheDocument()
  })
})
