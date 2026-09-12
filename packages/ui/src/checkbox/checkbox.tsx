import { useField } from '../field/field'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'

/** La caja de 18, la misma medida del pulgar del switch, así una fila con los dos no tiene dos tamaños de "marca". */
export function Checkbox({
  checked, onChange, label, disabled, id, indeterminate,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  disabled?: boolean
  id?: string
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
        'inline-flex size-[18px] shrink-0 items-center justify-center rounded-xs',
        'transition-[background-color,box-shadow] duration-[120ms] ease-out',
        'disabled:opacity-45 disabled:pointer-events-none',
        on ? 'bg-brand text-on-brand' : 'inset-relief bg-muted text-on-brand',
      )}
    >
      <span
        className={cx(
          'inline-flex transition-transform duration-[120ms] ease-out',
          on ? 'scale-100' : 'scale-0',
        )}
      >
        {indeterminate
          ? <span className="block h-0.5 w-2.5 rounded-full bg-current" />
          : <Icon name="check" size={14} weight={700} />}
      </span>
    </button>
  )
}
