import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useField } from '../field/field'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'
import { useEscape } from '../lib/esc'
import { useFocusTrap } from '../lib/overlay-hooks'
import { Portal } from '../portal/portal'

/* Una fecha de entrega no tiene hora ni zona, así que el valor es el texto
   `AAAA-MM-DD` y no un `Date`. Un `Date` arrastra las dos cosas: `new Date('2026-03-09')`
   se interpreta en UTC y en Argentina es el 8 a las 21. Todo lo de acá adentro
   trabaja con año, mes y día sueltos, y el único `Date` que aparece es para
   preguntarle al calendario qué día de la semana cae. */

const DIAS = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do']

const partes = (iso: string) => iso.split('-').map(Number) as [number, number, number]
const texto = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
const hoy = () => {
  const d = new Date()
  return texto(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

/** Cuántos días tiene el mes. El día 0 del siguiente es el último de este. */
const largo = (y: number, m: number) => new Date(y, m, 0).getDate()

/** Lunes es 0: la semana empieza el lunes y no el domingo, como en el aula. */
const primerDia = (y: number, m: number) => (new Date(y, m - 1, 1).getDay() + 6) % 7

const mesLargo = new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' })
const diaLargo = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const enPalabras = (iso: string) => {
  const [y, m, d] = partes(iso)
  return diaLargo.format(new Date(y, m - 1, d))
}

/** Elegir una fecha: un campo que abre un mes. */
export function DatePicker({ value, onChange, min, max, placeholder = 'Elegir fecha', label, width }: {
  /** La fecha elegida como `AAAA-MM-DD`, o vacío. */
  value: string
  /** Recibe la fecha nueva en el mismo formato. */
  onChange: (v: string) => void
  /** Nada antes de este día. Para un vencimiento, el de hoy. */
  min?: string
  /** Nada después de este día. */
  max?: string
  /** Lo que dice el campo mientras no hay fecha. */
  placeholder?: string
  /** De qué es la fecha. Sin esto lo pone el `Field` de alrededor. */
  label?: string
  /** Sin esto toma el ancho del contenido. */
  width?: number
}) {
  const field = useField()
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(() => value || hoy())
  const btn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const gridId = useId()
  const tituloId = useId()

  const cerrar = () => { setOpen(false); btn.current?.focus() }
  useEscape(open, cerrar)
  useFocusTrap(open, panel)

  // Al abrir, el mes que se muestra es el de la fecha elegida, no donde quedó
  // la última vez.
  useEffect(() => { if (open) setCursor(value || hoy()) }, [open, value])

  // Se mide después de pintar el panel porque hace falta su alto: un mes cerca
  // del borde de abajo no entra, y en vez de salirse de la pantalla se da
  // vuelta y abre para arriba.
  useLayoutEffect(() => {
    if (!open) return
    const medir = () => {
      const r = btn.current?.getBoundingClientRect()
      if (!r) return
      const alto = panel.current?.offsetHeight ?? 0
      const ancho = panel.current?.offsetWidth ?? 300
      const cabeAbajo = r.bottom + 8 + alto <= window.innerHeight - 8
      setPos({
        top: cabeAbajo ? r.bottom + 8 : Math.max(8, r.top - 8 - alto),
        left: Math.min(Math.max(8, r.left), window.innerWidth - ancho - 8),
      })
    }
    medir()
    addEventListener('resize', medir)
    return () => removeEventListener('resize', medir)
  }, [open, cursor])

  // Sin esto el único modo de salir sin elegir era Escape: tocar en cualquier
  // otro lado dejaba el mes abierto. Va en `pointerdown` y no en `click`,
  // porque con click el mismo gesto que abre otro panel lo cierra y lo reabre.
  useEffect(() => {
    if (!open) return
    const afuera = (e: PointerEvent) => {
      const t = e.target as Node
      if (panel.current?.contains(t) || btn.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', afuera)
    return () => document.removeEventListener('pointerdown', afuera)
  }, [open])

  const [ay, am] = partes(cursor)
  // En semanas y no en una tira de días: un `grid` pide `row` adentro, y sin
  // filas los encabezados de columna quedan colgando de nada.
  const semanas = useMemo(() => {
    const hueco = primerDia(ay, am)
    const total = largo(ay, am)
    const celdas: (string | null)[] = Array(hueco).fill(null)
    for (let d = 1; d <= total; d++) celdas.push(texto(ay, am, d))
    while (celdas.length % 7) celdas.push(null)
    return Array.from({ length: celdas.length / 7 }, (_, i) => celdas.slice(i * 7, i * 7 + 7))
  }, [ay, am])

  const fuera = (iso: string) => (min ? iso < min : false) || (max ? iso > max : false)

  const mover = (paso: number) => {
    const [y, m, d] = partes(cursor)
    const destino = new Date(y, m - 1, d + paso)
    setCursor(texto(destino.getFullYear(), destino.getMonth() + 1, destino.getDate()))
  }
  const moverMes = (paso: number) => {
    const [y, m, d] = partes(cursor)
    const destino = new Date(y, m - 1 + paso, 1)
    const ny = destino.getFullYear()
    const nm = destino.getMonth() + 1
    setCursor(texto(ny, nm, Math.min(d, largo(ny, nm))))
  }

  const teclas = (e: React.KeyboardEvent) => {
    const saltos: Record<string, () => void> = {
      ArrowLeft: () => mover(-1),
      ArrowRight: () => mover(1),
      ArrowUp: () => mover(-7),
      ArrowDown: () => mover(7),
      PageUp: () => moverMes(e.shiftKey ? -12 : -1),
      PageDown: () => moverMes(e.shiftKey ? 12 : 1),
      Home: () => mover(-((partes(cursor)[2] + primerDia(ay, am) - 1) % 7)),
      End: () => mover(6 - ((partes(cursor)[2] + primerDia(ay, am) - 1) % 7)),
    }
    const salto = saltos[e.key]
    if (salto) { e.preventDefault(); salto(); return }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!fuera(cursor)) { onChange(cursor); cerrar() }
    }
  }

  // La celda del cursor es la única parada de tabulación, y el foco la sigue al
  // moverse con las flechas. El aterrizaje al abrir lo hace `data-autofocus`.
  useEffect(() => {
    if (!open) return
    panel.current?.querySelector<HTMLElement>('[data-cursor="true"]')?.focus({ preventScroll: true })
  }, [open, cursor])

  return (
    <>
      <button
        ref={btn}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={label}
        {...field}
        onClick={() => setOpen(o => !o)}
        style={{ width }}
        className="field-focus inline-flex h-9 items-center justify-between gap-2 rounded-md border border-field-line bg-field px-3 text-body font-medium text-ink transition-colors duration-fast ease-out hover:bg-field-hover"
      >
        <span className={cx('min-w-0 truncate', !value && 'text-ink-placeholder')}>
          {value ? enPalabras(value) : placeholder}
        </span>
        <Icon name="calendar_month" size={16} className="shrink-0 icon-muted" />
      </button>

      {open && (
        <Portal>
          <div
            ref={panel}
            role="dialog"
            aria-modal="false"
            aria-labelledby={tituloId}
            tabIndex={-1}
            style={{ top: pos.top, left: pos.left }}
            className="ui-pop fixed z-50 w-[300px] rounded-xl border border-line bg-popover p-3 shadow-popover"
          >
            <div className="flex items-center justify-between gap-2 pb-2">
              <button
                type="button"
                onClick={() => moverMes(-1)}
                aria-label="Mes anterior"
                className="inline-flex size-8 items-center justify-center rounded-md transition-colors duration-fast ease-out hover:bg-hover"
              >
                <Icon name="chevron_left" size={18} className="icon-muted" />
              </button>
              {/* `aria-live`: al cambiar de mes con el teclado, lo que cambia es
                  el título, y sin esto el cambio no se anuncia. */}
              <span id={tituloId} aria-live="polite" className="text-body font-semibold text-ink first-letter:uppercase">
                {mesLargo.format(new Date(ay, am - 1, 1))}
              </span>
              <button
                type="button"
                onClick={() => moverMes(1)}
                aria-label="Mes siguiente"
                className="inline-flex size-8 items-center justify-center rounded-md transition-colors duration-fast ease-out hover:bg-hover"
              >
                <Icon name="chevron_right" size={18} className="icon-muted" />
              </button>
            </div>

            <div role="grid" id={gridId} aria-labelledby={tituloId} className="flex flex-col gap-1">
              <div role="row" className="grid grid-cols-7 gap-1">
                {DIAS.map(d => (
                  <span key={d} role="columnheader" aria-label={d} className="pb-1 text-center text-meta font-medium text-ink-subtle">
                    {d}
                  </span>
                ))}
              </div>
              {semanas.map((semana, s) => (
                <div key={s} role="row" className="grid grid-cols-7 gap-1">
                  {semana.map((iso, i) => {
                    if (!iso) return <span key={`h${i}`} role="gridcell" />
                    const elegido = iso === value
                    const esHoy = iso === hoy()
                    const bloqueado = fuera(iso)
                    return (
                      <button
                        key={iso}
                        type="button"
                        role="gridcell"
                        data-cursor={iso === cursor}
                        // `data-autofocus` es lo que `useFocusTrap` busca al
                        // abrir. Sin eso el foco caía en el panel y las flechas
                        // no hacían nada hasta tabular adentro de la grilla —
                        // en jsdom no se ve, porque lo que pelea es un rAF.
                        data-autofocus={iso === cursor ? true : undefined}
                        tabIndex={iso === cursor ? 0 : -1}
                        aria-selected={elegido}
                        aria-disabled={bloqueado || undefined}
                        aria-label={`${enPalabras(iso)}${esHoy ? ', hoy' : ''}`}
                        onKeyDown={teclas}
                        onClick={() => { if (!bloqueado) { onChange(iso); cerrar() } }}
                        className={cx(
                          'relative inline-flex size-9 w-full items-center justify-center rounded-md text-body font-medium transition-colors duration-fast ease-out',
                          elegido ? 'bg-brand text-on-brand'
                            : bloqueado ? 'text-ink-disabled'
                              : 'text-ink hover:bg-hover',
                        )}
                      >
                        {partes(iso)[2]}
                        {/* Hoy se marca con un punto y no solo con color: es la
                            misma regla que el resto del sistema, y acá compite
                            con el azul del elegido. */}
                        {esHoy && !elegido && (
                          <span aria-hidden="true" className="absolute bottom-1 size-1 rounded-full bg-brand" />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </Portal>
      )}
    </>
  )
}
