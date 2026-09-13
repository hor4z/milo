import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ui = join(import.meta.dirname, '..')
const kit = join(import.meta.dirname, '../../../../apps/kit/src')

function walk(base: string, prefix = ''): string[] {
  return readdirSync(base).flatMap((f: string) => {
    const path = join(base, f)
    if (statSync(path).isDirectory()) return f === '__tests__' ? [] : walk(path, `${prefix}${f}/`)
    return /\.tsx?$/.test(f) && !f.endsWith('.gen.ts') ? [`${prefix}${f}`] : []
  })
}

const fuentes = [
  ...walk(ui).map(f => ({ nombre: `ui/${f}`, texto: readFileSync(join(ui, f), 'utf8') })),
  ...walk(kit).map(f => ({ nombre: `kit/${f}`, texto: readFileSync(join(kit, f), 'utf8') })),
]

// Los nombres de color salen del puente, que es donde se declaran.
const puente = readFileSync(join(ui, 'theme.css'), 'utf8')
const colores = new Set([...puente.matchAll(/^\s*--color-([a-z0-9-]+):/gm)].map(m => m[1]))

// `bg-` también nombra cosas que no son color: la imagen, el recorte, el degradado.
const noSonColor = /^(transparent|current|none|clip-|origin-|repeat|no-repeat|cover|contain|center|top|bottom|left|right|fixed|local|scroll|auto|gradient-|linear-|radial-|conic-)/

describe('las utilidades de color existen', () => {
  it('ningún `bg-` nombra un color que el puente no declara', () => {
    // La clase queda escrita en el HTML, no genera nada y no hay error. Así
    // estuvieron sin fondo la onda del reproductor y su pista.
    const huerfanos: string[] = []
    for (const f of fuentes) {
      for (const m of f.texto.matchAll(/\bbg-([a-z][a-z0-9-]*)(?:\/\d+)?\b/g)) {
        const nombre = m[1]
        if (noSonColor.test(nombre) || colores.has(nombre)) continue
        huerfanos.push(`${f.nombre}: bg-${nombre}`)
      }
    }
    expect([...new Set(huerfanos)]).toEqual([])
  })

  it('el anillo de foco vive fuera de toda capa', () => {
    // Es lo único que lo hace ganarle a una utilidad de sombra: `:where()` no
    // suma especificidad, así que si esta regla cayera dentro de `@layer`, un
    // `shadow-card` en un elemento enfocable le ganaría y el anillo no se
    // dibujaría — sin error y sin aviso.
    const regla = ':where(a, button, input, select, textarea, [tabindex]):focus-visible'
    const i = puente.indexOf(regla)
    expect(i, 'la regla del anillo de foco cambió de forma').toBeGreaterThan(0)

    // Profundidad de llaves hasta la regla, salteando comentarios y strings.
    const antes = puente.slice(0, i).replace(/\/\*[\s\S]*?\*\//g, '').replace(/"[^"]*"|'[^']*'/g, '')
    let profundidad = 0
    for (const c of antes) {
      if (c === '{') profundidad++
      else if (c === '}') profundidad--
    }
    expect(profundidad, 'la regla quedó anidada adentro de otro bloque').toBe(0)
  })

  it('el puente declara los colores que el sistema promete', () => {
    for (const n of ['surface', 'canvas', 'muted', 'sunken', 'brand', 'line', 'line-strong', 'ink', 'ink-muted']) {
      expect(colores.has(n), `falta --color-${n}`).toBe(true)
    }
  })
})
