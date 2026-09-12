import { type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { cx } from '../lib/cx'

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
