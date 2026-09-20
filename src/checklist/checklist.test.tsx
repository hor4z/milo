import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checklist } from './checklist'

const arma = (props: Record<string, unknown> = {}, onClick = vi.fn()) => {
  render(
    <Checklist {...props}>
      <Checklist.Title>Primeros pasos</Checklist.Title>
      <Checklist.Item state="done">Creá tu primer espacio</Checklist.Item>
      <Checklist.Item state="doing" onClick={onClick}>Conectá tu cuenta</Checklist.Item>
      <Checklist.Item state="blocked" hint="Hace falta la cuenta conectada" onClick={onClick}>
        Sumá a tus estudiantes
      </Checklist.Item>
      <Checklist.Item>Ajustá tus preferencias</Checklist.Item>
      <Checklist.Footer>Tocá el logo para volver al inicio.</Checklist.Footer>
    </Checklist>,
  )
  return { onClick }
}

describe('Checklist', () => {
  it('el contador sale de los pasos y no de una prop', () => {
    arma()
    expect(screen.getByRole('button', { name: /Primeros pasos/ })).toHaveTextContent('1/4')
  })

  it('arranca plegada: la cabecera dice lo mismo sin ocupar la pantalla', () => {
    arma()
    const cabecera = screen.getByRole('button', { name: /Primeros pasos/ })
    expect(cabecera).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Creá tu primer espacio')).not.toBeInTheDocument()
  })

  it('se abre al tocarla y la cabecera dice a qué apunta', async () => {
    arma()
    const cabecera = screen.getByRole('button', { name: /Primeros pasos/ })
    await userEvent.click(cabecera)
    expect(cabecera).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Creá tu primer espacio')).toBeInTheDocument()
    expect(document.getElementById(cabecera.getAttribute('aria-controls')!)).toBeInTheDocument()
  })

  it('el paso en curso se anuncia como el actual', async () => {
    arma({ defaultOpen: true })
    expect(screen.getByText('Conectá tu cuenta').closest('[data-state]'))
      .toHaveAttribute('aria-current', 'step')
  })

  it('un paso trabado no se puede tocar, aunque le pasen onClick', async () => {
    const { onClick } = arma({ defaultOpen: true })
    const trabado = screen.getByText('Sumá a tus estudiantes').closest('[data-state]')!
    expect(trabado.tagName).toBe('DIV')
    await userEvent.click(trabado)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('el paso que sí se puede tocar es un botón y responde', async () => {
    const { onClick } = arma({ defaultOpen: true })
    await userEvent.click(screen.getByRole('button', { name: /Conectá tu cuenta/ }))
    expect(onClick).toHaveBeenCalled()
  })

  it('sin pasos hechos el contador no divide por cero', () => {
    render(
      <Checklist defaultOpen>
        <Checklist.Title>Vacía</Checklist.Title>
      </Checklist>,
    )
    expect(screen.getByRole('button', { name: /Vacía/ })).toHaveTextContent('0/0')
  })
})
