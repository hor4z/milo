import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { IconButton } from './icon-button'

describe('IconButton', () => {
  it('se nombra con label y no deja un title nativo', () => {
    render(<IconButton icon="search" label="Buscar" />)
    const b = screen.getByRole('button', { name: 'Buscar' })
    expect(b).not.toHaveAttribute('title')
  })
})
