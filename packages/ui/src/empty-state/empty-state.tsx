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
        'flex flex-col items-center text-center',
        small ? 'px-4 py-8' : 'px-6 py-16',
        bordered && 'rounded-xl border border-dashed border-line-strong',
      )}
    >
      {icon && (
        <span
          className={cx(
            'inset-relief mb-4 inline-flex items-center justify-center rounded-xl bg-muted',
            small ? 'size-9' : 'size-11',
          )}
        >
          <Icon name={icon} size={small ? 18 : 22} className="icon-muted" />
        </span>
      )}
      <div className={small ? 'text-body font-semibold' : 'text-reading font-semibold'}>{title}</div>
      <p className={cx('mt-2 max-w-[42ch] font-medium text-ink-muted', small ? 'text-meta' : 'text-body')}>{body}</p>
      {action && <div className={small ? 'mt-4' : 'mt-5'}>{action}</div>}
    </div>
  )
}
