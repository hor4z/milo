import { useId, useState, type ReactNode } from 'react'
import { cx } from './primitives'

export type BarDatum = {
  /** Lo que va abajo de la barra. */
  label: string
  value: number
  /** Lo que el tooltip muestra además del valor: un porcentaje, un grupo de caras. */
  detail?: ReactNode
  /** La frase del tooltip, abajo del número. Sin esto se usa el `label`. */
  caption?: string
}

/**
 * El gráfico de barras.
 *
 * **Las barras de contexto van en tinta y la destacada en azul.** No es un
 * gradiente de azules: la interfaz es monocroma y el azul está reservado para
 * una cosa por pantalla, así que gastarlo en las cinco barras lo deja sin decir
 * nada — con todo azul, la que importa es apenas un azul más fuerte entre
 * azules. En gris, la llena se ve desde el otro lado de la habitación.
 *
 * Las de contexto igual suben de tono con la altura: el tamaño y el tono dicen
 * lo mismo, así que la comparación sobrevive a una impresión en blanco y negro y
 * a cualquier daltonismo. Por eso tampoco lleva leyenda: con una serie, el
 * título ya dice qué se está mirando, y una caja con un solo cuadradito repite
 * el título y ocupa lugar.
 *
 * **La barra destacada es el único azul lleno.** `highlight` no es decoración:
 * es la que la pantalla vino a contar —el día que más entregas tuvo, el que
 * estás comparando— y el resto queda de contexto. Es el mismo recurso que el
 * sistema usa en todos lados: lo activo se marca una vez y con fuerza, y lo
 * demás acompaña.
 *
 * **El tooltip es parte de la pieza, no un extra.** Un gráfico en HTML se
 * hoverea, y sin tooltip los valores exactos no existen en ningún lado. Acá
 * aparece sobre la barra, con el número primero y grande y la frase después en
 * gris: quien hoverea ya sabe qué categoría tocó —tiene el dedo encima— y lo que
 * fue a buscar es el número.
 *
 * **Y aparece igual con el teclado.** Cada barra es un `<button>` que se enfoca y
 * muestra lo mismo al enfocarse. Un dato que solo existe al pasar el mouse no
 * existe para quien no usa mouse.
 *
 * **Los valores viven también en una tabla, escondida pero real.** No es
 * ceremonia: un lector de pantalla no puede hoverear, y las alturas no son un
 * dato que se pueda leer. La tabla es la versión sin gráfico del mismo
 * contenido, y por eso el `<figure>` la referencia.
 */
export function BarChart({ data, highlight, title, height = 220, className }: {
  data: BarDatum[]
  /** El índice de la barra llena. Sin esto, ninguna se destaca. */
  highlight?: number
  /** Para el lector de pantalla y la tabla de abajo. */
  title: string
  height?: number
  className?: string
}) {
  const [activa, setActiva] = useState<number | null>(null)
  const tablaId = useId()
  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <figure className={cx('m-0', className)} aria-describedby={tablaId}>
      <div className="relative flex items-end gap-3" style={{ height }}>
        {data.map((d, i) => {
          const lleno = i === highlight
          const alto = Math.max(6, Math.round((d.value / max) * 100))
          /* El tono acompaña a la altura: más alta, más oscura. Es lo que hace
             que la comparación se lea aunque alguien no distinga colores —el
             tamaño y el tono dicen lo mismo— y lo que evita que una barra corta
             y una larga del mismo tono se vean como dos categorías.
             En tinta al 10-26%: más abajo no se despega del papel, más arriba
             compite con el texto de la tarjeta. */
          const opacidad = 0.10 + (d.value / max) * 0.16
          return (
            <button
              key={d.label}
              type="button"
              /* La barra entera es el blanco del mouse y del foco, no el
                 rectángulo pintado: el `<button>` ocupa la columna completa
                 —incluido el aire de arriba— así que apuntarle a una barra baja
                 no obliga a bajar hasta el piso. */
              className="chart-bar group relative flex h-full flex-1 cursor-default flex-col justify-end outline-none"
              onPointerEnter={() => setActiva(i)}
              onPointerLeave={() => setActiva(a => (a === i ? null : a))}
              onFocus={() => setActiva(i)}
              onBlur={() => setActiva(a => (a === i ? null : a))}
              aria-label={`${d.label}: ${d.value}`}
            >
              <span
                className={cx(
                  'w-full rounded-xl transition-[filter,box-shadow] duration-[120ms] ease-out',
                  /* El hover aclara en vez de teñir: cambiar el color de una
                     barra al pasarle el mouse hace que la que estás mirando deje
                     de valer lo mismo que las de al lado. */
                  lleno ? 'bg-brand group-hover:brightness-110' : 'group-hover:brightness-95',
                )}
                style={{
                  height: `${alto}%`,
                  ...(lleno ? null : { backgroundColor: `color-mix(in srgb, var(--text) ${opacidad * 100}%, transparent)` }),
                }}
              />
            </button>
          )
        })}

        {activa !== null && (
          <ChartTooltip
            datum={data[activa]}
            /* Anclado a su columna y no al puntero: siguiendo el mouse, el
               tooltip tiembla mientras te movés adentro de la misma barra y hay
               que perseguirlo con la vista para leer un número. */
            style={{
              left: `${((activa + 0.5) / data.length) * 100}%`,
              bottom: `${Math.max(6, Math.round((data[activa].value / max) * 100))}%`,
            }}
          />
        )}
      </div>

      <div className="mt-3 flex gap-3">
        {data.map((d, i) => (
          <div
            key={d.label}
            /* Todas en tinta, y la que importa un paso más pesada. En gris, una
               fila de etiquetas debajo de barras claras se lee como si el
               gráfico estuviera deshabilitado — y son el único texto que dice
               qué es cada barra, así que no acompañan a un dato: lo nombran. */
            className={cx(
              'flex-1 text-center text-xs text-ink transition-[font-weight]',
              i === activa || i === highlight ? 'font-bold' : 'font-semibold',
            )}
          >
            {d.label}
          </div>
        ))}
      </div>

      {/* La misma información sin gráfico. `sr-only` y no `hidden`: escondida
          para la vista, presente para un lector de pantalla. */}
      <table id={tablaId} className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {data.map(d => (
            <tr key={d.label}><th scope="row">{d.label}</th><td>{d.value}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

/**
 * La caja del tooltip.
 *
 * El filo azul de la izquierda es lo único que la ata al gráfico: sin él es una
 * tarjeta blanca flotando sobre cualquier cosa. Va del color de la serie, que es
 * el único lugar donde el color del dato entra en una superficie de texto.
 *
 * El número va primero y grande, y la frase abajo en gris. Es la jerarquía de un
 * tooltip al revés de la de una leyenda: acá el lector ya sabe qué tocó y lo que
 * fue a buscar es cuánto.
 */
function ChartTooltip({ datum, style }: { datum: BarDatum; style?: React.CSSProperties }) {
  return (
    <div
      role="tooltip"
      /* `pointer-events-none` o el tooltip se mete entre el mouse y la barra que
         explica, y el hover parpadea. `-translate-x-1/2` para centrarlo en su
         columna, y el margen de abajo lo despega del tope de la barra. */
      className="ui-fade pointer-events-none absolute z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-surface py-2 pr-3.5 pl-3 shadow-popover"
      style={style}
    >
      <span className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-brand" />
      <div className="flex items-center gap-2 pl-2">
        <span className="tabular text-base font-bold text-ink">{datum.value}</span>
        {datum.detail}
      </div>
      <div className="pl-2 text-2xs font-medium text-ink-muted">{datum.caption ?? datum.label}</div>
    </div>
  )
}
