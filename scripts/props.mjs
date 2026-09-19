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
const out = join(src, 'props.gen.ts')

/** Lo que el kit necesita de una prop para dibujar su fila. */
const extract = (file) => {
  const text = readFileSync(file, 'utf8')
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const alias = new Map()
  const pieces = {}

  const clean = (s) => s.replace(/\s+/g, ' ').trim()

  const docDe = (node) => {
    const docs = ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc)
    const text = docs.map(d => typeof d.comment === 'string' ? d.comment : (d.comment ?? []).map(c => c.text).join('')).join(' ')
    return clean(text)
  }

  const members = (type) => {
    if (!type) return []
    if (ts.isTypeLiteralNode(type)) return type.members
    if (ts.isIntersectionTypeNode(type)) return type.types.flatMap(members)
    if (ts.isTypeReferenceNode(type)) {
      const t = alias.get(type.typeName.getText(sf))
      return t ? members(t) : []
    }
    return []
  }

  /** Qué etiqueta nativa hereda la pieza: `ComponentPropsWithoutRef<'div'>` y sus primos. */
  const native = (type) => {
    if (!type) return undefined
    if (ts.isIntersectionTypeNode(type)) return type.types.map(native).find(Boolean)
    if (ts.isTypeReferenceNode(type)) {
      const name = type.typeName.getText(sf)
      const arg = type.typeArguments?.[0]?.getText(sf)?.replace(/['"]/g, '')
      if (/^(ComponentPropsWithoutRef|ComponentProps|HTMLAttributes)$/.test(name) && arg) return arg
      const m = name.match(/^(\w+?)HTMLAttributes$/)
      if (m) {
        const tags = { Button: 'button', Input: 'input', Textarea: 'textarea', Th: 'th', Td: 'td', Anchor: 'a' }
        return tags[m[1]] ?? m[1].toLowerCase()
      }
      const t = alias.get(name)
      return t ? native(t) : undefined
    }
    return undefined
  }

  ts.forEachChild(sf, (n) => {
    if (ts.isTypeAliasDeclaration(n)) alias.set(n.name.text, n.type)
  })

  ts.forEachChild(sf, (n) => {
    if (!ts.isFunctionDeclaration(n) || !n.name) return
    if (!n.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) return
    const name = n.name.text
    if (!/^[A-Z]/.test(name)) return

    const param = n.parameters[0]
    if (!param) return

    const defaults = new Map()
    if (param.name && ts.isObjectBindingPattern(param.name)) {
      for (const el of param.name.elements) {
        if (el.initializer) defaults.set(el.name.getText(sf), clean(el.initializer.getText(sf)))
      }
    }

    const rows = []
    for (const m of members(param.type)) {
      if (!ts.isPropertySignature(m) || !m.name) continue
      const prop = m.name.getText(sf)
      rows.push({
        name: prop,
        type: clean(m.type?.getText(sf) ?? 'unknown'),
        required: !m.questionToken,
        def: defaults.get(prop),
        doc: docDe(m) || undefined,
      })
    }
    const html = native(param.type)
    const doc = docDe(n)
    if (rows.length || html) pieces[name] = { props: rows, ...(html ? { html } : {}), ...(doc ? { doc } : {}) }
  })

  // Los tipos que una pieza recibe como argumento (las opciones de un toast, el
  // item de un dropdown) se documentan igual: son la API pública de esa pieza.
  ts.forEachChild(sf, (n) => {
    if (!ts.isTypeAliasDeclaration(n)) return
    if (!n.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) return
    if (!/(Options|Item|Datum|Option)$/.test(n.name.text)) return
    const rows = []
    for (const m of members(n.type)) {
      if (!ts.isPropertySignature(m) || !m.name) continue
      rows.push({
        name: m.name.getText(sf),
        type: clean(m.type?.getText(sf) ?? 'unknown'),
        required: !m.questionToken,
        doc: docDe(m) || undefined,
      })
    }
    const doc = docDe(n)
    if (rows.length) pieces[n.name.text] = { props: rows, ...(doc ? { doc } : {}) }
  })

  return pieces
}

const folders = readdirSync(src)
  .filter(f => statSync(join(src, f)).isDirectory())
  .filter(f => f !== '__tests__' && f !== 'lib' && f !== 'assets')
  .sort()

const todo = {}
for (const c of folders) {
  const file = join(src, c, `${c}.tsx`)
  try { statSync(file) } catch { continue }
  Object.assign(todo, extract(file))
}

const body = `/* Generado por scripts/props.mjs: no se edita a mano.
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
  const stale = readFileSync(out, 'utf8')
  if (stale !== body) {
    console.error('✗ props.gen.ts quedó viejo: corré `npm run props -w @milo/ui`')
    process.exit(1)
  }
  console.log(`✓ props.gen.ts al día (${Object.keys(todo).length} piezas)`)
} else {
  writeFileSync(out, body)
  console.log(`✓ ${Object.keys(todo).length} piezas, ${Object.values(todo).flatMap(p => p.props).length} props`)
}
