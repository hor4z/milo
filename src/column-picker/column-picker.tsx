import s from './column-picker.module.css'
import { Checkbox } from '../checkbox/checkbox'
import { IconButton } from '../icon-button/icon-button'
import { Popover } from '../popover/popover'
import { cx } from '../lib/cx'

type ColumnPickerProps = {
  /** Todas las columnas que la tabla puede mostrar, en el orden en que van. */
  columns: { id: string; label: string; locked?: boolean }[]
  /** Los ids de las que están a la vista. */
  value: string[]
  /** Recibe los ids de las columnas que quedan a la vista. */
  onValueChange: (v: string[]) => void
  /** Nombra el botón y encabeza el panel. */
  label?: string
  className?: string
}

/** Elegir qué columnas se ven. */
export function ColumnPicker({ columns, value, onValueChange, label = 'Columnas', className }: ColumnPickerProps) {
  const toggle = (id: string) =>
    onValueChange(value.includes(id) ? value.filter(x => x !== id) : [...value, id])

  return (
    <Popover
      align="end"
      width={220}
      trigger={({ onClick, ref, ...rest }) => (
        <IconButton
          ref={ref}
          onClick={onClick}
          {...rest}
          icon="view_column"
          label={label}
          size="sm"
          variant="muted"
          className={cx(s.root, className)}
        />
      )}
    >
      {() => (
        <div className={`${s.panel} ui-pop bg-popover`}>
          <p className={s.panelLabel}>{label}</p>
          {columns.map(c => (
            <label
              key={c.id}
              className={cx(
                s.option,
                c.locked ? s.locked : s.pickable,
              )}
            >
              <Checkbox
                label={c.label}
                checked={c.locked || value.includes(c.id)}
                onChange={() => !c.locked && toggle(c.id)}
                disabled={c.locked}
              />
              <span aria-hidden="true" className={s.optionLabel}>{c.label}</span>
            </label>
          ))}
        </div>
      )}
    </Popover>
  )
}
