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

  it('no se pasa de los bordes', () => {
    render(<Progress value={999} max={10} label="x" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '999')
  })
})
