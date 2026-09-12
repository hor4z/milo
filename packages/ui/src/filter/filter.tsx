import { useRef, type ComponentPropsWithoutRef } from 'react'
import { Avatar, AvatarGroup } from '../avatar/avatar'
import { Button } from '../button/button'
import { Checkbox } from '../checkbox/checkbox'
import { IconButton } from '../icon-button/icon-button'
import { TextField } from '../text-field/text-field'
import { cx } from '../lib/cx'
import { Icon } from '../icon/icon'
import { Popover } from '../popover/popover'

/** La barra de arriba de una tabla: el buscador y los filtros, en una línea. */
export function FilterBar({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('flex flex-wrap items-center gap-2', className)} {...props} />
}

type FilterSearchProps = {
  value: string
  onValueChange: (v: string) => void
  placeholder?: string
  className?: string
}

/** El buscador de la barra. */
export function FilterSearch({ value, onValueChange, placeholder = 'Buscar…', className }: FilterSearchProps) {
  const campo = useRef<HTMLDivElement>(null)
  return (
    <TextField
      ref={campo}
      size="sm"
      icon="search"
      value={value}
      onChange={e => onValueChange(e.target.value)}
      placeholder={placeholder}
      className={cx('w-[240px]', className)}
      suffix={value
        ? (
          <button
            type="button"
            aria-label="Limpiar la búsqueda"
            onClick={() => {
              onValueChange('')
              // La X se desmonta al vaciarse: sin esto el foco se cae al <body>.
              campo.current?.querySelector('input')?.focus()
            }}
            className="-mr-1 rounded-sm p-0.5 text-ink-muted transition-colors hover:bg-hover hover:text-ink"
          >
            <Icon name="close" size={14} />
          </button>
        )
        : undefined}
    />
  )
}

type FilterOption = {
  value: string
  /** En cuántas filas cae, contado sobre lo que los otros filtros dejaron. */
  count?: number
  /** La persona, cuando el filtro es de personas. */
  person?: { name: string; src?: string }
}

type FilterProps = {
  /** El rótulo: qué filtra. */
  label: string
  /** Las opciones, con cuántas filas cae en cada una. */
  options: FilterOption[]
  /** Lo elegido. */
  value: string[]
  onValueChange: (v: string[]) => void
}

/** Un filtro: un botón que dice qué filtra, y un panel para elegir. */
export function Filter({ label, options, value, onValueChange }: FilterProps) {
  const alternar = (v: string) =>
    onValueChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v])

  const caras = options.filter(o => o.person && value.includes(o.value)).map(o => o.person!)

  return (
    <Popover
      align="start"
      width={220}
      trigger={({ onClick, ref, ...rest }) => (
        <Button
          ref={ref}
          onClick={onClick}
          {...rest}
          variant={value.length ? 'brand' : 'muted'}
          size="sm"
          iconEnd="keyboard_arrow_down"
        >
          {caras.length > 0 && <AvatarGroup people={caras} size={18} max={3} ring="ring-brand" className="-ml-0.5" />}
          {label}{value.length > 0 && caras.length === 0 && ` · ${value.length}`}
        </Button>
      )}
    >
      {() => (
        <div className="ui-pop max-h-[320px] overflow-y-auto overscroll-contain rounded-xl border border-line bg-popover p-1.5 shadow-popover">
          {options.map(o => (
            <label
              key={o.value}
              className={cx(
                'flex cursor-pointer items-center gap-2.5 rounded-lg px-2 transition-colors hover:bg-hover',
                o.person ? 'h-10' : 'h-9',
              )}
            >
              <Checkbox label={o.value} checked={value.includes(o.value)} onChange={() => alternar(o.value)} />
              {o.person && <Avatar name={o.person.name} src={o.person.src} size={22} className="shrink-0" />}
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{o.value}</span>
              {o.count !== undefined && (
                <span className="tabular shrink-0 text-2xs font-medium text-ink-muted">{o.count}</span>
              )}
            </label>
          ))}
          {value.length > 0 && (
            <button
              type="button"
              onClick={() => onValueChange([])}
              className="mt-1 flex h-8 w-full items-center rounded-lg px-2 text-xs font-medium text-ink-muted transition-colors hover:bg-hover hover:text-ink"
            >
              Quitar este filtro
            </button>
          )}
        </div>
      )}
    </Popover>
  )
}

/** El botón que devuelve la tabla a como estaba. */
export function FilterReset({ className, children = 'Limpiar', ...props }: ComponentPropsWithoutRef<'button'>) {
  return (
    <Button type="button" variant="ghost" size="sm" className={className} {...props}>
      {children}
    </Button>
  )
}

type ColumnPickerProps = {
  /** Todas las columnas que la tabla puede mostrar, en el orden en que van. */
  columns: { id: string; label: string; locked?: boolean }[]
  /** Los ids de las que están a la vista. */
  value: string[]
  onValueChange: (v: string[]) => void
  label?: string
  className?: string
}

/** Elegir qué columnas se ven. */
export function ColumnPicker({ columns, value, onValueChange, label = 'Columnas', className }: ColumnPickerProps) {
  const alternar = (id: string) =>
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
        <div className="ui-pop max-h-[320px] overflow-y-auto overscroll-contain rounded-xl border border-line bg-popover p-1.5 shadow-popover">
          <p className="px-2 pt-1 pb-1.5 text-2xs font-semibold tracking-wide text-ink">{label}</p>
          {columns.map(c => (
            <label
              key={c.id}
              className={cx(
                'flex h-9 items-center gap-2.5 rounded-lg px-2 transition-colors',
                c.locked ? 'cursor-default opacity-45' : 'cursor-pointer hover:bg-hover',
              )}
            >
              <Checkbox
                label={c.label}
                checked={c.locked || value.includes(c.id)}
                onChange={() => !c.locked && alternar(c.id)}
                disabled={c.locked}
              />
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{c.label}</span>
            </label>
          ))}
        </div>
      )}
    </Popover>
  )
}

/** Cuántas filas caen en cada opción, que es el número que muestra el filtro. */
export function facets<T>(rows: T[], of: (row: T) => string | undefined | null): Record<string, number> {
  const cuenta: Record<string, number> = {}
  for (const row of rows) {
    const k = of(row)
    if (k == null) continue
    cuenta[k] = (cuenta[k] ?? 0) + 1
  }
  return cuenta
}
