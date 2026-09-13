import { useEffect, useRef, useState, type ReactNode } from 'react'
import { IconButton } from '../icon-button/icon-button'
import { Spinner } from '../spinner/spinner'
import { control } from '../lib/control'
import { cx } from '../lib/cx'

/** Segundos a reloj. La hora aparece solo si hace falta: `1:02:03` para algo largo, `0:07` para lo normal. */
function reloj(s: number) {
  if (!Number.isFinite(s) || s < 0) return '--:--'
  const t = Math.floor(s)
  const hh = Math.floor(t / 3600)
  const mm = Math.floor((t % 3600) / 60)
  const ss = t % 60
  return hh
    ? `${hh}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
    : `${mm}:${String(ss).padStart(2, '0')}`
}

type Estado = 'cargando' | 'listo' | 'error'

/** El alto de la onda. No sale de la escalera de controles: eso mide botones, y esto es un gráfico que hay que poder leer. */
const onda = { sm: 'h-8', md: 'h-10', lg: 'h-12' } as const

// Solo uno suena a la vez. Dos audios encimados no se entienden, y el segundo
// tapa al primero sin que nadie lo haya pedido.
const abiertos = new Set<HTMLAudioElement>()

/** La onda. Cada barra es un pico del archivo; las que quedaron atrás van en el color de marca. */
function Onda({ peaks, avance }: { peaks: readonly number[]; avance: number }) {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 flex items-stretch overflow-hidden">
      {peaks.map((p, i) => (
        // El hueco entre barras es una fracción del lugar que a cada una le toca
        // y no un `gap` de píxeles: con un gap fijo, treinta y un huecos de
        // cuatro no entran en un contenedor angosto y la fila se desborda.
        <span key={i} className="flex flex-1 items-center justify-center">
          <span
            className={cx(
              // La mitad del lugar que le toca: la barra y el hueco miden igual,
            // así se leen separadas a cualquier ancho.
            'w-1/2 rounded-full transition-colors duration-fast ease-out',
              // Gris claro lo que falta, marca lo que ya sonó: el avance se lee
              // en el color y no hace falta una cabecita que lo marque.
              i / peaks.length < avance ? 'bg-brand' : 'bg-line-strong',
            )}
            // Un pico en silencio mide cero y la barra desaparece; el mínimo la
            // deja como un punto, que es lo que dibuja la línea de la pista.
            style={{ height: `${Math.max(p, 0.04) * 100}%`, minHeight: 2 }}
          />
        </span>
      ))}
    </span>
  )
}

/** La pista pelada, para cuando no hay picos: una línea con lo escuchado pintado encima. */
function Pista({ avance }: { avance: number }) {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line-strong">
      <span className="absolute inset-y-0 left-0 rounded-full bg-brand" style={{ width: `${avance * 100}%` }} />
    </span>
  )
}

type AudioPlayerProps = {
  /** El archivo. */
  src: string
  /** El nombre de la pista, arriba de la onda. Sin esto el reproductor va en una sola fila. */
  title?: string
  /** Los picos del archivo, de 0 a 1, para dibujar la onda. Se reparten el ancho, así que cuantos menos, más gordas salen las barras. Sin esto se dibuja una pista pelada — no se inventa una onda que no es la del audio. */
  peaks?: readonly number[]
  /** A la derecha del tiempo: descargar, un menú, lo que haga falta. */
  actions?: ReactNode
  /** 32 · 36 · 40, los del Button. */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/** Un archivo de audio con su onda: play, una línea de tiempo que se arrastra y el reloj. */
export function AudioPlayer({ src, title, peaks, actions, size = 'md', className }: AudioPlayerProps) {
  const audio = useRef<HTMLAudioElement>(null)
  const [estado, setEstado] = useState<Estado>('cargando')
  const [sonando, setSonando] = useState(false)
  const [t, setT] = useState(0)
  const [dur, setDur] = useState(0)

  useEffect(() => {
    setEstado('cargando')
    setSonando(false)
    setT(0)
    setDur(0)
  }, [src])

  // Al desmontarlo hay que sacarlo del registro: si no, el elemento queda ahí
  // para siempre y el próximo que arranque le manda un pause a un nodo muerto.
  useEffect(() => {
    // El elemento se agarra acá y no en la limpieza: para entonces React ya
    // soltó la ref y no hay a quién sacar del registro.
    const el = audio.current
    return () => { if (el) abiertos.delete(el) }
  }, [])

  // Mientras suena, este es el audio del sistema: los botones del auricular, la
  // pantalla bloqueada y las teclas de medios tienen que caer acá y significar
  // lo que dicen. Se sueltan al pausar, o se los queda para siempre.
  useEffect(() => {
    const ms = typeof navigator !== 'undefined' && 'mediaSession' in navigator ? navigator.mediaSession : null
    if (!ms || !sonando) return
    if (title && typeof MediaMetadata === 'function') ms.metadata = new MediaMetadata({ title })
    ms.setActionHandler('play', () => void audio.current?.play())
    ms.setActionHandler('pause', () => audio.current?.pause())
    ms.setActionHandler('seekto', d => {
      if (audio.current && d.seekTime != null) audio.current.currentTime = d.seekTime
    })
    return () => {
      ms.setActionHandler('play', null)
      ms.setActionHandler('pause', null)
      ms.setActionHandler('seekto', null)
    }
  }, [sonando, title])

  const listo = estado === 'listo' && dur > 0
  const avance = listo ? Math.min(1, t / dur) : 0

  const alternar = () => {
    const el = audio.current
    if (!el) return
    if (sonando) return el.pause()
    // Al final, el play de nuevo vuelve a empezar; si no, no pasa nada y parece roto.
    if (dur && el.currentTime >= dur - 0.05) el.currentTime = 0
    void el.play().catch(() => setEstado('error'))
  }

  const buscar = (v: number) => {
    const el = audio.current
    if (!el) return
    el.currentTime = v
    setT(v)
  }

  return (
    <div
      className={cx(
        // La caja es una columna: el título arriba, y abajo una sola fila con el
        // botón, la onda y el reloj. Con todo en una fila, el botón se centraba
        // contra la columna —título incluido— y quedaba arriba de la onda.
        'flex flex-col gap-2 rounded-xl border border-line bg-surface px-3 py-2',
        estado === 'error' && 'border-bad-border',
        className,
      )}
    >
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onLoadedMetadata={e => {
          setDur(e.currentTarget.duration)
          setEstado('listo')
        }}
        onTimeUpdate={e => setT(e.currentTarget.currentTime)}
        onPlay={e => {
          for (const otro of abiertos) if (otro !== e.currentTarget) otro.pause()
          abiertos.add(e.currentTarget)
          setSonando(true)
        }}
        onPause={e => {
          abiertos.delete(e.currentTarget)
          setSonando(false)
        }}
        onEnded={e => {
          abiertos.delete(e.currentTarget)
          setSonando(false)
        }}
        onError={() => setEstado('error')}
      />

      {title && <span className="truncate text-body font-medium text-ink">{title}</span>}

      <div className="flex items-center gap-3">
        {estado === 'cargando'
          ? (
            <span className={cx('inline-flex shrink-0 items-center justify-center', control[size].square)}>
              <Spinner size={size === 'sm' ? 16 : 18} label="Cargando el audio" />
            </span>
          )
          : (
            <IconButton
              icon={sonando ? 'pause' : 'play_arrow'}
              label={sonando ? 'Pausar' : 'Reproducir'}
              variant="solid"
              size={size}
              round
              disabled={estado === 'error'}
              onClick={alternar}
              className="icon-filled shrink-0"
            />
          )}

        {estado === 'error'
          ? <span className={cx('flex flex-1 items-center text-body text-bad-ink', onda[size])}>No se pudo cargar el audio</span>
          : (
            <span className={cx('relative flex min-w-0 flex-1 items-center', onda[size])}>
              {peaks?.length ? <Onda peaks={peaks} avance={avance} /> : <Pista avance={avance} />}
              <input
                type="range"
                min={0}
                max={listo ? dur : 0}
                step={0.1}
                value={t}
                disabled={!listo}
                aria-label={title ? `Buscar en ${title}` : 'Buscar en el audio'}
                aria-valuetext={`${reloj(t)} de ${reloj(dur)}`}
                onChange={e => buscar(Number(e.target.value))}
                className={cx(
                  'absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0',
                  'disabled:cursor-default',
                  'focus-visible:opacity-100 focus-visible:outline-none focus-visible:rounded-md focus-visible:shadow-[var(--focus-ring)]',
                )}
              />
            </span>
          )}

        <span className="tabular shrink-0 text-meta text-ink-muted">
          {reloj(t)} / {reloj(dur)}
        </span>

        {actions && <span className="flex shrink-0 items-center gap-1">{actions}</span>}
      </div>
    </div>
  )
}
