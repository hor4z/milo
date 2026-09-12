import { type ReactNode } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { cx } from '../lib/cx'

/** Lo que se ve cuando no hay nada. */
export function EmptyState({ title, body, action, icon, size = 'md', bordered = size === 'md' }: {
  title: string
  body: string
  action?: ReactNode
  /** La marca de arriba. */
  icon?: IconName
  /** `md` para una pantalla, `sm` para adentro de una tabla o una galería. */
  size?: 'sm' | 'md'
  /** La caja punteada. */
  bordered?: boolean
}) {
  const chico = size === 'sm'
  return (
    <div
      className={cx(
        'flex flex-col items-center text-center',
        chico ? 'px-4 py-8' : 'px-6 py-14',
        bordered && 'rounded-2xl border border-dashed border-line-strong',
      )}
    >
      {icon && (
        <span
          className={cx(
            'inset-relief mb-4 inline-flex items-center justify-center rounded-xl bg-muted',
            chico ? 'size-9' : 'size-11',
          )}
        >
          <Icon name={icon} size={chico ? 18 : 22} className="icon-muted" />
        </span>
      )}
      <div className={chico ? 'text-xs font-semibold' : 'text-base font-semibold'}>{title}</div>
      <p className={cx('mt-2 max-w-[42ch] font-medium text-ink-muted', chico ? 'text-2xs' : 'text-xs')}>{body}</p>
      {action && <div className={chico ? 'mt-3.5' : 'mt-5'}>{action}</div>}
    </div>
  )
}
