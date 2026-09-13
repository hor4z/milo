import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Quote } from './quote'

describe('Quote', () => {
  it('es un `blockquote` de verdad, no un párrafo con borde', () => {
    const { container } = render(<Quote>El todo es más que la suma de las partes.</Quote>)
    const q = container.querySelector('blockquote')
    expect(q).toHaveTextContent('El todo es más que la suma de las partes.')
  })

  it('la fuente va atada a la cita y no suelta abajo', () => {
    const { container } = render(<Quote source="Aristóteles">Algo.</Quote>)
    expect(container.querySelector('figure figcaption')).toHaveTextContent('Aristóteles')
  })

  it('con `cite` la dirección queda en el markup además de escrita', () => {
    const { container } = render(<Quote cite="https://ejemplo.org/metafisica" source="Metafísica">Algo.</Quote>)
    expect(container.querySelector('blockquote')).toHaveAttribute('cite', 'https://ejemplo.org/metafisica')
    expect(container.querySelector('cite')).toHaveTextContent('Metafísica')
  })

  it('sin fuente no queda un pie vacío', () => {
    const { container } = render(<Quote>Algo.</Quote>)
    expect(container.querySelector('figcaption')).toBeNull()
  })
})
