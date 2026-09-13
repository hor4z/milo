import { Heatmap, type HeatRow } from '@milo/ui'
import { A11y, Note, Page, Props, Section } from '../kit'

const niveles = ['Sin empezar', 'Inicial', 'En camino', 'Logrado']
const temas = ['Fracciones', 'Decimales', 'Porcentaje', 'Proporción', 'Ecuaciones']

const curso: HeatRow[] = [
  { label: 'Ana Pérez', values: [3, 3, 2, 2, 1] },
  { label: 'Bruno Díaz', values: [3, 2, 2, 1, 0] },
  { label: 'Carla Sosa', values: [2, 2, 1, null, null] },
  { label: 'Diego Rey', values: [3, 3, 3, 3, 2] },
  { label: 'Elena Vega', values: [1, 1, 0, 0, null] },
  { label: 'Facundo Gil', values: [2, 1, 1, 1, 0] },
]

const semanas = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']
const unaPersona: HeatRow[] = [
  { label: 'Ana Pérez', values: [0, 1, 1, 2, 2, null, 3, 3] },
]

export function HeatmapStory() {
  return (
    <Page
      title="Heatmap"
      kind="Datos"
      imports="import { Heatmap } from '@milo/ui'"
      lead="Una grilla de niveles: quién contra qué. Sirve para ver de un vistazo dónde está parado un curso entero y decidir a quién hay que darle otra cosa — que es de lo que se trata enseñar distinto a cada uno."
    >
      <Section
        title="Un curso por tema"
        note="Las columnas cortas y las filas con el nombre completo. Lo que se busca acá no es el número exacto de nadie: es la columna que está más clara que las otras, que es el tema que hay que volver a dar, y la fila que se despega, que es quien necesita otra cosa."
      >
        <Heatmap title="Dominio por tema en 4.º A" columns={temas} rows={curso} levels={niveles} />
      </Section>

      <Section
        title="Una persona en el tiempo"
        note="La misma pieza con una fila sola y las columnas como semanas. El hueco no es un cero: es una semana sin entrega, y eso se lee distinto de una entrega que salió mal."
      >
        <Heatmap
          title="Ana Pérez, semana a semana"
          columns={semanas}
          rows={unaPersona}
          levels={niveles}
          empty="Sin entrega"
        />
      </Section>

      <Note icon="lightbulb" title="Por qué el nivel también es una altura">
        El sistema tiene escrito que el color nunca dice algo solo, y una grilla de tonos es
        justamente la pieza que más fácil lo incumple. Acá el nivel sube el relleno y el tono a la
        vez, igual que una barra: en blanco y negro, con cualquier daltonismo o con el brillo bajo,
        la altura sigue diciendo lo mismo. Y en cada celda el nivel está escrito, aunque no se vea.
        El azul es el de dato y no el de marca —el mismo del `LineChart`— porque el de marca está
        anclado para que el blanco encima se lea, y sobre fondo oscuro eso aplanaba la escala.
      </Note>

      <Note title="Es una tabla y no un dibujo">
        Por eso se puede recorrer con un lector de pantalla fila por fila: al llegar a una celda se
        escucha «Ana Pérez, Porcentaje, En camino». Un mapa de calor hecho con `div` pintados no
        dice ninguna de las tres cosas.
      </Note>

      <Section title="Props">
        <Props of={['Heatmap', 'HeatRow']} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Es una `table` con `caption` y con `th` en los dos ejes, así que cada celda se anuncia con su fila y su columna.',
          'El nivel de cada celda está escrito en la celda, no solo pintado: el tono es la lectura rápida y el texto es la que no falla.',
          'El nivel se lee además por la altura del relleno, que sobrevive a la escala de grises y al daltonismo.',
          '«Sin datos» tiene su propia marca y su propio nombre: no es el nivel más bajo, y confundirlos cambia lo que se decide después.',
          'Si la grilla no entra, se desplaza y recién entonces es una parada de tabulación con nombre.',
        ]} />
      </Section>
    </Page>
  )
}
