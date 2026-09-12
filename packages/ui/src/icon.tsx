import type { CSSProperties } from 'react'
import { codepoints, type IconName } from './icons.gen'

export type { IconName }

/**
 * El set es Material Symbols Rounded, subseteado a lo que usamos y servido
 * desde el repo. La receta de CSS vive en `theme.css` (`.ms-icon`); acá solo
 * está la caja y los ejes.
 *
 * **Por qué una fuente y no SVG.** Los dibujos de Material son contornos
 * rellenos, no trazos: el peso está horneado en la geometría, así que con SVG
 * haría falta un path por cada combinación de peso y relleno. Los ejes solo
 * existen en la fuente — lo dice el propio repo de Google: "these icons were
 * built/designed as variable fonts first", y los SVG estáticos "do not have all
 * the variations available". Google hace lo mismo en sus dos implementaciones:
 * el widget `Icon` de Flutter dibuja `String.fromCharCode(codePoint)` con
 * `fontVariations`, y `md-icon` de Material Web es un glifo.
 *
 * **El costo, que conviene tener presente.** Firefox deja desactivar "permitir
 * que las páginas elijan sus propias fuentes", y hay gente que lo usa. Con esa
 * opción, todos los iconos desaparecen y quedan cuadraditos. Un `<svg>` era
 * inmune. No tiene mitigación dentro de este enfoque; es el precio.
 *
 * **Codepoint y no ligadura.** Con ligadura, el instante previo a que cargue la
 * fuente muestra la palabra "chevron_right" adentro de un botón.
 *
 * **Todos los glifos son de contorno: `FILL` queda clavado en 0 y no hay prop
 * para moverlo.** Había tres rellenos por default —`favorite`, `bolt`,
 * `star_shine`— con el argumento de que una marca pesa más que un acompañante,
 * y el resultado era que el mismo icono se dibujaba distinto según dónde
 * cayera: el corazón de la nav relleno y el mismo corazón de la paleta de
 * comandos hueco. Un set mezclado no se lee como un set. Lo que diferencia a
 * una marca de un acompañante es el peso y el tamaño, que son ejes que el call
 * site ya tiene.
 *
 * **El peso.** 300 de base. Sube a 400 cuando el icono va en gris —y eso lo
 * pone la clase `icon-muted` sola, no el call site, porque el gris muchas veces
 * lo hereda de un ancestro y desde acá no se puede saber— y a 600/700 cuando el
 * glifo es el contenido entero de una pieza chica.
 *
 * Se tipa como unión y no como `number` a propósito: así un valor de la escala
 * vieja es un error de compilación y no un icono que se ve raro.
 */
export type IconWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700

/* No hay factor de corrección, y eso se midió antes de decidirlo.
   Rasterizando los dos sets a la misma medida nominal y comparando la caja de
   tinta de nueve iconos, el nuevo da 92 · 93 · 97 · 98 · 100 · 104 · 105 · 111
   y 132% del viejo. Mediana 100%: no hay un corrimiento sistemático que
   corregir. Lo que había era un set propio inconsistente —el corazón dibujado
   chico, el lápiz grande— y Material es parejo consigo mismo, que es
   precisamente lo que da un set diseñado. Meter un factor para emparejarlo con
   los dibujos viejos sería importar esa inconsistencia. */

export function Icon({ name, size = 20, className, weight }: {
  name: IconName
  /** Alto y ancho de la caja en px. La escala 12 · 14 · 16 · 18 · 20 · 22. */
  size?: number
  className?: string
  /**
   * El eje wght. **Sin default a propósito**: si no se pasa, no se escribe nada
   * y el glifo hereda. El default (300) está en el `var()` de la clase, no acá.
   *
   * La diferencia no es cosmética. Un estilo inline le gana a una clase, así que
   * con `weight = 300` escrito siempre, `icon-muted` no podía subir el peso y la
   * grilla del kit no podía fijarlo para todos sus glifos de una: cada icono se
   * pisaba a sí mismo con su propio default. Escribir la variable solo cuando
   * alguien la pide es lo que hace que heredar funcione.
   */
  weight?: IconWeight
}) {
  return (
    <span
      className={`ms-icon ${className ?? ''}`}
      aria-hidden="true"
      /* Un glifo es texto, así que un traductor automático puede reescribirlo.
         Con un <svg> no había dónde meterse. */
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

/* -------------------------------------------------------------- FolderIcon */

/**
 * La excepción, y la única pieza que sigue siendo un SVG dibujado a mano.
 *
 * No es capricho ni deuda: es bicolor —relleno al 13% y una línea al 55% del
 * mismo tono— y una fuente monocroma no puede hacer eso. No hay migración que
 * conserve la pieza. El color propio por espacio es justamente el punto: es lo
 * que deja reconocer una carpeta de reojo en una lista de siete.
 *
 * El `strokeWidth` de 1.4 ahora tiene más sentido que antes: dejó de ser "el
 * que difiere del resto" y pasó a ser "el único SVG", con su propia
 * calibración por definición.
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
