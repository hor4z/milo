import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LineChart } from './line-chart'

const caida = [
  { label: 'Sin rozamiento', points: [{ x: 0, y: 0 }, { x: 1, y: 5 }, { x: 2, y: 20 }, { x: 3, y: 45 }] },
  { label: 'Con rozamiento', points: [{ x: 0, y: 0 }, { x: 1, y: 4 }, { x: 2, y: 14 }, { x: 3, y: 28 }] },
]

describe('LineChart', () => {
  it('la tabla escondida trae todos los datos, que es la versión que se puede leer', () => {
    render(<LineChart series={caida} title="Caída libre" xLabel="Tiempo (s)" />)
    const tabla = screen.getByRole('table', { name: 'Caída libre' })
    expect(tabla).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Tiempo (s)' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: '2' })).toBeInTheDocument()
    expect(screen.getAllByRole('cell', { name: '20' })).toHaveLength(1)
  })

  it('se recorre con el teclado y dice dónde está parado', () => {
    render(<LineChart series={caida} title="Caída libre" xLabel="Tiempo (s)" />)
    const s = screen.getByRole('slider', { name: /Recorrer los valores/ })
    expect(s).toHaveAttribute('aria-valuetext', 'Tiempo (s) 0. Sin rozamiento: 0; Con rozamiento: 0')
    fireEvent.change(s, { target: { value: '2' } })
    expect(s).toHaveAttribute('aria-valuetext', 'Tiempo (s) 2. Sin rozamiento: 20; Con rozamiento: 14')
  })

  it('con un solo trazo no hay leyenda que leer', () => {
    const { rerender } = render(<LineChart series={[caida[0]]} title="Caída libre" />)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    rerender(<LineChart series={caida} title="Caída libre" />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('un hueco en una serie se dice y no se inventa', () => {
    render(
      <LineChart
        title="Entregas"
        series={[
          { label: 'A', points: [{ x: 1, y: 3 }, { x: 2, y: 4 }] },
          { label: 'B', points: [{ x: 1, y: 9 }] },
        ]}
      />,
    )
    expect(screen.getAllByRole('cell', { name: '—' })).toHaveLength(1)
  })

  it('el eje puede arrancar en cero o en el dato más chico', () => {
    const plano = [{ label: 'Temperatura', points: [{ x: 0, y: 20 }, { x: 1, y: 21 }, { x: 2, y: 20.5 }] }]
    const { container, rerender } = render(<LineChart series={plano} title="Temperatura" zeroY />)
    expect(container.textContent).toContain('0')
    rerender(<LineChart series={plano} title="Temperatura" />)
    // Sin cero, el eje se ajusta al dato y el grado de diferencia se ve.
    expect(container.textContent).toContain('20')
  })
})
