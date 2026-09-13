import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ComponentType } from 'react'
import { ToastProvider } from '@milo/ui'

/* Cada vista se renderiza de verdad y se le mira el texto. Es lo único que
   encuentra un backtick que quedó escrito: el sitio usa `así` en su prosa y lo
   convierte en código, pero solo en las props que pasan por `Rich` — una lista
   de strings pintada a mano lo mostraba literal. Había diez. */

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
      // Que renderice ya es la mitad del test: una vista que tira se veía solo
      // abriéndola. Envuelta como el shell la envuelve, porque tres usan
      // `useToast`.
      const { container } = render(<ToastProvider><Vista /></ToastProvider>)
      const sueltos: string[] = []
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
      let n: Node | null
      while ((n = walker.nextNode())) {
        const texto = n.nodeValue ?? ''
        const dentroDeCodigo = (n.parentElement as HTMLElement | null)?.closest('pre, code')
        // El backtick y el `**` son marcas de la prosa del sitio: si se ven, es
        // que ese texto no pasó por `Rich`. Adentro de `pre` o `code` pueden
        // ser el contenido.
        if (!dentroDeCodigo && (texto.includes('`') || texto.includes('**'))) {
          sueltos.push(texto.trim().slice(0, 60))
        }
        // Y lo que delata un dato que no llegó.
        if (/\b(undefined|NaN|\[object Object\])\b/.test(texto)) {
          sueltos.push(texto.trim().slice(0, 60))
        }
      }
      expect(sueltos).toEqual([])
    })
  }
})
