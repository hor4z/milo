import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useField } from '../field/field'
import { Icon } from '../icon/icon'
import { cx, fold } from '../lib/cx'
import { useEscape } from '../lib/esc'
import { Portal } from '../portal/portal'
import { Spinner } from '../spinner/spinner'

/** El select es un botón con un listbox propio, no un `<select>` nativo. */
export function Select({
  value, onChange, options, width, leading, loading,
}: {
  /** El valor elegido, que es lo que se ve en el botón. */
  value: string
  /** Recibe el valor nuevo; sin esto el control es de solo lectura. */
  onChange?: (v: string) => void
  /** La lista, en el orden en que se muestra. */
  options: string[]
  /** Sin esto toma el ancho del contenido. */
  width?: number
  /** Adelante del valor: un `Icon`, un `FolderIcon`, un `Avatar`, un `Spinner`. */
  leading?: ReactNode
  /** Mientras los datos no están: no abre, y el spinner va solo si no hay `leading`. */
  loading?: boolean
}) {
  const field = useField()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)))
  const btn = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })
  const listId = useId()
  const optionId = (i: number) => `${listId}-${i}`
  const typeahead = useRef({ text: '', until: 0 })

  useLayoutEffect(() => {
    if (!open || !btn.current) return
    const r = btn.current.getBoundingClientRect()
    setPos({
      top: Math.min(r.bottom + 6, window.innerHeight - 16),
      left: Math.max(8, Math.min(r.left, window.innerWidth - r.width - 8)),
      width: r.width,
    })
  }, [open, options, value])

  // La opción señalada se pone al abrir y no en cada render. Junto a la
  // medición —que sí depende de `options`— el cursor del teclado volvía a la
  // opción elegida cada vez que el padre volvía a renderizar, porque un
  // `options={[...]}` escrito inline arma un arreglo nuevo cada vez.
  useLayoutEffect(() => {
    if (open) setActive(Math.max(0, options.indexOf(value)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (list.current?.contains(t) || btn.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, options.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
      if (e.key === 'Home') { e.preventDefault(); setActive(0) }
      if (e.key === 'End') { e.preventDefault(); setActive(options.length - 1) }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onChange?.(options[active])
        setOpen(false)
        btn.current?.focus()
      }
      // Teclear salta a la opción que empieza así, que es lo que hace un
      // select nativo y lo único que vuelve usable una lista de veinte.
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const now = Date.now()
        typeahead.current.text = now > typeahead.current.until ? e.key : typeahead.current.text + e.key
        typeahead.current.until = now + 600
        const needle = fold(typeahead.current.text)
        const i = options.findIndex(o => fold(o).startsWith(needle))
        if (i >= 0) { e.preventDefault(); setActive(i) }
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [open, active, options, onChange])

  useEffect(() => {
    list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  useEscape(open, useCallback(() => { setOpen(false); btn.current?.focus() }, []))

  const leadingNode = loading ? leading ?? <Spinner size={16} /> : leading

  useEffect(() => { if (loading) setOpen(false) }, [loading])

  return (
    <>
      <button
        ref={btn}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? optionId(active) : undefined}
        {...field}
        aria-busy={loading || undefined}
        aria-disabled={loading || undefined}
        onClick={() => { if (!loading) setOpen(o => !o) }}
        onKeyDown={e => {
          if (loading || open) return
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true) }
        }}
        style={{ width }}
        className="field-focus inline-flex h-9 items-center justify-between gap-2 rounded-md border border-field-line bg-field px-3 text-body font-medium text-ink transition-colors duration-fast hover:bg-field-hover aria-disabled:cursor-default aria-disabled:hover:bg-field"
      >
        <span className="flex min-w-0 items-center gap-2">
          {leadingNode && <span className="flex shrink-0 items-center">{leadingNode}</span>}
          <span className="min-w-0 truncate">{value}</span>
        </span>
        <Icon name="keyboard_arrow_down" size={16} className="shrink-0 text-ink" />
      </button>

      {open && (
        <Portal>
          <div
            ref={list}
            id={listId}
            role="listbox"
            style={{ top: pos.top, left: pos.left, minWidth: pos.width }}
            className="ui-pop fixed z-50 max-h-[240px] overflow-y-auto rounded-xl border border-line bg-popover p-2 shadow-popover"
          >
            {options.map((o, i) => {
              const selected = o === value
              return (
                <button
                  key={o}
                  id={optionId(i)}
                  type="button"
                  role="option"
                  tabIndex={-1}
                  aria-selected={selected}
                  data-active={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => { onChange?.(o); setOpen(false); btn.current?.focus() }}
                  className={cx(
                    'flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-body font-medium',
                    i === active ? 'bg-hover text-ink' : 'text-ink-muted',
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{o}</span>
                  {selected && <Icon name="check" size={14} className="shrink-0 text-ink" />}
                </button>
              )
            })}
          </div>
        </Portal>
      )}
    </>
  )
}
