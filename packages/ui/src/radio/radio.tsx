import s from './radio.module.css'
import type { Ref } from 'react'
import { cx } from '../lib/cx'
import { useRovingRadio } from '../lib/roving'

/** La elección de una entre varias. */
export function Radio({
  checked, onChange, label, disabled, id, tabIndex, ref,
}: {
  /** Es controlado. */
  checked: boolean
  /** Sin valor: el radio solo se prende. */
  onChange: () => void
  /** Va al `aria-label`. */
  label?: string
  /** Apagado no se elige ni recibe el foco. */
  disabled?: boolean
  /** Para atarlo a una etiqueta de afuera. */
  id?: string
  /** Lo pone `RadioGroup` para dejar una sola parada de tabulación. */
  tabIndex?: number
  /** Lo usa `RadioGroup` para mover el foco con las flechas. */
  ref?: Ref<HTMLButtonElement>
}) {
  return (
    <button
      ref={ref}
      id={id}
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      tabIndex={tabIndex}
      onClick={onChange}
      className={cx(
        s.root,
        s.box,
        s.box2,
        checked ? s.box3 : `${s.box4} inset-relief`,
      )}
    >
      <span
        className={cx(
          s.span,
          checked ? s.box5 : s.box6,
        )}
      />
    </button>
  )
}

/** El grupo va suelto: las opciones sobre el papel, cada una con su etiqueta al lado. */
export function RadioGroup<T extends string>({
  value, onChange, options, label, className,
}: {
  /** El valor elegido: es controlado. */
  value: T
  /** Recibe el valor nuevo. */
  onChange: (v: T) => void
  /** Las opciones, con su etiqueta. */
  options: readonly { value: T; label: string; disabled?: boolean }[]
  /** Al aria-label del grupo. */
  label?: string
  className?: string
}) {
  const roving = useRovingRadio(value, onChange, options)
  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={roving.onKeyDown}
      className={cx(s.div, className)}
    >
      {options.map(o => (
        <Radio
          key={o.value}
          ref={roving.ref(o.value)}
          checked={o.value === value}
          onChange={() => onChange(o.value)}
          label={o.label}
          disabled={o.disabled}
          tabIndex={roving.tabIndex(o.value)}
        />
      ))}
    </div>
  )
}
