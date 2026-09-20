import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Table } from './table'

describe('Table', () => {
  it('arma la grilla con su pie', () => {
    render(
      <Table>
        <Table.Header><Table.Row><Table.Head>Nombre</Table.Head></Table.Row></Table.Header>
        <Table.Body><Table.Row><Table.Cell>Ana</Table.Cell></Table.Row></Table.Body>
        <Table.Foot><Table.Row><Table.Cell>Total</Table.Cell></Table.Row></Table.Foot>
      </Table>,
    )
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('la franja del footer queda fuera del scroller', () => {
    const { container } = render(
      <Table><Table.Footer><div data-testid="franja">pie</div></Table.Footer>
        <Table.Body><Table.Row><Table.Cell>x</Table.Cell></Table.Row></Table.Body>
      </Table>,
    )
    const scroller = [...container.querySelectorAll('div')]
      .find(d => getComputedStyle(d).overflowX === 'auto' || /_scroller_/.test(d.className))!
    expect(scroller.contains(screen.getByTestId('franja'))).toBe(false)
  })

  it('una fila que se toca se toca también con el teclado', async () => {
    const onOpen = vi.fn()
    render(
      <Table>
        <Table.Body><Table.Row onClick={onOpen}><Table.Cell>Ana</Table.Cell></Table.Row></Table.Body>
      </Table>,
    )
    const row = screen.getByText('Ana').closest('tr')!
    expect(row).toHaveAttribute('tabindex', '0')
    row.focus()
    await userEvent.keyboard('{Enter}')
    expect(onOpen).toHaveBeenCalledOnce()
    await userEvent.keyboard(' ')
    expect(onOpen).toHaveBeenCalledTimes(2)
  })

  it('una fila que no hace nada no es una parada de tabulación', () => {
    render(
      <Table>
        <Table.Body><Table.Row><Table.Cell>Ana</Table.Cell></Table.Row></Table.Body>
      </Table>,
    )
    expect(screen.getByText('Ana').closest('tr')).not.toHaveAttribute('tabindex')
  })

  it('los encabezados dicen a qué columna encabezan', () => {
    render(
      <Table>
        <Table.Header><Table.Row><Table.Head>Nombre</Table.Head></Table.Row></Table.Header>
        <Table.Body><Table.Row><Table.Cell>Ana</Table.Cell></Table.Row></Table.Body>
      </Table>,
    )
    expect(screen.getByText('Nombre')).toHaveAttribute('scope', 'col')
  })
})
