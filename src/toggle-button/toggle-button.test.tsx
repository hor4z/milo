import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ToggleButton } from './toggle-button'

describe('ToggleButton', () => {
  it('dice en qué estado está, y eso es lo que lo separa de un botón', () => {
    render(<ToggleButton pressed icon="format_bold" label="Negrita" />)
    expect(screen.getByRole('button', { name: 'Negrita', pressed: true })).toBeInTheDocument()
  })

  it('avisa el estado nuevo, no el que tenía', async () => {
    const onPressedChange = vi.fn()
    render(<ToggleButton pressed={false} onPressedChange={onPressedChange} icon="format_bold" label="Negrita" />)
    await userEvent.click(screen.getByRole('button'))
    expect(onPressedChange).toHaveBeenCalledWith(true)
  })

  it('con texto adentro no se pisa el nombre con el label', () => {
    render(<ToggleButton pressed={false} icon="grid_view" label="ignorado">Grilla</ToggleButton>)
    expect(screen.getByRole('button', { name: 'Grilla' })).toBeInTheDocument()
  })

  it('apagado no responde', async () => {
    const onPressedChange = vi.fn()
    render(<ToggleButton pressed={false} disabled onPressedChange={onPressedChange} icon="format_bold" label="Negrita" />)
    await userEvent.click(screen.getByRole('button'))
    expect(onPressedChange).not.toHaveBeenCalled()
  })

  it('es type=button, que adentro de un form no manda el form', () => {
    render(<ToggleButton pressed={false} icon="format_bold" label="Negrita" />)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})
