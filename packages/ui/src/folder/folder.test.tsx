import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Folder } from './folder'

describe('Folder', () => {
  it('el nombre y la línea de apoyo se leen', () => {
    render(<Folder label="Matemática" meta="15 archivos" />)
    expect(screen.getByText('Matemática')).toBeInTheDocument()
    expect(screen.getByText('15 archivos')).toBeInTheDocument()
  })

  it('con onClick es un botón de verdad, y responde al teclado', async () => {
    const abrir = vi.fn()
    render(<Folder label="Matemática" onClick={abrir} />)
    const b = screen.getByRole('button', { name: /Matemática/ })
    b.focus()
    await userEvent.keyboard('{Enter}')
    expect(abrir).toHaveBeenCalledOnce()
  })

  it('sin onClick no aparenta ser accionable', () => {
    render(<Folder label="Matemática" />)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('el ancho y el color viajan como tokens', () => {
    const { container } = render(<Folder label="Matemática" size={96} color="var(--space-blue)" />)
    const carpeta = container.firstElementChild as HTMLElement
    expect(carpeta.style.getPropertyValue('--folder-w')).toBe('96px')
    expect(carpeta.style.getPropertyValue('--folder-top')).toBe('var(--space-blue)')
  })

  it('las hojas se abanican en la cantidad pedida', () => {
    const { container } = render(<Folder label="Matemática" sheets={2} />)
    expect(container.querySelectorAll('.folder-sheet')).toHaveLength(2)
  })

  it('quiénes tienen acceso se ven abajo', () => {
    render(<Folder label="Matemática" avatars={[{ name: 'Melina Rivero' }, { name: 'Juan Pérez' }]} />)
    expect(screen.getByText('MR')).toBeInTheDocument()
  })

  it('sin gente ni insignias no deja el hueco', () => {
    const { container } = render(<Folder label="Matemática" />)
    expect(container.querySelector('.folder-badges')).toBeNull()
  })
})
