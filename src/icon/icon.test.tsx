import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FolderIcon, Icon } from './icon'

describe('Icon', () => {
  it('se esconde de la lectura: el glifo no es contenido', () => {
    const { container } = render(<Icon name="search" />)
    const glyph = container.querySelector('.ms-icon')
    expect(glyph).toHaveAttribute('aria-hidden', 'true')
    expect(glyph).toHaveAttribute('translate', 'no')
  })

  it('el tamaño cuadra la caja con la letra', () => {
    const { container } = render(<Icon name="search" size={16} />)
    const glyph = container.querySelector<HTMLElement>('.ms-icon')!
    expect(glyph.style.fontSize).toBe('16px')
    expect(glyph.style.width).toBe('16px')
    expect(glyph.style.height).toBe('16px')
  })

  it('sin weight no escribe --icon-wght, para que icon-muted pueda', () => {
    const { container } = render(<Icon name="search" />)
    const glyph = container.querySelector<HTMLElement>('.ms-icon')!
    expect(glyph.style.getPropertyValue('--icon-wght')).toBe('')
  })

  it('con weight sí lo escribe', () => {
    const { container } = render(<Icon name="search" weight={300} />)
    const glyph = container.querySelector<HTMLElement>('.ms-icon')!
    expect(glyph.style.getPropertyValue('--icon-wght')).toBe('300')
  })

  it('un glifo que el manifiesto no tiene deja el hueco y no tira', () => {
    const broken = 'no_existe_este_glifo' as Parameters<typeof Icon>[0]['name']
    const { container } = render(<Icon name={broken} />)
    const glyph = container.querySelector<HTMLElement>('.ms-icon')!
    expect(glyph).toBeTruthy()
    expect(glyph.textContent).toBe('')
  })
})

describe('FolderIcon', () => {
  it('es un SVG y no un glifo: necesita dos tonos', () => {
    const { container } = render(<FolderIcon color="blue" size={16} />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg.getAttribute('width')).toBe('16')
  })
})
