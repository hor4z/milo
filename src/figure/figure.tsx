import s from './figure.module.css'
import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { takePart } from '../lib/parts'

type FigureProps = {
  /** El archivo. */
  src: string
  /** Qué se ve, para quien no la ve. No es el epígrafe: si la imagen no aporta nada que el texto no diga, va vacío y la imagen queda decorativa. */
  alt: string
  /** El `Figure.Caption`, si lleva. */
  children?: ReactNode
  /** La proporción del hueco. Sin esto, la imagen manda y la página salta cuando carga. */
  ratio?: '16/9' | '4/3' | '1/1' | '3/2'
  /** `cover` llena el hueco y recorta lo que sobra: va para una foto, donde el borde no importa. `contain` entra entera: va para un dibujo o un diagrama, donde recortar se lleva justo lo que hay que ver. */
  fit?: 'cover' | 'contain'
  className?: string
}

/** Lo que se lee abajo, para todo el mundo. Agrega algo que la imagen no dice sola: de dónde salió, qué hay que mirar. */
function Caption({ children }: { children: ReactNode }) {
  return <>{children}</>
}

function Root({ src, alt, children, ratio = '4/3', fit = 'cover', className }: FigureProps) {
  const [caption] = takePart(children, Caption)
  return (
    <figure className={cx(s.root, className)}>
      <div
        className={s.frame}
        style={{ aspectRatio: ratio }}
      >
        <img src={src} alt={alt} loading="lazy" className={cx(s.image, fit === 'cover' ? s.cover : s.contain)} />
      </div>
      {caption.length > 0 && <figcaption className={s.caption}>{caption}</figcaption>}
    </figure>
  )
}

/** Una imagen con su pie: lo que ilustra una consigna, una foto de un experimento, el gráfico que alguien dibujó a mano. */
export const Figure = Object.assign(Root, { Caption })
