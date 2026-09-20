import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { propsByComponent } from '@milo/ui/props'

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

    const banned = /\btext-(2xs|xs|sm|base|md|lg|xl|2xl)\b|text-\[(?![\d.]+em\])|\b(leading|tracking)-(\[|none|tight|normal|snug|relaxed|loose|wide|wider|widest)|\bduration-(\[|\d)/
    const offenders = walk(dir)
      .filter(f => banned.test(readFileSync(join(dir, f), 'utf8').replace(/`[^`]*`/g, '')))
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
      const text = readFileSync(join(dir, f), 'utf8')
      for (const m of text.matchAll(/(['"`])((?:(?!\1)[\s\S])*?\btransition-[\w[\],-]+(?:(?!\1)[\s\S])*?)\1/g)) {
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
    const controlled = /^(Select|Search|TextField|Textarea|Slider|Segmented|Checkbox|Radio|Switch)$/
    const dir = join(import.meta.dirname, '..')
    const walk = (base: string, prefix = ''): string[] =>
      readdirSync(base, { withFileTypes: true }).flatMap(e =>
        e.isDirectory()
          ? (e.name === '__tests__' ? [] : walk(join(base, e.name), `${prefix}${e.name}/`))
          : /\.tsx$/.test(e.name) ? [`${prefix}${e.name}`] : [],
      )
    const inert: string[] = []
    for (const f of walk(dir)) {
      const text = readFileSync(join(dir, f), 'utf8')
      for (const m of text.matchAll(/<([A-Z]\w+)((?:[^<>]|\{[^{}]*\})*?)\/>/gs)) {
        const [, name, attrs] = m
        if (!controlled.test(name)) continue
        if (!/\b(value|checked)=/.test(attrs)) continue
        if (/\bon(Change|ValueChange|Input)=/.test(attrs)) continue
        if (/\b(loading|disabled|readOnly)\b/.test(attrs)) continue
        inert.push(`${f}: <${name} ${attrs.trim().slice(0, 40)}`)
      }
    }
    expect(inert).toEqual([])
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

describe('los guardianes ven todas las vistas', () => {
  it('cada vista se llama Story o Section, que es por donde la agarran', () => {
    const dirs = ['../stories', '../foundations']
    const invisible: string[] = []
    for (const d of dirs) {
      const base = join(import.meta.dirname, d)
      for (const f of readdirSync(base).filter((n: string) => n.endsWith('.tsx'))) {
        const text = readFileSync(join(base, f), 'utf8')
        if (!/<Page\b/.test(text)) continue
        const seen = [...text.matchAll(/export function (\w+)\(/g)].map(m => m[1])
        if (!seen.some(n => /(Story|Section)$/.test(n))) {
          invisible.push(`${f}: exporta ${seen.join(', ')} y ninguno termina en Story ni en Section`)
        }
      }
    }
    expect(
      invisible,
      'una vista con otro sufijo no la dibuja ni el test de prosa ni el de clases, y queda sin cubrir en silencio',
    ).toEqual([])
  })
})

describe('la prosa no se pega', () => {
  it('ningún texto queda pegado a un elemento inline por un corte de línea', () => {
    const inline = '(?:code|strong|em|b|i|a|span|Rich)'
    const antes = new RegExp(`[^\\s>}{/(]\\n\\s*<${inline}[ >]`, 'g')
    const despues = new RegExp(`</${inline}>\\n\\s*[^\\s<{}/)\\]:?]`, 'g')
    const dirs = ['../stories', '../foundations', '..']
    const pegados: string[] = []
    for (const d of dirs) {
      const base = join(import.meta.dirname, d)
      for (const f of readdirSync(base, { withFileTypes: true })) {
        if (!f.isFile() || !f.name.endsWith('.tsx')) continue
        const text = readFileSync(join(base, f.name), 'utf8')
        for (const rx of [antes, despues]) {
          for (const m of text.matchAll(rx)) {
            const desde = text.lastIndexOf('\n', m.index) + 1
            if (/\breturn\s*</.test(text.slice(desde, m.index + m[0].length))) continue
            const line = text.slice(0, m.index).split('\n').length
            pegados.push(`${f.name}:${line} ${m[0].replace(/\n\s*/, ' ⏎ ')}`)
          }
        }
      }
    }
    expect(
      pegados,
      'JSX se come el espacio cuando un texto toca un elemento a través de un salto de línea: va {\' \'} en el corte',
    ).toEqual([])
  })
})

describe('los medios que el sitio pide', () => {
  it('cada cara que se nombra existe en public/', () => {
    const raiz = join(import.meta.dirname, '../..')
    const hay = new Set(readdirSync(join(raiz, 'public/avatars')))
    const pedidas = new Set<string>()
    const recorrer = (base: string) => {
      for (const e of readdirSync(base, { withFileTypes: true })) {
        if (e.isDirectory()) { recorrer(join(base, e.name)); continue }
        if (!/\.tsx?$/.test(e.name)) continue
        const t = readFileSync(join(base, e.name), 'utf8')
        for (const m of t.matchAll(/avatars\/(\d+)\.webp/g)) pedidas.add(`${m[1]}.webp`)
        for (const m of t.matchAll(/face\((\d+)\)/g)) pedidas.add(`${String(m[1]).padStart(2, '0')}.webp`)
      }
    }
    recorrer(join(import.meta.dirname, '..'))
    expect(pedidas.size).toBeGreaterThan(3)
    expect(
      [...pedidas].filter(f => !hay.has(f)),
      'una cara que no existe se dibuja como un roto y ningún test de comportamiento la ve',
    ).toEqual([])
  })
})

describe('el riel', () => {
  it('cada pieza tiene sinónimos para buscarla', () => {
    const app = readFileSync(join(import.meta.dirname, '../app.tsx'), 'utf8')
    const pieces = [...app.matchAll(/\{ id: '([\w-]+)', label: '[^']*',( alias: '[^']*',)?/g)]
    const withoutAlias = pieces.filter(m => !m[2]).map(m => m[1])
    expect(withoutAlias).toEqual([])
  })
})

describe('accesibilidad documentada', () => {
  const noKeyboard = new Set(['folder.tsx', 'icon.tsx', 'chart.tsx'])

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
  it('la cantidad de piezas que anuncia es la de las carpetas', () => {
    const intro = readFileSync(join(import.meta.dirname, '../intro.tsx'), 'utf8')
    const announced = Number(intro.match(/\['(\d+)', 'piezas'\]/)?.[1])
    const src = join(import.meta.dirname, '../../../src')
    const reales = readdirSync(src, { withFileTypes: true })
      .filter(e => e.isDirectory() && !['styles', 'lib', '__tests__'].includes(e.name)).length
    expect(
      announced,
      `la portada dice ${announced} piezas y en src/ hay ${reales} carpetas`,
    ).toBe(reales)
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
    const view = readFileSync(join(import.meta.dirname, '../foundations/measure.tsx'), 'utf8')
    const steps = [...view.matchAll(/\{ px: (\d+), role:/g)].map(m => Number(m[1]))
    const guards = readFileSync(
      join(import.meta.dirname, '../../../src/__tests__/coherencia.test.ts'),
      'utf8',
    )
    const banned = guards
      .match(/\)-\(([^)]+)\)\(\?!/)![1]
      .replace(/\\/g, '')
      .split('|')
      .map(s => Number(s) * 4)

    expect(steps.length).toBeGreaterThan(0)
    expect(banned.length).toBeGreaterThan(0)
    const withoutHelper = steps.filter(px => banned.includes(px))
    expect(
      withoutHelper,
      `Medidas declara ${withoutHelper.join(', ')}px y la guarda de coherencia prohíbe la utilidad que los escribe`,
    ).toEqual([])
  })
})

describe('cómo se escribe', () => {
  it('no vuelve la raya larga ni las comillas angulares', () => {
    const root = join(import.meta.dirname, '../../..')
    const skips = new Set(['node_modules', '.git', 'dist', 'public', '.vite'])
    const mira = /\.(tsx?|css|mjs|md|html|py|json)$/
    const walk = (base: string, prefix = ''): string[] =>
      readdirSync(base, { withFileTypes: true }).flatMap(e =>
        e.isDirectory()
          ? (skips.has(e.name) ? [] : walk(join(base, e.name), `${prefix}${e.name}/`))
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

describe('el corte entre el sitio y el paquete', () => {
  it('el sitio entra al paquete por @milo/ui y no por una ruta relativa', () => {
    const base = join(import.meta.dirname, '..')
    const walk = (dir: string, prefix = ''): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap(e =>
        e.isDirectory()
          ? walk(join(dir, e.name), `${prefix}${e.name}/`)
          : /\.tsx?$/.test(e.name) ? [`${prefix}${e.name}`] : [])

    const offenders: string[] = []
    for (const f of walk(base)) {
      if (f.startsWith('__tests__/')) continue
      const text = readFileSync(join(base, f), 'utf8')
      for (const m of text.matchAll(/from ['"]((?:\.\.\/)+src\/[^'"]*)['"]/g)) {
        offenders.push(`${f}: ${m[1]}`)
      }
    }
    expect(
      offenders,
      'el alias @milo/ui es lo que sostiene el corte: una ruta relativa hacia src/ lo rompe',
    ).toEqual([])
  })
})

describe('la tabla de props', () => {
  it('toda pieza que una vista pide existe en props.gen', () => {
    const root = join(import.meta.dirname, '..')
    const walk = (base: string): string[] =>
      readdirSync(base, { withFileTypes: true }).flatMap(e =>
        e.isDirectory()
          ? (e.name === '__tests__' ? [] : walk(join(base, e.name)))
          : /\.tsx$/.test(e.name) ? [join(base, e.name)] : [],
      )

    const fantasmas: string[] = []
    for (const file of walk(root)) {
      const text = readFileSync(file, 'utf8')
      for (const m of text.matchAll(/<Props of=(?:"([^"]+)"|\{\[([^\]]*)\]\})/g)) {
        const pedidos = m[1] ? [m[1]] : m[2].split(',').map(s => s.trim().replace(/^'|'$/g, ''))
        for (const p of pedidos) {
          if (p && !(p in propsByComponent)) fantasmas.push(`${file.split('/').pop()}: ${p}`)
        }
      }
    }
    expect(
      fantasmas,
      'una vista que pide una pieza que no existe dibuja una tabla vacía y nadie se entera',
    ).toEqual([])
  })
})

describe('cobertura del kit', () => {
  const internal = new Set(['Portal', 'PageHeader', 'SectionLabel'])

  it('cada componente exportado se muestra en alguna vista', () => {
    const pkg = join(import.meta.dirname, '../../../src')
    const exported = new Set<string>()
    for (const folder of readdirSync(pkg)) {
      const dir = join(pkg, folder)
      if (!statSync(dir).isDirectory() || ['__tests__', 'lib', 'styles', 'assets'].includes(folder)) continue
      const entry = join(dir, `${folder}.tsx`)
      let text: string
      try { text = readFileSync(entry, 'utf8') } catch { continue }
      for (const m of text.matchAll(/^export (?:function|const) ([A-Z]\w+)/gm)) {
        if (!internal.has(m[1])) exported.add(m[1])
      }
    }

    const root = join(import.meta.dirname, '..')
    const walk = (base: string): string[] =>
      readdirSync(base, { withFileTypes: true }).flatMap(e =>
        e.isDirectory()
          ? (e.name === '__tests__' ? [] : walk(join(base, e.name)))
          : /\.tsx?$/.test(e.name) ? [join(base, e.name)] : [],
      )
    const sources = walk(root)
    const text = sources.map((f: string) => readFileSync(f, 'utf8')).join('\n')

    const hidden = [...exported].filter(n => !new RegExp(`<${n}[\\s/>]`).test(text))
    expect(hidden).toEqual([])
  })
})
