import type { ComponentPropsWithoutRef } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { cx } from '../lib/cx'
import { type Tone, badgeTone } from '../lib/tone'

type BadgeProps = ComponentPropsWithoutRef<'span'> & {
  /** En qué estado está lo que describe. `neutral` es una etiqueta y no un estado, y es el que más se usa. */
  tone?: Tone | 'neutral'
  /** El glifo que acompaña al texto, a la izquierda. */
  icon?: IconName
}

/** Una marca chica que dice en qué estado está algo. */
export function Badge({ tone = 'neutral', icon, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex h-5 items-center gap-1 rounded-sm px-1.5 text-2xs font-semibold',
        badgeTone[tone],
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  )
}
