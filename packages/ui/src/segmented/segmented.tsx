import s from './segmented.module.css'
import { Icon, type IconName } from '../icon/icon'
import { useFieldGroup } from '../field/field'
import { cx } from '../lib/cx'
import { useRovingRadio } from '../lib/roving'
import { Tooltip } from '../tooltip/tooltip'

type SegmentedOption<T extends string> = {
  value: T
  /** Con `label` la opción es de texto; sin él, cuadrada con solo el icono. */
  label?: string
  icon?: IconName
  dot?: boolean
  /** En las opciones que solo tienen icono: es su nombre y su ayuda. */
  title?: string
  disabled?: boolean
}

/** Un solo segmented para todo: el de texto ("Todas · Abiertas") y el de iconos (grilla · lista) son el mismo componente con distintas opciones. */
export function Segmented<T extends string>({
  value, onChange, options, size = 'md', label,
}: {
  /** La opción elegida: es controlado. */
  value: T
  /** Recibe el valor nuevo. */
  onChange: (v: T) => void
  /** Sin label la opción queda cuadrada, solo icono, y title pasa a obligatorio. */
  options: SegmentedOption<T>[]
  /** Xs va con pista transparente: dentro del header de un panel, una pista gris sobre fondo gris agrega una caja que no hace falta. */
  size?: 'xs' | 'sm' | 'md'
  /** Cómo se llama el grupo. Adentro de un `Field` lo toma de la etiqueta. */
  label?: string
}) {
  const roving = useRovingRadio(value, onChange, options)
  const group = useFieldGroup()

  return (
    <div
      role="radiogroup"
      aria-label={label}
      {...(label ? {} : group)}
      onKeyDown={roving.onKeyDown}
      className={cx(
        s.root,
        size === 'xs' ? s.xs : s.box,
        size === 'sm' && s.box2,
        size === 'md' && s.box3,
      )}
    >
      {options.map(o => {
        const active = o.value === value
        const iconOnly = !o.label && !!o.icon
        const option = (
          <button
            key={o.value}
            ref={roving.ref(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={iconOnly ? o.title : undefined}
            disabled={o.disabled}
            tabIndex={roving.tabIndex(o.value)}
            onClick={() => onChange(o.value)}
            className={cx(
              s.box4,
              s.box5,
              s.box6,
              size === 'xs' ? s.xs2 : size === 'sm' ? s.sm : s.box7,
              iconOnly
                ? (size === 'xs' ? s.iconOnlyXs : size === 'sm' ? s.iconOnlySm : s.iconOnlyMd)
                : (size === 'xs' ? s.padXs : size === 'sm' ? s.padSm : s.padMd),
              active
                ? (size === 'xs' ? s.activeXs : s.active)
                : s.box8,
            )}
          >
            {o.icon && <Icon name={o.icon} size={size === 'md' ? 20 : 18} />}
            {o.label}
            {o.dot && <span className={s.span} />}
          </button>
        )
        return iconOnly && o.title
          ? <Tooltip key={o.value} label={o.title}>{option}</Tooltip>
          : option
      })}
    </div>
  )
}
