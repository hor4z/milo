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
  /** `sm` para adentro de un panel denso, donde el de siempre se lee más grande que las filas de al lado. */
  size?: 'sm' | 'md'
}

function Root({ tone = 'info', icon, onDismiss, size = 'md', className, children, ...props }: AlertProps) {
  const glyph = icon === null ? null : icon ?? toneIcon[tone]
  return (
    <div
      role={tone === 'bad' ? 'alert' : 'status'}
      className={cx(s.root, size === 'sm' && s.compact, toneSurface[tone], className)}
      {...props}
    >
      {glyph && (
        <span className={cx(s.icon, toneInk[tone])}>
          <Icon name={glyph} size={size === 'sm' ? 16 : 18} />
        </span>
      )}
      <div className={s.body}>{children}</div>
      {onDismiss && (
        <IconButton icon="close" label="Descartar" size="sm" variant="ghost" onClick={onDismiss} className={s.dismiss} />
      )}
    </div>
  )
}

/** El renglón que nombra el aviso. */
function Title({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cx(s.title, className)} {...props} />
}

/** Qué pasó y qué se puede hacer. */
function Body({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cx(s.text, className)} {...props} />
}

/** La fila de botones del aviso. */
function Actions({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(s.actions, className)} {...props} />
}

/** Un aviso fijo en la página: algo pasó o algo hay que saber antes de seguir. */
export const Alert = Object.assign(Root, { Title, Body, Actions })
