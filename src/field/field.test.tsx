import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Checkbox } from '../checkbox/checkbox'
import { Field } from './field'
import { Select } from '../select/select'
import { Slider } from '../slider/slider'
import { Switch } from '../switch/switch'
import { TextField } from '../text-field/text-field'
import { Textarea } from '../textarea/textarea'

describe('Field', () => {
  it('la etiqueta enfoca el campo al clickearla', async () => {
    render(<Field><Field.Label>Nombre de la actividad</Field.Label><TextField /></Field>)
    await userEvent.click(screen.getByText('Nombre de la actividad'))
    expect(document.activeElement).toBe(screen.getByRole('textbox'))
  })

  it('el campo queda nombrado por su etiqueta', () => {
    render(<Field><Field.Label>Consigna</Field.Label><Textarea /></Field>)
    expect(screen.getByRole('textbox', { name: 'Consigna' })).toBeInTheDocument()
  })

  it('la ayuda queda atada al campo', () => {
    render(<Field><Field.Label>Nombre</Field.Label><Field.Hint>Lo ven los estudiantes</Field.Hint><TextField /></Field>)
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Lo ven los estudiantes')
  })

  it('el error marca el campo y reemplaza a la ayuda', () => {
    render(<Field><Field.Label>Nombre</Field.Label><Field.Hint>Lo ven los estudiantes</Field.Hint><Field.Error>Poné un nombre</Field.Error><TextField /></Field>)
    const field = screen.getByRole('textbox')
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(field).toHaveAccessibleDescription('Poné un nombre')
    expect(screen.queryByText('Lo ven los estudiantes')).not.toBeInTheDocument()
  })

  it('lo obligatorio se dice con texto y no solo con un asterisco', () => {
    render(<Field required><Field.Label>Nombre</Field.Label><TextField /></Field>)
    expect(screen.getByText('(obligatorio)')).toBeInTheDocument()
  })

  it('un campo suelto sigue funcionando sin Field', () => {
    render(<TextField aria-label="Suelto" />)
    expect(screen.getByRole('textbox', { name: 'Suelto' })).toBeInTheDocument()
  })
})

describe('Field.Set', () => {
  it('agrupa campos bajo un nombre', () => {
    render(
      <Field.Set legend="Quién puede ver">
        <Field><Field.Label>Espacio</Field.Label><TextField /></Field>
      </Field.Set>,
    )
    expect(screen.getByRole('group', { name: 'Quién puede ver' })).toBeInTheDocument()
  })
})

describe('Field con cualquier control del sistema', () => {
  it('nombra un Select y lo enfoca desde la etiqueta', async () => {
    render(<Field><Field.Label>Espacio</Field.Label><Select value="Matemática" options={['Matemática', 'Lengua']} /></Field>)
    const control = screen.getByRole('button', { name: /Espacio/ })
    await userEvent.click(screen.getByText('Espacio'))
    expect(document.activeElement).toBe(control)
  })

  it('nombra un Switch', async () => {
    render(<Field><Field.Label>Avisos por mail</Field.Label><Switch checked onChange={() => {}} /></Field>)
    expect(screen.getByRole('switch', { name: 'Avisos por mail' })).toBeInTheDocument()
  })

  it('nombra un Checkbox y le pasa el error', async () => {
    render(
      <Field>
        <Field.Label>Acepto</Field.Label>
        <Field.Error>Hay que aceptar para seguir</Field.Error>
        <Checkbox checked={false} onChange={() => {}} />
      </Field>,
    )
    const cb = screen.getByRole('checkbox', { name: 'Acepto' })
    expect(cb).toHaveAttribute('aria-invalid', 'true')
    expect(cb).toHaveAccessibleDescription('Hay que aceptar para seguir')
  })

  it('nombra un Slider', async () => {
    render(<Field><Field.Label>Duración</Field.Label><Slider value={30} onChange={() => {}} /></Field>)
    expect(screen.getByRole('slider', { name: 'Duración' })).toBeInTheDocument()
  })

  it('un control suelto conserva su propio label', async () => {
    render(<Switch checked onChange={() => {}} label="Suelto" />)
    expect(screen.getByRole('switch', { name: 'Suelto' })).toBeInTheDocument()
  })
})
