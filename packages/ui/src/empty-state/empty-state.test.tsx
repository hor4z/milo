import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  it('lleva su salida y el icono no se anuncia', () => {
    render(<EmptyState icon="inbox" title="Nada acá" body="Todavía no llegó nada." action={<button>Crear</button>} />)
    expect(screen.getByText('Nada acá')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Crear' })).toBeInTheDocument()
  })
})
