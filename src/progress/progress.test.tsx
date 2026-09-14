import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Progress } from './progress'

describe('Progress', () => {
  it('expone valor y nombre', () => {
    render(<Progress value={30} max={60} label="Corregidas" hint="30/60" />)
    const bar = screen.getByRole('progressbar', { name: 'Corregidas' })
    expect(bar).toHaveAttribute('aria-valuenow', '30')
    expect(bar).toHaveAttribute('aria-valuemax', '60')
  })

  it('el valor que se anuncia no se sale del rango', () => {
    const { rerender } = render(<Progress value={999} max={10} label="Corregidas" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '10')
    rerender(<Progress value={-4} max={10} label="Corregidas" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('el nombre accesible es el rótulo que se ve', () => {
    render(<Progress value={3} max={10} label="Corregidas" />)
    const bar = screen.getByRole('progressbar', { name: 'Corregidas' })
    expect(bar.getAttribute('aria-labelledby')).toBe(screen.getByText('Corregidas').id)
  })
})
