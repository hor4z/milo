import cls from './chip.module.css'
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
    box: cls.chipSizeSm,
    icon: 12,
    dot: cls.chipSizeSm2,
    cross: 12,
  },
  md: {
    box: cls.chipSizeMd,
    icon: 14,
    dot: cls.chipSizeMd2,
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
    cls.box,
    s.box,
    cls.box2,
    active
      ? cls.box3
      : color
        ? chipColor[color]
        : cls.box4,
    onClick && !active && (color ? cls.hoverRing : cls.hoverSunken),
    className,
  )

  const mark = dot
    ? <span aria-hidden="true" className={cx(s.dot, cls.span)} />
    : icon
      ? <Icon name={icon} size={s.icon} className={cls.icon} />
      : null

  const cross = onRemove && (
    <button type="button" onClick={onRemove} aria-label="Quitar" className={cls.button}>
      <Icon name="close" size={s.cross} />
    </button>
  )

  if (onClick && onRemove) {
    return (
      <span className={cx(box, cls.span2)} {...props}>
        <button type="button" onClick={onClick} className={cx(cls.button2, size === 'sm' ? cls.sm : cls.box5)}>
          {mark}
          <span className={cls.span3}>{children}</span>
        </button>
        {cross}
      </span>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={box} {...(props as ComponentPropsWithoutRef<'button'>)}>
        {mark}
        <span className={cls.span4}>{children}</span>
        {cross}
      </button>
    )
  }

  return (
    <span className={box} {...props}>
      {mark}
      <span className={cls.span5}>{children}</span>
      {cross}
    </span>
  )
}
