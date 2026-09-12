import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, CSSProperties, InputHTMLAttributes, ReactNode, Ref, TextareaHTMLAttributes } from 'react'
import { useEscape } from './esc'
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
 * La otra familia: pares relleno/glifo, pastel con el glifo del mismo tono
 * varios pasos más oscuro. Es la marca de 44 de una fila de lista.
 *
 * Vive acá y no en `list.tsx` desde que el `Avatar` la puede usar también. El
 * corte entre las dos familias sigue siendo el tamaño de la pieza, y está
 * argumentado en los tokens: una marca de 44 en una fila clara puede ser pastel
 * y leerse entera; algo chico en pastel se confunde con el fondo apagado del que
 * sale. Que el avatar pueda tomar esta familia es justamente para poder mirar si
 * esa regla se sostiene a los tamaños en que aparece un avatar.
 */
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

/**
 * Las seis en orden de rueda, para quien elige por índice o por hash.
 *
 * El orden importa: el avatar reparte sobre el índice, y con los tonos
 * desordenados dos nombres consecutivos caían en dos tonos casi iguales y el
 * color dejaba de separar a dos personas.
 */
export const labelColors = ['green', 'teal', 'blue', 'purple', 'pink', 'orange'] as const satisfies readonly LabelColor[]


/** Junta clases y descarta lo falsy, para no escribir ternarios que devuelvan ''. */
/**
 * Texto plegado para comparar: sin tildes y en minúscula. Quien escribe rápido
 * no pone las tildes, y "indagacion" tiene que encontrar "Indagación".
 *
 * Vive acá y no en cada buscador porque ya hay dos que lo necesitan —la paleta
 * de comandos y la galería de iconos— y dos copias de un normalizador se
 * desincronizan igual que se desincronizó el riel del kit.
 */
export function fold(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

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

/**
 * La escalera de los controles. **Una sola**, y de acá salen el `Button` y el
 * `IconButton`: el mismo nombre de tamaño tiene que dar el mismo alto en los
 * dos, o un icono al lado de un botón en la misma fila no apoya en la misma
 * línea. Ya pasó — el `md` del `IconButton` era 40, que es el `lg` del
 * `Button`, así que los dos `md` medían distinto.
 *
 * El alto no es un número elegido: es **la línea de la interfaz (16) más el
 * aire vertical**, que sube de a 2. Es la cuenta que usa Reshaped —alto =
 * interlínea + padding×2— con nuestros números:
 *
 *     sm  32 = 16 + 8×2    inline en una fila densa (una fila de ajustes)
 *     md  36 = 16 + 10×2   acciones dentro de un panel (Rechazar / Aceptar)
 *     lg  40 = 16 + 12×2   la acción principal de la topbar
 *
 * El alto va **fijo** y no como `min-height`, que es la otra diferencia con
 * Reshaped y es a propósito: con `min-height`, un `md` con un icono de 18
 * mediría 18 + 20 = 38 y crecería solo. Nuestros iconos son grandes en relación
 * al texto, así que acá la caja manda sobre el contenido.
 *
 * El padding lateral sube al mismo paso que el alto, de a 4: 16 · 20 · 24.
 * Estaba en 14 · 20 · 24 —un paso de 6 y después uno de 4— sin ninguna razón.
 *
 * Del `md` para arriba el texto es 14/600: un botón con el mismo tamaño de
 * letra que su entorno no se lee como accionable.
 *
 * Los radios salen de la regla del sistema y por eso **no son los mismos en las
 * dos piezas**: `md` (10) es lo cuadrado que se toca y `lg` (12) lo que se toca
 * con texto. Un `Button` de 36 lleva 12 y un `IconButton` de 36 lleva 10.
 */
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

/* -------------------------------------------------------------- IconButton */

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
      /* Sin `title`. Era el tooltip del sistema operativo: tarda cerca de un
         segundo, no se puede estilar, no aparece con el teclado y en touch no
         existe. Con `Tooltip` en el sistema, un `title` puesto acá dibuja dos
         cajas diciendo lo mismo, una de ellas con la tipografía del SO en medio
         de la interfaz. El nombre accesible lo sigue dando `aria-label`, que es
         lo que el `title` no era.

         La ayuda visual la pone el call site envolviendo en `Tooltip`, y eso es
         mejor que un default: un icono que no se explica solo —el micrófono del
         composer, el `more_horiz` de una fila— la necesita, y uno inequívoco
         como la X de un modal no, donde una etiqueta que dice «Cerrar» sobre
         una cruz es ruido. */
      aria-label={label}
      className={cx(
        'relative inline-flex items-center justify-center transition-[background-color,color,box-shadow] duration-[120ms] ease-out',
        'disabled:opacity-45 disabled:pointer-events-none',
        variants[variant === 'ghost' && active ? 'muted' : variant],
        /* Cuadrado del alto de su paso: el `min-width` = `min-height` de
           Reshaped, que es lo que hace que un icono suelto y un botón con texto
           del mismo tamaño apoyen en la misma línea sin que nadie lo calcule.
           El radio es 10 en los tres y no el del paso: es la regla del sistema
           —`md` es lo cuadrado que se toca, `lg` lo que se toca con texto— y un
           icono suelto en radio 12 se ve descentrado, porque no tiene texto que
           balancee la curva. */
        c.square, 'rounded-md',
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={c.icon} />
      {/* El punto se apoya en la esquina del icono, no en la de la caja: como
          el icono está centrado, esa esquina está a (alto − icono) / 2 de cada
          borde, y el punto de 6 va centrado ahí. Con un offset fijo, en 32 caía
          sobre el glifo y en 40 quedaba flotando en el aire. */}
      {dot && <span className={cx('absolute size-1.5 rounded-full bg-accent ring-2 ring-surface', c.dot)} />}
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
  /* El pulgar viaja entre 12 y el ancho menos 12, así que la cuenta lleva su
     propio tamaño adentro: sin eso, en 0 y en 100 media pieza queda afuera. */
  const thumbAt = 'calc(var(--t) * (100% - 24px) + 12px)'
  /* El relleno termina en el **borde derecho** del pulgar, no en su centro, y
     esa es la cuenta que importa. Con el centro, en 100 el azul se quedaba 12px
     antes del final de la pista y el pulgar no alcanzaba a taparle la curva: se
     veía el redondeo del relleno y un pedazo de pista vacía a la derecha.

     Que termine en el borde funciona en los dos extremos por geometría, y no de
     casualidad: una píldora de 22 de alto cuyo lado derecho cae sobre el borde
     del pulgar tiene su centro de curvatura a 1px del centro del círculo, así
     que 1 + 11 = 12 y la curva queda tangente adentro del pulgar de 24. En 0 el
     relleno mide exactamente 24 y es esa misma píldora inscripta en el círculo:
     no asoma por ningún lado. En 100 llega justo a 100%. */
  const fillTo = 'calc(var(--t) * (100% - 24px) + 24px)'
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
        /* El tilde va en `--on-brand` también apagado: lo que lo esconde es la
           escala en 0, no el color. Con `text-transparent` el glifo tenía que
           aparecer y crecer a la vez, y una pieza que se destiñe mientras se
           mueve se ve sucia. */
        on ? 'bg-brand text-on-brand' : 'inset-relief bg-muted text-on-brand',
      )}
    >
      {/* La marca crece, no aparece. Es la misma receta que el disco del
          `Radio` —escala de 0 a 1 en 120ms, sin opacidad— y tiene que ser la
          misma: son la misma marca dicha en dos formas, y si una crece y la
          otra parpadea, una fila con las dos se lee como dos sistemas.

          Sin opacidad a propósito: el tilde se dibuja sobre el relleno azul,
          que aparece en los mismos 120ms, así que la pieza ya tiene de dónde
          salir. Desvanecerlo además lo deja gris a mitad de camino. */}
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

/* ------------------------------------------------------------------- Radio */

/**
 * La elección de una entre varias. Es 18, la misma medida del `Checkbox` y del
 * pulgar del switch, así una fila con los tres queda pareja.
 *
 * **Es el checkbox en redondo**, y esa es toda la regla: mismo relleno azul
 * prendido, misma receta hundida apagado, misma medida. Lo único que cambia es
 * la forma —círculo contra cuadrado— y la marca de adentro: el checkbox lleva
 * un tilde, el radio un disco. Dos piezas que dicen lo mismo —"esto lo elegí
 * yo"— no pueden dibujarse con dos recetas distintas, o la fila que las tiene
 * juntas se lee como dos sistemas.
 *
 * Por eso va **sin anillo**. El borde era justo lo que lo separaba del
 * checkbox: una pieza de papel con un canto alrededor, al lado de una casilla
 * que apagada es un hueco gris hundido y sin borde. Ahora apagados son el mismo
 * hueco.
 *
 * El orden de los dos círculos es lo que importa: **el azul es el de afuera y
 * el blanco el de adentro**. Al revés —papel afuera, punto azul adentro— la
 * pieza pesa lo mismo prendida que apagada, porque lo único que cambia es el
 * disco del medio. Con el relleno afuera, la opción elegida se ve de una
 * en toda la fila, que es para lo que existe el control.
 */
export function Radio({
  checked, onChange, label, disabled, id, tabIndex, ref,
}: {
  checked: boolean
  onChange: () => void
  /**
   * Va al `aria-label`. Cuando al lado hay texto visible tiene que ser **ese
   * texto entero** y no un resumen: el `aria-label` pisa lo que se ve, así que
   * con "No" al lado de "No hace falta" el lector de pantalla dice una cosa y
   * la pantalla otra, y quien maneja por voz nombra lo que lee y no pasa nada.
   */
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
        /* Las dos recetas son las del `Checkbox`, sin una sola diferencia: el
           relleno de marca prendido, el hueco gris hundido apagado. */
        checked ? 'bg-brand' : 'inset-relief bg-muted',
      )}
    >
      {/* El disco de adentro es 8 sobre 18, y el número se elige **par**: la
          diferencia con la caja tiene que repartirse en dos mitades enteras. Con
          9 sobraban 4.5 por lado, el disco caía en media grilla de píxeles y se
          veía corrido y sucio aunque el `justify-center` estuviera bien puesto.
          Con 8 sobran 10, o sea 5 enteros por lado — y por lo mismo el paso de
          acá para arriba o para abajo es de a 2, nunca de a 1: 7 vuelve a caer
          en media grilla.

          Va en `--on-brand`, el mismo blanco del tilde del checkbox, porque es
          lo mismo: la marca dibujada arriba del relleno de marca.

          Sale escalando en vez de aparecer, porque en una fila de opciones lo
          que cambia de lugar es el disco y un salto seco no deja ver de dónde a
          dónde fue. */}
      <span
        className={cx(
          'size-[8px] rounded-full bg-on-brand transition-transform duration-[120ms] ease-out',
          checked ? 'scale-100' : 'scale-0',
        )}
      />
    </button>
  )
}

/**
 * El grupo va suelto: las opciones sobre el papel, cada una con su etiqueta al
 * lado. **No hay píldora apagada detrás**, y eso es una decisión y no un
 * faltante: una pista gris con la pieza elegida flotando adentro es la receta
 * del `Segmented`, y un radio metido ahí es el mismo control dibujado dos
 * veces. Dos implementaciones de lo mismo se separan sola una de la otra con
 * cada cambio.
 *
 * El reparto queda así: opciones cortas que se comparan de un vistazo, un
 * `Segmented`; opciones que necesitan su propio texto al lado, este grupo.
 *
 * El teclado es el de un grupo de radios y no el de una lista de botones: una
 * sola parada de tabulación para todo el grupo —la opción elegida— y las
 * flechas mueven Y eligen. Es la diferencia entre tabular cuatro veces para
 * pasar un grupo y tabular una.
 */
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
    /* El foco se mueve con la elección y no al revés. En un grupo de radios las
       dos cosas son la misma: la flecha elige, y si el foco se quedara atrás la
       siguiente flecha saldría del lugar equivocado. */
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
          /* Una sola parada para todo el grupo: tabular entra en la elegida y
             vuelve a salir, en vez de recorrer las cuatro. Si no hay ninguna
             elegida, la primera viva toma la parada — si no, el grupo entero
             queda fuera del teclado. */
          tabIndex={o.value === value || (!live.some(l => l.value === value) && o.value === live[0]?.value) ? 0 : -1}
        />
      ))}
    </div>
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
                /* El relieve va por `--relief` y no por la utilidad
                   `shadow-raised`. La regla de foco suma el relieve adelante del
                   anillo leyendo esa variable; con la utilidad, la variable
                   queda sin escribir y la regla la resuelve a su valor inicial
                   —transparente— así que el chip elegido se planchaba justo al
                   tabular hasta él, que es el bug que el sistema de relieve vino
                   a cerrar. */
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
 *
 * **`leading` es un nodo y no un `IconName`**, al revés que el `icon` del
 * `TextField`. Ahí el icono es siempre un glifo del set; acá lo que se muestra
 * adelante del valor es de quien lo usa: el glifo de la categoría elegida, la
 * carpeta de color de un espacio, el avatar de una persona, un spinner. Tipar
 * la unión de glifos dejaba afuera a los otros tres y no ahorraba nada.
 *
 * **`loading` existe además de `leading`, y esa es la parte que se discutió.**
 * Un spinner pasado por `leading` se dibuja, y nada más: el control sigue
 * abriendo, y lo que abre mientras los datos no llegaron es una lista vacía o
 * —peor— una lista con las opciones viejas, que se puede elegir. Eso no lo
 * puede arreglar el nodo, porque no es contenido: es el estado del control. Con
 * `loading` puesto, el select no abre, avisa `aria-busy` y pone el spinner solo
 * si nadie pasó un `leading` propio.
 *
 * Lo que el componente NO hace es enterarse solo: no recibe promesas, no sabe
 * de fetch y no tiene estado de carga propio. Quien trae los datos sabe cuándo
 * está cargando y lo dice con un booleano.
 */
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

  /* Escape va por la pila compartida y no por el `keydown` de acá abajo. Con un
     listener propio, el listbox abierto adentro de un `Modal` dejaba dos
     capturas sobre `document` —la suya y la del modal— y las dos corrían: un
     Escape cerraba la lista y el modal de atrás en el mismo golpe.
     `stopPropagation` no alcanza contra un hermano registrado en el mismo nodo
     y la misma fase. */
  useEscape(open, useCallback(() => { setOpen(false); btn.current?.focus() }, []))

  /* El spinner es el default de `loading`, no su definición: quien quiera
     mostrar otra cosa mientras carga —el glifo de la categoría, apagado— pasa su
     `leading` y el control sigue sin abrir igual. */
  const leadingNode = loading ? leading ?? <Spinner size={16} /> : leading

  /* Un panel abierto tiene que cerrarse si los datos se van a recargar: con la
     lista arriba, `loading` llegando y el panel quieto, se queda una lista de
     opciones viejas que se puede elegir. */
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
        className="inline-flex h-9 items-center justify-between gap-2 rounded-md border border-field-line bg-field px-3 text-xs font-medium text-ink transition-colors duration-[120ms] hover:bg-field-hover aria-disabled:cursor-default aria-disabled:hover:bg-field"
      >
        {/* El `leading` y el valor viajan juntos en su propio flex: con los tres
            hijos sueltos, el `justify-between` reparte el aire entre el icono y
            el texto y el icono se despega del valor que describe. */}
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
          <Icon name="close" size={12} />
        </button>
      )}
    </Tag>
  )
}

/* ----------------------------------------------------------------- Divider */

/**
 * La línea que separa. Un píxel de `--border`, y nada más.
 *
 * Existe como pieza y no como una clase suelta por una razón práctica: la línea
 * estaba escrita a mano en seis lugares —`border-t border-line`, `border-b`,
 * un `<hr>` con `border-0`— y tres de ellos con un gris distinto. Cuál gris es
 * la línea del sistema es una decisión, y una decisión escrita seis veces se
 * desincroniza a la quinta.
 *
 * Es un `div` con `role="separator"` y no un `<hr>`: el `hr` es semánticamente
 * un corte temático del contenido y trae borde propio del navegador que hay que
 * apagar. Acá lo que hace falta es la línea y su rol, sin nada que deshacer.
 *
 * `data-divider` no es decoración: es lo que deja que un contenedor con padding
 * —el `Menu`— estire la línea hasta sus bordes sin que cada call site tenga que
 * saber cuánto padding tiene el padre.
 */
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
        /* El vertical lleva `self-stretch` para tomar el alto de la fila: sin
           eso, adentro de un flex con `items-center` mide cero y no se ve. */
        /* Horizontal SIN `w-full`, y no es lo mismo. Un bloque de ancho auto ya
           llena a su padre, y además es lo único que deja estirarlo con
           márgenes negativos: con `width: 100%` y dos márgenes distintos de
           auto, la caja queda sobreespecificada y el navegador ignora el
           margen derecho (CSS 2.1 §10.3.3). El separador full-bleed del `Menu`
           —`-mx-2` sobre el hijo— llegaba al borde izquierdo y se quedaba 16px
           corto a la derecha. */
        orientation === 'horizontal' ? 'h-px' : 'w-px self-stretch',
        className,
      )}
    />
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
 * Dos estados y nada más: con foto, o el círculo pastel con la inicial. No hay
 * prop de variante.
 *
 * **El fondo sin foto sale de la familia de marcas** —pastel con relieve y la
 * inicial en el mismo tono varios pasos más oscuro— y no de la familia viva.
 * Eso contradice lo que el sistema tenía asignado, y se cambió después de
 * medirlo: la inicial sobre pastel se lee MEJOR que el blanco sobre el relleno
 * vivo (4.51:1 contra su propio disco, contra 3.78:1). Lo que se pierde es
 * presencia del disco —1.91:1 contra el papel, donde el vivo daba 3.68:1—, y a
 * cambio el avatar deja de gritarle al texto que tiene al lado, que es el
 * problema real de una fila con cinco.
 *
 * El color sale del nombre, no de un random: si saliera de un random, la misma
 * persona cambiaría de color en cada render y el color dejaría de identificar a
 * nadie. El reparto va sobre `markColors` en orden de rueda, porque con los
 * tonos desordenados dos nombres consecutivos caían en dos tonos casi iguales.
 */
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
    /* Con foto, el color se queda igual de fondo: es lo que se ve mientras la
       imagen carga y lo que queda si no carga nunca. Un hueco gris en una fila
       de cinco avatares se lee como una persona sin nombre; la inicial sobre su
       color, no. */
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

/* --------------------------------------------------------------- TextField */

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  icon?: IconName
  suffix?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

/* Las tres alturas del `Button`, con los mismos radios, los mismos tamaños de
   icono y los mismos tamaños de letra. Un campo y el botón que lo acompaña en
   la misma fila tienen que medir lo mismo; con dos escaleras distintas, no hay
   combinación que cierre.

   Lo único que cambia respecto del botón es el padding lateral, y por una razón
   concreta: el texto de un botón está centrado y necesita aire a los dos lados,
   el de un campo arranca pegado a la izquierda y lo que sobra se lee como el
   campo vacío corrido. */
const fieldSizes = {
  sm: 'h-8 gap-1.5 rounded-md px-2.5 text-xs',
  md: 'h-9 gap-2 rounded-lg px-3 text-base',
  lg: 'h-10 gap-2 rounded-lg px-3 text-base',
} as const

/**
 * El campo de texto.
 *
 * **Es plano: un fondo y una línea de un píxel, sin relieve y sin sombra.** Fue
 * un hueco —el canto en tinta, la luz arriba, el labio oscuro abajo— y el
 * volumen se fue a propósito. El relieve del sistema dice dos cosas, "esto
 * sobresale" y "esto se aprieta", y un campo no es ninguna de las dos: es un
 * lugar donde apoyar texto. A 40 de alto por 300 de ancho el hueco tampoco
 * escala —lo que en un kbd de 20 se lee como una tecla, acá se lee como una
 * caja abollada— y encima dejaba al campo distinto del `Select` y del buscador
 * de la topbar, que ya eran borde plano. Ahora los tres se dibujan igual.
 *
 * El borde es `--field-border`, que es exactamente la línea que el relieve
 * dibujaba como canto: tinta en alpha, no un gris de la rampa. Sobre un tinte,
 * el opaco se ve como una línea sucia.
 *
 * **El input tapa la caja entera.** Esta es la parte que no se ve y es la que
 * más se siente: un `<input>` mide lo que mide su línea de texto —16px— y
 * dentro de una caja de 40 eso deja 12 muertos arriba y 12 abajo. Clickeabas la
 * mitad de arriba del campo y no pasaba nada. Con `h-full` el input ocupa el
 * alto entero, y con el margen negativo se come también el hueco que el `gap`
 * deja contra el icono y contra el suffix. Es lo mismo que hace Reshaped, y por
 * el mismo motivo: **lo que se ve como campo tiene que ser campo para el
 * mouse**.
 *
 * **El foco se marca una sola vez y en el borde de afuera.** El anillo global
 * de `:focus-visible` agarraba al `<input>` de adentro, que es más chico que el
 * campo: quedaba un rectángulo oscuro flotando adentro de la caja. Acá el input
 * se queda sin anillo (`shadow-none`) y
 * el que se enciende es el campo, con la clase `.field`. Apagar el del input hay
 * que hacerlo desde el CSS y no con una utilidad acá: la regla global de foco
 * está fuera de capa y una utilidad de Tailwind está adentro de una, y lo de
 * afuera le gana a lo de adentro por más específico que sea. Un
 * `focus-visible:shadow-none` en el input se lee bien y no hace nada.
 */
export function TextField({ icon, suffix, size = 'lg', className, ...rest }: TextFieldProps) {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20
  return (
    <div
      className={cx(
        /* `cursor-text` en el contenedor y no en el input: el cursor se hereda,
           así que el icono y el aire de los costados también dicen "acá se
           escribe". */
        'field flex cursor-text items-center border border-field-line bg-field',
        'has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-45',
        fieldSizes[size], className,
      )}
    >
      {icon && <Icon name={icon} size={iconSize} className="icon-muted shrink-0" />}
      <input
        className={cx(
          /* El texto de un campo va en 400 y no en el 500 de la interfaz: lo
             que escribís es contenido, no una etiqueta. A 14px el 500 se lee
             como un título corto metido adentro de la caja. */
          'h-full min-w-0 flex-1 bg-transparent font-normal text-ink outline-none placeholder:text-ink-muted',
          size === 'sm' ? '-mx-1.5 px-1.5' : '-mx-2 px-2',
        )}
        {...rest}
      />
      {suffix}
    </div>
  )
}

/* ---------------------------------------------------------------- Textarea */

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows' | 'style'> & {
  /** Las filas de arranque: el alto mínimo del campo. */
  rows?: number
  /** Hasta cuántas filas crece antes de scrollear. Sin esto, crece sin techo. */
  maxRows?: number
}

/**
 * El campo de varias líneas. Es el `TextField` estirado: la misma caja, el mismo
 * borde, el mismo fondo y el mismo anillo de foco, porque un campo de una línea
 * y uno de varias que no se parecen se leen como dos sistemas.
 *
 * **Crece con lo que escribís.** Un textarea de alto fijo obliga a elegir mal
 * dos veces: corto, y escribís mirando por una ranura; largo, y hay un rectángulo
 * vacío ocupando media pantalla hasta que alguien lo llene. Creciendo, el campo
 * mide lo que hay adentro.
 *
 * Tres cosas que no son obvias y que se pagan si faltan:
 *
 * · **Primero `height: auto`, después leer `scrollHeight`.** `scrollHeight` nunca
 *   es menor que el alto puesto, así que midiendo sin resetear el campo crece y
 *   no vuelve: borrás tres líneas y la caja se queda con el alto de antes.
 * · **El techo prende el scroll.** Al llegar a `maxRows` hay que pasar el
 *   `overflow-y` a `auto`, o el texto sigue existiendo sin forma de llegar a él.
 *   Abajo del techo va en `hidden`, o aparece una barra que titila en cada
 *   tecla mientras el campo todavía tiene lugar para crecer.
 * · **Se mide en un layout effect y no en un effect normal.** Midiendo después
 *   del paint, cada tecla que agranda el campo se ve como un salto: primero el
 *   cuadro con el alto viejo y el texto ya desbordado, y recién en el siguiente
 *   el alto nuevo.
 *
 * **El `resize` nativo se va.** Es una esquina que solo existe con mouse, y
 * arrastrarla deja al campo de un alto que el autogrow después pisa: dos cosas
 * peleando por lo mismo. El alto lo decide el contenido.
 */
export function Textarea({ rows = 3, maxRows, className, onChange, value, ...rest }: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const medir = useCallback(() => {
    const el = ref.current
    if (!el) return
    const cs = getComputedStyle(el)
    const line = parseFloat(cs.lineHeight) || 16
    const marco = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
      + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)
    el.style.height = 'auto'
    const alto = el.scrollHeight
    const techo = maxRows ? line * maxRows + marco : Infinity
    el.style.height = `${Math.min(alto, techo)}px`
    el.style.overflowY = alto > techo ? 'auto' : 'hidden'
  }, [maxRows])

  /* Se remide cuando cambia el valor y no solo al tipear: un campo controlado
     puede recibir texto de afuera —un borrador que se carga, un reset del
     formulario— y ahí no pasa ningún `onChange` por el que colgarse. */
  useLayoutEffect(medir, [medir, value, rows])

  return (
    <div
      className={cx(
        'field flex cursor-text border border-field-line bg-field',
        'has-[textarea:disabled]:pointer-events-none has-[textarea:disabled]:opacity-45',
        'rounded-lg px-3 py-2.5 text-base',
        className,
      )}
    >
      <textarea
        ref={ref}
        rows={rows}
        value={value}
        onChange={e => { medir(); onChange?.(e) }}
        className={cx(
          'min-w-0 flex-1 resize-none bg-transparent font-normal text-ink outline-none',
          'placeholder:text-ink-muted',
          /* El leading de la interfaz es 16 sobre 12px, que apretado para un
             bloque de varias líneas: en un párrafo, los renglones se tocan. Este
             es el único lugar del sistema donde el texto respira más. */
          'leading-[1.45]',
        )}
        {...rest}
      />
    </div>
  )
}

/* -------------------------------------------------------------------- Card */

/**
 * El contenedor de radio 24. Dos superficies y no una:
 *
 * · `paper` es papel — sobresale del fondo y tira sombra. Es lo que lleva
 *   contenido: una tarjeta de actividad, un panel.
 * · `muted` es un hueco — el mismo gris del fondo apagado, sin sombra, porque
 *   algo hundido no proyecta. Es para agrupar sin jerarquizar: una bandeja donde
 *   apoyar piezas, el fondo de una galería.
 *
 * La sombra es lo que las separa y no el color: una superficie apagada CON
 * sombra se lee como papel gris, que no es ninguna de las dos cosas.
 */
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
 * Pista completa más un arco encima. La pista es lo que evita que el arco se
 * lea como un pedazo de algo roto: sin ella, un arco suelto girando no dice
 * "esperá", dice que falta un trozo de la interfaz.
 *
 * El arco es de largo fijo y lo único que pasa es que gira. Antes latía —se
 * abría y se cerraba— con el argumento de que "con el largo variable, la espera
 * se lee como progreso aunque no lo sea". Es al revés: parecerse a una barra de
 * progreso que no avanza es peor que no parecerse a nada, y en el extremo
 * cerrado el arco se encogía hasta ser un punto, que se ve como un glitch. Un
 * largo constante girando parejo dice una sola cosa y la dice siempre igual.
 *
 * El arco **no es azul plano**: va con el degradado de la rampa de marca, del
 * 400 al 600. Es la misma idea que el relieve de una marca de lista —una pieza
 * de color plana se ve impresa y no puesta— con una diferencia: acá el salto es
 * de dos escalones y no de uno como en `--grad-brand`. Un botón reparte su
 * degradado en 36px de relleno y con un escalón alcanza; el arco es una línea
 * fina que se ve entera de una vez, y ahí un escalón no se nota.
 *
 * Y lleva un filo del color del papel entre el arco y la pista. Eso es lo que
 * lo despega: sin el filo, el arco y la pista son dos tintas pegadas del mismo
 * ancho y el arco parece pintado sobre el riel en vez de apoyado encima.
 *
 * El trazo **sí** escala: es el 17% del diámetro a cualquier tamaño, que es la
 * proporción medida sobre la referencia (trazo 8 con el agujero en el 66% del
 * diámetro). Estuvo fijo en 3px con el argumento de que "un anillo proporcional
 * en chico se tapa a sí mismo, el agujero desaparece". Eso es cierto de un
 * anillo gordo, no de este: al 17% el agujero queda en dos tercios y no se
 * cierra ni a los 16. Lo que el trazo fijo sí hacía era dejar el de 44 en 3
 * sobre 44 —0.068, un hilo— al lado del de 20 en 0.15. Dos piezas del mismo
 * componente que no se parecen entre sí.
 *
 * El piso de 2px es para que a tamaños chicos el trazo no caiga en el
 * medio píxel, donde el antialias lo apaga en vez de adelgazarlo.
 */
export function Spinner({ size = 20, label = 'Cargando', on = 'surface', className }: {
  size?: number
  label?: string
  /**
   * Sobre qué está apoyado. No es decoración: el filo tiene que ser del color
   * del fondo de atrás y la pista tiene que salir del color del texto de ese
   * fondo. Es lo mismo que el `ring` de `AvatarGroup` y por el mismo motivo —
   * una pieza no puede saber sobre qué la pusieron. Con el default puesto
   * dentro de un botón oscuro, el filo blanco se ve como un halo y la pista
   * gris clara como un aro de otro sistema.
   */
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
  /* El filo es el arco más un reborde de 0.85 por lado. Al doble de ancho —que
     fue el primer intento— se comía la caja: el anillo de color quedaba en 16.6
     de los 20 y el spinner se veía más chico de lo que se le pidió. Con el
     reborde fijo, el color llega al 93% de la caja a cualquier tamaño. */
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
          {/* De arriba a abajo y a la derecha, que es por donde va el arco: con
              el arco arrancando a las 12 y girando en sentido horario, el claro
              queda en la punta que entra y el oscuro en la que sale. */}
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
