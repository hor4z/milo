import { useEffect, useState, type ReactNode } from 'react'
import { cx, usePrefs } from '@melu/ui'

/** Los andamios de la galería. */

/** Lee el valor real de un token del `<html>`, no el que está escrito en el CSS. */
export function useTokens(names: readonly string[]) {
  const { prefs } = usePrefs()
  const [values, setValues] = useState<Record<string, string>>({})
  const key = names.join(',')

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement)
    const next: Record<string, string> = {}
    for (const n of key.split(',')) next[n] = cs.getPropertyValue(n).trim()
    setValues(next)
  }, [key, prefs.theme])

  return values
}

export function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="scroll-mt-6 border-t border-line pt-8 first:border-t-0 first:pt-0">
      <h2 className="font-display text-xl font-semibold tracking-[-0.015em]">{title}</h2>
      {note && <p className="mt-2 max-w-[70ch] text-xs font-medium text-ink-muted">{note}</p>}
      <div className="mt-5 flex flex-col gap-7">{children}</div>
    </section>
  )
}

/** Un tramo dentro de una sección: rótulo chico y su contenido. */
export function Block({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="text-xs font-semibold text-ink">{label}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      {note && <p className="mb-3 max-w-[70ch] text-xs font-medium text-ink-muted">{note}</p>}
      {children}
    </div>
  )
}

export function Grid({ children, min = 200 }: { children: ReactNode; min?: number }) {
  return (
    <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))` }}>
      {children}
    </div>
  )
}

/** La celda que enmarca un componente vivo. */
export function Demo({ label, children, className }: { label?: string; children: ReactNode; className?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={cx(
          'flex min-h-[76px] flex-wrap items-center gap-3 rounded-xl border border-line bg-surface px-4 py-4',
          className,
        )}
      >
        {children}
      </div>
      {label && <Mono>{label}</Mono>}
    </div>
  )
}

/** La caja que contiene una lista de `Variant`. */
export function Panel({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-line bg-surface px-4">{children}</div>
}

export function Mono({ children }: { children: ReactNode }) {
  return <span className="font-mono text-2xs text-ink-muted">{children}</span>
}

/** El cuadrado de color con su token y su valor resuelto. */
export function Swatch({ token, note }: { token: string; note?: string }) {
  const values = useTokens([token])
  const value = values[token] ?? ''
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line bg-surface p-2">
      <span
        className="size-11 shrink-0 rounded-md border border-line-alpha"
        style={{ background: `var(${token})` }}
      />
      <span className="min-w-0">
        <span className="block truncate font-mono text-2xs text-ink">{token}</span>
        <span className="block truncate font-mono text-2xs text-ink-muted">{value || '—'}</span>
        {note && <span className="mt-0.5 block truncate text-2xs text-ink-muted">{note}</span>}
      </span>
    </div>
  )
}

/** La rampa entera en una tira, que es como se ve si los pasos están parejos. */
export function Ramp({ tokens }: { tokens: readonly string[] }) {
  const values = useTokens(tokens)
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[640px]">
        {tokens.map((t, i) => (
          <div key={t} className="flex-1">
            <div
              className={cx(
                'h-20 border-y border-line-alpha',
                i === 0 && 'rounded-l-lg border-l',
                i === tokens.length - 1 && 'rounded-r-lg border-r',
              )}
              style={{ background: `var(${t})` }}
            />
            <div className="px-1 pt-2">
              <div className="font-mono text-2xs text-ink">{t.replace('--shade-', '')}</div>
              <div className="font-mono text-2xs text-ink-muted">{values[t] ?? ''}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** La tabla de props de una historia. */
export function Props({ rows }: { rows: readonly { name: string; type: string; def?: string; note?: string }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            {['prop', 'tipo', 'default', ''].map((h, i) => (
              <th key={i} className="pb-2 pr-4 text-2xs font-semibold text-ink-muted">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.name} className="border-b border-line last:border-b-0">
              <td className="py-2.5 pr-4 align-top font-mono text-2xs text-ink">{r.name}</td>
              <td className="py-2.5 pr-4 align-top font-mono text-2xs text-ink-muted">{r.type}</td>
              <td className="py-2.5 pr-4 align-top font-mono text-2xs text-ink-muted">{r.def ?? '—'}</td>
              <td className="py-2.5 align-top text-2xs text-ink-muted">{r.note ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Una fila etiquetada: el nombre de la variante a la izquierda, la pieza a la derecha. */
export function Variant({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line py-3 first:border-t-0">
      <span className="w-28 shrink-0 font-mono text-2xs text-ink-muted">{name}</span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}
