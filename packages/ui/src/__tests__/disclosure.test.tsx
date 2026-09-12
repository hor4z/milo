import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Accordion, AccordionItem, Tab, TabList, TabPanel, Tabs } from '../disclosure'
import { Badge, Breadcrumb, Progress, Skeleton } from '../status'

describe('Tabs', () => {
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

describe('Badge', () => {
  it('dice su estado con texto y no solo con color', () => {
    render(<Badge tone="ok" icon="check_circle">Corregida</Badge>)
    expect(screen.getByText('Corregida')).toBeInTheDocument()
  })
})

describe('Progress', () => {
  it('expone valor y nombre', () => {
    render(<Progress value={30} max={60} label="Corregidas" hint="30/60" />)
    const bar = screen.getByRole('progressbar', { name: 'Corregidas' })
    expect(bar).toHaveAttribute('aria-valuenow', '30')
    expect(bar).toHaveAttribute('aria-valuemax', '60')
  })

  it('no se pasa de los bordes', () => {
    render(<Progress value={999} max={10} label="x" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '999')
  })
})

describe('Skeleton', () => {
  it('no se anuncia', () => {
    const { container } = render(<Skeleton className="h-4 w-20" />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('Breadcrumb', () => {
  it('marca dónde estás y deja volver', async () => {
    const onClick = vi.fn()
    render(<Breadcrumb items={[{ label: 'Espacios', onClick }, { label: 'Matemática' }]} />)
    expect(screen.getByText('Matemática')).toHaveAttribute('aria-current', 'page')
    await userEvent.click(screen.getByText('Espacios'))
    expect(onClick).toHaveBeenCalled()
  })
})
