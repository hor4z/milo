import type { ButtonHTMLAttributes, Ref } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { control, variants } from '../lib/control'
import { cx } from '../lib/cx'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** El glifo, que es todo lo que se ve. */
  icon: IconName
  /** Un botón que solo tiene un icono no dice nada sin esto. */
  label: string
  /** La misma escalera del `Button`, sin `brand` ni `bad`. */
  variant?: 'ghost' | 'raised' | 'solid' | 'muted'
  /** 32 · 36 · 40, los del Button. */
  size?: 'sm' | 'md' | 'lg'
  /** El puntito de «hay algo nuevo», adentro del botón. Para un contador o un glifo, `Indicator`. */
  dot?: boolean
  /** Solo cambia el ghost, que pasa a muted. */
  active?: boolean
  /** Círculo en vez de cuadrado con las esquinas redondeadas. Para el botón que manda de una pieza de medios. */
  round?: boolean
  /** Para usarlo como disparador de un `Dropdown` o un `Popover`. */
  ref?: Ref<HTMLButtonElement>
}

export function IconButton({
  icon, label, variant = 'ghost', size = 'md', dot, active, round, type = 'button', className, ...rest
}: IconButtonProps) {
  const c = control[size]
  return (
    <button
      type={type}
      aria-label={label}
      className={cx(
        'relative inline-flex items-center justify-center transition-[background-color,color,box-shadow] duration-fast ease-out',
        'disabled:opacity-45 disabled:pointer-events-none',
        variants[variant === 'ghost' && active ? 'muted' : variant],
        // El radio es 10 y no el 12 del Button: sobre un cuadrado de 32, esos dos
        // píxeles de más se comen tanto lado plano que la pieza se lee redonda.
        // El radio va acá y no en el `className` de quien lo usa: `rounded-full`
        // se genera antes que `rounded-md`, así que pasarlo de afuera pierde.
        c.square, round ? 'rounded-full' : 'rounded-md',
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={c.icon} />
      {dot && <span className={cx('absolute size-1.5 rounded-full bg-accent ring-2 ring-surface', c.dot)} />}
    </button>
  )
}
