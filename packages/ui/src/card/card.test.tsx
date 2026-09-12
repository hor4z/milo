import { render, screen } from '@testing-library/react'
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
})
