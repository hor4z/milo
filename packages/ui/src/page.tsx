import type { ReactNode } from 'react'
import { cx } from './primitives'
import { Icon, type IconName } from './icon'

/** El contenedor de una pantalla. */
export function Page({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={cx('mx-auto w-full px-5 pt-1 pb-7', wide ? 'max-w-[1560px]' : 'max-w-[1200px]')}>
      {children}
    </div>
  )
}

export function PageHeader({
  title, subtitle, actions,
}: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex min-h-10 flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-lg font-medium">{title}</h1>
        {subtitle && <p className="mt-1.5 text-xs font-medium text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}

/** El separador con rótulo, para cortar una pantalla larga en tramos. */
export function SectionLabel({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <div className="mb-3 mt-8 flex items-center gap-2.5 first:mt-0">
      <span className="text-xs font-medium text-ink-muted">{children}</span>
      {count !== undefined && <span className="tabular text-2xs text-ink-muted">{count}</span>}
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}

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
