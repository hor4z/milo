import { useState, type ReactNode } from 'react'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'
import { useSideScroll } from '../lib/side-scroll'

/** Un bloque de código, con su nombre de archivo y su botón de copiar. */
export function CodeBlock({ code, children, lang, filename, numbered, label, className }: {
  /** El código como texto. Es lo que se copia, y lo que se lee si no hay `children`. */
  code: string
  /** El mismo código ya coloreado por quien sepa hacerlo. Sin esto se muestra `code` tal cual. */
  children?: ReactNode
  /** El lenguaje: se muestra arriba y viaja como `language-*`, que es lo que espera un coloreador. */
  lang?: string
  /** El nombre del archivo, en la franja de arriba. */
  filename?: string
  /** La columna de números a la izquierda. No se copia ni se lee en voz alta, y se arma desde `code`: con números, `children` no se usa. */
  numbered?: boolean
  /** De qué es el código, para quien lo escucha. Sin esto se anuncia por el lenguaje. */
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const { ref, scrolls } = useSideScroll<HTMLPreElement>(code)
  const lines = code.replace(/\n$/, '').split('\n')
  const name = label ?? (filename ? `Código de ${filename}` : lang ? `Código ${lang}` : 'Código')

  const copy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className={cx('overflow-hidden rounded-xl border border-line bg-muted', className)}>
      <div className="flex items-center gap-2 border-b border-line px-3 py-1">
        <span className="truncate font-mono text-meta text-ink-muted">{filename ?? lang ?? ''}</span>
        <button
          type="button"
          onClick={copy}
          className="ml-auto inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors duration-fast ease-out hover:bg-sunken"
        >
          <Icon name={copied ? 'check' : 'content_copy'} size={14} className="icon-muted" />
          <span className="sr-only">{copied ? 'Copiado' : 'Copiar el código'}</span>
        </button>
      </div>

      {/* Es una parada de tabulación solo cuando de verdad hay algo cortado a la
          derecha: sin barra a mano, esa es la única forma de llegar sin mouse. */}
      <pre
        ref={ref}
        tabIndex={scrolls ? 0 : undefined}
        role={scrolls ? 'region' : undefined}
        aria-label={scrolls ? `${name}, se desplaza de costado` : undefined}
        className="overflow-x-auto p-4 font-mono text-body text-ink"
      >
        <code className={lang ? `language-${lang}` : undefined}>
          {numbered
            ? lines.map((line, i) => (
              // Cada renglón es su propia grilla, así que la columna de la
              // izquierda tiene que medir igual en todos: sale del número más
              // largo. Fija en 2ch, un archivo de cien líneas se cortaba.
              <span key={i} className="grid gap-4" style={{ gridTemplateColumns: `${String(lines.length).length}ch 1fr` }}>
                {/* Afuera del `<code>` no se puede, así que lo que lo mantiene
                    fuera de lo copiado es `select-none` y el `aria-hidden`. */}
                <span aria-hidden="true" className="select-none text-right text-ink-subtle">{i + 1}</span>
                <span>{line === '' ? ' ' : line}</span>
              </span>
            ))
            : children ?? code}
        </code>
      </pre>
    </div>
  )
}
