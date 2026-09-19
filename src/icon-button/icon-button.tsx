import s from './icon-button.module.css'
import type { ButtonHTMLAttributes, Ref } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { control, variants } from '../lib/control'
import { cx } from '../lib/cx'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** El glifo, que es todo lo que se ve. */
  icon: IconName
  /** Un botón que solo tiene un icono no dice nada sin esto. */
  label: string
  /** Las del `Button` menos `bad`: un icono solo no alcanza para anunciar que algo se borra. */
  variant?: 'ghost' | 'solid' | 'muted' | 'brand'
  /** 36 · 40 · 44, los del Button. */
  size?: 'sm' | 'md' | 'lg'
  /** El puntito de "hay algo nuevo", adentro del botón. Para un contador o un glifo, `Indicator`. */
  dot?: boolean
  /** Solo cambia el ghost, que pasa a muted. */
  active?: boolean
  /** Para usarlo como disparador de un `Dropdown` o un `Popover`. */
  ref?: Ref<HTMLButtonElement>
}

export function IconButton({
  icon, label, variant = 'ghost', size = 'md', dot, active, type = 'button', className, ...rest
}: IconButtonProps) {
  const c = control[size]
  return (
    <button
      type={type}
      aria-label={label}
      className={cx(
        `${s.root} touch-target`,
        s.pressed,
        s.disabled,
        variants[variant === 'ghost' && active ? 'muted' : variant],
        c.square, s.radius,
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={c.icon} />
      {dot && <span className={cx(s.dot, c.dot)} />}
    </button>
  )
}
