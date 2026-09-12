import { createContext, useContext, useId, useRef, useState, type ComponentPropsWithoutRef } from 'react'
import { cx } from '../lib/cx'

type TabsCtx = { value: string; setValue: (v: string) => void; name: string }

const Ctx = createContext<TabsCtx | null>(null)

function useTabs(who: string) {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error(`${who} necesita un <Tabs> alrededor`)
  return ctx
}

type TabsProps = Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> & {
  value?: string
  defaultValue?: string
  onValueChange?: (v: string) => void
}

/** Paneles hermanos donde solo se ve uno. Controlado o no, como el resto. */
export function Tabs({ value, defaultValue, onValueChange, className, children, ...props }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? '')
  const name = useId()
  const current = value ?? internal
  const setValue = (v: string) => {
    if (value === undefined) setInternal(v)
    onValueChange?.(v)
  }
  return (
    <Ctx.Provider value={{ value: current, setValue, name }}>
      <div className={cx('flex flex-col gap-4', className)} {...props}>{children}</div>
    </Ctx.Provider>
  )
}

/** La fila de solapas. Las flechas se mueven entre ellas, como pide un tablist. */
export function TabList({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
  const ref = useRef<HTMLDivElement>(null)
  const move = (step: number) => {
    const tabs = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [])]
    const i = tabs.indexOf(document.activeElement as HTMLButtonElement)
    if (i < 0) return
    tabs[(i + step + tabs.length) % tabs.length].focus()
  }
  return (
    <div
      ref={ref}
      role="tablist"
      onKeyDown={e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); move(1) }
        if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1) }
      }}
      className={cx('flex items-center gap-1 border-b border-line', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/** Una solapa. El activo se marca con una línea, no con color. */
export function Tab({ value, className, children, ...props }: ComponentPropsWithoutRef<'button'> & { value: string }) {
  const { value: current, setValue, name } = useTabs('Tab')
  const active = current === value
  return (
    <button
      type="button"
      role="tab"
      id={`${name}-tab-${value}`}
      aria-selected={active}
      aria-controls={`${name}-panel-${value}`}
      tabIndex={active ? 0 : -1}
      onClick={() => setValue(value)}
      className={cx(
        'relative -mb-px h-9 px-3 text-xs font-semibold transition-colors',
        active ? 'text-ink' : 'text-ink-muted hover:text-ink',
        className,
      )}
      {...props}
    >
      {children}
      {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-ink" />}
    </button>
  )
}

/** El contenido de una solapa. */
export function TabPanel({ value, className, children, ...props }: ComponentPropsWithoutRef<'div'> & { value: string }) {
  const { value: current, name } = useTabs('TabPanel')
  if (current !== value) return null
  return (
    <div
      role="tabpanel"
      id={`${name}-panel-${value}`}
      aria-labelledby={`${name}-tab-${value}`}
      tabIndex={0}
      className={cx('outline-none', className)}
      {...props}
    >
      {children}
    </div>
  )
}
