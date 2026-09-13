import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useDismiss } from '../lib/dismiss'
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
  /** Contra qué borde del disparador se alinea el panel. */
  align?: 'start' | 'end'
  /** Sin esto se mide el ancho real del panel para alinearlo y encajarlo. */
  width?: number
  /** Cuánto se separa del disparador, en px. */
  offset?: number
  /** Atenúa el resto de la pantalla. */
  veil?: boolean
  /** Avisa cuándo abre y cuándo cierra. */
  onOpenChange?: (open: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  const set = (v: boolean) => { setOpen(v); onOpenChange?.(v) }

  const close = () => {
    // Si el foco estaba adentro del panel, al desmontarlo se cae al `<body>` y
    // quien usa el teclado queda arriba de todo, lejos de donde estaba. Se
    // pregunta antes de cerrar, que es cuando el panel todavía existe. Cuando
    // el foco está afuera —alguien tocó en otro lado— no se le mueve nada.
    const adentro = panelRef.current?.contains(document.activeElement)
    set(false)
    if (adentro) triggerRef.current?.focus()
  }

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

  useDismiss(open, close, [panelRef, triggerRef])

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
