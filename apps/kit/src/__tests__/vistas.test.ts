import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const stories = join(import.meta.dirname, '../stories')
const archivos = readdirSync(stories).filter((f: string) => f.endsWith('.tsx'))

describe('las vistas del kit', () => {
  it('cada historia abre con una portada', () => {
    const sinPortada: string[] = []
    for (const f of archivos) {
      const texto = readFileSync(join(stories, f), 'utf8')
      const historias = [...texto.matchAll(/export function (\w+Story)\(/g)].length
      const portadas = [...texto.matchAll(/<Page\b/g)].length
      if (historias !== portadas) sinPortada.push(`${f}: ${historias} historias, ${portadas} portadas`)
    }
    expect(sinPortada).toEqual([])
  })

  it('cada portada dice cómo se importa la pieza', () => {
    const sinImport: string[] = []
    for (const f of archivos) {
      const texto = readFileSync(join(stories, f), 'utf8')
      const portadas = [...texto.matchAll(/<Page\b/g)].length
      const imports = [...texto.matchAll(/imports="/g)].length
      if (portadas !== imports) sinImport.push(`${f}: ${portadas} portadas, ${imports} imports`)
    }
    expect(sinImport).toEqual([])
  })
})

describe('el riel', () => {
  it('cada pieza tiene sinónimos para buscarla', () => {
    const app = readFileSync(join(import.meta.dirname, '../App.tsx'), 'utf8')
    const piezas = [...app.matchAll(/\{ id: '([\w-]+)', label: '[^']*',( alias: '[^']*',)?/g)]
    const sinAlias = piezas.filter(m => !m[2]).map(m => m[1])
    expect(sinAlias).toEqual([])
  })
})

describe('accesibilidad documentada', () => {
  const sinTeclado = new Set(['book.tsx', 'folder.tsx', 'icon.tsx', 'chart.tsx'])

  it('cada historia dice qué resuelve en accesibilidad', () => {
    const faltan: string[] = []
    for (const f of archivos) {
      const texto = readFileSync(join(stories, f), 'utf8')
      const historias = [...texto.matchAll(/<Page\b/g)].length
      const bloques = [...texto.matchAll(/<A11y\b/g)].length
      if (bloques < historias) faltan.push(`${f}: ${historias} historias, ${bloques} bloques`)
    }
    expect(faltan).toEqual([])
  })

  it('las listas de accesibilidad no están vacías', () => {
    const vacias: string[] = []
    for (const f of archivos) {
      const texto = readFileSync(join(stories, f), 'utf8')
      for (const m of texto.matchAll(/<A11y items=\{\[([\s\S]*?)\]\}/g)) {
        if (m[1].trim().length < 10) vacias.push(f)
      }
    }
    expect(vacias).toEqual([])
  })

  it('el conjunto no se olvida de ninguna historia con teclado', () => {
    const sospechosas = archivos.filter(f => !sinTeclado.has(f))
    expect(sospechosas.length).toBeGreaterThan(20)
  })
})

describe('los números de la portada', () => {
  it('la landing no anuncia menos tests de los que hay', () => {
    const intro = readFileSync(join(import.meta.dirname, '../intro.tsx'), 'utf8')
    const anunciados = Number(intro.match(/\['(\d+)', 'tests'\]/)?.[1])

    const raiz = join(import.meta.dirname, '../../../..')
    const carpetas = [join(raiz, 'packages/ui/src/__tests__'), join(import.meta.dirname)]
    let escritos = 0
    for (const carpeta of carpetas) {
      for (const f of readdirSync(carpeta)) {
        escritos += [...readFileSync(join(carpeta, f), 'utf8').matchAll(/^\s*it\(/gm)].length
      }
    }

    expect(
      anunciados,
      `la landing dice ${anunciados} y hay al menos ${escritos} tests escritos`,
    ).toBeGreaterThanOrEqual(escritos)
  })

  it('la cantidad de iconos que anuncia es la del manifiesto', () => {
    const intro = readFileSync(join(import.meta.dirname, '../intro.tsx'), 'utf8')
    const anunciados = Number(intro.match(/\['(\d+)', 'iconos'\]/)?.[1])
    const gen = readFileSync(
      join(import.meta.dirname, '../../../../packages/ui/src/icons.gen.ts'),
      'utf8',
    )
    const reales = [...gen.matchAll(/^\s+\w+: 0x[0-9a-f]+,/gm)].length
    expect(anunciados).toBe(reales)
  })
})

describe('useTokens', () => {
  it('no depende de la identidad del arreglo', () => {
    const kit = readFileSync(join(import.meta.dirname, '../kit.tsx'), 'utf8')
    const hook = kit.slice(kit.indexOf('export function useTokens'), kit.indexOf('type PageProps'))
    expect(hook, 'la dependencia tiene que ser el contenido, no el arreglo').not.toMatch(/\}, \[names\]\)/)
    expect(hook).toMatch(/\[clave\]/)
  })
})

describe('cobertura del kit', () => {
  const internos = new Set(['Portal', 'PageHeader', 'SectionLabel'])

  it('cada componente exportado se muestra en alguna vista', () => {
    const index = readFileSync(
      join(import.meta.dirname, '../../../../packages/ui/src/index.ts'),
      'utf8',
    )
    const exportados = new Set<string>()
    for (const m of index.matchAll(/export \{([^}]*)\} from/g)) {
      for (const n of m[1].split(',')) {
        const nombre = n.trim()
        if (nombre && /^[A-Z]/.test(nombre) && !internos.has(nombre)) exportados.add(nombre)
      }
    }

    const fuentes = [
      ...readdirSync(stories).map((f: string) => join(stories, f)),
      join(import.meta.dirname, '../dashboard.tsx'),
      join(import.meta.dirname, '../intro.tsx'),
      join(import.meta.dirname, '../App.tsx'),
      join(import.meta.dirname, '../main.tsx'),
      join(import.meta.dirname, '../guide/foundations.tsx'),
      join(import.meta.dirname, '../guide/writing.tsx'),
    ]
    const texto = fuentes.map((f: string) => readFileSync(f, 'utf8')).join('\n')

    const sinMostrar = [...exportados].filter(n => !new RegExp(`<${n}[\\s/>]`).test(texto))
    expect(sinMostrar).toEqual([])
  })
})
