import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FolderIcon, Icon } from './icon'

describe('Icon', () => {
  it('se esconde de la lectura: el glifo no es contenido', () => {
    const { container } = render(<Icon name="search" />)
    const glifo = container.querySelector('.ms-icon')
    expect(glifo).toHaveAttribute('aria-hidden', 'true')
    expect(glifo).toHaveAttribute('translate', 'no')
  })

  it('el tamaño cuadra la caja con la letra', () => {
    const { container } = render(<Icon name="search" size={16} />)
    const glifo = container.querySelector<HTMLElement>('.ms-icon')!
    expect(glifo.style.fontSize).toBe('16px')
    expect(glifo.style.width).toBe('16px')
    expect(glifo.style.height).toBe('16px')
  })

  it('sin weight no escribe --icon-wght, para que icon-muted pueda', () => {
    const { container } = render(<Icon name="search" />)
    const glifo = container.querySelector<HTMLElement>('.ms-icon')!
    expect(glifo.style.getPropertyValue('--icon-wght')).toBe('')
  })

  it('con weight sí lo escribe', () => {
    const { container } = render(<Icon name="search" weight={300} />)
    const glifo = container.querySelector<HTMLElement>('.ms-icon')!
    expect(glifo.style.getPropertyValue('--icon-wght')).toBe('300')
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
