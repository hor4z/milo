import { cloneElement, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { useEscape } from '../lib/esc'
import { Portal } from '../portal/portal'

let ultimoCierre = 0

const VENTANA_TIBIA = 400

/** La etiqueta que dice qué hace un control que no lo dice solo: un icono suelto, un valor truncado, una acción con una consecuencia que conviene aclarar. */
export function Tooltip({ label, children, side = 'top', delay = 500 }: {
  label: ReactNode
  children: ReactNode
  /** Dónde va si entra. */
  side?: 'top' | 'bottom'
  delay?: number
}) {
  const [open, setOpen] = useState(false)
  const anchor = useRef<HTMLSpanElement>(null)
  const bubble = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const visible = useRef(false)
  const id = useId()

  const cancelar = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }
  const abrir = () => {
    cancelar()
    const espera = Date.now() - ultimoCierre < VENTANA_TIBIA ? 0 : delay
    timer.current = setTimeout(() => { visible.current = true; setOpen(true) }, espera)
  }
  const cerrar = () => {
    cancelar()
    if (visible.current) ultimoCierre = Date.now()
    visible.current = false
    setOpen(false)
  }

  useEffect(() => cancelar, [])

  useEscape(open, cerrar)

  useLayoutEffect(() => {
    if (!open || !anchor.current) return
    const r = anchor.current.getBoundingClientRect()
    const w = bubble.current?.offsetWidth ?? 0
    const h = bubble.current?.offsetHeight ?? 0
    const cabeArriba = r.top - 8 - h >= 8
    const cabeAbajo = r.bottom + 8 + h <= window.innerHeight - 8
    const arriba = side === 'top' ? cabeArriba || !cabeAbajo : !cabeAbajo && cabeArriba
    setPos({
      top: arriba ? r.top - 8 - h : r.bottom + 8,
      left: Math.max(8, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 8)),
    })
  }, [open, side])

  useEffect(() => {
    if (!open) return
    window.addEventListener('scroll', cerrar, true)
    window.addEventListener('resize', cerrar)
    return () => {
      window.removeEventListener('scroll', cerrar, true)
      window.removeEventListener('resize', cerrar)
    }
  }, [open])

  return (
    <>
      <span
        ref={anchor}
        className="inline-flex"
        onPointerEnter={e => { if (e.pointerType === 'mouse') abrir() }}
        onPointerLeave={cerrar}
        onPointerDown={cerrar}
        onFocus={e => { if ((e.target as HTMLElement).matches?.(':focus-visible')) abrir() }}
        onBlur={cerrar}
      >
        {isValidElement(children)
          ? cloneElement(children as ReactElement<{ 'aria-describedby'?: string }>,
              { 'aria-describedby': open ? id : undefined })
          : children}
      </span>

      {open && (
        <Portal>
          <div
            ref={bubble}
            id={id}
            role="tooltip"
            style={{ top: pos.top, left: pos.left }}
            className="ui-fade pointer-events-none fixed z-[60] max-w-[240px] rounded-md bg-solid px-2 py-1 text-xs font-medium text-on-solid shadow-popover"
          >
            {label}
          </div>
        </Portal>
      )}
    </>
  )
}
