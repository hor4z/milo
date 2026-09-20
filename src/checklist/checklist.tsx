import s from './checklist.module.css'
import { Children, isValidElement, useId, useState, type ReactNode } from 'react'
import { Icon } from '../icon/icon'
import { Spinner } from '../spinner/spinner'
import { Tooltip } from '../tooltip/tooltip'
import { cx } from '../lib/cx'
import { takePart } from '../lib/parts'

/** Dónde está cada paso: hecho, en curso, todavía no, o trabado por otro que falta. */
export type ChecklistState = 'done' | 'doing' | 'todo' | 'blocked'

/** El nombre de la lista, en la cabecera. */
function Title({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** La aclaración de abajo de todo, con su glifo. */
function Footer({ hint, children }: {
  /** El detalle que no entra en la línea. Aparece al pasar por el glifo. */
  hint?: string
  children: ReactNode
}) {
  const glifo = <Icon name="info" size={16} className={`${s.footerIcon} ${s.footerIconQuiet}`} />
  return (
    <p className={`${s.footer} ${s.footerQuiet} icon-filled`}>
      {hint
        ? <Tooltip label={hint}><span className={s.footerNote}>{glifo}</span></Tooltip>
        : glifo}
      <span>{children}</span>
    </p>
  )
}

/** Un paso. El estado lo dice la marca de la izquierda, no el color del texto. */
function Item({ state = 'todo', hint, onClick, children }: {
  /** Sin esto es un paso que todavía no se hizo. */
  state?: ChecklistState
  /** Por qué el paso está trabado, o qué hay que hacer. Aparece en una etiqueta flotante. */
  hint?: string
  /** Sin esto la fila es texto y no se puede tocar. */
  onClick?: () => void
  children: ReactNode
}) {
  const Tag = onClick && state !== 'blocked' ? 'button' : 'div'
  const texto = (
    <>
      <span className={s.mark}>
        {state === 'done' && (
          <span className={s.done}>
            <Icon name="check" size={14} weight={600} />
          </span>
        )}
        {state === 'doing' && <Spinner size={18} />}
        {(state === 'todo' || state === 'blocked') && <span className={s.pending} />}
      </span>
      <span className={s.label}>{children}</span>
      {hint && (
        <Tooltip label={hint}>
          <span className={s.hint}>
            <Icon name="info" size={16} className="icon-muted" />
          </span>
        </Tooltip>
      )}
    </>
  )
  return (
    <Tag
      {...(Tag === 'button' ? { type: 'button' as const, onClick } : {})}
      aria-current={state === 'doing' ? 'step' : undefined}
      data-state={state}
      className={cx(s.item, s.itemMotion, state === 'blocked' && s.blocked, Tag === 'button' && s.interactive)}
    >
      {texto}
    </Tag>
  )
}

/** Los primeros pasos de algo, con cuánto va hecho a la vista y el detalle plegado. El contador sale de los pasos, así que no se puede despegar de ellos. */
function Root({ defaultOpen = false, children, className }: {
  /** Arranca abierta. Cerrada ocupa una fila y dice lo mismo. */
  defaultOpen?: boolean
  children: ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyId = useId()
  const titleId = useId()

  const [title, sinTitle] = takePart(children, Title)
  const [footer, cuerpo] = takePart(sinTitle, Footer)

  const pasos = Children.toArray(cuerpo).filter(c => isValidElement(c) && c.type === Item)
  const total = pasos.length
  const hechos = pasos.filter(c => (isValidElement<{ state?: ChecklistState }>(c) ? c.props.state : undefined) === 'done').length
  const pct = total === 0 ? 0 : (hechos / total) * 100

  return (
    <div className={cx(s.root, className)}>
      <div className={s.header}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          aria-labelledby={titleId}
          onClick={() => setOpen(v => !v)}
          className={s.trigger}
        >
          <Icon
            name="keyboard_arrow_down"
            size={20}
            className={cx(s.chevron, open && s.chevronOpen, 'icon-muted')}
          />
        </button>
        <p id={titleId} className={s.title}>{title}</p>
        <span className={s.track} aria-hidden="true">
          <span className={s.fill} style={{ width: `${pct}%` }} />
        </span>
        <p className={`${s.count} tabular`}>
          {hechos}/{total}
          <span className="sr-only"> pasos hechos</span>
        </p>
      </div>
      {open && (
        <div id={bodyId} className={`${s.body} bg-surface`}>
          <div className={s.items}>{cuerpo}</div>
          {footer}
        </div>
      )}
    </div>
  )
}

export const Checklist = Object.assign(Root, { Title, Item, Footer })
