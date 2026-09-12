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
  const campo = useField()

  const medir = useCallback(() => {
    const el = ref.current
    if (!el || resize !== 'auto') return
    const cs = getComputedStyle(el)
    const line = parseFloat(cs.lineHeight) || 16
    const marco = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
      + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)
    el.style.height = 'auto'
    const alto = el.scrollHeight
    const techo = maxRows ? line * maxRows + marco : Infinity
    el.style.height = `${Math.min(alto, techo)}px`
    el.style.overflowY = alto > techo ? 'auto' : 'hidden'
  }, [maxRows, resize])

  useLayoutEffect(medir, [medir, value, rows])

  // Sin esto, angostar la ventana o el swap de la fuente deja texto cortado y sin scroll.
  useEffect(() => {
    const el = ref.current
    if (!el || resize !== 'auto' || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    document.fonts?.ready.then(medir).catch(() => {})
    return () => ro.disconnect()
  }, [medir, resize])

  return (
    <div
      className={cx(
        'field flex cursor-text border border-field-line bg-field',
        'has-[textarea:disabled]:pointer-events-none has-[textarea:disabled]:opacity-45',
        'rounded-lg text-base',
        resize === 'vertical' ? 'p-0' : 'px-3 py-2.5',
        className,
      )}
    >
      <textarea
        ref={ref}
        rows={rows}
        value={value}
        onChange={e => { medir(); onChange?.(e) }}
        className={cx(
          'min-w-0 flex-1 bg-transparent font-normal leading-[1.45] text-ink outline-none',
          'placeholder:text-ink-muted',
          resize === 'vertical' ? 'resize-y px-3 py-2.5' : 'resize-none',
        )}
        {...campo}
        {...rest}
      />
    </div>
  )
}
