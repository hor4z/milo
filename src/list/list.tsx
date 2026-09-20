import s from './list.module.css'
import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { takePart } from '../lib/parts'
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

/** El nombre de la fila, en 16/600. */
function Title({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** La línea de apoyo, en 14/500 gris. */
function Hint({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** A la derecha: un chevron, un `Switch`. Un contador no: el número ya está en el hint, y repetirlo al lado obliga a leer dos veces lo mismo. */
function Trailing({ children }: { children: ReactNode }) {
  return <>{children}</>
}

function Item({
  icon, color, active, onClick, children,
}: {
  /** El glifo de la marca de color. */
  icon: IconName
  /** El par relleno/glifo de la marca. */
  color: MarkColor
  /** La fila elegida: queda hundida, no teñida. */
  active?: boolean
  /** Sin esto la fila es un <div> y no toma hover. */
  onClick?: () => void
  /** El `List.Title`, el `List.Hint` si va y el `List.Trailing` si va. */
  children: ReactNode
}) {
  const [title, sinTitle] = takePart(children, Title)
  const [hint, sinHint] = takePart(sinTitle, Hint)
  const [trailing] = takePart(sinHint, Trailing)
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
        {hint.length > 0 && <span className={s.hint}>{hint}</span>}
      </span>

      {trailing.length > 0 && <span className={s.trailing}>{trailing}</span>}
    </Tag>
  )
}

export const List = Object.assign(Root, { Item, Title, Hint, Trailing })
