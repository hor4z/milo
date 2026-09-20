import s from './checkbox.module.css'
import { useField } from '../lib/field-ctx'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'

/** La caja de 18, la misma medida del pulgar del switch, así una fila con los dos no tiene dos tamaños de "marca". */
export function Checkbox({
  checked, onChange, label, disabled, id, indeterminate,
}: {
  /** Es controlado: el estado lo lleva quien lo usa. */
  checked: boolean
  /** Recibe el valor nuevo, no el evento. */
  onChange: (v: boolean) => void
  /** Al aria-label; si va dentro de un <label>, se omite. */
  label?: string
  /** Apagado no se toca ni recibe el foco. */
  disabled?: boolean
  /** Para atarlo a una etiqueta de afuera. Adentro de un `Field` lo toma solo. */
  id?: string
  /** Pinta la raya y manda aria-checked="mixed". */
  indeterminate?: boolean
}) {
  const on = checked || indeterminate
  const field = useField()
  return (
    <button
      {...field}
      id={id ?? field.id}
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={field.id ? undefined : label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        s.root,
        s.motion,
        s.disabled,
        on ? s.on : s.off,
      )}
    >
      <span
        className={cx(
          s.glyph,
          on ? s.glyphOn : s.glyphOff,
        )}
      >
        {indeterminate
          ? <span className={s.dash} />
          : <Icon name="check" size={14} weight={700} />}
      </span>
    </button>
  )
}
