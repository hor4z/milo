import cls from './date-picker.module.css'
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useField } from '../field/field'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'
import { useEscape } from '../lib/esc'
import { useDismiss } from '../lib/dismiss'
import { useFocusTrap } from '../lib/overlay-hooks'
import { Portal } from '../portal/portal'

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

  useEffect(() => { if (open) setCursor(value || hoy()) }, [open, value])

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
  }, [open, cursor])

  useDismiss(open, () => setOpen(false), [panel, btn])

  const [ay, am] = partes(cursor)
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
        className={`${cls.root} field-focus touch-target`}
      >
        <span className={cx(cls.value, !value && cls.placeholder)}>
          {value ? enPalabras(value) : placeholder}
        </span>
        <Icon name="calendar_month" size={16} className={`${cls.calendarIcon} icon-muted`} />
      </button>

      {open && (
        <Portal>
          <div
            ref={panel}
            role="dialog"
            aria-labelledby={tituloId}
            tabIndex={-1}
            style={{ top: pos.top, left: pos.left }}
            className={`${cls.panel} ui-pop bg-popover`}
          >
            <div className={cls.header}>
              <button
                type="button"
                onClick={() => moverMes(-1)}
                aria-label="Mes anterior"
                className={cls.prev}
              >
                <Icon name="chevron_left" size={18} className="icon-muted" />
              </button>
              <span id={tituloId} aria-live="polite" className={cls.monthName}>
                {mesLargo.format(new Date(ay, am - 1, 1))}
              </span>
              <button
                type="button"
                onClick={() => moverMes(1)}
                aria-label="Mes siguiente"
                className={cls.next}
              >
                <Icon name="chevron_right" size={18} className="icon-muted" />
              </button>
            </div>

            <div role="grid" id={gridId} aria-labelledby={tituloId} className={cls.grid}>
              <div role="row" className={cls.weekdays}>
                {DIAS.map(d => (
                  <span key={d} role="columnheader" aria-label={d} className={cls.weekday}>
                    {d}
                  </span>
                ))}
              </div>
              {semanas.map((semana, s) => (
                <div key={s} role="row" className={cls.week}>
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
                        data-autofocus={iso === cursor ? true : undefined}
                        tabIndex={iso === cursor ? 0 : -1}
                        aria-selected={elegido}
                        aria-disabled={bloqueado || undefined}
                        aria-label={`${enPalabras(iso)}${esHoy ? ', hoy' : ''}`}
                        onKeyDown={teclas}
                        onClick={() => { if (!bloqueado) { onChange(iso); cerrar() } }}
                        className={cx(
                          cls.day,
                          elegido ? cls.selected
                            : bloqueado ? cls.blocked
                              : cls.plain,
                        )}
                      >
                        {partes(iso)[2]}
                        {esHoy && !elegido && (
                          <span aria-hidden="true" className={cls.today} />
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
