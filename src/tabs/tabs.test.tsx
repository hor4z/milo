import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tab, TabList, TabPanel, Tabs } from './tabs'

describe('Tabs', () => {
  it('la lista de solapas tiene nombre, y Home y End van a los extremos', async () => {
    render(
      <Tabs defaultValue="a">
        <TabList label="Secciones de la actividad">
          <Tab value="a">A</Tab><Tab value="b">B</Tab><Tab value="c">C</Tab>
        </TabList>
        <TabPanel value="a">uno</TabPanel>
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
      <TabList>
        <Tab value="a">Resumen</Tab>
        <Tab value="b">Detalle</Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
      <TabPanel value="b">Panel B</TabPanel>
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
        <TabList><Tab value="a">A</Tab><Tab value="b">B</Tab></TabList>
        <TabPanel value="a">Uno</TabPanel>
      </Tabs>,
    )
    await userEvent.click(screen.getByRole('tab', { name: 'B' }))
    expect(onValueChange).toHaveBeenCalledWith('b')
    expect(screen.getByText('Uno')).toBeInTheDocument()
  })
})
