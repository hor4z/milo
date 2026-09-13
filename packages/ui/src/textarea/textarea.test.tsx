import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Textarea } from './textarea'

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

  const cuenta = (c: HTMLElement) => {
    const id = c.querySelector('textarea')!.getAttribute('aria-describedby')!
    return c.querySelector(`#${CSS.escape(id)}`)!.textContent
  }

  it('sin counter no hay cuenta', () => {
    render(<Textarea aria-label="Devolución" maxLength={100} />)
    expect(screen.queryByText('0/100')).not.toBeInTheDocument()
  })

  it('cuenta lo escrito contra el máximo', async () => {
    const { container } = render(<Textarea aria-label="Devolución" counter maxLength={100} />)
    await userEvent.type(screen.getByLabelText('Devolución'), 'hola')
    expect(cuenta(container)).toBe('4/100')
  })

  it('cerca del techo deja de contar y dice cuánto queda', async () => {
    const { container } = render(<Textarea aria-label="Devolución" counter maxLength={12} />)
    await userEvent.type(screen.getByLabelText('Devolución'), 'hola mun')
    expect(cuenta(container)).toBe('te quedan 4')
  })

  it('abajo del mínimo dice cuánto falta, que es lo accionable', async () => {
    const { container } = render(<Textarea aria-label="Devolución" counter minLength={10} maxLength={200} />)
    await userEvent.type(screen.getByLabelText('Devolución'), 'hola')
    expect(cuenta(container)).toBe('faltan 6 caracteres')
  })

  it('el singular no dice "1 caracteres"', async () => {
    const { container } = render(<Textarea aria-label="Devolución" counter minLength={5} />)
    await userEvent.type(screen.getByLabelText('Devolución'), 'hola')
    expect(cuenta(container)).toBe('falta 1 carácter')
  })

  it('la cuenta describe al campo, así que un lector la escucha al entrar', () => {
    const { container } = render(<Textarea aria-label="Devolución" counter maxLength={100} />)
    expect(cuenta(container)).toBe('0/100')
  })

  it('con la cuenta no lleva flex-1: en una caja en columna el flex le gana al alto que el campo calcula, y el texto queda cortado', () => {
    const { container, rerender } = render(<Textarea aria-label="Devolución" counter maxLength={100} />)
    expect(container.querySelector('textarea')!.className).not.toContain('flex-1')
    rerender(<Textarea aria-label="Devolución" />)
    expect(container.querySelector('textarea')!.className).toContain('flex-1')
  })

  it('mide en caracteres y no en unidades de código: un emoji es uno', () => {
    const { container } = render(<Textarea aria-label="Devolución" counter maxLength={100} value={'\u{1F600}\u{1F600}'} onChange={() => {}} />)
    expect(cuenta(container)).toBe('2/100')
  })
})
