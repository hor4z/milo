import type { ReactNode } from 'react'
import { cx, Kbd } from './primitives'
import { Icon, type IconName } from './icon'

/* -------------------------------------------------------------------- Menú */

/**
 * El menú, en piezas. Es el mismo corte que la `Table`: no un componente que
 * recibe una lista de opciones, sino un panel y filas que se arman adentro.
 *
 * El motivo es el mismo y ya se vio acá: la versión de lista —`items: {label,
 * icon, onSelect}[]`— alcanza hasta el primer menú que necesita un separador,
 * un rótulo de grupo, un atajo de teclado o una opción destructiva. A partir de
 * ahí cada necesidad nueva es una prop nueva en el objeto, y el JSX de una fila
 * termina escrito como datos: un `render` por opción, que es el mismo JSX pero
 * sin poder leerlo de arriba abajo.
 *
 * `Dropdown` sigue tomando `items` y no se va a ningún lado — para un menú de
 * cuatro opciones sin nada raro, escribir la lista es más corto. Pero por dentro
 * arma estas mismas piezas, así que hay **una sola receta** de fila de menú y no
 * dos que se van separando.
 *
 * Lo que `Menu` no hace es abrirse: eso es el `Popover`, que no tiene aspecto.
 * Uno pone la caja, el otro el comportamiento.
 */
export function Menu({ children, width, className }: {
  children: ReactNode
  width?: number
  className?: string
}) {
  return (
    <div
      role="menu"
      style={width ? { width } : undefined}
      className={cx(
        /* Radio 16 y no 20: la escala del sistema es 6·10·12·16·24 y el 20 era
           el único valor inventado que quedaba.

           **Y el padding baja a 4 en el mismo movimiento**, que es la parte que
           no se puede saltear: la regla del anidado dice que el radio del hijo
           es el del padre menos su padding, y la fila lleva 12. Con 16 y 8 de
           padding pediría 8 —que ni siquiera está en la escala— y las dos curvas
           dejarían de verse como una sola pieza. 16 − 4 = 12, que es justo lo
           que `MenuItem` ya tenía. El 20 cerraba la misma cuenta con 8, y por
           eso cambiar solo el radio rompía el anidado en silencio. */
        'ui-pop rounded-xl border border-line bg-popover p-1 shadow-popover',
        /* El separador se estira hasta el borde del panel, y la cuenta la hace
           el panel porque es el que conoce su padding: 4 de cada lado. Si la
           hiciera el separador, cada call site tendría que acordarse de un
           número que no es suyo — y si este margen y el padding de arriba se
           separan, la línea deja de llegar al borde o se pasa de largo. */
        '[&>[data-divider]]:-mx-1 [&>[data-divider]]:my-1.5',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * Una fila del menú.
 *
 * La geometría es la del item que tenía el `Dropdown` adentro: 40 de alto,
 * radio 12, 10 de padding y el icono en gris a 20. El icono va en gris y el
 * texto en tinta — al revés, con el texto apagado, el menú entero se lee como
 * deshabilitado.
 *
 * Lo que se le suma es lo que un menú necesita tarde o temprano:
 *
 * · `shortcut` — el atajo, en un `Kbd`, contra el borde derecho. Es la misma
 *   pieza hundida que el resto del sistema y no un texto gris: lo que dice que
 *   es una tecla es el relieve, no el tamaño.
 * · `hint` — una línea de apoyo a la derecha, para lo que no es una tecla (una
 *   cuenta, un estado). Va en gris.
 * · `checked` — el tilde a la derecha, para un menú de opciones donde una está
 *   puesta. No usa el azul del checkbox: acá la marca es el tilde solo, porque
 *   una casilla azul adentro de un menú se lee como otro control.
 * · `submenu` — el chevron, que dice que hay otro nivel. **No abre nada**: el
 *   que abre es quien lo use, con otro `Popover`.
 * · `danger` — la única opción que cambia de color en todo el sistema, y por eso
 *   se ve. Texto en `--bad` y hover en `--bad-subtle`; el icono NO va en gris,
 *   porque el gris es lo que apaga y esto es lo contrario.
 *
 * El orden de la derecha es fijo —atajo, hint, tilde, chevron— y nunca hay más
 * de uno: los cuatro ocupan el mismo lugar y compiten por el mismo significado.
 */
export function MenuItem({
  children, icon, shortcut, hint, checked, submenu, danger, disabled, onSelect, className,
}: {
  children: ReactNode
  icon?: IconName
  /** El atajo, en un Kbd. Ej: `⌘K`. */
  shortcut?: string
  /** Una línea de apoyo a la derecha, en gris. */
  hint?: string
  /** El tilde de "esta es la que está puesta". */
  checked?: boolean
  /** El chevron de "hay otro nivel". No abre nada por su cuenta. */
  submenu?: boolean
  /** Borrar, salir, revocar: lo que no se deshace. */
  danger?: boolean
  disabled?: boolean
  onSelect?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      /* Una opción que se marca no es un `menuitem`: es un `menuitemradio`, y su
         estado va en `aria-checked`. Con el tilde dibujado y nada más, la fila
         elegida de «Vista» se veía elegida y se leía igual que las otras dos. */
      role={checked === undefined ? 'menuitem' : 'menuitemradio'}
      aria-checked={checked}
      onClick={onSelect}
      className={cx(
        'flex h-10 w-full items-center gap-3.5 rounded-lg px-2.5 text-left text-xs font-semibold',
        'transition-colors duration-[120ms]',
        'disabled:pointer-events-none disabled:opacity-45',
        danger ? 'text-bad hover:bg-bad-subtle' : 'text-ink hover:bg-hover',
        className,
      )}
    >
      {icon && <Icon name={icon} size={20} className={danger ? undefined : 'icon-muted'} />}
      {/* `min-w-0` y `truncate`: el nombre de un espacio puede ser largo y el
          menú tiene ancho fijo. Sin esto la fila empuja el atajo afuera del
          panel en vez de cortarse. */}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {shortcut && <Kbd>{shortcut}</Kbd>}
      {hint && <span className="shrink-0 text-2xs font-medium text-ink-muted">{hint}</span>}
      {checked && <Icon name="check" size={18} />}
      {/* El chevron se pega un poco más al borde que el resto: es un glifo casi
          vacío, y con el mismo padding que un texto se ve suelto. */}
      {submenu && <Icon name="chevron_right" size={18} className="icon-muted -mr-1" />}
    </button>
  )
}

/**
 * El rótulo de un grupo de opciones.
 *
 * Va en tinta y no en gris, por la misma regla que la cabecera de la `Table`:
 * en 11 con `tracking-wide` el tamaño ya dice que es un rótulo, y el gris encima
 * lo apaga tanto que hay que buscar de qué es cada grupo. El gris es para lo que
 * acompaña a un dato, no para lo que lo nombra.
 */
export function MenuLabel({ children }: { children: ReactNode }) {
  /* `presentation` y no un `<div>` suelto: adentro de un `role="menu"` los
     únicos hijos permitidos son `menuitem*`, `group` y `separator`, así que un
     div con texto queda en tierra de nadie y el lector de pantalla puede
     descartarlo. Sacándolo del árbol a propósito, el rótulo es lo que de verdad
     es —una ayuda visual— y no una fila fantasma que se puede enfocar. */
  return (
    <div role="presentation" className="px-2.5 pt-2 pb-1.5 text-2xs font-semibold tracking-wide text-ink">
      {children}
    </div>
  )
}
