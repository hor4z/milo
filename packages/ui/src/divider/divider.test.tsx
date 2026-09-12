import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Divider } from './divider'

describe('Divider', () => {
  it('se anuncia como separador horizontal', () => {
    render(<Divider />)
    const linea = screen.getByRole('separator')
    expect(linea).toHaveAttribute('aria-orientation', 'horizontal')
    expect(linea).toHaveClass('h-px')
  })

  it('vertical cambia la orientación y el eje que ocupa', () => {
    render(<Divider orientation="vertical" />)
    const linea = screen.getByRole('separator')
    expect(linea).toHaveAttribute('aria-orientation', 'vertical')
    expect(linea).toHaveClass('w-px', 'self-stretch')
  })
})
