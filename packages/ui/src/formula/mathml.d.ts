import type { AriaAttributes, DOMAttributes, ReactNode } from 'react'

/* MathML no viene tipado en `@types/react`, y esa fue la razón escrita durante
   un tiempo para no tener fórmulas. No hace falta una biblioteca: hacen falta
   estas declaraciones, porque `react-dom` ya crea `<math>` en su namespace —
   lo que falta es que TypeScript sepa que la etiqueta existe.

   Están los elementos que aparecen en matemática y física de escuela. Uno que
   falte se agrega acá y en ningún otro lado. */

type Base = AriaAttributes & DOMAttributes<Element> & {
  children?: ReactNode
  className?: string
  id?: string
  style?: React.CSSProperties
  /** Cursiva para una variable, redonda para una constante o una unidad. */
  mathvariant?: 'normal' | 'italic' | 'bold' | 'bold-italic' | 'double-struck'
  /** Achica la letra, como en un subíndice. */
  scriptlevel?: string
  /** Con las fracciones altas y los límites arriba y abajo, como en bloque. */
  displaystyle?: boolean
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      math: Base & {
        /** `block` la centra en su propio renglón; `inline` la deja en la frase. */
        display?: 'block' | 'inline'
        /** Lo que se lee en voz alta donde MathML no se interpreta. */
        alttext?: string
      }
      mrow: Base
      mi: Base
      mn: Base
      mo: Base & {
        /** Un paréntesis que crece con lo que encierra. */
        stretchy?: boolean
        /** El aire a los costados, que por defecto sale de si es signo o separador. */
        lspace?: string
        rspace?: string
      }
      mtext: Base
      mspace: Base & { width?: string }
      mfrac: Base & {
        /** `0` para un coeficiente binomial. */
        linethickness?: string
      }
      msup: Base
      msub: Base
      msubsup: Base
      msqrt: Base
      mroot: Base
      munder: Base
      mover: Base
      munderover: Base
      mstyle: Base
      mpadded: Base
      mphantom: Base
      mtable: Base & { columnalign?: string; rowspacing?: string; columnspacing?: string }
      mtr: Base
      mtd: Base & { columnalign?: string }
      semantics: Base
      annotation: Base & { encoding?: string }
    }
  }
}
