import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tree, type TreeNode } from './tree'

const nodes: TreeNode[] = [
  {
    id: 'mate',
    label: 'Matemática',
    children: [
      { id: 'fracciones', label: 'Fracciones', children: [{ id: 'equivalentes', label: 'Equivalentes' }] },
      { id: 'decimales', label: 'Decimales' },
    ],
  },
  { id: 'lengua', label: 'Lengua' },
]

const open = (props = {}) => render(<Tree nodes={nodes} label="Espacios" {...props} />)

describe('Tree', () => {
  it('es un árbol con su nombre y sus niveles', () => {
    open()
    expect(screen.getByRole('tree', { name: 'Espacios' })).toBeInTheDocument()
    expect(screen.getByRole('treeitem', { name: /Matemática/ })).toHaveAttribute('aria-level', '1')
  })

  it('lo cerrado no está en el documento, no solo escondido', () => {
    open()
    expect(screen.queryByRole('treeitem', { name: /Fracciones/ })).toBeNull()
  })

  it('una rama dice si está abierta y una hoja no dice nada', () => {
    open()
    expect(screen.getByRole('treeitem', { name: /Matemática/ })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('treeitem', { name: /Lengua/ })).not.toHaveAttribute('aria-expanded')
  })

  it('la flecha derecha abre, y en lo abierto entra', async () => {
    open()
    const root = screen.getByRole('treeitem', { name: /Matemática/ })
    root.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(root).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('treeitem', { name: /Fracciones/ })).toHaveFocus()
  })

  it('la flecha izquierda sube al padre desde una hoja', async () => {
    open({ expanded: ['mate'] })
    screen.getByRole('treeitem', { name: /Decimales/ }).focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(screen.getByRole('treeitem', { name: /Matemática/ })).toHaveFocus()
  })

  it('la flecha izquierda cierra una rama abierta', async () => {
    open()
    const root = screen.getByRole('treeitem', { name: /Matemática/ })
    root.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(root).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{ArrowLeft}')
    expect(root).toHaveAttribute('aria-expanded', 'false')
  })

  it('con `expanded` manda el padre: la pieza avisa y no se abre sola', async () => {
    const onExpandedChange = vi.fn()
    open({ expanded: ['mate'], onExpandedChange })
    screen.getByRole('treeitem', { name: /Matemática/ }).focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(onExpandedChange).toHaveBeenCalledWith([])
    expect(screen.getByRole('treeitem', { name: /Matemática/ })).toHaveAttribute('aria-expanded', 'true')
  })

  it('arriba y abajo recorren lo que está a la vista', async () => {
    open({ expanded: ['mate'] })
    screen.getByRole('treeitem', { name: /Matemática/ }).focus()
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    expect(screen.getByRole('treeitem', { name: /Decimales/ })).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    expect(screen.getByRole('treeitem', { name: /Fracciones/ })).toHaveFocus()
  })

  it('una sola parada de tabulación, no una por rama', () => {
    open({ expanded: ['mate'] })
    const stops = screen.getAllByRole('treeitem').filter(n => n.getAttribute('tabindex') === '0')
    expect(stops).toHaveLength(1)
  })

  it('teclear salta a la rama que empieza así', async () => {
    open({ expanded: ['mate'] })
    screen.getByRole('treeitem', { name: /Matemática/ }).focus()
    await userEvent.keyboard('d')
    expect(screen.getByRole('treeitem', { name: /Decimales/ })).toHaveFocus()
  })

  it('Enter elige y devuelve el id', async () => {
    const onSelect = vi.fn()
    open({ expanded: ['mate'], onSelect })
    screen.getByRole('treeitem', { name: /Decimales/ }).focus()
    await userEvent.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledWith('decimales')
  })

  it('lo elegido se anuncia elegido', () => {
    open({ expanded: ['mate'], selected: 'decimales' })
    expect(screen.getByRole('treeitem', { name: /Decimales/ })).toHaveAttribute('aria-selected', 'true')
  })

  it('sin `expanded` se abre y se cierra solo', async () => {
    open()
    await userEvent.click(screen.getByRole('treeitem', { name: /Matemática/ }))
    expect(screen.getByRole('treeitem', { name: /Fracciones/ })).toBeInTheDocument()
  })

  it('un árbol vacío no rompe', () => {
    render(<Tree nodes={[]} label="Nada" />)
    expect(screen.getByRole('tree')).toBeEmptyDOMElement()
  })
})
