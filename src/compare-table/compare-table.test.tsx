import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CompareTable } from './compare-table'

const rows = [
  { id: 'precio', label: 'Precio' },
  { id: 'publico', label: 'Público' },
]

const columns = [
  { id: 'mio', label: 'Tu emprendimiento' },
  { id: 'uno', label: 'Competidor 1' },
]

const Cuadro = (props: Partial<Parameters<typeof CompareTable>[0]> = {}) => (
  <CompareTable rows={rows} columns={columns} value={{}} onChange={() => {}} {...props}>
    <CompareTable.Prompt>Contra quién competís</CompareTable.Prompt>
  </CompareTable>
)

describe('CompareTable', () => {
  it('cada celda dice qué cruce es: sin eso son ocho cuadros de texto iguales', () => {
    render(<Cuadro />)
    expect(screen.getByRole('textbox', { name: 'Precio de Competidor 1' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Público de Tu emprendimiento' })).toBeInTheDocument()
  })

  it('con una sola columna el nombre de la celda es el renglón, porque la columna no distingue nada', () => {
    render(<Cuadro columns={[{ id: 'vos', label: 'Tu respuesta' }]} />)
    expect(screen.getByRole('textbox', { name: 'Precio' })).toBeInTheDocument()
  })

  it('devuelve el renglón, la columna y el texto', async () => {
    const onChange = vi.fn()
    render(<Cuadro onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Precio de Tu emprendimiento' }), 'a')
    expect(onChange).toHaveBeenCalledWith('precio', 'mio', 'a')
  })

  it('la grilla es de quien arma la consigna: las columnas y los renglones no se agregan desde adentro', () => {
    render(<Cuadro />)
    expect(screen.getAllByRole('textbox')).toHaveLength(4)
  })

  it('una celda arranca en un renglón, porque acá entra una frase y no un párrafo', () => {
    render(<Cuadro />)
    expect(screen.getAllByRole('textbox')[0]).toHaveAttribute('rows', '1')
  })

  it('de solo lectura muestra el texto, y una celda vacía lo dice', () => {
    render(<Cuadro value={{ precio: { mio: '$4.000' } }} readOnly />)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByText('$4.000')).toBeInTheDocument()
    expect(screen.getAllByText('Sin completar')).toHaveLength(3)
  })
})
