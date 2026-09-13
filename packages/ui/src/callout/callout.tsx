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
    // `role="note"` y no el `complementary` que un `aside` trae solo: una página
    // con once bloques destacados llenaba la lista de regiones con once entradas
    // y dejaba de servir para saltar. `note` dice lo mismo sin ser una región.
    <aside role="note" className={cx('flex gap-3 rounded-xl p-4', papel[color], className)}>
      {/* La misma caja que el `Alert`: alto de la primera línea y el glifo
          centrado adentro. Con un `mt-px` quedaba 1px arriba. */}
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
