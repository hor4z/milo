import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Heatmap } from './heatmap'

const levels = ['Sin empezar', 'Inicial', 'En camino', 'Logrado']
const columns = ['Fracciones', 'Decimales']
const rows = [
  { label: 'Ana Pérez', values: [3, 1] },
  { label: 'Bruno Díaz', values: [null, 2] },
]

describe('Heatmap', () => {
  it('es una tabla de verdad, con los dos ejes nombrados', () => {
    render(<Heatmap title="Dominio por tema" columns={columns} rows={rows} levels={levels} />)
    expect(screen.getByRole('table', { name: 'Dominio por tema' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Fracciones' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'Ana Pérez' })).toBeInTheDocument()
  })

  it('el nivel está escrito y no solo pintado', () => {
    render(<Heatmap title="Dominio" columns={columns} rows={rows} levels={levels} />)
    const fila = screen.getByRole('row', { name: /Ana Pérez/ })
    expect(within(fila).getByText('Logrado')).toBeInTheDocument()
    expect(within(fila).getByText('Inicial')).toBeInTheDocument()
  })

  it('sin dato no es el nivel más bajo', () => {
    render(<Heatmap title="Dominio" columns={columns} rows={rows} levels={levels} />)
    const fila = screen.getByRole('row', { name: /Bruno Díaz/ })
    expect(within(fila).getByText('Sin datos')).toBeInTheDocument()
    expect(within(fila).queryByText('Sin empezar')).toBeNull()
  })

  it('el nivel sube el alto además del tono, que es lo que lo hace legible sin color', () => {
    const { container } = render(
      <Heatmap title="Dominio" columns={['A']} rows={[{ label: 'Fila', values: [0] }, { label: 'Otra', values: [3] }]} levels={levels} />,
    )
    const altos = [...container.querySelectorAll('tbody span[aria-hidden="true"]')].map(n => (n as HTMLElement).style.height)
    // El más bajo no arranca en cero: se tiene que distinguir de la celda vacía.
    expect(altos).toEqual(['34%', '100%'])
  })

  it('la leyenda dice qué quiere decir cada tono', () => {
    render(<Heatmap title="Dominio" columns={columns} rows={rows} levels={levels} empty="No lo intentó" />)
    for (const l of levels) expect(screen.getAllByText(l).length).toBeGreaterThan(0)
    expect(screen.getAllByText('No lo intentó').length).toBeGreaterThan(0)
  })
})
