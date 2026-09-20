import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { AudioPlayer } from './audio-player'

const play = vi.fn(() => Promise.resolve())
const pause = vi.fn()
beforeAll(() => {
  HTMLMediaElement.prototype.play = play as unknown as HTMLMediaElement['play']
  HTMLMediaElement.prototype.pause = pause
})

function load(dur = 90) {
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
    load(90)
    expect(screen.getByRole('button', { name: 'Reproducir' })).toBeEnabled()
    expect(screen.getByText('0:00 / 1:30')).toBeInTheDocument()
  })

  it('el botón cambia de nombre según lo que va a hacer', async () => {
    render(<AudioPlayer src="/x.mp3" />)
    const el = load()
    await userEvent.click(screen.getByRole('button', { name: 'Reproducir' }))
    expect(play).toHaveBeenCalled()
    fireEvent.play(el)
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Pausar' }))
    expect(pause).toHaveBeenCalled()
  })

  it('la línea de tiempo es un slider y dice en voz alta dónde está', () => {
    render(<AudioPlayer src="/x.mp3" title="Consigna de Lengua" />)
    load(90)
    const s = screen.getByRole('slider', { name: 'Buscar en Consigna de Lengua' })
    expect(s).toHaveAttribute('aria-valuetext', '0:00 de 1:30')
    expect(s).toHaveAttribute('max', '90')
  })

  it('arrastrar la línea mueve el audio y el reloj', () => {
    render(<AudioPlayer src="/x.mp3" />)
    const el = load(90)
    fireEvent.change(screen.getByRole('slider'), { target: { value: '45' } })
    expect(el.currentTime).toBe(45)
    expect(screen.getByText('0:45 / 1:30')).toBeInTheDocument()
  })

  it('el tiempo que avanza solo se ve en el reloj', () => {
    render(<AudioPlayer src="/x.mp3" />)
    const el = load(90)
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

  it('mientras carga no afirma una duración que no sabe', () => {
    render(<AudioPlayer src="/x.mp3" />)
    expect(screen.getByText('0:00 / --:--')).toBeInTheDocument()
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '0:00 de --:--')
  })

  it('un archivo que ya tiene la duración no se queda cargando', () => {
    const { unmount } = render(<AudioPlayer src="/x.mp3" />)
    const el = document.querySelector('audio')!
    Object.defineProperty(el, 'duration', { value: 12, configurable: true })
    Object.defineProperty(el, 'readyState', { value: 1, configurable: true })
    unmount()
    render(<AudioPlayer src="/x.mp3" />)
    const next = document.querySelector('audio')!
    Object.defineProperty(next, 'duration', { value: 12, configurable: true })
    Object.defineProperty(next, 'readyState', { value: 1, configurable: true })
    fireEvent.loadedMetadata(next)
    expect(screen.getByText('0:00 / 0:12')).toBeInTheDocument()
  })

  it('una hora se lee como hora y no como noventa minutos', () => {
    render(<AudioPlayer src="/x.mp3" />)
    load(3723)
    expect(screen.getByText('0:00 / 1:02:03')).toBeInTheDocument()
  })

  it('cuando arranca uno, el que estaba sonando se pausa', () => {
    render(
      <>
        <AudioPlayer src="/a.mp3" title="Uno" />
        <AudioPlayer src="/b.mp3" title="Dos" />
      </>,
    )
    const [a, b] = Array.from(document.querySelectorAll('audio'))
    for (const el of [a, b]) {
      Object.defineProperty(el, 'duration', { value: 30, configurable: true })
      fireEvent.loadedMetadata(el)
    }
    fireEvent.play(a)
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeInTheDocument()

    const paused = pause.mock.calls.length
    fireEvent.play(b)
    expect(pause.mock.calls.length).toBe(paused + 1)
  })

  it('las acciones de al lado se muestran', () => {
    render(<AudioPlayer src="/x.mp3"><AudioPlayer.Actions><button type="button">Descargar</button></AudioPlayer.Actions></AudioPlayer>)
    expect(screen.getByRole('button', { name: 'Descargar' })).toBeInTheDocument()
  })
})
