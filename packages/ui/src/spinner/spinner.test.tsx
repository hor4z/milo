import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Spinner } from './spinner'

describe('Spinner', () => {
  it('se anuncia como estado con su nombre', () => {
    render(<Spinner label="Guardando" />)
    expect(screen.getByRole('status', { name: 'Guardando' })).toBeInTheDocument()
  })

  it('el dibujo no se lee: el nombre lo pone el role', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('status')).toHaveAccessibleName('Cargando')
  })

  it('el nombre se puede cambiar por el de lo que está cargando', () => {
    render(<Spinner label="Buscando espacios" />)
    expect(screen.getByRole('status', { name: 'Buscando espacios' })).toBeInTheDocument()
  })
})
