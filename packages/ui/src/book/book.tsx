import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../lib/cx'

/** Un libro: una tapa en tres dimensiones con su lomo y su canto de hojas. */

export type BookWidth = number | { sm: number; md: number }

export function Book({
  title, variant = 'stripe', color, textColor, width = 196,
  textured, icon, illustration, href, className,
}: {
  title: string
  /** `stripe` lleva una franja de color arriba con el icono o la ilustración, y el título abajo sobre papel. */
  variant?: 'stripe' | 'simple'
  /** Un token, no un hex: así la tapa sigue al tema. */
  color?: string
  /** El color de lo que va encima del color: el glifo de la franja en `stripe`, y el título en `simple`. */
  textColor?: string
  /** Ancho en px, o dos anchos para que el libro no se aplaste en pantalla chica. */
  width?: BookWidth
  /** Solo para una portada sola. */
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
      className={cx('book-perspective', href && 'rounded-sm no-underline', className)}
      style={{ '--book-sm': sm, '--book-md': md, '--book-color': color, '--book-on-color': textColor } as CSSProperties}
    >
      <div className={cx('book-rotate', variant === 'simple' && 'book-simple')}>
        <div className="book-back" />
        <div className={cx('book-pages', textured && 'book-pages-rough')} />

        <div className="book-cover">
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
