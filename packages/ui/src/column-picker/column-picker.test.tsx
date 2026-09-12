import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ColumnPicker } from './column-picker'

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
