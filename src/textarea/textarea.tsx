import cls from './textarea.module.css'
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
function counterText(n: number, min?: number, max?: number) {
  if (min && n > 0 && n < min) {
    const missing = min - n
    const isOne = missing === 1
    return { text: `${isOne ? 'falta' : 'faltan'} ${missing} ${isOne ? 'carácter' : 'caracteres'}`, tone: 'bad' as const, warns: true }
  }
  if (max == null) return { text: `${n}`, tone: 'calm' as const, warns: false }
  const left = max - n
  if (left <= 0) return { text: `${n}/${max}`, tone: 'bad' as const, warns: true }
  if (left <= Math.max(10, Math.round(max * 0.1))) {
    return { text: `te quedan ${left}`, tone: 'warn' as const, warns: true }
  }
  return { text: `${n}/${max}`, tone: 'calm' as const, warns: false }
}

const counterInk = {
  calm: cls.counterCalm,
  warn: cls.counterWarn,
  bad: cls.counterBad,
} as const

/** El campo de varias líneas: la misma caja que `TextField`, estirada. */
export function Textarea({
  rows = 3, maxRows, resize = 'auto', counter, className, onChange, value, defaultValue, ...rest
}: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const field = useField()
  const counterId = useId()
  const [ownValue, setOwnValue] = useState(String(defaultValue ?? ''))
  const text = value == null ? ownValue : String(value)
  const counterLabel = counter ? counterText([...text].length, rest.minLength, rest.maxLength) : null

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

  const describedBy = [field['aria-describedby'], counterLabel && counterId].filter(Boolean).join(' ') || undefined

  return (
    <div
      onPointerDown={e => {
        if ((e.target as HTMLElement).closest('button, a, input, textarea')) return
        e.preventDefault()
        e.currentTarget.querySelector('textarea')?.focus()
      }}
      className={cx(
        `${cls.root} field`,
        cls.disabled,
        cls.shape,
        counter ? cls.withCounter : '',
        resize === 'vertical' ? cls.resizablePad : cls.fixedPad,
        className,
      )}
    >
      <textarea
        ref={ref}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        onChange={e => { measure(); setOwnValue(e.target.value); onChange?.(e) }}
        className={cx(
          cls.input,
          counter ? cls.inputWithCounter : cls.inputAlone,
          cls.inputPlaceholder,
          resize === 'vertical' ? cls.inputResizable : cls.inputFixed,
        )}
        {...field}
        aria-describedby={describedBy}
        {...rest}
      />
      {counterLabel && (
        <span
          id={counterId}
          className={cx(
            `${cls.counter} tabular`,
            counterInk[counterLabel.tone],
            resize === 'vertical' ? cls.counterResizable : '',
          )}
        >
          {counterLabel.text}
        </span>
      )}
      <span aria-live="polite" className="sr-only">{counterLabel?.warns ? counterLabel.text : ''}</span>
    </div>
  )
}
