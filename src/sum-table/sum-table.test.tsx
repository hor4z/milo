import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SumTable, type SumCell } from './sum-table'

const rows = [
  { id: 'materia', label: 'Materia prima' },
  { id: 'packaging', label: 'Packaging' },
]

const cargado: Record<string, SumCell> = {
  materia: { qty: '20', price: '2000' },
  packaging: { qty: '20', price: '300' },
}

const Presupuesto = (props: Partial<Parameters<typeof SumTable>[0]> = {}) => (
  <SumTable rows={rows} value={{}} onChange={() => {}} {...props}>
    <SumTable.Prompt>Tu presupuesto inicial</SumTable.Prompt>
  </SumTable>
)

describe('SumTable', () => {
  it('cada celda dice de qué renglón es: "cantidad" a secas no sirve con cinco filas', () => {
    render(<Presupuesto />)
    expect(screen.getByRole('textbox', { name: 'Cantidad de Materia prima' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Precio de Packaging' })).toBeInTheDocument()
  })

  it('devuelve el renglón entero y no la celda suelta', async () => {
    const onChange = vi.fn()
    render(<Presupuesto onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Cantidad de Packaging' }), '5')
    expect(onChange).toHaveBeenCalledWith('packaging', { qty: '5', price: '' })
  })

  it('el subtotal sale de los dos números, así que con uno solo todavía no hay nada', () => {
    render(<Presupuesto value={{ materia: { qty: '20', price: '' } }} />)
    expect(screen.getAllByText(/^\$/)).toHaveLength(1)
    expect(screen.getByText('$0')).toBeInTheDocument()
  })

  it('el total no se escribe, y por eso no puede estar mal sumado', () => {
    render(<Presupuesto value={cargado} />)
    expect(screen.getByText('$46.000')).toBeInTheDocument()
  })

  it('con tope dice cuánto queda, que es lo que hace falta para decidir', () => {
    render(<Presupuesto value={cargado} cap={100000} />)
    expect(screen.getByText('Te quedan $54.000 de los $100.000.')).toBeInTheDocument()
  })

  it('pasarse lo dice con el número, no con un color', () => {
    render(<Presupuesto value={cargado} cap={40000} />)
    expect(screen.getByText('Te pasaste por $6.000. El tope es $40.000.')).toBeInTheDocument()
  })

  it('sin tope la tabla suma y no opina', () => {
    render(<Presupuesto value={cargado} />)
    expect(screen.queryByText(/tope|quedan|pasaste/)).not.toBeInTheDocument()
  })

  it('de solo lectura se lee y no se completa', () => {
    render(<Presupuesto value={cargado} readOnly />)
    expect(screen.getByRole('textbox', { name: 'Cantidad de Materia prima' })).toHaveAttribute('readonly')
  })

})