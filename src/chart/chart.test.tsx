import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { BarChart } from './chart'

describe('BarChart', () => {
  const data = [
    { label: 'Lun', value: 3, total: 6 },
    { label: 'Mar', value: 6, total: 6 },
  ]

  it('nombra cada barra con lo hecho y el total', () => {
    render(<BarChart title="Semana" data={data} />)
    expect(screen.getByRole('button', { name: 'Lun: 3 de 6' })).toBeInTheDocument()
  })

  it('deja los valores en una tabla con encabezados', () => {
    render(<BarChart title="Semana" data={data} />)
    expect(screen.getByRole('table')).toHaveTextContent('Hecho')
    expect(screen.getByRole('table')).toHaveTextContent('Total')
  })

  it('muestra el tooltip al enfocar y lo saca al salir', async () => {
    render(<BarChart title="Semana" data={data} />)
    await userEvent.tab()
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('3'))
  })

  it('sobrevive a que la serie se acorte con una barra activa', async () => {
    const Demo = () => {
      const [d, setD] = useState(data)
      return (
        <>
          <button onClick={() => setD([data[0]])}>achicar</button>
          <BarChart title="Semana" data={d} />
        </>
      )
    }
    render(<Demo />)
    const bars = screen.getAllByRole('button').filter(b => b.getAttribute('aria-label'))
    bars[1].focus()
    await userEvent.click(screen.getByText('achicar'))
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})
