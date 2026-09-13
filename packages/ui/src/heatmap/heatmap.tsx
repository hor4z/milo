import { useId } from 'react'
import { cx } from '../lib/cx'
import { useSideScroll } from '../lib/side-scroll'

export type HeatRow = {
  /** Quién o qué es la fila: una persona, un curso, una semana. */
  label: string
  /** Un índice de `levels` por columna, o `null` si no hay dato. */
  values: (number | null)[]
}

/** Una grilla de niveles: filas contra columnas, con el nivel en cada cruce. */
export function Heatmap({ title, columns, rows, levels, empty = 'Sin datos', className }: {
  /** De qué es la grilla. Va como `caption` y lo lee un lector de pantalla al entrar. */
  title: string
  /** Los encabezados de arriba. Cortos: la columna mide lo que mide el más largo. */
  columns: string[]
  /** Una fila por persona, con un valor por columna. */
  rows: HeatRow[]
  /** Los niveles en orden, del más bajo al más alto. El valor de una celda es su índice. */
  levels: string[]
  /** Cómo se llama la ausencia de dato, que no es el nivel más bajo. */
  empty?: string
  className?: string
}) {
  const capId = useId()
  const { ref, scrolls } = useSideScroll<HTMLDivElement>(rows)

  return (
    // La pieza trae su propia superficie, como la `Table` y a diferencia de los
    // gráficos: la columna de nombres se queda fija al desplazarse de costado, y
    // algo fijo necesita un fondo opaco que sea siempre el mismo.
    <figure className={cx('m-0 overflow-hidden rounded-md bg-surface ring-1 ring-line', className)}>
      <div
        ref={ref}
        tabIndex={scrolls ? 0 : undefined}
        role={scrolls ? 'region' : undefined}
        aria-labelledby={scrolls ? capId : undefined}
        className="overflow-x-auto py-4 pr-4"
      >
        <table className="border-separate border-spacing-1">
          <caption id={capId} className="sr-only">{title}</caption>
          <thead>
            <tr>
              {/* La esquina va como `td` y no como `th`: un encabezado vacío se anuncia
                  igual y no nombra nada. */}
              <td className="sticky left-0 z-10 bg-surface pl-4" />
              {columns.map(c => (
                <th key={c} scope="col" className="px-1 pb-1 text-center align-bottom text-meta font-medium text-ink-muted">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.label}>
                <th scope="row" className="sticky left-0 z-10 bg-surface pr-4 pl-4 text-left text-body font-medium whitespace-nowrap text-ink">
                  {r.label}
                </th>
                {r.values.map((v, i) => (
                  <td key={i} className="p-0">
                    <Cell value={v} levels={levels} empty={empty} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Afuera del desplazamiento: la leyenda es lo que traduce los tonos y
          tiene que seguir a la vista cuando la grilla se corrió. */}
      <div className="border-t border-line px-4 py-3">
        <Legend levels={levels} empty={empty} />
      </div>
    </figure>
  )
}

/** El cruce: el nivel se lee por el alto y por el tono, y está escrito. */
function Cell({ value, levels, empty }: { value: number | null; levels: string[]; empty: string }) {
  // El principio del sistema es que el color nunca dice algo solo, así que el
  // nivel sube el relleno y el tono a la vez — igual que una barra de gráfico.
  // En blanco y negro, o con cualquier daltonismo, el alto sigue diciéndolo.
  const alto = value == null ? 0 : nivelAlto(value, levels.length)
  return (
    <span className="relative flex h-8 w-full min-w-8 items-end overflow-hidden rounded-md bg-track">
      {value == null
        ? <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-meta text-ink-subtle">–</span>
        : (
          <span
            aria-hidden="true"
            className="w-full rounded-md bg-brand"
            style={{ height: `${alto}%`, opacity: nivelTono(value, levels.length) }}
          />
        )}
      <span className="sr-only">{value == null ? empty : levels[value]}</span>
    </span>
  )
}

/** Qué quiere decir cada tono, en el mismo orden en que crecen. */
function Legend({ levels, empty }: { levels: string[]; empty: string }) {
  return (
    <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {levels.map((l, i) => (
        <span key={l} className="flex items-center gap-2 text-meta font-medium text-ink-muted">
          <span className="flex h-4 w-4 items-end overflow-hidden rounded-sm bg-track">
            <span
              className="w-full rounded-sm bg-brand"
              style={{ height: `${nivelAlto(i, levels.length)}%`, opacity: nivelTono(i, levels.length) }}
            />
          </span>
          {l}
        </span>
      ))}
      <span className="flex items-center gap-2 text-meta font-medium text-ink-muted">
        <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-track text-meta text-ink-subtle">–</span>
        {empty}
      </span>
    </figcaption>
  )
}

/* El nivel más bajo no arranca en cero: un relleno de un cuarto y casi
   transparente se veía igual que la celda vacía, y son dos cosas distintas —
   una es «todavía no empezó» y la otra «no hay dato». Arranca en un tercio del
   alto y en la mitad del tono, que es lo mínimo que se lee como algo. */
const nivelAlto = (i: number, n: number) => 34 + 66 * (i / Math.max(n - 1, 1))
const nivelTono = (i: number, n: number) => 0.45 + 0.55 * (i / Math.max(n - 1, 1))
