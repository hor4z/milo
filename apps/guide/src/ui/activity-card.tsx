import { Icon, Chip, cx, IconButton, usePrefs , labelColors, labelFill } from '@melu/ui'
import type { Activity } from '../data'

/**
 * La tarjeta de una actividad.
 *
 * No se mueve en hover: una grilla de doce tarjetas donde cada una salta al
 * pasar el mouse hace que la vista entera tiemble mientras recorrés. El hover
 * solo sube la elevación, que alcanza para decir "esto responde".
 *
 * Tampoco tiene acciones flotando encima. Un botón que aparece al pasar por
 * arriba no se puede descubrir sin mouse y tapa justo lo que estabas mirando;
 * lo que haya que hacer con una actividad va adentro, cuando la abrís.
 *
 * El medio es un tinte plano con una marca geométrica y no una foto: el tinte
 * viene del dato, así que la misma actividad siempre tiene el mismo color y la
 * grilla se vuelve reconocible de memoria.
 */
export function ActivityCard({ activity }: { activity: Activity }) {
  const { prefs } = usePrefs()
  const done = activity.submissions >= activity.learners
  const pct = Math.round((activity.submissions / activity.learners) * 100)

  return (
    <article className="flex flex-col rounded-2xl bg-surface p-2 shadow-card transition-shadow duration-[190ms] ease-out hover:shadow-toolbar">
      <div className={cx('relative aspect-[4/3] overflow-hidden rounded-xl', `bg-tint-${activity.tint}`)}>
        <Mark seed={activity.id} />
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="truncate text-xs font-semibold text-ink" title={activity.title}>{activity.title}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-2xs font-medium text-ink-muted">
          <span className="truncate">{activity.space}</span>
          {prefs.showLens && (
            <>
              <span aria-hidden="true">·</span>
              <span className="shrink-0">{activity.lens}</span>
            </>
          )}
        </div>

        {/* La barra de entregas: el dato que un guía mira primero. Verde solo
            cuando entregaron todos — si el verde apareciera al 60%, dejaría de
            significar "listo". */}
        <div className="mt-3 flex items-center gap-2.5">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-sunken">
            <div
              className={cx('h-full rounded-full transition-[width] duration-[320ms] ease-out', done ? 'bg-ok' : 'bg-solid')}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="tabular shrink-0 text-2xs font-medium text-ink-muted">
            {activity.submissions}/{activity.learners}
          </span>
        </div>
      </div>
    </article>
  )
}

/**
 * La marca del medio: cuatro formas que salen del id. Determinística a
 * propósito, para que la tarjeta no cambie de dibujo en cada render.
 */
function Mark({ seed }: { seed: string }) {
  const n = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0)
  const variant = n % 4
  return (
    <svg viewBox="0 0 200 150" className="absolute inset-0 size-full" aria-hidden="true">
      <g stroke="var(--text)" strokeOpacity="0.16" fill="none" strokeWidth="1.5">
        {variant === 0 && <>
          <circle cx="100" cy="75" r="34" /><circle cx="100" cy="75" r="54" strokeDasharray="3 5" />
          <path d="M46 75h108M100 21v108" strokeOpacity="0.1" />
        </>}
        {variant === 1 && <>
          <rect x="62" y="37" width="76" height="76" rx="10" />
          <rect x="78" y="53" width="44" height="44" rx="6" strokeDasharray="3 5" />
        </>}
        {variant === 2 && <>
          <path d="M56 104l24-40 20 26 18-30 26 44" />
          <path d="M56 112h88" strokeOpacity="0.12" />
          <circle cx="80" cy="64" r="4" fill="var(--text)" fillOpacity="0.18" stroke="none" />
        </>}
        {variant === 3 && <>
          <path d="M60 95c14-42 66-42 80 0" />
          <path d="M74 95c8-24 36-24 44 0" strokeDasharray="3 5" />
          <circle cx="100" cy="103" r="5" fill="var(--text)" fillOpacity="0.18" stroke="none" />
        </>}
      </g>
    </svg>
  )
}

/** La fila de una actividad, para las vistas en lista. */
export function ActivityRow({ activity }: { activity: Activity }) {
  const done = activity.submissions >= activity.learners
  return (
    <div className="group flex items-center gap-4 border-t border-line px-4 py-3 transition-colors first:border-t-0 hover:bg-hover">
      <span className={cx('flex size-9 shrink-0 items-center justify-center rounded-lg text-on-label', labelFill[labelColors[(activity.tint - 1) % labelColors.length]])}>
        <Icon name="cube" size={16} weight={1.5} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-semibold text-ink">{activity.title}</div>
        <div className="mt-0.5 truncate text-2xs font-medium text-ink-muted">{activity.space} · {activity.lens}</div>
      </div>
      <Chip color={done ? 'green' : undefined}>{done ? 'completa' : `${activity.submissions}/${activity.learners}`}</Chip>
      <span className="hidden w-28 shrink-0 text-right text-2xs font-medium text-ink-muted sm:block">{activity.updatedAt}</span>
      <IconButton icon="more" label="Más" size="sm" className="opacity-0 group-hover:opacity-100" />
    </div>
  )
}
