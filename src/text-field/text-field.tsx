import s from './text-field.module.css'
import type { InputHTMLAttributes, ReactNode, Ref } from 'react'
import { useField } from '../field/field'
import { Icon, type IconName } from '../icon/icon'
import { fieldSizes } from '../lib/control'
import { cx } from '../lib/cx'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** A la izquierda, en gris. */
  icon?: IconName
  /** A la derecha: una unidad, un kbd, un botón. */
  suffix?: ReactNode
  /** 32 · 36 · 40, las del Button. Default lg. */
  size?: 'sm' | 'md' | 'lg'
  /** Va al contenedor, que es lo que mide y lo que se enfoca. */
  ref?: Ref<HTMLDivElement>
  /** Va al `input` de adentro, para quien necesita enfocarlo desde afuera: un atajo de teclado. */
  inputRef?: Ref<HTMLInputElement>
}

/** El campo de texto. */
export function TextField({ icon, suffix, size = 'lg', className, ref, inputRef, ...rest }: TextFieldProps) {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20
  const field = useField()
  return (
    <div
      ref={ref}
      onPointerDown={e => {
        if ((e.target as HTMLElement).closest('button, a, input, textarea')) return
        e.preventDefault()
        e.currentTarget.querySelector('input')?.focus()
      }}
      className={cx(
        `${s.root} field`,
        s.disabled,
        fieldSizes[size], className,
      )}
    >
      {icon && <Icon name={icon} size={iconSize} className={`${s.icon} icon-muted`} />}
      <input
        ref={inputRef}
        className={cx(
          s.input,
          s.inputPad,
        )}
        {...field}
        {...rest}
      />
      {suffix}
    </div>
  )
}
