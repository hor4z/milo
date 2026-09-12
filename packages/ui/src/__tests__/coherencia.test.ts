import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const dir = join(import.meta.dirname, '..')
type Source = { name: string; text: string }

function walk(base: string, prefix = ''): string[] {
  return readdirSync(base).flatMap((f: string) => {
    const path = join(base, f)
    if (statSync(path).isDirectory()) return f === '__tests__' ? [] : walk(path, `${prefix}${f}/`)
    return /\.tsx?$/.test(f) && !f.endsWith('.test.tsx') && !f.endsWith('.gen.ts') && !f.startsWith('icons.') ? [`${prefix}${f}`] : []
  })
}

const sources: Source[] = walk(dir).map((f): Source => ({ name: f, text: readFileSync(join(dir, f), 'utf8') }))

const folders = readdirSync(dir)
  .filter((f: string) => statSync(join(dir, f)).isDirectory())
  .filter((f: string) => f !== '__tests__' && f !== 'lib' && f !== 'assets')

describe('coherencia del sistema', () => {
  it('ningún componente escribe un color a mano', () => {
    const offenders = sources
      .filter(f => /#[0-9a-fA-F]{3,8}\b/.test(f.text.replace(/^\s*\/\/.*$/gm, '')))
      .map(f => f.name)
    expect(offenders).toEqual([])
  })

  it('los radios salen de la escala 6·10·12·16·24', () => {
    const offenders = sources
      .filter(f => /rounded-\[/.test(f.text))
      .map(f => f.name)
    expect(offenders).toEqual([])
  })

  it('los tamaños de texto salen de la escala', () => {
    const offenders = sources
      .filter(f => /text-\[/.test(f.text))
      .map(f => f.name)
    expect(offenders).toEqual([])
  })

  it('nadie usa un nombre de la escala vieja', () => {
    // La escala pasó de nueve escalones anónimos a siete roles. El nombre viejo
    // no genera ninguna utilidad —`--text-*: initial` en el `@theme` los apaga—,
    // así que un call site olvidado no rompe: se queda sin tamaño y hereda el del
    // body, que es casi el correcto. Casi. Por eso lo mira un test.
    const viejos = /\btext-(2xs|xs|sm|base|md|lg|xl|2xl)\b/
    const offenders = sources.filter(f => viejos.test(f.text)).map(f => f.name)
    expect(offenders).toEqual([])
  })

  it('el interlineado y el tracking vienen del rol, no sueltos', () => {
    // El bug que la escala nueva viene a matar: escritos por separado se
    // despegan del tamaño. `text-lg` llegó a ser 20px de letra en una caja de
    // línea de 16 porque el interlineado era un token aparte.
    const sueltos = /\b(leading|tracking)-(\[|none|tight|normal|snug|relaxed|loose|wide|wider|widest)/
    const offenders = sources.filter(f => sueltos.test(f.text)).map(f => f.name)
    expect(offenders).toEqual([])
  })

  it('todo lo público se exporta desde index.ts', () => {
    const index = readFileSync(join(dir, 'index.ts'), 'utf8')
    const missing: string[] = []
    for (const f of sources) {
      if (f.name === 'index.ts') continue
      const exported = [...f.text.matchAll(/^export function ([A-Z]\w+)/gm)].map(m => m[1])
      for (const name of exported) {
        if (!new RegExp(`\\b${name}\\b`).test(index)) missing.push(`${name} (${f.name})`)
      }
    }
    expect(missing).toEqual([])
  })

  it('cada carpeta tiene el componente que le da nombre', () => {
    const missing = folders.filter(c => !readdirSync(join(dir, c)).includes(`${c}.tsx`))
    expect(missing).toEqual([])
  })

  it('ningún botón se olvida el type, que adentro de un form manda el form', () => {
    const offenders: string[] = []
    for (const f of sources) {
      // Sin sacar los comentarios, un `<button>` escrito adentro de un docblock
      // cuenta como una etiqueta más.
      const code = f.text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(?<!:)\/\/.*$/gm, ' ')
      for (const m of code.matchAll(/<button\b[^>]*?>/gs)) {
        if (!m[0].includes('type=')) offenders.push(f.name)
      }
    }
    expect([...new Set(offenders)]).toEqual([])
  })

  it('cada componente tiene su test al lado', () => {
    const missing = folders.filter(c => !readdirSync(join(dir, c)).includes(`${c}.test.tsx`))
    expect(missing).toEqual([])
  })
})
