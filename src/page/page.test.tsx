import { render, screen } from '@testing-library/react'
import { style } from '../__tests__/estilo'
import { describe, expect, it } from 'vitest'
import { Page } from './page'

describe('Page', () => {
  it('limita el ancho y lo suelta con wide', () => {
    const { rerender, container } = render(<Page>contenido</Page>)
    expect(style(container.firstChild as Element)).toContain('max-width: 1200px')
    rerender(<Page wide>contenido</Page>)
    expect(style(container.firstChild as Element)).toContain('max-width: 1560px')
  })
})

describe('PageHeader', () => {
  it('el título es el encabezado de la pantalla', () => {
    render(<Page.Header title="Espacios" subtitle="Lo que tenés a cargo" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Espacios' })).toBeInTheDocument()
    expect(screen.getByText('Lo que tenés a cargo')).toBeInTheDocument()
  })

  it('sin subtítulo no deja el hueco', () => {
    render(<Page.Header title="Espacios" />)
    expect(screen.queryByText('Lo que tenés a cargo')).not.toBeInTheDocument()
  })

  it('las acciones van al lado del título', () => {
    render(<Page.Header title="Espacios" actions={<button>Nuevo</button>} />)
    expect(screen.getByRole('button', { name: 'Nuevo' })).toBeInTheDocument()
  })
})

describe('SectionLabel', () => {
  it('muestra el rótulo y el conteo', () => {
    render(<Page.SectionLabel count={7}>Recientes</Page.SectionLabel>)
    expect(screen.getByText('Recientes')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('sin conteo no dibuja el número', () => {
    const { container } = render(<Page.SectionLabel>Recientes</Page.SectionLabel>)
    expect(container.querySelector('.tabular')).toBeNull()
  })
})
