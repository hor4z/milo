import {
  cloneElement, createContext, isValidElement, useContext, useEffect, useId, useLayoutEffect,
  useRef, useState, type ReactElement, type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { IconButton } from './primitives'
import { Menu, MenuItem } from './menu'
import type { IconName } from './icon'

/* ------------------------------------------------------------------ Portal */

/**
 * El host se crea durante el render y se cuelga del body en un layout effect.
 *
 * La versión obvia —crear el div dentro del effect y guardarlo en estado— hace
 * que el primer render devuelva `null`, y eso rompe a cualquiera que mida o
 * enfoque el contenido: en el commit en el que el overlay "ya abrió", sus nodos
 * todavía no existen. Portalear a un div desprendido es válido: los refs se
 * asignan igual, y el contenido aparece en pantalla cuando el div se cuelga.
 *
 * **Flotante adentro de flotante.** Todos los hosts son hermanos colgados del
 * body, así que entre dos abiertos manda el orden del DOM y no quién abrió a
 * quién: un `Select` abierto adentro de un modal quedaba tapado por el modal, y
 * la única defensa era subirle el `z-index` a mano en el call site — un número
 * que hay que mantener sincronizado desde el otro lado del árbol.
 *
 * Acá cada `Portal` sabe a qué profundidad está —el contexto viaja por el árbol
 * de React aunque el DOM sea plano— y se pone un `z-index` un escalón arriba de
 * su padre. Lo de adentro queda arriba de lo que lo abrió, siempre, sin que
 * nadie escriba un número.
 *
 * El `z-index` va en el host y eso crea un contexto de apilado por overlay, que
 * es la otra mitad del arreglo: los `z-40` / `z-50` de adentro pasan a ordenar
 * solo entre ellos —velo contra panel— y dejan de competir con los de otros
 * overlays.
 */
const PortalDepth = createContext(0)

export function Portal({ children }: { children: ReactNode }) {
  const depth = useContext(PortalDepth)
  const [host] = useState(() => {
    const el = document.createElement('div')
    el.setAttribute('data-portal', String(depth))
    /* `relative` para que el z-index agarre: sin posición, un z-index no hace
       nada y el arreglo entero sería invisible. */
    el.style.position = 'relative'
    el.style.zIndex = String(1000 + depth * 10)
    return el
  })
  useLayoutEffect(() => {
    document.body.appendChild(host)
    return () => host.remove()
  }, [host])
  return createPortal(
    <PortalDepth.Provider value={depth + 1}>{children}</PortalDepth.Provider>,
    host,
  )
}

/* --------------------------------------------------- bloqueo de scroll ---- */

/**
 * Bloquear el scroll del fondo mientras hay un overlay abierto.
 *
 * El `padding-right` compensatorio no es un detalle de gusto: al poner
 * `overflow: hidden` desaparece la scrollbar, el viewport gana ~10px de ancho y
 * toda la página salta a la derecha justo cuando se abre el modal. Se mide el
 * ancho real de la barra y se devuelve como padding.
 *
 * El contador es para overlays anidados: sin él, cerrar un dropdown que estaba
 * arriba de un modal le devuelve el scroll al fondo con el modal todavía abierto.
 */
let lockCount = 0
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    lockCount++
    if (lockCount === 1) {
      const gap = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      if (gap > 0) document.body.style.paddingRight = `${gap}px`
    }
    return () => {
      lockCount--
      if (lockCount === 0) {
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
    }
  }, [active])
}

/* ------------------------------------------------------ Escape encadenado - */

/**
 * `Escape` tiene que cerrar solo el overlay de arriba. Una pila global resuelve
 * eso: cada overlay se anota al abrirse y solo reacciona si es el último.
 */
const escStack: symbol[] = []
export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return
    const token = Symbol('overlay')
    escStack.push(token)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (escStack[escStack.length - 1] !== token) return
      e.stopPropagation()
      onEscape()
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      const i = escStack.indexOf(token)
      if (i >= 0) escStack.splice(i, 1)
    }
  }, [active, onEscape])
}

/* ----------------------------------------------------------- foco atrapado */

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/**
 * Tab no se sale del modal, y al cerrar el foco vuelve a donde estaba. Lo
 * segundo se olvida siempre y es lo que más se nota con teclado: sin eso, al
 * cerrar el foco cae en el <body> y el próximo Tab arranca desde el principio
 * de la página.
 */
export function useFocusTrap(active: boolean, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return
    const previous = document.activeElement as HTMLElement | null
    const node = ref.current

    /* Poner el foco no alcanza: hay que confirmar que quedó puesto.
       Entre que este efecto corre y el frame siguiente, el contenido puede
       llegar un tick tarde (una lista que se llena) o el nodo puede haberse
       desprendido y vuelto a colgar, y en ese viaje el foco se cae al <body>
       sin que nadie avise. Por eso se reintenta mientras el foco no esté
       adentro, en vez de enfocar una sola vez y confiar. */
    /* Se enfoca el contenedor del diálogo, no su primer control.
       Enfocar "el primero enfocable" parece más servicial y sale mal: el
       navegador scrollea para traer a la vista lo que enfoca, así que con
       contenido que se acomoda en frames sucesivos el panel aparece corrido y
       la primera fila queda tapada. Con el contenedor enfocado, el lector de
       pantalla anuncia el diálogo, Tab entra en orden desde arriba y nada se
       mueve. `preventScroll` es el cinturón de seguridad. */
    const ensureFocus = () => {
      if (!node || node.contains(document.activeElement)) return
      const target = node.querySelector<HTMLElement>('[data-autofocus]') ?? node
      target.focus({ preventScroll: true })
    }
    ensureFocus()
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      ensureFocus()
      raf2 = requestAnimationFrame(ensureFocus)
    })

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !node) return
      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(el => el.offsetParent !== null)
      if (!items.length) return
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus() }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      document.removeEventListener('keydown', onKey)
      /* Se devuelve el foco solo si hay a dónde devolverlo. Si lo que estaba
         enfocado era el <body> —o ya salió del documento— "restaurar" es mandar
         el foco a la nada, y encima pisa el que este mismo efecto acaba de
         poner cuando React reejecuta los efectos en desarrollo. */
      if (previous && previous !== document.body && previous.isConnected) previous.focus()
    }
  }, [active, ref])
}

/* ----------------------------------------------------------------- Popover */

/**
 * Un panel anclado a su disparador. **No tiene aspecto**: pone el panel donde
 * va y se encarga de cerrarlo, y el dibujo lo pone quien lo usa.
 *
 * Ese corte es el punto de la pieza. Lo mismo estaba escrito tres veces —el
 * menú, el panel de avisos y el listbox del `Select`— con la misma lista de
 * cuidados en cada copia, que es lo que de verdad cuesta acá:
 *
 * · Se posiciona en `useLayoutEffect` y no en un effect normal: midiendo después
 *   del paint, el panel aparece un cuadro en 0,0 y se ve el salto.
 * · Se cierra con `pointerdown` afuera y no con `click`: con click, el mismo
 *   gesto que abre otro panel lo cierra y lo vuelve a abrir, y parpadea.
 * · El `scroll` en captura es la única forma de enterarse del scroll de la
 *   página, pero atrapa el de cualquier hijo: sin filtrar por origen, scrollear
 *   la lista del propio panel lo cierra. Un `resize` sí cierra siempre — ahí la
 *   posición anclada ya no vale.
 * · `Escape` cierra el de más arriba y no todos, por la pila global.
 *
 * Tres copias de esa lista son tres lugares donde falta un arreglo. El menú y
 * el panel de avisos ya salen de acá; **el `Select` todavía no**, y no por
 * olvido: su teclado —flechas, Enter, Home/End— está atado a su propio estado de
 * abierto, así que mudarlo es mover también eso. Queda como el tercer call site
 * y como la prueba de si esta pieza alcanza.
 *
 * **Se da vuelta solo.** Si abajo del disparador no entra y arriba sí, el panel
 * sube. Para eso hace falta medir el panel ya montado, que es gratis: el
 * `Portal` cuelga su host en su propio layout effect, y los effects de los hijos
 * corren antes que los del padre, así que cuando esta medición ocurre el panel
 * ya está en el documento.
 *
 * El `width` es opcional y también por eso: sin él se mide el ancho real del
 * panel, que es lo que un menú que se adapta a su contenido necesita para poder
 * alinearse a la derecha.
 *
 * La única concesión visual es el velo, y no es decoración: es la superficie que
 * apaga el resto y que además se puede clickear para cerrar. Una lista que pide
 * leerse entera lo necesita; un menú de cuatro opciones, no.
 */
export function Popover({
  trigger, children, align = 'end', width, offset = 8, veil, onOpenChange,
}: {
  trigger: (props: {
    onClick: () => void
    'aria-expanded': boolean
    ref: React.Ref<HTMLButtonElement>
    'data-open': boolean
  }) => ReactNode
  children: (close: () => void) => ReactNode
  align?: 'start' | 'end'
  /** Sin esto se mide el ancho real del panel para alinearlo y encajarlo. */
  width?: number
  offset?: number
  veil?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  const set = (v: boolean) => { setOpen(v); onOpenChange?.(v) }
  const close = () => set(false)

  useEscape(open, close)

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    const w = width ?? panelRef.current?.offsetWidth ?? 0
    const h = panelRef.current?.offsetHeight ?? 0
    const left = align === 'end' ? r.right - w : r.left
    /* Abajo si entra, arriba si no. El margen de 8 contra el borde de la
       ventana es el mismo que el de los costados: un panel pegado al canto se
       ve cortado aunque entre. */
    const cabeAbajo = r.bottom + offset + h <= window.innerHeight - 8
    const cabeArriba = r.top - offset - h >= 8
    setPos({
      top: cabeAbajo || !cabeArriba ? r.bottom + offset : r.top - offset - h,
      left: Math.max(8, Math.min(left, window.innerWidth - w - 8)),
    })
  }, [open, align, width, offset])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return
      close()
    }
    const onScroll = (e: Event) => {
      if (e.type === 'scroll' && panelRef.current?.contains(e.target as Node)) return
      close()
    }
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open])

  return (
    <>
      {trigger({
        onClick: () => set(!open),
        'aria-expanded': open,
        ref: triggerRef,
        'data-open': open,
      })}
      {open && (
        <Portal>
          {/* El velo va sin blur y por debajo del panel. Atenúa sin desenfocar:
              el fondo se sigue reconociendo, que es la diferencia entre "esto
              está encima" y "cambiaste de pantalla". */}
          {veil && <div className="ui-fade fixed inset-0 z-40 bg-veil" onClick={close} />}
          <div
            ref={panelRef}
            style={{ top: pos.top, left: pos.left, width }}
            className="fixed z-50"
          >
            {children(close)}
          </div>
        </Portal>
      )}
    </>
  )
}


/* ----------------------------------------------------------------- Tooltip */

/* Cuándo se cerró el último tooltip, en milisegundos. Es una variable de módulo
   y no estado de un componente a propósito: **el retraso se comparte entre
   todos**. El primero de una barra de iconos tarda, porque un tooltip que
   aparece apenas el mouse pasa por encima salta solo mientras cruzás la
   pantalla para ir a otra cosa. Pero una vez que uno se mostró, el de al lado
   tiene que aparecer al instante: si cada uno espera su propio medio segundo,
   recorrer seis iconos son tres segundos de espera y la fila se siente trabada.
   Es el mismo grupo de delay que tienen los sistemas que se sienten rápidos. */
let ultimoCierre = 0

/* Cuánto dura la ventana en la que el siguiente tooltip abre sin esperar. */
const VENTANA_TIBIA = 400

/**
 * La etiqueta que dice qué hace un control que no lo dice solo: un icono suelto,
 * un valor truncado, una acción con una consecuencia que conviene aclarar.
 *
 * **No es un `Popover` chico.** Un popover se abre con click, atrapa el
 * `pointerdown` de la página y puede contener cosas que se tocan. Un tooltip se
 * abre solo —hover o foco de teclado—, no recibe el mouse (`pointer-events:
 * none`, o taparía justo el botón que explica) y no lleva nada interactivo
 * adentro: lo que hay adentro no se puede alcanzar ni con mouse ni con teclado.
 * Si tiene un link o un botón, es un popover y no esto.
 *
 * **Envuelve en vez de pedir un render prop.** Los eventos burbujean, así que el
 * `<span>` de afuera se entera del hover y del foco del control que envuelve sin
 * pedirle nada: funciona con cualquier hijo, incluso uno que no reenvíe props.
 * Lo único que sí se le pasa al hijo es el `aria-describedby`, con
 * `cloneElement`, porque un `span` sin rol no le describe nada a un lector de
 * pantalla; si el hijo no reenvía props, se pierde solo eso y el tooltip se
 * sigue viendo.
 *
 * **Se abre con el teclado, pero solo cuando el foco es del teclado.** Con un
 * `onFocus` pelado, clickear el botón deja el tooltip puesto encima de lo que
 * acabás de tocar. El `:focus-visible` es lo que separa "llegué tabulando y
 * necesito saber qué es esto" de "lo acabo de clickear y ya sé".
 *
 * **En touch no aparece.** No hay hover que lo abra ni forma de cerrarlo sin
 * tocar otra cosa: el `pointerType` que no es `mouse` se ignora, y lo que el
 * tooltip diga tiene que estar también en el `aria-label` del control.
 *
 * Sin flecha, a propósito: ningún overlay del sistema la tiene, y una flecha
 * pide un canto y un borde que estas cajas no llevan.
 */
export function Tooltip({ label, children, side = 'top', delay = 500 }: {
  label: ReactNode
  children: ReactNode
  /** Dónde va si entra. Si no entra de ese lado, se da vuelta. */
  side?: 'top' | 'bottom'
  delay?: number
}) {
  const [open, setOpen] = useState(false)
  const anchor = useRef<HTMLSpanElement>(null)
  const bubble = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  /* Espejo de `open` para leerlo desde los handlers sin volver a suscribirlos.
     Lo que se necesita saber al cerrar es si el tooltip llegó a verse, y eso el
     estado no lo cuenta a tiempo: dentro del mismo handler todavía es el valor
     del render anterior. */
  const visible = useRef(false)
  const id = useId()

  const cancelar = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }
  const abrir = () => {
    cancelar()
    const espera = Date.now() - ultimoCierre < VENTANA_TIBIA ? 0 : delay
    timer.current = setTimeout(() => { visible.current = true; setOpen(true) }, espera)
  }
  const cerrar = () => {
    cancelar()
    /* La ventana tibia solo cuenta si este tooltip llegó a mostrarse. Marcándola
       siempre, cruzar la fila de iconos a las apuradas —sin que ninguno alcance
       a abrir— dejaba el grupo caliente igual, y el siguiente que tocaras abría
       de golpe sin que nunca se hubiera visto uno. */
    if (visible.current) ultimoCierre = Date.now()
    visible.current = false
    setOpen(false)
  }

  /* El timer tiene que morir con el componente: un control que se desmonta
     mientras el mouse está encima —una fila que se borra, un menú que cierra—
     dejaba el `setTimeout` vivo y el tooltip abría contra un ancla que ya no
     existe. */
  useEffect(() => cancelar, [])

  useEscape(open, cerrar)

  useLayoutEffect(() => {
    if (!open || !anchor.current) return
    const r = anchor.current.getBoundingClientRect()
    const w = bubble.current?.offsetWidth ?? 0
    const h = bubble.current?.offsetHeight ?? 0
    const cabeArriba = r.top - 8 - h >= 8
    const cabeAbajo = r.bottom + 8 + h <= window.innerHeight - 8
    const arriba = side === 'top' ? cabeArriba || !cabeAbajo : !cabeAbajo && cabeArriba
    setPos({
      top: arriba ? r.top - 8 - h : r.bottom + 8,
      /* Centrado sobre el control, y pegado a 8 del borde si no entra: un
         tooltip de un icono de la punta del sidebar se sale de la ventana. */
      left: Math.max(8, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 8)),
    })
  }, [open, side])

  /* Anclado a un control que se movió es un tooltip apuntando al aire. Acá no
     hace falta filtrar el scroll por origen como en el `Popover` —adentro de un
     tooltip no hay nada que scrollear— así que cualquier scroll lo cierra. */
  useEffect(() => {
    if (!open) return
    window.addEventListener('scroll', cerrar, true)
    window.addEventListener('resize', cerrar)
    return () => {
      window.removeEventListener('scroll', cerrar, true)
      window.removeEventListener('resize', cerrar)
    }
  }, [open])

  return (
    <>
      <span
        ref={anchor}
        /* `inline-flex` y no `inline-block`: el span tiene que medir exactamente
           lo que mide el control, o el tooltip se centra sobre una caja con
           espacio de línea de más y queda corrido. */
        className="inline-flex"
        onPointerEnter={e => { if (e.pointerType === 'mouse') abrir() }}
        onPointerLeave={cerrar}
        /* El click ya dijo lo que el tooltip explicaba. */
        onPointerDown={cerrar}
        onFocus={e => { if ((e.target as HTMLElement).matches?.(':focus-visible')) abrir() }}
        onBlur={cerrar}
      >
        {isValidElement(children)
          ? cloneElement(children as ReactElement<{ 'aria-describedby'?: string }>,
              { 'aria-describedby': open ? id : undefined })
          : children}
      </span>

      {open && (
        <Portal>
          <div
            ref={bubble}
            id={id}
            role="tooltip"
            style={{ top: pos.top, left: pos.left }}
            className="ui-fade pointer-events-none fixed z-[60] max-w-[240px] rounded-md bg-solid px-2 py-1 text-xs font-medium text-on-solid shadow-popover"
          >
            {label}
          </div>
        </Portal>
      )}
    </>
  )
}

/* ---------------------------------------------------------------- Dropdown */

/** Una opción de la lista del `Dropdown`. La fila dibujada es `MenuItem`, el
 *  componente: este tipo es la forma corta de escribirla como dato. */
export type DropdownItem = {
  label: string
  icon?: IconName
  shortcut?: string
  danger?: boolean
  disabled?: boolean
  onSelect?: () => void
}

/**
 * El menú de opciones escrito como lista, que es lo más corto cuando el menú no
 * tiene nada raro: cuatro filas con su icono y su acción.
 *
 * No dibuja nada por su cuenta — es `Popover` (el comportamiento) más `Menu` y
 * `MenuItem` (la caja y la fila). Por eso una fila de acá y una escrita a mano
 * son la misma fila, y no dos parecidas que se van separando.
 *
 * Cuando el menú necesita un separador, un rótulo de grupo o un submenú, la
 * lista deja de alcanzar: ahí se arma con las piezas adentro de un `Popover`.
 */
export function Dropdown({
  trigger, items, align = 'end', width = 220,
}: {
  trigger: (props: { onClick: () => void; 'aria-expanded': boolean; ref: React.Ref<HTMLButtonElement> }) => ReactNode
  items: DropdownItem[]
  align?: 'start' | 'end'
  width?: number
}) {
  return (
    <Popover
      align={align}
      width={width}
      trigger={({ onClick, ref, 'aria-expanded': expanded }) => trigger({ onClick, ref, 'aria-expanded': expanded })}
    >
      {close => (
        <Menu>
          {items.map((item, i) => (
            <MenuItem
              key={i}
              icon={item.icon}
              shortcut={item.shortcut}
              danger={item.danger}
              disabled={item.disabled}
              onSelect={() => { item.onSelect?.(); close() }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Popover>
  )
}

/* ------------------------------------------------------------------- Modal */

export function Modal({
  open, onClose, children, width = 620, label,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  width?: number
  label: string
}) {
  const panel = useRef<HTMLDivElement>(null)
  useScrollLock(open)
  useEscape(open, onClose)
  useFocusTrap(open, panel)
  if (!open) return null
  return (
    <Portal>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        {/* El backdrop es blur + una capa muy tenue, no un negro al 50%: el
            contexto de abajo se sigue leyendo y el modal no se siente un cambio
            de página. */}
        <div className="ui-fade absolute inset-0 bg-scrim backdrop-blur-[3px]" onClick={onClose} />
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
          style={{ width, maxWidth: '100%' }}
          className="ui-zoom relative z-10 max-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl bg-surface shadow-popover ring-1 ring-line"
        >
          {children}
        </div>
        {/* La X vive afuera del panel, flotando en la esquina del viewport:
            adentro competiría con el título de la sección. Radio 12 como
            cualquier otro control cuadrado de 40 del sistema — el círculo era
            una excepción sin motivo. */}
        <IconButton
          icon="close"
          label="Cerrar"
          variant="solid"
          size="md"
          onClick={onClose}
          className="!absolute top-4 right-4 z-20 !rounded-lg"
        />
      </div>
    </Portal>
  )
}
