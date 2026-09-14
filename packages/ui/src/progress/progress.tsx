import s from './progress.module.css'
import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { cx } from '../lib/cx'

type ProgressProps = ComponentPropsWithoutRef<'div'> & {
  /** Lo hecho, en las unidades de max. */
  value: number
  /** El total contra el que se mide. */
  max?: number
  /** Qué mide, para quien no ve la barra. */
  label: string
  /** El número al costado. */
  hint?: ReactNode
  /** `brand` para lo que avanza y `ok` para lo que terminó; `warn` y `bad` solo cuando llenar la barra es el problema. */
  tone?: 'brand' | 'ok' | 'warn' | 'bad'
}

const fillTone = { brand: s.fillBrand, ok: s.fillOk, warn: s.fillWarn, bad: s.fillBad }

/** Cuánto de algo va hecho. La pista es el resto, no un segundo dato. */
export function Progress({ value, max = 100, label, hint, tone = 'brand', className, ...props }: ProgressProps) {
  const clamped = Math.min(max, Math.max(0, value))
  const pct = (clamped / (max || 1)) * 100
  const id = useId()
  return (
    <div className={cx(s.root, className)} {...props}>
      {(label || hint) && (
        <div className={s.header}>
          <span id={id} className={s.label}>{label}</span>
          {hint && <span className={`${s.hint} tabular`}>{hint}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-labelledby={id}
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={max}
        className={s.track}
      >
        <div className={cx(s.fill, fillTone[tone])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
