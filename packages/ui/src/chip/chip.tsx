import type { ReactNode } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { type LabelColor, labelSoft } from '../lib/colors'
import { cx } from '../lib/cx'

/** El chip: 28 de alto y radio 10. Identifica —una categoría, una persona, un espacio—; si el texto cambia según lo que pasó, es un `Badge`. */
export function Chip({
  children, color, icon, dot, onRemove, active, onClick,
}: {
  children: ReactNode
  /** Uno de los seis tonos, en su par suave; sin esto va gris. */
  color?: LabelColor
  /** Un glifo adelante, del mismo tono que el texto. */
  icon?: IconName
  /** Un punto del tono en vez de un glifo: clasifica sin nombrar. */
  dot?: boolean
  /** Agrega la cruz. */
  onRemove?: () => void
  /** Pasa a tinta plena y pisa el color. */
  active?: boolean
  /** Lo convierte en <button>. */
  onClick?: () => void
}) {
  const box = cx(
    'inline-flex min-h-7 items-center gap-2 rounded-md px-2 text-body font-semibold',
    'transition-[background-color,color] duration-fast ease-out',
    active
      ? 'bg-solid text-on-solid'
      : color
        ? labelSoft[color]
        : 'bg-muted text-ink',
    onClick && !active && (color ? 'hover:brightness-95' : 'hover:bg-sunken'),
  )

  // Sin clase de color: heredan el del texto y se apagan con él cuando va activo.
  const mark = dot
    ? <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />
    : icon
      ? <Icon name={icon} size={14} className="-ml-0.5 shrink-0" />
      : null

  const cross = onRemove && (
    <button type="button" onClick={onRemove} aria-label="Quitar" className="-mr-0.5 rounded-sm p-0.5 hover:bg-active">
      <Icon name="close" size={12} />
    </button>
  )

  // Un chip que se toca y se saca son dos acciones, así que son dos botones
  // hermanos y no uno adentro del otro: anidados, el HTML es inválido y tocar
  // la cruz dispara también el click del chip.
  if (onClick && onRemove) {
    return (
      <span className={cx(box, 'pr-2')}>
        <button type="button" onClick={onClick} className="-my-1 -ml-1 flex items-center gap-2 rounded-sm py-1 pl-1">
          {mark}
          {children}
        </button>
        {cross}
      </span>
    )
  }

  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} className={box}>
      {mark}
      {children}
      {cross}
    </Tag>
  )
}
