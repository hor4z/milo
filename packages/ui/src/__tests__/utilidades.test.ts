import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'

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
  ...walk(ui).map(f => ({ nombre: `ui/${f}`, ruta: join(ui, f), texto: readFileSync(join(ui, f), 'utf8') })),
  ...walk(kit).map(f => ({ nombre: `kit/${f}`, ruta: join(kit, f), texto: readFileSync(join(kit, f), 'utf8') })),
]

const tokens = join(ui, '../../tokens/src')
const puente = [
  join(ui, 'theme.css'),
  join(ui, 'styles/base.css'),
  join(ui, 'styles/reset.css'),
  join(tokens, 'primitives.css'),
  join(tokens, 'semantic.css'),
  join(tokens, 'scales.css'),
].map(f => readFileSync(f, 'utf8')).join('\n')

function modulos(base: string, prefijo = ''): { nombre: string; ruta: string; texto: string }[] {
  return readdirSync(base, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? (e.name === 'node_modules' ? [] : modulos(join(base, e.name), `${prefijo}${e.name}/`))
    : e.name.endsWith('.module.css')
      ? [{ nombre: `${prefijo}${e.name}`, ruta: join(base, e.name), texto: readFileSync(join(base, e.name), 'utf8') }]
      : [])
}

const css = [...modulos(ui), ...modulos(kit)]

const porRuta = new Map(css.map(f => [f.ruta, f]))

const importaciones = fuentes.flatMap(fuente =>
  [...fuente.texto.matchAll(/import\s+(\w+)\s+from\s+'(\.[^']*\.module\.css)'/g)].map(m => ({
    fuente,
    alias: m[1],
    modulo: porRuta.get(join(dirname(fuente.ruta), m[2])),
    pedido: m[2],
  })))

function declaradas(texto: string) {
  const nombres = new Set<string>()
  for (const bloque of texto.replace(/:global\([^)]*\)/g, '').matchAll(/([^{};]*)\{/g)) {
    if (/@[\w-]/.test(bloque[1])) continue
    for (const clase of bloque[1].matchAll(/\.([A-Za-z][\w-]*)/g)) {
      if (/^[A-Za-z]\w*$/.test(clase[1])) nombres.add(clase[1])
    }
  }
  return [...nombres]
}

function usadas(texto: string, alias: string) {
  return new Set([...texto.matchAll(new RegExp(`\\b${alias}\\.([A-Za-z][\\w]*)`, 'g'))].map(m => m[1]))
}

const vacios = new Set([
  'div', 'span', 'p', 'box', 'a', 'b', 'i', 'em', 'strong', 'small',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'img', 'svg', 'br', 'hr', 'td', 'th', 'tr', 'tbody', 'thead', 'tfoot', 'col', 'colgroup',
  'pre', 'iframe', 'fieldset',
  'cls', 'css', 'style', 'styles', 'wrap', 'wrapper', 'inner', 'outer', 'container',
  'el', 'elem', 'thing', 'stuff',
])

describe('el CSS del sistema se sostiene solo', () => {
  it('ningún módulo nombra un token que no existe', () => {
    const declarados = new Set([
      ...[...puente.matchAll(/(--[a-z][\w-]*)\s*:/g)].map(m => m[1]),
      ...[...puente.matchAll(/@property\s+(--[\w-]+)/g)].map(m => m[1]),
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

  it('cada import de un módulo resuelve a un archivo que existe', () => {
    const rotos = importaciones.filter(i => !i.modulo).map(i => `${i.fuente.nombre}: ${i.pedido}`)
    expect(rotos).toEqual([])
  })

  it('ninguna clase de un módulo se quedó sin usar', () => {
    const usos = new Map<string, Set<string>>()
    for (const i of importaciones) {
      if (!i.modulo) continue
      const vistas = usos.get(i.modulo.ruta) ?? new Set<string>()
      for (const n of usadas(i.fuente.texto, i.alias)) vistas.add(n)
      usos.set(i.modulo.ruta, vistas)
    }

    const muertas: string[] = []
    for (const f of css) {
      const vistas = usos.get(f.ruta)
      if (!vistas) continue
      for (const n of declaradas(f.texto)) if (!vistas.has(n)) muertas.push(`${f.nombre}: .${n}`)
    }
    expect(muertas).toEqual([])
  })

  it('kebab es de las globales: adentro de un módulo apaga a los guardianes', () => {
    const kebab: string[] = []
    for (const f of css) {
      for (const b of f.texto.replace(/:global\([^)]*\)/g, '').matchAll(/([^{};]*)\{/g)) {
        if (/@[\w-]/.test(b[1])) continue
        for (const c of b[1].matchAll(/\.([A-Za-z][\w-]*)/g)) {
          if (c[1].includes('-')) kebab.push(`${f.nombre}: .${c[1]}`)
        }
      }
    }
    expect([...new Set(kebab)]).toEqual([])
  })

  it('ningún nombre de clase deja de decir por qué existe la regla', () => {
    const malos: string[] = []
    for (const f of css) {
      for (const n of declaradas(f.texto)) {
        if (!/^[a-z][A-Za-z0-9]*$/.test(n)) malos.push(`${f.nombre}: .${n} no es camelCase`)
        else if (/[0-9]$/.test(n)) malos.push(`${f.nombre}: .${n} termina en un número`)
        else if (vacios.has(n)) malos.push(`${f.nombre}: .${n} nombra la etiqueta y no el papel`)
      }
    }
    expect(malos).toEqual([])
  })

  it('ninguna referencia a una clase apunta a la nada', () => {
    const huerfanas: string[] = []
    for (const i of importaciones) {
      if (!i.modulo) continue
      const hay = new Set(declaradas(i.modulo.texto))
      for (const n of usadas(i.fuente.texto, i.alias)) {
        if (!hay.has(n)) huerfanas.push(`${i.fuente.nombre}: ${i.alias}.${n} no está en ${relative(ui, i.modulo.ruta)}`)
      }
    }
    expect(huerfanas).toEqual([])
  })

  it('no queda nada de Tailwind', () => {
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
