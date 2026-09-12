import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { PrefsProvider, usePrefs } from './prefs'

function Probe() {
  const { prefs, set } = usePrefs()
  return (
    <button onClick={() => set('theme', prefs.theme === 'light' ? 'dark' : 'light')}>
      {prefs.theme}
    </button>
  )
}

describe('PrefsProvider', () => {
  beforeEach(() => localStorage.clear())

  it('aplica el tema en html, que es donde lo ven los portales', async () => {
    render(<PrefsProvider><Probe /></PrefsProvider>)
    expect(document.documentElement.dataset.theme).toBe('light')
    await userEvent.click(screen.getByRole('button'))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('lo que se cambia queda guardado', async () => {
    render(<PrefsProvider><Probe /></PrefsProvider>)
    await userEvent.click(screen.getByRole('button'))
    expect(JSON.parse(localStorage.getItem('melu.prefs')!).theme).toBe('dark')
  })

  it('vuelve a arrancar donde quedó', () => {
    localStorage.setItem('melu.prefs', JSON.stringify({ theme: 'dark' }))
    render(<PrefsProvider><Probe /></PrefsProvider>)
    expect(screen.getByRole('button')).toHaveTextContent('dark')
  })

  it('un guardado corrupto no rompe el arranque', () => {
    localStorage.setItem('melu.prefs', 'no es json')
    render(<PrefsProvider><Probe /></PrefsProvider>)
    expect(screen.getByRole('button')).toHaveTextContent('light')
  })
})

describe('usePrefs', () => {
  it('sin provider avisa', () => {
    const error = console.error
    console.error = () => {}
    expect(() => render(<Probe />)).toThrow(/PrefsProvider/)
    console.error = error
  })
})
