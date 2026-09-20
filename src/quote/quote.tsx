import cls from './quote.module.css'
import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { takePart } from '../lib/parts'

type QuoteProps = {
  children: ReactNode
  /** La dirección de donde se sacó. Con esto, la cita lo declara en el markup además de escribirlo. */
  cite?: string
  className?: string
}

/** Quién lo dijo o de dónde salió. Va abajo, en gris y más chico. */
function Source({ children }: { children: ReactNode }) {
  return <>{children}</>
}

function Root({ children, cite, className }: QuoteProps) {
  const [source, texto] = takePart(children, Source)
  return (
    <figure className={cx(cls.root, className)}>
      <blockquote cite={cite} className={cls.text}>
        {texto}
      </blockquote>
      {source.length > 0 && (
        <figcaption className={cls.caption}>
          - {cite ? <cite className="not-italic">{source}</cite> : source}
        </figcaption>
      )}
    </figure>
  )
}

/** Palabras de otro: lo que dijo alguien, un fragmento de un texto, la respuesta de un estudiante. */
export const Quote = Object.assign(Root, { Source })
