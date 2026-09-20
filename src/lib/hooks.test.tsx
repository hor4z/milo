import { act, render, renderHook, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useDisclosure } from './use-disclosure'
import { useDebounce } from './use-debounce'
import { useLocalStorage } from './use-local-storage'
import { useClipboard } from './use-clipboard'
import { useAnnounce } from './use-announce'
import { useMediaQuery } from './use-media-query'
import { plural, counted } from './number'
import { colorForName } from './colors'

describe('useDisclosure', () => {
  it('abre, cierra y alterna', () => {
    const { result } = renderHook(() => useDisclosure())
    expect(result.current.open).toBe(false)
    act(() => result.current.onOpen())
    expect(result.current.open).toBe(true)
    act(() => result.current.onToggle())
    expect(result.current.open).toBe(false)
  })

  it('las acciones no cambian de identidad entre renders', () => {
    const { result, rerender } = renderHook(() => useDisclosure())
    const antes = result.current.onOpen
    rerender()
    expect(result.current.onOpen).toBe(antes)
  })
})

describe('useDebounce', () => {
  it('devuelve el valor recién cuando dejó de cambiar', async () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 200), { initialProps: { v: 'a' } })
    rerender({ v: 'b' })
    expect(result.current).toBe('a')
    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current).toBe('b')
    vi.useRealTimers()
  })
})

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear())

  it('arranca del valor guardado y escribe al cambiar', () => {
    localStorage.setItem('k', JSON.stringify('guardado'))
    const { result } = renderHook(() => useLocalStorage('k', 'default'))
    expect(result.current[0]).toBe('guardado')
    act(() => result.current[1]('nuevo'))
    expect(JSON.parse(localStorage.getItem('k')!)).toBe('nuevo')
  })

  it('con basura adentro no tira, usa el default', () => {
    localStorage.setItem('k', '{no es json')
    const { result } = renderHook(() => useLocalStorage('k', 'default'))
    expect(result.current[0]).toBe('default')
  })
})

describe('useClipboard', () => {
  it('avisa que copió y el aviso se apaga solo', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    const { result } = renderHook(() => useClipboard({ ms: 100 }))
    await act(async () => { await result.current.copy('hola') })
    expect(writeText).toHaveBeenCalledWith('hola')
    expect(result.current.copied).toBe(true)
    act(() => { vi.advanceTimersByTime(100) })
    expect(result.current.copied).toBe(false)
    vi.useRealTimers()
  })

  it('si el navegador no deja copiar, devuelve false y no tira', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('no')) } })
    const { result } = renderHook(() => useClipboard())
    let ok: boolean | undefined
    await act(async () => { ok = await result.current.copy('x') })
    expect(ok).toBe(false)
    expect(result.current.copied).toBe(false)
  })
})

describe('useAnnounce', () => {
  it('escribe en una sola región viva, compartida', async () => {
    function Dos() {
      const uno = useAnnounce()
      const dos = useAnnounce()
      return (
        <>
          <button type="button" onClick={() => uno('primero')}>uno</button>
          <button type="button" onClick={() => dos('segundo', 'assertive')}>dos</button>
        </>
      )
    }
    render(<Dos />)
    await userEvent.click(screen.getByRole('button', { name: 'uno' }))
    await waitFor(() => expect(document.getElementById('milo-live')!.textContent).toBe('primero'))
    await userEvent.click(screen.getByRole('button', { name: 'dos' }))
    await waitFor(() => expect(document.getElementById('milo-live')!.textContent).toBe('segundo'))
    expect(document.querySelectorAll('#milo-live')).toHaveLength(1)
    expect(document.getElementById('milo-live')!.getAttribute('aria-live')).toBe('assertive')
  })
})

describe('useMediaQuery', () => {
  it('sin matchMedia no tira y contesta que no', () => {
    const real = window.matchMedia
    // @ts-expect-error probamos justo el caso en el que no está
    delete window.matchMedia
    const { result } = renderHook(() => useMediaQuery('(pointer: coarse)'))
    expect(result.current).toBe(false)
    window.matchMedia = real
  })
})

describe('plural', () => {
  it('no se resuelve sumando una s', () => {
    expect(plural(1, ['actividad', 'actividades'])).toBe('actividad')
    expect(plural(0, ['actividad', 'actividades'])).toBe('actividades')
    expect(plural(2, ['actividad', 'actividades'])).toBe('actividades')
    expect(counted(1250, ['entrega', 'entregas'])).toBe('1.250 entregas')
  })
})

describe('colorForName', () => {
  it('el mismo nombre da siempre el mismo color', () => {
    expect(colorForName('Ana Ruiz')).toBe(colorForName('Ana Ruiz'))
  })

  it('mira el orden de las letras, que es lo que sumar los códigos no hacía', () => {
    // con cinco colores dos nombres cualesquiera chocan una de cada cinco veces:
    // lo que importa es que un anagrama no colisione *siempre*, como pasaba sumando
    const pares = [['Ana Ruiz', 'Ruiz Ana'], ['Juan Pérez', 'Pérez Juan'], ['Mora Tello', 'Tello Mora']] as const
    expect(pares.some(([a, b]) => colorForName(a) !== colorForName(b))).toBe(true)
  })
})
