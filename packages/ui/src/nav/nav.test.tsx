import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import s from './nav.module.css'
import { NavItemBody, navItemClass, navSubItemClass } from './nav'

describe('navItemClass', () => {
  it('el activo se marca con el azul primario y su canto', () => {
    const active = navItemClass({ active: true })
    expect(active).toContain(s.active)
  })

  it('el inactivo va en tinta, no en gris', () => {
    expect(navItemClass()).toContain(s.plain)
    expect(navItemClass()).not.toContain(s.muted)
  })

  it('muted es el caso aparte y sí se apaga', () => {
    expect(navItemClass({ muted: true })).toContain(s.muted)
  })

  it('contraído centra el icono y saca el padding lateral', () => {
    expect(navItemClass({ collapsed: true })).toContain(s.collapsed)
  })
})

describe('NavItemBody', () => {
  it('muestra la etiqueta y la esconde al contraerse', () => {
    const { rerender } = render(<NavItemBody icon="home" label="Inicio" />)
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    rerender(<NavItemBody icon="home" label="Inicio" collapsed />)
    expect(screen.queryByText('Inicio')).not.toBeInTheDocument()
  })

  it('el glifo propio le gana al icono del set', () => {
    render(<NavItemBody icon="home" glyph={<span data-glifo="" />} label="Inicio" />)
    const { container } = render(<NavItemBody glyph={<span data-glifo="" />} label="Inicio" />)
    expect(container.querySelector('[data-glifo]')).toBeInTheDocument()
    expect(container.querySelector('.ms-icon')).toBeNull()
  })

  it('el badge solo aparece desplegado', () => {
    const { rerender } = render(<NavItemBody icon="home" label="Inicio" badge="3" />)
    expect(screen.getByText('3')).toBeInTheDocument()
    rerender(<NavItemBody icon="home" label="Inicio" badge="3" collapsed />)
    expect(screen.queryByText('3')).not.toBeInTheDocument()
  })
})

describe('navSubItemClass', () => {
  it('sangra hasta la columna del texto del padre', () => {
    expect(navSubItemClass()).toContain(s.subitemMotion)
  })

  it('el activo se marca igual que su padre', () => {
    expect(navSubItemClass({ active: true })).toContain(s.subitemActive)
  })

  it('el inactivo va en tinta, no en gris: una lista de siete no se lee deshabilitada', () => {
    expect(navSubItemClass()).toContain(s.subitemPlain)
    expect(navSubItemClass()).not.toContain(s.subitemActive)
  })
})
