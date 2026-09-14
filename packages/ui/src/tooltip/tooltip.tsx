import s from './tooltip.module.css'
import { cloneElement, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { useDismiss } from '../lib/dismiss'
import { useEscape } from '../lib/esc'
import { Portal } from '../portal/portal'

let lastClosedAt = 0

const WARM_WINDOW = 400

/** La etiqueta que dice qué hace un control que no lo dice solo: un icono suelto, un valor truncado, una acción con una consecuencia que conviene aclarar. */
export function Tooltip({ label, children, side = 'top', delay = 500 }: {
  /** Lo que dice la etiqueta. */
  label: ReactNode
  /** El control que explica; se envuelve, no se pide render prop. */
  children: ReactNode
  /** Dónde va si entra. */
  side?: 'top' | 'bottom'
  /** Ms del primero; los siguientes abren en 0 dentro de una ventana de 400. */
  delay?: number
}) {
  const [open, setOpen] = useState(false)
  const anchor = useRef<HTMLSpanElement>(null)
  const bubble = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const visible = useRef(false)
  const id = useId()

  const cancel = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }
  const show = () => {
    cancel()
    const delayed = Date.now() - lastClosedAt < WARM_WINDOW ? 0 : delay
    timer.current = setTimeout(() => { visible.current = true; setOpen(true) }, delayed)
  }
  const close = () => {
    cancel()
    if (visible.current) lastClosedAt = Date.now()
    visible.current = false
    setOpen(false)
  }

  useEffect(() => cancel, [])

  useEscape(open, close)

  useLayoutEffect(() => {
    if (!open || !anchor.current) return
    const r = anchor.current.getBoundingClientRect()
    const w = bubble.current?.offsetWidth ?? 0
    const h = bubble.current?.offsetHeight ?? 0
    const fitsAbove = r.top - 8 - h >= 8
    const fitsBelow = r.bottom + 8 + h <= window.innerHeight - 8
    const above = side === 'top' ? fitsAbove || !fitsBelow : !fitsBelow && fitsAbove
    setPos({
      top: above ? r.top - 8 - h : r.bottom + 8,
      left: Math.max(8, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 8)),
    })
  }, [open, side])

  useDismiss(open, close, [anchor, bubble])

  return (
    <>
      <span
        ref={anchor}
        className={s.trigger}
        onPointerEnter={e => { if (e.pointerType === 'mouse') show() }}
        onPointerLeave={close}
        onPointerDown={close}
        onFocus={e => { if ((e.target as HTMLElement).matches?.(':focus-visible')) show() }}
        onBlur={close}
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
            className={`${s.panel} ui-fade`}
          >
            {label}
          </div>
        </Portal>
      )}
    </>
  )
}
