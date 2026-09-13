import s from './kit.module.css'
import { Children, useEffect, useState, type ReactNode } from 'react'
import { Chip, Icon, cx, type IconName } from '@milo/ui'
import { propsByComponent } from '@milo/ui/props'

export function useTokens(names: readonly string[]) {
  const [vals, setVals] = useState<Record<string, string>>({})
  const key = names.join('|')

  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement)
      const next: Record<string, string> = {}
      for (const n of key.split('|')) next[n] = cs.getPropertyValue(n).trim()
      setVals(next)
    }
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [key])

  return vals
}

/** El texto del sitio: los backticks salen como código y `**` como énfasis. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((t, i) =>
        t.startsWith('`') && t.endsWith('`')
          ? <code key={i} className={s.code}>{t.slice(1, -1)}</code>
          : t.startsWith('**') && t.endsWith('**')
            ? <strong key={i} className={s.strong}>{t.slice(2, -2)}</strong>
            : t)}
    </>
  )
}

type PageProps = {
  /** El nombre de la pieza, tal como se importa. */
  title: string
  /** Una línea: qué es y cuándo se usa. */
  lead: string
  /** Lo que hay que escribir para traerla. */
  imports?: string
  /** Categoría, para ubicarla de un vistazo. */
  kind?: string
  children: ReactNode
}

/** La cabecera de una pieza y el cuerpo de su página. */
export function Page({ title, lead, imports, kind, children }: PageProps) {
  return (
    <article className={s.article}>
      <header className={s.header}>
        <div className={s.div}>
          <h1 className={s.h1}>{title}</h1>
          {kind && <Chip size="sm">{kind}</Chip>}
        </div>
        <p className={s.p}><Rich text={lead} /></p>
        {imports && <Code>{imports}</Code>}
      </header>
      {children}
    </article>
  )
}

/** Una línea de código que se puede copiar. */
export function Code({ children }: { children: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(children)
        setCopied(true)
        setTimeout(() => setCopied(false), 1400)
      }}
      className={`${s.box} group`}
    >
      <code className={s.code2}>{children}</code>
      <Icon
        name={copied ? 'check' : 'content_copy'}
        size={14}
        className={`${s.icon} icon-muted`}
      />
      <span className="sr-only">{copied ? 'Copiado' : 'Copiar'}</span>
    </button>
  )
}

/** Un bloque con título, una explicación y lo que se muestra. */
export function Section({ title, note, children }: { title: string; note?: string; children?: ReactNode }) {
  return (
    <section className={s.section}>
      <div className={s.div2}>
        <h2 className={s.h2}><Rich text={title} /></h2>
        {note && <p className={s.p2}><Rich text={note} /></p>}
      </div>
      {children}
    </section>
  )
}

/** El lienzo donde se apoya un ejemplo. */
export function Canvas({ children, className, pad = true }: { children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <div
      className={cx(
        `${s.div3} bg-surface`,
        pad && s.pad,
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Un ejemplo con su etiqueta abajo. */
export function Demo({ label, children, className }: { label?: string; children: ReactNode; className?: string }) {
  return (
    <div className={s.div4}>
      <Canvas className={cx(s.canvas, className)}>{children}</Canvas>
      {label && <div className={s.div5}><Rich text={label} /></div>}
    </div>
  )
}

/** Varios ejemplos en grilla. */
export function Grid({ children, min = 220 }: { children: ReactNode; min?: number }) {
  return (
    <div className={s.div6} style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))` }}>
      {children}
    </div>
  )
}

/** Una fila de variantes con su nombre al costado. */
export function Variant({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className={s.div7}>
      <code className={s.code3}>{name}</code>
      <div className={s.div8}>{children}</div>
    </div>
  )
}

/** El contenedor de una lista de variantes. */
export function Panel({ children }: { children: ReactNode }) {
  return <Canvas className={s.canvas2}>{children}</Canvas>
}

export function Mono({ children }: { children: ReactNode }) {
  return <code className={s.code4}>{children}</code>
}

/** La tabla de props. Las filas salen del código: tipo, default y descripción
    los escribe la pieza en su docblock y los extrae `scripts/props.mjs`. */
export function Props({ of }: { of: string | readonly string[] }) {
  const piezas = typeof of === 'string' ? [of] : of
  return (
    <div className={s.div9}>
      {piezas.map(pieza => {
        const doc = propsByComponent[pieza]
        const rows = doc?.props ?? []
        return (
          <div key={pieza} className={s.div10}>
            {piezas.length > 1 && (
              <div className={s.div11}>
                <code className={s.code5}>{pieza}</code>
                {doc?.doc && <span className={s.span2}><Rich text={doc.doc} /></span>}
              </div>
            )}
            {rows.length === 0 ? (
              <p className={s.p3}>
                No tiene props propias: toma los atributos de un{' '}
                <code className={s.code6}>{`<${doc?.html ?? 'div'}>`}</code>.
              </p>
            ) : (
            <table className={s.table}>
              <thead>
                <tr className={s.tr}>
                  <th scope="col" className={s.th}>Prop</th>
                  <th scope="col" className={s.th2}>Tipo</th>
                  <th scope="col" className={s.th3}>Default</th>
                  <th scope="col" className={s.th4}>Qué hace</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.name} className={s.tr2}>
                    <td className={s.td}>
                      <span className={s.span3}>
                        <code className={s.code7}>{r.name}</code>
                        {r.required && (
                          <span className={s.span4}>obligatorio</span>
                        )}
                      </span>
                    </td>
                    <td className={s.td2}><code className={s.code8}>{r.type}</code></td>
                    <td className={s.td3}>
                      <code className={s.code9}>{r.def ?? '-'}</code>
                    </td>
                    <td className={s.td4}>
                      {r.doc ? <Rich text={r.doc} /> : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
            {rows.length > 0 && doc?.html && (
              <p className={s.p4}>
                Y los atributos de un{' '}
                <code className={s.code10}>{`<${doc.html}>`}</code>.
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function Note({ icon = 'lightbulb', title, children }: { icon?: IconName; title?: string; children: ReactNode }) {
  return (
    <div className={`${s.div12} bg-surface`}>
      <Icon name={icon} size={18} className={`${s.icon2} icon-muted`} />
      <div className={s.div13}>
        {title && <p className={s.p5}><Rich text={title} /></p>}
        <div className={s.div14}>
          {Children.map(children, c => (typeof c === 'string' ? <Rich text={c} /> : c))}
        </div>
      </div>
    </div>
  )
}

/** Lo que la pieza hace por accesibilidad, en una lista corta. */
export function A11y({ items }: { items: string[] }) {
  return (
    <ul className={s.ul}>
      {items.map(t => (
        <li key={t} className={s.li}>
          <Icon name="check" size={16} className={s.icon3} />
          <span className={s.span5}><Rich text={t} /></span>
        </li>
      ))}
    </ul>
  )
}

export function Swatch({ token, note }: { token: string; note?: string }) {
  const vals = useTokens([token])
  const v = vals[token]
  return (
    <div className={s.div15}>
      <span
        className={s.span6}
        style={{ background: v ? `var(${token})` : undefined }}
      />
      <div className={s.div16}>
        <code className={s.code11}>{token}</code>
        <code className={s.code12}>{v || '-'}</code>
        {note && <span className={s.span7}>{note}</span>}
      </div>
    </div>
  )
}

export function Ramp({ tokens }: { tokens: readonly string[] }) {
  const vals = useTokens(tokens)
  return (
    <div className={s.div17}>
      <div className={s.div18}>
        {tokens.map(t => (
          <div key={t} className={s.div19} style={{ background: `var(${t})` }} />
        ))}
      </div>
      <div className={s.div20}>
        {tokens.map(t => (
          <div key={t} className={s.div21}>
            <code className={s.code13}>{t.replace('--', '')}</code>
            <code className={s.code14}>{vals[t]}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
