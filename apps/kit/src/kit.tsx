import { useEffect, useState, type ReactNode } from 'react'
import { Badge, Icon, cx, type IconName } from '@melu/ui'
import { propsByComponent } from '@melu/ui/props'

export function useTokens(names: readonly string[]) {
  const [vals, setVals] = useState<Record<string, string>>({})
  // La dependencia es el contenido y no el arreglo: con la identidad, un
  // `useTokens(['--x'])` escrito inline arma uno nuevo en cada render y el
  // effect se vuelve a disparar para siempre.
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

function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g)
  return (
    <>
      {parts.map((t, i) =>
        t.startsWith('`') && t.endsWith('`')
          ? <code key={i} className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.92em] text-ink">{t.slice(1, -1)}</code>
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
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 border-b border-line pb-7">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-display font-bold tracking-tight text-ink">{title}</h1>
          {kind && <Badge>{kind}</Badge>}
        </div>
        <p className="max-w-[68ch] text-base font-medium text-ink-muted"><Rich text={lead} /></p>
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
      className="group inline-flex max-w-full items-center gap-2.5 self-start rounded-lg border border-line bg-muted py-1.5 pr-2.5 pl-3 text-left transition-colors hover:bg-sunken"
    >
      <code className="truncate font-mono text-2xs text-ink">{children}</code>
      <Icon
        name={copied ? 'check' : 'content_copy'}
        size={14}
        className="icon-muted shrink-0 transition-colors group-hover:text-ink"
      />
      <span className="sr-only">{copied ? 'Copiado' : 'Copiar'}</span>
    </button>
  )
}

/** Un bloque con título, una explicación y lo que se muestra. */
export function Section({ title, note, children }: { title: string; note?: string; children?: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {note && <p className="max-w-[72ch] text-xs font-medium text-ink-muted"><Rich text={note} /></p>}
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
        'relative overflow-hidden rounded-2xl border border-line bg-muted',
        pad && 'p-6',
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
    <div className="flex min-w-0 flex-col gap-2">
      <Canvas className={cx('flex min-h-[92px] items-center justify-center', className)}>{children}</Canvas>
      {label && <div className="px-0.5 text-2xs font-medium text-ink-muted">{label}</div>}
    </div>
  )
}

/** Varios ejemplos en grilla. */
export function Grid({ children, min = 220 }: { children: ReactNode; min?: number }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))` }}>
      {children}
    </div>
  )
}

/** Una fila de variantes con su nombre al costado. */
export function Variant({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-line py-3.5 last:border-0">
      <code className="w-[168px] shrink-0 font-mono text-2xs text-ink-muted">{name}</code>
      <div className="flex min-w-0 flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

/** El contenedor de una lista de variantes. */
export function Panel({ children }: { children: ReactNode }) {
  return <Canvas className="px-6 py-1">{children}</Canvas>
}

export function Mono({ children }: { children: ReactNode }) {
  return <code className="font-mono text-2xs text-ink-muted">{children}</code>
}

/** La tabla de props. Las filas salen del código: tipo, default y descripción
    los escribe la pieza en su docblock y los extrae `scripts/props.mjs`. */
export function Props({ of }: { of: string | readonly string[] }) {
  const piezas = typeof of === 'string' ? [of] : of
  return (
    <div className="flex flex-col gap-4">
      {piezas.map(pieza => {
        const doc = propsByComponent[pieza]
        const rows = doc?.props ?? []
        return (
          <div key={pieza} className="overflow-hidden rounded-xl border border-line">
            {piezas.length > 1 && (
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line bg-muted px-4 py-2">
                <code className="font-mono text-2xs font-semibold text-ink">{pieza}</code>
                {doc?.doc && <span className="text-2xs font-medium text-ink-muted"><Rich text={doc.doc} /></span>}
              </div>
            )}
            {rows.length === 0 ? (
              <p className="px-4 py-3 text-2xs font-medium text-ink-muted">
                No tiene props propias: toma los atributos de un{' '}
                <code className="font-mono text-2xs text-ink">{`<${doc?.html ?? 'div'}>`}</code>.
              </p>
            ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-muted">
                  <th scope="col" className="px-4 py-2.5 text-2xs font-semibold tracking-wide text-ink">Prop</th>
                  <th scope="col" className="px-4 py-2.5 text-2xs font-semibold tracking-wide text-ink">Tipo</th>
                  <th scope="col" className="hidden px-4 py-2.5 text-2xs font-semibold tracking-wide text-ink sm:table-cell">Default</th>
                  <th scope="col" className="px-4 py-2.5 text-2xs font-semibold tracking-wide text-ink">Qué hace</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.name} className="border-t border-line align-top">
                    <td className="px-4 py-3">
                      <span className="flex flex-col gap-1">
                        <code className="font-mono text-2xs font-semibold text-ink">{r.name}</code>
                        {r.required && (
                          <span className="text-[10px] font-semibold tracking-wide text-bad-ink uppercase">obligatorio</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3"><code className="font-mono text-2xs text-brand-ink">{r.type}</code></td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <code className="font-mono text-2xs text-ink-muted">{r.def ?? '—'}</code>
                    </td>
                    <td className="px-4 py-3 text-2xs font-medium text-ink-muted">
                      {r.doc ? <Rich text={r.doc} /> : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
            {rows.length > 0 && doc?.html && (
              <p className="border-t border-line px-4 py-2.5 text-2xs font-medium text-ink-muted">
                Y los atributos de un{' '}
                <code className="font-mono text-2xs text-ink">{`<${doc.html}>`}</code>.
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
    <div className="flex gap-3 rounded-xl border border-line bg-surface p-4">
      <Icon name={icon} size={18} className="icon-muted mt-px shrink-0" />
      <div className="flex min-w-0 flex-col gap-1">
        {title && <p className="text-xs font-semibold text-ink">{title}</p>}
        <div className="max-w-[70ch] text-xs font-medium text-ink-muted">{children}</div>
      </div>
    </div>
  )
}

/** Lo que la pieza hace por accesibilidad, en una lista corta. */
export function A11y({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map(t => (
        <li key={t} className="flex gap-2.5 text-xs font-medium text-ink-muted">
          <Icon name="check" size={16} className="mt-px shrink-0 text-ok" />
          <span className="max-w-[70ch]"><Rich text={t} /></span>
        </li>
      ))}
    </ul>
  )
}

export function Swatch({ token, note }: { token: string; note?: string }) {
  const vals = useTokens([token])
  const v = vals[token]
  return (
    <div className="flex items-center gap-3">
      <span
        className="size-9 shrink-0 rounded-lg border border-line"
        style={{ background: v ? `var(${token})` : undefined }}
      />
      <div className="flex min-w-0 flex-col">
        <code className="truncate font-mono text-2xs text-ink">{token}</code>
        <code className="truncate font-mono text-2xs text-ink-muted">{v || '—'}</code>
        {note && <span className="mt-0.5 text-2xs text-ink-muted">{note}</span>}
      </div>
    </div>
  )
}

export function Ramp({ tokens }: { tokens: readonly string[] }) {
  const vals = useTokens(tokens)
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <div className="flex h-16">
        {tokens.map(t => (
          <div key={t} className="flex-1" style={{ background: `var(${t})` }} />
        ))}
      </div>
      <div className="flex border-t border-line">
        {tokens.map(t => (
          <div key={t} className="min-w-0 flex-1 px-1.5 py-2 text-center">
            <code className="block truncate font-mono text-2xs text-ink-muted">{t.replace('--', '')}</code>
            <code className="block truncate font-mono text-2xs text-ink">{vals[t]}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
