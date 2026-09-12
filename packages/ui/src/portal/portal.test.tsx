import { useLayoutEffect, useRef } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Portal } from './portal'

describe('Portal', () => {
  it('cuelga el contenido del body', () => {
    render(<Portal><p>afuera</p></Portal>)
    const host = document.querySelector('[data-portal]')
    expect(host?.parentElement).toBe(document.body)
    expect(host).toContainElement(screen.getByText('afuera'))
  })

  it('el hijo ya se puede medir en su layout effect, no un frame después', () => {
    let measured: HTMLElement | null = null
    function Probe() {
      const ref = useRef<HTMLDivElement>(null)
      useLayoutEffect(() => { measured = ref.current }, [])
      return <div ref={ref}>medible</div>
    }
    render(<Portal><Probe /></Portal>)
    expect(measured).not.toBeNull()
    expect(measured!.isConnected).toBe(true)
  })

  it('anidado sube el z-index un escalón', () => {
    render(
      <Portal>
        <Portal><p>adentro</p></Portal>
      </Portal>,
    )
    const hosts = [...document.querySelectorAll<HTMLElement>('[data-portal]')]
    expect(hosts.map(h => h.dataset.portal).sort()).toEqual(['0', '1'])
    const [outer, inner] = hosts.sort((a, b) => Number(a.dataset.portal) - Number(b.dataset.portal))
    expect(Number(inner.style.zIndex)).toBeGreaterThan(Number(outer.style.zIndex))
  })

  it('al desmontar se lleva su host', () => {
    const { unmount } = render(<Portal><p>afuera</p></Portal>)
    unmount()
    expect(document.querySelector('[data-portal]')).toBeNull()
  })
})
