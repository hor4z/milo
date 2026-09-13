import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { A11y, Note } from '../kit'

describe('las piezas del propio kit', () => {
  it('una nota interpreta los backticks igual que el resto del sitio', () => {
    // El `lead`, el `note` de una sección y la lista de accesibilidad reciben
    // texto y lo pasan por el mismo lector; la nota recibe hijos y durante un
    // tiempo los dejaba crudos. Trece notas mostraban el backtick escrito.
    const { container } = render(<Note title="Algo">El tipo va en `lib/side-scroll.ts` y listo.</Note>)
    expect(container.querySelector('code')?.textContent).toBe('lib/side-scroll.ts')
    expect(container.textContent).not.toContain('`')
  })

  it('una nota deja pasar lo que no es texto', () => {
    render(<Note title="Algo">Mirá <a href="#x">esto</a> y nada más.</Note>)
    expect(screen.getByRole('link', { name: 'esto' })).toHaveAttribute('href', '#x')
  })

  it('la lista de accesibilidad también los interpreta', () => {
    const { container } = render(<A11y items={['La región lleva `aria-label`.']} />)
    expect(container.querySelector('code')?.textContent).toBe('aria-label')
  })
})
