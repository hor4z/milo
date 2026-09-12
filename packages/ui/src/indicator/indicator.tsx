import type { ReactNode } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { cx } from '../lib/cx'

const tones = {
  accent: 'bg-accent-fill text-on-accent',
  ok: 'bg-ok text-on-solid',
  warn: 'bg-warn text-on-solid',
  bad: 'bg-bad text-on-bad',
  neutral: 'bg-solid text-on-solid',
} as const

/** Una marca chica pegada a la esquina de otra cosa: un punto, un contador o un glifo. Lo que marca sigue siendo lo que se toca. */
export function Indicator({
  children, dot, count, icon, tone = 'accent', label, className,
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
  className?: string
}) {
  const hay = icon != null || (count != null && count > 0) || dot
  if (!hay) return <>{children}</>

  // El punto se apoya en el canto; el contador y el glifo se corren afuera,
  // porque son más grandes y adentro tapan lo que están marcando.
  const pelado = !icon && count == null

  return (
    <span className={cx('relative inline-flex', className)}>
      {children}
      <span
        aria-hidden={label ? undefined : 'true'}
        role={label ? 'status' : undefined}
        className={cx(
          'pointer-events-none absolute inline-flex items-center justify-center rounded-full ring-2 ring-surface',
          tones[tone],
          pelado
            ? 'top-0 right-0 size-2.5'
            : '-top-1 -right-1 min-h-4 min-w-4 px-1 text-meta font-semibold',
        )}
      >
        {label && <span className="sr-only">{label}</span>}
        {icon ? <Icon name={icon} size={12} /> : count != null ? (count > 99 ? '99+' : count) : null}
      </span>
    </span>
  )
}
