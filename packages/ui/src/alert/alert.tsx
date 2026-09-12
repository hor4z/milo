import type { ComponentPropsWithoutRef } from 'react'
import { IconButton } from '../icon-button/icon-button'
import { Icon, type IconName } from '../icon/icon'
import { cx } from '../lib/cx'
import { type Tone, toneIcon, toneInk, toneSurface } from '../lib/tone'

type AlertProps = ComponentPropsWithoutRef<'div'> & {
  /** De acá salen el glifo, el color y la urgencia con que se anuncia. */
  tone?: Tone
  /** Sin esto lo pone el tono; `null` lo saca. */
  icon?: IconName | null
  /** Agrega la X para cerrarlo; sin esto no se cierra. */
  onDismiss?: () => void
}

/** Un aviso fijo en la página: algo pasó o algo hay que saber antes de seguir. */
export function Alert({ tone = 'info', icon, onDismiss, className, children, ...props }: AlertProps) {
  const glyph = icon === null ? null : icon ?? toneIcon[tone]
  return (
    <div
      role={tone === 'bad' ? 'alert' : 'status'}
      className={cx('flex gap-3 rounded-xl border p-4', toneSurface[tone], className)}
      {...props}
    >
      {glyph && (
        <span className={cx('flex size-5 shrink-0 items-center justify-center', toneInk[tone])}>
          <Icon name={glyph} size={18} />
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
  return <p className={cx('text-reading font-semibold text-ink', className)} {...props} />
}

/** Qué pasó y qué se puede hacer. */
export function AlertBody({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cx('text-body font-medium text-ink-muted', className)} {...props} />
}

/** La fila de botones del aviso. */
export function AlertActions({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('mt-2 flex flex-wrap items-center gap-2', className)} {...props} />
}
