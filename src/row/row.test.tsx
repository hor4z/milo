import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Row } from './row'
import { Switch } from '../switch/switch'

describe('Row', () => {
  it('pone la etiqueta y el control', () => {
    render(<Row>
  <Row.Label>Tema</Row.Label>
  <Row.Hint>Claro u oscuro</Row.Hint><button>Cambiar</button></Row>)
    expect(screen.getByText('Tema')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cambiar' })).toBeInTheDocument()
  })

  it('su etiqueta nombra al control que lleva adentro', async () => {
    render(<Row>
  <Row.Label>Avisos por mail</Row.Label>
  <Row.Hint>Cuando llega una entrega</Row.Hint><Switch checked onChange={() => {}} /></Row>)
    const sw = screen.getByRole('switch', { name: 'Avisos por mail' })
    expect(sw).toHaveAccessibleDescription('Cuando llega una entrega')
    await userEvent.click(screen.getByText('Avisos por mail'))
    expect(document.activeElement).toBe(sw)
  })
})
