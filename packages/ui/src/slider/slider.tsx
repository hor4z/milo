import { useState, type CSSProperties } from 'react'
import { useField } from '../field/field'
import { cx } from '../lib/cx'

/** Un valor en un rango. */
export function Slider({
  value, onChange, min = 0, max = 100, step = 1, disabled, label, id, className,
}: {
  /** Es controlado. */
  value: number
  /** Recibe el número nuevo. */
  onChange: (v: number) => void
  /** El extremo de la izquierda. */
  min?: number
  /** El extremo de la derecha. */
  max?: number
  /** El salto entre dos valores. */
  step?: number
  /** Apagado no se arrastra ni recibe el foco. */
  disabled?: boolean
  /** Va al aria-label del input. */
  label?: string
  /** Para atarlo a una etiqueta de afuera. */
  id?: string
  /** El ancho se pone desde afuera. */
  className?: string
}) {
  const field = useField()
  const t = max === min ? 0 : Math.min(1, Math.max(0, (value - min) / (max - min)))
  const thumbAt = 'calc(var(--t) * (100% - 24px) + 12px)'
  const fillTo = 'calc(var(--t) * (100% - 24px) + 24px)'
  const [dragging, setDragging] = useState(false)
  const move = dragging ? '' : 'transition-[left,width] duration-[120ms] ease-out'
  return (
    <span
      className={cx('relative flex h-8 w-full min-w-[120px] items-center', disabled && 'opacity-45', className)}
      style={{ '--t': t } as CSSProperties}
    >
      <span className="switch-track-off pointer-events-none absolute inset-x-0 h-[22px] rounded-full" />
      <span
        className={cx('switch-track-on pointer-events-none absolute left-0 h-[22px] rounded-full', move)}
        style={{ width: fillTo }}
      />
      <input
        type="range"
        {...field}
        id={id ?? field.id}
        aria-label={field.id ? undefined : label}
        min={min} max={max} step={step} value={value}
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
        onPointerDown={() => setDragging(true)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onBlur={() => setDragging(false)}
        className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-default"
      />
      <span
        className={cx(
          'switch-thumb pointer-events-none absolute size-6 -translate-x-1/2 rounded-full',
          'flex items-center justify-center',
          move,
          'peer-focus-visible:shadow-[var(--switch-thumb-shadow),var(--focus-ring)]',
        )}
        style={{ left: thumbAt }}
      >
        <span
          className={cx(
            'size-3 rounded-full bg-brand transition-transform duration-[90ms] ease-out',
            dragging ? 'scale-[1.18]' : 'scale-100',
          )}
        />
      </span>
    </span>
  )
}
