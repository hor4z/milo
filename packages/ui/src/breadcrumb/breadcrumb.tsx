import type { ComponentPropsWithoutRef } from 'react'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'

type BreadcrumbProps = ComponentPropsWithoutRef<'nav'> & {
  /** El nombre de la ruta. Dos `nav` con el mismo nombre en una pantalla se leen como uno solo, así que con más de una hay que distinguirlas. */
  label?: string
  /** De la raíz hasta acá. El último es dónde estás. */
  items: { label: string; href?: string; onClick?: () => void }[]
}

const step = 'truncate rounded-sm text-body font-medium text-ink-muted transition-colors hover:text-ink'

/** Dónde estás parado y cómo volver. */
export function Breadcrumb({ items, label = 'Ruta', className, ...props }: BreadcrumbProps) {
  return (
    <nav aria-label={label} className={cx('flex min-w-0 items-center gap-1', className)} {...props}>
      <ol className="flex min-w-0 items-center gap-1">
        {items.map((it, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="flex min-w-0 items-center gap-1">
              {last
                ? <span aria-current="page" className="truncate text-body font-semibold text-ink">{it.label}</span>
                : it.href
                  ? <a href={it.href} onClick={it.onClick} className={step}>{it.label}</a>
                  : it.onClick
                    ? <button type="button" onClick={it.onClick} className={step}>{it.label}</button>
                    : <span className={step}>{it.label}</span>}
              {!last && <Icon name="chevron_right" size={14} className="icon-muted shrink-0" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
