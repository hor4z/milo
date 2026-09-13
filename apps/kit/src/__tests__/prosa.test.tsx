import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ComponentType } from 'react'
import { ToastProvider } from '@milo/ui'

const modulos = import.meta.glob('../{stories,foundations,mascots}/*.tsx', { eager: true }) as
  Record<string, Record<string, unknown>>

const vistas: [string, ComponentType][] = []
for (const [ruta, mod] of Object.entries(modulos)) {
  for (const [nombre, valor] of Object.entries(mod)) {
    if (typeof valor !== 'function') continue
    if (!/(Story|Section)$/.test(nombre)) continue
    vistas.push([`${ruta.split('/').pop()} · ${nombre}`, valor as ComponentType])
  }
}

describe('la prosa del sitio', () => {
  it('encuentra todas las vistas', () => {
    expect(vistas.length).toBeGreaterThan(60)
  })

  for (const [nombre, Vista] of vistas) {
    it(`${nombre} se dibuja y no deja marcas a la vista`, () => {
      const { container } = render(<ToastProvider><Vista /></ToastProvider>)
      const sueltos: string[] = []
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
      let n: Node | null
      while ((n = walker.nextNode())) {
        const texto = n.nodeValue ?? ''
        const dentroDeCodigo = (n.parentElement as HTMLElement | null)?.closest('pre, code')
        if (!dentroDeCodigo && (texto.includes('`') || texto.includes('**'))) {
          sueltos.push(texto.trim().slice(0, 60))
        }
        if (/\b(undefined|NaN|\[object Object\])\b/.test(texto)) {
          sueltos.push(texto.trim().slice(0, 60))
        }
      }
      expect(sueltos).toEqual([])
    })
  }
})
