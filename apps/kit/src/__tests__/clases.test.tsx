import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ComponentType } from 'react'
import { ToastProvider } from '@milo/ui'

/* Las clases que el sistema declara a mano: el reset, la base y el puente. Todo
   lo demás tiene que venir de un módulo, y un módulo llega con el nombre picado. */
const ui = join(import.meta.dirname, '../../../../packages/ui/src')
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
  /* Una clase que no existe no falla, no avisa y deja el elemento sin estilo: así
     el Segmented quedó sin padding al sacar Tailwind, y se vio recién en pantalla.
     Leer las fuentes no alcanza, porque una clase puede llegar por una prop o por
     una constante; lo que se mira es lo que quedó dibujado. */
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

  it('el guardián mira algo: hay clases de módulo dibujadas', () => {
    const Primera = vistas[0][1]
    const { container } = render(<ToastProvider><Primera /></ToastProvider>)
    const hay = [...container.querySelectorAll('[class]')]
      .some(el => (el.getAttribute('class') ?? '').split(/\s+/).some(c => c.startsWith('_')))
    expect(hay).toBe(true)
  })
})
