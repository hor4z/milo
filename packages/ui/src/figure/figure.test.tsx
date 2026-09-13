import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Figure } from './figure'

describe('Figure', () => {
  it('el alt describe la imagen y el epígrafe agrega algo distinto', () => {
    render(<Figure src="/x.webp" alt="Una regla apoyada sobre una hoja cuadriculada" caption="Medido en el aula, con la regla de 30" />)
    expect(screen.getByRole('img', { name: 'Una regla apoyada sobre una hoja cuadriculada' })).toBeInTheDocument()
    expect(screen.getByText('Medido en el aula, con la regla de 30')).toBeInTheDocument()
  })

  it('con `alt` vacío la imagen es decorativa y no la anuncia nadie', () => {
    render(<Figure src="/x.webp" alt="" caption="Un pie que igual se lee" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('Un pie que igual se lee')).toBeInTheDocument()
  })

  it('sin epígrafe no queda un pie vacío colgando', () => {
    const { container } = render(<Figure src="/x.webp" alt="Algo" />)
    expect(container.querySelector('figcaption')).toBeNull()
  })

  it('el hueco reserva su proporción antes de que la imagen llegue', () => {
    const { container } = render(<Figure src="/x.webp" alt="Algo" ratio="16/9" />)
    expect(container.querySelector('figure > div')).toHaveStyle({ aspectRatio: '16/9' })
  })
})
