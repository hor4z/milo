import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, CSSProperties, InputHTMLAttributes, ReactNode, Ref, TextareaHTMLAttributes } from 'react'
import { useEscape } from './esc'
import { Portal } from './overlay'
import { Icon, type IconName } from './icon'
import { useField } from './form'

/** La familia viva de lo chico: un chip, la inicial de un avatar, el cuadradito de icono de una tarjeta. */
export const labelFill = {
  green: 'bg-label-green',
  teal: 'bg-label-teal',
  blue: 'bg-label-blue',
  purple: 'bg-label-purple',
  pink: 'bg-label-pink',
  orange: 'bg-label-orange',
} as const

export type LabelColor = keyof typeof labelFill

/** La otra familia: pares relleno/glifo, pastel con el glifo del mismo tono varios pasos más oscuro. */
export const markFill = {
  green: 'bg-mark-green text-mark-green-ink',
  purple: 'bg-mark-purple text-mark-purple-ink',
  orange: 'bg-mark-orange text-mark-orange-ink',
  blue: 'bg-mark-blue text-mark-blue-ink',
  pink: 'bg-mark-pink text-mark-pink-ink',
} as const

export type MarkColor = keyof typeof markFill

/** Las cinco en orden de rueda, para quien elige por hash. */
export const markColors = Object.keys(markFill) as MarkColor[]

/** Las seis en orden de rueda, para quien elige por índice o por hash. */
export const labelColors = ['green', 'teal', 'blue', 'purple', 'pink', 'orange'] as const satisfies readonly LabelColor[]

/** Junta clases y descarta lo falsy, para no escribir ternarios que devuelvan ''. */
/** Texto plegado para comparar: sin tildes y en minúscula. */
export function fold(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'raised' | 'brand' | 'ghost' | 'muted' | 'bad'
  size?: 'sm' | 'md' | 'lg'
  icon?: IconName
  iconEnd?: IconName
  block?: boolean
  ref?: Ref<HTMLButtonElement>
}

/** Dos botones cargan todo el peso del sistema: - `solid` tinta plana. */
const variants = {
  solid: 'raised-solid bg-solid text-on-solid hover:bg-solid-hover',
  raised: 'raised text-ink',
  brand: 'raised-brand text-on-brand',
  muted: 'bg-muted text-ink hover:bg-sunken',
  ghost: 'text-ink-muted hover:bg-hover hover:text-ink',
  bad: 'bg-bad text-on-bad hover:bg-bad-hover',
} as const

/** La escalera de los controles. */
const control = {
  sm: { box: 'h-8', square: 'size-8', px: 'px-4', text: 'text-xs', gap: 'gap-1.5', radius: 'rounded-md', icon: 16, dot: 'top-[5px] right-[5px]' },
  md: { box: 'h-9', square: 'size-9', px: 'px-5', text: 'text-base', gap: 'gap-2', radius: 'rounded-lg', icon: 18, dot: 'top-1.5 right-1.5' },
  lg: { box: 'h-10', square: 'size-10', px: 'px-6', text: 'text-base', gap: 'gap-2', radius: 'rounded-lg', icon: 20, dot: 'top-[7px] right-[7px]' },
} as const

export function Button({
  variant = 'raised', size = 'md', icon, iconEnd, block, className, children, ...rest
}: ButtonProps) {
  const c = control[size]
  return (
    <button
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

/** El switch: pista de 40×22 con 2 de padding, así que el pulgar es de 18 y viaja 18 exactos. */
export function Switch({
  checked, onChange, label, disabled, id,
}: { checked: boolean; onChange: (v: boolean) => void; label?: string; disabled?: boolean; id?: string }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative inline-flex h-[22px] w-10 shrink-0 items-center rounded-full p-0.5',
        'transition-[background-color,box-shadow] duration-200 ease-[cubic-bezier(.4,0,.2,1)]',
        'disabled:opacity-45 disabled:pointer-events-none',
        checked ? 'switch-track-on' : 'switch-track-off',
      )}
    >
      <span
        className={cx(
          'switch-thumb size-[18px] rounded-full',
          'transition-transform duration-200 ease-[cubic-bezier(.4,0,.2,1)]',
          checked ? 'translate-x-[18px]' : 'translate-x-0',
        )}
      />
    </button>
  )
}

/** Un valor en un rango. */
export function Slider({
  value, onChange, min = 0, max = 100, step = 1, disabled, label, id, className,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  label?: string
  id?: string
  className?: string
}) {
  const t = max === min ? 0 : Math.min(1, Math.max(0, (value - min) / (max - min)))
  const thumbAt = 'calc(var(--t) * (100% - 24px) + 12px)'
  const fillTo = 'calc(var(--t) * (100% - 24px) + 24px)'
  const [dragging, setDragging] = useState(false)
  const move = dragging ? '' : 'transition-[left,width] duration-[120ms] ease-out'
  return (
    <span
      className={cx('relative flex h-8 w-full min-w-[120px] items-center', disabled && 'opacity-45', className)}
      style={{ '--t': t } as CSSProperties}
    >
      <span className="switch-track-off pointer-events-none absolute inset-x-0 h-[22px] rounded-full" />
      <span
        className={cx('switch-track-on pointer-events-none absolute left-0 h-[22px] rounded-full', move)}
        style={{ width: fillTo }}
      />
      <input
        type="range"
        id={id}
        aria-label={label}
        min={min} max={max} step={step} value={value}
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
        onPointerDown={() => setDragging(true)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onBlur={() => setDragging(false)}
        className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-default"
      />
      <span
        className={cx(
          'switch-thumb pointer-events-none absolute size-6 -translate-x-1/2 rounded-full',
          'flex items-center justify-center',
          move,
          'peer-focus-visible:shadow-[var(--switch-thumb-shadow),var(--focus-ring)]',
        )}
        style={{ left: thumbAt }}
      >
        <span
          className={cx(
            'size-3 rounded-full bg-brand transition-transform duration-[90ms] ease-out',
            dragging ? 'scale-[1.18]' : 'scale-100',
          )}
        />
      </span>
    </span>
  )
}

/** La caja de 18, la misma medida del pulgar del switch, así una fila con los dos no tiene dos tamaños de "marca". */
export function Checkbox({
  checked, onChange, label, disabled, id, indeterminate,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  disabled?: boolean
  id?: string
  indeterminate?: boolean
}) {
  const on = checked || indeterminate
  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        'inline-flex size-[18px] shrink-0 items-center justify-center rounded-xs',
        'transition-[background-color,box-shadow] duration-[120ms] ease-out',
        'disabled:opacity-45 disabled:pointer-events-none',
        on ? 'bg-brand text-on-brand' : 'inset-relief bg-muted text-on-brand',
      )}
    >
      <span
        className={cx(
          'inline-flex transition-transform duration-[120ms] ease-out',
          on ? 'scale-100' : 'scale-0',
        )}
      >
        {indeterminate
          ? <span className="block h-0.5 w-2.5 rounded-full bg-current" />
          : <Icon name="check" size={14} weight={700} />}
      </span>
    </button>
  )
}

/** La elección de una entre varias. */
export function Radio({
  checked, onChange, label, disabled, id, tabIndex, ref,
}: {
  checked: boolean
  onChange: () => void
  /** Va al `aria-label`. */
  label?: string
  disabled?: boolean
  id?: string
  /** Lo pone `RadioGroup` para dejar una sola parada de tabulación. */
  tabIndex?: number
  ref?: Ref<HTMLButtonElement>
}) {
  return (
    <button
      ref={ref}
      id={id}
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      tabIndex={tabIndex}
      onClick={onChange}
      className={cx(
        'inline-flex size-[18px] shrink-0 items-center justify-center rounded-full',
        'transition-[background-color,box-shadow] duration-[120ms] ease-out',
        'disabled:opacity-45 disabled:pointer-events-none',
        checked ? 'bg-brand' : 'inset-relief bg-muted',
      )}
    >
      <span
        className={cx(
          'size-[8px] rounded-full bg-on-brand transition-transform duration-[120ms] ease-out',
          checked ? 'scale-100' : 'scale-0',
        )}
      />
    </button>
  )
}

/** El grupo va suelto: las opciones sobre el papel, cada una con su etiqueta al lado. */
export function RadioGroup<T extends string>({
  value, onChange, options, label, className,
}: {
  value: T
  onChange: (v: T) => void
  options: readonly { value: T; label: string; disabled?: boolean }[]
  label?: string
  className?: string
}) {
  const live = options.filter(o => !o.disabled)
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const step = (dir: 1 | -1) => {
    if (!live.length) return
    const i = live.findIndex(o => o.value === value)
    const next = live[(i + dir + live.length) % live.length].value
    onChange(next)
    refs.current[next]?.focus()
  }
  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={e => {
        const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
          : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
        if (!dir) return
        e.preventDefault()
        step(dir)
      }}
      className={cx('inline-flex items-center gap-3', className)}
    >
      {options.map(o => (
        <Radio
          key={o.value}
          ref={el => { refs.current[o.value] = el }}
          checked={o.value === value}
          onChange={() => onChange(o.value)}
          label={o.label}
          disabled={o.disabled}
          tabIndex={o.value === value || (!live.some(l => l.value === value) && o.value === live[0]?.value) ? 0 : -1}
        />
      ))}
    </div>
  )
}

type SegmentedOption<T extends string> = {
  value: T
  /** Con `label` la opción es de texto; sin él, cuadrada con solo el icono. */
  label?: string
  icon?: IconName
  dot?: boolean
  /** Obligatorio en las opciones que solo tienen icono. */
  title?: string
}

/** Un solo segmented para todo: el de texto ("Todas · Abiertas") y el de iconos (grilla · lista) son el mismo componente con distintas opciones. */
export function Segmented<T extends string>({
  value, onChange, options, size = 'md',
}: {
  value: T
  onChange: (v: T) => void
  options: SegmentedOption<T>[]
  size?: 'xs' | 'sm' | 'md'
}) {
  return (
    <div
      role="tablist"
      className={cx(
        'inline-flex items-center',
        size === 'xs' ? 'gap-1' : 'gap-0.5 bg-muted',
        size === 'sm' && 'rounded-lg p-0.5',
        size === 'md' && 'rounded-xl p-1',
      )}
    >
      {options.map(o => {
        const active = o.value === value
        const iconOnly = !o.label && !!o.icon
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            aria-label={iconOnly ? o.title : undefined}
            title={iconOnly ? o.title : undefined}
            onClick={() => onChange(o.value)}
            className={cx(
              'relative inline-flex items-center justify-center gap-1.5 font-semibold',
              'transition-[background-color,color,box-shadow] duration-[190ms] ease-out',
              size === 'xs' ? 'h-6 rounded-md text-xs' : size === 'sm' ? 'h-8 rounded-md text-xs' : 'h-9 rounded-lg text-xs',
              iconOnly
                ? (size === 'xs' ? 'w-6' : size === 'sm' ? 'w-8' : 'w-9')
                : (size === 'xs' ? 'px-2' : size === 'sm' ? 'px-3' : 'px-4'),
              active
                ? (size === 'xs' ? 'bg-muted text-ink' : 'bg-surface text-ink [--relief:var(--relief-raised)] shadow-(--relief)')
                : 'text-ink-muted hover:text-ink',
            )}
          >
            {o.icon && <Icon name={o.icon} size={size === 'md' ? 20 : 18} />}
            {o.label}
            {o.dot && <span className="size-1.5 rounded-full bg-ok" />}
          </button>
        )
      })}
    </div>
  )
}

/** El select es un botón con un listbox propio, no un `<select>` nativo. */
export function Select({
  value, onChange, options, width, leading, loading,
}: {
  value: string
  onChange?: (v: string) => void
  options: string[]
  width?: number
  /** Adelante del valor: un `Icon`, un `FolderIcon`, un `Avatar`, un `Spinner`. */
  leading?: ReactNode
  /** Mientras los datos no están: no abre, y el spinner va solo si no hay `leading`. */
  loading?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)))
  const btn = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })
  const listId = useId()

  useLayoutEffect(() => {
    if (!open || !btn.current) return
    const r = btn.current.getBoundingClientRect()
    setPos({
      top: Math.min(r.bottom + 6, window.innerHeight - 16),
      left: Math.max(8, Math.min(r.left, window.innerWidth - r.width - 8)),
      width: r.width,
    })
    setActive(Math.max(0, options.indexOf(value)))
  }, [open, options, value])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (list.current?.contains(t) || btn.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, options.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
      if (e.key === 'Home') { e.preventDefault(); setActive(0) }
      if (e.key === 'End') { e.preventDefault(); setActive(options.length - 1) }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onChange?.(options[active])
        setOpen(false)
        btn.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [open, active, options, onChange])

  useEffect(() => {
    list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  useEscape(open, useCallback(() => { setOpen(false); btn.current?.focus() }, []))

  const leadingNode = loading ? leading ?? <Spinner size={16} /> : leading

  useEffect(() => { if (loading) setOpen(false) }, [loading])

  return (
    <>
      <button
        ref={btn}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-busy={loading || undefined}
        aria-disabled={loading || undefined}
        onClick={() => { if (!loading) setOpen(o => !o) }}
        style={{ width }}
        className="field-focus inline-flex h-9 items-center justify-between gap-2 rounded-md border border-field-line bg-field px-3 text-xs font-medium text-ink transition-colors duration-[120ms] hover:bg-field-hover aria-disabled:cursor-default aria-disabled:hover:bg-field"
      >
        <span className="flex min-w-0 items-center gap-2">
          {leadingNode && <span className="flex shrink-0 items-center">{leadingNode}</span>}
          <span className="min-w-0 truncate">{value}</span>
        </span>
        <Icon name="keyboard_arrow_down" size={16} className="shrink-0 text-ink" />
      </button>

      {open && (
        <Portal>
          <div
            ref={list}
            id={listId}
            role="listbox"
            style={{ top: pos.top, left: pos.left, minWidth: pos.width }}
            className="ui-pop fixed z-50 max-h-[240px] overflow-y-auto rounded-xl border border-line bg-popover p-1.5 shadow-popover"
          >
            {options.map((o, i) => {
              const selected = o === value
              return (
                <button
                  key={o}
                  role="option"
                  aria-selected={selected}
                  data-active={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => { onChange?.(o); setOpen(false); btn.current?.focus() }}
                  className={cx(
                    'flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-left text-xs font-medium',
                    i === active ? 'bg-hover text-ink' : 'text-ink-muted',
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{o}</span>
                  {selected && <Icon name="check" size={14} className="shrink-0 text-ink" />}
                </button>
              )
            })}
          </div>
        </Portal>
      )}
    </>
  )
}

/** El chip: 28 de alto y radio 10. */
export function Chip({
  children, color, onRemove, active, onClick,
}: {
  children: ReactNode
  color?: LabelColor
  onRemove?: () => void
  active?: boolean
  onClick?: () => void
}) {
  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag
      onClick={onClick}
      className={cx(
        'inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold',
        'transition-[background-color,color,filter] duration-[120ms] ease-out',
        active
          ? 'bg-solid text-on-solid'
          : color
            ? cx(labelFill[color], 'text-on-label')
            : 'bg-muted text-ink',
        onClick && !active && (color ? 'hover:brightness-90' : 'hover:bg-sunken'),
      )}
    >
      {children}
      {onRemove && (
        <button onClick={onRemove} aria-label="Quitar" className="-mr-0.5 rounded-sm p-0.5 hover:bg-active">
          <Icon name="close" size={12} />
        </button>
      )}
    </Tag>
  )
}

/** La línea que separa. */
export function Divider({ orientation = 'horizontal', className }: {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}) {
  return (
    <div
      data-divider=""
      role="separator"
      aria-orientation={orientation}
      className={cx(
        'shrink-0 bg-line',
        orientation === 'horizontal' ? 'h-px' : 'w-px self-stretch',
        className,
      )}
    />
  )
}

/** El kbd va hundido: 11px, radio 6, con luz arriba y sombra interior abajo. */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inset-relief inline-flex h-5 min-w-[21px] items-center justify-center rounded-sm bg-muted px-1.5 font-sans text-2xs font-medium text-ink-muted">
      {children}
    </kbd>
  )
}

/** Dos estados y nada más: con foto, o el círculo pastel con la inicial. */
export function Avatar({ name, src, size = 40, className }: {
  name: string
  src?: string
  size?: number
  className?: string
}) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const i = [...name].reduce((a, c) => a + c.charCodeAt(0), 0)
  const relleno = markFill[markColors[i % markColors.length]]
  return (
    <span
      className={cx('mark relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold select-none', relleno, className)}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.3)) }}
      aria-hidden="true"
    >
      {initials}
      {src && <img src={src} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />}
    </span>
  )
}

/** Varias personas en el lugar de una. */
export function AvatarGroup({
  people, max = 3, size = 28, ring = 'ring-surface', className,
}: {
  people: readonly { name: string; src?: string }[]
  max?: number
  size?: number
  /** La utilidad de color del anillo, que tiene que ser la del fondo de atrás. */
  ring?: string
  className?: string
}) {
  const shown = people.length === max + 1 ? people : people.slice(0, max)
  const rest = people.length - shown.length
  const overlap = Math.round(size / 3)
  return (
    <span
      className={cx('inline-flex items-center', className)}
      style={{ '--overlap': `${overlap}px` } as CSSProperties}
    >
      {shown.map((p, i) => (
        <Avatar
          key={`${p.name}-${i}`}
          name={p.name}
          src={p.src}
          size={size}
          className={cx('ring-2', ring, i > 0 && '-ml-[var(--overlap)]')}
        />
      ))}
      {rest > 0 && (
        <span
          className={cx('-ml-[var(--overlap)] inline-flex items-center justify-center rounded-full bg-sunken font-semibold text-ink-muted ring-2', ring)}
          style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.3)) }}
        >
          +{rest}
        </span>
      )}
      <span hidden>{people.map(p => p.name).join(', ')}</span>
    </span>
  )
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  icon?: IconName
  suffix?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  /** Va al contenedor, que es lo que mide y lo que se enfoca. */
  ref?: Ref<HTMLDivElement>
}

const fieldSizes = {
  sm: 'h-8 gap-1.5 rounded-md px-2.5 text-xs',
  md: 'h-9 gap-2 rounded-lg px-3 text-base',
  lg: 'h-10 gap-2 rounded-lg px-3 text-base',
} as const

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

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows' | 'style' | 'resize'> & {
  /** Las filas de arranque: el alto mínimo del campo. */
  rows?: number
  /** Hasta cuántas filas crece antes de scrollear. */
  maxRows?: number
  /** Quién decide el alto. */
  resize?: 'auto' | 'vertical' | 'none'
}

/** El campo de varias líneas: la misma caja que `TextField`, estirada. */
export function Textarea({
  rows = 3, maxRows, resize = 'auto', className, onChange, value, ...rest
}: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const campo = useField()

  const medir = useCallback(() => {
    const el = ref.current
    if (!el || resize !== 'auto') return
    const cs = getComputedStyle(el)
    const line = parseFloat(cs.lineHeight) || 16
    const marco = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
      + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)
    el.style.height = 'auto'
    const alto = el.scrollHeight
    const techo = maxRows ? line * maxRows + marco : Infinity
    el.style.height = `${Math.min(alto, techo)}px`
    el.style.overflowY = alto > techo ? 'auto' : 'hidden'
  }, [maxRows, resize])

  useLayoutEffect(medir, [medir, value, rows])

  // Sin esto, angostar la ventana o el swap de la fuente deja texto cortado y sin scroll.
  useEffect(() => {
    const el = ref.current
    if (!el || resize !== 'auto' || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    document.fonts?.ready.then(medir).catch(() => {})
    return () => ro.disconnect()
  }, [medir, resize])

  return (
    <div
      className={cx(
        'field flex cursor-text border border-field-line bg-field',
        'has-[textarea:disabled]:pointer-events-none has-[textarea:disabled]:opacity-45',
        'rounded-lg text-base',
        resize === 'vertical' ? 'p-0' : 'px-3 py-2.5',
        className,
      )}
    >
      <textarea
        ref={ref}
        rows={rows}
        value={value}
        onChange={e => { medir(); onChange?.(e) }}
        className={cx(
          'min-w-0 flex-1 bg-transparent font-normal leading-[1.45] text-ink outline-none',
          'placeholder:text-ink-muted',
          resize === 'vertical' ? 'resize-y px-3 py-2.5' : 'resize-none',
        )}
        {...campo}
        {...rest}
      />
    </div>
  )
}

/** El contenedor de radio 24. */
export function Card({ children, className, interactive, surface = 'paper' }: {
  children: ReactNode
  className?: string
  interactive?: boolean
  surface?: 'paper' | 'muted'
}) {
  return (
    <div
      className={cx(
        'rounded-2xl p-2',
        surface === 'muted' ? 'bg-muted' : 'bg-surface shadow-card',
        interactive && 'transition-[box-shadow,transform] duration-[190ms] ease-out hover:-translate-y-0.5 hover:shadow-toolbar',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** La cabecera de una tarjeta: el título a la izquierda, lo que haya a la derecha. */
export function CardHeader({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cx('flex items-start justify-between gap-4 px-3 pt-3 pb-1', className)} {...props}>
      {children}
    </div>
  )
}

/** Cómo se llama lo que hay en la tarjeta. */
export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return <h3 className={cx('text-base font-semibold text-ink', className)} {...props} />
}

/** La línea de apoyo, debajo del título. */
export function CardHint({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cx('text-xs font-medium text-ink-muted', className)} {...props} />
}

/** El cuerpo, con el padding que la tarjeta no pone. */
export function CardBody({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('px-3 py-2', className)} {...props} />
}

/** La fila de abajo, separada por una línea. */
export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('mt-1 flex items-center gap-2 border-t border-line px-3 pt-3 pb-2', className)} {...props} />
}

/** La fila de un panel: 56px de alto, padding 16/24, label a la izquierda y control a la derecha. */
export function Row({ label, hint, children }: { label: string; hint?: string; children?: ReactNode }) {
  return (
    <div className="flex min-h-14 items-center gap-4 border-t border-line px-6 py-4 first:border-t-0">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-ink">{label}</div>
        {hint && <div className="mt-1 text-2xs text-ink-muted">{hint}</div>}
      </div>
      {children}
    </div>
  )
}

/** Pista completa más un arco encima. */
export function Spinner({ size = 20, label = 'Cargando', on = 'surface', className }: {
  size?: number
  label?: string
  /** Sobre qué está apoyado. */
  on?: 'surface' | 'solid'
  className?: string
}) {
  const gid = useId()
  const [edge, track] = on === 'solid'
    ? ['var(--solid)', 'color-mix(in oklab, var(--on-solid) 22%, transparent)']
    : ['var(--surface)', 'var(--border-strong)']
  // El trazo, en unidades del viewBox. Como es una fracción del diámetro y el
  // viewBox es de 24, sale directo: no hay que deshacer la escala del svg
  // porque no hay ningún número en px de por medio.
  const w = Math.max((2 * 24) / size, 24 * 0.17)
  const rim = 0.85
  const e = w + rim * 2
  const r = (24 - e) / 2
  // `pathLength` normaliza la vuelta a 100, así el largo se escribe en por
  // ciento del anillo y no en unidades de un radio que cambia con el trazo.
  const arc = 40
  return (
    <span role="status" aria-label={label} className={cx('inline-flex', className)}>
      <svg width={size} height={size} viewBox="0 0 24 24" className="spin" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0.5" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--blue-400)" />
            <stop offset="100%" stopColor="var(--blue-600)" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r={r} fill="none" stroke={track} strokeWidth={w} />
        <g transform="rotate(-90 12 12)">
          <circle
            cx="12" cy="12" r={r} fill="none"
            stroke={edge} strokeWidth={e} strokeLinecap="round"
            pathLength={100} strokeDasharray={`${arc} ${100 - arc}`}
          />
          <circle
            cx="12" cy="12" r={r} fill="none"
            stroke={`url(#${gid})`} strokeWidth={w} strokeLinecap="round"
            pathLength={100} strokeDasharray={`${arc} ${100 - arc}`}
          />
        </g>
      </svg>
    </span>
  )
}
