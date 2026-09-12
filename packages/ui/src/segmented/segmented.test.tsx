import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Segmented } from './segmented'

describe('Segmented', () => {
  it('marca la opción activa con aria-selected', async () => {
    const onChange = vi.fn()
    render(
      <Segmented
        value="a"
        onChange={onChange}
        options={[{ value: 'a', label: 'Todas' }, { value: 'b', label: 'Abiertas' }]}
      />,
    )
    expect(screen.getByRole('tab', { name: 'Todas' })).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(screen.getByRole('tab', { name: 'Abiertas' }))
    expect(onChange).toHaveBeenCalledWith('b')
  })
})
