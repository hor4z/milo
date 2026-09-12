import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Icon, type IconName } from './icon'
import { cx } from './primitives'
import type { Tone } from './feedback'

const badgeTone: Record<Tone | 'neutral', string> = {
  neutral: 'bg-muted text-ink',
  info: 'bg-brand-subtle text-brand-ink',
  ok: 'bg-ok-subtle text-ok-ink',
  warn: 'bg-warn-subtle text-warn-ink',
  bad: 'bg-bad-subtle text-bad-ink',
}

type BadgeProps = ComponentPropsWithoutRef<'span'> & {
  tone?: Tone | 'neutral'
  icon?: IconName
}

/** Una marca chica que dice en qué estado está algo. */
export function Badge({ tone = 'neutral', icon, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex h-5 items-center gap-1 rounded-sm px-1.5 text-2xs font-semibold',
        badgeTone[tone],
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  )
}

type ProgressProps = ComponentPropsWithoutRef<'div'> & {
  value: number
  max?: number
  /** Qué mide, para quien no ve la barra. */
  label: string
  /** El número al costado. */
  hint?: ReactNode
  tone?: 'brand' | 'ok' | 'warn' | 'bad'
}

const fillTone = { brand: 'bg-brand', ok: 'bg-ok', warn: 'bg-warn', bad: 'bg-bad' }

/** Cuánto de algo va hecho. La pista es el resto, no un segundo dato. */
export function Progress({ value, max = 100, label, hint, tone = 'brand', className, ...props }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / (max || 1)) * 100))
  return (
    <div className={cx('flex flex-col gap-1.5', className)} {...props}>
      {(label || hint) && (
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs font-medium text-ink">{label}</span>
          {hint && <span className="tabular text-2xs font-medium text-ink-muted">{hint}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-1.5 w-full overflow-hidden rounded-full bg-track"
      >
        <div className={cx('h-full rounded-full transition-[width] duration-300 ease-out', fillTone[tone])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/** El hueco que ocupa algo que todavía está cargando. */
export function Skeleton({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      aria-hidden="true"
      className={cx('ui-pulse block rounded-md bg-track', className)}
      {...props}
    />
  )
}

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
