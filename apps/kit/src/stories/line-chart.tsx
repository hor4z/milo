import { LineChart } from '@milo/ui'
import { A11y, Note, Page, Props, Section } from '../kit'

/** Caída de un cuerpo: 5t² en el vacío, y la misma caída frenada por el aire —velocidad
    límite de 30 m/s—, que siempre queda por debajo de la libre. */
const TAU = 3
const caida = [
  { label: 'Sin rozamiento', points: [0, 1, 2, 3, 4, 5].map(t => ({ x: t, y: 5 * t * t })) },
  { label: 'Con rozamiento', points: [0, 1, 2, 3, 4, 5].map(t => ({ x: t, y: Math.round(30 * (t - TAU * (1 - Math.exp(-t / TAU)))) })) },
]

const semana = [
  { label: '6.º A', points: [{ x: 1, y: 54 }, { x: 2, y: 61 }, { x: 3, y: 58 }, { x: 4, y: 72 }, { x: 5, y: 79 }, { x: 6, y: 83 }] },
  { label: '6.º B', points: [{ x: 1, y: 48 }, { x: 2, y: 47 }, { x: 3, y: 55 }, { x: 4, y: 54 }, { x: 5, y: 63 }, { x: 6, y: 69 }] },
]

const temperatura = [
  { label: 'Aula', points: [{ x: 8, y: 19.5 }, { x: 10, y: 21 }, { x: 12, y: 23.5 }, { x: 14, y: 24 }, { x: 16, y: 22.5 }, { x: 18, y: 20 }] },
]

export function LineChartStory() {
  return (
    <Page
      title="LineChart"
      kind="Datos"
      imports="import { LineChart } from '@milo/ui'"
      lead="Cómo cambia algo a lo largo de otra cosa: una función, una medición en el tiempo, dos grupos comparados. Donde el BarChart compara cantidades sueltas, este muestra el camino entre ellas."
    >
      <Section
        title="Una función"
        note="El caso de matemática y física: el eje de abajo es la variable y el de la izquierda, lo que resulta."
      >
        <div className="rounded-xl border border-line bg-surface p-6">
          <LineChart series={[caida[0]]} title="Caída libre" xLabel="Tiempo (s)" yLabel="Distancia (m)" zeroY />
        </div>
      </Section>

      <Section
        title="Dos trazos, y se distinguen sin color"
        note="Cada uno trae color, patrón de línea y forma de punto. Quien no separa el azul del naranja los separa por el punteado, y eso no es un extra: es la misma regla que gobierna los estados."
      >
        <div className="rounded-xl border border-line bg-surface p-6">
          <LineChart series={caida} title="Caída con y sin rozamiento" xLabel="Tiempo (s)" yLabel="Distancia (m)" zeroY />
        </div>
      </Section>

      <Section
        title="Dónde arranca el eje"
        note="Con datos que se mueven poco, forzar el cero aplasta la variación contra el techo; no forzarlo la agranda. Ninguna de las dos miente, pero dicen cosas distintas: la de la izquierda sirve para «cuánto», la de la derecha para «cuándo cambió»."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface p-6">
            <LineChart series={temperatura} title="Temperatura del aula, desde cero" xLabel="Hora" yLabel="°C" zeroY height={200} />
          </div>
          <div className="rounded-xl border border-line bg-surface p-6">
            <LineChart series={temperatura} title="Temperatura del aula, ajustada" xLabel="Hora" yLabel="°C" height={200} />
          </div>
        </div>
      </Section>

      <Section
        title="Dos grupos"
        note="El uso de todos los días en un panel docente: la misma medida en dos cursos."
      >
        <div className="rounded-xl border border-line bg-surface p-6">
          <LineChart series={semana} title="Entregas por semana" xLabel="Semana" yLabel="Entregas" />
        </div>
      </Section>

      <Note title="Cuatro trazos y no más">
        Con el quinto, la leyenda tarda más en leerse que el gráfico. Si hacen falta más, casi
        siempre lo que hace falta es otro corte de los datos: dos gráficos de dos, o un gráfico y
        una tabla.
      </Note>

      <Props of={['LineChart', 'LineSeries', 'LinePoint']} />

      <A11y
        items={[
          'Abajo va la tabla completa, escondida: es el gráfico dicho en palabras, con todos los valores y los huecos marcados.',
          'Se recorre con el teclado. Es un `slider` que mueve un cursor por el eje de abajo, y en cada paso anuncia la posición y el valor de cada trazo.',
          'Cada trazo se distingue por tres cosas a la vez: color, patrón de línea y forma de punto. El color nunca va solo.',
          'Los colores salen de la familia viva, que es la de las piezas chicas — una línea de dos píxeles lo es. Sobre la superficie llegan al 3:1 que un elemento gráfico necesita.',
        ]}
      />
    </Page>
  )
}
