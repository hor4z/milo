import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const raiz = join(import.meta.dirname, '..')

const modulos = (function leer(base: string): string[] {
  return readdirSync(base, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? leer(join(base, e.name))
    : e.name.endsWith('.module.css') ? [readFileSync(join(base, e.name), 'utf8')] : [])
})(raiz)

/* Con módulos, el nombre de la clase que llega al DOM está hasheado, así que un
   test no puede asertar sobre él sin volverse ilegible. Lo que sí se puede, y es
   lo que el test quería decir desde el principio, es asertar sobre lo que esa
   clase declara. El nombre original viaja adentro del hash (`_radio_ab12`), así
   que se lo saca de ahí y se lo busca en los módulos del paquete: una pieza
   puede traer clases de `lib`, como la escalera de tamaños o el par de tono. */
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
