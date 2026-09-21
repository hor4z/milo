import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CriterionCard, type Criterion } from './criterion-card'

const criterion: Criterion = {
  id: 'datos',
  label: 'Toma de datos',
  weight: 3,
  color: 'green',
  levels: ['Una sola medición', 'Las tres, sin el error', 'Las tres, con el error'],
}

const arma = (props: Record<string, unknown> = {}) => {
  const onToggle = vi.fn()
  const onRemove = vi.fn()
  render(
    <CriterionCard
      criterion={criterion}
      total={12}
      open
      onToggle={onToggle}
      onRemove={onRemove}
      {...props}
    />,
  )
  return { onToggle, onRemove }
}

describe('CriterionCard', () => {
  it('la cabecera pliega, y toma su nombre del título de al lado', async () => {
    const { onToggle } = arma()
    const disparador = screen.getByRole('button', { name: /^Toma de datos/ })

    expect(disparador).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(disparador)
    expect(onToggle).toHaveBeenCalled()
  })

  it('cerrada, los niveles no juntan foco ni los lee nadie', () => {
    arma({ open: false })
    const disparador = screen.getByRole('button', { name: /^Toma de datos/ })
    expect(disparador).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById(disparador.getAttribute('aria-controls')!))
      .toHaveAttribute('inert')
  })

  it('dice cuánto vale, para quien no ve la barra de la rúbrica', () => {
    arma()
    expect(screen.getByText(', vale 25% de la nota')).toBeInTheDocument()
  })

  it('los niveles van en orden, del más flojo al más completo', () => {
    arma()
    const pasos = screen.getAllByRole('listitem')
    expect(pasos.map(p => p.textContent)).toEqual(criterion.levels)
  })

  it('el tacho dice de qué criterio es, y avisa', async () => {
    const { onRemove } = arma()
    await userEvent.click(screen.getByRole('button', { name: 'Sacar Toma de datos de la rúbrica' }))
    expect(onRemove).toHaveBeenCalled()
  })

  it('sin onRemove no hay nada que sacar', () => {
    arma({ onRemove: undefined })
    expect(screen.queryByRole('button', { name: /^Sacar/ })).not.toBeInTheDocument()
  })

  it('definiendo la rúbrica no hay nada que marcar: los renglones van con viñeta', () => {
    const { container } = render(
      <CriterionCard criterion={criterion} total={12} open onToggle={() => {}} />,
    )
    expect(container.querySelectorAll('[class*=bullet]')).toHaveLength(criterion.levels.length)
    expect(container.querySelector('[class*=pick]')).not.toBeInTheDocument()
  })

  it('leyendo una devolución, la marca va solo en el nivel que quedó', () => {
    const { container } = render(
      <CriterionCard criterion={criterion} total={12} level={1} open onToggle={() => {}} />,
    )
    expect(container.querySelectorAll('[class*=pick]')).toHaveLength(1)
    expect(container.querySelectorAll('[class*=bullet]')).toHaveLength(criterion.levels.length - 1)
  })
})