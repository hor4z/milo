import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Chip } from './chip'

describe('Chip', () => {
  it('se puede quitar', async () => {
    const onRemove = vi.fn()
    render(<Chip onRemove={onRemove}>Matemática</Chip>)
    await userEvent.click(screen.getByRole('button', { name: 'Quitar' }))
    expect(onRemove).toHaveBeenCalled()
  })

  it('sin onClick no es un botón', () => {
    render(<Chip>Borrador</Chip>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
