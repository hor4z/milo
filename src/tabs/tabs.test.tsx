import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tabs } from './tabs'

describe('Tabs', () => {
  it('la lista de solapas tiene nombre, y Home y End van a los extremos', async () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List label="Secciones de la actividad">
          <Tabs.Tab value="a">A</Tabs.Tab><Tabs.Tab value="b">B</Tabs.Tab><Tabs.Tab value="c">C</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">uno</Tabs.Panel>
      </Tabs>,
    )
    expect(screen.getByRole('tablist', { name: 'Secciones de la actividad' })).toBeInTheDocument()
    screen.getByRole('tab', { name: 'A' }).focus()
    await userEvent.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'C' })).toHaveFocus()
    await userEvent.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'A' })).toHaveFocus()
  })

  const Demo = () => (
    <Tabs defaultValue="a">
      <Tabs.List>
        <Tabs.Tab value="a">Resumen</Tabs.Tab>
        <Tabs.Tab value="b">Detalle</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="a">Panel A</Tabs.Panel>
      <Tabs.Panel value="b">Panel B</Tabs.Panel>
    </Tabs>
  )

  it('muestra solo el panel activo y lo ata a su solapa', () => {
    render(<Demo />)
    expect(screen.getByText('Panel A')).toBeInTheDocument()
    expect(screen.queryByText('Panel B')).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Resumen' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Resumen')
  })

  it('cambia con click', async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole('tab', { name: 'Detalle' }))
    expect(screen.getByText('Panel B')).toBeInTheDocument()
  })

  it('las flechas mueven el foco entre solapas', async () => {
    render(<Demo />)
    screen.getByRole('tab', { name: 'Resumen' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Detalle' }))
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Resumen' }))
  })

  it('funciona controlado', async () => {
    const onValueChange = vi.fn()
    render(
      <Tabs value="a" onValueChange={onValueChange}>
        <Tabs.List><Tabs.Tab value="a">A</Tabs.Tab><Tabs.Tab value="b">B</Tabs.Tab></Tabs.List>
        <Tabs.Panel value="a">Uno</Tabs.Panel>
      </Tabs>,
    )
    await userEvent.click(screen.getByRole('tab', { name: 'B' }))
    expect(onValueChange).toHaveBeenCalledWith('b')
    expect(screen.getByText('Uno')).toBeInTheDocument()
  })
})
