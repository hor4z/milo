import { useId, useState, type ReactNode } from 'react'
import { cx } from '../lib/cx'

export type BarDatum = {
  /** Lo que va abajo de la barra. */
  label: string
  /** Lo hecho: la parte azul. */
  value: number
  /** Lo que había para hacer: el alto de la barra gris. */
  total: number
  /** Lo que el tooltip muestra además del número: un porcentaje, un grupo de caras. */
  detail?: ReactNode
  /** La frase del tooltip, abajo del número. */
  caption?: string
}

/** El gráfico de barras. */
export function BarChart({ data, highlight, title, height = 220, className }: {
  data: BarDatum[]
  /** El índice de la barra de la que habla la pantalla: le pesa la etiqueta. */
  highlight?: number
  /** Para el lector de pantalla y la tabla de abajo. */
  title: string
  height?: number
  className?: string
}) {
  const [hover, setHover] = useState<number | null>(null)
  const [foco, setFoco] = useState<number | null>(null)
  const tablaId = useId()
  const tramaId = `trama-${useId()}`
  const max = Math.max(...data.map(d => d.total), 1)

  return (
    <figure className={cx('m-0', className)} aria-describedby={tablaId}>
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <pattern id={tramaId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--text)" strokeWidth="1" strokeOpacity="0.18" />
          </pattern>
        </defs>
      </svg>

      <div className="relative flex items-end gap-3" style={{ height }}>
        {data.map((d, i) => {
          const alto = Math.max(6, Math.round((d.total / max) * 100))
          const hecho = Math.min(100, Math.round((d.value / Math.max(d.total, 1)) * 100))
          return (
            <button
              key={i}
              type="button"
              className="chart-bar group relative flex h-full flex-1 cursor-default flex-col justify-end outline-none"
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(h => (h === i ? null : h))}
              onFocus={() => setFoco(i)}
              onBlur={() => setFoco(f => (f === i ? null : f))}
              aria-label={`${d.label}: ${d.value} de ${d.total}`}
            >
              <span
                className={cx(
                  'relative w-full overflow-hidden rounded-xl bg-track',
                  'transition-colors duration-[140ms] ease-out group-hover:bg-transparent',
                  'group-hover:ring-1 group-hover:ring-line-strong group-hover:ring-inset',
                  // Con el teclado pasa lo mismo que con el mouse: la barra no
                  // lleva anillo de foco —se decidió así— así que lo que avisa
                  // dónde estás parado es la trama y el canto, más el globo.
                  'group-focus-visible:bg-transparent group-focus-visible:ring-1',
                  'group-focus-visible:ring-line-strong group-focus-visible:ring-inset',
                )}
                style={{ height: `${alto}%` }}
              >
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[140ms] ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <rect width="100%" height="100%" fill={`url(#${tramaId})`} />
                </svg>
                <span
                  className="absolute inset-x-0 bottom-0 rounded-xl bg-brand"
                  style={{ height: `${hecho}%` }}
                />
              </span>

              {(hover === i || foco === i) && (
                <ChartTooltip
                  datum={d}
                  align={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'center'}
                  dentro={height * (1 - alto / 100) < 56}
                  style={{ bottom: `${alto}%` }}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex gap-3">
        {data.map((d, i) => (
          <div
            key={i}
            className={cx(
              'flex-1 text-center text-xs text-ink transition-[font-weight]',
              i === hover || i === foco || i === highlight ? 'font-bold' : 'font-semibold',
            )}
          >
            {d.label}
          </div>
        ))}
      </div>

      <table id={tablaId} className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr><th scope="col">Categoría</th><th scope="col">Hecho</th><th scope="col">Total</th></tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}><th scope="row">{d.label}</th><td>{d.value}</td><td>{d.total}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

/** La caja del tooltip. */
function ChartTooltip({ datum, style, align = 'center', dentro }: {
  datum: BarDatum
  style?: React.CSSProperties
  align?: 'start' | 'center' | 'end'
  /** La barra llega arriba de todo: la caja se apoya adentro en vez de encima. */
  dentro?: boolean
}) {
  return (
    <div
      role="tooltip"
      className={cx(
        'ui-fade pointer-events-none absolute z-20 whitespace-nowrap rounded-md bg-surface px-3 py-2 shadow-popover',
        dentro ? 'translate-y-full -mb-2' : 'mb-2',
        align === 'center' ? '-translate-x-1/2' : align === 'end' ? '-translate-x-full' : '',
      )}
      style={style}
    >
      <div className="flex items-center gap-2">
        <span className="h-3 w-[3px] shrink-0 rounded-full bg-brand" />
        <span className="tabular text-base font-bold text-ink">{datum.value}</span>
        <span className="tabular text-2xs font-medium text-ink-muted">de {datum.total}</span>
        {datum.detail}
      </div>
      <div className="pl-[11px] text-2xs font-medium text-ink-muted">{datum.caption ?? datum.label}</div>
    </div>
  )
}
