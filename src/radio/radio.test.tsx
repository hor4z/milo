import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Radio } from './radio'

const options = [
  { value: 'a' as const, label: 'Solo yo' },
  { value: 'b' as const, label: 'Todo el equipo' },
  { value: 'c' as const, label: 'Cualquiera con el link' },
]

describe('Radio', () => {
  it('elige una opción', async () => {
    const onChange = vi.fn()
    render(<Radio checked={false} onChange={onChange} label="Uno" />)
    await userEvent.click(screen.getByRole('radio', { name: 'Uno' }))
    expect(onChange).toHaveBeenCalled()
  })

  it('apagado no se toca', async () => {
    const onChange = vi.fn()
    render(<Radio checked={false} onChange={onChange} label="Uno" disabled />)
    await userEvent.click(screen.getByRole('radio', { name: 'Uno' }))
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('RadioGroup', () => {
  it('se anuncia como grupo y marca la elegida', () => {
    render(<Radio.Group value="b" onChange={() => {}} options={options} label="Quién ve" />)
    expect(screen.getByRole('radiogroup', { name: 'Quién ve' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Todo el equipo' })).toHaveAttribute('aria-checked', 'true')
  })

  it('las flechas mueven la elección y dan la vuelta', async () => {
    const onChange = vi.fn()
    render(<Radio.Group value="a" onChange={onChange} options={options} label="Quién ve" />)
    screen.getByRole('radio', { name: 'Solo yo' }).focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(onChange).toHaveBeenCalledWith('b')
    onChange.mockClear()
    await userEvent.keyboard('{ArrowUp}')
    expect(onChange).toHaveBeenCalledWith('c')
  })

  it('Tab entra al grupo y sale: una sola parada', () => {
    render(<Radio.Group value="c" onChange={() => {}} options={options} label="Quién ve" />)
    expect(screen.getByRole('radio', { name: 'Cualquiera con el link' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('radio', { name: 'Solo yo' })).toHaveAttribute('tabindex', '-1')
  })

  it('sin ninguna elegida, la parada es la primera', () => {
    render(<Radio.Group value={'z' as 'a'} onChange={() => {}} options={options} label="Quién ve" />)
    expect(screen.getByRole('radio', { name: 'Solo yo' })).toHaveAttribute('tabindex', '0')
  })

  it('las flechas saltean las apagadas', async () => {
    const onChange = vi.fn()
    render(
      <Radio.Group
        value="a"
        onChange={onChange}
        options={[options[0], { ...options[1], disabled: true }, options[2]]}
        label="Quién ve"
      />,
    )
    screen.getByRole('radio', { name: 'Solo yo' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('c')
  })
})
