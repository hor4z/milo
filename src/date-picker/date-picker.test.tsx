import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DatePicker } from './date-picker'

const open = async (props: Partial<Parameters<typeof DatePicker>[0]> = {}) => {
  const onChange = vi.fn()
  render(<DatePicker value="2026-03-09" onChange={onChange} label="Vence" {...props} />)
  await userEvent.click(screen.getByRole('button', { name: /Vence|marzo|Elegir/ }))
  return { onChange }
}

describe('DatePicker', () => {
  it('el campo dice la fecha en palabras y no en números sueltos', () => {
    render(<DatePicker value="2026-03-09" onChange={() => {}} label="Vence" />)
    expect(screen.getByRole('button', { name: 'Vence' })).toHaveTextContent(/9 de marzo de 2026/)
  })

  it('sin fecha dice qué falta', () => {
    render(<DatePicker value="" onChange={() => {}} label="Vence" placeholder="Elegir fecha" />)
    expect(screen.getByRole('button', { name: 'Vence' })).toHaveTextContent('Elegir fecha')
  })

  it('abre en el mes de la fecha elegida', async () => {
    await open()
    expect(screen.getByRole('dialog')).toHaveAccessibleName(/marzo de 2026/i)
  })

  it('cada día se nombra entero, no con su número', async () => {
    await open()
    expect(screen.getByRole('gridcell', { name: /lunes, 9 de marzo de 2026/i })).toBeInTheDocument()
  })

  it('elegir un día lo devuelve como AAAA-MM-DD', async () => {
    const { onChange } = await open()
    await userEvent.click(screen.getByRole('gridcell', { name: /jueves, 12 de marzo de 2026/i }))
    expect(onChange).toHaveBeenCalledWith('2026-03-12')
  })

  it('las flechas mueven de a un día y una semana', async () => {
    await open()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('gridcell', { name: /martes, 10 de marzo/i })).toHaveAttribute('tabindex', '0')
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('gridcell', { name: /martes, 17 de marzo/i })).toHaveAttribute('tabindex', '0')
  })

  it('las flechas cruzan de mes sin que haya que tocar el título', async () => {
    await open({ value: '2026-03-31' })
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('dialog')).toHaveAccessibleName(/abril de 2026/i)
  })

  it('Re Pág y Av Pág cambian el mes, y con Shift el año', async () => {
    await open()
    await userEvent.keyboard('{PageDown}')
    expect(screen.getByRole('dialog')).toHaveAccessibleName(/abril de 2026/i)
    await userEvent.keyboard('{Shift>}{PageUp}{/Shift}')
    expect(screen.getByRole('dialog')).toHaveAccessibleName(/abril de 2025/i)
  })

  it('Inicio y Fin van a los extremos de la semana, que empieza el lunes', async () => {
    await open()
    await userEvent.keyboard('{Home}')
    expect(screen.getByRole('gridcell', { name: /lunes, 9 de marzo/i })).toHaveAttribute('tabindex', '0')
    await userEvent.keyboard('{End}')
    expect(screen.getByRole('gridcell', { name: /domingo, 15 de marzo/i })).toHaveAttribute('tabindex', '0')
  })

  it('lo que está fuera de rango no se puede elegir', async () => {
    const { onChange } = await open({ min: '2026-03-10' })
    const before = screen.getByRole('gridcell', { name: /jueves, 5 de marzo/i })
    expect(before).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(before)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('Enter elige el día donde está el cursor', async () => {
    const { onChange } = await open()
    await userEvent.keyboard('{ArrowRight}{Enter}')
    expect(onChange).toHaveBeenCalledWith('2026-03-10')
  })

  it('Escape cierra y el foco vuelve al campo', async () => {
    await open()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Vence' })).toHaveFocus()
  })

  it('tocar afuera cierra sin elegir nada', async () => {
    const { onChange } = await open()
    await userEvent.click(document.body)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('los días de otro mes no ocupan celdas con número', async () => {
    await open()
    const blanks = [...screen.getAllByRole('gridcell')].filter(c => !c.textContent?.trim())
    expect(blanks.length).toBeGreaterThan(0)
    expect(screen.queryByRole('gridcell', { name: /de febrero/i })).toBeNull()
  })

  it('al abrir, el foco aterriza en el día del cursor y no en el panel', async () => {
    await open()
    expect(screen.getByRole('gridcell', { name: /lunes, 9 de marzo de 2026/i })).toHaveFocus()
  })

  it('sin fecha, el campo dice qué falta', () => {
    const { container } = render(<DatePicker value="" onChange={() => {}} label="Fecha" />)
    expect(container.querySelector('button')?.textContent).toContain('Elegir fecha')
  })

  it('scrollear la página cierra el mes, que quedaba flotando lejos del campo', async () => {
    await open()
    window.dispatchEvent(new Event('scroll'))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
