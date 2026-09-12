import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ColumnPicker, Filter, FilterSearch, facets } from './filter'

describe('facets', () => {
  it('cuenta por clave y saltea nulos', () => {
    const rows = [{ e: 'a' }, { e: 'b' }, { e: 'a' }, { e: undefined }]
    expect(facets(rows, f => f.e)).toEqual({ a: 2, b: 1 })
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

  it('cada opción se anuncia una vez, con su número adentro del nombre', async () => {
    render(
      <Filter
        label="Estado"
        options={[{ value: 'Abierta', count: 4 }, { value: 'Corregida', count: 3 }]}
        value={[]}
        onValueChange={() => {}}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Estado' }))
    expect(screen.getByRole('checkbox', { name: 'Abierta, 4' })).toBeInTheDocument()
    // El texto de al lado es el mismo y no se anuncia de nuevo.
    expect(screen.queryAllByText('Abierta')).toHaveLength(1)
    expect(screen.getByText('Abierta')).toHaveAttribute('aria-hidden', 'true')
  })
})
