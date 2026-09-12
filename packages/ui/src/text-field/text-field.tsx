import type { InputHTMLAttributes, ReactNode, Ref } from 'react'
import { useField } from '../field/field'
import { Icon, type IconName } from '../icon/icon'
import { fieldSizes } from '../lib/control'
import { cx } from '../lib/cx'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  icon?: IconName
  suffix?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  /** Va al contenedor, que es lo que mide y lo que se enfoca. */
  ref?: Ref<HTMLDivElement>
}

/** El campo de texto. */
export function TextField({ icon, suffix, size = 'lg', className, ref, ...rest }: TextFieldProps) {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20
  const campo = useField()
  return (
    <div
      ref={ref}
      className={cx(
        'field flex cursor-text items-center border border-field-line bg-field',
        'has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-45',
        fieldSizes[size], className,
      )}
    >
      {icon && <Icon name={icon} size={iconSize} className="icon-muted shrink-0" />}
      <input
        className={cx(
          'h-full min-w-0 flex-1 bg-transparent font-normal text-ink outline-none placeholder:text-ink-muted',
          size === 'sm' ? '-mx-1.5 px-1.5' : '-mx-2 px-2',
        )}
        {...campo}
        {...rest}
      />
      {suffix}
    </div>
  )
}
