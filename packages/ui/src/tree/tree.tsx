import cls from './tree.module.css'
import { useMemo, useRef, useState } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { cx } from '../lib/cx'

export type TreeNode = {
  /** Único en todo el árbol: es lo que vuelve al elegir y lo que abre y cierra. */
  id: string
  /** Lo que se lee. */
  label: string
  /** A la izquierda del nombre. */
  icon?: IconName
  /** A la derecha, apagado: cuántos hay adentro, cuándo se tocó. */
  meta?: string
  /** Sin esto la rama es una hoja y no abre. */
  children?: TreeNode[]
}

type Row = { node: TreeNode; depth: number; parent?: string; isOpen: boolean; isLeaf: boolean }

/** Aplana lo que está a la vista: lo cerrado no existe para el teclado. */
function flatten(nodes: TreeNode[], openIds: Set<string>, depth = 1, parent?: string): Row[] {
  return nodes.flatMap(n => {
    const isLeaf = !n.children?.length
    const isOpen = !isLeaf && openIds.has(n.id)
    const row: Row = { node: n, depth, parent, isOpen, isLeaf }
    return isOpen ? [row, ...flatten(n.children!, openIds, depth + 1, n.id)] : [row]
  })
}

/** Una jerarquía que se abre y se cierra: los espacios de alguien, el índice de un documento. */
export function Tree({ nodes, label, expanded, onExpandedChange, selected, onSelect, className }: {
  /** Las ramas de arriba. Cada una puede traer `children`. */
  nodes: TreeNode[]
  /** De qué es el árbol. Sin esto un lector dice "árbol" y nada más. */
  label: string
  /** Los ids abiertos. Sin esto el árbol los maneja solo. */
  expanded?: string[]
  /** Recibe la lista nueva de ids abiertos. */
  onExpandedChange?: (ids: string[]) => void
  /** El id elegido. */
  selected?: string
  /** Recibe el id al elegir con Enter, espacio o el mouse. */
  onSelect?: (id: string) => void
  className?: string
}) {
  const [ownOpen, setOwnOpen] = useState<string[]>([])
  const openIds = useMemo(() => new Set(expanded ?? ownOpen), [expanded, ownOpen])
  const rows = useMemo(() => flatten(nodes, openIds), [nodes, openIds])

  const [cursor, setCursor] = useState<string | null>(null)
  const currentId = cursor && rows.some(f => f.node.id === cursor) ? cursor : (selected ?? rows[0]?.node.id ?? null)
  const refs = useRef<Record<string, HTMLDivElement | null>>({})

  const move = (id: string) => { setCursor(id); refs.current[id]?.focus() }

  const toggle = (id: string, abrir: boolean) => {
    const nextOpen = new Set(openIds)
    if (abrir) nextOpen.add(id)
    else nextOpen.delete(id)
    const order = [...nextOpen]
    if (expanded === undefined) setOwnOpen(order)
    onExpandedChange?.(order)
  }

  const onKey = (e: React.KeyboardEvent, i: number, f: Row) => {
    const go = (j: number) => { const d = rows[j]; if (d) move(d.node.id) }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); go(i + 1); break
      case 'ArrowUp': e.preventDefault(); go(i - 1); break
      case 'Home': e.preventDefault(); go(0); break
      case 'End': e.preventDefault(); go(rows.length - 1); break
      case 'ArrowRight':
        e.preventDefault()
        if (!f.isLeaf && !f.isOpen) toggle(f.node.id, true)
        else if (f.isOpen) go(i + 1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (!f.isLeaf && f.isOpen) toggle(f.node.id, false)
        else if (f.parent) move(f.parent)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!f.isLeaf) toggle(f.node.id, !f.isOpen)
        onSelect?.(f.node.id)
        break
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const wrapped = rows.slice(i + 1).concat(rows.slice(0, i + 1))
          const d = wrapped.find(x => x.node.label.toLowerCase().startsWith(e.key.toLowerCase()))
          if (d) { e.preventDefault(); move(d.node.id) }
        }
    }
  }

  return (
    <div role="tree" aria-label={label} className={cx(cls.root, className)}>
      {rows.map((f, i) => {
        const isCurrent = f.node.id === currentId
        const isSelected = f.node.id === selected
        return (
          <div
            key={f.node.id}
            ref={el => { refs.current[f.node.id] = el }}
            role="treeitem"
            aria-level={f.depth}
            aria-expanded={f.isLeaf ? undefined : f.isOpen}
            aria-selected={isSelected}
            tabIndex={isCurrent ? 0 : -1}
            onFocus={() => setCursor(f.node.id)}
            onKeyDown={e => onKey(e, i, f)}
            onClick={() => { if (!f.isLeaf) toggle(f.node.id, !f.isOpen); onSelect?.(f.node.id) }}
            style={{ paddingLeft: 8 + (f.depth - 1) * 16 }}
            className={cx(
              cls.node,
              isSelected ? cls.selected : cls.plain,
            )}
          >
            {f.isLeaf
              ? <span aria-hidden="true" className={cls.spacer} />
              : <Icon name={f.isOpen ? 'keyboard_arrow_down' : 'chevron_right'} size={16} className={`${cls.chevron} icon-muted`} />}
            {f.node.icon && <Icon name={f.node.icon} size={16} className={`${cls.nodeIcon} icon-muted`} />}
            <span className={cls.label}>{f.node.label}</span>
            {f.node.meta && <span className={cls.meta}>{f.node.meta}</span>}
          </div>
        )
      })}
    </div>
  )
}
