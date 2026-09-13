import { useId, useMemo, useState } from 'react'
import { cx } from '../lib/cx'

export type LinePoint = {
  /** La posición en el eje de abajo. */
  x: number
  /** La posición en el eje de la izquierda. */
  y: number
}

export type LineSeries = {
  /** El nombre, que va en la leyenda y en la tabla. */
  label: string
  /** Ordenados por `x`. */
  points: LinePoint[]
}

/** Cuatro trazos y no más: con el quinto, la leyenda tarda más en leerse que el gráfico. Cada uno trae color y patrón porque el color no dice nada solo. */
const trazos = [
  { color: 'var(--label-blue)', dash: '', punto: 'circle' },
  { color: 'var(--label-orange)', dash: '7 4', punto: 'square' },
  { color: 'var(--label-teal)', dash: '2 4', punto: 'triangle' },
  { color: 'var(--label-purple)', dash: '10 3 2 3', punto: 'diamond' },
] as const

const CAJA = { w: 600, h: 300 }

function escala(v: number, min: number, max: number) {
  return max === min ? 0.5 : (v - min) / (max - min)
}

/** Los cortes del eje, en números redondos: siete etiquetas con decimales se leen peor que cuatro sin ellos. */
function cortes(min: number, max: number, cuantos: number) {
  if (max === min) return [min]
  const crudo = (max - min) / (cuantos - 1)
  const magnitud = 10 ** Math.floor(Math.log10(crudo))
  const paso = [1, 2, 2.5, 5, 10].map(m => m * magnitud).find(p => p >= crudo) ?? crudo
  const desde = Math.ceil(min / paso) * paso
  const out: number[] = []
  for (let v = desde; v <= max + paso / 1000; v += paso) out.push(Number(v.toFixed(10)))
  return out.length ? out : [min, max]
}

function marca(forma: string, color: string, x: number, y: number, r: number) {
  if (forma === 'square') return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} fill={color} />
  if (forma === 'triangle') return <polygon points={`${x},${y - r} ${x + r},${y + r} ${x - r},${y + r}`} fill={color} />
  if (forma === 'diamond') return <polygon points={`${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}`} fill={color} />
  return <circle cx={x} cy={y} r={r} fill={color} />
}

type LineChartProps = {
  /** Uno o cuatro. Cada uno trae su nombre y sus puntos. */
  series: LineSeries[]
  /** Para el lector de pantalla y para la tabla que va abajo, escondida. */
  title: string
  /** Qué mide el eje de abajo, con su unidad: `Tiempo (s)`. */
  xLabel?: string
  /** Qué mide el eje de la izquierda, con su unidad: `Posición (m)`. */
  yLabel?: string
  /** El alto del área de trazado, sin las etiquetas. */
  height?: number
  /** El eje de la izquierda arranca en cero. Con datos que se mueven poco, en `false` la variación se ve; en `true` no se exagera. */
  zeroY?: boolean
  className?: string
}

/** Cómo cambia algo a lo largo de otra cosa: una función, una medición en el tiempo, dos grupos comparados. */
export function LineChart({ series, title, xLabel, yLabel, height = 260, zeroY = false, className }: LineChartProps) {
  const tablaId = useId()
  const [i, setI] = useState(0)

  const { xs, minX, maxX, minY, maxY } = useMemo(() => {
    const todos = series.flatMap(s => s.points)
    const xs = [...new Set(todos.map(p => p.x))].sort((a, b) => a - b)
    const ys = todos.map(p => p.y)
    return {
      xs,
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: zeroY ? Math.min(0, ...ys) : Math.min(...ys),
      maxY: Math.max(...ys, zeroY ? 0 : -Infinity),
    }
  }, [series, zeroY])

  const px = (v: number) => escala(v, minX, maxX) * CAJA.w
  const py = (v: number) => CAJA.h - escala(v, minY, maxY) * CAJA.h
  const cortesY = cortes(minY, maxY, 5)
  const cortesX = cortes(minX, maxX, 6)

  const cursor = xs[Math.min(i, xs.length - 1)] ?? 0
  const enCursor = series.map(s => s.points.find(p => p.x === cursor)?.y)
  const leyenda = series.map((s, k) => `${s.label}: ${enCursor[k] ?? '—'}`).join('; ')

  return (
    <figure className={cx('m-0 flex flex-col gap-2', className)} aria-describedby={tablaId}>
      {series.length > 1 && (
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {series.map((s, k) => (
            <li key={s.label} className="flex items-center gap-2 text-meta font-medium text-ink-muted">
              <svg width="22" height="10" aria-hidden="true" className="shrink-0 overflow-visible">
                <line x1="0" y1="5" x2="22" y2="5" stroke={trazos[k % 4].color} strokeWidth="2" strokeDasharray={trazos[k % 4].dash} />
                {marca(trazos[k % 4].punto, trazos[k % 4].color, 11, 5, 3.5)}
              </svg>
              {s.label}
            </li>
          ))}
        </ul>
      )}

      {yLabel && <span className="text-meta text-ink-muted">{yLabel}</span>}

      <div className="flex gap-2">
        <div className="flex shrink-0 flex-col justify-between text-right tabular text-meta text-ink-muted" style={{ height }}>
          {[...cortesY].reverse().map(v => <span key={v} className="-translate-y-1/2 first:translate-y-0 last:-translate-y-full">{v}</span>)}
        </div>

        <div className="relative min-w-0 flex-1" style={{ height }}>
          <svg
            viewBox={`0 0 ${CAJA.w} ${CAJA.h}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            className="h-full w-full overflow-visible"
          >
            {cortesY.map(v => (
              <line key={v} x1="0" x2={CAJA.w} y1={py(v)} y2={py(v)} stroke="var(--border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            ))}
            <line x1={px(cursor)} x2={px(cursor)} y1="0" y2={CAJA.h} stroke="var(--border-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            {series.map((s, k) => (
              <polyline
                key={s.label}
                points={s.points.map(p => `${px(p.x)},${py(p.y)}`).join(' ')}
                fill="none"
                stroke={trazos[k % 4].color}
                strokeWidth="2"
                strokeDasharray={trazos[k % 4].dash}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {series.map((s, k) => {
            const p = s.points.find(q => q.x === cursor)
            if (!p) return null
            return (
              <span
                key={s.label}
                aria-hidden="true"
                className="pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${escala(p.x, minX, maxX) * 100}%`,
                  top: `${(1 - escala(p.y, minY, maxY)) * 100}%`,
                  background: trazos[k % 4].color,
                  boxShadow: '0 0 0 2px var(--surface)',
                }}
              />
            )
          })}

          <input
            type="range"
            min={0}
            max={Math.max(xs.length - 1, 0)}
            step={1}
            value={Math.min(i, xs.length - 1)}
            onChange={e => setI(Number(e.target.value))}
            aria-label={`${title}. Recorrer los valores`}
            aria-valuetext={`${xLabel ?? 'x'} ${cursor}. ${leyenda}`}
            className="absolute inset-0 h-full w-full cursor-col-resize appearance-none bg-transparent opacity-0 focus-visible:opacity-100 focus-visible:rounded-md focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
          />
        </div>
      </div>

      <div className="flex" style={{ marginLeft: 'calc(var(--spacing) * 2)' }}>
        <span className="w-0 shrink-0" />
        <div className="relative min-w-0 flex-1 h-4">
          {cortesX.map(v => {
            const pos = escala(v, minX, maxX) * 100
            return (
              <span
                key={v}
                className="absolute tabular text-meta text-ink-muted"
                // Centrada sobre su corte, salvo en los extremos: ahí la mitad
                // que sobresale empuja el ancho de la fila y desborda.
                style={{ left: `${pos}%`, transform: pos < 2 ? 'none' : pos > 98 ? 'translateX(-100%)' : 'translateX(-50%)' }}
              >
                {v}
              </span>
            )
          })}
        </div>
      </div>

      {xLabel && <figcaption className="text-right text-meta text-ink-muted">{xLabel}</figcaption>}

      <table id={tablaId} className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">{xLabel ?? 'x'}</th>
            {series.map(s => <th key={s.label} scope="col">{s.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {xs.map(x => (
            <tr key={x}>
              <th scope="row">{x}</th>
              {series.map(s => <td key={s.label}>{s.points.find(p => p.x === x)?.y ?? '—'}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
