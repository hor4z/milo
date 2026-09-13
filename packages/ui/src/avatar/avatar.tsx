import cls from './avatar.module.css'
import type { CSSProperties } from 'react'
import { markColors, markFill } from '../lib/colors'
import { cx } from '../lib/cx'

/** Dos estados y nada más: con foto, o el círculo pastel con la inicial. */
export function Avatar({ name, src, size = 40, className }: {
  /** De acá salen la inicial y el tinte. */
  name: string
  /** Opcional; la etiqueta de color queda de fondo. */
  /** Opcional; la etiqueta de color queda de fondo. */
  src?: string
  /** El diámetro en px; la inicial y el anillo salen de acá. */
  size?: number
  className?: string
}) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const i = [...name].reduce((a, c) => a + c.charCodeAt(0), 0)
  const fill = markFill[markColors[i % markColors.length]]
  return (
    <span
      className={cx(`${cls.span} mark`, fill, className)}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.3)), lineHeight: 1 }}
      aria-hidden="true"
    >
      {initials}
      {src && <img src={src} alt="" loading="lazy" decoding="async" className={cls.img} />}
    </span>
  )
}

/** Varias personas en el lugar de una. */
export function AvatarGroup({
  people, max = 3, size = 28, ring = 'var(--surface)', className,
}: {
  /** Sin `src` cae a la inicial. */
  /** Sin `src` cae a la inicial. */
  people: readonly { name: string; src?: string }[]
  /** Cuenta avatares, no personas. */
  /** Cuenta avatares, no personas. */
  max?: number
  /** El monte sale de acá. */
  /** El monte sale de acá. */
  size?: number
  /** El color del anillo, que tiene que ser el del fondo de atrás. */
  ring?: string
  className?: string
}) {
  const shown = people.length === max + 1 ? people : people.slice(0, max)
  const rest = people.length - shown.length
  const overlap = Math.round(size / 3)
  return (
    <span
      className={cx(cls.span2, className)}
      style={{ '--overlap': `${overlap}px`, '--ring': ring } as CSSProperties}
    >
      {shown.map((p, i) => (
        <Avatar
          key={`${p.name}-${i}`}
          name={p.name}
          src={p.src}
          size={size}
          className={cx('mark-ring', i > 0 && cls.box2)}
        />
      ))}
      {rest > 0 && (
        <span
          className={cls.span3}
          style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.3)), lineHeight: 1 }}
        >
          +{rest}
        </span>
      )}
      <span hidden>{people.map(p => p.name).join(', ')}</span>
    </span>
  )
}
