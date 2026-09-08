/**
 * Los iconos: un solo componente, un mapa de paths y nada más.
 *
 * Trazo y no relleno, grid de 24, y dos medidas que importan: **20px de alto
 * con trazo 1**. Ese trazo fino es la mitad del carácter del sistema — con 1.5
 * los iconos pesan más que el texto de 12 que tienen al lado y la interfaz se
 * ve tosca. `currentColor` en todos, así un icono nunca trae su propio color y
 * hereda el del contexto (un item de menú apagado apaga su icono solo).
 */
export type IconName = keyof typeof paths

const paths = {
  // navegación
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  compass: 'M12 3a9 9 0 100 18 9 9 0 000-18zM15.5 8.5l-2 5-5 2 2-5 5-2z',
  layers: 'M12 3l8 4.5-8 4.5-8-4.5L12 3zM4 12l8 4.5 8-4.5M4 16.5L12 21l8-4.5',
  heart: 'M12 20s-7-4.4-7-9.2A3.8 3.8 0 0112 8.6a3.8 3.8 0 017 2.2c0 4.8-7 9.2-7 9.2z',
  folder: 'M3 7a2 2 0 012-2h3.4l2 2H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z',
  folderPlus: 'M3 7a2 2 0 012-2h3.4l2 2H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM12 11v5M9.5 13.5h5',
  cube: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5',
  sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z',
  // acciones
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM16.2 16.2L21 21',
  plus: 'M12 5v14M5 12h14',
  check: 'M4.5 12.5l5 5 10-11',
  x: 'M6 6l12 12M18 6L6 18',
  pencil: 'M4 20h4l10.5-10.5a2.1 2.1 0 00-3-3L5 17v3z',
  trash: 'M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v6M14 11v6',
  download: 'M12 4v11M7.5 10.5L12 15l4.5-4.5M4 20h16',
  copy: 'M9 9h10v10H9zM15 9V5H5v10h4',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
  // dirección
  arrowLeft: 'M20 12H4M10 6l-6 6 6 6',
  arrowRight: 'M4 12h16M14 6l6 6-6 6',
  arrowUp: 'M12 20V4M6 10l6-6 6 6',
  chevronDown: 'M6 9.5l6 6 6-6',
  chevronRight: 'M9.5 6l6 6-6 6',
  // interfaz
  sun: 'M12 6.5A5.5 5.5 0 1012 17.5 5.5 5.5 0 0012 6.5zM12 1.5v2M12 20.5v2M3.5 12h-2M22.5 12h-2M5.6 5.6L4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4',
  moon: 'M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z',
  bolt: 'M13.5 3L6 13.5h5L10.5 21 18 10.5h-5L13.5 3z',
  filter: 'M4 6h16l-6 7v6l-4-2v-4L4 6z',
  bell: 'M6 9a6 6 0 1112 0c0 4 1.5 6 1.5 6h-15S6 13 6 9zM10 19a2 2 0 004 0',
  user: 'M12 4a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5',
  shield: 'M12 3l7 3v5.5c0 4.5-3 7.7-7 9.5-4-1.8-7-5-7-9.5V6l7-3zM9 12l2.2 2.2L15.5 10',
  card: 'M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM3 10h18M6.5 15h3',
  sliders: 'M4 8h10M18 8h2M4 16h4M12 16h8M15 5.5v5M9 13.5v5',
  logout: 'M14 5H6a1 1 0 00-1 1v12a1 1 0 001 1h8M17 8.5L20.5 12 17 15.5M11 12h9.5',
  discord: 'M8.5 9.5c2.3-1 4.7-1 7 0M8 17c-1.5-2-2-5-1-7.5C8.5 8 10 7.5 12 7.5s3.5.5 5 2c1 2.5.5 5.5-1 7.5M9.5 13.5h.01M14.5 13.5h.01',
  mic: 'M12 4a2.5 2.5 0 00-2.5 2.5v4a2.5 2.5 0 005 0v-4A2.5 2.5 0 0012 4zM6 11a6 6 0 0012 0M12 17v3',
  image: 'M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM8.5 10a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4zM5 17l4.5-4.5 3 3L16 12l3 3',
  clock: 'M12 4a8 8 0 100 16 8 8 0 000-16zM12 8v4.5l3 2',
  users: 'M9 5a3 3 0 100 6 3 3 0 000-6zM3 19c0-3 2.7-5 6-5s6 2 6 5M16 5.5a3 3 0 010 5.8M18 14.2c2 .7 3.4 2.4 3.4 4.8',
  book: 'M4 5.5A1.5 1.5 0 015.5 4H11v16H5.5A1.5 1.5 0 014 18.5v-13zM20 5.5A1.5 1.5 0 0018.5 4H13v16h5.5A1.5 1.5 0 0020 18.5v-13z',
  target: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8a4 4 0 100 8 4 4 0 000-8zM12 11.5a.5.5 0 100 1 .5.5 0 000-1z',
} as const

/* Los que se dibujan rellenos en vez de trazados. Un glifo relleno se lee más
   liviano y más chico que el mismo contorno con trazo, aunque midan igual: el
   trazo agrega dos bordes que el relleno no tiene. */
const filled: Partial<Record<IconName, true>> = { heart: true, bolt: true, sparkle: true }

type Props = {
  name: IconName
  /** Alto y ancho en px. 20 es el de la interfaz; 16 para lo que va inline con texto. */
  size?: number
  className?: string
  /** Solo para el corazón lleno y compañía: pinta en vez de trazar. */
  solid?: boolean
  /**
   * Grosor del trazo. El default de 1 es para iconos que acompañan texto en
   * tinta; donde el icono va en gris hace falta 1.5, porque un trazo fino en
   * gris claro encierra aire y se lee más apagado que el mismo gris macizo.
   * Es la contra de tener un set de contornos y no de glifos rellenos.
   */
  weight?: number
}

export function Icon({ name, size = 20, className, solid, weight = 1 }: Props) {
  const isSolid = solid ?? filled[name]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isSolid ? 'currentColor' : 'none'}
      stroke={isSolid ? 'none' : 'currentColor'}
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      /* shrink-0 va acá y no en cada uso: un icono dentro de un flex con texto
         largo se comprime y se deforma, y es imposible de ver hasta que pasa. */
      style={{ flexShrink: 0 }}
    >
      <path d={paths[name]} />
    </svg>
  )
}

/* ------------------------------------------------------------ Folder color */

/**
 * La carpeta de un espacio, en su color.
 *
 * Va aparte del mapa de `Icon` porque no es monocroma: son dos trazos —la
 * lengüeta y el cuerpo— más un relleno muy lavado del mismo tono. Eso es lo que
 * la hace reconocible de reojo en una lista de siete, que es todo el punto de
 * darle color. El resto de los iconos siguen heredando `currentColor`; este
 * trae el suyo a propósito.
 */
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
