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
    const detalle = screen.getByText('¿Cómo entrego?').closest('details')!
    expect(detalle.open).toBe(false)
    await userEvent.click(screen.getByText('¿Cómo entrego?'))
    expect(detalle.open).toBe(true)
  })
})
