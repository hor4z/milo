import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const stories = join(import.meta.dirname, '../stories')
const files = readdirSync(stories).filter((f: string) => f.endsWith('.tsx'))

describe('las vistas del kit', () => {
  it('cada historia abre con una portada', () => {
    const withoutCover: string[] = []
    for (const f of files) {
      const text = readFileSync(join(stories, f), 'utf8')
      const storyCount = [...text.matchAll(/export function (\w+Story)\(/g)].length
      const coverCount = [...text.matchAll(/<Page\b/g)].length
      if (storyCount !== coverCount) withoutCover.push(`${f}: ${storyCount} historias, ${coverCount} portadas`)
    }
    expect(withoutCover).toEqual([])
  })

  it('el sitio usa la misma escala que el paquete', () => {
    const dir = join(import.meta.dirname, '..')
    const walk = (base: string, prefix = ''): string[] =>
      readdirSync(base, { withFileTypes: true }).flatMap(e =>
        e.isDirectory()
          ? (e.name === '__tests__' ? [] : walk(join(base, e.name), `${prefix}${e.name}/`))
          : /\.tsx?$/.test(e.name) ? [`${prefix}${e.name}`] : [],
      )

    const prohibido = /\btext-(2xs|xs|sm|base|md|lg|xl|2xl)\b|text-\[(?![\d.]+em\])|\b(leading|tracking)-(\[|none|tight|normal|snug|relaxed|loose|wide|wider|widest)|\bduration-(\[|\d)/
    const offenders = walk(dir)
      .filter(f => prohibido.test(readFileSync(join(dir, f), 'utf8').replace(/`[^`]*`/g, '')))
    expect(offenders).toEqual([])
  })

  it('el sitio declara la duración y la curva de cada transición', () => {
    const dir = join(import.meta.dirname, '..')
    const walk = (base: string, prefix = ''): string[] =>
      readdirSync(base, { withFileTypes: true }).flatMap(e =>
        e.isDirectory()
          ? (e.name === '__tests__' ? [] : walk(join(base, e.name), `${prefix}${e.name}/`))
          : /\.tsx?$/.test(e.name) ? [`${prefix}${e.name}`] : [],
      )
    const offenders: string[] = []
    for (const f of walk(dir)) {
      const texto = readFileSync(join(dir, f), 'utf8')
      for (const m of texto.matchAll(/(['"`])((?:(?!\1)[\s\S])*?\btransition-[\w[\],-]+(?:(?!\1)[\s\S])*?)\1/g)) {
        const frag = m[2]
        if (!/\bduration-(fast|normal)\b/.test(frag) || !/\bease-(out|in)\b/.test(frag)) {
          offenders.push(`${f}: ${/transition-[\w[\],-]+/.exec(frag)?.[0]}`)
        }
      }
    }
    expect([...new Set(offenders)]).toEqual([])
  })

  it('el sitio tampoco usa el peso de display fuera del tamaño display', () => {
    const dir = join(import.meta.dirname, '..')
    const walk = (base: string, prefix = ''): string[] =>
      readdirSync(base, { withFileTypes: true }).flatMap(e =>
        e.isDirectory()
          ? (e.name === '__tests__' ? [] : walk(join(base, e.name), `${prefix}${e.name}/`))
          : /\.tsx?$/.test(e.name) ? [`${prefix}${e.name}`] : [],
      )
    const offenders: string[] = []
    for (const f of walk(dir)) {
      for (const line of readFileSync(join(dir, f), 'utf8').split('\n')) {
        if (!/\bfont-bold\b/.test(line)) continue
        if (/(['"`])font-bold\1/.test(line)) continue
        if (!/\btext-display\b/.test(line)) offenders.push(`${f}: ${line.trim().slice(0, 56)}`)
      }
    }
    expect(offenders).toEqual([])
  })

  it('ninguna demo muestra un control que no responde', () => {
    const controlados = /^(Select|Search|TextField|Textarea|Slider|Segmented|Checkbox|Radio|Switch)$/
    const dir = join(import.meta.dirname, '..')
    const walk = (base: string, prefix = ''): string[] =>
      readdirSync(base, { withFileTypes: true }).flatMap(e =>
        e.isDirectory()
          ? (e.name === '__tests__' ? [] : walk(join(base, e.name), `${prefix}${e.name}/`))
          : /\.tsx$/.test(e.name) ? [`${prefix}${e.name}`] : [],
      )
    const inertes: string[] = []
    for (const f of walk(dir)) {
      const texto = readFileSync(join(dir, f), 'utf8')
      for (const m of texto.matchAll(/<([A-Z]\w+)((?:[^<>]|\{[^{}]*\})*?)\/>/gs)) {
        const [, nombre, attrs] = m
        if (!controlados.test(nombre)) continue
        if (!/\b(value|checked)=/.test(attrs)) continue
        if (/\bon(Change|ValueChange|Input)=/.test(attrs)) continue
        if (/\b(loading|disabled|readOnly)\b/.test(attrs)) continue
        inertes.push(`${f}: <${nombre} ${attrs.trim().slice(0, 40)}`)
      }
    }
    expect(inertes).toEqual([])
  })

  it('cada portada dice cómo se importa la pieza', () => {
    const withoutImport: string[] = []
    for (const f of files) {
      const text = readFileSync(join(stories, f), 'utf8')
      const covers = [...text.matchAll(/<Page\b/g)].length
      const imports = [...text.matchAll(/imports="/g)].length
      if (covers !== imports) withoutImport.push(`${f}: ${covers} portadas, ${imports} imports`)
    }
    expect(withoutImport).toEqual([])
  })
})

describe('el riel', () => {
  it('cada pieza tiene sinónimos para buscarla', () => {
    const app = readFileSync(join(import.meta.dirname, '../App.tsx'), 'utf8')
    const pieces = [...app.matchAll(/\{ id: '([\w-]+)', label: '[^']*',( alias: '[^']*',)?/g)]
    const withoutAlias = pieces.filter(m => !m[2]).map(m => m[1])
    expect(withoutAlias).toEqual([])
  })
})

describe('accesibilidad documentada', () => {
  const noKeyboard = new Set(['book.tsx', 'folder.tsx', 'icon.tsx', 'chart.tsx'])

  it('cada historia dice qué resuelve en accesibilidad', () => {
    const missing: string[] = []
    for (const f of files) {
      const text = readFileSync(join(stories, f), 'utf8')
      const pageCount = [...text.matchAll(/<Page\b/g)].length
      const blocks = [...text.matchAll(/<A11y\b/g)].length
      if (blocks < pageCount) missing.push(`${f}: ${pageCount} historias, ${blocks} bloques`)
    }
    expect(missing).toEqual([])
  })

  it('las listas de accesibilidad no están vacías', () => {
    const empty: string[] = []
    for (const f of files) {
      const text = readFileSync(join(stories, f), 'utf8')
      for (const m of text.matchAll(/<A11y items=\{\[([\s\S]*?)\]\}/g)) {
        if (m[1].trim().length < 10) empty.push(f)
      }
    }
    expect(empty).toEqual([])
  })

  it('el conjunto no se olvida de ninguna historia con teclado', () => {
    const candidates = files.filter(f => !noKeyboard.has(f))
    expect(candidates.length).toBeGreaterThan(20)
  })
})

describe('los números de la portada', () => {
  it('la landing no anuncia menos tests de los que hay', () => {
    const intro = readFileSync(join(import.meta.dirname, '../intro.tsx'), 'utf8')
    const announced = Number(intro.match(/\['(\d+)', 'tests'\]/)?.[1])

    const root = join(import.meta.dirname, '../../..')
    const walk = (base: string): string[] =>
      readdirSync(base, { withFileTypes: true }).flatMap(e =>
        e.isDirectory() ? walk(join(base, e.name)) : /\.test\.tsx?$/.test(e.name) ? [join(base, e.name)] : [])
    const files = [...walk(join(root, 'src')), ...walk(import.meta.dirname)]
    const written = files.reduce(
      (n, f) => n + [...readFileSync(f, 'utf8').matchAll(/^\s*it\(/gm)].length, 0)

    expect(
      announced,
      `la landing dice ${announced} y hay al menos ${written} tests escritos`,
    ).toBeGreaterThanOrEqual(written)
  })

  it('la cantidad de iconos que anuncia es la del manifiesto', () => {
    const intro = readFileSync(join(import.meta.dirname, '../intro.tsx'), 'utf8')
    const announced = Number(intro.match(/\['(\d+)', 'iconos'\]/)?.[1])
    const gen = readFileSync(
      join(import.meta.dirname, '../../../src/icons.gen.ts'),
      'utf8',
    )
    const reales = [...gen.matchAll(/^\s+\w+: 0x[0-9a-f]+,/gm)].length
    expect(announced).toBe(reales)
  })
})

describe('las escalas que la doctrina dibuja', () => {
  it('cada paso de espaciado que Medidas declara se puede escribir', () => {
    const vista = readFileSync(join(import.meta.dirname, '../foundations/measure.tsx'), 'utf8')
    const pasos = [...vista.matchAll(/\{ px: (\d+), role:/g)].map(m => Number(m[1]))
    const guarda = readFileSync(
      join(import.meta.dirname, '../../../src/__tests__/coherencia.test.ts'),
      'utf8',
    )
    const prohibidos = guarda
      .match(/\)-\(([^)]+)\)\(\?!/)![1]
      .replace(/\\/g, '')
      .split('|')
      .map(s => Number(s) * 4)

    expect(pasos.length).toBeGreaterThan(0)
    expect(prohibidos.length).toBeGreaterThan(0)
    const sinUtilidad = pasos.filter(px => prohibidos.includes(px))
    expect(
      sinUtilidad,
      `Medidas declara ${sinUtilidad.join(', ')}px y la guarda de coherencia prohíbe la utilidad que los escribe`,
    ).toEqual([])
  })
})

describe('cómo se escribe', () => {
  it('no vuelve la raya larga ni las comillas angulares', () => {
    const root = join(import.meta.dirname, '../../..')
    const salta = new Set(['node_modules', '.git', 'dist', 'public', '.vite'])
    const mira = /\.(tsx?|css|mjs|md|html|py|json)$/
    const walk = (base: string, prefix = ''): string[] =>
      readdirSync(base, { withFileTypes: true }).flatMap(e =>
        e.isDirectory()
          ? (salta.has(e.name) ? [] : walk(join(base, e.name), `${prefix}${e.name}/`))
          : mira.test(e.name) && e.name !== 'package-lock.json' ? [`${prefix}${e.name}`] : [])

    const offenders: string[] = []
    for (const f of walk(root)) {
      const text = readFileSync(join(root, f), 'utf8')
      for (const m of text.matchAll(/[\u2014\u00ab\u00bb]/g)) {
        const line = text.slice(0, m.index).split('\n').length
        offenders.push(`${f}:${line} ${text.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\n/g, ' ')}`)
      }
    }
    expect(offenders.slice(0, 12)).toEqual([])
  })
})

describe('useTokens', () => {
  it('no depende de la identidad del arreglo', () => {
    const kit = readFileSync(join(import.meta.dirname, '../kit.tsx'), 'utf8')
    const hook = kit.slice(kit.indexOf('export function useTokens'), kit.indexOf('type PageProps'))
    expect(hook, 'la dependencia tiene que ser el contenido, no el arreglo').not.toMatch(/\}, \[names\]\)/)
    expect(hook).toMatch(/\[key\]/)
  })
})

describe('cobertura del kit', () => {
  const internal = new Set(['Portal', 'PageHeader', 'SectionLabel'])

  it('cada componente exportado se muestra en alguna vista', () => {
    const index = readFileSync(
      join(import.meta.dirname, '../../../src/index.ts'),
      'utf8',
    )
    const exported = new Set<string>()
    for (const m of index.matchAll(/export \{([^}]*)\} from/g)) {
      for (const n of m[1].split(',')) {
        const name = n.trim()
        if (name && /^[A-Z]/.test(name) && !internal.has(name)) exported.add(name)
      }
    }

    const raiz = join(import.meta.dirname, '..')
    const recorrer = (base: string): string[] =>
      readdirSync(base, { withFileTypes: true }).flatMap(e =>
        e.isDirectory()
          ? (e.name === '__tests__' ? [] : recorrer(join(base, e.name)))
          : /\.tsx?$/.test(e.name) ? [join(base, e.name)] : [],
      )
    const sources = recorrer(raiz)
    const text = sources.map((f: string) => readFileSync(f, 'utf8')).join('\n')

    const hidden = [...exported].filter(n => !new RegExp(`<${n}[\\s/>]`).test(text))
    expect(hidden).toEqual([])
  })
})
