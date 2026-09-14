import cls from './command-menu.module.css'
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { Kbd } from '../kbd/kbd'
import { Search } from '../search/search'
import { cx } from '../lib/cx'

export type CommandItem = {
  /** Único en toda la lista: es lo que se anuncia y lo que vuelve al elegir. */
  id: string
  /** Lo que se lee y lo que se busca. */
  label: string
  /** Una línea abajo, para cuando el nombre no alcanza. */
  hint?: string
  /** A la izquierda. */
  icon?: IconName
  /** El atajo, a la derecha. Es un recordatorio: la tecla la escucha quien la pone. */
  shortcut?: string
  /** Palabras que también lo encuentran y que no están en el nombre: "foto" para Imagen. */
  keywords?: string[]
  disabled?: boolean
}

export type CommandGroup = {
  /** El encabezado del grupo. */
  label: string
  items: CommandItem[]
}

/** Sin acentos y en minúscula: quien escribe rápido no pone tildes. */
const flat = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function matches(groups: CommandGroup[], q: string) {
  const t = flat(q.trim())
  if (!t) return groups
  return groups
    .map(g => ({
      ...g,
      items: g.items.filter(i => flat([i.label, i.hint, ...(i.keywords ?? [])].filter(Boolean).join(' ')).includes(t)),
    }))
    .filter(g => g.items.length)
}

type CommandMenuProps = {
  /** Agrupados por lo que hacen. Un grupo que queda sin resultados no se muestra. */
  groups: CommandGroup[]
  /** Recibe el elegido. */
  onSelect: (item: CommandItem) => void
  /** Qué se busca. */
  placeholder?: string
  /** Lo que se ve cuando no queda nada. */
  empty?: string
  /** Sin esto la lista arranca sin buscador, para cuando lo que se escribe ya está afuera. */
  search?: boolean
  /** El texto de búsqueda, si lo maneja quien lo usa, un editor que ya viene escribiendo detrás de la barra. */
  query?: string
  /** Cuánto mide la lista antes de scrollear. */
  maxHeight?: number
  /** El buscador se lleva el foco al aparecer. Va donde el menú abre por un gesto (una barra, un atajo); suelto en una página, roba el foco y el scroll. Adentro de un overlay alcanza con esto: el `data-autofocus` que esos paneles miran lo pone la pieza. */
  autoFocus?: boolean
  className?: string
}

/** La lista de comandos: se escribe, se filtra y se elige con las flechas. Es el menú de la barra en un editor, y la paleta de atajos de una app. */
export function CommandMenu({
  groups, onSelect, placeholder = 'Buscar un bloque…', empty = 'Nada con esas palabras',
  search = true, query, maxHeight = 320, autoFocus, className,
}: CommandMenuProps) {
  const [propio, setPropio] = useState('')
  const q = query ?? propio
  const visible = useMemo(() => matches(groups, q), [groups, q])
  const flatItems = useMemo(() => visible.flatMap(g => g.items).filter(i => !i.disabled), [visible])

  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  useEffect(() => { setActiveIndex(0) }, [q])

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const currentItem = flatItems[Math.min(activeIndex, flatItems.length - 1)]

  useEffect(() => {
    if (!currentItem) return
    listRef.current?.querySelector(`[data-id="${CSS.escape(currentItem.id)}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [currentItem])

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0
    if (step) {
      e.preventDefault()
      if (flatItems.length) setActiveIndex(a => (a + step + flatItems.length) % flatItems.length)
      return
    }
    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      return setActiveIndex(e.key === 'Home' ? 0 : flatItems.length - 1)
    }
    if (e.key === 'Enter' && currentItem) {
      e.preventDefault()
      onSelect(currentItem)
    }
  }

  return (
    <div
      className={cx(`${cls.root} bg-popover`, className)}
      onKeyDown={onKey}
    >
      {search && (
        <div className={cls.searchRow}>
          <Search
            block
            size="sm"
            value={q}
            onValueChange={query === undefined ? setPropio : () => {}}
            placeholder={placeholder}
            role="combobox"
            aria-expanded
            aria-controls={listId}
            aria-activedescendant={currentItem ? `${listId}-${currentItem.id}` : undefined}
            ref={inputRef}
            data-autofocus={autoFocus || undefined}
          />
        </div>
      )}

      <div ref={listRef} id={listId} role="listbox" aria-label={placeholder} className={cls.list} style={{ maxHeight }}>
        {flatItems.length === 0
          ? <p className={cls.empty}>{empty}</p>
          : visible.map(g => (
            <div key={g.label} role="group" aria-label={g.label}>
              <div className={cls.groupLabel}>{g.label}</div>
              {g.items.map(item => {
                const isSelected = item.id === currentItem?.id
                return (
                  <div
                    key={item.id}
                    id={`${listId}-${item.id}`}
                    data-id={item.id}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={item.disabled || undefined}
                    onPointerMove={() => {
                      const i = flatItems.findIndex(p => p.id === item.id)
                      if (i >= 0) setActiveIndex(i)
                    }}
                    onClick={() => !item.disabled && onSelect(item)}
                    className={cx(
                      cls.item,
                      item.disabled ? cls.disabled : isSelected && cls.active,
                    )}
                  >
                    {item.icon && <Icon name={item.icon} size={18} className={`${cls.icon} icon-muted`} />}
                    <span className={cls.body}>
                      <span className={cls.label}>{item.label}</span>
                      {item.hint && <span className={cls.hint}>{item.hint}</span>}
                    </span>
                    {item.shortcut && <Kbd>{item.shortcut}</Kbd>}
                  </div>
                )
              })}
            </div>
          ))}
      </div>
    </div>
  )
}
