import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = join(import.meta.dirname, '..')

const stubs = import.meta.glob<Record<string, string>>('../**/*.module.css', { eager: true, import: 'default' })

const files = (function walk(base: string): string[] {
  return readdirSync(base, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(join(base, e.name))
    : e.name.endsWith('.module.css') ? [join(base, e.name)] : [])
})(root)

const bodies = new Map<string, string>()
for (const file of files) {
  const stub = stubs[`../${relative(root, file).split('\\').join('/')}`]
  if (!stub) continue
  const css = readFileSync(file, 'utf8')
  for (const m of css.matchAll(/^\s*\.([A-Za-z][\w]*)\s*\{/gm)) {
    let i = m.index + m[0].length
    let deep = 1
    while (i < css.length && deep > 0) {
      if (css[i] === '{') deep++
      else if (css[i] === '}') deep--
      i++
    }
    bodies.set(stub[m[1]], css.slice(m.index + m[0].length, i - 1))
  }
}

export function style(el: Element): string {
  return String(el.className)
    .split(/\s+/)
    .map(c => bodies.get(c))
    .filter(Boolean)
    .join('\n')
}
