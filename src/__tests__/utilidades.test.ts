import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'

const ui = join(import.meta.dirname, '..')
const kit = join(import.meta.dirname, '../../kit/src')

function walk(base: string, prefix = ''): string[] {
  return readdirSync(base).flatMap((f: string) => {
    const path = join(base, f)
    if (statSync(path).isDirectory()) return f === '__tests__' ? [] : walk(path, `${prefix}${f}/`)
    return /\.tsx?$/.test(f) && !f.endsWith('.gen.ts') ? [`${prefix}${f}`] : []
  })
}

const sources = [
  ...walk(ui).map(f => ({ name: `ui/${f}`, file: join(ui, f), text: readFileSync(join(ui, f), 'utf8') })),
  ...walk(kit).map(f => ({ name: `kit/${f}`, file: join(kit, f), text: readFileSync(join(kit, f), 'utf8') })),
]

const tokens = join(ui, 'styles/tokens')
const bridge = [
  join(ui, 'theme.css'),
  join(ui, 'styles/base.css'),
  join(ui, 'styles/reset.css'),
  join(tokens, 'primitives.css'),
  join(tokens, 'semantic.css'),
  join(tokens, 'scales.css'),
].map(f => readFileSync(f, 'utf8')).join('\n')

function modules(base: string, prefix = ''): { name: string; file: string; text: string }[] {
  return readdirSync(base, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? (e.name === 'node_modules' ? [] : modules(join(base, e.name), `${prefix}${e.name}/`))
    : e.name.endsWith('.module.css')
      ? [{ name: `${prefix}${e.name}`, file: join(base, e.name), text: readFileSync(join(base, e.name), 'utf8') }]
      : [])
}

const css = [...modules(ui), ...modules(kit)]

const byPath = new Map(css.map(f => [f.file, f]))

const imports = sources.flatMap(source =>
  [...source.text.matchAll(/import\s+(\w+)\s+from\s+'(\.[^']*\.module\.css)'/g)].map(m => ({
    source,
    alias: m[1],
    module: byPath.get(join(dirname(source.file), m[2])),
    request: m[2],
  })))

function declared(text: string) {
  const names = new Set<string>()
  for (const block of text.replace(/:global\([^)]*\)/g, '').matchAll(/([^{};]*)\{/g)) {
    if (/@[\w-]/.test(block[1])) continue
    for (const className of block[1].matchAll(/\.([A-Za-z][\w-]*)/g)) {
      if (/^[A-Za-z]\w*$/.test(className[1])) names.add(className[1])
    }
  }
  return [...names]
}

function used(text: string, alias: string) {
  return new Set([...text.matchAll(new RegExp(`\\b${alias}\\.([A-Za-z][\\w]*)`, 'g'))].map(m => m[1]))
}

const empty = new Set([
  'div', 'span', 'p', 'box', 'a', 'b', 'i', 'em', 'strong', 'small',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'img', 'svg', 'br', 'hr', 'td', 'th', 'tr', 'tbody', 'thead', 'tfoot', 'col', 'colgroup',
  'pre', 'iframe', 'fieldset',
  'cls', 'css', 'style', 'styles', 'wrap', 'wrapper', 'inner', 'outer', 'container',
  'el', 'elem', 'thing', 'stuff',
])

describe('el CSS del sistema se sostiene solo', () => {
  it('ningún módulo nombra un token que no existe', () => {
    const declared = new Set([
      ...[...bridge.matchAll(/(--[a-z][\w-]*)\s*:/g)].map(m => m[1]),
      ...[...bridge.matchAll(/@property\s+(--[\w-]+)/g)].map(m => m[1]),
      ...sources.flatMap(f => [...f.text.matchAll(/'(--[a-z][\w-]*)'\s*:/g)].map(m => m[1])),
    ])
    const own = /^--milo-/

    const orphaned: string[] = []
    for (const f of css) {
      for (const m of f.text.matchAll(/var\((--[a-z][\w-]*)/g)) {
        if (declared.has(m[1]) || own.test(m[1])) continue
        orphaned.push(`${f.name}: ${m[1]}`)
      }
    }
    expect([...new Set(orphaned)]).toEqual([])
  })

  it('cada import de un módulo resuelve a un archivo que existe', () => {
    const broken = imports.filter(i => !i.module).map(i => `${i.source.name}: ${i.request}`)
    expect(broken).toEqual([])
  })

  it('ninguna clase de un módulo se quedó sin usar', () => {
    const uses = new Map<string, Set<string>>()
    for (const i of imports) {
      if (!i.module) continue
      const vistas = uses.get(i.module.file) ?? new Set<string>()
      for (const n of used(i.source.text, i.alias)) vistas.add(n)
      uses.set(i.module.file, vistas)
    }

    const dead: string[] = []
    for (const f of css) {
      const vistas = uses.get(f.file)
      if (!vistas) continue
      for (const n of declared(f.text)) if (!vistas.has(n)) dead.push(`${f.name}: .${n}`)
    }
    expect(dead).toEqual([])
  })

  it('kebab es de las globales: adentro de un módulo apaga a los guardianes', () => {
    const kebab: string[] = []
    for (const f of css) {
      for (const b of f.text.replace(/:global\([^)]*\)/g, '').matchAll(/([^{};]*)\{/g)) {
        if (/@[\w-]/.test(b[1])) continue
        for (const c of b[1].matchAll(/\.([A-Za-z][\w-]*)/g)) {
          if (c[1].includes('-')) kebab.push(`${f.name}: .${c[1]}`)
        }
      }
    }
    expect([...new Set(kebab)]).toEqual([])
  })

  it('ningún nombre de clase deja de decir por qué existe la regla', () => {
    const bad: string[] = []
    for (const f of css) {
      for (const n of declared(f.text)) {
        if (!/^[a-z][A-Za-z0-9]*$/.test(n)) bad.push(`${f.name}: .${n} no es camelCase`)
        else if (/[0-9]$/.test(n)) bad.push(`${f.name}: .${n} termina en un número`)
        else if (empty.has(n)) bad.push(`${f.name}: .${n} nombra la etiqueta y no el papel`)
      }
    }
    expect(bad).toEqual([])
  })

  it('ninguna referencia a una clase apunta a la nada', () => {
    const orphaned: string[] = []
    for (const i of imports) {
      if (!i.module) continue
      const hay = new Set(declared(i.module.text))
      for (const n of used(i.source.text, i.alias)) {
        if (!hay.has(n)) orphaned.push(`${i.source.name}: ${i.alias}.${n} no está en ${relative(ui, i.module.file)}`)
      }
    }
    expect(orphaned).toEqual([])
  })

  it('la duración y la curva de una transición salen de un token', () => {
    const literals: string[] = []
    for (const f of [...css, { name: 'el CSS global', file: '', text: bridge }]) {
      for (const m of f.text.matchAll(/transition-(duration|timing-function):\s*([^;}]+)/g)) {
        // el 1ms de prefers-reduced-motion es apagar el movimiento, no una duración
        if (/^\s*(0s|0ms|1ms|0\.01ms)\b/.test(m[2])) continue
        const expected = m[1] === 'duration' ? /var\(--duration-/ : /var\(--ease-/
        if (!expected.test(m[2])) literals.push(`${f.name}: ${m[0].trim()}`)
      }
    }
    expect(literals).toEqual([])
  })

  it('no quedó maquinaria de gradiente de Tailwind escrita a mano', () => {
    const leftovers = css.filter(f => /--milo-gradient-/.test(f.text)).map(f => f.name)
    expect(leftovers).toEqual([])
  })

  it('no queda nada de Tailwind', () => {
    const leftovers: string[] = []
    for (const f of [...css, { name: 'theme.css', text: bridge }]) {
      if (/--tw-|@tailwind|@apply\b|@source\b|@utility\b|@theme\b|var\(--spacing\)|var\(--default-/.test(f.text)) {
        leftovers.push(f.name)
      }
    }
    expect(leftovers).toEqual([])
  })

  it('el anillo de foco vive fuera de toda capa', () => {
    const rule = ':where(a, button, input, select, textarea, [tabindex]):focus-visible'
    const i = bridge.indexOf(rule)
    expect(i, 'la regla del anillo de foco cambió de forma').toBeGreaterThan(0)

    const antes = bridge.slice(0, i).replace(/\/\*[\s\S]*?\*\//g, '').replace(/"[^"]*"|'[^']*'/g, '')
    let depth = 0
    for (const c of antes) {
      if (c === '{') depth++
      else if (c === '}') depth--
    }
    expect(depth, 'la regla quedó anidada adentro de otro bloque').toBe(0)
  })

  it('el sistema declara los roles que promete', () => {
    const roles = new Set([...bridge.matchAll(/(--[a-z][\w-]*)\s*:/g)].map(m => m[1]))
    for (const n of ['--surface', '--canvas', '--surface-muted', '--surface-sunken', '--brand', '--border', '--border-strong', '--text', '--text-muted']) {
      expect(roles.has(n), `falta ${n}`).toBe(true)
    }
  })
})
