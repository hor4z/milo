import type { ReactNode } from 'react'
import { cx } from '../lib/cx'

type FigureProps = {
  /** El archivo. */
  src: string
  /** Qué se ve, para quien no la ve. No es el epígrafe: si la imagen no aporta nada que el texto no diga, va vacío y la imagen queda decorativa. */
  alt: string
  /** Lo que se lee abajo, para todo el mundo. Agrega algo que la imagen no dice sola: de dónde salió, qué hay que mirar. */
  caption?: ReactNode
  /** La proporción del hueco. Sin esto, la imagen manda y la página salta cuando carga. */
  ratio?: '16/9' | '4/3' | '1/1' | '3/2'
  /** `cover` llena el hueco y recorta lo que sobra: va para una foto, donde el borde no importa. `contain` entra entera: va para un dibujo o un diagrama, donde recortar se lleva justo lo que hay que ver. */
  fit?: 'cover' | 'contain'
  className?: string
}

/** Una imagen con su pie: lo que ilustra una consigna, una foto de un experimento, el gráfico que alguien dibujó a mano. */
export function Figure({ src, alt, caption, ratio = '4/3', fit = 'cover', className }: FigureProps) {
  return (
    <figure className={cx('m-0 flex flex-col gap-2', className)}>
      <div
        className="overflow-hidden rounded-xl border border-line bg-sunken"
        // El hueco se reserva antes de que la imagen llegue: sin esto, todo lo
        // que está abajo salta cuando carga y alguien pierde el renglón.
        style={{ aspectRatio: ratio }}
      >
        <img src={src} alt={alt} loading="lazy" className={cx('size-full', fit === 'cover' ? 'object-cover' : 'object-contain')} />
      </div>
      {caption && <figcaption className="text-meta text-ink-muted">{caption}</figcaption>}
    </figure>
  )
}
