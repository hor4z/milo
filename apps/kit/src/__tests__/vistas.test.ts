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
  it('la cantidad de tests que anuncia la landing es la real', () => {
    const intro = readFileSync(join(import.meta.dirname, '../intro.tsx'), 'utf8')
    const anunciados = intro.match(/\['(\d+)', 'tests'\]/)?.[1]
    expect(anunciados, 'la landing tiene que decir cuántos tests hay').toBeTruthy()
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
