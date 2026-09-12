import type { ReactNode } from 'react'
import { cx } from '../lib/cx'

/** El contenedor de una pantalla. */
export function Page({ children, wide }: {
  children: ReactNode
  /** Suelta el ancho para una tabla o una grilla larga. */
  wide?: boolean
}) {
  return (
    <div className={cx('mx-auto w-full px-5 pt-1 pb-8', wide ? 'max-w-[1560px]' : 'max-w-[1200px]')}>
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
    <div className="mb-5 flex min-h-10 flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-title font-medium">{title}</h1>
        {subtitle && <p className="mt-2 text-body font-medium text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
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
    <div className="mb-3 mt-8 flex items-center gap-2 first:mt-0">
      <span className="text-body font-medium text-ink-muted">{children}</span>
      {count !== undefined && <span className="tabular text-meta text-ink-muted">{count}</span>}
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}
