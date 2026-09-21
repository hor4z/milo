import s from './checklist.module.css'
import { Children, cloneElement, isValidElement, useId, useState, type ReactElement, type ReactNode } from 'react'
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
  const glifo = <Icon name="info" size={16} className={s.footerIcon} />
  return (
    <p className={`${s.footer} ${s.footerQuiet} icon-filled`}>
      {hint
        ? <Tooltip label={hint}><span className={s.footerNote}>{glifo}</span></Tooltip>
        : glifo}
      <span>{children}</span>
    </p>
  )
}

type ItemProps = {
  /** Sin esto es un paso que todavía no se hizo. */
  state?: ChecklistState
  /** Por qué el paso está trabado, o qué hay que hacer. Aparece en una etiqueta flotante. */
  hint?: string
  /** Sin esto la fila es texto y no se puede tocar. */
  onClick?: () => void
  children: ReactNode
}

/** Un paso. El estado lo dice la marca de la izquierda, no el color del texto. */
function Item({ state = 'todo', hint, onClick, children }: ItemProps) {
  const Tag = onClick && state !== 'blocked' ? 'button' : 'div'
  const texto = (
    <>
      <span className={s.mark}>
        {state === 'done' && (
          <span className={s.done}>
            <Icon name="check" weight={600} />
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
function Root({ defaultOpen = false, size = 'md', exclusive, value, onChange, children, className }: {
  /** Arranca abierta. Cerrada ocupa una fila y dice lo mismo. */
  defaultOpen?: boolean
  /** `sm` adentro de un panel denso: los pasos bajan a texto de cuerpo y las filas se achican. */
  size?: 'md' | 'sm'
  /** Los renglones son excluyentes: se marca uno y los demás se apagan. Es para una escala, donde los renglones son descripciones del mismo estado y solo una es cierta. Se va con la barra y el contador, que miden cuánto va hecho y acá no hay nada hecho: hay un lugar donde estás. Sin esto la lista es la escalera de siempre, donde cada paso incluye a los de arriba. */
  exclusive?: boolean
  /** Cuántos pasos van hechos, o cuál está marcado si es excluyente. En los dos casos el estado de cada renglón lo decide la pieza y no el call site. */
  value?: number
  /** Recibe el valor nuevo al tocar un renglón. En la escalera, tocar el último desmarca de ahí para abajo; siendo excluyente, tocar el marcado no lo apaga, igual que un radio. */
  onChange?: (value: number) => void
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
  const escalera = value !== undefined
  const hechos = escalera
    ? Math.min(Math.max(value, 0), total)
    : pasos.filter(c => (isValidElement<ItemProps>(c) ? c.props.state : undefined) === 'done').length
  const pct = total === 0 ? 0 : (hechos / total) * 100

  let paso = -1
  const items = escalera
    ? Children.map(cuerpo, c => {
        if (!isValidElement(c) || c.type !== Item) return c
        paso += 1
        const at = paso
        return cloneElement(c as ReactElement<ItemProps>, {
          state: exclusive ? (at === hechos - 1 ? 'done' : 'todo') : at < hechos ? 'done' : 'todo',
          onClick: () => onChange?.(exclusive ? at + 1 : hechos === at + 1 ? at : at + 1),
        })
      })
    : cuerpo

  return (
    <div className={cx(s.root, size === 'sm' && s.compact, className)}>
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
        {!exclusive && (
          <p className={`${s.count} tabular`}>
            {hechos}/{total}
            <span className="sr-only"> pasos hechos</span>
          </p>
        )}
      </div>
      {!exclusive && (
        <span className={s.track} aria-hidden="true">
          <span className={s.fill} style={{ width: `${pct}%` }} />
        </span>
      )}
      {open && (
        <div id={bodyId} className={`${s.body} bg-surface`}>
          <div className={s.items}>{items}</div>
          {footer}
        </div>
      )}
    </div>
  )
}

export const Checklist = Object.assign(Root, { Title, Item, Footer })
