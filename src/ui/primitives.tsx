import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import { Portal } from './overlay'
import { Icon, type IconName } from './icon'

/** Junta clases y descarta lo falsy, para no escribir ternarios que devuelvan ''. */
export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

/* ------------------------------------------------------------------ Button */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'raised' | 'ghost' | 'muted' | 'bad'
  size?: 'sm' | 'md' | 'lg'
  icon?: IconName
  iconEnd?: IconName
  block?: boolean
}

/**
 * Dos botones cargan todo el peso del sistema:
 *
 * - `solid`  tinta plana. Es el que manda, y hay uno por pantalla.
 * - `raised` gris con relieve: degradado, luz interior arriba, anillo de 1px y
 *   una sombra corta. Es el secundario, y el que le da el carácter físico a la
 *   interfaz. Al presionarlo se invierte el relieve (`.raised:active` pasa a la
 *   sombra hundida), que es lo que hace que se sienta un botón y no un rectángulo.
 *
 * El texto va en 14/600 aunque la interfaz sea de 12: un botón con el mismo
 * tamaño que su entorno no se lee como accionable.
 */
const variants = {
  solid: 'raised-solid bg-solid text-on-solid hover:bg-solid-hover',
  raised: 'raised text-ink',
  muted: 'bg-muted text-ink hover:bg-sunken',
  ghost: 'text-ink-muted hover:bg-hover hover:text-ink',
  bad: 'bg-bad text-on-bad hover:bg-bad-hover',
} as const

/* Tres alturas, una por contexto, y las tres del ladder real:
     sm  32  inline en una fila densa (una fila de ajustes)
     md  36  acciones dentro de un panel (Rechazar / Aceptar)
     lg  40  la acción principal de la topbar
   Del md para arriba el texto es 14/600 y el radio 12: un botón con el mismo
   tamaño de letra que su entorno no se lee como accionable. */
const sizes = {
  sm: 'h-8 px-3.5 text-xs gap-1.5 rounded-md',
  md: 'h-9 px-5 text-base gap-2 rounded-lg',
  lg: 'h-10 px-6 text-base gap-2 rounded-lg',
} as const

export function Button({
  variant = 'raised', size = 'md', icon, iconEnd, block, className, children, ...rest
}: ButtonProps) {
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center font-semibold whitespace-nowrap',
        'transition-[background-color,color,box-shadow,filter] duration-[120ms] ease-out',
        'disabled:opacity-45 disabled:pointer-events-none',
        variants[variant], sizes[size], block && 'w-full', className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />}
    </button>
  )
}

/* -------------------------------------------------------------- IconButton */

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName
  /** Obligatorio: un botón que solo tiene un icono no dice nada sin esto. */
  label: string
  variant?: 'ghost' | 'raised' | 'solid' | 'muted'
  size?: 'sm' | 'md'
  /** El puntito de "hay algo nuevo", arriba a la derecha. */
  dot?: boolean
  active?: boolean
}

export function IconButton({
  icon, label, variant = 'ghost', size = 'md', dot, active, className, ...rest
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cx(
        'relative inline-flex items-center justify-center transition-[background-color,color,box-shadow] duration-[120ms] ease-out',
        'disabled:opacity-45 disabled:pointer-events-none',
        variants[variant === 'ghost' && active ? 'muted' : variant],
        /* Cuadrado y con radio 10: un icono suelto en un contenedor de radio 12
           se ve descentrado, porque no tiene texto que balancee la curva. */
        size === 'sm' ? 'size-8 rounded-md' : 'size-10 rounded-md',
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={size === 'sm' ? 16 : 20} />
      {dot && <span className="absolute top-2 right-2 size-1.5 rounded-full bg-accent ring-2 ring-surface" />}
    </button>
  )
}

/* ------------------------------------------------------------------ Switch */

/**
 * El switch: pista de 40×22 con 2 de padding, así que el pulgar es de 18 y
 * viaja 18 exactos.
 *
 * Lo que lo hace verse como una pieza física y no como un círculo pintado son
 * las tres capas del pulgar (`.switch-thumb`): luz interior arriba, un halo
 * corto alrededor y una sombra de contacto un píxel más abajo. La pista además
 * lleva su propia sombra interior —más marcada en `on` que en `off`— para que
 * el pulgar parezca hundido dentro de ella.
 *
 * La pista prendida es tinta al 70%, no el color de acento: el acento se
 * reserva para señalar, y un switch prendido no es una señal, es un estado.
 */
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

/* --------------------------------------------------------------- Segmented */

type SegmentedOption<T extends string> = {
  value: T
  /** Con `label` la opción es de texto; sin él, cuadrada con solo el icono. */
  label?: string
  icon?: IconName
  dot?: boolean
  /** Obligatorio en las opciones que solo tienen icono. */
  title?: string
}

/**
 * Un solo segmented para todo: el de texto ("Todas · Abiertas") y el de iconos
 * (grilla · lista) son el mismo componente con distintas opciones.
 *
 * Que sean la misma pieza y no dos parecidas es el punto: dos implementaciones
 * del mismo control se van separando sola una del otra con cada cambio, y
 * terminan con dos radios, dos alturas y dos ideas de qué es "activo".
 *
 * Construcción: la pista es un contenedor apagado y la opción activa es una
 * superficie con relieve que flota adentro. El radio de la opción es el de la
 * pista menos su padding, y las dos medidas tienen que dar la cuenta:
 *
 *   sm   pista 12 (lg) − 2 (p-0.5) → opción 10 (md)
 *   md   pista 16 (xl) − 4 (p-1)   → opción 12 (lg)
 */
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
        /* `xs` va con pista transparente: dentro del header de un panel, una
           pista gris sobre un fondo gris agrega una caja que no hace falta. */
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
                ? (size === 'xs' ? 'bg-muted text-ink' : 'bg-surface text-ink shadow-raised')
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

/* ------------------------------------------------------------------ Select */

/**
 * El select es un botón con un listbox propio, no un `<select>` nativo.
 *
 * La razón es que el nativo no se puede estilar: `appearance: none` te saca la
 * flecha, pero la lista desplegada la sigue dibujando el sistema operativo, así
 * que en Linux se ve como un control de GTK en medio de la interfaz. Con eso
 * puesto, el campo se ve "sin estilo" por más que la caja esté bien.
 *
 * A cambio hay que traer el teclado a mano, que es lo que el nativo regalaba:
 * flechas para moverse, Enter para elegir, Escape para salir, Home/End a los
 * extremos. Sin eso el control queda inutilizable sin mouse.
 */
export function Select({
  value, onChange, options, width,
}: { value: string; onChange?: (v: string) => void; options: string[]; width?: number }) {
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
      if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); btn.current?.focus() }
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

  return (
    <>
      <button
        ref={btn}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => setOpen(o => !o)}
        style={{ width }}
        className="inline-flex h-9 items-center justify-between gap-2 rounded-md border border-field-line bg-field px-3 text-xs font-medium text-ink transition-colors duration-[120ms] hover:bg-field-hover"
      >
        <span className="min-w-0 truncate">{value}</span>
        <Icon name="chevronDown" size={16} className="shrink-0 text-ink" />
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

/* -------------------------------------------------------------------- Chip */

export function Chip({
  children, tint, onRemove, active, onClick,
}: {
  children: ReactNode
  tint?: 1 | 2 | 3 | 4 | 5 | 6
  onRemove?: () => void
  active?: boolean
  onClick?: () => void
}) {
  const tints = ['bg-tint-1', 'bg-tint-2', 'bg-tint-3', 'bg-tint-4', 'bg-tint-5', 'bg-tint-6']
  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag
      onClick={onClick}
      className={cx(
        'inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-ink',
        'transition-colors duration-[120ms] ease-out',
        active ? 'bg-solid text-on-solid' : tint ? tints[tint - 1] : 'bg-muted',
        onClick && !active && 'hover:bg-sunken',
      )}
    >
      {children}
      {onRemove && (
        <button onClick={onRemove} aria-label="Quitar" className="-mr-0.5 rounded-sm p-0.5 hover:bg-active">
          <Icon name="x" size={12} />
        </button>
      )}
    </Tag>
  )
}

/* --------------------------------------------------------------------- Kbd */

/** El kbd va hundido: 11px, radio 6, con luz arriba y sombra interior abajo. */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inset-relief inline-flex h-5 min-w-[21px] items-center justify-center rounded-sm bg-muted px-1.5 font-sans text-2xs font-medium text-ink-muted">
      {children}
    </kbd>
  )
}

/* ------------------------------------------------------------------ Avatar */

const avatarTints = ['bg-tint-1', 'bg-tint-2', 'bg-tint-3', 'bg-tint-4', 'bg-tint-5', 'bg-tint-6']

/**
 * El avatar sin foto: inicial sobre un tinte, y el tinte sale del nombre.
 * Determinístico a propósito — si saliera de un random, la misma persona
 * cambiaría de color en cada render y el color dejaría de identificar a nadie.
 */
export function Avatar({ name, size = 40, className }: { name: string; size?: number; className?: string }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const tint = avatarTints[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % avatarTints.length]
  return (
    <span
      className={cx('inline-flex items-center justify-center rounded-full font-semibold text-ink select-none', tint, className)}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.3)) }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}

/* ------------------------------------------------------------------- Input */

type InputProps = InputHTMLAttributes<HTMLInputElement> & { icon?: IconName; suffix?: ReactNode }

export function Input({ icon, suffix, className, ...rest }: InputProps) {
  return (
    <div className={cx('flex h-10 items-center gap-2 rounded-lg bg-muted px-3 transition-colors duration-[120ms] focus-within:bg-surface focus-within:shadow-raised', className)}>
      {icon && <Icon name={icon} size={20} className="text-ink-muted" />}
      <input className="min-w-0 flex-1 bg-transparent text-xs font-medium text-ink outline-none placeholder:text-ink-muted" {...rest} />
      {suffix}
    </div>
  )
}

/* -------------------------------------------------------------------- Card */

export function Card({ children, className, interactive }: { children: ReactNode; className?: string; interactive?: boolean }) {
  return (
    <div
      className={cx(
        'rounded-2xl bg-surface p-2 shadow-card',
        interactive && 'transition-[box-shadow,transform] duration-[190ms] ease-out hover:-translate-y-0.5 hover:shadow-toolbar',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* -------------------------------------------------------------- Row (list) */

/**
 * La fila de un panel: 56px de alto, padding 16/24, label a la izquierda y
 * control a la derecha.
 *
 * El divisor va como borde superior de cada fila menos la primera
 * (`first:border-t-0`) en vez de borde inferior de todas: así la última no deja
 * una línea suelta contra el fondo del panel.
 */
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
