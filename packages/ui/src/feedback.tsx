import {
  createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState,
  type ComponentPropsWithoutRef, type ReactNode,
} from 'react'
import { Icon, type IconName } from './icon'
import { IconButton, cx } from './primitives'
import { Portal } from './overlay'

export type Tone = 'info' | 'ok' | 'warn' | 'bad'

const toneIcon: Record<Tone, IconName> = {
  info: 'info',
  ok: 'check_circle',
  warn: 'warning',
  bad: 'error',
}

const toneClass: Record<Tone, string> = {
  info: 'bg-brand-subtle text-brand-ink',
  ok: 'bg-ok-subtle text-ok-ink',
  warn: 'bg-warn-subtle text-warn-ink',
  bad: 'bg-bad-subtle text-bad-ink',
}

type AlertProps = ComponentPropsWithoutRef<'div'> & {
  tone?: Tone
  /** Sin esto lo pone el tono; `null` lo saca. */
  icon?: IconName | null
  onDismiss?: () => void
}

/** Un aviso fijo en la página: algo pasó o algo hay que saber antes de seguir. */
export function Alert({ tone = 'info', icon, onDismiss, className, children, ...props }: AlertProps) {
  const glifo = icon === null ? null : icon ?? toneIcon[tone]
  return (
    <div
      role={tone === 'bad' ? 'alert' : 'status'}
      className={cx('flex gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-card', className)}
      {...props}
    >
      {glifo && (
        <span className={cx('flex size-7 shrink-0 items-center justify-center rounded-md', toneClass[tone])}>
          <Icon name={glifo} size={18} />
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1 py-0.5">{children}</div>
      {onDismiss && (
        <IconButton icon="close" label="Descartar" size="sm" variant="ghost" onClick={onDismiss} className="-mt-0.5 -mr-1" />
      )}
    </div>
  )
}

/** El renglón que nombra el aviso. */
export function AlertTitle({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cx('text-base font-semibold text-ink', className)} {...props} />
}

/** Qué pasó y qué se puede hacer. */
export function AlertBody({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cx('text-xs font-medium text-ink-muted', className)} {...props} />
}

/** La fila de botones del aviso. */
export function AlertActions({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('mt-1.5 flex flex-wrap items-center gap-2', className)} {...props} />
}

export type ToastOptions = {
  title: string
  body?: string
  tone?: Tone
  action?: ReactNode
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
export function ToastProvider({ children, max = 3 }: { children: ReactNode; max?: number }) {
  const [lista, setLista] = useState<ToastRecord[]>([])
  const contador = useRef(0)

  const dismiss = useCallback((id: string) => {
    setLista(l => l.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((o: ToastOptions) => {
    const id = `toast-${++contador.current}`
    setLista(l => [...l, { ...o, id }].slice(-max))
    return id
  }, [max])

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastCtx.Provider value={api}>
      {children}
      {lista.length > 0 && (
        <Portal>
          <ol
            aria-live="polite"
            aria-label="Avisos"
            className="fixed right-4 bottom-4 z-[70] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2"
          >
            {lista.map(t => <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />)}
          </ol>
        </Portal>
      )}
    </ToastCtx.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastRecord; onDismiss: () => void }) {
  const { title, body, tone = 'info', action, duration = 5000 } = toast
  const [pausado, setPausado] = useState(false)
  const id = useId()

  useEffect(() => {
    if (!duration || pausado) return
    const t = setTimeout(onDismiss, duration)
    return () => clearTimeout(t)
  }, [duration, pausado, onDismiss])

  return (
    <li
      className="ui-rise flex gap-3 rounded-xl border border-line bg-popover p-3.5 shadow-popover"
      onPointerEnter={() => setPausado(true)}
      onPointerLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      aria-labelledby={id}
    >
      <span className={cx('flex size-7 shrink-0 items-center justify-center rounded-md', toneClass[tone])}>
        <Icon name={toneIcon[tone]} size={18} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1 py-0.5">
        <p id={id} className="text-base font-semibold text-ink">{title}</p>
        {body && <p className="text-xs font-medium text-ink-muted">{body}</p>}
        {action && <div className="mt-1.5 flex items-center gap-2">{action}</div>}
      </div>
      <IconButton icon="close" label="Cerrar el aviso" size="sm" variant="ghost" onClick={onDismiss} className="-mt-0.5 -mr-1" />
    </li>
  )
}
