import s from './page.module.css'
import type { ReactNode } from 'react'
import { cx } from '../lib/cx'

function Root({ children, wide }: {
  children: ReactNode
  /** Suelta el ancho para una tabla o una grilla larga. */
  wide?: boolean
}) {
  return (
    <div className={cx(s.root, wide ? s.wide : s.narrow)}>
      {children}
    </div>
  )
}

function Header({
  title, subtitle, actions,
}: {
  /** El nombre de la pantalla, como `h1`. */
  title: string
  /** Una línea de apoyo. */
  subtitle?: string
  /** Lo que se puede hacer acá, a la derecha. */
  actions?: ReactNode
}) {
  return (
    <div className={s.header}>
      <div className={s.heading}>
        <h1 className={s.title}>{title}</h1>
        {subtitle && <p className={s.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={s.actions}>{actions}</div>}
    </div>
  )
}

/** El separador con rótulo, para cortar una pantalla larga en tramos. */
function SectionLabel({ children, count }: {
  children: ReactNode
  /** Cuántos hay, al lado del rótulo. */
  count?: number
}) {
  return (
    <div className={s.sectionLabel}>
      <span className={s.sectionText}>{children}</span>
      {count !== undefined && <span className={`${s.sectionCount} tabular`}>{count}</span>}
      <span className={s.sectionRule} />
    </div>
  )
}

/** El contenedor de una pantalla. */
export const Page = Object.assign(Root, { Header, SectionLabel })
