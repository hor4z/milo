import s from './alert.module.css'
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
      className={cx(s.div, toneSurface[tone], className)}
      {...props}
    >
      {glyph && (
        <span className={cx(s.span, toneInk[tone])}>
          <Icon name={glyph} size={18} />
        </span>
      )}
      <div className={s.div2}>{children}</div>
      {onDismiss && (
        <IconButton icon="close" label="Descartar" size="sm" variant="ghost" onClick={onDismiss} className={s.iconButton} />
      )}
    </div>
  )
}

/** El renglón que nombra el aviso. */
export function AlertTitle({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cx(s.p, className)} {...props} />
}

/** Qué pasó y qué se puede hacer. */
export function AlertBody({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cx(s.p2, className)} {...props} />
}

/** La fila de botones del aviso. */
export function AlertActions({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(s.div3, className)} {...props} />
}
