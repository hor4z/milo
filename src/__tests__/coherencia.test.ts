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
  .filter((f: string) => !['__tests__', 'lib', 'assets', 'styles'].includes(f))

describe('coherencia del sistema', () => {
  it('ningún componente escribe un color a mano', () => {
    const offenders = sources
      .filter(f => /#[0-9a-fA-F]{3,8}\b/.test(f.text.replace(/^\s*\/\/.*$/gm, '')))
      .map(f => f.name)
    expect(offenders).toEqual([])
  })

  it('una pieza con escalera de tamaños arranca en md', () => {
    const offenders: string[] = []
    for (const f of sources) {
      if (!/\bsize\?:\s*(?:'\w+'\s*\|\s*)*'md'/.test(f.text)) continue
      for (const m of f.text.matchAll(/\bsize\s*=\s*'(\w+)'/g)) {
        if (m[1] !== 'md') offenders.push(`${f.name}: size = '${m[1]}'`)
      }
    }
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
    const stale = /\btext-(2xs|xs|sm|base|md|lg|xl|2xl)\b/
    const offenders = sources.filter(f => stale.test(f.text)).map(f => f.name)
    expect(offenders).toEqual([])
  })

  it('el interlineado y el tracking vienen del rol, no sueltos', () => {
    const loose = /\b(leading|tracking)-(\[|none|tight|normal|snug|relaxed|loose|wide|wider|widest)/
    const offenders = sources.filter(f => loose.test(f.text)).map(f => f.name)
    expect(offenders).toEqual([])
  })

  it('las duraciones salen de las dos del sistema', () => {
    const loose = /\bduration-(\[|\d)/
    const offenders = sources.filter(f => loose.test(f.text)).map(f => f.name)
    expect(offenders).toEqual([])
  })

  it('las curvas también', () => {
    const loose = /\bease-(\[|linear|initial)/
    const offenders = sources.filter(f => loose.test(f.text)).map(f => f.name)
    expect(offenders).toEqual([])
  })

  it('el espaciado sale de la grilla', () => {
    const axis = 'p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-y|space-x'
    const outside = new RegExp(`(?<![\\w-])-?(${axis})-(1\\.5|2\\.5|3\\.5|7|9|11|13|14|15)(?![\\w.])`)
    const offenders = sources.filter(f => outside.test(f.text)).map(f => f.name)
    expect(offenders).toEqual([])
  })

  it('un espaciado arbitrario va con un token adentro, no con un número', () => {
    const axis = 'p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-y|space-x'
    const magic = new RegExp(`(?<![\\w-])-?(${axis})-\\[(?!var\\(|calc\\()`, 'g')
    const offenders: string[] = []
    for (const f of sources) {
      for (const m of f.text.matchAll(magic)) offenders.push(`${f.name}: ${f.text.slice(m.index, m.index! + 18)}`)
    }
    expect(offenders).toEqual([])
  })

  it('una transición declara su duración y su curva', () => {
    const offenders: string[] = []
    for (const f of sources) {
      for (const m of f.text.matchAll(/(['"`])((?:(?!\1)[\s\S])*?\btransition-[\w[\],-]+(?:(?!\1)[\s\S])*?)\1/g)) {
        const frag = m[2]
        if (!/\bduration-(fast|normal)\b/.test(frag) || !/\bease-(out|in)\b/.test(frag)) {
          offenders.push(`${f.name}: ${/transition-[\w[\],-]+/.exec(frag)?.[0]}`)
        }
      }
    }
    expect([...new Set(offenders)]).toEqual([])
  })

  it('un panel anclado a un disparador usa la receta de cierre', () => {
    const anchored = sources.filter(f =>
      /getBoundingClientRect\(\)/.test(f.text) && /<Portal[\s>]/.test(f.text))
    const withoutRecipe = anchored.filter(f => !/from '\.\.\/lib\/dismiss'/.test(f.text)).map(f => f.name)
    expect(anchored.length, 'no se encontró ningún panel anclado: el guardián dejó de mirar').toBeGreaterThan(0)
    expect(
      withoutRecipe,
      'mide a su disparador y flota en un portal, así que al scrollear la página se le despega: va useDismiss',
    ).toEqual([])
  })

  it('nada suena solo', () => {
    const offenders = sources
      .filter(f => /\bautoplay\b/i.test(f.text))
      .map(f => f.name)
    expect(offenders, 'nada arranca sin que alguien lo pida').toEqual([])
  })

  it('nadie escribe un reloj ni un relativo a mano', () => {
    const clock = /(?<![\w:/-])\d{1,2}:\d{2}(?![\w:/-])/
    const relative = /\bhace \d+ ?(min\b|h\b|hs\b|d\b|mins\b)/
    const offenders: string[] = []
    for (const f of sources) {
      if (f.name.startsWith('lib/time')) continue
      const text = f.text.replace(/^import .*$/gm, '')
      if (clock.test(text)) offenders.push(`${f.name}: un reloj escrito a mano`)
      if (relative.test(text)) offenders.push(`${f.name}: un relativo con la unidad abreviada`)
    }
    expect(offenders).toEqual([])
  })

  it('los iconos salen de la escala, también cuando el número llega por una tabla', () => {
    const scale = new Set([12, 14, 16, 18, 20, 22, 24])
    const offenders: string[] = []
    for (const f of sources) {
      for (const m of f.text.matchAll(/<Icon\b[^>]*?size=\{([^}]+)\}/gs)) {
        const raw = m[1].trim()
        if (/^\d+$/.test(raw)) {
          if (!scale.has(Number(raw))) offenders.push(`${f.name}: ${raw}`)
          continue
        }
        const key = raw.split('.').pop()!
        if (!/^\w+$/.test(key)) continue
        for (const t of f.text.matchAll(new RegExp(`(?:^|[{,])\\s*${key}:\\s*(\\d+)\\s*,`, 'gm'))) {
          if (!scale.has(Number(t[1]))) offenders.push(`${f.name}: ${key} vale ${t[1]}`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it('los pesos salen de los tres roles', () => {
    const outside = /font-\[\d|font-(thin|extralight|light|normal|extrabold|black)\b/
    const offenders = sources.filter(f => outside.test(f.text)).map(f => f.name)
    expect(offenders).toEqual([])
  })

  it('el peso de display solo aparece en tamaño display', () => {
    const offenders: string[] = []
    for (const f of sources) {
      for (const line of f.text.split('\n')) {
        if (!/\bfont-bold\b/.test(line)) continue
        if (/(['"`])font-bold\1/.test(line)) continue
        if (!/\btext-display\b/.test(line)) offenders.push(`${f.name}: ${line.trim().slice(0, 56)}`)
      }
    }
    expect(offenders).toEqual([])
  })

  it('ningún var() nombra una custom property que nadie declara', () => {
    const raiz = join(import.meta.dirname, '../..')
    const css: { name: string; text: string }[] = []
    const tsx: string[] = []
    const recorrer = (base: string, prefijo = '') => {
      for (const e of readdirSync(base, { withFileTypes: true })) {
        if (e.isDirectory()) {
          if (!['node_modules', '.git', 'dist', '.vite'].includes(e.name)) recorrer(join(base, e.name), `${prefijo}${e.name}/`)
        } else if (e.name.endsWith('.css')) {
          css.push({ name: `${prefijo}${e.name}`, text: readFileSync(join(base, e.name), 'utf8') })
        } else if (/\.tsx?$/.test(e.name)) {
          tsx.push(readFileSync(join(base, e.name), 'utf8'))
        }
      }
    }
    recorrer(join(raiz, 'src'))
    recorrer(join(raiz, 'kit/src'))

    const declaradas = new Set<string>()
    for (const f of css) for (const m of f.text.matchAll(/(--[\w-]+)\s*:/g)) declaradas.add(m[1])
    for (const t of tsx) for (const m of t.matchAll(/['"](--[\w-]+)['"]\s*:/g)) declaradas.add(m[1])

    const huerfanas: string[] = []
    for (const f of css) {
      for (const m of f.text.matchAll(/var\(\s*(--[\w-]+)\s*(\)|,)/g)) {
        if (m[2] === ',') continue
        if (declaradas.has(m[1])) continue
        const linea = f.text.slice(0, m.index).split('\n').length
        huerfanas.push(`${f.name}:${linea} ${m[1]}`)
      }
    }
    expect(
      huerfanas,
      'un var() sin valor ni fallback invalida la declaración entera, sin error y sin que nadie se entere',
    ).toEqual([])
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
