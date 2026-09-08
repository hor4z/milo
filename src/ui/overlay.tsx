import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx, IconButton } from './primitives'
import { Icon, type IconName } from './icon'

/* ------------------------------------------------------------------ Portal */

/**
 * El host se crea durante el render y se cuelga del body en un layout effect.
 *
 * La versión obvia —crear el div dentro del effect y guardarlo en estado— hace
 * que el primer render devuelva `null`, y eso rompe a cualquiera que mida o
 * enfoque el contenido: en el commit en el que el overlay "ya abrió", sus nodos
 * todavía no existen. Portalear a un div desprendido es válido: los refs se
 * asignan igual, y el contenido aparece en pantalla cuando el div se cuelga.
 */
export function Portal({ children }: { children: ReactNode }) {
  const [host] = useState(() => {
    const el = document.createElement('div')
    el.setAttribute('data-portal', '')
    return el
  })
  useLayoutEffect(() => {
    document.body.appendChild(host)
    return () => host.remove()
  }, [host])
  return createPortal(children, host)
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

/* ---------------------------------------------------------------- Dropdown */

export type MenuItem = { label: string; icon?: IconName; onSelect?: () => void }

export function Dropdown({
  trigger, items, align = 'end', width = 220,
}: {
  trigger: (props: { onClick: () => void; 'aria-expanded': boolean; ref: React.Ref<HTMLButtonElement> }) => ReactNode
  items: MenuItem[]
  align?: 'start' | 'end'
  width?: number
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const id = useId()

  useEscape(open, () => setOpen(false))

  /* La posición se calcula con `layout` y no en un effect normal: si se mide
     después del paint, el menú aparece un frame en 0,0 y se ve el salto. */
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    const left = align === 'end' ? r.right - width : r.left
    /* Que no se salga por abajo ni por los costados de la ventana. */
    setPos({
      top: Math.min(r.bottom + 8, window.innerHeight - 16),
      left: Math.max(8, Math.min(left, window.innerWidth - width - 8)),
    })
  }, [open, align, width])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (menuRef.current?.contains(t) || triggerRef.current?.contains(t)) return
      setOpen(false)
    }
    /* `pointerdown` y no `click`: con click, el mismo gesto que abre otro menú
       lo cierra y lo vuelve a abrir, y parpadea. */
    document.addEventListener('pointerdown', onDown)
    /* `scroll` en captura es la única forma de enterarse del scroll de la
       página, pero atrapa también el de cualquier elemento de adentro. Sin
       filtrar el origen, scrollear la lista del propio panel lo cierra. Un
       resize sí lo cierra siempre: ahí la posición anclada ya no vale. */
    const onScroll = (e: Event) => {
      if (e.type === 'scroll' && menuRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
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
      {trigger({ onClick: () => setOpen(o => !o), 'aria-expanded': open, ref: triggerRef })}
      {open && (
        <Portal>
          <div
            ref={menuRef}
            id={id}
            role="menu"
            style={{ top: pos.top, left: pos.left, width }}
            className="ui-pop fixed z-50 rounded-[20px] border border-line bg-popover p-2 shadow-popover"
          >
            {items.map((item, i) => (
                <button
                  key={i}
                  role="menuitem"
                  onClick={() => { item.onSelect?.(); setOpen(false) }}
                  className={cx(
                    'flex h-10 w-full items-center gap-3.5 rounded-lg px-2.5 text-left text-xs font-semibold',
                    'text-ink transition-colors duration-[120ms] hover:bg-hover',
                  )}
                >
                  {/* El icono va en gris y el texto en tinta: al revés —texto
                      gris— el menú entero se lee como deshabilitado. El trazo
                      sube a 1.5 porque en gris el de 1 se apaga demasiado. */}
                  {item.icon && <Icon name={item.icon} size={20} weight={1.5} className="text-icon-muted" />}
                  {item.label}
                </button>
            ))}
          </div>
        </Portal>
      )}
    </>
  )
}

/* ----------------------------------------------------------------- Popover */

/**
 * Un panel anclado a su disparador. Es el `Dropdown` sin la lista de items:
 * sirve para lo que tiene contenido propio —un panel de avisos, un selector de
 * fecha— en vez de opciones.
 *
 * Comparte los tres cuidados del menú: se posiciona en `layout` para que no se
 * vea el salto desde 0,0; se cierra con `pointerdown` afuera y no con `click`,
 * porque con click el mismo gesto que abre otro panel lo cierra y lo reabre; y
 * se cierra al scrollear, porque un panel anclado que se queda quieto mientras
 * el fondo se mueve se ve pegado a la nada.
 */
export function Popover({
  trigger, children, align = 'end', width = 384, offset = 8, veil,
}: {
  trigger: (props: { onClick: () => void; 'aria-expanded': boolean; ref: React.Ref<HTMLButtonElement>; 'data-open': boolean }) => ReactNode
  children: (close: () => void) => ReactNode
  align?: 'start' | 'end'
  width?: number
  offset?: number
  /** Atenúa el resto de la pantalla mientras el panel está abierto. Para lo que
   *  pide leerse entero —una lista de avisos— y no para un menú de cuatro items. */
  veil?: boolean
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEscape(open, () => setOpen(false))

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    const left = align === 'end' ? r.right - width : r.left
    setPos({
      top: r.bottom + offset,
      left: Math.max(8, Math.min(left, window.innerWidth - width - 8)),
    })
  }, [open, align, width, offset])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return
      setOpen(false)
    }
    /* `scroll` en captura es la única forma de enterarse del scroll de la
       página, pero atrapa también el de cualquier elemento de adentro. Sin
       filtrar el origen, scrollear la lista del propio panel lo cierra. Un
       resize sí lo cierra siempre: ahí la posición anclada ya no vale. */
    const onScroll = (e: Event) => {
      if (e.type === 'scroll' && panelRef.current?.contains(e.target as Node)) return
      setOpen(false)
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
      {trigger({ onClick: () => setOpen(o => !o), 'aria-expanded': open, ref: triggerRef, 'data-open': open })}
      {open && (
        <Portal>
          {/* El velo va sin blur y por debajo del panel. Atenúa sin desenfocar:
              el fondo se sigue reconociendo, que es la diferencia entre "esto
              está encima" y "cambiaste de pantalla". */}
          {veil && <div className="ui-fade fixed inset-0 z-40 bg-veil" onClick={() => setOpen(false)} />}
          <div
            ref={panelRef}
            style={{ top: pos.top, left: pos.left, width }}
            className="ui-pop fixed z-50 overflow-hidden rounded-[20px] border border-line bg-popover shadow-popover"
          >
            {children(() => setOpen(false))}
          </div>
        </Portal>
      )}
    </>
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
          icon="x"
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
