import type { CSSProperties, ReactNode } from 'react'
import { cx } from './primitives'

/**
 * Un libro: una tapa en tres dimensiones con su lomo y su canto de hojas.
 *
 * **Para qué es y para qué no.** Es una portada — un tema, una guía, una
 * colección. No es una tarjeta: en una grilla de doce filas iguales, doce libros
 * son doce objetos pidiendo atención y ninguno la consigue. Para eso está
 * `Card`. Un libro va donde hay uno, dos o tres y cada uno nombra algo distinto.
 *
 * **De dónde salió.** La idea y las medidas son del `Book` de Geist, el sistema
 * de Vercel: proporción 49/60, lomo al 29% del ancho, perspectiva de 900 y el
 * giro de -20° al pasar por encima. Eso es lo que se tomó, que es lo que hace
 * cualquiera con una referencia enfrente. El dibujo está armado con los tokens y
 * los relieves de acá, no con los de ellos.
 *
 * **Cómo está hecho.** Cuatro caras en `preserve-3d`: la contratapa corrida
 * hacia atrás la profundidad del lomo, el canto de hojas girado 90° contra el
 * borde derecho, y la tapa adelante. El hover no es decoración: al girar, el
 * lomo y las hojas aparecen, y ahí se entiende que es un volumen y no un
 * rectángulo con sombra.
 *
 * **El título es la única tipografía del sistema que no usa la escala**, y es a
 * propósito: va en `cqw`, o sea en por ciento del ancho del propio libro. Un
 * cuerpo fijo haría que el mismo título se viera enorme en un libro de 140 y
 * perdido en uno de 300 — la tapa es un dibujo, no una fila de interfaz, y su
 * texto es parte del dibujo. Por eso también lleva `container-type`.
 */

export type BookWidth = number | { sm: number; md: number }

export function Book({
  title, variant = 'stripe', color, textColor, width = 196,
  textured, icon, illustration, href, className,
}: {
  title: string
  /**
   * `stripe` lleva una franja de color arriba con el icono o la ilustración, y
   * el título abajo sobre papel. `simple` tiñe la tapa entera y el título va
   * encima. Con el título solo alcanza, `simple`; si hace falta categoría o
   * jerarquía, `stripe`.
   */
  variant?: 'stripe' | 'simple'
  /** Un token, no un hex: así la tapa sigue al tema. */
  color?: string
  /**
   * El color de lo que va **encima del color**: el glifo de la franja en
   * `stripe`, y el título en `simple`.
   *
   * En `stripe` el título NO lo usa, y eso es a propósito: ahí el título vive
   * sobre el papel de la tapa, no sobre la franja. Si lo usara, un
   * `textColor="white"` —que es lo correcto para el glifo sobre un color vivo—
   * dejaría el título blanco sobre blanco. Ya pasó al escribir la historia.
   */
  textColor?: string
  /** Ancho en px, o dos anchos para que el libro no se aplaste en pantalla chica. */
  width?: BookWidth
  /** Solo para una portada sola. En una fila de libros, la textura le compite al título. */
  textured?: boolean
  icon?: ReactNode
  illustration?: ReactNode
  href?: string
  className?: string
}) {
  const sm = typeof width === 'number' ? width : width.sm
  const md = typeof width === 'number' ? width : width.md
  const Tag = href ? 'a' : 'div'

  return (
    <Tag
      href={href}
      /* El anillo de foco va acá, en el enlace, y no en la tapa: el que navega
         con teclado tiene que ver dónde está el blanco de verdad. */
      className={cx('book-perspective', href && 'rounded-sm no-underline', className)}
      style={{ '--book-sm': sm, '--book-md': md, '--book-color': color, '--book-on-color': textColor } as CSSProperties}
    >
      <div className={cx('book-rotate', variant === 'simple' && 'book-simple')}>
        {/* La contratapa. No se ve de frente; aparece al girar, y sin ella el
            libro se ve hueco por detrás. */}
        <div className="book-back" />
        {/* El canto de hojas. `textured` acá son las hojas sueltas; sin él, un
            bloque parejo. */}
        <div className={cx('book-pages', textured && 'book-pages-rough')} />

        <div className="book-cover">
          {/* La sombra del pliegue, contra el lomo. Es lo que hace que la tapa
              se lea doblada y no pegada. */}
          <span className="book-bind" aria-hidden="true" />

          {variant === 'stripe' ? (
            <span className="book-body">
              <span className="book-stripe">
                {illustration}
                {icon && <span className="book-icon">{icon}</span>}
              </span>
              <span className="book-content"><span className="book-title">{title}</span></span>
            </span>
          ) : (
            <span className="book-content book-content-full">
              {icon && <span className="book-icon">{icon}</span>}
              {illustration}
              <span className="book-title">{title}</span>
            </span>
          )}

          {textured && <span className="book-grain" aria-hidden="true" />}
        </div>
      </div>
    </Tag>
  )
}
