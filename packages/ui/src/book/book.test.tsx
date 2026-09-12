import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Book } from './book'

describe('Book', () => {
  it('el título se lee', () => {
    render(<Book title="Fracciones" />)
    expect(screen.getByText('Fracciones')).toBeInTheDocument()
  })

  it('con href es un enlace, sin href no', () => {
    const { rerender } = render(<Book title="Fracciones" href="/libro/1" />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/libro/1')
    rerender(<Book title="Fracciones" />)
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('el ancho viaja como token y acepta dos medidas', () => {
    const { container, rerender } = render(<Book title="Fracciones" width={196} />)
    const cover = container.firstElementChild as HTMLElement
    expect(cover.style.getPropertyValue('--book-sm')).toBe('196')
    expect(cover.style.getPropertyValue('--book-md')).toBe('196')
    rerender(<Book title="Fracciones" width={{ sm: 120, md: 220 }} />)
    expect(cover.style.getPropertyValue('--book-sm')).toBe('120')
    expect(cover.style.getPropertyValue('--book-md')).toBe('220')
  })

  it('simple no dibuja la franja', () => {
    const { container } = render(<Book title="Fracciones" variant="simple" />)
    expect(container.querySelector('.book-stripe')).toBeNull()
    expect(container.querySelector('.book-simple')).toBeInTheDocument()
  })

  it('el lomo y el grano no se leen', () => {
    const { container } = render(<Book title="Fracciones" textured />)
    expect(container.querySelector('.book-bind')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.book-grain')).toHaveAttribute('aria-hidden', 'true')
  })
})
