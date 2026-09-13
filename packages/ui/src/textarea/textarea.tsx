import { useCallback, useEffect, useLayoutEffect, useRef, type TextareaHTMLAttributes } from 'react'
import { useField } from '../field/field'
import { cx } from '../lib/cx'

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows' | 'style' | 'resize'> & {
  /** Las filas de arranque: el alto mínimo del campo. */
  rows?: number
  /** Hasta cuántas filas crece antes de scrollear. */
  maxRows?: number
  /** Quién decide el alto. */
  resize?: 'auto' | 'vertical' | 'none'
}

/** El campo de varias líneas: la misma caja que `TextField`, estirada. */
export function Textarea({
  rows = 3, maxRows, resize = 'auto', className, onChange, value, ...rest
}: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const field = useField()

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
        resize === 'vertical' ? 'p-0' : 'px-3 py-2',
        className,
      )}
    >
      <textarea
        ref={ref}
        rows={rows}
        value={value}
        onChange={e => { measure(); onChange?.(e) }}
        className={cx(
          'min-w-0 flex-1 bg-transparent font-medium text-ink outline-none',
          'placeholder:text-ink-placeholder',
          resize === 'vertical' ? 'resize-y px-3 py-2' : 'resize-none',
        )}
        {...field}
        {...rest}
      />
    </div>
  )
}
