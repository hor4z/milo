import type { CSSProperties } from 'react'
import { codepoints, type IconName } from './icons.gen'

export type { IconName }

/** El set es Material Symbols Rounded, subseteado a lo que usamos y servido desde el repo. */
export type IconWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700

export function Icon({ name, size = 20, className, weight }: {
  name: IconName
  /** Alto y ancho de la caja en px. */
  size?: number
  className?: string
  /** El eje wght. */
  weight?: IconWeight
}) {
  return (
    <span
      className={`ms-icon ${className ?? ''}`}
      aria-hidden="true"
      translate="no"
      style={{
        fontSize: size,
        width: size,
        height: size,
        ...(weight ? { '--icon-wght': weight } : null),
      } as CSSProperties}
    >
      {String.fromCodePoint(codepoints[name])}
    </span>
  )
}

/** La excepción, y la única pieza que sigue siendo un SVG dibujado a mano. */
const folderColors = {
  orange: '#e2761b',
  green: '#3f9c5f',
  blue: '#3b7dd8',
  purple: '#8b5cd6',
  pink: '#d1568f',
  ink: 'var(--text)',
} as const

export type FolderColor = keyof typeof folderColors

export function FolderIcon({ color = 'ink', size = 20 }: { color?: FolderColor; size?: number }) {
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
