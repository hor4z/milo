import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useField } from '../field/field'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'
import { useEscape } from '../lib/esc'
import { Portal } from '../portal/portal'
import { Spinner } from '../spinner/spinner'

/** El select es un botón con un listbox propio, no un `<select>` nativo. */
export function Select({
  value, onChange, options, width, leading, loading,
}: {
  value: string
  onChange?: (v: string) => void
  options: string[]
  width?: number
  /** Adelante del valor: un `Icon`, un `FolderIcon`, un `Avatar`, un `Spinner`. */
  leading?: ReactNode
  /** Mientras los datos no están: no abre, y el spinner va solo si no hay `leading`. */
  loading?: boolean
}) {
  const campo = useField()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)))
  const btn = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })
  const listId = useId()

  useLayoutEffect(() => {
    if (!open || !btn.current) return
    const r = btn.current.getBoundingClientRect()
    setPos({
      top: Math.min(r.bottom + 6, window.innerHeight - 16),
      left: Math.max(8, Math.min(r.left, window.innerWidth - r.width - 8)),
      width: r.width,
    })
    setActive(Math.max(0, options.indexOf(value)))
  }, [open, options, value])

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
        {...campo}
        aria-busy={loading || undefined}
        aria-disabled={loading || undefined}
        onClick={() => { if (!loading) setOpen(o => !o) }}
        style={{ width }}
        className="field-focus inline-flex h-9 items-center justify-between gap-2 rounded-md border border-field-line bg-field px-3 text-xs font-medium text-ink transition-colors duration-[120ms] hover:bg-field-hover aria-disabled:cursor-default aria-disabled:hover:bg-field"
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
            className="ui-pop fixed z-50 max-h-[240px] overflow-y-auto rounded-xl border border-line bg-popover p-1.5 shadow-popover"
          >
            {options.map((o, i) => {
              const selected = o === value
              return (
                <button
                  key={o}
                  role="option"
                  aria-selected={selected}
                  data-active={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => { onChange?.(o); setOpen(false); btn.current?.focus() }}
                  className={cx(
                    'flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-left text-xs font-medium',
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
