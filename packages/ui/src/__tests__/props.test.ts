import { describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { propsByComponent } from '../props.gen'

const root = join(import.meta.dirname, '../..')

describe('la tabla de props sale del código', () => {
  it('props.gen.ts está al día', () => {
    expect(() => execFileSync('node', ['scripts/props.mjs', '--check'], { cwd: root, stdio: 'pipe' })).not.toThrow()
  })

  it('cada pieza que el kit documenta existe en el paquete', () => {
    const index = readFileSync(join(root, 'src/index.ts'), 'utf8')
    const fuera = Object.keys(propsByComponent).filter(p => !new RegExp(`\\b${p}\\b`).test(index))
    expect(fuera).toEqual([])
  })

  it('lo que se documenta tiene tipo y obligatoriedad, no solo prosa', () => {
    const sinTipo = Object.entries(propsByComponent)
      .flatMap(([comp, doc]) => doc.props.filter(p => !p.type).map(p => `${comp}.${p.name}`))
    expect(sinTipo).toEqual([])
  })

  it('una pieza sin props propias dice de qué etiqueta hereda', () => {
    const mudas = Object.entries(propsByComponent)
      .filter(([, doc]) => doc.props.length === 0 && !doc.html)
      .map(([comp]) => comp)
    expect(mudas).toEqual([])
  })
})
