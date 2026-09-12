import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './table'

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

  it('una fila que se toca se toca también con el teclado', async () => {
    const abrir = vi.fn()
    render(
      <Table>
        <TableBody><TableRow onClick={abrir}><TableCell>Ana</TableCell></TableRow></TableBody>
      </Table>,
    )
    const fila = screen.getByText('Ana').closest('tr')!
    expect(fila).toHaveAttribute('tabindex', '0')
    fila.focus()
    await userEvent.keyboard('{Enter}')
    expect(abrir).toHaveBeenCalledOnce()
    await userEvent.keyboard(' ')
    expect(abrir).toHaveBeenCalledTimes(2)
  })

  it('una fila que no hace nada no es una parada de tabulación', () => {
    render(
      <Table>
        <TableBody><TableRow><TableCell>Ana</TableCell></TableRow></TableBody>
      </Table>,
    )
    expect(screen.getByText('Ana').closest('tr')).not.toHaveAttribute('tabindex')
  })

  it('los encabezados dicen a qué columna encabezan', () => {
    render(
      <Table>
        <TableHeader><TableRow><TableHead>Nombre</TableHead></TableRow></TableHeader>
        <TableBody><TableRow><TableCell>Ana</TableCell></TableRow></TableBody>
      </Table>,
    )
    expect(screen.getByText('Nombre')).toHaveAttribute('scope', 'col')
  })
})
