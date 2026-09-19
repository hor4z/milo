import { render, screen } from '@testing-library/react'
import { estilo } from '../__tests__/estilo'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Field } from '../field/field'
import { Segmented } from './segmented'

const filters = [
  { value: 'a' as const, label: 'Todas' },
  { value: 'b' as const, label: 'Abiertas' },
  { value: 'c' as const, label: 'Corregidas' },
]

describe('Segmented', () => {
  it('es elegir una de varias, no navegar entre paneles', async () => {
    const onChange = vi.fn()
    render(<Segmented value="a" onChange={onChange} options={filters} label="Filtro" />)
    expect(screen.getByRole('radiogroup', { name: 'Filtro' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Todas' })).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(screen.getByRole('radio', { name: 'Abiertas' }))
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('las flechas mueven la elección y dan la vuelta', async () => {
    const onChange = vi.fn()
    render(<Segmented value="a" onChange={onChange} options={filters} label="Filtro" />)
    screen.getByRole('radio', { name: 'Todas' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('b')
    onChange.mockClear()
    await userEvent.keyboard('{ArrowLeft}')
    expect(onChange).toHaveBeenCalledWith('c')
  })

  it('Tab entra al grupo y sale: una sola parada', () => {
    render(<Segmented value="b" onChange={() => {}} options={filters} label="Filtro" />)
    expect(screen.getByRole('radio', { name: 'Abiertas' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('radio', { name: 'Todas' })).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('radio', { name: 'Corregidas' })).toHaveAttribute('tabindex', '-1')
  })

  it('con solo iconos, el título es el nombre accesible', () => {
    render(
      <Segmented
        value="grilla"
        onChange={() => {}}
        options={[
          { value: 'grilla', icon: 'grid_view', title: 'Grilla' },
          { value: 'lista', icon: 'view_list', title: 'Lista' },
        ]}
        label="Vista"
      />,
    )
    expect(screen.getByRole('radio', { name: 'Grilla' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Grilla' })).not.toHaveAttribute('title')
  })

  it('adentro de un Field se nombra con la etiqueta', () => {
    render(
      <Field label="Rango">
        <Segmented value="a" onChange={() => {}} options={filters} />
      </Field>,
    )
    expect(screen.getByRole('radiogroup', { name: 'Rango' })).toBeInTheDocument()
  })

  it.each([
    ['sm', '1.75rem'],  // 28 + 2 + 2 = 32, la escalera compacta del Segmented
    ['md', '2rem'],     // 32 + 2 + 2 = 36, y su paso es el mismo 4
  ] as const)('el alto de afuera en %s es el de la escalera', (size, alto) => {
    render(<Segmented value="a" onChange={() => {}} options={filters.slice(0, 2)} label="Rango" size={size} />)
    expect(estilo(screen.getByRole('radiogroup'))).toContain('padding: 0.125rem')
    expect(estilo(screen.getByRole('radio', { name: 'Todas' }))).toContain(`min-height: ${alto}`)
  })

  it('el pulgar lleva el radio de lo cuadrado, que es el de la pista menos su padding', () => {
    render(<Segmented value="a" onChange={() => {}} options={filters.slice(0, 2)} label="Rango" size="sm" />)
    expect(estilo(screen.getByRole('radiogroup'))).toContain('border-radius: var(--radius-lg)')
    expect(estilo(screen.getByRole('radio', { name: 'Todas' }))).toContain('border-radius: var(--radius-md)')
  })

  it('una opción apagada no se elige ni recibe el foco', async () => {
    const onChange = vi.fn()
    render(
      <Segmented
        value="a"
        onChange={onChange}
        options={[...filters.slice(0, 2), { value: 'c' as const, label: 'Corregidas', disabled: true }]}
        label="Filtro"
      />,
    )
    expect(screen.getByRole('radio', { name: 'Corregidas' })).toBeDisabled()
    screen.getByRole('radio', { name: 'Todas' }).focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(onChange).toHaveBeenCalledWith('b')
  })
})
