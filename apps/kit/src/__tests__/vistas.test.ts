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
