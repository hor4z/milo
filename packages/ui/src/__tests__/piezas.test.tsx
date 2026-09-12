import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Avatar, AvatarGroup, Card, CardBody, CardFooter, CardHeader, CardHint, CardTitle, Chip, Kbd, Row, Slider, Spinner } from '../primitives'
import { List, ListItem } from '../list'
import { Menu, MenuItem, MenuLabel } from '../menu'
import { EmptyState } from '../page'

describe('Slider', () => {
  it('es un input de rango con su nombre y avisa el valor nuevo', () => {
    const onChange = vi.fn()
    render(<Slider value={40} onChange={onChange} label="Duración" />)
    const s = screen.getByRole('slider', { name: 'Duración' })
    expect(s).toHaveValue('40')
    fireEvent.change(s, { target: { value: '55' } })
    expect(onChange).toHaveBeenCalledWith(55)
  })
})

describe('Spinner', () => {
  it('se anuncia como estado con su nombre', () => {
    render(<Spinner label="Guardando" />)
    expect(screen.getByRole('status', { name: 'Guardando' })).toBeInTheDocument()
  })
})

describe('Avatar', () => {
  it('sin foto cae a las iniciales', () => {
    render(<Avatar name="Ana Pérez" />)
    expect(screen.getByText('AP')).toBeInTheDocument()
  })

  it('el grupo publica los nombres para quien no ve las caras', () => {
    render(<AvatarGroup people={[{ name: 'Ana Pérez' }, { name: 'Bruno Díaz' }]} />)
    expect(screen.getByText('Ana Pérez, Bruno Díaz')).toBeInTheDocument()
  })

  it('con más gente que el máximo muestra el resto', () => {
    const { container } = render(
      <AvatarGroup max={2} people={[{ name: 'A A' }, { name: 'B B' }, { name: 'C C' }, { name: 'D D' }]} />,
    )
    expect(container.textContent).toContain('+2')
  })
})

describe('Chip', () => {
  it('se puede quitar', async () => {
    const onRemove = vi.fn()
    render(<Chip onRemove={onRemove}>Matemática</Chip>)
    await userEvent.click(screen.getByRole('button', { name: 'Quitar' }))
    expect(onRemove).toHaveBeenCalled()
  })

  it('sin onClick no es un botón', () => {
    render(<Chip>Borrador</Chip>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

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

describe('Row', () => {
  it('pone la etiqueta y el control', () => {
    render(<Row label="Tema" hint="Claro u oscuro"><button>Cambiar</button></Row>)
    expect(screen.getByText('Tema')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cambiar' })).toBeInTheDocument()
  })

  it('su etiqueta nombra al control que lleva adentro', async () => {
    const { Switch } = await import('../primitives')
    render(<Row label="Avisos por mail" hint="Cuando llega una entrega"><Switch checked onChange={() => {}} /></Row>)
    const sw = screen.getByRole('switch', { name: 'Avisos por mail' })
    expect(sw).toHaveAccessibleDescription('Cuando llega una entrega')
    await userEvent.click(screen.getByText('Avisos por mail'))
    expect(document.activeElement).toBe(sw)
  })
})

describe('List', () => {
  it('una fila con onClick es un botón y sin él no', async () => {
    const onClick = vi.fn()
    render(
      <List>
        <ListItem icon="star" color="blue" title="Con acción" hint="x" onClick={onClick} />
        <ListItem icon="star" color="green" title="Sin acción" hint="y" />
      </List>,
    )
    await userEvent.click(screen.getByText('Con acción'))
    expect(onClick).toHaveBeenCalled()
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })
})

describe('Menu', () => {
  it('marca la opción elegida para un lector', () => {
    render(
      <Menu>
        <MenuLabel>Vista</MenuLabel>
        <MenuItem checked>Grilla</MenuItem>
        <MenuItem checked={false}>Lista</MenuItem>
      </Menu>,
    )
    expect(screen.getByRole('menuitemradio', { name: /Grilla/ })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('menuitemradio', { name: /Lista/ })).toHaveAttribute('aria-checked', 'false')
  })

  it('una opción sin estado es un menuitem común', () => {
    render(<Menu><MenuItem>Salir</MenuItem></Menu>)
    expect(screen.getByRole('menuitem', { name: 'Salir' })).toBeInTheDocument()
  })
})

describe('Kbd', () => {
  it('usa la semántica de tecla', () => {
    const { container } = render(<Kbd>⌘K</Kbd>)
    expect(container.querySelector('kbd')).toBeInTheDocument()
  })
})

describe('EmptyState', () => {
  it('lleva su salida y el icono no se anuncia', () => {
    render(<EmptyState icon="inbox" title="Nada acá" body="Todavía no llegó nada." action={<button>Crear</button>} />)
    expect(screen.getByText('Nada acá')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Crear' })).toBeInTheDocument()
  })
})

describe('Link', () => {
  it('el externo avisa que abre en otra pestaña', async () => {
    const { Link } = await import('../primitives')
    render(<Link href="https://ejemplo.com" external>Material Symbols</Link>)
    const a = screen.getByRole('link', { name: /Material Symbols/ })
    expect(a).toHaveAttribute('target', '_blank')
    expect(a).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(a).toHaveTextContent('se abre en otra pestaña')
  })

  it('el interno no abre pestañas', async () => {
    const { Link } = await import('../primitives')
    render(<Link href="/ajustes">Ajustes</Link>)
    expect(screen.getByRole('link')).not.toHaveAttribute('target')
  })
})
