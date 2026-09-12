import { cx } from '@melu/ui'
import { updates } from '../data'

const tagLabel = { nuevo: 'Nuevo', mejora: 'Mejora', arreglo: 'Arreglo' } as const
const tagStyle = {
  nuevo: 'bg-accent-subtle text-accent',
  mejora: 'bg-muted text-ink-muted',
  arreglo: 'bg-muted text-ink-muted',
} as const

/** Novedades. */
export function UpdatesScreen() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 pb-20">
      <header className="py-14 text-center">
        <h1 className="text-display font-medium">
          Novedades
          <span className="block text-ink-muted">Lo que cambió en melu.</span>
        </h1>
      </header>

      <div className="flex flex-col">
        {updates.map(u => (
          <article key={u.id} className="flex flex-col gap-6 border-t border-line py-12 md:flex-row">
            <div className="shrink-0 md:w-[348px] md:pr-6">
              <div className="flex items-center gap-2.5">
                <span className={cx('rounded-sm px-1.5 py-0.5 text-2xs font-semibold', tagStyle[u.tag])}>
                  {tagLabel[u.tag]}
                </span>
                <span className="tabular text-2xs font-medium text-ink-muted">v{u.version}</span>
              </div>
              <h2 className="mt-3 text-lg font-medium">{u.title}</h2>
              <p className="mt-1.5 text-xs font-medium text-ink-muted">{u.date}</p>
              <p className="mt-4 max-w-[46ch] text-xs leading-[18px] text-ink-muted md:hidden">{u.body}</p>
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-5 hidden max-w-[62ch] text-xs leading-[18px] text-ink-muted md:block">{u.body}</p>
              <Shot seed={u.id} />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

/** El lugar de la captura. */
function Shot({ seed }: { seed: string }) {
  const n = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0)
  const tint = `bg-tint-${(n % 6) + 1}`
  return (
    <div className={cx('overflow-hidden rounded-2xl p-2', tint)}>
      <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-surface/60">
        <svg viewBox="0 0 320 180" className="size-full" aria-hidden="true">
          <g stroke="var(--text)" strokeOpacity="0.14" fill="none" strokeWidth="1">
            <rect x="24" y="24" width="80" height="132" rx="8" />
            <path d="M24 56h80M24 88h80M24 120h80" strokeOpacity="0.09" />
            <rect x="120" y="24" width="176" height="60" rx="8" />
            <rect x="120" y="96" width="84" height="60" rx="8" />
            <rect x="212" y="96" width="84" height="60" rx="8" />
          </g>
        </svg>
      </div>
    </div>
  )
}
