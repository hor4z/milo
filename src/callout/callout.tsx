import s from './callout.module.css'
import type { ReactNode } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { labelSoft, type LabelColor } from '../lib/colors'
import { cx } from '../lib/cx'
import { takePart } from '../lib/parts'

type CalloutProps = {
  /** El glifo de la izquierda. Elegilo por lo que dice el bloque, no por el color. */
  icon?: IconName
  /** El color del papel. Sale de la familia de categorías y no de los tonos de estado: un bloque de contenido no está avisando de nada. */
  color?: LabelColor | 'neutral'
  children: ReactNode
  className?: string
}

const paper: Record<LabelColor | 'neutral', string> = {
  neutral: s.neutral,
  ...labelSoft,
}

function Title({ children }: { children: ReactNode }) {
  return <span className={s.title}>{children}</span>
}

function Root({ icon, color = 'neutral', children, className }: CalloutProps) {
  const [title, texto] = takePart(children, Title)
  return (
    <aside role="note" className={cx(s.root, paper[color], className)}>
      {icon && (
        <span className={s.icon}>
          <Icon name={icon} size={20} />
        </span>
      )}
      <div className={s.body}>
        {title}
        <div className={s.text}>{texto}</div>
      </div>
    </aside>
  )
}

/** Un bloque de contenido que pide detenerse: una aclaración, una pista, algo para recordar. */
export const Callout = Object.assign(Root, { Title })
