import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Breadcrumb } from './breadcrumb'

describe('Breadcrumb', () => {
  it('marca dónde estás y deja volver', async () => {
    const onClick = vi.fn()
    render(<Breadcrumb items={[{ label: 'Espacios', onClick }, { label: 'Matemática' }]} />)
    expect(screen.getByText('Matemática')).toHaveAttribute('aria-current', 'page')
    await userEvent.click(screen.getByText('Espacios'))
    expect(onClick).toHaveBeenCalled()
  })
})
