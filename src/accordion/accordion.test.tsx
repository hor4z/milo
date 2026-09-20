import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Accordion } from './accordion'

describe('Accordion', () => {
  it('abre y cierra', async () => {
    render(
      <Accordion>
        <Accordion.Item><Accordion.Summary>¿Cómo entrego?</Accordion.Summary><Accordion.Body>Desde la actividad.</Accordion.Body></Accordion.Item>
      </Accordion>,
    )
    const details = screen.getByText('¿Cómo entrego?').closest('details')!
    expect(details.open).toBe(false)
    await userEvent.click(screen.getByText('¿Cómo entrego?'))
    expect(details.open).toBe(true)
  })

  it('una fila no cierra a las otras', async () => {
    render(
      <Accordion>
        <Accordion.Item defaultOpen><Accordion.Summary>Uno</Accordion.Summary><Accordion.Body>Contenido uno</Accordion.Body></Accordion.Item>
        <Accordion.Item defaultOpen><Accordion.Summary>Dos</Accordion.Summary><Accordion.Body>Contenido dos</Accordion.Body></Accordion.Item>
      </Accordion>,
    )
    const [first, second] = screen.getAllByText(/^(Uno|Dos)$/).map(s => s.closest('details')!)
    expect(first.open).toBe(true)
    expect(second.open).toBe(true)
    await userEvent.click(screen.getByText('Uno'))
    expect(first.open).toBe(false)
    expect(second.open).toBe(true)
  })

  it('lo cerrado sigue en el documento, así que Ctrl+F lo encuentra', () => {
    render(
      <Accordion>
        <Accordion.Item><Accordion.Summary>¿Cómo entrego?</Accordion.Summary><Accordion.Body>Desde la actividad.</Accordion.Body></Accordion.Item>
      </Accordion>,
    )
    expect(screen.getByText('Desde la actividad.')).toBeInTheDocument()
  })
})
