import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Callout } from './callout'

describe('Callout', () => {
  it('es un `aside`: contenido al costado del hilo principal, no un aviso del sistema', () => {
    render(<Callout title="Para acordarse">La velocidad límite no depende de la masa.</Callout>)
    const c = screen.getByRole('complementary')
    expect(c).toHaveTextContent('Para acordarse')
    expect(c).toHaveTextContent('La velocidad límite no depende de la masa.')
  })

  it('sin título arranca directo con el texto', () => {
    render(<Callout>Solo el cuerpo.</Callout>)
    expect(screen.getByRole('complementary')).toHaveTextContent('Solo el cuerpo.')
  })

  it('el glifo es decorativo: lo que dice el bloque está en su texto', () => {
    const { container } = render(<Callout icon="lightbulb">Una pista.</Callout>)
    expect(container.querySelector('.ms-icon')).toHaveAttribute('aria-hidden', 'true')
  })
})
