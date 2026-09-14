import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Accordion, AccordionItem } from './accordion'

describe('Accordion', () => {
  it('abre y cierra', async () => {
    render(
      <Accordion>
        <AccordionItem summary="¿Cómo entrego?">Desde la actividad.</AccordionItem>
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
        <AccordionItem summary="Uno" defaultOpen>Contenido uno</AccordionItem>
        <AccordionItem summary="Dos" defaultOpen>Contenido dos</AccordionItem>
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
        <AccordionItem summary="¿Cómo entrego?">Desde la actividad.</AccordionItem>
      </Accordion>,
    )
    expect(screen.getByText('Desde la actividad.')).toBeInTheDocument()
  })
})
