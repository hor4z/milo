import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type TextareaHTMLAttributes } from 'react'
import { useField } from '../field/field'
import { cx } from '../lib/cx'

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows' | 'style' | 'resize'> & {
  /** Las filas de arranque: el alto mínimo del campo. */
  rows?: number
  /** Hasta cuántas filas crece antes de scrollear. */
  maxRows?: number
  /** Quién decide el alto. */
  resize?: 'auto' | 'vertical' | 'none'
  /** Muestra la cuenta abajo a la derecha. Lee `maxLength` y `minLength`; sin ninguno de los dos cuenta y nada más. */
  counter?: boolean
}

/** Lo que la cuenta dice, que no siempre es un número. */
function leyenda(n: number, min?: number, max?: number) {
  if (min && n > 0 && n < min) {
    const faltan = min - n
    const uno = faltan === 1
    return { texto: `${uno ? 'falta' : 'faltan'} ${faltan} ${uno ? 'carácter' : 'caracteres'}`, tono: 'bad' as const, avisa: true }
  }
  if (max == null) return { texto: `${n}`, tono: 'calmo' as const, avisa: false }
  const queda = max - n
  if (queda <= 0) return { texto: `${n}/${max}`, tono: 'bad' as const, avisa: true }
  if (queda <= Math.max(10, Math.round(max * 0.1))) {
    return { texto: `te quedan ${queda}`, tono: 'warn' as const, avisa: true }
  }
  return { texto: `${n}/${max}`, tono: 'calmo' as const, avisa: false }
}

const tinta = {
  calmo: 'text-ink-muted',
  warn: 'text-warn-ink',
  bad: 'text-bad-ink',
} as const

/** El campo de varias líneas: la misma caja que `TextField`, estirada. */
export function Textarea({
  rows = 3, maxRows, resize = 'auto', counter, className, onChange, value, defaultValue, ...rest
}: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const field = useField()
  const cuentaId = useId()
  const [propio, setPropio] = useState(String(defaultValue ?? ''))
  const texto = value == null ? propio : String(value)
  const cuenta = counter ? leyenda([...texto].length, rest.minLength, rest.maxLength) : null

  const measure = useCallback(() => {
    const el = ref.current
    if (!el || resize !== 'auto') return
    const cs = getComputedStyle(el)
    const line = parseFloat(cs.lineHeight) || 16
    const frame = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
      + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)
    el.style.height = 'auto'
    const height = el.scrollHeight
    const cap = maxRows ? line * maxRows + frame : Infinity
    el.style.height = `${Math.min(height, cap)}px`
    el.style.overflowY = height > cap ? 'auto' : 'hidden'
  }, [maxRows, resize])

  useLayoutEffect(measure, [measure, value, rows])

  useEffect(() => {
    const el = ref.current
    if (!el || resize !== 'auto' || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => ro.disconnect()
  }, [measure, resize])

  const describedBy = [field['aria-describedby'], cuenta && cuentaId].filter(Boolean).join(' ') || undefined

  return (
    <div
      onPointerDown={e => {
        if ((e.target as HTMLElement).closest('button, a, input, textarea')) return
        e.preventDefault()
        e.currentTarget.querySelector('textarea')?.focus()
      }}
      className={cx(
        'field flex cursor-text border border-field-line bg-field',
        'has-[textarea:disabled]:pointer-events-none has-[textarea:disabled]:opacity-45',
        'rounded-lg text-reading',
        counter ? 'flex-col gap-1' : '',
        resize === 'vertical' ? 'p-0' : 'px-3 py-2',
        className,
      )}
    >
      <textarea
        ref={ref}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        onChange={e => { measure(); setPropio(e.target.value); onChange?.(e) }}
        className={cx(
          'min-w-0 bg-transparent font-medium text-ink outline-none',
          counter ? 'w-full' : 'flex-1',
          'placeholder:text-ink-placeholder',
          resize === 'vertical' ? 'resize-y px-3 py-2' : 'resize-none',
        )}
        {...field}
        aria-describedby={describedBy}
        {...rest}
      />
      {cuenta && (
        <span
          id={cuentaId}
          className={cx(
            'tabular self-end text-meta font-medium transition-colors duration-fast ease-out',
            tinta[cuenta.tono],
            resize === 'vertical' ? 'px-3 pb-2' : '',
          )}
        >
          {cuenta.texto}
        </span>
      )}
      <span aria-live="polite" className="sr-only">{cuenta?.avisa ? cuenta.texto : ''}</span>
    </div>
  )
}
