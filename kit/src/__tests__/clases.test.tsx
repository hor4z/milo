import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ComponentType } from 'react'
import { ToastProvider } from '@milo/ui'

const ui = join(import.meta.dirname, '../../../src')
const globals = new Set(
  ['styles/reset.css', 'styles/base.css', 'theme.css']
    .map(f => readFileSync(join(ui, f), 'utf8'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .match(/\.(-?[A-Za-z_][\w-]*)/g)
    ?.map(s => s.slice(1)) ?? [],
)

const modules = import.meta.glob('../{stories,foundations,mascots}/*.tsx', { eager: true }) as
  Record<string, Record<string, unknown>>

const views: [string, ComponentType][] = []
for (const [path, mod] of Object.entries(modules)) {
  for (const [name, value] of Object.entries(mod)) {
    if (typeof value !== 'function') continue
    if (!/(Story|Section)$/.test(name)) continue
    views.push([`${path.split('/').pop()} · ${name}`, value as ComponentType])
  }
}

describe('toda clase que llega al HTML resuelve a algo', () => {
  const loose = new Set<string>()

  for (const [name, View] of views) {
    it(`${name} no deja clases sin definir`, () => {
      const { container } = render(<ToastProvider><View /></ToastProvider>)
      const broken: string[] = []
      for (const el of container.querySelectorAll<HTMLElement>('[class]')) {
        for (const c of (el.getAttribute('class') ?? '').split(/\s+/)) {
          if (!c || c.startsWith('_') || globals.has(c)) continue
          broken.push(c)
          loose.add(c)
        }
      }
      expect([...new Set(broken)]).toEqual([])
    })
  }

  it('touch-target va solo donde toda la superficie es el mismo objetivo', () => {
    // el ::after se pinta sobre el contenido, así que en algo que lleva un control
    // adentro se queda con el tap que iba a ese control
    const bad: string[] = []
    for (const [name, View] of views) {
      const { container } = render(<ToastProvider><View /></ToastProvider>)
      for (const el of container.querySelectorAll('.touch-target')) {
        const inside = el.querySelector('input, textarea, select, button, a[href], [tabindex]')
        if (inside) bad.push(`${name}: un ${el.tagName.toLowerCase()} con un ${inside.tagName.toLowerCase()} adentro`)
      }
    }
    expect([...new Set(bad)]).toEqual([])
  })

  it('el guardián mira algo: hay clases de módulo dibujadas', () => {
    const First = views[0][1]
    const { container } = render(<ToastProvider><First /></ToastProvider>)
    const found = [...container.querySelectorAll('[class]')]
      .some(el => (el.getAttribute('class') ?? '').split(/\s+/).some(c => c.startsWith('_')))
    expect(found).toBe(true)
  })
})
