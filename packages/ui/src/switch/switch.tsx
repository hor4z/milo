import s from './switch.module.css'
import { useField } from '../field/field'
import { cx } from '../lib/cx'

/** El switch: pista de 40×22 con 2 de padding, así que el pulgar es de 18 y viaja 18 exactos. */
export function Switch({
  checked, onChange, label, disabled, id,
}: {
  /** Es controlado: el estado lo lleva quien lo usa. */
  checked: boolean
  /** Recibe el valor nuevo, no el evento. */
  onChange: (v: boolean) => void
  /** Va al `aria-label`. Adentro de un `Field` o de un `Row` sobra: el nombre sale de la etiqueta. */
  label?: string
  /** Apagado no se toca ni recibe el foco. */
  disabled?: boolean
  /** Para atarlo a una etiqueta de afuera. Adentro de un `Field` lo toma solo. */
  id?: string
}) {
  const field = useField()
  return (
    <button
      {...field}
      id={id ?? field.id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={field.id ? undefined : label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        s.root,
        s.box,
        s.box2,
        checked ? 'switch-track-on' : 'switch-track-off',
      )}
    >
      <span
        className={cx(
          `${s.span} switch-thumb`,
          s.span2,
          checked ? s.box5 : s.box6,
        )}
      />
    </button>
  )
}
