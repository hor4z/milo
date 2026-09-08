import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, type IconName } from './icon'
import { cx, Kbd } from './primitives'
import { Portal, useEscape, useFocusTrap, useScrollLock } from './overlay'
import { activities, recipes } from '../data'

type Command = { id: string; label: string; hint?: string; icon: IconName; run: () => void; group: string }

/**
 * La paleta. Dos cosas la hacen usable y las dos son de teclado:
 *
 * 1. El índice activo se resetea a 0 en cada tecleo. Si no, filtrás y el
 *    resaltado queda en la fila 7 de una lista que ahora tiene 2.
 * 2. La fila activa se trae a la vista con `scrollIntoView({block:'nearest'})`.
 *    Con 'center' la lista salta en cada flecha; con nearest solo se mueve
 *    cuando hace falta.
 */
export function CommandPalette({
  open, onClose, onOpenSettings,
}: { open: boolean; onClose: () => void; onOpenSettings: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const panel = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useScrollLock(open)
  useEscape(open, onClose)
  useFocusTrap(open, panel)

  useEffect(() => { if (open) { setQuery(''); setActive(0) } }, [open])

  const commands = useMemo<Command[]>(() => {
    const go = (to: string) => () => { navigate(to); onClose() }
    return [
      { id: 'c1', label: 'Nueva actividad', icon: 'plus', group: 'Acciones', run: go('/') },
      { id: 'c2', label: 'Nuevo espacio', icon: 'folderPlus', group: 'Acciones', run: go('/') },
      { id: 'c3', label: 'Ajustes', hint: '⌘,', icon: 'sliders', group: 'Acciones', run: () => onOpenSettings() },
      { id: 'n1', label: 'Mis actividades', icon: 'cube', group: 'Ir a', run: go('/') },
      { id: 'n2', label: 'Explorar', icon: 'compass', group: 'Ir a', run: go('/explorar') },
      { id: 'n3', label: 'Recetas', icon: 'book', group: 'Ir a', run: go('/explorar/recetas') },
      { id: 'n4', label: 'Guardadas', icon: 'heart', group: 'Ir a', run: go('/guardadas') },
      { id: 'n5', label: 'Planes', icon: 'card', group: 'Ir a', run: go('/planes') },
      { id: 'n6', label: 'Novedades', icon: 'sparkle', group: 'Ir a', run: go('/novedades') },
      ...activities.slice(0, 8).map<Command>(a => ({
        id: a.id, label: a.title, hint: a.space, icon: 'cube', group: 'Actividades', run: go('/'),
      })),
      ...recipes.slice(0, 4).map<Command>(r => ({
        id: r.id, label: r.title, hint: `${r.phases} fases`, icon: 'book', group: 'Recetas', run: go('/explorar/recetas'),
      })),
    ]
  }, [navigate, onClose, onOpenSettings])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    /* Se busca sin tildes: quien escribe rápido no las pone, y "indagacion"
       tiene que encontrar "Indagación". */
    const strip = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    const needle = strip(q)
    return commands.filter(c => strip(c.label).includes(needle) || strip(c.hint ?? '').includes(needle) || strip(c.group).includes(needle))
  }, [commands, query])

  useEffect(() => { setActive(0) }, [query])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, results.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
      if (e.key === 'Enter') { e.preventDefault(); results[active]?.run() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, results, active])

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  /* Los grupos salen del orden en que ya vienen los resultados: agrupar
     reordenando haría que la primera fila cambie de lugar al tipear. */
  const groups: { name: string; items: Command[] }[] = []
  for (const r of results) {
    const last = groups[groups.length - 1]
    if (last?.name === r.group) last.items.push(r)
    else groups.push({ name: r.group, items: [r] })
  }

  let index = -1

  return (
    <Portal>
      <div className="fixed inset-0 z-40 flex items-start justify-center p-4 pt-[12vh]">
        <div className="ui-fade absolute inset-0 bg-scrim backdrop-blur-[3px]" onClick={onClose} />
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Buscar"
          className="ui-zoom relative z-10 flex w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-popover shadow-popover ring-1 ring-line"
        >
          <div className="flex h-14 shrink-0 items-center gap-3 border-b border-line px-4">
            <Icon name="search" size={18} className="text-ink-subtle" />
            <input
              data-autofocus
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar una actividad, una receta, una acción…"
              className="flex-1 bg-transparent text-md text-ink outline-none placeholder:text-ink-subtle"
              /* El input no lleva el anillo de foco: el foco de la paleta ya se
                 ve en la fila activa, y dos indicadores compiten. */
              style={{ boxShadow: 'none' }}
            />
            <Kbd>esc</Kbd>
          </div>

          <div ref={listRef} className="max-h-[52vh] min-h-0 overflow-y-auto p-2">
            {results.length === 0 && (
              <div className="px-3 py-10 text-center">
                <div className="text-base text-ink">Nada con «{query}»</div>
                <div className="mt-1 text-sm text-ink-subtle">Probá con el nombre del espacio o de la receta.</div>
              </div>
            )}
            {groups.map(g => (
              <div key={g.name} className="mb-1">
                <div className="px-3 py-1.5 text-2xs font-medium uppercase tracking-[0.06em] text-ink-subtle">
                  {g.name}
                </div>
                {g.items.map(c => {
                  index++
                  const isActive = index === active
                  const myIndex = index
                  return (
                    <button
                      key={c.id}
                      data-active={isActive}
                      onMouseMove={() => setActive(myIndex)}
                      onClick={c.run}
                      className={cx(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left',
                        isActive ? 'bg-hover text-ink' : 'text-ink-muted',
                      )}
                    >
                      <Icon name={c.icon} size={16} className={isActive ? 'text-accent' : 'text-ink-subtle'} />
                      <span className="min-w-0 flex-1 truncate text-base">{c.label}</span>
                      {c.hint && <span className="shrink-0 text-xs text-ink-subtle">{c.hint}</span>}
                      {isActive && <Icon name="arrowRight" size={14} className="shrink-0 text-ink-subtle" />}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          <div className="flex h-10 shrink-0 items-center gap-4 border-t border-line bg-muted px-4 text-2xs text-ink-subtle">
            <span className="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd> moverse</span>
            <span className="flex items-center gap-1.5"><Kbd>↵</Kbd> abrir</span>
            <span className="ml-auto tabular">{results.length} resultado{results.length === 1 ? '' : 's'}</span>
          </div>
        </div>
      </div>
    </Portal>
  )
}
