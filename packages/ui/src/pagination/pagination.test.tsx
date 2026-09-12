import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Pagination, PaginationNext, PaginationPrev, PaginationStatus } from './pagination'

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

  it('la franja se anuncia como la navegación de la tabla', () => {
    render(
      <Pagination>
        <PaginationStatus to={4} total={9} noun={['actividad', 'actividades']} />
      </Pagination>,
    )
    expect(screen.getByRole('navigation', { name: 'Paginación' })).toBeInTheDocument()
  })
})
