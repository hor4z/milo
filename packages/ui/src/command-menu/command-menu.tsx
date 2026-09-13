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
  /** Palabras que también lo encuentran y que no están en el nombre: «foto» para Imagen. */
  keywords?: string[]
  disabled?: boolean
}

export type CommandGroup = {
  /** El encabezado del grupo. */
  label: string
  items: CommandItem[]
}

/** Sin acentos y en minúscula: quien escribe rápido no pone tildes. */
const plano = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function filtrar(groups: CommandGroup[], q: string) {
  const t = plano(q.trim())
  if (!t) return groups
  return groups
    .map(g => ({
      ...g,
      items: g.items.filter(i => plano([i.label, i.hint, ...(i.keywords ?? [])].filter(Boolean).join(' ')).includes(t)),
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
  /** El texto de búsqueda, si lo maneja quien lo usa —un editor que ya viene escribiendo detrás de la barra. */
  query?: string
  /** Cuánto mide la lista antes de scrollear. */
  maxHeight?: number
  /** El buscador se lleva el foco al aparecer. Va donde el menú abre por un gesto —una barra, un atajo—; suelto en una página, roba el foco y el scroll. Adentro de un overlay alcanza con esto: el `data-autofocus` que esos paneles miran lo pone la pieza. */
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
  const visibles = useMemo(() => filtrar(groups, q), [groups, q])
  const planos = useMemo(() => visibles.flatMap(g => g.items).filter(i => !i.disabled), [visibles])

  const [activo, setActivo] = useState(0)
  const lista = useRef<HTMLDivElement>(null)
  const campo = useRef<HTMLInputElement>(null)
  const listaId = useId()

  // Al cambiar lo buscado, el elegido vuelve al principio: dejarlo donde estaba
  // deja marcado un item que ya no es el que se está mirando.
  useEffect(() => { setActivo(0) }, [q])

  // El foco se pide acá y no con el `autoFocus` de React. Adentro de un panel
  // que vive en un portal, el de React corre antes de que el host esté colgado
  // del documento, y enfocar un nodo suelto no hace nada.
  useEffect(() => {
    if (autoFocus) campo.current?.focus()
  }, [autoFocus])

  const actual = planos[Math.min(activo, planos.length - 1)]

  useEffect(() => {
    if (!actual) return
    lista.current?.querySelector(`[data-id="${CSS.escape(actual.id)}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [actual])

  const teclas = (e: KeyboardEvent) => {
    const paso = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0
    if (paso) {
      e.preventDefault()
      if (planos.length) setActivo(a => (a + paso + planos.length) % planos.length)
      return
    }
    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      return setActivo(e.key === 'Home' ? 0 : planos.length - 1)
    }
    if (e.key === 'Enter' && actual) {
      e.preventDefault()
      onSelect(actual)
    }
  }

  return (
    <div
      className={cx('flex flex-col overflow-hidden rounded-xl border border-line bg-popover shadow-popover', className)}
      onKeyDown={teclas}
    >
      {search && (
        <div className="border-b border-line p-2">
          <Search
            block
            size="sm"
            value={q}
            onValueChange={query === undefined ? setPropio : () => {}}
            placeholder={placeholder}
            role="combobox"
            aria-expanded
            aria-controls={listaId}
            aria-activedescendant={actual ? `${listaId}-${actual.id}` : undefined}
            ref={campo}
            // Los paneles que sí atrapan el foco —un `Modal`— miran esta marca
            // para dejárselo al campo en vez de quedárselo el contenedor.
            data-autofocus={autoFocus || undefined}
          />
        </div>
      )}

      <div ref={lista} id={listaId} role="listbox" aria-label={placeholder} className="overflow-y-auto p-1" style={{ maxHeight }}>
        {planos.length === 0
          ? <p className="px-3 py-6 text-center text-body text-ink-muted">{empty}</p>
          : visibles.map(g => (
            <div key={g.label} role="group" aria-label={g.label}>
              <div className="px-3 pt-3 pb-1 text-label font-semibold text-ink-muted">{g.label}</div>
              {g.items.map(item => {
                const elegido = item.id === actual?.id
                return (
                  <div
                    key={item.id}
                    id={`${listaId}-${item.id}`}
                    data-id={item.id}
                    role="option"
                    aria-selected={elegido}
                    aria-disabled={item.disabled || undefined}
                    onPointerMove={() => {
                      const i = planos.findIndex(p => p.id === item.id)
                      if (i >= 0) setActivo(i)
                    }}
                    onClick={() => !item.disabled && onSelect(item)}
                    className={cx(
                      'flex cursor-default items-center gap-3 rounded-lg px-3 py-2',
                      item.disabled ? 'opacity-45' : elegido && 'bg-hover',
                    )}
                  >
                    {item.icon && <Icon name={item.icon} size={18} className="icon-muted shrink-0" />}
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-body font-medium text-ink">{item.label}</span>
                      {item.hint && <span className="truncate text-meta text-ink-muted">{item.hint}</span>}
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
