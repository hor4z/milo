import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Breadcrumb } from './breadcrumb'

describe('Breadcrumb', () => {
  it('marca dónde estás y deja volver', async () => {
    const onClick = vi.fn()
    render(<Breadcrumb items={[{ label: 'Espacios', onClick }, { label: 'Matemática' }]} />)
    expect(screen.getByText('Matemática')).toHaveAttribute('aria-current', 'page')
    await userEvent.click(screen.getByText('Espacios'))
    expect(onClick).toHaveBeenCalled()
  })

  it('con onClick y sin href es un botón, no un link a ninguna parte', () => {
    render(<Breadcrumb items={[{ label: 'Espacios', onClick: () => {} }, { label: 'Matemática' }]} />)
    expect(screen.getByRole('button', { name: 'Espacios' })).toBeInTheDocument()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('con href es un link de verdad', () => {
    render(<Breadcrumb items={[{ label: 'Espacios', href: '/espacios' }, { label: 'Matemática' }]} />)
    expect(screen.getByRole('link', { name: 'Espacios' })).toHaveAttribute('href', '/espacios')
  })

  it('dónde estás no es accionable', () => {
    render(<Breadcrumb items={[{ label: 'Espacios', href: '/espacios' }, { label: 'Matemática' }]} />)
    expect(screen.getByText('Matemática').tagName).toBe('SPAN')
  })

  it('se anuncia como la ruta de la página', () => {
    render(<Breadcrumb items={[{ label: 'Espacios', href: '/x' }, { label: 'Matemática' }]} />)
    expect(screen.getByRole('navigation', { name: 'Ruta' })).toBeInTheDocument()
  })
})
