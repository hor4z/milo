import { useId } from 'react'
import { cx } from '../lib/cx'

/** Pista completa más un arco encima. */
export function Spinner({ size = 20, label = 'Cargando', on = 'surface', className }: {
  /** El trazo lo sigue: 17% del diámetro. */
  size?: number
  /** Al aria-label; el rol es status. */
  label?: string
  /** Sobre qué está apoyado. */
  on?: 'surface' | 'solid'
  className?: string
}) {
  const gid = useId()
  const [edge, track] = on === 'solid'
    ? ['var(--solid)', 'color-mix(in oklab, var(--on-solid) 22%, transparent)']
    : ['var(--surface)', 'var(--border-strong)']
  // El trazo, en unidades del viewBox. Como es una fracción del diámetro y el
  // viewBox es de 24, sale directo: no hay que deshacer la escala del svg
  // porque no hay ningún número en px de por medio.
  const w = Math.max((2 * 24) / size, 24 * 0.17)
  const rim = 0.85
  const e = w + rim * 2
  const r = (24 - e) / 2
  // `pathLength` normaliza la vuelta a 100, así el largo se escribe en por
  // ciento del anillo y no en unidades de un radio que cambia con el trazo.
  const arc = 40
  return (
    <span role="status" aria-label={label} className={cx('inline-flex', className)}>
      <svg width={size} height={size} viewBox="0 0 24 24" className="spin" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0.5" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--blue-400)" />
            <stop offset="100%" stopColor="var(--blue-600)" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r={r} fill="none" stroke={track} strokeWidth={w} />
        <g transform="rotate(-90 12 12)">
          <circle
            cx="12" cy="12" r={r} fill="none"
            stroke={edge} strokeWidth={e} strokeLinecap="round"
            pathLength={100} strokeDasharray={`${arc} ${100 - arc}`}
          />
          <circle
            cx="12" cy="12" r={r} fill="none"
            stroke={`url(#${gid})`} strokeWidth={w} strokeLinecap="round"
            pathLength={100} strokeDasharray={`${arc} ${100 - arc}`}
          />
        </g>
      </svg>
    </span>
  )
}
