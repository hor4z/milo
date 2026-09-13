import type { ReactNode } from 'react'
import { cx } from '../lib/cx'

type QuoteProps = {
  children: ReactNode
  /** Quién lo dijo o de dónde salió. Va abajo, en gris y más chico. */
  source?: ReactNode
  /** La dirección de donde se sacó. Con esto, la cita lo declara en el markup además de escribirlo. */
  cite?: string
  className?: string
}

/** Palabras de otro: lo que dijo alguien, un fragmento de un texto, la respuesta de un estudiante. */
export function Quote({ children, source, cite, className }: QuoteProps) {
  return (
    <figure className={cx('m-0 flex flex-col gap-2', className)}>
      {/* La barra va del lado de la lectura y no alrededor: una caja cerrada
          se lee como un aviso, y esto es texto adentro del texto. Y va en el
          azul de marca y no en un gris: en una página de texto corrido la barra
          gris es una línea más entre divisores y bordes de tabla, y lo que tiene
          que hacer es cortar la lectura. El azul es el único color que el
          sistema usa para señalar. */}
      <blockquote cite={cite} className="m-0 border-l-2 border-brand pl-4 text-reading text-ink">
        {children}
      </blockquote>
      {source && (
        <figcaption className="pl-4 text-meta text-ink-muted">
          — {cite ? <cite className="not-italic">{source}</cite> : source}
        </figcaption>
      )}
    </figure>
  )
}
