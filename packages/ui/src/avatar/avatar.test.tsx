import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar, AvatarGroup } from './avatar'

describe('Avatar', () => {
  it('sin foto cae a las iniciales', () => {
    render(<Avatar name="Ana Pérez" />)
    expect(screen.getByText('AP')).toBeInTheDocument()
  })

  it('el grupo publica los nombres para quien no ve las caras', () => {
    render(<AvatarGroup people={[{ name: 'Ana Pérez' }, { name: 'Bruno Díaz' }]} />)
    expect(screen.getByText('Ana Pérez, Bruno Díaz')).toBeInTheDocument()
  })

  it('con más gente que el máximo muestra el resto', () => {
    const { container } = render(
      <AvatarGroup max={2} people={[{ name: 'A A' }, { name: 'B B' }, { name: 'C C' }, { name: 'D D' }]} />,
    )
    expect(container.textContent).toContain('+2')
  })
})
