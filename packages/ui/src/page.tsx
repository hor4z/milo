import type { ReactNode } from 'react'
import { cx } from './primitives'

/**
 * El contenedor de una pantalla. El ancho máximo y el padding viven acá y no en
 * cada pantalla: si cada una elige el suyo, el contenido baila al navegar y se
 * nota en el título, que cambia de lugar unos píxeles.
 */
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

/** Lo que se ve cuando no hay nada. Siempre con una salida, nunca solo un texto. */
export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong px-6 py-14 text-center">
      <div className="text-base font-semibold">{title}</div>
      <p className="mt-2 max-w-[42ch] text-xs font-medium text-ink-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
