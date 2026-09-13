import { useEffect, useState } from 'react'
import { useField } from '../field/field'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'

const acotar = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

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
  /** Lo que va después del número: «min», «pts». No se escribe ni se lee aparte. */
  suffix?: string
  disabled?: boolean
  width?: number
}) {
  const field = useField()
  const [texto, setTexto] = useState(String(value))
  useEffect(() => { setTexto(String(value)) }, [value])

  const poner = (n: number) => { if (!disabled) onChange(acotar(n, min, max)) }

  const teclas = (e: React.KeyboardEvent) => {
    const saltos: Record<string, number> = {
      ArrowUp: step, ArrowDown: -step, PageUp: salto, PageDown: -salto,
    }
    if (e.key in saltos) { e.preventDefault(); poner(value + saltos[e.key]); return }
    if (e.key === 'Home') { e.preventDefault(); poner(min) }
    if (e.key === 'End') { e.preventDefault(); poner(max) }
  }

  return (
    <div
      style={{ width }}
      className={cx(
        'field inline-flex h-9 items-center rounded-md border border-field-line bg-field',
        disabled && 'pointer-events-none opacity-45',
      )}
    >
      <Paso icon="remove" label={`Bajar${label ? ` ${label}` : ''}`} onClick={() => poner(value - step)} disabled={value <= min} />
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
        value={texto}
        onChange={e => {
          setTexto(e.target.value)
          const n = Number(e.target.value)
          if (e.target.value.trim() !== '' && Number.isFinite(n)) poner(n)
        }}
        onBlur={() => setTexto(String(value))}
        onKeyDown={teclas}
        className="tabular min-w-0 flex-1 bg-transparent text-center text-body font-medium text-ink outline-none"
      />
      {suffix && <span aria-hidden="true" className="shrink-0 pr-1 text-meta font-medium text-ink-muted">{suffix}</span>}
      <Paso icon="add" label={`Subir${label ? ` ${label}` : ''}`} onClick={() => poner(value + step)} disabled={value >= max} />
    </div>
  )
}

/** Uno de los dos botones. Va `aria-hidden` para el lector: el `spinbutton` del medio ya dice qué se puede hacer y con qué teclas. */
function Paso({ icon, label, onClick, disabled }: {
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
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-md transition-colors duration-fast ease-out hover:bg-field-hover disabled:opacity-40 disabled:hover:bg-transparent"
    >
      <Icon name={icon} size={16} className="icon-muted" />
    </button>
  )
}
