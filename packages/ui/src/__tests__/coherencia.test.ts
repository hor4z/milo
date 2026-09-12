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

  it('las duraciones salen de las dos del sistema', () => {
    // Mismo bug que tenía la tipografía y por eso el mismo guardián: los tokens
    // de movimiento estaban desde el principio y no los leía nadie. Diecisiete
    // call sites escribían `duration-[120ms]` a mano, y cuatro con números que
    // no estaban en ninguna escala: 90, 140, 160, 200.
    const sueltas = /\bduration-(\[|\d)/
    const offenders = sources.filter(f => sueltas.test(f.text)).map(f => f.name)
    expect(offenders).toEqual([])
  })

  it('las curvas también', () => {
    const sueltas = /\bease-(\[|linear|initial)/
    const offenders = sources.filter(f => sueltas.test(f.text)).map(f => f.name)
    expect(offenders).toEqual([])
  })

  it('el espaciado sale de la grilla', () => {
    // Once pasos: 2 4 6 8 12 16 20 24 32 40 48, más el 0. Antes no había escala
    // y los call sites tomaban los dieciocho valores que trae Tailwind, así que
    // dos cosas que hacen lo mismo quedaban separadas por 10 en un lado y por 12
    // en el otro. Esto solo mira el aire: las alturas de pieza —un `h-9` de 36,
    // una fila de 56— salen de la escalera de controles y no de acá.
    const fuera = /(?<![\w-])-?(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-y|space-x)-(1\.5|2\.5|3\.5|7|9|11|13|14|15|\[)(?![\w.])/
    const offenders = sources.filter(f => fuera.test(f.text)).map(f => f.name)
    expect(offenders).toEqual([])
  })

  it('los iconos salen de la escala', () => {
    // 12·14·16·18·20·22 para la interfaz, y 28·40 para un specimen o el hueco de
    // un `EmptyState`. Todos pares: con una fuente, un tamaño impar cae en media
    // grilla de píxeles y se ve borroso. El guardián existe porque el tamaño se
    // pasa como número y no como clase, así que ningún linter lo mira.
    const escala = new Set([12, 14, 16, 18, 20, 22, 28, 40])
    const offenders: string[] = []
    for (const f of sources) {
      for (const m of f.text.matchAll(/<Icon\b[^>]*?size=\{(\d+)\}/gs)) {
        if (!escala.has(Number(m[1]))) offenders.push(`${f.name}: ${m[1]}`)
      }
    }
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
