import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Indicator } from './indicator'

describe('Indicator', () => {
  it('sin nada que marcar devuelve lo de adentro y no agrega una caja', () => {
    const { container } = render(<Indicator><button type="button">Avisos</button></Indicator>)
    expect(container.querySelector('span')).toBeNull()
  })

  it('el contador se recorta en 99+ y en cero no dibuja nada', () => {
    const { rerender } = render(<Indicator count={120}><i /></Indicator>)
    expect(screen.getByText('99+')).toBeInTheDocument()
    rerender(<Indicator count={0}><i /></Indicator>)
    expect(screen.queryByText('0')).toBeNull()
  })

  it('sin label la marca es decorativa y no se anuncia dos veces', () => {
    const { container } = render(<Indicator dot><i /></Indicator>)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('con label se anuncia como estado', () => {
    render(<Indicator dot label="3 sin leer"><i /></Indicator>)
    expect(screen.getByRole('status')).toHaveTextContent('3 sin leer')
  })
})
