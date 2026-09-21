import { describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { propsByComponent } from '../props.gen'

const root = join(import.meta.dirname, '../..')

describe('la tabla de props sale del código', () => {
  it('props.gen.ts está al día', () => {
    expect(() => execFileSync('node', ['scripts/props.mjs', '--check'], { cwd: root, stdio: 'pipe' })).not.toThrow()
  })

  it('el paths de tsconfig.json está al día', () => {
    expect(() => execFileSync('node', ['scripts/paths.mjs', '--check'], { cwd: root, stdio: 'pipe' })).not.toThrow()
  })

  it('cada pieza que el kit documenta existe en el paquete', () => {
    const src = join(root, 'src')
    const declarado = new Set<string>()
    for (const folder of readdirSync(src)) {
      const dir = join(src, folder)
      if (!statSync(dir).isDirectory() || ['__tests__', 'styles', 'assets'].includes(folder)) continue
      for (const file of readdirSync(dir)) {
        if (!/\.tsx?$/.test(file) || file.endsWith('.test.ts') || file.endsWith('.test.tsx')) continue
        const text = readFileSync(join(dir, file), 'utf8')
        for (const m of text.matchAll(/^export (?:function|const|type) (\w+)/gm)) declarado.add(m[1])
      }
    }
    const outside = Object.keys(propsByComponent).filter(p => !declarado.has(p.split('.')[0]))
    expect(outside).toEqual([])
  })

  it('lo que se documenta tiene tipo y obligatoriedad, no solo prosa', () => {
    const untyped = Object.entries(propsByComponent)
      .flatMap(([comp, doc]) => doc.props.filter(p => !p.type).map(p => `${comp}.${p.name}`))
    expect(untyped).toEqual([])
  })

  it('una pieza sin props propias dice de qué etiqueta hereda', () => {
    const undocumented = Object.entries(propsByComponent)
      .filter(([, doc]) => doc.props.length === 0 && !doc.html)
      .map(([comp]) => comp)
    expect(undocumented).toEqual([])
  })
})
