import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const dir = join(import.meta.dirname, '..')
type Fuente = { nombre: string; texto: string }

function recorrer(base: string, prefijo = ''): string[] {
  return readdirSync(base).flatMap((f: string) => {
    const ruta = join(base, f)
    if (statSync(ruta).isDirectory()) return f === '__tests__' ? [] : recorrer(ruta, `${prefijo}${f}/`)
    return /\.tsx?$/.test(f) && !f.endsWith('.test.tsx') && !f.startsWith('icons.') ? [`${prefijo}${f}`] : []
  })
}

const fuentes: Fuente[] = recorrer(dir).map((f): Fuente => ({ nombre: f, texto: readFileSync(join(dir, f), 'utf8') }))

const carpetas = readdirSync(dir)
  .filter((f: string) => statSync(join(dir, f)).isDirectory())
  .filter((f: string) => f !== '__tests__' && f !== 'lib' && f !== 'assets')

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

  it('cada carpeta tiene el componente que le da nombre', () => {
    const faltan = carpetas.filter(c => !readdirSync(join(dir, c)).includes(`${c}.tsx`))
    expect(faltan).toEqual([])
  })

  it('ningún botón se olvida el type, que adentro de un form manda el form', () => {
    const culpables: string[] = []
    for (const f of fuentes) {
      for (const m of f.texto.matchAll(/<button\b[^>]*?>/gs)) {
        if (!m[0].includes('type=')) culpables.push(f.nombre)
      }
    }
    expect([...new Set(culpables)]).toEqual([])
  })

  it('cada componente tiene su test al lado', () => {
    const faltan = carpetas.filter(c => !readdirSync(join(dir, c)).includes(`${c}.test.tsx`))
    expect(faltan).toEqual([])
  })
})
