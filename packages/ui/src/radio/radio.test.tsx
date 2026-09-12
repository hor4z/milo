import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Radio } from './radio'

describe('Radio', () => {
  it('elige una opción', async () => {
    const onChange = vi.fn()
    render(<Radio checked={false} onChange={onChange} label="Uno" />)
    await userEvent.click(screen.getByRole('radio', { name: 'Uno' }))
    expect(onChange).toHaveBeenCalled()
  })
})
