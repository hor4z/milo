import cls from './stepper.module.css'
import { useEffect, useState } from 'react'
import { useField } from '../field/field'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

/** Un número chico que se sube y se baja: cuántos intentos, cuántas preguntas, una nota. */
export function Stepper({
  value, onChange, min = 0, max = 99, step = 1, salto = 10, label, suffix, disabled, width = 132,
}: {
  /** El número. */
  value: number
  /** Recibe el número nuevo, siempre dentro de `min` y `max`. */
  onChange: (v: number) => void
  min?: number
  max?: number
  /** Cuánto suben las flechas y los botones. */
  step?: number
  /** Cuánto suben Re Pág y Av Pág: para llegar lejos sin apretar veinte veces. */
  salto?: number
  /** De qué es el número. Sin esto lo pone el `Field` de alrededor. */
  label?: string
  /** Lo que va después del número: "min", "pts". No se escribe ni se lee aparte. */
  suffix?: string
  disabled?: boolean
  width?: number
}) {
  const field = useField()
  const [text, setTexto] = useState(String(value))
  useEffect(() => { setTexto(String(value)) }, [value])

  const commit = (n: number) => { if (!disabled) onChange(clamp(n, min, max)) }

  const onKey = (e: React.KeyboardEvent) => {
    const jumps: Record<string, number> = {
      ArrowUp: step, ArrowDown: -step, PageUp: salto, PageDown: -salto,
    }
    if (e.key in jumps) { e.preventDefault(); commit(value + jumps[e.key]); return }
    if (e.key === 'Home') { e.preventDefault(); commit(min) }
    if (e.key === 'End') { e.preventDefault(); commit(max) }
  }

  return (
    <div
      style={{ width }}
      className={cx(
        `${cls.root} field touch-target`,
        disabled && cls.disabled,
      )}
    >
      <Step icon="remove" label={`Bajar${label ? ` ${label}` : ''}`} onClick={() => commit(value - step)} disabled={value <= min} />
      <input
        {...field}
        role="spinbutton"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={suffix ? `${value} ${suffix}` : undefined}
        inputMode="numeric"
        disabled={disabled}
        value={text}
        onChange={e => {
          setTexto(e.target.value)
          const n = Number(e.target.value)
          if (e.target.value.trim() !== '' && Number.isFinite(n)) commit(n)
        }}
        onBlur={() => setTexto(String(value))}
        onKeyDown={onKey}
        className={`${cls.input} tabular`}
      />
      {suffix && <span aria-hidden="true" className={cls.suffix}>{suffix}</span>}
      <Step icon="add" label={`Subir${label ? ` ${label}` : ''}`} onClick={() => commit(value + step)} disabled={value >= max} />
    </div>
  )
}

/** Uno de los dos botones. Va `aria-hidden` para el lector: el `spinbutton` del medio ya dice qué se puede hacer y con qué teclas. */
function Step({ icon, label, onClick, disabled }: {
  icon: 'add' | 'remove'
  label: string
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`${cls.step} touch-target`}
    >
      <Icon name={icon} size={16} className="icon-muted" />
    </button>
  )
}
