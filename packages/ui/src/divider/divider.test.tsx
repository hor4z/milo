import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Divider } from './divider'

describe('Divider', () => {
  it('se anuncia como separador horizontal', () => {
    render(<Divider />)
    const line = screen.getByRole('separator')
    expect(line).toHaveAttribute('aria-orientation', 'horizontal')
    expect(line).toHaveClass('h-px')
  })

  it('vertical cambia la orientación y el eje que ocupa', () => {
    render(<Divider orientation="vertical" />)
    const line = screen.getByRole('separator')
    expect(line).toHaveAttribute('aria-orientation', 'vertical')
    expect(line).toHaveClass('w-px', 'self-stretch')
  })
})
