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

  it('ningún `text-`, `border-`, `ring-` ni `fill-` nombra un color que no existe', () => {
    // El mismo silencio que el `bg-`, en los otros ejes: la clase queda escrita
    // y no genera nada. `text-` además nombra los roles de tipografía y la
    // alineación, y `border-` los lados y los grosores, así que cada eje trae su
    // propia lista de lo que no es color.
    const tipos = new Set([...puente.matchAll(/^\s*--text-([a-z0-9-]+):/gm)].map(m => m[1]))
    const comunes = /^(transparent|current|inherit|none)$/
    const deTexto = /^(left|center|right|justify|start|end|nowrap|wrap|balance|pretty|ellipsis|clip)$/
    const deBorde = /^([trblxyse](-\d+)?|\d+|solid|dashed|dotted|double|hidden|separate|collapse|spacing(-\d+)?)$/
    const deAnillo = /^(inset|offset(-\d+)?|\d+)$/

    const ejes: [string, (n: string) => boolean][] = [
      ['text', n => colores.has(n) || tipos.has(n) || deTexto.test(n)],
      ['border', n => colores.has(n) || deBorde.test(n)],
      ['ring', n => colores.has(n) || deAnillo.test(n)],
      ['fill', n => colores.has(n)],
      ['stroke', n => colores.has(n)],
    ]

    const huerfanos: string[] = []
    for (const f of fuentes) {
      // Lo que no es una clase: el nombre de un token —`var(--border-strong)`,
      // `token="--text-placeholder"`—, el valor de un `transition-[…]`, y el
      // código citado, que va entre backticks o adentro de un `<code>`.
      const limpio = f.texto
        .replace(/--[a-z0-9-]+/g, ' ')
        .replace(/transition-\[[^\]]*\]/g, ' ')
        .replace(/`[^`]*`/g, ' ')
        .replace(/<code[^>]*>[\s\S]*?<\/code>/g, ' ')
      for (const [eje, vale] of ejes) {
        for (const m of limpio.matchAll(new RegExp(`(?<![\\w-])${eje}-([a-z][a-z0-9-]*)(?:/\\d+)?(?![\\w-])`, 'g'))) {
          if (comunes.test(m[1]) || vale(m[1])) continue
          huerfanos.push(`${f.nombre}: ${eje}-${m[1]}`)
        }
      }
    }
    expect([...new Set(huerfanos)]).toEqual([])
  })

  it('ninguna clase del puente se quedó sin usar', () => {
    // CSS muerto no rompe nada y por eso se queda: había seis clases de retardo
    // —`ui-d1` a `ui-d6`— que no usaba ninguna pieza ni ninguna vista, con seis
    // duraciones escritas a mano que la doctrina dice que no existen.
    const clases = new Set([
      ...[...puente.matchAll(/^\.([a-z][a-z0-9-]*)\s*[,{]/gm)].map(m => m[1]),
      ...[...puente.matchAll(/^@utility ([a-z][a-z0-9-]*)/gm)].map(m => m[1]),
    ])
    const muertas: string[] = []
    for (const c of clases) {
      const suelta = new RegExp(`(?<![\\w-])${c}(?![\\w-])`)
      // Vale que la use una pieza, una vista, o el propio puente componiéndola
      // con otra regla.
      if (fuentes.some(f => suelta.test(f.texto))) continue
      if (puente.split(c).length - 1 > 1) continue
      muertas.push(c)
    }
    expect(muertas).toEqual([])
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
