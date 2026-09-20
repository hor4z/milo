import type { CSSProperties } from 'react'
import { codepoints, type IconName } from '../icons.gen'

export type { IconName }

/** El set es Material Symbols Rounded, subseteado a lo que usamos y servido desde el repo. */
export type IconWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700

function Root({ name, size, className, weight }: {
  /** El glifo, de la unión de los que están en el manifiesto. */
  name: IconName
  /** Alto y ancho de la caja en px. Sin esto lo manda el ancestro por `--icon-size`, y si nadie lo manda son 20. */
  size?: number
  /** Para el color: `icon-muted` para el gris. */
  className?: string
  /** El eje `wght` de la fuente. */
  weight?: IconWeight
}) {
  return (
    <span
      className={`ms-icon ${className ?? ''}`}
      aria-hidden="true"
      translate="no"
      style={{
        ...(size ? { fontSize: size, width: size, height: size } : null),
        ...(weight ? { '--icon-wght': weight } : null),
      } as CSSProperties}
    >
      {codepoints[name] == null ? '' : String.fromCodePoint(codepoints[name])}
    </span>
  )
}

/** La excepción, y la única pieza que sigue siendo un SVG dibujado a mano. */
const folderColors = {
  orange: 'var(--space-orange)',
  green: 'var(--space-green)',
  blue: 'var(--space-blue)',
  purple: 'var(--space-purple)',
  pink: 'var(--space-pink)',
  ink: 'var(--text)',
} as const

export type FolderColor = keyof typeof folderColors

function Folder({ color = 'ink', size = 20 }: {
  /** El color del espacio: es lo que la deja reconocer de reojo en una lista de siete. */
  color?: FolderColor
  /** El lado en px. */
  size?: number
}) {
  const c = folderColors[color]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path
        d="M3 7.5A2 2 0 015 5.5h3.2a2 2 0 011.5.7l1 1.1H19a2 2 0 012 2v6.2a2 2 0 01-2 2H5a2 2 0 01-2-2V7.5z"
        fill={c} fillOpacity="0.13" stroke={c} strokeWidth="1.4" strokeLinejoin="round"
      />
      <path d="M3 10.3h18" stroke={c} strokeWidth="1.4" strokeOpacity="0.55" />
    </svg>
  )
}

export const Icon = Object.assign(Root, { Folder })
