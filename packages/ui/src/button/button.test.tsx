import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  // El radio sigue al alto: el radio se lee en proporción al lado más corto, no
  // en píxeles. Sobre 32 de alto, 12 deja 8 de lado plano y el botón se lee como
  // una pastilla; sobre 40 deja 16 y se lee como un remate.
  it.each([['sm', 'rounded-md'], ['md', 'rounded-lg'], ['lg', 'rounded-lg']] as const)(
    'el radio de %s sigue a su alto',
    (size, radius) => {
      render(<Button size={size}>Guardar</Button>)
      expect(screen.getByRole('button')).toHaveClass(radius)
    },
  )

  it('dispara onClick y respeta disabled', async () => {
    const onClick = vi.fn()
    const { rerender } = render(<Button onClick={onClick}>Guardar</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)

    rerender(<Button onClick={onClick} disabled>Guardar</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('adentro de un form no manda el form sin querer', async () => {
    const onSubmit = vi.fn(e => e.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <Button>Cancelar</Button>
      </form>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('el que sí manda lo pide', async () => {
    const onSubmit = vi.fn(e => e.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit">Crear</Button>
      </form>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Crear' }))
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('los iconos acompañan al texto sin robarle el nombre', () => {
    render(<Button icon="add" iconEnd="chevron_right">Nueva actividad</Button>)
    expect(screen.getByRole('button', { name: 'Nueva actividad' })).toBeInTheDocument()
  })

  it('el tamaño y la variante son clases, no medidas escritas a mano', () => {
    const { rerender } = render(<Button size="sm">Guardar</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-8')
    rerender(<Button size="lg">Guardar</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10')
    rerender(<Button variant="solid">Guardar</Button>)
    expect(screen.getByRole('button').className).toContain('bg-solid')
  })

  it('block ocupa la fila entera', () => {
    render(<Button block>Guardar</Button>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })
})
