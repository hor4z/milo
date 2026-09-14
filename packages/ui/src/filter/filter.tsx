import s from './filter.module.css'
import type { ComponentPropsWithoutRef } from 'react'
import { Avatar, AvatarGroup } from '../avatar/avatar'
import { Button } from '../button/button'
import { Checkbox } from '../checkbox/checkbox'
import { cx } from '../lib/cx'
import { Popover } from '../popover/popover'

/** La barra de arriba de una tabla: el buscador y los filtros, en una línea. */
export function FilterBar({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(s.bar, className)} {...props} />
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
  /** Recibe la lista nueva de valores elegidos. */
  onValueChange: (v: string[]) => void
}

/** Un filtro: un botón que dice qué filtra, y un panel para elegir. */
export function Filter({ label, options, value, onValueChange }: FilterProps) {
  const toggle = (v: string) =>
    onValueChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v])

  const faces = options.filter(o => o.person && value.includes(o.value)).map(o => o.person!)

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
          {faces.length > 0 && <AvatarGroup people={faces} size={18} max={3} ring="var(--brand)" className={s.barFaces} />}
          {label}{value.length > 0 && faces.length === 0 && ` · ${value.length}`}
        </Button>
      )}
    >
      {() => (
        <div className={`${s.panel} ui-pop bg-popover`}>
          {options.map(o => (
            <label
              key={o.value}
              className={cx(
                s.option,
                o.person ? s.personOption : s.plainOption,
              )}
            >
              <Checkbox
                label={o.count === undefined ? o.value : `${o.value}, ${o.count}`}
                checked={value.includes(o.value)}
                onChange={() => toggle(o.value)}
              />
              {o.person && <Avatar name={o.person.name} src={o.person.src} size={22} className={s.avatar} />}
              <span aria-hidden="true" className={s.optionLabel}>{o.value}</span>
              {o.count !== undefined && (
                <span aria-hidden="true" className={`${s.optionCount} tabular`}>{o.count}</span>
              )}
            </label>
          ))}
          {value.length > 0 && (
            <button
              type="button"
              onClick={() => onValueChange([])}
              className={s.clearAll}
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

export function facets<T>(rows: T[], of: (row: T) => string | undefined | null): Record<string, number> {
  const tally: Record<string, number> = {}
  for (const row of rows) {
    const k = of(row)
    if (k == null) continue
    tally[k] = (tally[k] ?? 0) + 1
  }
  return tally
}
