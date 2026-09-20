import cls from './indicator.module.css'
import type { CSSProperties, ReactNode } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { cx } from '../lib/cx'

const tones = {
  accent: cls.toneAccent,
  ok: cls.toneOk,
  warn: cls.toneWarn,
  bad: cls.toneBad,
  neutral: cls.toneNeutral,
} as const

/** Una marca chica pegada a la esquina de otra cosa: un punto, un contador o un glifo. Lo que marca sigue siendo lo que se toca. */
export function Indicator({
  children, dot, count, icon, tone = 'accent', label, inset = 0, ring = 'transparent', className,
}: {
  /** Lo que se marca: un icono, un botón, un avatar, una tarjeta. */
  children: ReactNode
  /** El punto pelado. Es el default cuando no hay nada más que decir. */
  dot?: boolean
  /** Un número. En 0 no dibuja nada y arriba de 99 dice `99+`. */
  count?: number
  /** Un glifo de 10 en vez del punto: un check, un candado, una alerta. */
  icon?: IconName
  /** El color de la marca. */
  tone?: keyof typeof tones
  /** Qué significa la marca, para quien no la ve. Sin esto la marca es decorativa. */
  label?: string
  /** El anillo que separa la marca de lo que tiene atrás. Va del color de ese fondo: sobre una foto, el papel de la tarjeta; sobre un control, su relleno. */
  ring?: string
  /** Cuánto meter la marca hacia adentro, en px. Lo que se marca no siempre llena su caja: un `IconButton` de 40 lleva un glifo de 18, y con la marca en la esquina queda lejos de lo que marca. */
  inset?: number
  className?: string
}) {
  const hasContent = icon != null || (count != null && count > 0) || dot
  if (!hasContent) return <>{children}</>

  return (
    <span className={cx(cls.root, className)}>
      {children}
      <span
        aria-hidden={label ? undefined : 'true'}
        role={label ? 'status' : undefined}
        style={{ '--inset': `${inset}px`, '--ring-color': ring } as CSSProperties}
        className={cx(
          cls.badge,
          tones[tone],
          icon ? cls.glyph : count != null ? cls.count : cls.dot,
        )}
      >
        {label && <span className="sr-only">{label}</span>}
        {icon ? <Icon name={icon} size={12} /> : count != null ? (count > 99 ? '99+' : count) : null}
      </span>
    </span>
  )
}
