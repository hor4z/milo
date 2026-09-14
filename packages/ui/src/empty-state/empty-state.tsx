import s from './empty-state.module.css'
import type { ReactNode } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { cx } from '../lib/cx'

/** Lo que se ve cuando no hay nada. */
export function EmptyState({ title, body, action, icon, size = 'md', bordered = size === 'md' }: {
  /** Qué falta, en una línea. */
  title: string
  /** Qué pasó y qué se puede hacer. */
  body: string
  /** La salida. Siempre conviene que haya una. */
  action?: ReactNode
  /** La marca de arriba. */
  icon?: IconName
  /** `md` para una pantalla, `sm` para adentro de una tabla o una galería. */
  size?: 'sm' | 'md'
  /** La caja punteada. */
  bordered?: boolean
}) {
  const small = size === 'sm'
  return (
    <div
      className={cx(
        s.root,
        small ? s.padSmall : s.padLarge,
        bordered && s.bordered,
      )}
    >
      {icon && (
        <span
          className={cx(
            `${s.badge} inset-relief`,
            small ? s.badgeSmall : s.badgeLarge,
          )}
        >
          <Icon name={icon} size={small ? 18 : 22} className="icon-muted" />
        </span>
      )}
      <div className={small ? s.titleSmall : s.titleLarge}>{title}</div>
      <p className={cx(s.body, small ? s.bodySmall : s.bodyLarge)}>{body}</p>
      {action && <div className={small ? s.actionSmall : s.actionLarge}>{action}</div>}
    </div>
  )
}
