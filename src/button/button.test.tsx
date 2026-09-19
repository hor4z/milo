import { Icon } from '../icon/icon'
import { act, render, screen } from '@testing-library/react'
import { estilo } from '../__tests__/estilo'
import s from './button.module.css'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it.each([['sm', '--radius-md'], ['md', '--radius-lg'], ['lg', '--radius-lg']] as const)(
    'el radio de %s sigue a su alto',
    (size, radius) => {
      render(<Button size={size}>Guardar</Button>)
      expect(estilo(screen.getByRole('button'))).toContain(`border-radius: var(${radius})`)
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
    render(<Button iconStart={<Icon name="add" />} iconEnd={<Icon name="chevron_right" />}>Nueva actividad</Button>)
    expect(screen.getByRole('button', { name: 'Nueva actividad' })).toBeInTheDocument()
  })

  it('el tamaño y la variante son clases, no medidas escritas a mano', () => {
    const { rerender } = render(<Button size="sm">Guardar</Button>)
    expect(estilo(screen.getByRole('button'))).toContain('height: 2.25rem')
    rerender(<Button size="lg">Guardar</Button>)
    expect(estilo(screen.getByRole('button'))).toContain('height: 2.75rem')
    rerender(<Button variant="solid">Guardar</Button>)
    expect(screen.getByRole('button').className).toContain(s.motion)
  })

  it('cargando no acepta clicks', async () => {
    const onClick = vi.fn()
    render(<Button loading onClick={onClick}>Guardar</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('una respuesta más rápida que una transición no llega a mostrar el spinner', async () => {
    vi.useFakeTimers()
    const { rerender } = render(<Button loading>Guardar</Button>)
    await act(async () => { vi.advanceTimersByTime(100) })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    rerender(<Button>Guardar</Button>)
    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  it('una vez que apareció, el spinner se queda aunque la respuesta ya volvió', async () => {
    vi.useFakeTimers()
    const { rerender } = render(<Button loading>Guardar</Button>)
    await act(async () => { vi.advanceTimersByTime(130) })
    expect(screen.getByRole('status')).toBeInTheDocument()

    rerender(<Button>Guardar</Button>)
    await act(async () => { vi.advanceTimersByTime(100) })
    expect(screen.getByRole('status'), 'se fue antes de que el ojo lo registre').toBeInTheDocument()

    await act(async () => { vi.advanceTimersByTime(300) })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  it('el spinner ocupa el lugar del iconStart y no se suman los dos', async () => {
    vi.useFakeTimers()
    const { container } = render(<Button loading iconStart={<Icon name="folder" />}>Guardar</Button>)
    await act(async () => { vi.advanceTimersByTime(130) })
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(container.querySelectorAll('.ms-icon')).toHaveLength(0)
    vi.useRealTimers()
  })

  it('block ocupa la fila entera', () => {
    render(<Button block>Guardar</Button>)
    expect(estilo(screen.getByRole('button'))).toContain('width: 100%')
  })
})
