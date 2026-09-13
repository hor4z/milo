import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { AudioPlayer } from './audio-player'

// jsdom no reproduce nada: `play` no está implementado y `duration` es NaN. Se
// reemplazan para poder contar el comportamiento, que es lo que importa.
const play = vi.fn(() => Promise.resolve())
const pause = vi.fn()
beforeAll(() => {
  HTMLMediaElement.prototype.play = play as unknown as HTMLMediaElement['play']
  HTMLMediaElement.prototype.pause = pause
})

function cargar(dur = 90) {
  const el = document.querySelector('audio')!
  Object.defineProperty(el, 'duration', { value: dur, configurable: true })
  Object.defineProperty(el, 'currentTime', { value: 0, writable: true, configurable: true })
  fireEvent.loadedMetadata(el)
  return el
}

describe('AudioPlayer', () => {
  it('mientras carga avisa que está cargando y no se puede buscar', () => {
    render(<AudioPlayer src="/x.mp3" />)
    expect(screen.getByRole('status', { name: 'Cargando el audio' })).toBeInTheDocument()
    expect(screen.getByRole('slider')).toBeDisabled()
  })

  it('con el archivo listo aparece el play y el reloj sabe cuánto dura', () => {
    render(<AudioPlayer src="/x.mp3" />)
    cargar(90)
    expect(screen.getByRole('button', { name: 'Reproducir' })).toBeEnabled()
    expect(screen.getByText('0:00 / 1:30')).toBeInTheDocument()
  })

  it('el botón cambia de nombre según lo que va a hacer', async () => {
    render(<AudioPlayer src="/x.mp3" />)
    const el = cargar()
    await userEvent.click(screen.getByRole('button', { name: 'Reproducir' }))
    expect(play).toHaveBeenCalled()
    fireEvent.play(el)
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Pausar' }))
    expect(pause).toHaveBeenCalled()
  })

  it('la línea de tiempo es un slider y dice en voz alta dónde está', () => {
    render(<AudioPlayer src="/x.mp3" title="Consigna de Lengua" />)
    cargar(90)
    const s = screen.getByRole('slider', { name: 'Buscar en Consigna de Lengua' })
    expect(s).toHaveAttribute('aria-valuetext', '0:00 de 1:30')
    expect(s).toHaveAttribute('max', '90')
  })

  it('arrastrar la línea mueve el audio y el reloj', () => {
    render(<AudioPlayer src="/x.mp3" />)
    const el = cargar(90)
    fireEvent.change(screen.getByRole('slider'), { target: { value: '45' } })
    expect(el.currentTime).toBe(45)
    expect(screen.getByText('0:45 / 1:30')).toBeInTheDocument()
  })

  it('el tiempo que avanza solo se ve en el reloj', () => {
    render(<AudioPlayer src="/x.mp3" />)
    const el = cargar(90)
    Object.defineProperty(el, 'currentTime', { value: 7, writable: true, configurable: true })
    fireEvent.timeUpdate(el)
    expect(screen.getByText('0:07 / 1:30')).toBeInTheDocument()
  })

  it('si el archivo no carga lo dice y apaga los controles', () => {
    render(<AudioPlayer src="/no-existe.mp3" />)
    fireEvent.error(document.querySelector('audio')!)
    expect(screen.getByText('No se pudo cargar el audio')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reproducir' })).toBeDisabled()
  })

  it('una hora se lee como hora y no como noventa minutos', () => {
    render(<AudioPlayer src="/x.mp3" />)
    cargar(3723)
    expect(screen.getByText('0:00 / 1:02:03')).toBeInTheDocument()
  })

  it('las acciones de al lado se muestran', () => {
    render(<AudioPlayer src="/x.mp3" actions={<button type="button">Descargar</button>} />)
    expect(screen.getByRole('button', { name: 'Descargar' })).toBeInTheDocument()
  })
})
