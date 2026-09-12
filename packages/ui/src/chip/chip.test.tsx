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

  it('quitar no dispara también el click del chip', async () => {
    const onClick = vi.fn()
    const onRemove = vi.fn()
    render(<Chip onClick={onClick} onRemove={onRemove}>Matemática</Chip>)
    await userEvent.click(screen.getByRole('button', { name: 'Quitar' }))
    expect(onRemove).toHaveBeenCalledOnce()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('tocar el chip sigue funcionando cuando además se puede quitar', async () => {
    const onClick = vi.fn()
    render(<Chip onClick={onClick} onRemove={() => {}}>Matemática</Chip>)
    await userEvent.click(screen.getByRole('button', { name: 'Matemática' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('los dos son botones hermanos, no uno adentro del otro', () => {
    const { container } = render(<Chip onClick={() => {}} onRemove={() => {}}>Matemática</Chip>)
    expect(container.querySelector('button button')).toBeNull()
  })
})
