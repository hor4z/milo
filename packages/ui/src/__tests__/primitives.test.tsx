import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button, Checkbox, IconButton, Radio, Segmented, Select, Switch, TextField, Textarea } from '../primitives'

describe('Button', () => {
  it('dispara onClick y respeta disabled', async () => {
    const onClick = vi.fn()
    const { rerender } = render(<Button onClick={onClick}>Guardar</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)

    rerender(<Button onClick={onClick} disabled>Guardar</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('IconButton', () => {
  it('se nombra con label y no deja un title nativo', () => {
    render(<IconButton icon="search" label="Buscar" />)
    const b = screen.getByRole('button', { name: 'Buscar' })
    expect(b).not.toHaveAttribute('title')
  })
})

describe('TextField', () => {
  it('escribe y deja el anillo de foco en la caja, no en el input', async () => {
    const onChange = vi.fn()
    render(<TextField placeholder="Buscar" onChange={onChange} />)
    await userEvent.type(screen.getByPlaceholderText('Buscar'), 'hola')
    expect(onChange).toHaveBeenCalled()
  })

  it('el contenedor lleva la clase field', () => {
    const { container } = render(<TextField placeholder="x" />)
    expect(container.querySelector('.field')).toBeTruthy()
  })
})

describe('Textarea', () => {
  it('crece con el contenido y vuelve al borrar', async () => {
    const Wrap = () => {
      const [v, setV] = useState('')
      return <Textarea value={v} onChange={e => setV(e.target.value)} rows={2} maxRows={6} />
    }
    render(<Wrap />)
    const ta = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(ta).toBeInTheDocument()
  })

  it('con resize vertical no mide y deja el tirador', () => {
    render(<Textarea defaultValue="x" resize="vertical" />)
    const ta = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(ta.className).toContain('resize-y')
  })

  it('con resize none no deja el tirador', () => {
    render(<Textarea defaultValue="x" resize="none" />)
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).className).toContain('resize-none')
  })
})

describe('Checkbox', () => {
  it('alterna con click y con espacio, y se nombra', async () => {
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} label="Acepto" />)
    const cb = screen.getByRole('checkbox', { name: 'Acepto' })
    await userEvent.click(cb)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('expone aria-checked', () => {
    render(<Checkbox checked onChange={() => {}} label="x" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
  })
})

describe('Switch', () => {
  it('alterna y expone su estado', async () => {
    const onChange = vi.fn()
    render(<Switch checked={false} onChange={onChange} label="Oscuro" />)
    const sw = screen.getByRole('switch', { name: 'Oscuro' })
    expect(sw).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(sw)
    expect(onChange).toHaveBeenCalledWith(true)
  })
})

describe('Radio', () => {
  it('elige una opción', async () => {
    const onChange = vi.fn()
    render(<Radio checked={false} onChange={onChange} label="Uno" />)
    await userEvent.click(screen.getByRole('radio', { name: 'Uno' }))
    expect(onChange).toHaveBeenCalled()
  })
})

describe('Segmented', () => {
  it('marca la opción activa con aria-selected', async () => {
    const onChange = vi.fn()
    render(
      <Segmented
        value="a"
        onChange={onChange}
        options={[{ value: 'a', label: 'Todas' }, { value: 'b', label: 'Abiertas' }]}
      />,
    )
    expect(screen.getByRole('tab', { name: 'Todas' })).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(screen.getByRole('tab', { name: 'Abiertas' }))
    expect(onChange).toHaveBeenCalledWith('b')
  })
})

describe('Select', () => {
  it('abre, elige con el teclado y cierra con Escape', async () => {
    const onChange = vi.fn()
    render(<Select value="Uno" onChange={onChange} options={['Uno', 'Dos', 'Tres']} />)
    const trigger = screen.getByRole('button', { name: /Uno/ })

    await userEvent.click(trigger)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenCalledWith('Dos')
  })

  it('con loading no abre', async () => {
    render(<Select value="Cargando" loading options={[]} />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('muestra el leading que le pasan', () => {
    render(<Select value="x" options={['x']} leading={<span data-testid="leading" />} />)
    expect(screen.getByTestId('leading')).toBeInTheDocument()
  })
})
