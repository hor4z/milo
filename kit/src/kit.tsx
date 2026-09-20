import s from './kit.module.css'
import { Children, useEffect, useState, type ReactNode } from 'react'
import { Chip } from '@milo/ui/chip'
import { Icon, type IconName } from '@milo/ui/icon'
import { cx } from '@milo/ui/lib/cx'
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

/** El texto del sitio: los backticks salen como código, `**` como énfasis y `[texto](destino)` como link. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((t, i) => {
        if (t.startsWith('`') && t.endsWith('`')) return <code key={i} className={s.inlineCode}>{t.slice(1, -1)}</code>
        if (t.startsWith('**') && t.endsWith('**')) return <strong key={i} className={s.inlineStrong}>{t.slice(2, -2)}</strong>
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(t)
        if (link) {
          const external = link[2].startsWith('http')
          return (
            <a
              key={i}
              href={link[2]}
              className={s.inlineLink}
              {...(external && { target: '_blank', rel: 'noreferrer' })}
            >
              {link[1]}
            </a>
          )
        }
        return t
      })}
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
    <article className={s.page}>
      <header className={s.pageHeader}>
        <div className={s.pageTitleRow}>
          <h1 className={s.pageTitle}>{title}</h1>
          {kind && <Chip size="sm">{kind}</Chip>}
        </div>
        <p className={s.pageLead}><Rich text={lead} /></p>
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
      className={`${s.importBlock} group`}
    >
      <code className={s.importCode}>{children}</code>
      <Icon
        name={copied ? 'check' : 'content_copy'}
        size={14}
        className={`${s.importCopyIcon} icon-muted`}
      />
      <span className="sr-only">{copied ? 'Copiado' : 'Copiar'}</span>
    </button>
  )
}

type Token = { text: string; kind?: string }

/** Lo que se distingue en un JSX. No es una gramática: es lo justo para un ejemplo de uso, que es lo único que este sitio muestra. El nombre de la pieza se reconoce junto al `<` que lo abre y no por venir en mayúscula, así una palabra capitalizada del contenido no se pinta como si fuera un componente. */
const RULES: { re: RegExp; tokens: (m: RegExpExecArray) => Token[] }[] = [
  { re: /^(<\/?)([A-Z][A-Za-z0-9.]*)/, tokens: m => [{ text: m[1], kind: 'punct' }, { text: m[2], kind: 'component' }] },
  { re: /^"[^"]*"/, tokens: m => [{ text: m[0], kind: 'string' }] },
  { re: /^[a-zA-Z][A-Za-z0-9]*(?=\s*=)/, tokens: m => [{ text: m[0], kind: 'prop' }] },
  { re: /^(?:true|false|null|undefined|\d+(?:\.\d+)?)\b/, tokens: m => [{ text: m[0], kind: 'value' }] },
  { re: /^(?:\/?>|[={}()[\]])/, tokens: m => [{ text: m[0], kind: 'punct' }] },
  { re: /^\/\/.*/, tokens: m => [{ text: m[0], kind: 'comment' }] },
]

function tokenize(line: string) {
  const out: Token[] = []
  let rest = line
  let plain = ''
  while (rest) {
    const rule = RULES.find(r => r.re.test(rest))
    if (!rule) {
      plain += rest[0]
      rest = rest.slice(1)
      continue
    }
    if (plain) { out.push({ text: plain }); plain = '' }
    const m = rule.re.exec(rest)!
    out.push(...rule.tokens(m))
    rest = rest.slice(m[0].length)
  }
  if (plain) out.push({ text: plain })
  return out
}

const highlight: Record<string, string> = {
  component: s.codeComponent,
  prop: s.codeProp,
  string: s.codeString,
  value: s.codeValue,
  punct: s.codePunct,
  comment: s.codeComment,
}

/** Cómo se escribe la pieza. Va al lado de la tabla de props: una dice qué acepta, el otro cómo se usa. */
export function Example({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className={`${s.codeBlock} group`}>
      <pre className={s.codePre}>
        <code>
          {code.trim().split('\n').map((line, i) => (
            <span key={i} className={s.codeLine}>
              {tokenize(line).map((token, j) => (
                <span key={j} className={token.kind ? highlight[token.kind] : undefined}>{token.text}</span>
              ))}
            </span>
          ))}
        </code>
      </pre>
      <button
        type="button"
        aria-label={copied ? 'Copiado' : 'Copiar el ejemplo'}
        className={s.codeCopy}
        onClick={() => {
          navigator.clipboard?.writeText(code.trim())
          setCopied(true)
          setTimeout(() => setCopied(false), 1400)
        }}
      >
        <Icon name={copied ? 'check' : 'content_copy'} size={14} className="icon-muted" />
      </button>
    </div>
  )
}

/** Un bloque con título, una explicación y lo que se muestra. */
export function Section({ title, note, children }: { title: string; note?: string; children?: ReactNode }) {
  return (
    <section className={s.section}>
      <Stack gap="sm">
        <h2 className={s.sectionTitle}><Rich text={title} /></h2>
        {note && <p className={s.sectionNote}><Rich text={note} /></p>}
      </Stack>
      {children}
    </section>
  )
}

type CanvasProps = {
  children: ReactNode
  className?: string
  /** El aire de adentro. */
  pad?: boolean
  /** Centra lo que hay adentro, para una pieza que se mira sola. */
  center?: boolean
  /** Apila lo de adentro en columna, alineado a la izquierda y con aire entre medio. */
  stack?: boolean
}

/** El lienzo donde se apoya un ejemplo. */
export function Canvas({ children, className, pad = true, center, stack }: CanvasProps) {
  return (
    <div
      className={cx(
        `${s.canvas} bg-surface`,
        pad && s.canvasPad,
        center && s.canvasCenter,
        stack && s.canvasStack,
        className,
      )}
    >
      {children}
    </div>
  )
}

const clusterGaps = { xs: s.clusterXs, sm: s.clusterSm, md: s.clusterMd, lg: s.clusterLg, xl: s.clusterXl }
const clusterAligns = { stretch: '', start: s.clusterStart, center: s.clusterCenter, end: s.clusterEnd }

/** Una fila de piezas que envuelve al llegar al borde. Es `Variant` sin el nombre al costado. */
export function Cluster({ gap = 'md', align = 'stretch', children, className }: {
  /** El aire entre una pieza y la siguiente. */
  gap?: keyof typeof clusterGaps
  /** Cómo se apoyan entre sí las piezas de distinto alto. */
  align?: keyof typeof clusterAligns
  children: ReactNode
  className?: string
}) {
  return <div className={cx(s.cluster, clusterGaps[gap], clusterAligns[align], className)}>{children}</div>
}

const frameWidths = { xs: s.frameXs, sm: s.frameSm, md: s.frameMd, lg: s.frameLg, xl: s.frameXl }
const stackAligns = { stretch: '', start: s.stackStart, center: s.stackCenter }

/** Una columna con aire entre cada cosa. Es `Cluster` de arriba abajo, y comparte su escala de gap. */
export function Stack({ gap = 'md', align = 'stretch', width, children, className }: {
  /** El aire entre una cosa y la siguiente. */
  gap?: keyof typeof clusterGaps
  /** Cómo se alinean entre sí las cosas de distinto ancho. */
  align?: keyof typeof stackAligns
  /** Un tope de ancho, de la misma escala que `Frame`. */
  width?: keyof typeof frameWidths
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cx(s.stack, clusterGaps[gap], stackAligns[align], width && s.frame, width && frameWidths[width], className)}>
      {children}
    </div>
  )
}

/** Le pone un tope de ancho a la pieza y la estira hasta ahí, para que no se lea a lo ancho del lienzo. Estira solo si adentro hay una sola cosa: con varias, cada una se mide sola. */
export function Frame({ width = 'sm', children, className }: {
  /** 280, 320, 420, 520 o 680. */
  width?: keyof typeof frameWidths
  children: ReactNode
  className?: string
}) {
  return <div className={cx(s.frame, frameWidths[width], className)}>{children}</div>
}

/** La aclaración que va debajo de la demo. La de arriba es la `note` de `Section`. */
export function Footnote({ children }: { children: ReactNode }) {
  return (
    <p className={s.footnote}>
      {Children.map(children, c => (typeof c === 'string' ? <Rich text={c} /> : c))}
    </p>
  )
}

/** Un ejemplo con su etiqueta abajo. */
export function Demo({ label, width, fill, children, className }: {
  label?: string
  /** Le pone tope de ancho a la caja, de la misma escala que `Frame`. */
  width?: keyof typeof frameWidths
  /** La pieza de adentro ocupa el ancho del lienzo, para un campo que si no se mide por su contenido. */
  fill?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cx(s.demo, width && s.frame, width && frameWidths[width])}>
      <Canvas className={cx(s.demoCanvas, fill && s.demoFill, className)}>{children}</Canvas>
      {label && <div className={s.demoCaption}><Rich text={label} /></div>}
    </div>
  )
}

/** Varios ejemplos en grilla: se acomodan solos, o en la cantidad de columnas que le pidas. */
export function Grid({ children, min = 220, cols }: {
  children: ReactNode
  /** El ancho mínimo de cada columna, cuando la cantidad la decide el espacio. */
  min?: number
  /** Cuántas columnas, cuando la cantidad es parte de lo que se muestra. */
  cols?: number
}) {
  return (
    <div
      className={s.demoGrid}
      style={{ gridTemplateColumns: cols ? `repeat(${cols}, minmax(0, 1fr))` : `repeat(auto-fill, minmax(${min}px, 1fr))` }}
    >
      {children}
    </div>
  )
}

/** Una fila de variantes con su nombre al costado. */
export function Variant({ name, note, children }: {
  name: string
  /** Qué significa esta variante, al lado de la pieza. Sin esto la fila solo muestra cómo se ve, no cuándo va. */
  note?: string
  children: ReactNode
}) {
  return (
    <div className={s.variant}>
      <code className={s.variantName}>{name}</code>
      <div className={s.variantItems}>{children}</div>
      {note && <p className={s.variantNote}><Rich text={note} /></p>}
    </div>
  )
}

/** El contenedor de una lista de variantes. */
export function Panel({ children }: { children: ReactNode }) {
  return <Canvas className={s.panelCanvas}>{children}</Canvas>
}

export function Mono({ children }: { children: ReactNode }) {
  return <code className={s.monoValue}>{children}</code>
}

/** La tabla de props. Las filas salen del código: tipo, default y descripción los escribe la pieza en su docblock y los extrae `scripts/props.mjs`. */
export function Props({ of }: { of: string | readonly string[] }) {
  const pedidos = typeof of === 'string' ? [of] : of
  // con la raíz alcanza: las partes de la familia salen solas, en el orden en que la pieza las cuelga
  const names = pedidos.flatMap(pieza => [
    pieza,
    ...Object.keys(propsByComponent).filter(k => k.startsWith(`${pieza}.`)),
  ])
  return (
    <Stack gap="lg">
      {names.map(pieza => {
        const info = propsByComponent[pieza]
        const rows = info?.props ?? []
        return (
          <div key={pieza} className={s.propsTable}>
            {names.length > 1 && (
              <div className={s.propsHeader}>
                <code className={s.propsName}>{pieza}</code>
                {info?.doc && <span className={s.propsDoc}><Rich text={info.doc} /></span>}
              </div>
            )}
            {rows.length === 0 ? (
              <p className={s.propsEmpty}>
                No tiene props propias: toma los atributos de un{' '}
                <code className={s.propsEmptyTag}>{`<${info?.html ?? 'div'}>`}</code>.
              </p>
            ) : (
            <table className={s.table}>
              <thead>
                <tr className={s.headRow}>
                  <th scope="col" className={s.headCellName}>Prop</th>
                  <th scope="col" className={s.headCellType}>Tipo</th>
                  <th scope="col" className={s.headCellDefault}>Default</th>
                  <th scope="col" className={s.headCellDoc}>Qué hace</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.name} className={s.row}>
                    <td className={s.cellName}>
                      <span className={s.propNameGroup}>
                        <code className={s.propName}>{r.name}</code>
                        {r.required && (
                          <span className={s.propRequired}>obligatorio</span>
                        )}
                      </span>
                    </td>
                    <td className={s.cellType}><code className={s.propType}>{r.type}</code></td>
                    <td className={s.cellDefault}>
                      <code className={s.propDefault}>{r.def ?? '-'}</code>
                    </td>
                    <td className={s.cellDoc}>
                      {r.doc ? <Rich text={r.doc} /> : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
            {rows.length > 0 && info?.html && (
              <p className={s.propsHtmlNote}>
                Y los atributos de un{' '}
                <code className={s.propsHtmlTag}>{`<${info.html}>`}</code>.
              </p>
            )}
          </div>
        )
      })}
    </Stack>
  )
}

export function Note({ icon = 'lightbulb', title, children }: { icon?: IconName; title?: string; children: ReactNode }) {
  return (
    <div className={`${s.note} bg-surface`}>
      <Icon name={icon} size={18} className={`${s.noteIcon} icon-muted`} />
      <div className={s.noteBody}>
        {title && <p className={s.noteTitle}><Rich text={title} /></p>}
        <div className={s.noteText}>
          {Children.map(children, c => (typeof c === 'string' ? <Rich text={c} /> : c))}
        </div>
      </div>
    </div>
  )
}

/** Lo que la pieza hace por accesibilidad, en una lista corta. */
export function A11y({ items }: { items: string[] }) {
  return (
    <ul className={s.a11yList}>
      {items.map(t => (
        <li key={t} className={s.a11yItem}>
          <Icon name="check" size={16} className={s.a11yCheck} />
          <span className={s.a11yText}><Rich text={t} /></span>
        </li>
      ))}
    </ul>
  )
}

export function Swatch({ token, note }: { token: string; note?: string }) {
  const vals = useTokens([token])
  const v = vals[token]
  return (
    <div className={s.swatch}>
      <span
        className={s.swatchChip}
        style={{ background: v ? `var(${token})` : undefined }}
      />
      <div className={s.swatchMeta}>
        <code className={s.swatchToken}>{token}</code>
        <code className={s.swatchValue}>{v || '-'}</code>
        {note && <span className={s.swatchNote}>{note}</span>}
      </div>
    </div>
  )
}

export function Ramp({ tokens }: { tokens: readonly string[] }) {
  const vals = useTokens(tokens)
  return (
    <div className={s.ramp}>
      <div className={s.rampBar}>
        {tokens.map(t => (
          <div key={t} className={s.rampStep} style={{ background: `var(${t})` }} />
        ))}
      </div>
      <div className={s.rampLabels}>
        {tokens.map(t => (
          <div key={t} className={s.rampLabel}>
            <code className={s.rampToken}>{t.replace('--', '')}</code>
            <code className={s.rampValue}>{vals[t]}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
