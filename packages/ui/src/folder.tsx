import type { CSSProperties, ReactNode } from 'react'
import { cx } from './primitives'

/**
 * Una carpeta que se abre. En reposo está cerrada y asoman las hojas apenas por
 * arriba; al pasar por encima, las hojas suben y se abanican, y ahí se ve qué
 * hay adentro sin tener que entrar.
 *
 * **Qué hace la animación, y por qué no es adorno.** El sistema ya tiene escrito
 * que las tarjetas no se mueven en hover: una grilla que salta hace temblar la
 * vista. Esto no la contradice, la usa al revés — lo que se mueve no es la
 * pieza, es **el contenido de la pieza**, y lo que se gana es información:
 * cuántas hojas hay y de qué tipo. La carpeta no cambia de tamaño ni de lugar,
 * así que la grilla no se mueve.
 *
 * **Construcción.** Tres capas: la contratapa, las hojas en el medio, y la
 * solapa delantera con la pestaña adelante. Las hojas suben *entre* la
 * contratapa y la solapa, que es lo que hace que parezca que salen de adentro y
 * no que aparecen encima.
 *
 * **Las medidas y los saltos salen de medir el original**; el tono es el naranja
 * del sistema. El degradado de la solapa cae 0.055 de luminosidad en OKLCH y la
 * contratapa va 0.185 por debajo: esos dos números son los que la hacen leer
 * como cartulina doblada y no como dos rectángulos apilados.
 *
 * Adentro no hay un px suelto — todo va en por ciento del ancho, como el `Book`,
 * así que el mismo dibujo sirve a 88 y a 220.
 *
 * No reemplaza a `FolderIcon`, que es el glifo de 20 que identifica un espacio
 * en una lista de siete. Esto es la pieza grande: una carpeta que se mira.
 */

export function Folder({
  label, meta, sheets = 3, size = 128, color, badges, onClick, className,
}: {
  label?: string
  /** La línea de apoyo: «15 archivos». */
  meta?: string
  /** Cuántas hojas se abanican. Más de tres se pisan y dejan de contarse. */
  sheets?: 2 | 3
  /** El ancho de la carpeta en px. Todo lo demás sale de acá. */
  size?: number
  /** Un token, no un hex. Por default, el amarillo de carpeta del sistema. */
  color?: string
  /** Lo que va abajo a la izquierda de la solapa: de dónde vino el contenido. */
  badges?: ReactNode
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
        <span className="folder-back" />
        {/* Las hojas van del fondo hacia adelante para que la del medio quede
            encima: si se apilaran al revés, el abanico se abre para atrás. */}
        {Array.from({ length: sheets }, (_, i) => (
          <span key={i} className="folder-sheet" data-sheet={i - (sheets - 1) / 2} />
        ))}
        <span className="folder-front">
          {badges && <span className="folder-badges">{badges}</span>}
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
