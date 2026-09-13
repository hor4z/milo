import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Chip } from './chip'

describe('Chip', () => {
  it('se puede quitar', async () => {
    const onRemove = vi.fn()
    render(<Chip onRemove={onRemove}>Matemática</Chip>)
    await userEvent.click(screen.getByRole('button', { name: 'Quitar' }))
    expect(onRemove).toHaveBeenCalled()
  })

  it('sin onClick no es un botón', () => {
    render(<Chip>Borrador</Chip>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('quitar no dispara también el click del chip', async () => {
    const onClick = vi.fn()
    const onRemove = vi.fn()
    render(<Chip onClick={onClick} onRemove={onRemove}>Matemática</Chip>)
    await userEvent.click(screen.getByRole('button', { name: 'Quitar' }))
    expect(onRemove).toHaveBeenCalledOnce()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('tocar el chip sigue funcionando cuando además se puede quitar', async () => {
    const onClick = vi.fn()
    render(<Chip onClick={onClick} onRemove={() => {}}>Matemática</Chip>)
    await userEvent.click(screen.getByRole('button', { name: 'Matemática' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('los dos son botones hermanos, no uno adentro del otro', () => {
    const { container } = render(<Chip onClick={() => {}} onRemove={() => {}}>Matemática</Chip>)
    expect(container.querySelector('button button')).toBeNull()
  })

  it('el estado se lee en el texto y no solo en el color', () => {
    render(<Chip color="ok" icon="check_circle">Corregida</Chip>)
    expect(screen.getByText('Corregida')).toBeInTheDocument()
  })

  it('los diez colores entran por la misma prop, los de estado y los de categoría', () => {
    const { container } = render(
      <>
        <Chip color="warn">Vence</Chip>
        <Chip color="purple">Taller</Chip>
      </>,
    )
    const [estado, categoria] = [...container.children] as HTMLElement[]
    expect(estado.className).toContain('warn')
    expect(categoria.className).toContain('label-purple')
  })

  it('sm es más chico que md y es el que va pegado a un título', () => {
    const { container: sm } = render(<Chip size="sm">Borrador</Chip>)
    const { container: md } = render(<Chip>Borrador</Chip>)
    expect(sm.querySelector('span')!.className).toContain('min-h-5')
    expect(md.querySelector('span')!.className).toContain('min-h-7')
  })

  it('no se achica: el que envuelve el renglón es el título, no la marca', () => {
    const { container } = render(<Chip size="sm">Vence mañana</Chip>)
    expect(container.querySelector('span')!.className).toContain('shrink-0')
  })

  it('pasa de largo lo que le pongan de la etiqueta nativa', () => {
    const { container } = render(<Chip id="estado" title="Corregida el martes">Corregida</Chip>)
    const chip = container.querySelector('span')!
    expect(chip.id).toBe('estado')
    expect(chip.title).toBe('Corregida el martes')
  })
})
