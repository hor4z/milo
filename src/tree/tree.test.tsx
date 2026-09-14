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

const abrir = (props = {}) => render(<Tree nodes={nodes} label="Espacios" {...props} />)

describe('Tree', () => {
  it('es un árbol con su nombre y sus niveles', () => {
    abrir()
    expect(screen.getByRole('tree', { name: 'Espacios' })).toBeInTheDocument()
    expect(screen.getByRole('treeitem', { name: /Matemática/ })).toHaveAttribute('aria-level', '1')
  })

  it('lo cerrado no está en el documento, no solo escondido', () => {
    abrir()
    expect(screen.queryByRole('treeitem', { name: /Fracciones/ })).toBeNull()
  })

  it('una rama dice si está abierta y una hoja no dice nada', () => {
    abrir()
    expect(screen.getByRole('treeitem', { name: /Matemática/ })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('treeitem', { name: /Lengua/ })).not.toHaveAttribute('aria-expanded')
  })

  it('la flecha derecha abre, y en lo abierto entra', async () => {
    abrir()
    const raiz = screen.getByRole('treeitem', { name: /Matemática/ })
    raiz.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(raiz).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('treeitem', { name: /Fracciones/ })).toHaveFocus()
  })

  it('la flecha izquierda sube al padre desde una hoja', async () => {
    abrir({ expanded: ['mate'] })
    screen.getByRole('treeitem', { name: /Decimales/ }).focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(screen.getByRole('treeitem', { name: /Matemática/ })).toHaveFocus()
  })

  it('la flecha izquierda cierra una rama abierta', async () => {
    abrir()
    const raiz = screen.getByRole('treeitem', { name: /Matemática/ })
    raiz.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(raiz).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{ArrowLeft}')
    expect(raiz).toHaveAttribute('aria-expanded', 'false')
  })

  it('con `expanded` manda el padre: la pieza avisa y no se abre sola', async () => {
    const onExpandedChange = vi.fn()
    abrir({ expanded: ['mate'], onExpandedChange })
    screen.getByRole('treeitem', { name: /Matemática/ }).focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(onExpandedChange).toHaveBeenCalledWith([])
    expect(screen.getByRole('treeitem', { name: /Matemática/ })).toHaveAttribute('aria-expanded', 'true')
  })

  it('arriba y abajo recorren lo que está a la vista', async () => {
    abrir({ expanded: ['mate'] })
    screen.getByRole('treeitem', { name: /Matemática/ }).focus()
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    expect(screen.getByRole('treeitem', { name: /Decimales/ })).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    expect(screen.getByRole('treeitem', { name: /Fracciones/ })).toHaveFocus()
  })

  it('una sola parada de tabulación, no una por rama', () => {
    abrir({ expanded: ['mate'] })
    const paradas = screen.getAllByRole('treeitem').filter(n => n.getAttribute('tabindex') === '0')
    expect(paradas).toHaveLength(1)
  })

  it('teclear salta a la rama que empieza así', async () => {
    abrir({ expanded: ['mate'] })
    screen.getByRole('treeitem', { name: /Matemática/ }).focus()
    await userEvent.keyboard('d')
    expect(screen.getByRole('treeitem', { name: /Decimales/ })).toHaveFocus()
  })

  it('Enter elige y devuelve el id', async () => {
    const onSelect = vi.fn()
    abrir({ expanded: ['mate'], onSelect })
    screen.getByRole('treeitem', { name: /Decimales/ }).focus()
    await userEvent.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledWith('decimales')
  })

  it('lo elegido se anuncia elegido', () => {
    abrir({ expanded: ['mate'], selected: 'decimales' })
    expect(screen.getByRole('treeitem', { name: /Decimales/ })).toHaveAttribute('aria-selected', 'true')
  })

  it('sin `expanded` se abre y se cierra solo', async () => {
    abrir()
    await userEvent.click(screen.getByRole('treeitem', { name: /Matemática/ }))
    expect(screen.getByRole('treeitem', { name: /Fracciones/ })).toBeInTheDocument()
  })

  it('un árbol vacío no rompe', () => {
    render(<Tree nodes={[]} label="Nada" />)
    expect(screen.getByRole('tree')).toBeEmptyDOMElement()
  })
})
