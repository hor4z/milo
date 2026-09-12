import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dir = join(import.meta.dirname, '..')
const fuentes = readdirSync(dir)
  .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
  .filter(f => !f.startsWith('icons.gen') && !f.startsWith('icons.meta'))
  .map(f => ({ nombre: f, texto: readFileSync(join(dir, f), 'utf8') }))

describe('coherencia del sistema', () => {
  it('ningún componente escribe un color a mano', () => {
    const culpables = fuentes
      .filter(f => /#[0-9a-fA-F]{3,8}\b/.test(f.texto.replace(/^\s*\/\/.*$/gm, '')))
      .map(f => f.nombre)
    expect(culpables).toEqual([])
  })

  it('los radios salen de la escala 6·10·12·16·24', () => {
    const culpables = fuentes
      .filter(f => /rounded-\[/.test(f.texto))
      .map(f => f.nombre)
    expect(culpables).toEqual([])
  })

  it('los tamaños de texto salen de la escala', () => {
    const culpables = fuentes
      .filter(f => /text-\[\d+px\]/.test(f.texto))
      .map(f => f.nombre)
    expect(culpables).toEqual([])
  })

  it('todo lo público se exporta desde index.ts', () => {
    const index = readFileSync(join(dir, 'index.ts'), 'utf8')
    const faltan: string[] = []
    for (const f of fuentes) {
      if (f.nombre === 'index.ts') continue
      const exportados = [...f.texto.matchAll(/^export function ([A-Z]\w+)/gm)].map(m => m[1])
      for (const nombre of exportados) {
        if (!new RegExp(`\\b${nombre}\\b`).test(index)) faltan.push(`${nombre} (${f.nombre})`)
      }
    }
    expect(faltan).toEqual([])
  })
})
