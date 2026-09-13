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

const fillTone = { brand: s.fillTone, ok: s.fillTone2, warn: s.fillTone3, bad: s.fillTone4 }

/** Cuánto de algo va hecho. La pista es el resto, no un segundo dato. */
export function Progress({ value, max = 100, label, hint, tone = 'brand', className, ...props }: ProgressProps) {
  const clamped = Math.min(max, Math.max(0, value))
  const pct = (clamped / (max || 1)) * 100
  const id = useId()
  return (
    <div className={cx(s.div, className)} {...props}>
      {(label || hint) && (
        <div className={s.div2}>
          <span id={id} className={s.span}>{label}</span>
          {hint && <span className={`${s.span2} tabular`}>{hint}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-labelledby={id}
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={max}
        className={s.box}
      >
        <div className={cx(s.div3, fillTone[tone])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
