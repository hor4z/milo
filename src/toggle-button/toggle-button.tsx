import s from './toggle-button.module.css'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { control } from '../lib/control'
import { cx } from '../lib/cx'

/** Un botón que queda hundido: dice en qué estado está algo, no que algo pasó. El `aria-pressed` es lo que lo separa de un `Button`, y es lo que hace que un lector anuncie "activado". */
export function ToggleButton({
  pressed, onPressedChange, icon, size = 'md', label, className, children, ...rest
}: Omit<ComponentPropsWithoutRef<'button'>, 'onChange'> & {
  /** Hundido o no. Es controlado: el estado lo guarda quien lo usa. */
  pressed: boolean
  /** Recibe el estado nuevo. */
  onPressedChange?: (pressed: boolean) => void
  /** El glifo, antes del texto o solo. */
  icon?: IconName
  /** La escalera de siempre. */
  size?: 'sm' | 'md' | 'lg'
  /** Obligatorio cuando adentro solo hay un glifo: sin esto el botón no dice nada. */
  label?: string
  children?: ReactNode
}) {
  const c = control[size]
  const soloIcono = !children
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={soloIcono ? label : undefined}
      data-size={size}
      onClick={() => onPressedChange?.(!pressed)}
      className={cx(
        `${s.root} touch-target`,
        s.motion,
        s.disabled,
        pressed ? s.on : s.off,
        c.radius,
        soloIcono ? c.square : `${c.box} ${c.px} ${c.text} ${c.gap}`,
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={c.icon} />}
      {children}
    </button>
  )
}
