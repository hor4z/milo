import cls from './audio-player.module.css'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { IconButton } from '../icon-button/icon-button'
import { Spinner } from '../spinner/spinner'
import { control } from '../lib/control'
import { cx } from '../lib/cx'
import { duration } from '../lib/time'

type Estado = 'cargando' | 'listo' | 'error'

/** El alto de la onda. No sale de la escalera de controles: eso mide botones, y esto es un gráfico que hay que poder leer. */
const onda = { sm: cls.onda, md: cls.onda2, lg: cls.onda3 } as const

const abiertos = new Set<HTMLAudioElement>()

/** La onda. Cada barra es un pico del archivo; las que quedaron atrás van en el color de marca. */
function Onda({ peaks, avance }: { peaks: readonly number[]; avance: number }) {
  return (
    <span aria-hidden className={cls.span}>
      {peaks.map((p, i) => (
        <span key={i} className={cls.span2}>
          <span
            className={cx(
              cls.span3,
              i / peaks.length < avance ? cls.box : cls.box2,
            )}
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
    <span aria-hidden className={cls.span4}>
      <span className={cls.span5} style={{ width: `${avance * 100}%` }} />
    </span>
  )
}

type AudioPlayerProps = {
  /** El archivo. */
  src: string
  /** El nombre de la pista, arriba de la onda. Sin esto el reproductor va en una sola fila. */
  title?: string
  /** Los picos del archivo, de 0 a 1, para dibujar la onda. Se reparten el ancho, así que cuantos menos, más gordas salen las barras. Sin esto se dibuja una pista pelada: no se inventa una onda que no es la del audio. */
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

  const cargado = (el: HTMLAudioElement) => {
    setDur(el.duration)
    setEstado('listo')
  }

  useEffect(() => {
    const el = audio.current
    setSonando(false)
    setT(0)
    if (el && el.readyState >= 1) return cargado(el)
    setEstado('cargando')
    setDur(0)
  }, [src])

  useEffect(() => {
    const el = audio.current
    return () => { if (el) abiertos.delete(el) }
  }, [])

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
        `${cls.div} bg-surface`,
        estado === 'error' && cls.box3,
        className,
      )}
    >
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onLoadedMetadata={e => cargado(e.currentTarget)}
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

      {title && <span className={cls.span6}>{title}</span>}

      <div className={cls.div2}>
        {estado === 'cargando'
          ? (
            <span className={cx(cls.span7, control[size].square)}>
              <Spinner size={size === 'sm' ? 16 : 18} label="Cargando el audio" />
            </span>
          )
          : (
            <IconButton
              icon={sonando ? 'pause' : 'play_arrow'}
              label={sonando ? 'Pausar' : 'Reproducir'}
              variant="raised"
              size={size}
              disabled={estado === 'error'}
              onClick={alternar}
              className={cls.box4}
            />
          )}

        {estado === 'error'
          ? <span className={cx(cls.span8, onda[size])}>No se pudo cargar el audio</span>
          : (
            <span className={cx(cls.span9, onda[size])}>
              {peaks?.length ? <Onda peaks={peaks} avance={avance} /> : <Pista avance={avance} />}
              <input
                type="range"
                min={0}
                max={listo ? dur : 0}
                step={0.1}
                value={t}
                disabled={!listo}
                aria-label={title ? `Buscar en ${title}` : 'Buscar en el audio'}
                aria-valuetext={`${duration(t)} de ${listo ? duration(dur) : '--:--'}`}
                onChange={e => buscar(Number(e.target.value))}
                className={cx(
                  cls.box5,
                  cls.box6,
                  cls.box7,
                )}
              />
            </span>
          )}

        <span className={`${cls.span10} tabular`}>
          {duration(t)} / {listo ? duration(dur) : '--:--'}
        </span>

        {actions && <span className={cls.span11}>{actions}</span>}
      </div>
    </div>
  )
}
