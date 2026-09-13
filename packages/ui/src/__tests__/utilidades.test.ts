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

/* Todo lo que el sistema declara: los tokens crudos, los roles, las escalas y
   lo que define el propio puente. */
const tokens = join(ui, '../../tokens/src')
const puente = [
  join(ui, 'theme.css'),
  join(ui, 'styles/base.css'),
  join(ui, 'styles/reset.css'),
  join(tokens, 'primitives.css'),
  join(tokens, 'semantic.css'),
  join(tokens, 'scales.css'),
].map(f => readFileSync(f, 'utf8')).join('\n')

/* Los módulos de las piezas y los del kit: es donde ahora vive todo el estilo. */
function modulos(base: string, prefijo = ''): { nombre: string; texto: string }[] {
  return readdirSync(base, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? (e.name === 'node_modules' ? [] : modulos(join(base, e.name), `${prefijo}${e.name}/`))
    : e.name.endsWith('.module.css')
      ? [{ nombre: `${prefijo}${e.name}`, texto: readFileSync(join(base, e.name), 'utf8') }]
      : [])
}

const css = [...modulos(ui), ...modulos(kit)]

describe('el CSS del sistema se sostiene solo', () => {
  it('ningún módulo nombra un token que no existe', () => {
    /* Es el mismo bug que antes atrapaba el puente, con otra forma: un
       `var(--surface-mutado)` no falla, resuelve a vacío y el elemento se queda
       sin color, sin error y sin que nadie se entere. */
    const declarados = new Set([
      /* Sin `^`: hay líneas con dos declaraciones, que es como está escrito el
         par suave de cada color. */
      ...[...puente.matchAll(/(--[a-z][\w-]*)\s*:/g)].map(m => m[1]),
      ...[...puente.matchAll(/@property\s+(--[\w-]+)/g)].map(m => m[1]),
      /* Y las que una pieza pone por `style`, que existen solo en tiempo de uso. */
      ...fuentes.flatMap(f => [...f.texto.matchAll(/'(--[a-z][\w-]*)'\s*:/g)].map(m => m[1])),
    ])
    const propios = /^--milo-/

    const huerfanos: string[] = []
    for (const f of css) {
      for (const m of f.texto.matchAll(/var\((--[a-z][\w-]*)/g)) {
        if (declarados.has(m[1]) || propios.test(m[1])) continue
        huerfanos.push(`${f.nombre}: ${m[1]}`)
      }
    }
    expect([...new Set(huerfanos)]).toEqual([])
  })

  it('ninguna clase de un módulo se quedó sin usar', () => {
    /* CSS muerto no rompe nada y por eso se queda. */
    const muertas: string[] = []
    for (const f of css) {
      const fuente = fuentes.find(s => s.nombre.endsWith(f.nombre.replace('.module.css', '.tsx'))
        || s.nombre.endsWith(f.nombre.replace('.module.css', '.ts')))
      if (!fuente) continue
      for (const m of f.texto.matchAll(/^\s*\.([A-Za-z][\w]*)\s*\{/gm)) {
        if (new RegExp(`\\.${m[1]}(?![\\w])`).test(fuente.texto)) continue
        muertas.push(`${f.nombre}: .${m[1]}`)
      }
    }
    expect(muertas).toEqual([])
  })

  it('no queda nada de Tailwind', () => {
    /* Las directivas son lo que más caro sale: `@theme` y `@utility` no son CSS,
       así que sin Tailwind el navegador se saltea el bloque entero y lo que había
       adentro deja de existir, sin un error en ningún lado. Así estuvieron los
       tres pesos, con el sistema dibujando 400 donde pedía 450. */
    const restos: string[] = []
    for (const f of [...css, { nombre: 'theme.css', texto: puente }]) {
      if (/--tw-|@tailwind|@apply\b|@source\b|@utility\b|@theme\b|var\(--spacing\)|var\(--default-/.test(f.texto)) {
        restos.push(f.nombre)
      }
    }
    expect(restos).toEqual([])
  })

  it('el anillo de foco vive fuera de toda capa', () => {
    const regla = ':where(a, button, input, select, textarea, [tabindex]):focus-visible'
    const i = puente.indexOf(regla)
    expect(i, 'la regla del anillo de foco cambió de forma').toBeGreaterThan(0)

    const antes = puente.slice(0, i).replace(/\/\*[\s\S]*?\*\//g, '').replace(/"[^"]*"|'[^']*'/g, '')
    let profundidad = 0
    for (const c of antes) {
      if (c === '{') profundidad++
      else if (c === '}') profundidad--
    }
    expect(profundidad, 'la regla quedó anidada adentro de otro bloque').toBe(0)
  })

  it('el sistema declara los roles que promete', () => {
    const roles = new Set([...puente.matchAll(/(--[a-z][\w-]*)\s*:/g)].map(m => m[1]))
    for (const n of ['--surface', '--canvas', '--surface-muted', '--surface-sunken', '--brand', '--border', '--border-strong', '--text', '--text-muted']) {
      expect(roles.has(n), `falta ${n}`).toBe(true)
    }
  })
})
