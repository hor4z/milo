import cls from './stepper.module.css'
import { useEffect, useState, type KeyboardEvent } from 'react'
import { useField } from '../lib/field-ctx'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'
import { fieldSizes } from '../lib/control'

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

/** Un número chico que se sube y se baja: cuántos intentos, cuántas preguntas, una nota. */
export function Stepper({
  value, onChange, min = 0, max = 99, step = 1, pageStep = 10,
  label, suffix, size = 'md', disabled, width,
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
  pageStep?: number
  /** De qué es el número. Sin esto lo pone el `Field` de alrededor. */
  label?: string
  /** Lo que va después del número: "min", "pts". No se escribe ni se lee aparte. */
  suffix?: string
  /** La misma escalera que el resto de los campos. */
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  /** Sin esto se ajusta al número más largo que puede entrar. */
  width?: number
}) {
  const field = useField()
  const [text, setText] = useState(String(value))
  useEffect(() => { setText(String(value)) }, [value])

  const commit = (n: number) => { if (!disabled) onChange(clamp(n, min, max)) }

  const onKey = (e: KeyboardEvent) => {
    const saltos: Record<string, number> = {
      ArrowUp: step, ArrowDown: -step, PageUp: pageStep, PageDown: -pageStep,
    }
    if (e.key in saltos) { e.preventDefault(); commit(value + saltos[e.key]); return }
    if (e.key === 'Home') { e.preventDefault(); commit(min) }
    if (e.key === 'End') { e.preventDefault(); commit(max) }
  }

  // el hueco del número se mide por el máximo que puede entrar, no por el que hay
  const digitos = Math.max(String(min).length, String(max).length)

  return (
    <div
      style={width ? { width } : undefined}
      className={cx(`${cls.root} field`, fieldSizes[size], cls.flush, disabled && cls.disabled)}
    >
      <Step
        icon="remove"
        label={`Bajar${label ? ` ${label}` : ''}`}
        onClick={() => commit(value - step)}
        disabled={disabled || value <= min}
      />
      <span className={cls.value}>
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
          size={digitos}
          style={width ? undefined : { width: `${digitos}ch` }}
          onChange={e => {
            setText(e.target.value)
            const n = Number(e.target.value)
            if (e.target.value.trim() !== '' && Number.isFinite(n)) commit(n)
          }}
          onBlur={() => setText(String(value))}
          onKeyDown={onKey}
          className={`${cls.input} tabular`}
        />
        {suffix && <span aria-hidden="true" className={cls.suffix}>{suffix}</span>}
      </span>
      <Step
        icon="add"
        label={`Subir${label ? ` ${label}` : ''}`}
        onClick={() => commit(value + step)}
        disabled={disabled || value >= max}
      />
    </div>
  )
}

/** Uno de los dos botones. No para en el tabulador: el número del medio ya es el `spinbutton`, y las flechas hacen lo mismo. */
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
      className={cx(cls.step, cls.stepMotion)}
    >
      <Icon name={icon} size={16} className="icon-muted" />
    </button>
  )
}
