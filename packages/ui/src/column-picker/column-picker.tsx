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
          className={cx('ml-auto', className)}
        />
      )}
    >
      {() => (
        <div className="ui-pop max-h-[320px] overflow-y-auto overscroll-contain rounded-xl border border-line bg-popover p-2 shadow-popover">
          <p className="px-2 pt-1 pb-2 text-label font-semibold text-ink">{label}</p>
          {columns.map(c => (
            <label
              key={c.id}
              className={cx(
                'flex h-9 items-center gap-2 rounded-lg px-2 transition-colors',
                c.locked ? 'cursor-default opacity-45' : 'cursor-pointer hover:bg-hover',
              )}
            >
              <Checkbox
                label={c.label}
                checked={c.locked || value.includes(c.id)}
                onChange={() => !c.locked && toggle(c.id)}
                disabled={c.locked}
              />
              <span aria-hidden="true" className="min-w-0 flex-1 truncate text-body font-medium text-ink">{c.label}</span>
            </label>
          ))}
        </div>
      )}
    </Popover>
  )
}

/** Cuántas filas caen en cada opción, que es el número que muestra el filtro. */
