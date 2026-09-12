import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Spinner } from './spinner'

describe('Spinner', () => {
  it('se anuncia como estado con su nombre', () => {
    render(<Spinner label="Guardando" />)
    expect(screen.getByRole('status', { name: 'Guardando' })).toBeInTheDocument()
  })
})
