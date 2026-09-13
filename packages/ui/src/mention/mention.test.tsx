import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Mention } from './mention'

describe('Mention', () => {
  it('sin `href` es texto y no promete un lugar al que ir', () => {
    render(<p>Le avisé a <Mention name="Ana Pérez" /> ayer.</p>)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument()
  })

  it('con `href` es un enlace con el nombre adentro', () => {
    render(<p>Está en <Mention name="Matemática · 4.º A" icon="folder" href="#espacio" /> desde marzo.</p>)
    expect(screen.getByRole('link', { name: /Matemática · 4.º A/ })).toHaveAttribute('href', '#espacio')
  })

  it('la foto no se anuncia: el nombre ya está escrito al lado', () => {
    const { container } = render(<Mention name="Ana Pérez" src="/x.webp" />)
    const img = container.querySelector('img')
    expect(img?.getAttribute('alt')).toBe('')
  })

  it('para lo que no es una persona va un glifo y no una inicial', () => {
    const { container } = render(<Mention name="Fracciones" icon="folder" />)
    expect(container.querySelector('.ms-icon')).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
  })
})
