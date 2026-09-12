import { type ComponentPropsWithoutRef } from 'react'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'

type BreadcrumbProps = ComponentPropsWithoutRef<'nav'> & {
  /** De la raíz hasta acá. El último es dónde estás. */
  items: { label: string; href?: string; onClick?: () => void }[]
}

/** Dónde estás parado y cómo volver. */
export function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="Ruta" className={cx('flex min-w-0 items-center gap-1', className)} {...props}>
      <ol className="flex min-w-0 items-center gap-1">
        {items.map((it, i) => {
          const ultimo = i === items.length - 1
          return (
            <li key={i} className="flex min-w-0 items-center gap-1">
              {ultimo
                ? <span aria-current="page" className="truncate text-xs font-semibold text-ink">{it.label}</span>
                : (
                  <a
                    href={it.href ?? '#'}
                    onClick={e => { if (it.onClick) { e.preventDefault(); it.onClick() } }}
                    className="truncate rounded-sm text-xs font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    {it.label}
                  </a>
                )}
              {!ultimo && <Icon name="chevron_right" size={14} className="icon-muted shrink-0" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
