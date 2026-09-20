import cls from './spinner.module.css'
import { useId } from 'react'
import { cx } from '../lib/cx'

/** Pista completa más un arco encima. */
export function Spinner({ size = 20, label = 'Cargando', on = 'surface', className }: {
  /** El trazo lo sigue: 17% del diámetro. */
  size?: number
  /** Al aria-label; el rol es status. */
  label?: string
  /** Sobre qué está apoyado. `control` toma el color de lo que lo contiene, que es lo que lo hace servir en todas las variantes de botón sin enumerar ninguna. */
  on?: 'surface' | 'solid' | 'control'
  className?: string
}) {
  const gid = useId()
  const [edge, track] = on === 'solid'
    ? ['var(--solid)', 'color-mix(in oklab, var(--on-solid) 22%, transparent)']
    : on === 'control'
      ? ['var(--spinner-bg, var(--surface))', 'color-mix(in oklab, currentColor 22%, transparent)']
      : ['var(--surface)', 'var(--border-strong)']
  const w = Math.max((2 * 24) / size, 24 * 0.17)
  const rim = 0.85
  const e = w + rim * 2
  const r = (24 - e) / 2
  const arc = 40
  return (
    <span role="status" aria-label={label} className={cx(cls.root, className)}>
      <svg width={size} height={size} viewBox="0 0 24 24" className="spin" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0.5" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={on === 'control' ? 'currentColor' : 'var(--blue-400)'} />
            <stop offset="100%" stopColor={on === 'control' ? 'currentColor' : 'var(--blue-600)'} />
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
