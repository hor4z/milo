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

describe('Field con cualquier control del sistema', () => {
  it('nombra un Select y lo enfoca desde la etiqueta', async () => {
    const { Select } = await import('../primitives')
    render(<Field label="Espacio"><Select value="Matemática" options={['Matemática', 'Lengua']} /></Field>)
    const control = screen.getByRole('button', { name: /Espacio/ })
    await userEvent.click(screen.getByText('Espacio'))
    expect(document.activeElement).toBe(control)
  })

  it('nombra un Switch', async () => {
    const { Switch } = await import('../primitives')
    render(<Field label="Avisos por mail"><Switch checked onChange={() => {}} /></Field>)
    expect(screen.getByRole('switch', { name: 'Avisos por mail' })).toBeInTheDocument()
  })

  it('nombra un Checkbox y le pasa el error', async () => {
    const { Checkbox } = await import('../primitives')
    render(
      <Field label="Acepto" error="Hay que aceptar para seguir">
        <Checkbox checked={false} onChange={() => {}} />
      </Field>,
    )
    const cb = screen.getByRole('checkbox', { name: 'Acepto' })
    expect(cb).toHaveAttribute('aria-invalid', 'true')
    expect(cb).toHaveAccessibleDescription('Hay que aceptar para seguir')
  })

  it('nombra un Slider', async () => {
    const { Slider } = await import('../primitives')
    render(<Field label="Duración"><Slider value={30} onChange={() => {}} /></Field>)
    expect(screen.getByRole('slider', { name: 'Duración' })).toBeInTheDocument()
  })

  it('un control suelto conserva su propio label', async () => {
    const { Switch } = await import('../primitives')
    render(<Switch checked onChange={() => {}} label="Suelto" />)
    expect(screen.getByRole('switch', { name: 'Suelto' })).toBeInTheDocument()
  })
})
