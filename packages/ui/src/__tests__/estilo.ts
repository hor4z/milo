import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

const raiz = join(import.meta.dirname, '..')

const stubs = import.meta.glob<Record<string, string>>('../**/*.module.css', { eager: true, import: 'default' })

const files = (function walk(base: string): string[] {
  return readdirSync(base, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(join(base, e.name))
    : e.name.endsWith('.module.css') ? [join(base, e.name)] : [])
})(raiz)

const bodies = new Map<string, string>()
for (const file of files) {
  const stub = stubs[`../${relative(raiz, file).split('\\').join('/')}`]
  if (!stub) continue
  const css = readFileSync(file, 'utf8')
  for (const m of css.matchAll(/^\s*\.([A-Za-z][\w]*)\s*\{/gm)) {
    let i = m.index + m[0].length
    let hondo = 1
    while (i < css.length && hondo > 0) {
      if (css[i] === '{') hondo++
      else if (css[i] === '}') hondo--
      i++
    }
    bodies.set(stub[m[1]], css.slice(m.index + m[0].length, i - 1))
  }
}

export function estilo(el: Element): string {
  return String(el.className)
    .split(/\s+/)
    .map(c => bodies.get(c))
    .filter(Boolean)
    .join('\n')
}
