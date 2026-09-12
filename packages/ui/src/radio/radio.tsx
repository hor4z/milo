import { useRef, type Ref } from 'react'
import { cx } from '../lib/cx'

/** La elección de una entre varias. */
export function Radio({
  checked, onChange, label, disabled, id, tabIndex, ref,
}: {
  checked: boolean
  onChange: () => void
  /** Va al `aria-label`. */
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
        checked ? 'bg-brand' : 'inset-relief bg-muted',
      )}
    >
      <span
        className={cx(
          'size-[8px] rounded-full bg-on-brand transition-transform duration-[120ms] ease-out',
          checked ? 'scale-100' : 'scale-0',
        )}
      />
    </button>
  )
}

/** El grupo va suelto: las opciones sobre el papel, cada una con su etiqueta al lado. */
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
          tabIndex={o.value === value || (!live.some(l => l.value === value) && o.value === live[0]?.value) ? 0 : -1}
        />
      ))}
    </div>
  )
}
