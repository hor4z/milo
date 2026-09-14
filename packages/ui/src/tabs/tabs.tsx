import s from './tabs.module.css'
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
  /** Controlado; sin esto usa defaultValue. */
  value?: string
  /** La solapa abierta al entrar. */
  defaultValue?: string
  /** Avisa qué solapa quedó abierta. */
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
      <div className={cx(s.root, className)} {...props}>{children}</div>
    </Ctx.Provider>
  )
}

/** La fila de solapas. Las flechas se mueven entre ellas, como pide un tablist. */
export function TabList({ label, className, children, ...props }: ComponentPropsWithoutRef<'div'> & {
  /** De qué son estas solapas. Sin esto un lector las anuncia como "lista de solapas" y con dos en una pantalla no se distinguen. */
  label?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const toEdge = (i: 0 | -1) => {
    const tabs = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [])]
    tabs.at(i)?.focus()
  }
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
      aria-label={label}
      onKeyDown={e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); move(1) }
        if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1) }
        if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); toEdge(e.key === 'Home' ? 0 : -1) }
      }}
      className={cx(s.list, className)}
      {...props}
    >
      {children}
    </div>
  )
}

/** Una solapa. El activo se marca con la línea y el azul primario. */
export function Tab({ value, className, children, ...props }: ComponentPropsWithoutRef<'button'> & {
  /** Ata la solapa a su panel. */
  value: string
}) {
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
        s.tab,
        active ? s.tabActive : s.tabIdle,
        className,
      )}
      {...props}
    >
      {children}
      {active && <span className={s.marker} />}
    </button>
  )
}

/** El contenido de una solapa. */
export function TabPanel({ value, className, children, ...props }: ComponentPropsWithoutRef<'div'> & {
  /** El mismo valor que su solapa. */
  value: string
}) {
  const { value: current, name } = useTabs('TabPanel')
  if (current !== value) return null
  return (
    <div
      role="tabpanel"
      id={`${name}-panel-${value}`}
      aria-labelledby={`${name}-tab-${value}`}
      tabIndex={0}
      className={cx(s.panel, className)}
      {...props}
    >
      {children}
    </div>
  )
}
