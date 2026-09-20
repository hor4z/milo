import s from './empty-state.module.css'
import type { ReactNode } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { cx } from '../lib/cx'
import { takePart } from '../lib/parts'

/** Qué falta, en una línea. */
function Title({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** Qué pasó y qué se puede hacer. */
function Body({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** La salida. Siempre conviene que haya una. */
function Action({ children }: { children: ReactNode }) {
  return <>{children}</>
}

function Root({ children, icon, size = 'md', bordered = size === 'md' }: {
  /** El `Title`, el `Body` y, si hay salida, la `Action`. */
  children?: ReactNode
  /** La marca de arriba. */
  icon?: IconName
  /** `md` para una pantalla, `sm` para adentro de una tabla o una galería. */
  size?: 'sm' | 'md'
  /** La caja punteada. */
  bordered?: boolean
}) {
  const [title, sinTitle] = takePart(children, Title)
  const [body, sinBody] = takePart(sinTitle, Body)
  const [action] = takePart(sinBody, Action)
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
      {action.length > 0 && <div className={small ? s.actionSmall : s.actionLarge}>{action}</div>}
    </div>
  )
}

/** Lo que se ve cuando no hay nada. */
export const EmptyState = Object.assign(Root, { Title, Body, Action })
