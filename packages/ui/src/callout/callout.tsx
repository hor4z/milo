import type { ReactNode } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { labelSoft, type LabelColor } from '../lib/colors'
import { cx } from '../lib/cx'

type CalloutProps = {
  /** El glifo de la izquierda. Elegilo por lo que dice el bloque, no por el color. */
  icon?: IconName
  /** El color del papel. Sale de la familia de categorías y no de los tonos de estado: un bloque de contenido no está avisando de nada. */
  color?: LabelColor | 'neutral'
  /** La primera línea, en negrita. Sin esto el bloque arranca directo con el texto. */
  title?: string
  children: ReactNode
  className?: string
}

const papel: Record<LabelColor | 'neutral', string> = {
  neutral: 'bg-muted text-ink-muted',
  ...labelSoft,
}

/** Un bloque de contenido que pide detenerse: una aclaración, una pista, algo para recordar. */
export function Callout({ icon, color = 'neutral', title, children, className }: CalloutProps) {
  return (
    <aside role="note" className={cx('flex gap-3 rounded-xl p-4', papel[color], className)}>
      {icon && (
        <span className="flex h-6 w-5 shrink-0 items-center justify-center">
          <Icon name={icon} size={20} />
        </span>
      )}
      <div className="flex min-w-0 flex-col gap-1 text-ink">
        {title && <span className="text-reading font-semibold">{title}</span>}
        <div className="text-reading">{children}</div>
      </div>
    </aside>
  )
}
