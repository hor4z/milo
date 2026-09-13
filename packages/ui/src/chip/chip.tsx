import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { type LabelColor, labelSoft } from '../lib/colors'
import { cx } from '../lib/cx'
import { type Tone, toneClass } from '../lib/tone'

/** El color de un chip: uno de los seis de categoría, o uno de los cuatro de estado. Los nombres no se pisan, así que es una sola prop. */
export type ChipColor = LabelColor | Tone

const chipColor: Record<ChipColor, string> = { ...labelSoft, ...toneClass }

const chipSize = {
  sm: {
    box: 'min-h-5 gap-1 rounded-sm px-2 text-meta font-semibold',
    icon: 12,
    dot: 'size-1',
    cross: 12,
  },
  md: {
    box: 'min-h-7 gap-2 rounded-md px-2 text-body',
    icon: 14,
    dot: 'size-1.5',
    cross: 12,
  },
} as const

type ChipProps = Omit<ComponentPropsWithoutRef<'span'>, 'color' | 'onClick'> & {
  children: ReactNode
  /** Uno de los seis de categoría o uno de los cuatro de estado; sin esto va gris. */
  color?: ChipColor
  /** `sm` es la marca pegada a un título; `md` es la etiqueta de una fila de filtros. */
  size?: 'sm' | 'md'
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
}

/** La marca chica de texto: el estado de una actividad, el nombre de una categoría, de un método o de una persona. */
export function Chip({
  children, color, size = 'md', icon, dot, onRemove, active, onClick, className, ...props
}: ChipProps) {
  const s = chipSize[size]
  const box = cx(
    'inline-flex max-w-full shrink-0 items-center whitespace-nowrap',
    s.box,
    'transition-[background-color,color] duration-fast ease-out',
    active
      ? 'bg-solid font-semibold text-on-solid'
      : color
        ? chipColor[color]
        : 'bg-muted text-ink',
    onClick && !active && (color ? 'hover:ring-2 hover:ring-current/25' : 'hover:bg-sunken'),
    className,
  )

  const mark = dot
    ? <span aria-hidden="true" className={cx(s.dot, 'shrink-0 rounded-full bg-current')} />
    : icon
      ? <Icon name={icon} size={s.icon} className="-ml-0.5 shrink-0" />
      : null

  const cross = onRemove && (
    <button type="button" onClick={onRemove} aria-label="Quitar" className="-mr-0.5 rounded-sm p-0.5 hover:bg-active">
      <Icon name="close" size={s.cross} />
    </button>
  )

  if (onClick && onRemove) {
    return (
      <span className={cx(box, 'pr-2')} {...props}>
        <button type="button" onClick={onClick} className={cx('-my-1 -ml-1 flex min-w-0 items-center rounded-sm py-1 pl-1', size === 'sm' ? 'gap-1' : 'gap-2')}>
          {mark}
          <span className="truncate">{children}</span>
        </button>
        {cross}
      </span>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={box} {...(props as ComponentPropsWithoutRef<'button'>)}>
        {mark}
        <span className="truncate">{children}</span>
        {cross}
      </button>
    )
  }

  return (
    <span className={box} {...props}>
      {mark}
      <span className="truncate">{children}</span>
      {cross}
    </span>
  )
}
