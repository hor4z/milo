import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { markFill, type MarkColor } from '../lib/colors'
import { Icon, type IconName } from '../icon/icon'

/** La lista de acciones: filas altas, cada una con una marca de color, un título y una línea de apoyo. */

export type { MarkColor } from '../lib/colors'

export function List({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('flex flex-col gap-2 rounded-2xl bg-surface p-2 shadow-card', className)}>
      {children}
    </div>
  )
}

export function ListItem({
  icon, color, title, hint, active, onClick, trailing,
}: {
  /** El glifo de la marca de color. */
  icon: IconName
  /** El par relleno/glifo de la marca. */
  color: MarkColor
  /** · 16/600. */
  title: string
  /** 14/500 en gris. */
  hint?: string
  /** La fila elegida: queda hundida, no teñida. */
  active?: boolean
  /** Sin esto la fila es un <div> y no toma hover. */
  onClick?: () => void
  /** A la derecha: un chevron, un contador. */
  trailing?: ReactNode
}) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={cx(
        'flex min-h-[72px] w-full items-center gap-3.5 rounded-xl px-3.5 py-3.5 text-left',
        'transition-[background-color,box-shadow] duration-[120ms] ease-out',
        'ring-1 ring-line',
        active ? 'bg-sunken shadow-none' : 'bg-surface shadow-card',
        onClick && !active && 'hover:bg-muted hover:shadow-none',
      )}
    >
      <span className={cx('mark inline-flex size-11 shrink-0 items-center justify-center rounded-full', markFill[color])}>
        <Icon name={icon} size={22} weight={400} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-md font-semibold text-ink">{title}</span>
        {hint && <span className="mt-0.5 block truncate text-base font-medium text-ink-muted">{hint}</span>}
      </span>

      {trailing && <span className="shrink-0">{trailing}</span>}
    </Tag>
  )
}
