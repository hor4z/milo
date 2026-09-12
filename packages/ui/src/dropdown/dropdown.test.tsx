import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../button/button'
import { Dropdown } from './dropdown'

describe('Dropdown', () => {
  it('corre la acción de la opción elegida', async () => {
    const onSelect = vi.fn()
    render(
      <Dropdown
        items={[{ label: 'Salir', onSelect }]}
        trigger={({ onClick, ref, ...r }) => <Button ref={ref} onClick={onClick} {...r}>Menú</Button>}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Menú' }))
    await userEvent.click(screen.getByText('Salir'))
    expect(onSelect).toHaveBeenCalled()
  })
})
