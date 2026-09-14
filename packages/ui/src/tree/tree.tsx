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

type Fila = { node: TreeNode; nivel: number; padre?: string; abierto: boolean; hoja: boolean }

/** Aplana lo que está a la vista: lo cerrado no existe para el teclado. */
function aplanar(nodes: TreeNode[], abiertos: Set<string>, nivel = 1, padre?: string): Fila[] {
  return nodes.flatMap(n => {
    const hoja = !n.children?.length
    const abierto = !hoja && abiertos.has(n.id)
    const fila: Fila = { node: n, nivel, padre, abierto, hoja }
    return abierto ? [fila, ...aplanar(n.children!, abiertos, nivel + 1, n.id)] : [fila]
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
  const [propios, setPropios] = useState<string[]>([])
  const abiertos = useMemo(() => new Set(expanded ?? propios), [expanded, propios])
  const filas = useMemo(() => aplanar(nodes, abiertos), [nodes, abiertos])

  const [cursor, setCursor] = useState<string | null>(null)
  const actual = cursor && filas.some(f => f.node.id === cursor) ? cursor : (selected ?? filas[0]?.node.id ?? null)
  const refs = useRef<Record<string, HTMLDivElement | null>>({})

  const mover = (id: string) => { setCursor(id); refs.current[id]?.focus() }

  const abrirCerrar = (id: string, abrir: boolean) => {
    const siguiente = new Set(abiertos)
    if (abrir) siguiente.add(id)
    else siguiente.delete(id)
    const lista = [...siguiente]
    if (expanded === undefined) setPropios(lista)
    onExpandedChange?.(lista)
  }

  const teclas = (e: React.KeyboardEvent, i: number, f: Fila) => {
    const ir = (j: number) => { const d = filas[j]; if (d) mover(d.node.id) }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); ir(i + 1); break
      case 'ArrowUp': e.preventDefault(); ir(i - 1); break
      case 'Home': e.preventDefault(); ir(0); break
      case 'End': e.preventDefault(); ir(filas.length - 1); break
      case 'ArrowRight':
        e.preventDefault()
        if (!f.hoja && !f.abierto) abrirCerrar(f.node.id, true)
        else if (f.abierto) ir(i + 1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (!f.hoja && f.abierto) abrirCerrar(f.node.id, false)
        else if (f.padre) mover(f.padre)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!f.hoja) abrirCerrar(f.node.id, !f.abierto)
        onSelect?.(f.node.id)
        break
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const desde = filas.slice(i + 1).concat(filas.slice(0, i + 1))
          const d = desde.find(x => x.node.label.toLowerCase().startsWith(e.key.toLowerCase()))
          if (d) { e.preventDefault(); mover(d.node.id) }
        }
    }
  }

  return (
    <div role="tree" aria-label={label} className={cx(cls.root, className)}>
      {filas.map((f, i) => {
        const esActual = f.node.id === actual
        const elegido = f.node.id === selected
        return (
          <div
            key={f.node.id}
            ref={el => { refs.current[f.node.id] = el }}
            role="treeitem"
            aria-level={f.nivel}
            aria-expanded={f.hoja ? undefined : f.abierto}
            aria-selected={elegido}
            tabIndex={esActual ? 0 : -1}
            onFocus={() => setCursor(f.node.id)}
            onKeyDown={e => teclas(e, i, f)}
            onClick={() => { if (!f.hoja) abrirCerrar(f.node.id, !f.abierto); onSelect?.(f.node.id) }}
            style={{ paddingLeft: 8 + (f.nivel - 1) * 16 }}
            className={cx(
              cls.node,
              elegido ? cls.selected : cls.plain,
            )}
          >
            {f.hoja
              ? <span aria-hidden="true" className={cls.spacer} />
              : <Icon name={f.abierto ? 'keyboard_arrow_down' : 'chevron_right'} size={16} className={`${cls.chevron} icon-muted`} />}
            {f.node.icon && <Icon name={f.node.icon} size={16} className={`${cls.nodeIcon} icon-muted`} />}
            <span className={cls.label}>{f.node.label}</span>
            {f.node.meta && <span className={cls.meta}>{f.node.meta}</span>}
          </div>
        )
      })}
    </div>
  )
}
