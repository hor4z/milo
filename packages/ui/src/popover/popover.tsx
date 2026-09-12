import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useEscape } from '../lib/esc'
import { Portal } from '../portal/portal'

/** Un panel anclado a su disparador. */
export function Popover({
  trigger, children, align = 'end', width, offset = 8, veil, onOpenChange,
}: {
  /** Recibe onClick, ref, aria-expanded y data-open. */
  trigger: (props: {
    onClick: () => void
    'aria-expanded': boolean
    ref: React.Ref<HTMLButtonElement>
    'data-open': boolean
  }) => ReactNode
  /** Recibe el cierre. El panel lo dibuja el call site — fondo, borde, radio y sombra — porque Popover no tiene aspecto. */
  children: (close: () => void) => ReactNode
  align?: 'start' | 'end'
  /** Sin esto se mide el ancho real del panel para alinearlo y encajarlo. */
  width?: number
  offset?: number
  /** Atenúa el resto de la pantalla. */
  veil?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  const set = (v: boolean) => { setOpen(v); onOpenChange?.(v) }
  const close = () => set(false)

  useEscape(open, close)

  const [height, setHeight] = useState(0)

  // El panel cambia de alto mientras está abierto (una opción que aparece), y
  // abierto hacia arriba eso lo estira sobre su propio disparador.
  useEffect(() => {
    const el = panelRef.current
    if (!open || !el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [open])

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    const w = width ?? panelRef.current?.offsetWidth ?? 0
    const h = panelRef.current?.offsetHeight ?? 0
    const left = align === 'end' ? r.right - w : r.left
    const fitsBelow = r.bottom + offset + h <= window.innerHeight - 8
    const fitsAbove = r.top - offset - h >= 8
    setPos({
      top: fitsBelow || !fitsAbove ? r.bottom + offset : r.top - offset - h,
      left: Math.max(8, Math.min(left, window.innerWidth - w - 8)),
    })
  }, [open, align, width, offset, height])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return
      close()
    }
    const onScroll = (e: Event) => {
      if (e.type === 'scroll' && panelRef.current?.contains(e.target as Node)) return
      close()
    }
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open])

  return (
    <>
      {trigger({
        onClick: () => set(!open),
        'aria-expanded': open,
        ref: triggerRef,
        'data-open': open,
      })}
      {open && (
        <Portal>
          {veil && <div className="ui-fade fixed inset-0 z-40 bg-veil" onClick={close} />}
          <div
            ref={panelRef}
            style={{ top: pos.top, left: pos.left, width }}
            className="fixed z-50"
          >
            {children(close)}
          </div>
        </Portal>
      )}
    </>
  )
}
