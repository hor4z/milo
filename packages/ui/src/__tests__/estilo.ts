import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

const raiz = join(import.meta.dirname, '..')

const stubs = import.meta.glob<Record<string, string>>('../**/*.module.css', { eager: true, import: 'default' })

const rutas = (function leer(base: string): string[] {
  return readdirSync(base, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? leer(join(base, e.name))
    : e.name.endsWith('.module.css') ? [join(base, e.name)] : [])
})(raiz)

const cuerpos = new Map<string, string>()
for (const ruta of rutas) {
  const stub = stubs[`../${relative(raiz, ruta).split('\\').join('/')}`]
  if (!stub) continue
  const css = readFileSync(ruta, 'utf8')
  for (const m of css.matchAll(/^\s*\.([A-Za-z][\w]*)\s*\{([\s\S]*?)^\s{2,4}\}/gm)) {
    cuerpos.set(stub[m[1]], m[2])
  }
}

export function estilo(el: Element): string {
  return String(el.className)
    .split(/\s+/)
    .map(c => cuerpos.get(c))
    .filter(Boolean)
    .join('\n')
}
