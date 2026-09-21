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
    const contador = screen.getByText((_, el) => el?.className.includes('count') ?? false)
    expect(contador).toHaveTextContent('1/4')
    expect(contador).toHaveTextContent('pasos hechos')
  })

  it('el botón es la flecha sola, y toma su nombre del título de al lado', () => {
    arma()
    const disparador = screen.getByRole('button', { name: 'Primeros pasos' })
    expect(disparador).not.toHaveTextContent('Primeros pasos')
    expect(disparador).toHaveAttribute('aria-labelledby')
    expect(document.getElementById(disparador.getAttribute('aria-labelledby')!))
      .toHaveTextContent('Primeros pasos')
  })

  it('la barra y el contador quedan afuera del botón: si no, se leen como su nombre', () => {
    arma()
    const disparador = screen.getByRole('button', { name: 'Primeros pasos' })
    expect(disparador).not.toHaveTextContent('1/4')
  })

  it('arranca plegada: la cabecera dice lo mismo sin ocupar la pantalla', () => {
    arma()
    const cabecera = screen.getByRole('button', { name: 'Primeros pasos' })
    expect(cabecera).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Creá tu primer espacio')).not.toBeInTheDocument()
  })

  it('se abre al tocarla y la cabecera dice a qué apunta', async () => {
    arma()
    const cabecera = screen.getByRole('button', { name: 'Primeros pasos' })
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
    expect(screen.getByText((_, el) => el?.className.includes('count') ?? false)).toHaveTextContent('0/0')
  })

  it('siendo excluyente se marca uno y los demás se apagan', async () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <Checklist defaultOpen exclusive value={3} onChange={onChange}>
        <Checklist.Title>La idea</Checklist.Title>
        <Checklist.Item>Inicial</Checklist.Item>
        <Checklist.Item>En proceso</Checklist.Item>
        <Checklist.Item>Bueno</Checklist.Item>
        <Checklist.Item>Excelente</Checklist.Item>
      </Checklist>,
    )
    const marcados = () => [...document.querySelectorAll('[data-state="done"]')]
    expect(marcados()).toHaveLength(1)
    expect(marcados()[0].textContent).toContain('Bueno')

    await userEvent.click(screen.getByText('Excelente'))
    expect(onChange).toHaveBeenCalledWith(4)

    rerender(
      <Checklist defaultOpen exclusive value={4} onChange={onChange}>
        <Checklist.Title>La idea</Checklist.Title>
        <Checklist.Item>Inicial</Checklist.Item>
        <Checklist.Item>En proceso</Checklist.Item>
        <Checklist.Item>Bueno</Checklist.Item>
        <Checklist.Item>Excelente</Checklist.Item>
      </Checklist>,
    )
    expect(marcados()).toHaveLength(1)
    expect(marcados()[0].textContent).toContain('Excelente')
  })

  it('siendo excluyente, tocar el marcado no lo apaga: es una escala y hay que estar en algún lado', async () => {
    const onChange = vi.fn()
    render(
      <Checklist defaultOpen exclusive value={2} onChange={onChange}>
        <Checklist.Title>La idea</Checklist.Title>
        <Checklist.Item>Inicial</Checklist.Item>
        <Checklist.Item>En proceso</Checklist.Item>
      </Checklist>,
    )
    await userEvent.click(screen.getByText('En proceso'))
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('la escalera conserva su barra y su contador: es lo que mide cuánto va hecho', () => {
    const { container } = render(
      <Checklist defaultOpen value={1}>
        <Checklist.Title>Los pasos</Checklist.Title>
        <Checklist.Item>Uno</Checklist.Item>
        <Checklist.Item>Dos</Checklist.Item>
      </Checklist>,
    )
    expect(screen.getByText('1/2')).toBeInTheDocument()
    expect(container.querySelector('[class*=track]')).toBeInTheDocument()
  })

  it('siendo excluyente no hay barra ni contador: los dos miden cuánto va hecho, y acá hay un lugar donde estás', () => {
    const { container } = render(
      <Checklist defaultOpen exclusive value={2}>
        <Checklist.Title>La idea</Checklist.Title>
        <Checklist.Item>Inicial</Checklist.Item>
        <Checklist.Item>En proceso</Checklist.Item>
      </Checklist>,
    )
    expect(screen.queryByText('2/2')).not.toBeInTheDocument()
    expect(container.querySelector('[class*=track]')).not.toBeInTheDocument()
  })
})