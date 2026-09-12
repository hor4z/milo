import { type ButtonHTMLAttributes, type Ref } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { control, variants } from '../lib/control'
import { cx } from '../lib/cx'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName
  /** Obligatorio: un botón que solo tiene un icono no dice nada sin esto. */
  label: string
  variant?: 'ghost' | 'raised' | 'solid' | 'muted'
  size?: 'sm' | 'md' | 'lg'
  /** El puntito de "hay algo nuevo", arriba a la derecha. */
  dot?: boolean
  active?: boolean
  ref?: Ref<HTMLButtonElement>
}

export function IconButton({
  icon, label, variant = 'ghost', size = 'md', dot, active, className, ...rest
}: IconButtonProps) {
  const c = control[size]
  return (
    <button
      aria-label={label}
      className={cx(
        'relative inline-flex items-center justify-center transition-[background-color,color,box-shadow] duration-[120ms] ease-out',
        'disabled:opacity-45 disabled:pointer-events-none',
        variants[variant === 'ghost' && active ? 'muted' : variant],
        c.square, 'rounded-md',
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={c.icon} />
      {dot && <span className={cx('absolute size-1.5 rounded-full bg-accent ring-2 ring-surface', c.dot)} />}
    </button>
  )
}
