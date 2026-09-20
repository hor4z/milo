import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar } from './avatar'

describe('Avatar', () => {
  it('sin foto cae a las iniciales', () => {
    render(<Avatar name="Ana Pérez" />)
    expect(screen.getByText('AP')).toBeInTheDocument()
  })

  it('el grupo publica los nombres para quien no ve las caras', () => {
    render(<Avatar.Group people={[{ name: 'Ana Pérez' }, { name: 'Bruno Díaz' }]} />)
    expect(screen.getByText('Ana Pérez, Bruno Díaz')).toBeInTheDocument()
  })

  it('con más gente que el máximo muestra el resto', () => {
    const { container } = render(
      <Avatar.Group max={2} people={[{ name: 'A A' }, { name: 'B B' }, { name: 'C C' }, { name: 'D D' }]} />,
    )
    expect(container.textContent).toContain('+2')
  })
})

describe('Avatar · la cadena de respaldo', () => {
  it('si la foto no carga, queda la inicial y no un hueco', () => {
    const { container } = render(<Avatar name="Ana Pérez" src="/no-existe.webp" />)
    const img = container.querySelector('img')!
    expect(img).toBeInTheDocument()
    fireEvent.error(img)
    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container.textContent).toContain('AP')
  })

  it('una foto nueva vuelve a intentarse', () => {
    const { container, rerender } = render(<Avatar name="Ana Pérez" src="/rota.webp" />)
    fireEvent.error(container.querySelector('img')!)
    expect(container.querySelector('img')).not.toBeInTheDocument()
    rerender(<Avatar name="Ana Pérez" src="/otra.webp" />)
    expect(container.querySelector('img')).toBeInTheDocument()
  })

  it('suelto no dice nada, y con label se anuncia', () => {
    const { rerender } = render(<Avatar name="Ana Pérez" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    rerender(<Avatar name="Ana Pérez" label="Ana Pérez" />)
    expect(screen.getByRole('img', { name: 'Ana Pérez' })).toBeInTheDocument()
  })

  it('los nombres del grupo se anuncian: con hidden no los leía nadie', () => {
    render(<Avatar.Group people={[{ name: 'Ana Pérez' }, { name: 'Bruno Díaz' }]} />)
    expect(screen.getByText('Ana Pérez, Bruno Díaz')).toBeInTheDocument()
  })
})
