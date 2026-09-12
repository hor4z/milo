import { useId, useState, type ReactNode } from 'react'
import { cx } from './primitives'

export type BarDatum = {
  /** Lo que va abajo de la barra. */
  label: string
  /** Lo hecho: la parte azul. */
  value: number
  /** Lo que había para hacer: el alto de la barra gris. */
  total: number
  /** Lo que el tooltip muestra además del número: un porcentaje, un grupo de caras. */
  detail?: ReactNode
  /** La frase del tooltip, abajo del número. Sin esto se usa el `label`. */
  caption?: string
}

/**
 * El gráfico de barras.
 *
 * **Cada barra son dos cosas: el gris es el total y el azul es lo hecho.** No
 * son dos series compitiendo —es una parte adentro de su todo— y por eso el azul
 * va *dentro* del gris y no al lado: apoyados uno junto al otro habría que
 * compararlos con la vista para saber cuánto falta, y metido adentro, lo que
 * falta es el gris que se ve arriba.
 *
 * El gris del fondo va claro a propósito: es la pista, no un dato que compita.
 * Si pesa lo mismo que el relleno, la barra se lee como dos bloques apilados en
 * vez de como un progreso.
 *
 * **Todas las barras llevan azul**, así que el azul acá no señala una: mide. Es
 * la excepción a la regla monocroma que el sistema ya tiene para el progreso —la
 * misma de un `Meter`— y se defiende sola porque el color es la medida, no un
 * adorno puesto encima.
 *
 * Tampoco lleva leyenda: dos partes que se explican con una frase —«de 48»— no
 * necesitan una caja con dos cuadraditos al costado.
 *
 * **`highlight` ya no pinta, resalta el nombre.** Con todas las barras llevando
 * azul, marcar una con color no queda disponible: lo que hace es poner su
 * etiqueta un paso más pesada, que alcanza para decir «esta es de la que
 * estamos hablando» sin agregar un tercer tono a la barra.
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
  /** El índice de la barra de la que habla la pantalla: le pesa la etiqueta. */
  highlight?: number
  /** Para el lector de pantalla y la tabla de abajo. */
  title: string
  height?: number
  className?: string
}) {
  const [activa, setActiva] = useState<number | null>(null)
  const tablaId = useId()
  /* La escala sale del total más alto y no del valor más alto: si la altura la
     mandara lo hecho, un día con 4 de 4 dibujaría una barra más alta que uno con
     30 de 60, y el gráfico diría lo contrario de lo que pasó. */
  const max = Math.max(...data.map(d => d.total), 1)

  return (
    <figure className={cx('m-0', className)} aria-describedby={tablaId}>
      <div className="relative flex items-end gap-3" style={{ height }}>
        {data.map((d, i) => {
          const alto = Math.max(6, Math.round((d.total / max) * 100))
          /* El relleno se mide contra SU total y no contra el máximo: es cuánto
             de lo suyo hizo. Medido contra el máximo, un día chico y completo
             mostraría un relleno corto y parecería que le falta. */
          const hecho = Math.min(100, Math.round((d.value / Math.max(d.total, 1)) * 100))
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
              aria-label={`${d.label}: ${d.value} de ${d.total}`}
            >
              <span
                /* `overflow-hidden` para que el relleno tome la curva de la
                   pista: sin eso, el azul dibuja sus propias esquinas adentro y
                   quedan dos radios distintos en la misma barra. */
                className="relative w-full overflow-hidden rounded-xl bg-track transition-[filter] duration-[120ms] ease-out group-hover:brightness-95"
                style={{ height: `${alto}%` }}
              >
                <span
                  className="absolute inset-x-0 bottom-0 rounded-xl bg-brand"
                  style={{ height: `${hecho}%` }}
                />
              </span>
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
              bottom: `${Math.max(6, Math.round((data[activa].total / max) * 100))}%`,
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
            <tr key={d.label}><th scope="row">{d.label}</th><td>{d.value}</td><td>{d.total}</td></tr>
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
        <span className="tabular text-2xs font-medium text-ink-muted">de {datum.total}</span>
        {datum.detail}
      </div>
      <div className="pl-2 text-2xs font-medium text-ink-muted">{datum.caption ?? datum.label}</div>
    </div>
  )
}
