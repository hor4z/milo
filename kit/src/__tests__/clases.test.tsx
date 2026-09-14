import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ComponentType } from 'react'
import { ToastProvider } from '@milo/ui'

const ui = join(import.meta.dirname, '../../../src')
const globales = new Set(
  ['styles/reset.css', 'styles/base.css', 'theme.css']
    .map(f => readFileSync(join(ui, f), 'utf8'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .match(/\.(-?[A-Za-z_][\w-]*)/g)
    ?.map(s => s.slice(1)) ?? [],
)

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

describe('toda clase que llega al HTML resuelve a algo', () => {
  const sueltas = new Set<string>()

  for (const [nombre, Vista] of vistas) {
    it(`${nombre} no deja clases sin definir`, () => {
      const { container } = render(<ToastProvider><Vista /></ToastProvider>)
      const rotas: string[] = []
      for (const el of container.querySelectorAll<HTMLElement>('[class]')) {
        for (const c of (el.getAttribute('class') ?? '').split(/\s+/)) {
          if (!c || c.startsWith('_') || globales.has(c)) continue
          rotas.push(c)
          sueltas.add(c)
        }
      }
      expect([...new Set(rotas)]).toEqual([])
    })
  }

  it('touch-target va solo donde toda la superficie es el mismo objetivo', () => {
    // el ::after se pinta sobre el contenido, así que en algo que lleva un control
    // adentro se queda con el tap que iba a ese control
    const malos: string[] = []
    for (const [nombre, Vista] of vistas) {
      const { container } = render(<ToastProvider><Vista /></ToastProvider>)
      for (const el of container.querySelectorAll('.touch-target')) {
        const adentro = el.querySelector('input, textarea, select, button, a[href], [tabindex]')
        if (adentro) malos.push(`${nombre}: un ${el.tagName.toLowerCase()} con un ${adentro.tagName.toLowerCase()} adentro`)
      }
    }
    expect([...new Set(malos)]).toEqual([])
  })

  it('el guardián mira algo: hay clases de módulo dibujadas', () => {
    const Primera = vistas[0][1]
    const { container } = render(<ToastProvider><Primera /></ToastProvider>)
    const found = [...container.querySelectorAll('[class]')]
      .some(el => (el.getAttribute('class') ?? '').split(/\s+/).some(c => c.startsWith('_')))
    expect(found).toBe(true)
  })
})
