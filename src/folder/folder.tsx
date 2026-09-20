import type { CSSProperties, ReactNode } from 'react'
import { Avatar } from '../avatar/avatar'
import { cx } from '../lib/cx'

/** Una carpeta que se abre. */

export function Folder({
  label, meta, sheets = 3, size = 128, color, avatars, badges, onClick, className,
}: {
  /** El nombre, debajo. */
  label?: string
  /** La línea de apoyo: "15 archivos". */
  meta?: string
  /** Cuántas hojas se abanican. */
  sheets?: 2 | 3
  /** El ancho de la carpeta en px. */
  size?: number
  /** Un token, no un hex. */
  color?: string
  /** Quiénes tienen acceso, abajo a la izquierda. */
  avatars?: readonly { name: string; src?: string }[]
  /** Lo mismo pero a mano, para lo que no es una persona: un logo, un icono. */
  badges?: ReactNode
  /** Sin esto es un <div> y no se puede tabular. */
  onClick?: () => void
  className?: string
}) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={cx('folder', onClick && 'folder-clickable', className)}
      style={{ '--folder-w': `${size}px`, ...(color ? { '--folder-top': color } : null) } as CSSProperties}
    >
      <span className="folder-stack">
        <svg className="folder-shell" viewBox="0 0 130 100" aria-hidden="true">
          <path d="M12 0h34c8 0 10 1.5 14 5c4 3.5 8 4 16 4h42a12 12 0 0 1 12 12v67a12 12 0 0 1-12 12H12A12 12 0 0 1 0 88V12A12 12 0 0 1 12 0z" />
        </svg>
        {Array.from({ length: sheets }, (_, i) => (
          <span key={i} className="folder-sheet" data-sheet={i - (sheets - 1) / 2} />
        ))}
        <span className="folder-front">
          {(avatars?.length || badges) && (
            <span className="folder-badges">
              {avatars?.length ? (
                <Avatar.Group
                  people={avatars}
                  size={Math.round(size * 0.17)}
                  ring="var(--folder-top)"
                />
              ) : null}
              {badges}
            </span>
          )}
        </span>
      </span>
      {(label || meta) && (
        <span className="folder-label">
          {label && <span className="folder-name">{label}</span>}
          {meta && <span className="folder-meta">{meta}</span>}
        </span>
      )}
    </Tag>
  )
}
