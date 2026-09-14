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
    box: cls.sizeSm,
    icon: 12,
    dot: cls.dotSm,
    cross: 12,
  },
  md: {
    box: cls.sizeMd,
    icon: 14,
    dot: cls.dotMd,
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
    cls.root,
    s.box,
    cls.motion,
    active
      ? cls.solid
      : color
        ? chipColor[color]
        : cls.plain,
    onClick && !active && (color ? cls.hoverRing : cls.hoverSunken),
    className,
  )

  const mark = dot
    ? <span aria-hidden="true" className={cx(s.dot, cls.dot)} />
    : icon
      ? <Icon name={icon} size={s.icon} className={cls.icon} />
      : null

  const cross = onRemove && (
    <button type="button" onClick={onRemove} aria-label="Quitar" className={cls.remove}>
      <Icon name="close" size={s.cross} />
    </button>
  )

  if (onClick && onRemove) {
    return (
      <span className={cx(box, cls.clickablePad)} {...props}>
        <button type="button" onClick={onClick} className={cx(cls.clickable, size === 'sm' ? cls.clickableGapSm : cls.clickableGapMd)}>
          {mark}
          <span className={cls.clickableLabel}>{children}</span>
        </button>
        {cross}
      </span>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={box} {...(props as ComponentPropsWithoutRef<'button'>)}>
        {mark}
        <span className={cls.labelText}>{children}</span>
        {cross}
      </button>
    )
  }

  return (
    <span className={box} {...props}>
      {mark}
      <span className={cls.removableLabel}>{children}</span>
      {cross}
    </span>
  )
}
