import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Switch } from './switch'

describe('Switch', () => {
  it('alterna y expone su estado', async () => {
    const onChange = vi.fn()
    render(<Switch checked={false} onChange={onChange} label="Oscuro" />)
    const sw = screen.getByRole('switch', { name: 'Oscuro' })
    expect(sw).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(sw)
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
