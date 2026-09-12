import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Popover, Avatar, Button, cx, Segmented, Icon, type IconName } from '@melu/ui'
import { notifications, type Notif, type NotifKind } from '../data'

/** Cada tipo de aviso trae su chapita y su color. El icono dice qué pasó antes
 *  de leer el texto, que es para lo que sirve una lista de avisos. */
const badges: Record<NotifKind, { icon: IconName; className: string }> = {
  entrega:     { icon: 'check',   className: 'bg-ok text-white' },
  traba:       { icon: 'schedule',   className: 'bg-warn text-white' },
  invitacion:  { icon: 'group',   className: 'bg-ink text-ink-inverted' },
  comentario:  { icon: 'menu_book',    className: 'bg-accent text-white' },
  publicada:   { icon: 'star_shine', className: 'bg-ink text-ink-inverted' },
}

/**
 * El panel de avisos.
 *
 * Va con velo: una lista que pide leerse entera necesita que el resto de la
 * pantalla se apague, a diferencia de un menú de cuatro items. El velo atenúa
 * sin desenfocar, así el fondo se sigue reconociendo.
 *
 * Los avisos que esperan una decisión traen los botones adentro de la fila, no
 * en un modal aparte: si aceptar una invitación abre otra pantalla, se pierde
 * la lista y hay que volver a buscarla.
 */
export function NotificationsButton() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'todos' | 'sinLeer'>('todos')
  const [read, setRead] = useState<string[]>([])
  const [resolved, setResolved] = useState<Record<string, 'si' | 'no'>>({})

  const isUnread = (n: Notif) => n.unread && !read.includes(n.id)
  const shown = useMemo(
    () => (filter === 'sinLeer' ? notifications.filter(isUnread) : notifications),
    [filter, read],
  )
  const unreadCount = notifications.filter(isUnread).length

  return (
    <Popover
      width={384}
      veil
      trigger={({ onClick, ref, ...rest }) => (
        <button
          ref={ref}
          onClick={onClick}
          {...rest}
          aria-label={unreadCount ? `Avisos, ${unreadCount} sin leer` : 'Avisos'}
          className={cx(
            'relative inline-flex size-10 items-center justify-center rounded-lg transition-[background-color,box-shadow] duration-[120ms]',
            /* Mientras el panel está abierto el disparador queda hundido, no
               realzado: con el fondo atenuado hay que ver de dónde salió el
               panel, y un botón apretado es lo que dice "esto sigue abierto". */
            rest['data-open'] ? 'bg-muted pressed' : 'hover:bg-hover',
          )}
        >
          <Icon name="bolt" size={20} />
          {unreadCount > 0 && !rest['data-open'] && (
            <span className="absolute top-2 right-2 size-2 rounded-full bg-ok ring-2 ring-canvas" />
          )}
        </button>
      )}
    >
      {close => (
        /* El `Popover` pone el panel donde va y lo cierra; el dibujo es de acá.
           Por eso esta caja lleva su propio papel, su radio y su sombra: el
           panel de avisos es alto y scrollea adentro, así que también necesita
           el `overflow-hidden` que recorta las filas contra la curva. */
        <div className="ui-pop flex max-h-[min(525px,calc(100vh-6rem))] flex-col overflow-hidden rounded-[20px] border border-line bg-popover shadow-popover">
          <header className="flex h-[57px] shrink-0 items-center justify-between border-b border-line px-5">
            <h2 className="text-base font-semibold">Avisos</h2>
            <Segmented
              size="xs"
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'todos', label: 'Todos' },
                { value: 'sinLeer', label: 'Sin leer' },
              ]}
            />
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {shown.length === 0 && (
              <div className="px-5 py-14 text-center">
                <div className="text-xs font-semibold text-ink">Nada sin leer</div>
                <div className="mt-1.5 text-2xs font-medium text-ink-muted">Estás al día con los seis espacios.</div>
              </div>
            )}

            {shown.map(n => {
              const badge = badges[n.kind]
              const unread = isUnread(n)
              const decided = resolved[n.id]
              return (
                <article
                  key={n.id}
                  onClick={() => setRead(r => (r.includes(n.id) ? r : [...r, n.id]))}
                  className="flex cursor-default gap-3.5 border-t border-line py-5 pr-4 pl-5 transition-colors first:border-t-0 hover:bg-hover"
                >
                  {/* `size-12 self-start` no es decorativo: sin alto propio y sin
                      `self-start`, este div se estira a todo el alto de la fila
                      —es hijo de un flex— y la chapita, que ancla al borde de
                      abajo, se va a flotar al pie de la fila. */}
                  <div className="relative size-12 shrink-0 self-start">
                    <Avatar name={n.who} size={48} />
                    <span className={cx('absolute -right-0.5 -bottom-0.5 flex size-[18px] items-center justify-center rounded-full ring-2 ring-popover', badge.className)}>
                      <Icon name={badge.icon} size={12} />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <p className="min-w-0 flex-1 text-xs leading-[18px] text-ink">
                        <span className="font-semibold">{n.who}</span>{' '}
                        <span className="text-ink-muted">{n.action}</span>{' '}
                        {n.target && <span className="font-semibold">{n.target}</span>}
                      </p>
                      {unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-ok" />}
                    </div>

                    {n.body && <p className="mt-1 text-xs leading-[18px] text-ink-muted">{n.body}</p>}
                    <p className="mt-1.5 text-2xs font-medium text-ink-muted">{n.time}</p>

                    {n.decision && !decided && (
                      <div className="mt-3 flex gap-2">
                        <Button size="md" onClick={() => setResolved(r => ({ ...r, [n.id]: 'no' }))}>Rechazar</Button>
                        <Button size="md" variant="solid" onClick={() => setResolved(r => ({ ...r, [n.id]: 'si' }))}>Aceptar</Button>
                      </div>
                    )}
                    {n.decision && decided && (
                      <p className="mt-2.5 text-2xs font-medium text-ink-muted">
                        {decided === 'si' ? 'Aceptado. Ya está en tus espacios.' : 'Rechazado.'}
                      </p>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          <footer className="flex h-12 shrink-0 items-center justify-between border-t border-line px-5">
            <button
              onClick={() => setRead(notifications.map(n => n.id))}
              className="text-2xs font-semibold text-ink-muted hover:text-ink"
            >
              Marcar todo como leído
            </button>
            <button
              onClick={() => { close(); navigate('/novedades') }}
              className="text-2xs font-semibold text-ink hover:underline"
            >
              Ver novedades
            </button>
          </footer>
        </div>
      )}
    </Popover>
  )
}
