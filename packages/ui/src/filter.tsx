import type { ComponentPropsWithoutRef } from 'react'
import { Avatar, AvatarGroup, Button, Checkbox, IconButton, TextField, cx } from './primitives'
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

type FilterOption = {
  value: string
  /** En cuántas filas cae, contado sobre lo que los otros filtros dejaron. */
  count?: number
  /**
   * La persona, cuando el filtro es de personas. Con esto la opción se dibuja
   * con su cara y el botón muestra el grupo de las elegidas.
   */
  person?: { name: string; src?: string }
}

type FilterProps = {
  /** El rótulo: qué filtra. */
  label: string
  /** Las opciones, con cuántas filas cae en cada una. */
  options: FilterOption[]
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

  /* Las caras de las elegidas, en el orden en que están las opciones y no en el
     que se fueron tocando: el botón no se tiene que reordenar solo mientras
     elegís. */
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
          /* Puesto va en `brand` y no en `solid`: el azul es el color que el
             sistema ya usa para decir «esto está encendido» —el CTA, el arco del
             spinner, el anillo de foco— y un filtro puesto es exactamente eso.
             En tinta se confundía con un botón oscuro cualquiera, que acá no es
             lo que quiere decir: la fila de filtros no tiene un botón que manda,
             tiene botones que están o no están puestos. */
          variant={value.length ? 'brand' : 'muted'}
          size="sm"
          iconEnd="keyboard_arrow_down"
        >
          {/* Con personas, el grupo de caras reemplaza al contador: ya dice
              cuántas son —el `+2` de `AvatarGroup` cuenta el resto— y además
              dice cuáles, que es lo único que un filtro de personas necesita
              contestar de un vistazo. Un nombre no; tres nombres en un botón lo
              estiran hasta sacarlo de la barra.

              El anillo va del color del botón y no del papel: sobre el azul, el
              anillo blanco del default se ve como un halo recortado. */}
          {caras.length > 0 && <AvatarGroup people={caras} size={18} max={3} ring="ring-brand" className="-ml-0.5" />}
          {label}{value.length > 0 && caras.length === 0 && ` · ${value.length}`}
        </Button>
      )}
    >
      {() => (
        /* El techo es para el filtro de personas: los estados de una tabla son
           tres, pero las personas son todas las que haya, y sin él el panel se
           estira hasta cubrir la tabla que estás filtrando. `overscroll-contain`
           para que llegar al fondo de la lista no siga scrolleando la página
           —que además cerraría el panel, porque un scroll de la página lo
           cierra. */
        <div className="ui-pop max-h-[320px] overflow-y-auto overscroll-contain rounded-xl border border-line bg-popover p-1.5 shadow-popover">
          {options.map(o => (
            <label
              key={o.value}
              className={cx(
                'flex cursor-pointer items-center gap-2.5 rounded-lg px-2 transition-colors hover:bg-hover',
                /* La fila con cara va más alta: un avatar de 22 adentro de 36
                   toca arriba y abajo, y una lista de personas apretada se lee
                   como una sola mancha. */
                o.person ? 'h-10' : 'h-9',
              )}
            >
              <Checkbox checked={value.includes(o.value)} onChange={() => alternar(o.value)} />
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

type ColumnPickerProps = {
  /** Todas las columnas que la tabla puede mostrar, en el orden en que van. */
  columns: { id: string; label: string; locked?: boolean }[]
  /** Los ids de las que están a la vista. */
  value: string[]
  onValueChange: (v: string[]) => void
  label?: string
  className?: string
}

/**
 * Elegir qué columnas se ven.
 *
 * **No es un `Filter` con otro nombre**, aunque se dibujen parecido: un filtro
 * cambia qué filas hay y este cambia qué se muestra de cada una. Por eso no va
 * en la fila de filtros sino empujado a la esquina, y por eso no se apaga ni se
 * enciende — no hay un estado «sin columnas» que valga la pena avisar, siempre
 * hay algunas puestas.
 *
 * **Y por eso es un icono y no un botón con texto.** En la barra, lo que se lee
 * de izquierda a derecha son las condiciones de lo que estás mirando; esto es
 * una preferencia de cómo mirarlo, y con un rótulo del mismo peso se leería como
 * un filtro más.
 *
 * **Una columna puede venir `locked`.** La primera identifica la fila, y sin
 * ella queda una tabla de datos sin sujeto: números y estados que no se sabe de
 * qué son. Esa se muestra en la lista —para que se entienda que no es un olvido—
 * pero con su casilla apagada.
 */
export function ColumnPicker({ columns, value, onValueChange, label = 'Columnas', className }: ColumnPickerProps) {
  const alternar = (id: string) =>
    onValueChange(value.includes(id) ? value.filter(x => x !== id) : [...value, id])

  return (
    <Popover
      align="end"
      width={220}
      trigger={({ onClick, ref, ...rest }) => (
        /* El `ml-auto` va acá y no en el call site, por lo mismo que en la
           paginación: este control va contra la esquina cualquiera sea lo que
           haya a su izquierda, y que cada barra se acuerde de empujarlo es una
           forma de que en la tercera pantalla quede pegado a los filtros. */
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
