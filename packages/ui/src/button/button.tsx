import type { ButtonHTMLAttributes, Ref } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { control, variants } from '../lib/control'
import { cx } from '../lib/cx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'raised' | 'brand' | 'ghost' | 'muted' | 'bad'
  size?: 'sm' | 'md' | 'lg'
  icon?: IconName
  iconEnd?: IconName
  block?: boolean
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
        'inline-flex items-center justify-center font-semibold whitespace-nowrap',
        'transition-[background-color,color,box-shadow,filter] duration-[120ms] ease-out',
        'disabled:opacity-45 disabled:pointer-events-none',
        variants[variant], c.box, c.px, c.text, c.gap, c.radius, block && 'w-full', className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={c.icon} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={c.icon} />}
    </button>
  )
}
