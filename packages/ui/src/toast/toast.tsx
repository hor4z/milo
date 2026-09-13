import cls from './toast.module.css'
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { Button } from '../button/button'
import { IconButton } from '../icon-button/icon-button'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'
import { type Tone, toneClass, toneIcon } from '../lib/tone'
import { Portal } from '../portal/portal'

/** Lo que recibe `toast()`. */
export type ToastOptions = {
  /** Qué pasó, en una línea. */
  title: string
  /** El detalle, cuando el título no alcanza. */
  body?: string
  /** El mismo juego de tonos que `Alert` y `Chip`. */
  tone?: Tone
  /** La salida del aviso: deshacer, ver, reintentar. Al tocarla el aviso se cierra. */
  action?: { label: string; onClick?: () => void }
  /** Milisegundos antes de irse solo. `0` lo deja hasta que lo cierren. */
  duration?: number
}

type ToastRecord = ToastOptions & { id: string }

type ToastApi = {
  toast: (o: ToastOptions) => string
  dismiss: (id: string) => void
}

const ToastCtx = createContext<ToastApi | null>(null)

/** Da acceso a `toast()` desde cualquier lado del árbol. */
export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast necesita un <ToastProvider> arriba')
  return ctx
}

/** Monta la región de avisos pasajeros y el `useToast` que los empuja. */
export function ToastProvider({ children, max = 3 }: {
  children: ReactNode
  /** Cuántos se apilan antes de empujar al más viejo. */
  max?: number
}) {
  const [list, setList] = useState<ToastRecord[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: string) => {
    setList(l => l.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((o: ToastOptions) => {
    const id = `toast-${++counter.current}`
    setList(l => [...l, { ...o, id }].slice(-max))
    return id
  }, [max])

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastCtx.Provider value={api}>
      {children}
      {list.length > 0 && (
        <Portal>
          <ol
            aria-live="polite"
            aria-label="Avisos"
            className={cls.ol}
          >
            {list.map(t => <ToastItem key={t.id} toast={t} onDismiss={dismiss} />)}
          </ol>
        </Portal>
      )}
    </ToastCtx.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastRecord; onDismiss: (id: string) => void }) {
  const { id: toastId, title, body, tone = 'info', action, duration = 5000 } = toast
  const [paused, setPaused] = useState(false)
  const id = useId()

  const close = useCallback(() => onDismiss(toastId), [onDismiss, toastId])

  useEffect(() => {
    if (!duration || paused) return
    const t = setTimeout(close, duration)
    return () => clearTimeout(t)
  }, [duration, paused, close])

  return (
    <li
      className={`${cls.li} ui-rise bg-popover`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-labelledby={id}
    >
      <span className={cx(cls.span, toneClass[tone])}>
        <Icon name={toneIcon[tone]} size={18} />
      </span>
      <div className={cls.div}>
        <p id={id} className={cls.p}>{title}</p>
        {body && <p className={cls.p2}>{body}</p>}
        {action && (
          <div className={cls.div2}>
            <Button size="sm" variant="raised" onClick={() => { action.onClick?.(); close() }}>
              {action.label}
            </Button>
          </div>
        )}
      </div>
      <IconButton icon="close" label="Cerrar el aviso" size="sm" variant="ghost" onClick={close} className={cls.iconButton} />
    </li>
  )
}
