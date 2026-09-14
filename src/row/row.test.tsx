import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Row } from './row'
import { Switch } from '../switch/switch'

describe('Row', () => {
  it('pone la etiqueta y el control', () => {
    render(<Row label="Tema" hint="Claro u oscuro"><button>Cambiar</button></Row>)
    expect(screen.getByText('Tema')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cambiar' })).toBeInTheDocument()
  })

  it('su etiqueta nombra al control que lleva adentro', async () => {
    render(<Row label="Avisos por mail" hint="Cuando llega una entrega"><Switch checked onChange={() => {}} /></Row>)
    const sw = screen.getByRole('switch', { name: 'Avisos por mail' })
    expect(sw).toHaveAccessibleDescription('Cuando llega una entrega')
    await userEvent.click(screen.getByText('Avisos por mail'))
    expect(document.activeElement).toBe(sw)
  })
})
