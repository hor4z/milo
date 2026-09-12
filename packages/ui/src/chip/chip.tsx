import { type ReactNode } from 'react'
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
  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag
      onClick={onClick}
      className={cx(
        'inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold',
        'transition-[background-color,color,filter] duration-[120ms] ease-out',
        active
          ? 'bg-solid text-on-solid'
          : color
            ? cx(labelFill[color], 'text-on-label')
            : 'bg-muted text-ink',
        onClick && !active && (color ? 'hover:brightness-90' : 'hover:bg-sunken'),
      )}
    >
      {children}
      {onRemove && (
        <button onClick={onRemove} aria-label="Quitar" className="-mr-0.5 rounded-sm p-0.5 hover:bg-active">
          <Icon name="close" size={12} />
        </button>
      )}
    </Tag>
  )
}
