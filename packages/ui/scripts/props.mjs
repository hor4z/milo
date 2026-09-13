/**
 * Saca la tabla de props de cada pieza del código y no de una lista escrita a
 * mano: el tipo y el default salen del componente, y la descripción del
 * docblock de la prop, que es el mismo que ve el editor al autocompletar.
 *
 *   node scripts/props.mjs          escribe src/props.gen.ts
 *   node scripts/props.mjs --check  falla si lo escrito no coincide
 */
import ts from 'typescript'
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const src = join(dirname(fileURLToPath(import.meta.url)), '../src')
const salida = join(src, 'props.gen.ts')

/** Lo que el kit necesita de una prop para dibujar su fila. */
const extraer = (archivo) => {
  const texto = readFileSync(archivo, 'utf8')
  const sf = ts.createSourceFile(archivo, texto, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const alias = new Map()
  const piezas = {}

  const limpiar = (s) => s.replace(/\s+/g, ' ').trim()

  const docDe = (node) => {
    const docs = ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc)
    const texto = docs.map(d => typeof d.comment === 'string' ? d.comment : (d.comment ?? []).map(c => c.text).join('')).join(' ')
    return limpiar(texto)
  }

  const miembros = (tipo) => {
    if (!tipo) return []
    if (ts.isTypeLiteralNode(tipo)) return tipo.members
    if (ts.isIntersectionTypeNode(tipo)) return tipo.types.flatMap(miembros)
    if (ts.isTypeReferenceNode(tipo)) {
      const t = alias.get(tipo.typeName.getText(sf))
      return t ? miembros(t) : []
    }
    return []
  }

  /** Qué etiqueta nativa hereda la pieza: `ComponentPropsWithoutRef<'div'>` y sus primos. */
  const nativa = (tipo) => {
    if (!tipo) return undefined
    if (ts.isIntersectionTypeNode(tipo)) return tipo.types.map(nativa).find(Boolean)
    if (ts.isTypeReferenceNode(tipo)) {
      const nombre = tipo.typeName.getText(sf)
      const arg = tipo.typeArguments?.[0]?.getText(sf)?.replace(/['"]/g, '')
      if (/^(ComponentPropsWithoutRef|ComponentProps|HTMLAttributes)$/.test(nombre) && arg) return arg
      const m = nombre.match(/^(\w+?)HTMLAttributes$/)
      if (m) {
        const tags = { Button: 'button', Input: 'input', Textarea: 'textarea', Th: 'th', Td: 'td', Anchor: 'a' }
        return tags[m[1]] ?? m[1].toLowerCase()
      }
      const t = alias.get(nombre)
      return t ? nativa(t) : undefined
    }
    return undefined
  }

  ts.forEachChild(sf, (n) => {
    if (ts.isTypeAliasDeclaration(n)) alias.set(n.name.text, n.type)
  })

  ts.forEachChild(sf, (n) => {
    if (!ts.isFunctionDeclaration(n) || !n.name) return
    if (!n.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) return
    const nombre = n.name.text
    if (!/^[A-Z]/.test(nombre)) return

    const param = n.parameters[0]
    if (!param) return

    const defaults = new Map()
    if (param.name && ts.isObjectBindingPattern(param.name)) {
      for (const el of param.name.elements) {
        if (el.initializer) defaults.set(el.name.getText(sf), limpiar(el.initializer.getText(sf)))
      }
    }

    const filas = []
    for (const m of miembros(param.type)) {
      if (!ts.isPropertySignature(m) || !m.name) continue
      const prop = m.name.getText(sf)
      filas.push({
        name: prop,
        type: limpiar(m.type?.getText(sf) ?? 'unknown'),
        required: !m.questionToken,
        def: defaults.get(prop),
        doc: docDe(m) || undefined,
      })
    }
    const html = nativa(param.type)
    const doc = docDe(n)
    if (filas.length || html) piezas[nombre] = { props: filas, ...(html ? { html } : {}), ...(doc ? { doc } : {}) }
  })

  // Los tipos que una pieza recibe como argumento (las opciones de un toast, el
  // item de un dropdown) se documentan igual: son la API pública de esa pieza.
  ts.forEachChild(sf, (n) => {
    if (!ts.isTypeAliasDeclaration(n)) return
    if (!n.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) return
    if (!/(Options|Item|Datum|Option)$/.test(n.name.text)) return
    const filas = []
    for (const m of miembros(n.type)) {
      if (!ts.isPropertySignature(m) || !m.name) continue
      filas.push({
        name: m.name.getText(sf),
        type: limpiar(m.type?.getText(sf) ?? 'unknown'),
        required: !m.questionToken,
        doc: docDe(m) || undefined,
      })
    }
    const doc = docDe(n)
    if (filas.length) piezas[n.name.text] = { props: filas, ...(doc ? { doc } : {}) }
  })

  return piezas
}

const carpetas = readdirSync(src)
  .filter(f => statSync(join(src, f)).isDirectory())
  .filter(f => f !== '__tests__' && f !== 'lib' && f !== 'assets')
  .sort()

const todo = {}
for (const c of carpetas) {
  const archivo = join(src, c, `${c}.tsx`)
  try { statSync(archivo) } catch { continue }
  Object.assign(todo, extraer(archivo))
}

const cuerpo = `/* Generado por scripts/props.mjs: no se edita a mano.
   La descripción de cada prop vive en su docblock, al lado del tipo. */

export type PropDoc = {
  name: string
  type: string
  required: boolean
  def?: string
  doc?: string
}

/** Lo propio de la pieza, y la etiqueta nativa cuyos atributos pasa de largo. */
export type ComponentDoc = {
  props: PropDoc[]
  html?: string
  doc?: string
}

export const propsByComponent: Record<string, ComponentDoc> = ${JSON.stringify(todo, null, 2)}
`

if (process.argv.includes('--check')) {
  const viejo = readFileSync(salida, 'utf8')
  if (viejo !== cuerpo) {
    console.error('✗ props.gen.ts quedó viejo: corré `npm run props -w @milo/ui`')
    process.exit(1)
  }
  console.log(`✓ props.gen.ts al día (${Object.keys(todo).length} piezas)`)
} else {
  writeFileSync(salida, cuerpo)
  console.log(`✓ ${Object.keys(todo).length} piezas, ${Object.values(todo).flatMap(p => p.props).length} props`)
}
