import { BarChart, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@milo/ui'
import { A11y, Note, Page, Section } from '../kit'

const semana = [
  { label: 'Lun', value: 18, total: 24 },
  { label: 'Mar', value: 6, total: 14 },
  { label: 'Mié', value: 27, total: 29 },
  { label: 'Jue', value: 16, total: 32 },
  { label: 'Vie', value: 17, total: 17 },
]

const cual = [
  ['Comparar cantidades sueltas', 'Cuántas entregas por día, cuántos por curso', 'BarChart'],
  ['Una parte de un total, y una sola', 'Cuánto de lo entregado está corregido', 'Progress'],
  ['Valores exactos que alguien va a leer uno por uno', 'Las notas de treinta personas', 'Table'],
]

export function ChartsSection() {
  return (
    <Page
      title="Gráficos"
      kind="Fundamentos"
      lead="Un gráfico sirve para ver una forma: una tendencia, una diferencia, un hueco. Cuando lo que hace falta es un número exacto, el gráfico estorba y lo que va es una tabla."
      imports="import { BarChart } from '@milo/ui'"
    >
      <Section title="Cuál va" note="Elegir mal es el error más caro: un gráfico que no responde la pregunta obliga a mirarlo dos veces y desconfiar la tercera.">
        <Table label="Qué usar según qué se quiere ver" minWidth={520}>
          <TableHeader>
            <TableRow>
              <TableHead>Qué se quiere ver</TableHead>
              <TableHead>Por ejemplo</TableHead>
              <TableHead>Pieza</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cual.map(([q, e, p]) => (
              <TableRow key={q}>
                <TableCell>{q}</TableCell>
                <TableCell>{e}</TableCell>
                <TableCell><code className="font-mono text-meta text-ink">{p}</code></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section
        title="El título dice la conclusión, no la categoría"
        note="«Entregas por día» nombra el eje y no agrega nada: eso ya está escrito abajo de las barras. El título es el lugar donde decir qué hay que mirar."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-6">
            <span className="text-reading font-semibold text-ink">El martes quedó a mitad de camino</span>
            <BarChart title="Corregidas sobre entregadas por día" data={semana} highlight={1} height={150} />
          </div>
          <div className="flex flex-col gap-3 rounded-xl border border-dashed border-line p-6">
            <span className="text-reading font-semibold text-ink-muted">Entregas por día</span>
            <BarChart title="Entregas por día" data={semana} height={150} />
          </div>
        </div>
      </Section>

      <Section
        title="Nunca solo con color"
        note="Lo hecho es un relleno adentro de una pista, así que lo que dice cuánto es el alto y no el tono: las cinco barras son del mismo azul. Pasá el mouse por una o entrá con el teclado y vas a ver que lo que cambia es la trama y el filo, no el color; y la barra de la que habla el título se marca con el peso de su etiqueta. Quien no distingue dos azules lee el alto, y quien no ve el gráfico tiene la tabla."
      >
        <div className="rounded-xl border border-line bg-surface p-6">
          <BarChart title="El miércoles se corrigió casi todo" data={semana} highlight={2} height={180} />
        </div>
      </Section>

      <Section
        title="Todo gráfico se puede leer sin verlo"
        note="Abajo de cada uno va la misma información como tabla, escondida para el ojo y disponible para un lector de pantalla. No es un extra: es la versión completa, y la que no miente por redondeo."
      >
        <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-5 text-body text-ink-muted">
          <span className="text-body font-semibold text-ink">Las tres cosas que trae cada gráfico</span>
          <span>Una tabla escondida con todos los valores y los huecos marcados.</span>
          <span>Un recorrido con el teclado, que en cada paso dice dónde está y cuánto vale.</span>
          <span>Un <code>title</code> que lo nombra para quien lo escucha antes de entrar.</span>
        </div>
      </Section>

      <Note title="El relleno de un dato no es el azul del botón">
        Lo parece, y en el tema claro es el mismo. Pero el azul de marca está anclado en el escalón
        donde el blanco encima llega a 4,5:1 —lo que un botón necesita— y un relleno de dato no
        lleva texto encima: lo que necesita es despegarse de su pista, que son los 3:1 de la WCAG
        para un elemento gráfico. En oscuro los dos requisitos dejan de coincidir: ahí el azul de
        marca contra la pista daba 2,34:1 y el rojo 2,45, así que la misma barra se leía clara en
        un tema y pareja en el otro. Por eso los rellenos salen de `--chart-*`, que en claro
        coincide con los tonos de estado y en oscuro sube el azul y el rojo. Hay ocho tests.
      </Note>

      <Note title="Dónde arranca el eje cambia lo que se lee">
        Forzar el cero sirve para «cuánto»; ajustarlo al dato sirve para «cuándo cambió». Ninguna de
        las dos miente, pero dicen cosas distintas, así que la decisión es del que arma la pantalla
        y no un default que se arrastra. Hoy el único gráfico del sistema es de barras y arranca en
        cero siempre, que es lo que una barra necesita para no mentir con su largo.
      </Note>

      <Note title="Un número por frase">
        Un gráfico ya es mucha información junta. El texto que lo acompaña no repite las cifras que
        están adentro: dice qué hacer con ellas, o cuál mirar. Está escrito en Cómo se escribe.
      </Note>

      <A11y
        items={[
          'La tabla escondida es la versión completa del gráfico, no un resumen.',
          'Se recorren con el teclado, y en cada paso se anuncia la posición y el valor.',
          'El color nunca es la única diferencia: el alto dice cuánto, la trama marca la barra que se está mirando y el peso de la etiqueta dice de cuál habla la pantalla.',
          'El relleno de una barra llega al 3:1 que un elemento gráfico necesita contra su pista, en los dos temas.',
        ]}
      />
    </Page>
  )
}
