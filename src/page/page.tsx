import s from './page.module.css'
import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { takePart } from '../lib/parts'

function Root({ children, wide }: {
  children: ReactNode
  /** Suelta el ancho para una tabla o una grilla larga. */
  wide?: boolean
}) {
  return (
    <div className={cx(s.root, wide ? s.wide : s.narrow)}>
      {children}
    </div>
  )
}

/** El nombre de la pantalla, como `h1`. */
function Title({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** Una línea de apoyo, debajo del título. */
function Subtitle({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** Lo que se puede hacer acá, a la derecha. */
function Actions({ children }: { children: ReactNode }) {
  return <>{children}</>
}

function Header({ children }: {
  /** El `Page.Title`, y si van el `Page.Subtitle` y las `Page.Actions`. */
  children: ReactNode
}) {
  const [title, sinTitle] = takePart(children, Title)
  const [subtitle, sinSubtitle] = takePart(sinTitle, Subtitle)
  const [actions] = takePart(sinSubtitle, Actions)
  return (
    <div className={s.header}>
      <div className={s.heading}>
        <h1 className={s.title}>{title}</h1>
        {subtitle.length > 0 && <p className={s.subtitle}>{subtitle}</p>}
      </div>
      {actions.length > 0 && <div className={s.actions}>{actions}</div>}
    </div>
  )
}

/** El separador con rótulo, para cortar una pantalla larga en tramos. */
function SectionLabel({ children, count }: {
  children: ReactNode
  /** Cuántos hay, al lado del rótulo. */
  count?: number
}) {
  return (
    <div className={s.sectionLabel}>
      <span className={s.sectionText}>{children}</span>
      {count !== undefined && <span className={`${s.sectionCount} tabular`}>{count}</span>}
      <span className={s.sectionRule} />
    </div>
  )
}

/** El contenedor de una pantalla. */
export const Page = Object.assign(Root, { Header, Title, Subtitle, Actions, SectionLabel })
