import {
  cloneElement, createContext, isValidElement, useContext, useEffect, useId, useLayoutEffect,
  useRef, useState, type ReactElement, type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { useEscape } from './esc'
import { Button, IconButton, cx } from './primitives'
import { Menu, MenuItem } from './menu'
import type { IconName } from './icon'

/** El host se crea durante el render y se cuelga del body en un layout effect. */
const PortalDepth = createContext(0)

export function Portal({ children }: { children: ReactNode }) {
  const depth = useContext(PortalDepth)
  const [host] = useState(() => {
    const el = document.createElement('div')
    el.setAttribute('data-portal', String(depth))
    el.style.position = 'relative'
    el.style.zIndex = String(1000 + depth * 10)
    return el
  })
  useLayoutEffect(() => {
    document.body.appendChild(host)
    return () => host.remove()
  }, [host])
  return createPortal(
    <PortalDepth.Provider value={depth + 1}>{children}</PortalDepth.Provider>,
    host,
  )
}

/** Bloquear el scroll del fondo mientras hay un overlay abierto. */
let lockCount = 0
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    lockCount++
    if (lockCount === 1) {
      const gap = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      if (gap > 0) document.body.style.paddingRight = `${gap}px`
    }
    return () => {
      lockCount--
      if (lockCount === 0) {
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
    }
  }, [active])
}

export { useEscape } from './esc'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** Tab no se sale del modal, y al cerrar el foco vuelve a donde estaba. */
export function useFocusTrap(active: boolean, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return
    const previous = document.activeElement as HTMLElement | null
    const node = ref.current

    const ensureFocus = () => {
      if (!node || node.contains(document.activeElement)) return
      const target = node.querySelector<HTMLElement>('[data-autofocus]') ?? node
      target.focus({ preventScroll: true })
    }
    ensureFocus()
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      ensureFocus()
      raf2 = requestAnimationFrame(ensureFocus)
    })

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !node) return
      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(el => el.offsetParent !== null)
      if (!items.length) return
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus() }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      document.removeEventListener('keydown', onKey)
      if (previous && previous !== document.body && previous.isConnected) previous.focus()
    }
  }, [active, ref])
}

/** Un panel anclado a su disparador. */
export function Popover({
  trigger, children, align = 'end', width, offset = 8, veil, onOpenChange,
}: {
  trigger: (props: {
    onClick: () => void
    'aria-expanded': boolean
    ref: React.Ref<HTMLButtonElement>
    'data-open': boolean
  }) => ReactNode
  children: (close: () => void) => ReactNode
  align?: 'start' | 'end'
  /** Sin esto se mide el ancho real del panel para alinearlo y encajarlo. */
  width?: number
  offset?: number
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

  const [alto, setAlto] = useState(0)

  // El panel cambia de alto mientras está abierto (una opción que aparece), y
  // abierto hacia arriba eso lo estira sobre su propio disparador.
  useEffect(() => {
    const el = panelRef.current
    if (!open || !el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => setAlto(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [open])

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    const w = width ?? panelRef.current?.offsetWidth ?? 0
    const h = panelRef.current?.offsetHeight ?? 0
    const left = align === 'end' ? r.right - w : r.left
    const cabeAbajo = r.bottom + offset + h <= window.innerHeight - 8
    const cabeArriba = r.top - offset - h >= 8
    setPos({
      top: cabeAbajo || !cabeArriba ? r.bottom + offset : r.top - offset - h,
      left: Math.max(8, Math.min(left, window.innerWidth - w - 8)),
    })
  }, [open, align, width, offset, alto])

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

/** Una opción de la lista del `Dropdown`. */
export type DropdownItem = {
  label: string
  icon?: IconName
  shortcut?: string
  danger?: boolean
  disabled?: boolean
  onSelect?: () => void
}

/** El menú de opciones escrito como lista, que es lo más corto cuando el menú no tiene nada raro: cuatro filas con su icono y su acción. */
export function Dropdown({
  trigger, items, align = 'end', width = 220,
}: {
  trigger: (props: { onClick: () => void; 'aria-expanded': boolean; ref: React.Ref<HTMLButtonElement> }) => ReactNode
  items: DropdownItem[]
  align?: 'start' | 'end'
  width?: number
}) {
  return (
    <Popover
      align={align}
      width={width}
      trigger={({ onClick, ref, 'aria-expanded': expanded }) => trigger({ onClick, ref, 'aria-expanded': expanded })}
    >
      {close => (
        <Menu>
          {items.map((item, i) => (
            <MenuItem
              key={i}
              icon={item.icon}
              shortcut={item.shortcut}
              danger={item.danger}
              disabled={item.disabled}
              onSelect={() => { item.onSelect?.(); close() }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Popover>
  )
}

export function Modal({
  open, onClose, children, width = 620, label,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  width?: number
  label: string
}) {
  const panel = useRef<HTMLDivElement>(null)
  useScrollLock(open)
  useEscape(open, onClose)
  useFocusTrap(open, panel)
  if (!open) return null
  return (
    <Portal>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="ui-fade absolute inset-0 bg-scrim backdrop-blur-[3px]" onClick={onClose} />
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
          style={{ width, maxWidth: '100%' }}
          className="ui-zoom relative z-10 max-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl bg-surface shadow-popover ring-1 ring-line"
        >
          {children}
        </div>
        <IconButton
          icon="close"
          label="Cerrar"
          variant="solid"
          size="lg"
          onClick={onClose}
          className="!absolute top-4 right-4 z-20 !rounded-lg"
        />
      </div>
    </Portal>
  )
}

/** El panel que entra desde un costado: un formulario largo sin cambiar de pantalla. */
export function Sheet({
  open, onClose, children, side = 'right', width = 460, label,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  side?: 'right' | 'left'
  width?: number
  label: string
}) {
  const panel = useRef<HTMLDivElement>(null)
  useScrollLock(open)
  useEscape(open, onClose)
  useFocusTrap(open, panel)
  if (!open) return null
  return (
    <Portal>
      <div className="fixed inset-0 z-40">
        <div className="ui-fade absolute inset-0 bg-scrim" onClick={onClose} />
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
          style={{ width, maxWidth: '100%', ['--slide-from' as string]: side === 'right' ? '12px' : '-12px' }}
          className={cx(
            'ui-slide absolute inset-y-0 flex flex-col bg-surface shadow-popover',
            side === 'right' ? 'right-0 border-l border-line' : 'left-0 border-r border-line',
          )}
        >
          {children}
        </div>
      </div>
    </Portal>
  )
}

/** La cabecera del panel, con su título y el botón de cerrar. */
export function SheetHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <IconButton icon="close" label="Cerrar" size="sm" variant="ghost" onClick={onClose} />
    </div>
  )
}

/** El cuerpo del panel: lo único que scrollea. */
export function SheetBody({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('flex-1 overflow-y-auto px-5 py-5', className)} {...props} />
}

/** La fila de acciones, abajo y siempre a la vista. */
export function SheetFooter({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('flex items-center justify-end gap-2 border-t border-line px-5 py-4', className)} {...props} />
}

/** El diálogo que pregunta antes de algo que no se puede deshacer. */
export function ConfirmDialog({
  open, onCancel, onConfirm, title, body, confirmLabel = 'Aceptar', cancelLabel = 'Cancelar', tone = 'neutral',
}: {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  /** La pregunta, con el nombre de lo que se va a tocar adentro. */
  title: string
  body?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'neutral' | 'bad'
}) {
  const panel = useRef<HTMLDivElement>(null)
  useScrollLock(open)
  useEscape(open, onCancel)
  useFocusTrap(open, panel)
  if (!open) return null
  return (
    <Portal>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="ui-fade absolute inset-0 bg-scrim backdrop-blur-[3px]" onClick={onCancel} />
        <div
          ref={panel}
          role="alertdialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          className="ui-zoom relative z-10 flex w-full max-w-[420px] flex-col gap-4 rounded-2xl bg-surface p-5 shadow-popover ring-1 ring-line"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            {body && <div className="text-xs font-medium text-ink-muted">{body}</div>}
          </div>
          <div className="flex items-center justify-end gap-2">
            {/* En una acción destructiva el foco arranca en la salida segura:
                con el foco en «Borrar», un Enter de más lo borra. */}
            <Button variant="ghost" size="sm" data-autofocus={tone === 'bad' || undefined} onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button
              variant={tone === 'bad' ? 'bad' : 'solid'}
              size="sm"
              data-autofocus={tone === 'bad' ? undefined : true}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  )
}
