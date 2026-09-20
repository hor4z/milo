import s from './list.module.css'
import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { markFill, type MarkColor } from '../lib/colors'
import { Icon, type IconName } from '../icon/icon'

/** La lista de acciones: filas altas, cada una con una marca de color, un título y una línea de apoyo. */

export type { MarkColor } from '../lib/colors'

function Root({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx(s.root, className)}>
      {children}
    </div>
  )
}

function Item({
  icon, color, title, hint, active, onClick, trailing,
}: {
  /** El glifo de la marca de color. */
  icon: IconName
  /** El par relleno/glifo de la marca. */
  color: MarkColor
  /** · 16/600. */
  title: string
  /** 14/500 en gris. */
  hint?: string
  /** La fila elegida: queda hundida, no teñida. */
  active?: boolean
  /** Sin esto la fila es un <div> y no toma hover. */
  onClick?: () => void
  /** A la derecha: un chevron, un `Switch`. Un contador no: el número ya está en `hint`, y repetirlo al lado obliga a leer dos veces lo mismo. */
  trailing?: ReactNode
}) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={cx(
        s.item,
        s.motion,
        active ? s.sunken : `${s.lifted} bg-surface`,
        onClick && !active && s.active,
      )}
    >
      <span className={cx(`${s.swatch} mark`, markFill[color])}>
        <Icon name={icon} size={22} weight={400} />
      </span>

      <span className={s.body}>
        <span className={s.title}>{title}</span>
        {hint && <span className={s.hint}>{hint}</span>}
      </span>

      {trailing && <span className={s.trailing}>{trailing}</span>}
    </Tag>
  )
}

export const List = Object.assign(Root, { Item })
