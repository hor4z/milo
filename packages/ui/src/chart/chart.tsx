import cls from './chart.module.css'
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
  /** Label, value (lo hecho), total, y opcionales detail y caption. */
  data: BarDatum[]
  /** El índice de la barra de la que habla la pantalla: le pesa la etiqueta. */
  highlight?: number
  /** Para el lector de pantalla y la tabla de abajo. */
  title: string
  /** El alto del área de barras, sin las etiquetas. */
  height?: number
  className?: string
}) {
  const [hover, setHover] = useState<number | null>(null)
  const [focused, setFocused] = useState<number | null>(null)
  const tableId = useId()
  const hatchId = `trama-${useId()}`
  const max = Math.max(...data.map(d => d.total), 1)

  return (
    <figure className={cx(cls.figure, className)} aria-describedby={tableId}>
      <svg width="0" height="0" aria-hidden="true" className={cls.svg}>
        <defs>
          <pattern id={hatchId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--text)" strokeWidth="1" strokeOpacity="0.18" />
          </pattern>
        </defs>
      </svg>

      <div className={cls.div} style={{ height }}>
        {data.map((d, i) => {
          const trackPct = Math.max(6, Math.round((d.total / max) * 100))
          const donePct = Math.min(100, Math.round((d.value / Math.max(d.total, 1)) * 100))
          return (
            <button
              key={i}
              type="button"
              className={`${cls.button} chart-bar group`}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(h => (h === i ? null : h))}
              onFocus={() => setFocused(i)}
              onBlur={() => setFocused(f => (f === i ? null : f))}
              aria-label={`${d.label}: ${d.value} de ${d.total}`}
            >
              <span
                className={cx(
                  cls.span,
                  cls.box,
                  cls.box2,
                  cls.box3,
                  cls.box4,
                )}
                style={{ height: `${trackPct}%` }}
              >
                <svg
                  aria-hidden="true"
                  className={cls.svg2}
                >
                  <rect width="100%" height="100%" fill={`url(#${hatchId})`} />
                </svg>
                <span
                  className={cls.span2}
                  style={{ height: `${donePct}%` }}
                />
              </span>

              {(hover === i || focused === i) && (
                <ChartTooltip
                  datum={d}
                  align={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'center'}
                  clamped={height * (1 - trackPct / 100) < 56}
                  style={{ bottom: `${trackPct}%` }}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className={cls.div2}>
        {data.map((d, i) => (
          <div
            key={i}
            className={cx(
              cls.div3,
              i === hover || i === focused || i === highlight ? cls.box5 : cls.box6,
            )}
          >
            {d.label}
          </div>
        ))}
      </div>

      <table id={tableId} className="sr-only">
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
function ChartTooltip({ datum, style, align = 'center', clamped }: {
  datum: BarDatum
  style?: React.CSSProperties
  align?: 'start' | 'center' | 'end'
  /** La barra llega arriba de todo: la caja se apoya adentro en vez de encima. */
  clamped?: boolean
}) {
  return (
    <div
      role="tooltip"
      className={cx(
        `${cls.div4} ui-fade bg-surface`,
        clamped ? cls.box7 : cls.box8,
        align === 'center' ? cls.center : align === 'end' ? cls.end : '',
      )}
      style={style}
    >
      <div className={cls.div5}>
        <span className={cls.span3} />
        <span className={`${cls.span4} tabular`}>{datum.value}</span>
        <span className={`${cls.span5} tabular`}>de {datum.total}</span>
        {datum.detail}
      </div>
      <div className={cls.div6}>{datum.caption ?? datum.label}</div>
    </div>
  )
}
