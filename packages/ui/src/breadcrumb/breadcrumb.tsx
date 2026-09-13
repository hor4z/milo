import cls from './breadcrumb.module.css'
import type { ComponentPropsWithoutRef } from 'react'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'

type BreadcrumbProps = ComponentPropsWithoutRef<'nav'> & {
  /** El nombre de la ruta. Dos `nav` con el mismo nombre en una pantalla se leen como uno solo, así que con más de una hay que distinguirlas. */
  label?: string
  /** De la raíz hasta acá. El último es dónde estás. */
  items: { label: string; href?: string; onClick?: () => void }[]
}

/** Dónde estás parado y cómo volver. */
export function Breadcrumb({ items, label = 'Ruta', className, ...props }: BreadcrumbProps) {
  return (
    <nav aria-label={label} className={cx(cls.nav, className)} {...props}>
      <ol className={cls.ol}>
        {items.map((it, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className={cls.li}>
              {last
                ? <span aria-current="page" className={cls.span}>{it.label}</span>
                : it.href
                  ? <a href={it.href} onClick={it.onClick} className={cls.step}>{it.label}</a>
                  : it.onClick
                    ? <button type="button" onClick={it.onClick} className={cls.step}>{it.label}</button>
                    : <span className={cls.step}>{it.label}</span>}
              {!last && <Icon name="chevron_right" size={14} className={`${cls.icon} icon-muted`} />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
