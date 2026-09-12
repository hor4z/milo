import type { ComponentPropsWithoutRef } from 'react'
import { Button, Checkbox, TextField, cx } from './primitives'
import { Icon } from './icon'
import { Popover } from './overlay'

/**
 * La barra de arriba de una tabla: el buscador y los filtros, en una línea.
 *
 * Envuelve en vez de posicionar a mano porque lo que importa es que todo lo que
 * filtra esté junto y antes de la tabla. Con los filtros repartidos —uno arriba,
 * otro en una columna, otro en un menú— nadie sabe qué está puesto, y una tabla
 * con menos filas de las esperadas parece un error de datos.
 */
export function FilterBar({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('flex flex-wrap items-center gap-2', className)} {...props} />
}

type FilterSearchProps = {
  value: string
  onValueChange: (v: string) => void
  placeholder?: string
  className?: string
}

/**
 * El buscador de la barra.
 *
 * Es un `TextField` con la lupa y, **cuando hay texto, una X para limpiar**. Esa
 * X es la parte que se olvida y la que más se usa: borrar a mano lo que
 * escribiste para volver a ver todo es el gesto más repetido de una tabla
 * filtrada, y con el campo vacío el botón no está —un control que no hace nada
 * ocupando lugar enseña a ignorar esa esquina.
 */
export function FilterSearch({ value, onValueChange, placeholder = 'Buscar…', className }: FilterSearchProps) {
  return (
    <TextField
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
            onClick={() => onValueChange('')}
            className="-mr-1 rounded-sm p-0.5 text-ink-muted transition-colors hover:bg-hover hover:text-ink"
          >
            <Icon name="close" size={14} />
          </button>
        )
        : undefined}
    />
  )
}

type FilterProps = {
  /** El rótulo: qué filtra. */
  label: string
  /** Las opciones, con cuántas filas cae en cada una. */
  options: { value: string; count?: number }[]
  /** Lo elegido. Un arreglo porque lo normal es querer dos estados a la vez. */
  value: string[]
  onValueChange: (v: string[]) => void
}

/**
 * Un filtro: un botón que dice qué filtra, y un panel para elegir.
 *
 * **Guarda un arreglo y no un valor.** Lo normal en una tabla de trabajo es
 * querer dos estados a la vez —«para mirar» y «sin terminar»— y un filtro de
 * valor único obliga a mirar dos veces la misma tabla.
 *
 * **El botón dice cuántas hay elegidas, no cuáles.** Con los valores escritos
 * adentro, el botón cambia de ancho en cada click y la barra entera se reacomoda
 * mientras elegís; y con tres elegidas ya no entran. El número no se mueve.
 *
 * **Cada opción muestra en cuántas filas cae**, y ese número se cuenta sobre lo
 * que los *otros* filtros ya dejaron: una opción que dice 4 deja 4, y una que
 * dice 0 lo avisa antes de que la toques. Contarlo sobre la tabla entera es lo
 * que hace que elijas una opción con 12 al lado y te queden 0 filas.
 *
 * El panel va sin velo: cuatro o cinco opciones no piden apagar el resto de la
 * pantalla, y la tabla de atrás es justamente lo que querés seguir viendo.
 */
export function Filter({ label, options, value, onValueChange }: FilterProps) {
  const alternar = (v: string) =>
    onValueChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v])

  return (
    <Popover
      align="start"
      width={220}
      trigger={({ onClick, ref, ...rest }) => (
        <Button
          ref={ref}
          onClick={onClick}
          {...rest}
          variant={value.length ? 'solid' : 'muted'}
          size="sm"
          iconEnd="keyboard_arrow_down"
        >
          {label}{value.length > 0 && ` · ${value.length}`}
        </Button>
      )}
    >
      {() => (
        <div className="ui-pop rounded-xl border border-line bg-popover p-1.5 shadow-popover">
          {options.map(o => (
            <label
              key={o.value}
              className="flex h-9 cursor-pointer items-center gap-2.5 rounded-lg px-2 transition-colors hover:bg-hover"
            >
              <Checkbox checked={value.includes(o.value)} onChange={() => alternar(o.value)} />
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

/**
 * El botón que devuelve la tabla a como estaba.
 *
 * Aparece solo cuando hay algo puesto, y es lo que evita la salida más cara de
 * una tabla filtrada: abrir filtro por filtro para acordarse de qué había en
 * cada uno.
 */
export function FilterReset({ className, children = 'Limpiar', ...props }: ComponentPropsWithoutRef<'button'>) {
  return (
    <Button type="button" variant="ghost" size="sm" className={className} {...props}>
      {children}
    </Button>
  )
}

/**
 * Cuántas filas caen en cada opción, que es el número que muestra el filtro.
 *
 * Se cuenta sobre las filas que le pasan, no sobre la tabla entera: quien lo
 * llama le pasa lo que los otros filtros ya dejaron, y ahí el número dice la
 * verdad. Es una función y no un hook porque no tiene estado — se recalcula con
 * las filas que haya, que es lo único de lo que depende.
 */
export function facets<T>(rows: T[], of: (row: T) => string | undefined | null): Record<string, number> {
  const cuenta: Record<string, number> = {}
  for (const row of rows) {
    const k = of(row)
    if (k == null) continue
    cuenta[k] = (cuenta[k] ?? 0) + 1
  }
  return cuenta
}
