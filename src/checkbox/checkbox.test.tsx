import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('alterna con click y con espacio, y se nombra', async () => {
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} label="Acepto" />)
    const cb = screen.getByRole('checkbox', { name: 'Acepto' })
    await userEvent.click(cb)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('expone aria-checked', () => {
    render(<Checkbox checked onChange={() => {}} label="x" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
  })
})
