import type { CSSProperties, ReactNode } from 'react'
import { AvatarGroup, cx } from './primitives'

/**
 * Una carpeta que se abre. Cerrada es una silueta limpia; al pasar por encima
 * las hojas suben desde adentro y se abanican, y ahí se ve qué hay sin entrar.
 *
 * Las hojas estuvieron asomando en reposo, con el argumento de que si no la
 * carpeta cerrada se ve maciza. Pero el papel blanco cortaba la franja del canto
 * justo al medio y la carpeta se leía como tres pedazos sueltos: la pestaña, una
 * mancha blanca y el resto del canto. La silueta limpia vale más que el
 * anticipo, y el anticipo igual lo da el pie, que dice cuántos archivos hay.
 *
 * **Qué hace la animación, y por qué no es adorno.** El sistema ya tiene escrito
 * que las tarjetas no se mueven en hover: una grilla que salta hace temblar la
 * vista. Esto no la contradice, la usa al revés — lo que se mueve no es la
 * pieza, es **el contenido de la pieza**, y lo que se gana es información:
 * cuántas hojas hay y de qué tipo. La carpeta no cambia de tamaño ni de lugar,
 * así que la grilla no se mueve.
 *
 * **El color es uno solo.** Se elige el del cuerpo; la pestaña y el canto salen
 * de él con color relativo —0.033 menos de luminosidad y un tercio más de
 * croma—, así que pasarle un color la pinta entera y no a medias.
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
  label, meta, sheets = 3, size = 128, color, avatars, badges, onClick, className,
}: {
  label?: string
  /** La línea de apoyo: «15 archivos». */
  meta?: string
  /** Cuántas hojas se abanican. Más de tres se pisan y dejan de contarse. */
  sheets?: 2 | 3
  /** El ancho de la carpeta en px. Todo lo demás sale de acá. */
  size?: number
  /**
   * Un token, no un hex. Es **un solo color, el del cuerpo**: la pestaña y el
   * canto se derivan de él con color relativo, así que la carpeta queda pintada
   * entera y no a medias.
   */
  color?: string
  /** Quiénes tienen acceso, abajo a la izquierda. */
  avatars?: readonly { name: string; src?: string }[]
  /** Lo mismo pero a mano, para lo que no es una persona: un logo, un icono. */
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
        {/* La contratapa y la pestaña son UN solo path y no dos rectángulos.
            Con dos, la unión se ve: cada uno trae sus esquinas redondeadas y en
            el doblez queda un corte. Con un path, el relleno es uno y el
            hombro de la pestaña baja con una curva, que es como se ve una
            cartulina doblada de verdad.

            El viewBox es 130×100 porque la carpeta tiene proporción fija 1.3;
            al escalar uniforme no hace falta `preserveAspectRatio` y los radios
            no se deforman. */}
        <svg className="folder-shell" viewBox="0 0 130 100" aria-hidden="true">
          <path d="M12 0h34c8 0 10 1.5 14 5c4 3.5 8 4 16 4h42a12 12 0 0 1 12 12v67a12 12 0 0 1-12 12H12A12 12 0 0 1 0 88V12A12 12 0 0 1 12 0z" />
        </svg>
        {/* Las hojas van del fondo hacia adelante para que la del medio quede
            encima: si se apilaran al revés, el abanico se abre para atrás. */}
        {Array.from({ length: sheets }, (_, i) => (
          <span key={i} className="folder-sheet" data-sheet={i - (sheets - 1) / 2} />
        ))}
        <span className="folder-front">
          {(avatars?.length || badges) && (
            <span className="folder-badges">
              {avatars?.length ? (
                /* El anillo va del color del cuerpo y no del papel: acá los
                   avatares están apoyados sobre la carpeta, no sobre la
                   página, y con el anillo blanco se ven recortados. El tamaño
                   sale del ancho de la carpeta como todo lo demás. */
                <AvatarGroup
                  people={avatars}
                  size={Math.round(size * 0.17)}
                  ring="ring-[var(--folder-top)]"
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
