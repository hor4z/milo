import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Link } from './link'

describe('Link', () => {
  it('el externo avisa que abre en otra pestaña', async () => {
    render(<Link href="https://ejemplo.com" external>Material Symbols</Link>)
    const a = screen.getByRole('link', { name: /Material Symbols/ })
    expect(a).toHaveAttribute('target', '_blank')
    expect(a).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(a).toHaveTextContent('se abre en otra pestaña')
  })

  it('el interno no abre pestañas', async () => {
    render(<Link href="/ajustes">Ajustes</Link>)
    expect(screen.getByRole('link')).not.toHaveAttribute('target')
  })

  it('lleva las dos señales: el color de marca y el subrayado', () => {
    render(<Link href="#">Ver todas</Link>)
    const a = screen.getByRole('link')
    expect(a).toHaveClass('text-brand-ink', 'underline')
    expect(a).toHaveClass('decoration-current')
  })
})
