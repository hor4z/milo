import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CopyButton } from './copy-button'

describe('CopyButton', () => {
  it('copia y el nombre del botón pasa a decir que ya está', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    render(<CopyButton value="npm install" />)
    await userEvent.click(screen.getByRole('button', { name: 'Copiar' }))
    expect(writeText).toHaveBeenCalledWith('npm install')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Copiado' })).toBeInTheDocument())
  })

  it('el aviso también se anuncia: el cambio de glifo no lo ve quien escucha', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
    render(<CopyButton value="x" />)
    await userEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(document.getElementById('milo-live')?.textContent).toBe('Copiado'))
  })

  it('si el navegador no deja copiar, no dice que copió', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('no')) } })
    render(<CopyButton value="x" />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button', { name: 'Copiar' })).toBeInTheDocument()
  })
})
