import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PrefsProvider } from '../prefs/prefs'
import { SettingsModal } from './settings-modal'

const user = { name: 'Melina Rivero', email: 'melina@melu.app', alias: 'Profe Meli', school: 'Escuela 12' }

function abrir(onClose = () => {}) {
  return render(
    <PrefsProvider>
      <SettingsModal open onClose={onClose} user={user} />
    </PrefsProvider>,
  )
}

describe('SettingsModal', () => {
  beforeEach(() => localStorage.clear())

  it('cerrado no dibuja nada', () => {
    render(<PrefsProvider><SettingsModal open={false} onClose={() => {}} user={user} /></PrefsProvider>)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('abre en General y se anuncia como diálogo con nombre', () => {
    abrir()
    expect(screen.getByRole('dialog', { name: 'Ajustes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'General' })).toHaveAttribute('aria-current', 'page')
  })

  it('el rail cambia de sección sin navegar', async () => {
    abrir()
    await userEvent.click(screen.getByRole('button', { name: 'Avisos' }))
    expect(screen.getByRole('button', { name: 'Avisos' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'General' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('heading', { name: 'Avisos' })).toBeInTheDocument()
  })

  it('lo que se cambia queda en las preferencias', async () => {
    abrir()
    await userEvent.click(screen.getByRole('radio', { name: 'Oscuro' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('Escape cierra', async () => {
    const cerrar = vi.fn()
    abrir(cerrar)
    await userEvent.keyboard('{Escape}')
    expect(cerrar).toHaveBeenCalledOnce()
  })
})
