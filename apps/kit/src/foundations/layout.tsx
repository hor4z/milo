import { Card, CardBody } from '@milo/ui'
import { A11y, Note, Page, Section } from '../kit'

const cortes = [
  { cls: 'sm', px: 640, para: 'Lo compacto pasa a varias columnas: chips, talles, swatches, tarjetas de una línea.' },
  { cls: 'md', px: 768, para: 'Las tarjetas con párrafo. A 640 dos columnas de texto quedan en unos 270 y el renglón se parte cada tres palabras.' },
  { cls: 'lg', px: 1024, para: 'Cambia la estructura: el riel se fija al costado, el dashboard se abre en dos columnas, la cabecera de pantalla chica desaparece.' },
  { cls: 'xl', px: 1280, para: 'Lo que necesita lugar de sobra y puede no estar. Hoy lo usa una sola cosa: Otto asomando al costado del dashboard.' },
] as const

const shell = [
  ['Riel', '220', 'Contraído, 72'],
  ['Barra de arriba', '80', '-'],
  ['Item de nav', '40', 'Radio 12, icono en un cuadrado de 34'],
  ['Ancho del contenido', '980', 'Centrado, con 40 de aire lateral'],
  ['Ancho de lectura', '70ch', 'Lo que se lee de corrido; 42ch para un pie'],
] as const

export function LayoutSection() {
  return (
    <Page
      title="Layout"
      kind="Fundamentos"
      lead="Dónde se apoya cada cosa: el mueble de la pantalla, los cuatro cortes y las dos reglas que rompen una grilla cuando faltan."
      imports="import { Card } from '@milo/ui'"
    >
      <Section
        title="Cuatro cortes, y cada uno hace algo distinto"
        note="Son los de siempre. Lo que no es de siempre es cuál usar: elegirlos por costumbre es lo que hace que dos grillas iguales cambien en momentos distintos."
      >
        <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
          {cortes.map(c => (
            <div key={c.cls} className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-line px-5 py-4 first:border-t-0">
              <code className="w-16 shrink-0 font-mono text-body font-semibold text-ink">{c.cls}</code>
              <span className="w-20 shrink-0 tabular text-meta text-ink-muted">{c.px}px</span>
              <span className="min-w-0 flex-1 text-body text-ink-muted">{c.para}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Las medidas del mueble"
        note="No se eligen por pantalla: son las mismas siempre, y lo que cambia con el ancho es si están o no."
      >
        <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
          {shell.map(([que, px, nota]) => (
            <div key={que} className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-line px-5 py-4 first:border-t-0">
              <span className="w-48 shrink-0 text-body font-medium text-ink">{que}</span>
              <span className="w-16 shrink-0 tabular text-body text-ink">{px}</span>
              <span className="min-w-0 flex-1 text-meta text-ink-muted">{nota}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Una pantalla es una columna de secciones"
        note="Esto es la estructura de la pantalla, no las grillas de adentro: una sección puede tener sus tarjetas en tres o cuatro columnas. Lo que no llega a tres es la estructura: dos columnas ya piden decidir por dónde se empieza a leer, y la segunda solo se justifica cuando acompaña a la primera en vez de competirle."
      >
        <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <Card>
            <CardBody>
              <div className="flex h-28 items-center justify-center rounded-lg bg-sunken text-body text-ink-muted">Lo que la pantalla viene a mostrar</div>
            </CardBody>
          </Card>
          <Card surface="muted">
            <CardBody>
              <div className="flex h-28 items-center justify-center rounded-lg text-body text-ink-muted">Lo que acompaña</div>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Note title="Un glifo al lado de un texto se centra con su primera línea">
        Y para eso su caja mide lo que mide esa línea (24 al lado de un título, 20 al lado de un
        párrafo) con el glifo centrado adentro. No alcanza con empujarlo un píxel a ojo: el
        <code>Alert</code> quedaba 4px más arriba que su título y el <code>Callout</code> 1px,
        mientras el <code>Toast</code> caía justo. Cuatro piezas con la misma forma y cuatro
        recetas distintas se ve enseguida, aunque cada una por separado parezca bien.
      </Note>

      <Note icon="warning" title="Las dos que rompen una grilla sin avisar">
        <strong>Un hijo de grilla no baja de su contenido.</strong> Sin <code>min-w-0</code>, una
        tabla o un gráfico adentro de una columna la empujan más ancha que la pantalla, y el
        desborde aparece recién en un teléfono. Le pasó al dashboard.
        {' '}
        <strong>Y lo que scrollea tiene que poder recibir el foco.</strong> Un bloque con
        <code>overflow-x-auto</code> y sin <code>tabIndex</code> deja lo que quedó cortado a la
        derecha fuera del alcance del teclado. Va con <code>role=&quot;region&quot;</code> y su
        nombre, porque "región" no dice de qué.
      </Note>

      <A11y
        items={[
          'La estructura se declara con landmarks: una cabecera, un `nav` y un `main`. Quien navega por regiones salta entre esas tres y no entre veinte.',
          'A 390px no hay desborde horizontal en ninguna vista: una página que se corre de costado obliga a leer con dos manos.',
          'El ancho de lectura se acota en caracteres y no en píxeles, así que sigue siendo el mismo cuando alguien agranda la letra del navegador.',
          'El piso táctil todavía es el pendiente: `sm` mide 32 y para el dedo convendrían 44. Está anotado en Accesibilidad.',
        ]}
      />
    </Page>
  )
}
