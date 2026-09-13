import s from './page.module.css'
import type { ReactNode } from 'react'
import { cx } from '../lib/cx'

/** El contenedor de una pantalla. */
export function Page({ children, wide }: {
  children: ReactNode
  /** Suelta el ancho para una tabla o una grilla larga. */
  wide?: boolean
}) {
  return (
    <div className={cx(s.div, wide ? s.div2 : s.div3)}>
      {children}
    </div>
  )
}

export function PageHeader({
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
    <div className={s.div4}>
      <div className={s.div5}>
        <h1 className={s.h1}>{title}</h1>
        {subtitle && <p className={s.p}>{subtitle}</p>}
      </div>
      {actions && <div className={s.div6}>{actions}</div>}
    </div>
  )
}

/** El separador con rótulo, para cortar una pantalla larga en tramos. */
export function SectionLabel({ children, count }: {
  children: ReactNode
  /** Cuántos hay, al lado del rótulo. */
  count?: number
}) {
  return (
    <div className={s.div7}>
      <span className={s.span}>{children}</span>
      {count !== undefined && <span className={`${s.span2} tabular`}>{count}</span>}
      <span className={s.span3} />
    </div>
  )
}
