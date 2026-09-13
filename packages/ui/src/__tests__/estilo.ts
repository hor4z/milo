import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const raiz = join(import.meta.dirname, '..')

const modulos = (function leer(base: string): string[] {
  return readdirSync(base, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? leer(join(base, e.name))
    : e.name.endsWith('.module.css') ? [readFileSync(join(base, e.name), 'utf8')] : [])
})(raiz)

export function estilo(el: Element): string {
  const nombres = String(el.className)
    .split(/\s+/)
    .map(c => c.match(/^_([A-Za-z][\w]*)_/)?.[1])
    .filter(Boolean) as string[]

  const out: string[] = []
  for (const n of nombres) {
    const re = new RegExp(`^\\s*\\.${n}\\s*\\{([\\s\\S]*?)^\\s{2,4}\\}`, 'm')
    for (const css of modulos) {
      const m = css.match(re)
      if (m) out.push(m[1])
    }
  }
  return out.join('\n')
}
