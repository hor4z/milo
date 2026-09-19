import cls from './button.module.css'
import type { ButtonHTMLAttributes, Ref } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { control, variants } from '../lib/control'
import { cx } from '../lib/cx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Solid y brand son el mismo rol. */
  variant?: 'solid' | 'raised' | 'brand' | 'ghost' | 'muted' | 'bad' | 'yellow'
  /** 36 · 40 · 44. */
  size?: 'sm' | 'md' | 'lg'
  /** Antes del texto. */
  icon?: IconName
  /** Después del texto. */
  iconEnd?: IconName
  /** Ocupa el ancho del contenedor. */
  block?: boolean
  /** Para usarlo como disparador de Dropdown o Popover. */
  ref?: Ref<HTMLButtonElement>
}

export function Button({
  variant = 'raised', size = 'md', icon, iconEnd, block, type = 'button', className, children, ...rest
}: ButtonProps) {
  const c = control[size]
  return (
    <button
      type={type}
      className={cx(
        `${cls.root} touch-target`,
        cls.motion,
        cls.disabled,
        variants[variant], c.box, c.px, c.text, c.gap, c.radius, block && cls.block, className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={c.icon} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={c.icon} />}
    </button>
  )
}
