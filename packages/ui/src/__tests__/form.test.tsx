import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Field, FieldSet } from '../form'
import { TextField, Textarea } from '../primitives'

describe('Field', () => {
  it('la etiqueta enfoca el campo al clickearla', async () => {
    render(<Field label="Nombre de la actividad"><TextField /></Field>)
    await userEvent.click(screen.getByText('Nombre de la actividad'))
    expect(document.activeElement).toBe(screen.getByRole('textbox'))
  })

  it('el campo queda nombrado por su etiqueta', () => {
    render(<Field label="Consigna"><Textarea /></Field>)
    expect(screen.getByRole('textbox', { name: 'Consigna' })).toBeInTheDocument()
  })

  it('la ayuda queda atada al campo', () => {
    render(<Field label="Nombre" hint="Lo ven los estudiantes"><TextField /></Field>)
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Lo ven los estudiantes')
  })

  it('el error marca el campo y reemplaza a la ayuda', () => {
    render(<Field label="Nombre" hint="Lo ven los estudiantes" error="Poné un nombre"><TextField /></Field>)
    const campo = screen.getByRole('textbox')
    expect(campo).toHaveAttribute('aria-invalid', 'true')
    expect(campo).toHaveAccessibleDescription('Poné un nombre')
    expect(screen.queryByText('Lo ven los estudiantes')).not.toBeInTheDocument()
  })

  it('lo obligatorio se dice con texto y no solo con un asterisco', () => {
    render(<Field label="Nombre" required><TextField /></Field>)
    expect(screen.getByText('(obligatorio)')).toBeInTheDocument()
  })

  it('un campo suelto sigue funcionando sin Field', () => {
    render(<TextField aria-label="Suelto" />)
    expect(screen.getByRole('textbox', { name: 'Suelto' })).toBeInTheDocument()
  })
})

describe('FieldSet', () => {
  it('agrupa campos bajo un nombre', () => {
    render(
      <FieldSet legend="Quién puede ver">
        <Field label="Espacio"><TextField /></Field>
      </FieldSet>,
    )
    expect(screen.getByRole('group', { name: 'Quién puede ver' })).toBeInTheDocument()
  })
})
