import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './badge'

describe('Badge', () => {
  it('dice su estado con texto y no solo con color', () => {
    render(<Badge tone="ok" icon="check_circle">Corregida</Badge>)
    expect(screen.getByText('Corregida')).toBeInTheDocument()
  })
})
