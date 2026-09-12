import type { ReactNode } from 'react'
import { Icon } from '../icon/icon'
import { type LabelColor, labelFill } from '../lib/colors'
import { cx } from '../lib/cx'

/** El chip: 28 de alto y radio 10. */
export function Chip({
  children, color, onRemove, active, onClick,
}: {
  children: ReactNode
  color?: LabelColor
  onRemove?: () => void
  active?: boolean
  onClick?: () => void
}) {
  const box = cx(
    'inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold',
    'transition-[background-color,color,filter] duration-[120ms] ease-out',
    active
      ? 'bg-solid text-on-solid'
      : color
        ? cx(labelFill[color], 'text-on-label')
        : 'bg-muted text-ink',
    onClick && !active && (color ? 'hover:brightness-90' : 'hover:bg-sunken'),
  )

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
      <span className={cx(box, 'pr-1.5')}>
        <button type="button" onClick={onClick} className="-my-1 -ml-1 rounded-sm py-1 pl-1">
          {children}
        </button>
        {cross}
      </span>
    )
  }

  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} className={box}>
      {children}
      {cross}
    </Tag>
  )
}
