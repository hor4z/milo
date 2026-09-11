import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, CSSProperties, InputHTMLAttributes, ReactNode, Ref } from 'react'
import { Portal } from './overlay'
import { Icon, type IconName } from './icon'

/* ------------------------------------------------------- etiquetas de color */

/**
 * La familia viva de lo chico: un chip, la inicial de un avatar, el cuadradito
 * de icono de una tarjeta.
 *
 * Vive acá y no en `list.tsx` a propósito: la marca pastel de una fila de lista
 * es otra paleta (`--mark-*`, en pares relleno/glifo) y son dos roles
 * distintos. Lo que las separa es el tamaño de la pieza — una marca de 44 en
 * una fila clara puede ser pastel y leerse entera; un chip de 28 en pastel se
 * confunde con el fondo apagado del que sale.
 */
export const labelFill = {
  green: 'bg-label-green',
  teal: 'bg-label-teal',
  blue: 'bg-label-blue',
  purple: 'bg-label-purple',
  pink: 'bg-label-pink',
  orange: 'bg-label-orange',
} as const

export type LabelColor = keyof typeof labelFill

/**
 * Las seis en orden de rueda, para quien elige por índice o por hash.
 *
 * El orden importa: el avatar reparte sobre el índice, y con los tonos
 * desordenados dos nombres consecutivos caían en dos tonos casi iguales y el
 * color dejaba de separar a dos personas.
 */
export const labelColors = ['green', 'teal', 'blue', 'purple', 'pink', 'orange'] as const satisfies readonly LabelColor[]


/** Junta clases y descarta lo falsy, para no escribir ternarios que devuelvan ''. */
export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

/* ------------------------------------------------------------------ Button */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'raised' | 'brand' | 'ghost' | 'muted' | 'bad'
  size?: 'sm' | 'md' | 'lg'
  icon?: IconName
  iconEnd?: IconName
  block?: boolean
  /* El `ref` va declarado y viaja dentro de `...rest` hasta el `<button>`.
     En React 19 no hace falta `forwardRef`, pero sí declararlo: sin esto, un
     `Dropdown` o un `Popover` no puede usar `Button` como disparador —lo
     necesita para medir dónde abrir el panel— y hay que escribir un `<button>`
     crudo repitiendo las clases de la variante a mano. */
  ref?: Ref<HTMLButtonElement>
}

/**
 * Dos botones cargan todo el peso del sistema:
 *
 * - `solid`  tinta plana. Es el que manda, y hay uno por pantalla.
 * - `raised` gris con relieve: degradado, luz interior arriba, anillo de 1px y
 *   una sombra corta. Es el secundario, y el que le da el carácter físico a la
 *   interfaz. Al presionarlo se invierte el relieve (`.raised:active` pasa a la
 *   sombra hundida), que es lo que hace que se sienta un botón y no un rectángulo.
 * - `brand`  el mismo botón lleno, en azul. Misma forma, mismas cuatro capas de
 *   relieve, solo cambia el color. Es la única pieza con color de la interfaz:
 *   `solid` y `brand` son el mismo rol, así que van uno o el otro, nunca los dos
 *   en la misma pantalla, o la mirada no sabe cuál es el que manda.
 *
 * El texto va en 14/600 aunque la interfaz sea de 12: un botón con el mismo
 * tamaño que su entorno no se lee como accionable.
 */
const variants = {
  solid: 'raised-solid bg-solid text-on-solid hover:bg-solid-hover',
  raised: 'raised text-ink',
  brand: 'raised-brand text-on-brand',
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
  ref?: Ref<HTMLButtonElement>
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
 * La pista prendida va en el azul de marca, el mismo que el checkbox marcado.
 * No es el acento ámbar: ese señala algo que pasó y no lo eligió nadie —un
 * aviso, algo nuevo—, y un switch prendido es lo contrario, es una decisión de
 * quien lo usa. Que el checkbox y el switch compartan el azul es lo que hace
 * que "esto lo prendí yo" se lea igual en los dos.
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

/* ------------------------------------------------------------------ Slider */

/**
 * Un valor en un rango. Es el hermano del switch y por eso no tiene recetas
 * propias: la pista llena es `switch-track-on`, la vacía `switch-track-off` y
 * el pulgar es el pulgar del switch. Los dos son una píldora con una pieza
 * redonda encima, y el día que cambie el relieve de uno tiene que cambiar el
 * del otro.
 *
 * El azul tampoco se elige acá. Es la misma regla de rol que ya está escrita:
 * el azul es lo que el usuario prendió o confirmó —el switch, el checkbox, el
 * CTA— y el valor de un slider es exactamente eso. El punto azul del pulgar es
 * la misma frase dicha en la pieza que se agarra.
 *
 * Geometría, y dónde se aparta del switch:
 *
 * · La pista es de 22, la del switch. Dos píldoras en el mismo sistema con dos
 *   alturas distintas se ven como dos sistemas.
 * · El pulgar es de 24 y **sobresale** de la pista, al revés que el del switch,
 *   que es de 18 y vive adentro de una de 22. Es la diferencia entre los dos
 *   controles: el del switch es una pieza que corre por un canal, el del slider
 *   es una pieza apoyada sobre un riel, y se agarra.
 * · El punto es de 12, la mitad del pulgar.
 * · La caja es de 32, el `--control-sm`, aunque la pista mida 22. Lo que se
 *   agarra no puede medir lo que se ve: 22 de alto es poco para el dedo, y el
 *   aire de arriba y abajo es parte del control aunque no se dibuje.
 *
 * El pulgar no llega nunca a salirse: viaja entre 12 y el ancho menos 12, así
 * que la cuenta lleva su propio tamaño adentro. Sin eso, en 0 y en 100 la mitad
 * del pulgar queda afuera de la pista.
 *
 * Adentro hay un `<input type="range">` de verdad, transparente y encima de
 * todo. No es el caso del `Select`: ahí el sistema operativo dibuja la lista
 * desplegada y no hay forma de estilarla, pero un range se tapa entero con un
 * div y lo que se gana a cambio es el teclado, el arrastre y el rol, gratis y
 * bien hechos.
 */
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
  // Hasta el centro del pulgar, no hasta el borde de la caja.
  const upToThumb = 'calc(var(--t) * (100% - 24px) + 12px)'
  /* Arrastrando no hay transición y sin arrastrar sí, y las dos cosas son por
     el mismo motivo. Con transición, el pulgar va atrás del cursor: el dedo ya
     está en un lugar y la pieza llega 120ms después, que es exactamente la
     sensación de que el control no responde. Sin transición, un paso de flecha
     o un `value` que cambia desde afuera teletransporta la pieza y no se ve de
     dónde a dónde fue. */
  const [dragging, setDragging] = useState(false)
  const move = dragging ? '' : 'transition-[left,width] duration-[120ms] ease-out'
  return (
    /* `flex` y no `inline-flex`: el slider no tiene ancho propio —lo toma del
       hueco donde lo pongan— y un inline con `w-full` adentro de otro inline
       colapsa a cero. Con la caja en bloque, lo único que hay que darle desde
       afuera es el máximo. */
    <span
      className={cx('relative flex h-8 w-full min-w-[120px] items-center', disabled && 'opacity-45', className)}
      style={{ '--t': t } as CSSProperties}
    >
      <span className="switch-track-off pointer-events-none absolute inset-x-0 h-[22px] rounded-full" />
      <span
        className={cx('switch-track-on pointer-events-none absolute left-0 h-[22px] rounded-full', move)}
        style={{ width: upToThumb }}
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
        /* También en blur: si se suelta el botón afuera de la ventana, el
           `pointerup` no llega nunca y el control se queda sin transición para
           siempre. */
        onBlur={() => setDragging(false)}
        /* `peer` para que el pulgar dibujado tome el foco del input que no se
           ve. La opacidad es 0 y no `sr-only`: tiene que seguir ocupando la
           caja entera para recibir el arrastre. */
        className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-default"
      />
      <span
        className={cx(
          'switch-thumb pointer-events-none absolute size-6 -translate-x-1/2 rounded-full',
          'flex items-center justify-center',
          move,
          /* Lo que hace que se sienta agarrado: el punto crece un paso mientras
             el dedo está abajo. Crece el punto y no el pulgar — si creciera el
             pulgar, el borde de la pieza se movería respecto de la pista y el
             riel se vería saltar justo cuando lo estás usando.

             La escala va con su propia transición, más corta que la del
             movimiento y siempre puesta: el crecer tiene que leerse aunque
             estés arrastrando, que es el único momento en que pasa. */
          'peer-focus-visible:shadow-[var(--switch-thumb-shadow),var(--focus-ring)]',
        )}
        style={{ left: upToThumb }}
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

/* ---------------------------------------------------------------- Checkbox */

/**
 * La caja de 18, la misma medida del pulgar del switch, así una fila con los dos
 * no tiene dos tamaños de "marca".
 *
 * El radio es `xs` (5) y no `sm` (6), que es el del kbd: sobre un cuadrado de
 * 18, un radio de 6 deja solo 6px de lado plano de los 18 y la casilla se lee
 * redonda. El kbd puede llevar 6 porque es más ancho que alto y le sobran lados
 * rectos. Es la misma medida en dos piezas que se ven distinto por su forma.
 *
 * Apagada es un campo hundido —es una marca, igual que el kbd— y prendida pasa
 * al azul de marca con el tilde en blanco. El relieve se va al prenderse a
 * propósito: lo hundido invita a apretar, y una casilla ya marcada no invita a
 * nada, informa.
 *
 * El azul y no la tinta: es el único control que confirma una elección del que
 * lo usa, y el azul es lo que el sistema reserva para eso.
 *
 * El tilde va a 12 con `weight` 3, y las dos medidas van juntas.
 *
 * El tamaño hay que calcularlo con el trazo incluido, y ahí está la trampa: el
 * dibujo ocupa 15 de las 24 unidades de la grilla, pero el trazo agrega media
 * línea de cada lado y las puntas son redondas. Así que lo que ocupa de los 18
 * de la caja no es size × 15/24, es eso más el trazo entero:
 *
 *     16 → 12 de 18, casi tocando las esquinas de radio 5
 *     14 → 10.5 de 18
 *     12 → 9 de 18, con 4.5 de aire por lado
 *
 * Y sobre las esquinas hay menos lugar todavía en las diagonales, que es justo
 * donde apunta la punta larga del tilde.
 *
 * El `weight` 3 y no el 1.5 del resto del set: acá el glifo no acompaña a un
 * texto, es el contenido entero de la pieza. Con 2 el trazo cae en 1.17px y se
 * ve borroso; con 3 son 1.75 y el tilde queda dibujado.
 *
 * No es un `<input type="checkbox">` con `appearance: none` porque el tilde
 * nativo no se puede reemplazar sin apagar también el foco y el estado
 * indeterminado; es un button con `role="checkbox"`, que además deja usar el
 * mismo tilde del set de iconos en vez de uno dibujado aparte.
 */
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
        on ? 'bg-brand text-on-brand' : 'inset-relief bg-muted text-transparent',
      )}
    >
      {indeterminate
        ? <span className="h-0.5 w-2.5 rounded-full bg-current" />
        : <Icon name="check" size={12} weight={3} />}
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

/**
 * El chip: 28 de alto y radio 10. Es una etiqueta, no un botón — solo se vuelve
 * accionable con `onClick` u `onRemove`.
 *
 * `color` toma una etiqueta de la familia viva, no un tinte lavado. Antes tomaba
 * `tint: 1..6` y ahí estaba el bug: los tintes son el lavado de una superficie
 * grande con un dibujo oscuro encima, y un chip es una marca chica que tiene
 * que identificar de reojo. Con el tinte puesto acá, seis chips en una fila se
 * veían todos del mismo gris apenas teñido.
 *
 * Con color, el texto pasa a `--on-mark` y el hover oscurece el relleno en vez
 * de cambiarlo: sobre un color saturado, saltar a otro gris se ve como si el
 * chip cambiara de categoría.
 */
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

/**
 * El avatar sin foto: inicial sobre una etiqueta de color, y la etiqueta sale del
 * nombre. Determinístico a propósito — si saliera de un random, la misma
 * persona cambiaría de color en cada render y el color dejaría de identificar a
 * nadie.
 *
 * El reparto va sobre `labelColors`, que está en orden de rueda: con los tonos
 * desordenados, dos nombres consecutivos podían caer en dos tonos casi iguales
 * y el color dejaba de separar a dos personas.
 */
export function Avatar({ name, src, size = 40, className }: { name: string; src?: string; size?: number; className?: string }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const label = labelColors[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % labelColors.length]
  return (
    /* Con foto, la etiqueta de color se queda igual de fondo: es lo que se ve
       mientras la imagen carga y lo que queda si no carga nunca. Un hueco gris
       en una fila de cinco avatares se lee como una persona sin nombre; la
       inicial sobre su color, no. */
    <span
      className={cx('relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold text-on-label select-none', labelFill[label], className)}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.3)) }}
      aria-hidden="true"
    >
      {initials}
      {src && <img src={src} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />}
    </span>
  )
}

/**
 * Varias personas en el lugar de una. Se montan un tercio y cada una lleva un
 * anillo del color de la superficie: sin el anillo, dos avatares vecinos de
 * tonos parecidos se leen como una mancha sola en vez de como dos personas.
 *
 * El anillo es del color de la fila y no blanco fijo, así que si la fila cambia
 * de fondo hay que pasarle `ring`. Es la única forma: un avatar no puede saber
 * sobre qué lo pusieron.
 *
 * El resto va en un círculo neutro y no en otra etiqueta de color. Un `+4` no
 * es una persona —no identifica a nadie— y en la familia viva se leería como
 * una más del grupo, que es justo lo contrario de lo que dice.
 *
 * `max` cuenta avatares, no personas: con `max` 3 y cinco nombres se ven tres
 * caras y un `+2`. Si el sobrante fuera uno solo no se pone círculo, se muestra
 * la cuarta cara: un `+1` ocupa lo mismo que la persona que esconde.
 */
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
    /* El monte va como variable y no como una clase fija porque depende de
       `size`: con un valor de Tailwind escrito a mano, cambiar el tamaño del
       grupo dejaba el monte donde estaba y los avatares se separaban. */
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

/* ----------------------------------------------------------------- Spinner */

/**
 * Pista completa + arco encima, los dos del mismo grosor. La pista es lo que
 * evita que el arco se lea como un pedazo de algo roto: sin ella, un arco suelto
 * girando no dice "esperá", dice que falta un trozo de la interfaz.
 *
 * El arco va en el azul de marca —es la única pieza además del CTA que lo usa—
 * y no en tinta: en una pantalla monocroma, lo único que se mueve es también lo
 * único que conviene que tenga color, porque es lo que tiene que encontrar la
 * mirada.
 *
 * El trazo no escala con el tamaño: 3 a los 20 y 3 a los 44. Un anillo fino en
 * grande se ve frágil, pero un anillo proporcional en chico se tapa a sí mismo
 * —el agujero desaparece— y deja de leerse como anillo.
 */
export function Spinner({ size = 20, label = 'Cargando', className }: { size?: number; label?: string; className?: string }) {
  const stroke = size <= 16 ? 2 : 3
  // El trazo se pide en px pero se dibuja en unidades del viewBox, que el svg
  // escala a `size`. Hay que deshacer esa escala a mano o la promesa de arriba
  // es falsa: con el 3 escrito crudo, un 44 salía con 5.5 de grosor y un 16 con
  // 1.3 —el donut y el pelo— que es justo lo contrario de lo que dice la regla.
  const w = (stroke * 24) / size
  // El radio se mete media pluma para adentro; así el anillo entra justo en la
  // caja de `size` a cualquier tamaño, en vez de salirse media pluma.
  const r = (24 - w) / 2
  return (
    <span role="status" aria-label={label} className={cx('inline-flex', className)}>
      <svg width={size} height={size} viewBox="0 0 24 24" className="spin" aria-hidden="true">
        <circle cx="12" cy="12" r={r} fill="none" stroke="var(--surface-sunken)" strokeWidth={w} />
        {/* `pathLength` normaliza la vuelta a 100, así el largo del arco se
            escribe en por ciento del anillo y no en unidades de un radio que
            cambia con el trazo. Con el 60 crudo que había, el arco tapaba el
            92% del anillo a los 20 y el 87% a los 16: ni se leía como arco ni
            medía lo mismo en dos tamaños. */}
        <circle
          cx="12" cy="12" r={r} fill="none"
          stroke="var(--brand)" strokeWidth={w} strokeLinecap="round"
          pathLength={100} strokeDasharray={100} className="spin-arc"
        />
      </svg>
    </span>
  )
}
