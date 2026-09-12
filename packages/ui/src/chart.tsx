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
  /* El id del patrón sale de `useId` y no de una constante: dos gráficos en la
     misma pantalla con el mismo id hacen que el segundo apunte al `<pattern>`
     del primero, y si ese se desmonta, el rayado del que queda desaparece. */
  const tramaId = `trama-${useId().replace(/:/g, '')}`
  /* La escala sale del total más alto y no del valor más alto: si la altura la
     mandara lo hecho, un día con 4 de 4 dibujaría una barra más alta que uno con
     30 de 60, y el gráfico diría lo contrario de lo que pasó. */
  const max = Math.max(...data.map(d => d.total), 1)

  return (
    <figure className={cx('m-0', className)} aria-describedby={tablaId}>
      {/* Las defs viven en un svg de tamaño cero: un `<pattern>` no dibuja nada
          por su cuenta, solo lo referencian los rects de abajo por id. */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          {/* El tile lleva una sola línea vertical y el `patternTransform` lo
              gira 45°: dibujar la diagonal a mano adentro del cuadrado deja los
              extremos sin empalmar con el tile de al lado, y la trama se ve
              cortada en una cuadrícula. Rotando el patrón entero, las líneas
              siguen de largo. */}
          <pattern id={tramaId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--text)" strokeWidth="1" strokeOpacity="0.18" />
          </pattern>
        </defs>
      </svg>

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
                className={cx(
                  'relative w-full overflow-hidden rounded-xl bg-track',
                  /* El fondo plano se va en el hover y queda el rayado: lo que
                     falta deja de ser un bloque y pasa a ser una trama, que es
                     como se dibuja «esto todavía no está» sin agregar un color
                     nuevo. La transición va sobre el color y sobre la opacidad
                     de la trama, no sobre las dos capas a la vez, o se ve un
                     parpadeo en el cruce. */
                  'transition-colors duration-[140ms] ease-out group-hover:bg-transparent',
                  /* Y toma un contorno. Con el fondo yéndose y la trama
                     entrando, la barra se queda sin silueta justo en el momento
                     en que la estás señalando: el borde es lo que la sostiene
                     mientras el relleno se vacía. Va `inset` para que no empuje
                     ni se coma el aire que la separa de la de al lado. */
                  'group-hover:ring-1 group-hover:ring-line-strong group-hover:ring-inset',
                )}
                style={{ height: `${alto}%` }}
              >
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[140ms] ease-out group-hover:opacity-100"
                >
                  <rect width="100%" height="100%" fill={`url(#${tramaId})`} />
                </svg>
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
               que perseguirlo con la vista para leer un número.

               Y se recuesta contra el borde en las de las puntas. Centrado sobre
               la primera columna, la mitad izquierda de la caja cae afuera de la
               tarjeta: o se corta, o se sale por encima de lo que haya al lado.
               En las puntas se alinea por su borde en vez de por su centro, que
               es lo que hace cualquier menú anclado. */
            align={activa === 0 ? 'start' : activa === data.length - 1 ? 'end' : 'center'}
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
 * La marca azul de la izquierda es lo único que la ata al gráfico: sin ella es
 * una tarjeta blanca flotando sobre cualquier cosa. Va del color de la serie —el
 * único lugar donde el color del dato toca una superficie de texto— y es un
 * trazo corto en la línea del número, no un filo pegado al borde: un filo tiene
 * que seguir la curva de la caja para no verse torcido, y con el radio de un
 * tooltip no hay curva que seguir.
 *
 * El radio es el de un tooltip (10) y no el de un panel: una caja de dos
 * renglones con el radio de un menú se ve como una pastilla.
 *
 * El número va primero y grande, y la frase abajo en gris. Es la jerarquía de un
 * tooltip al revés de la de una leyenda: acá el lector ya sabe qué tocó y lo que
 * fue a buscar es cuánto.
 */
function ChartTooltip({ datum, style, align = 'center' }: {
  datum: BarDatum
  style?: React.CSSProperties
  align?: 'start' | 'center' | 'end'
}) {
  return (
    <div
      role="tooltip"
      /* `pointer-events-none` o el tooltip se mete entre el mouse y la barra que
         explica, y el hover parpadea. `-translate-x-1/2` para centrarlo en su
         columna, y el margen de abajo lo despega del tope de la barra. */
      className={cx(
        'ui-fade pointer-events-none absolute z-20 mb-2 whitespace-nowrap rounded-md bg-surface px-3 py-2 shadow-popover',
        /* El corrimiento se hace con `translate` y no con `left`: el `left` ya
           apunta al centro de la columna, así que moverlo de nuevo lo desancla
           de su barra. Acá solo se elige qué punto de la caja cae sobre esa
           línea. */
        align === 'center' ? '-translate-x-1/2' : align === 'end' ? '-translate-x-full' : '',
      )}
      style={style}
    >
      <div className="flex items-center gap-2">
        {/* Una marca corta del color de la serie y no un filo pegado al borde.
            El filo tenía que seguir la curva de la caja para no verse torcido, y
            con el radio chico de un tooltip no hay curva que seguir: quedaba un
            palito azul cortando una esquina. Esta marca va en la línea del
            número, que es lo que colorea. */}
        <span className="h-3 w-[3px] shrink-0 rounded-full bg-brand" />
        <span className="tabular text-base font-bold text-ink">{datum.value}</span>
        <span className="tabular text-2xs font-medium text-ink-muted">de {datum.total}</span>
        {datum.detail}
      </div>
      <div className="pl-[11px] text-2xs font-medium text-ink-muted">{datum.caption ?? datum.label}</div>
    </div>
  )
}
