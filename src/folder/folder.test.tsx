import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Folder } from './folder'

describe('Folder', () => {
  it('el nombre y la línea de apoyo se leen', () => {
    render(<Folder >
  <Folder.Label>Matemática</Folder.Label>
  <Folder.Meta>15 archivos</Folder.Meta>
</Folder>)
    expect(screen.getByText('Matemática')).toBeInTheDocument()
    expect(screen.getByText('15 archivos')).toBeInTheDocument()
  })

  it('con onClick es un botón de verdad, y responde al teclado', async () => {
    const onOpen = vi.fn()
    render(<Folder onClick={onOpen} >
  <Folder.Label>Matemática</Folder.Label>
</Folder>)
    const b = screen.getByRole('button', { name: /Matemática/ })
    b.focus()
    await userEvent.keyboard('{Enter}')
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it('sin onClick no aparenta ser accionable', () => {
    render(<Folder >
  <Folder.Label>Matemática</Folder.Label>
</Folder>)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('el ancho y el color viajan como tokens', () => {
    const { container } = render(<Folder size={96} color="var(--space-blue)" >
  <Folder.Label>Matemática</Folder.Label>
</Folder>)
    const folder = container.firstElementChild as HTMLElement
    expect(folder.style.getPropertyValue('--folder-w')).toBe('96px')
    expect(folder.style.getPropertyValue('--folder-top')).toBe('var(--space-blue)')
  })

  it('las hojas se abanican en la cantidad pedida', () => {
    const { container } = render(<Folder sheets={2} >
  <Folder.Label>Matemática</Folder.Label>
</Folder>)
    expect(container.querySelectorAll('.folder-sheet')).toHaveLength(2)
  })

  it('quiénes tienen acceso se ven abajo', () => {
    render(<Folder avatars={[{ name: 'Melina Rivero' }, { name: 'Juan Pérez' }]} >
  <Folder.Label>Matemática</Folder.Label>
</Folder>)
    expect(screen.getByText('MR')).toBeInTheDocument()
  })

  it('sin gente ni insignias no deja el hueco', () => {
    const { container } = render(<Folder >
  <Folder.Label>Matemática</Folder.Label>
</Folder>)
    expect(container.querySelector('.folder-badges')).toBeNull()
  })
})
