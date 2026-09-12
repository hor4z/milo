import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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
})
