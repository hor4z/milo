import { render, screen } from '@testing-library/react'
import s from './card.module.css'
import { describe, expect, it } from 'vitest'
import { Card, CardBody, CardFooter, CardHeader, CardHint, CardTitle } from './card'

describe('Card', () => {
  it('se arma con partes', () => {
    render(
      <Card>
        <CardHeader><CardTitle>Entregas</CardTitle></CardHeader>
        <CardHint>De esta semana</CardHint>
        <CardBody>18 de 24</CardBody>
        <CardFooter>pie</CardFooter>
      </Card>,
    )
    expect(screen.getByRole('heading', { name: 'Entregas' })).toBeInTheDocument()
    expect(screen.getByText('18 de 24')).toBeInTheDocument()
  })

  it('el título es un h3: la tarjeta entra en el esquema de la página', () => {
    render(<Card><CardHeader><CardTitle>Entregas</CardTitle></CardHeader></Card>)
    expect(screen.getByRole('heading', { level: 3, name: 'Entregas' })).toBeInTheDocument()
  })

  it('quieta por defecto, y se levanta solo si se lo piden', () => {
    const { container, rerender } = render(<Card>x</Card>)
    expect((container.firstChild as HTMLElement).className).not.toContain(s.interactive)
    rerender(<Card interactive>x</Card>)
    expect((container.firstChild as HTMLElement).className).toContain(s.interactive)
  })

  it('el hueco es otra superficie, no otra tarjeta', () => {
    const { container } = render(<Card surface="muted">x</Card>)
    expect((container.firstChild as HTMLElement).className).toContain(s.muted)
  })

  it('el papel lleva su línea: adentro de otra superficie la sombra sola no dice dónde empieza', () => {
    const { container, rerender } = render(<Card>x</Card>)
    expect((container.firstChild as HTMLElement).className).toContain(s.div2)
    rerender(<Card surface="muted">x</Card>)
    expect((container.firstChild as HTMLElement).className).not.toContain(s.div2)
  })
})
