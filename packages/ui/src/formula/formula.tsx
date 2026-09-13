import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { useSideScroll } from '../lib/side-scroll'

/** Una fórmula: en la frase, o en su propio renglón y con número. */
export function Formula({ children, display, alt, number, className }: {
  /** El contenido en MathML: `<mi>`, `<mfrac>`, `<msup>` y los demás. */
  children: ReactNode
  /** En su propio renglón, centrada, con las fracciones altas. */
  display?: boolean
  /** Lo que se lee en voz alta donde MathML no se interpreta. */
  alt: string
  /** El número entre paréntesis a la derecha, para citarla desde el texto. */
  number?: string | number
  className?: string
}) {
  const { ref, scrolls } = useSideScroll<HTMLDivElement>(children)

  if (!display) {
    return (
      <math display="inline" alttext={alt} className={cx('formula', className)}>
        {children}
      </math>
    )
  }

  return (
    <div className={cx('flex items-center gap-4', className)}>
      {/* Una ecuación larga no achica el resto de la página: se desplaza. Y
          solo entonces es una parada de tabulación — lo que quedó cortado a la
          derecha no se alcanza de otra forma sin mouse. */}
      <div
        ref={ref}
        tabIndex={scrolls ? 0 : undefined}
        role={scrolls ? 'region' : undefined}
        // El nombre corto y no el `alt`: la fórmula ya se lee entera adentro,
        // y con el `alt` acá se escuchaba dos veces seguidas.
        aria-label={scrolls ? `Fórmula${number != null ? ` ${number}` : ''}, se desplaza de costado` : undefined}
        className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden py-1"
      >
        <math display="block" alttext={alt} className="formula formula-block">
          {children}
        </math>
      </div>
      {number != null && (
        // Fuera del scroll: el número es la dirección de la fórmula y tiene que
        // seguir a la vista cuando la fórmula se corrió de costado.
        <span className="tabular shrink-0 text-body font-medium text-ink-muted">({number})</span>
      )}
    </div>
  )
}
