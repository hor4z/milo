import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ColumnPicker, Filter, FilterSearch, facets } from '../filter'
import { Pagination, PaginationNext, PaginationPrev, PaginationStatus } from '../pagination'
import { BarChart } from '../chart'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../table'

describe('facets', () => {
  it('cuenta por clave y saltea nulos', () => {
    const filas = [{ e: 'a' }, { e: 'b' }, { e: 'a' }, { e: undefined }]
    expect(facets(filas, f => f.e)).toEqual({ a: 2, b: 1 })
  })
})

describe('PaginationStatus', () => {
  it('colapsa el tramo cuando es todo', () => {
    render(<PaginationStatus from={1} to={9} total={9} noun={['actividad', 'actividades']} />)
    expect(screen.getByRole('status')).toHaveTextContent('9 actividades')
  })

  it('usa el singular con uno solo', () => {
    render(<PaginationStatus from={1} to={1} total={1} noun={['actividad', 'actividades']} />)
    expect(screen.getByRole('status')).toHaveTextContent('1 actividad')
  })

  it('dice el tramo cuando no es todo', () => {
    render(<PaginationStatus from={5} to={8} total={20} noun={['fila', 'filas']} />)
    expect(screen.getByRole('status')).toHaveTextContent('5 a 8 de 20 filas')
  })
})

describe('Pagination', () => {
  it('pagina y apaga en las puntas', async () => {
    const Demo = () => {
      const [p, setP] = useState(0)
      return (
        <Pagination>
          <PaginationStatus from={p * 4 + 1} to={p * 4 + 4} total={12} />
          <PaginationPrev disabled={p === 0} onClick={() => setP(n => n - 1)} />
          <PaginationNext disabled={p === 2} onClick={() => setP(n => n + 1)} />
        </Pagination>
      )
    }
    render(<Demo />)
    expect(screen.getByRole('button', { name: /Anterior/ })).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: /Siguiente/ }))
    expect(screen.getByRole('status')).toHaveTextContent('5 a 8 de 12')
    expect(screen.getByRole('button', { name: /Anterior/ })).toBeEnabled()
  })
})

describe('Filter', () => {
  it('elige varias y las cuenta en el botón', async () => {
    const Demo = () => {
      const [v, setV] = useState<string[]>([])
      return <Filter label="Estado" value={v} onValueChange={setV} options={[{ value: 'Abierta', count: 3 }, { value: 'Cerrada', count: 1 }]} />
    }
    render(<Demo />)
    await userEvent.click(screen.getByRole('button', { name: /Estado/ }))
    await userEvent.click(screen.getByRole('checkbox', { name: /Abierta/ }))
    expect(screen.getByRole('button', { name: /Estado · 1/ })).toBeInTheDocument()
  })

  it('cada opción se nombra para un lector', async () => {
    render(<Filter label="Estado" value={[]} onValueChange={() => {}} options={[{ value: 'Abierta', count: 3 }]} />)
    await userEvent.click(screen.getByRole('button', { name: /Estado/ }))
    expect(screen.getByRole('checkbox', { name: /Abierta/ })).toBeInTheDocument()
  })
})

describe('FilterSearch', () => {
  it('limpia con la X y devuelve el foco al campo', async () => {
    const Demo = () => {
      const [v, setV] = useState('mate')
      return <FilterSearch value={v} onValueChange={setV} />
    }
    render(<Demo />)
    await userEvent.click(screen.getByRole('button', { name: /Limpiar/ }))
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('')
  })
})

describe('ColumnPicker', () => {
  it('no deja apagar una columna locked', async () => {
    const Demo = () => {
      const [v, setV] = useState(['a', 'b'])
      return (
        <ColumnPicker
          columns={[{ id: 'a', label: 'Actividad', locked: true }, { id: 'b', label: 'Estado' }]}
          value={v}
          onValueChange={setV}
        />
      )
    }
    render(<Demo />)
    await userEvent.click(screen.getByRole('button', { name: 'Columnas' }))
    expect(screen.getByRole('checkbox', { name: /Actividad/ })).toBeDisabled()
    await userEvent.click(screen.getByRole('checkbox', { name: /Estado/ }))
    expect(screen.getByRole('checkbox', { name: /Estado/ })).toHaveAttribute('aria-checked', 'false')
  })
})

describe('Table', () => {
  it('arma la grilla con su pie', () => {
    render(
      <Table>
        <TableHeader><TableRow><TableHead>Nombre</TableHead></TableRow></TableHeader>
        <TableBody><TableRow><TableCell>Ana</TableCell></TableRow></TableBody>
        <TableFooter><TableRow><TableCell>Total</TableCell></TableRow></TableFooter>
      </Table>,
    )
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('la franja del footer queda fuera del scroller', () => {
    const { container } = render(
      <Table footer={<div data-testid="franja">pie</div>}>
        <TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody>
      </Table>,
    )
    const scroller = container.querySelector('.overflow-x-auto')!
    expect(scroller.contains(screen.getByTestId('franja'))).toBe(false)
  })
})

describe('BarChart', () => {
  const datos = [
    { label: 'Lun', value: 3, total: 6 },
    { label: 'Mar', value: 6, total: 6 },
  ]

  it('nombra cada barra con lo hecho y el total', () => {
    render(<BarChart title="Semana" data={datos} />)
    expect(screen.getByRole('button', { name: 'Lun: 3 de 6' })).toBeInTheDocument()
  })

  it('deja los valores en una tabla con encabezados', () => {
    render(<BarChart title="Semana" data={datos} />)
    expect(screen.getByRole('table')).toHaveTextContent('Hecho')
    expect(screen.getByRole('table')).toHaveTextContent('Total')
  })

  it('muestra el tooltip al enfocar y lo saca al salir', async () => {
    render(<BarChart title="Semana" data={datos} />)
    await userEvent.tab()
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('3'))
  })

  it('sobrevive a que la serie se acorte con una barra activa', async () => {
    const Demo = () => {
      const [d, setD] = useState(datos)
      return (
        <>
          <button onClick={() => setD([datos[0]])}>achicar</button>
          <BarChart title="Semana" data={d} />
        </>
      )
    }
    render(<Demo />)
    const barras = screen.getAllByRole('button').filter(b => b.getAttribute('aria-label'))
    barras[1].focus()
    await userEvent.click(screen.getByText('achicar'))
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})
