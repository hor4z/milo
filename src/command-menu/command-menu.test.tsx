import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CommandMenu, type CommandGroup } from './command-menu'

const groups: CommandGroup[] = [
  {
    label: 'Bloques',
    items: [
      { id: 'titulo', label: 'Título', hint: 'Un encabezado de sección', icon: 'article' },
      { id: 'imagen', label: 'Imagen', keywords: ['foto'], icon: 'image' },
      { id: 'roto', label: 'Todavía no', disabled: true },
    ],
  },
  { label: 'Insertar', items: [{ id: 'tabla', label: 'Tabla', shortcut: '⌘T', icon: 'table_rows' }] },
]

describe('CommandMenu', () => {
  it('no roba el foco salvo que se lo pidan', () => {
    render(<CommandMenu groups={groups} onSelect={() => {}} />)
    expect(screen.getByRole('combobox')).not.toHaveFocus()
  })

  it('con `autoFocus` el buscador se lleva el foco al montar', () => {
    render(<CommandMenu autoFocus groups={groups} onSelect={() => {}} />)
    expect(screen.getByRole('combobox')).toHaveFocus()
  })

  it('es un listbox con un buscador que lo maneja', () => {
    render(<CommandMenu groups={groups} onSelect={() => {}} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(4)
  })

  it('el primero arranca elegido y las flechas lo mueven', async () => {
    render(<CommandMenu autoFocus groups={groups} onSelect={() => {}} />)
    expect(screen.getByRole('option', { name: /Título/ })).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('option', { name: /Imagen/ })).toHaveAttribute('aria-selected', 'true')
  })

  it('las flechas saltean lo apagado', async () => {
    render(<CommandMenu autoFocus groups={groups} onSelect={() => {}} />)
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    expect(screen.getByRole('option', { name: /Tabla/ })).toHaveAttribute('aria-selected', 'true')
  })

  it('Enter elige el que está marcado', async () => {
    const onSelect = vi.fn()
    render(<CommandMenu autoFocus groups={groups} onSelect={onSelect} />)
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'imagen' }))
  })

  it('se busca sin tildes y por palabras que no están en el nombre', async () => {
    render(<CommandMenu groups={groups} onSelect={() => {}} />)
    await userEvent.type(screen.getByRole('combobox'), 'titulo')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    await userEvent.clear(screen.getByRole('combobox'))
    await userEvent.type(screen.getByRole('combobox'), 'foto')
    expect(screen.getByRole('option', { name: /Imagen/ })).toBeInTheDocument()
  })

  it('un grupo que se queda sin resultados no deja el encabezado solo', async () => {
    render(<CommandMenu groups={groups} onSelect={() => {}} />)
    await userEvent.type(screen.getByRole('combobox'), 'tabla')
    expect(screen.queryByRole('group', { name: 'Bloques' })).not.toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Insertar' })).toBeInTheDocument()
  })

  it('sin resultados lo dice con palabras', async () => {
    render(<CommandMenu groups={groups} onSelect={() => {}} empty="No hay nada" />)
    await userEvent.type(screen.getByRole('combobox'), 'zzz')
    expect(screen.getByText('No hay nada')).toBeInTheDocument()
  })

  it('lo apagado no se elige con el click', async () => {
    const onSelect = vi.fn()
    render(<CommandMenu groups={groups} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('option', { name: /Todavía no/ }))
    expect(onSelect).not.toHaveBeenCalled()
  })
})
