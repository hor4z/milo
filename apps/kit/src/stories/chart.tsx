import { AvatarGroup, BarChart, Card } from '@melu/ui'
import { Block, Props, Section } from '../kit'

const cara = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`

const semana = [
  { label: 'Lunes', value: 24, caption: 'Actividades entregadas' },
  { label: 'Martes', value: 14, caption: 'Actividades entregadas' },
  { label: 'Miércoles', value: 29, caption: 'Actividades entregadas' },
  {
    label: 'Jueves', value: 32, caption: 'Actividades entregadas',
    detail: (
      <>
        <span className="tabular text-2xs font-medium text-ink-muted">50,25%</span>
        <AvatarGroup
          size={18}
          max={3}
          people={[
            { name: 'Ana Pérez', src: cara(1) },
            { name: 'Bruno Díaz', src: cara(2) },
            { name: 'Carla Sosa', src: cara(3) },
          ]}
        />
      </>
    ),
  },
  { label: 'Viernes', value: 17, caption: 'Actividades entregadas' },
]

const meses = [
  { label: 'Ene', value: 42 }, { label: 'Feb', value: 58 }, { label: 'Mar', value: 51 },
  { label: 'Abr', value: 64 }, { label: 'May', value: 47 }, { label: 'Jun', value: 73 },
]

export function ChartStory() {
  return (
    <Section
      title="BarChart"
      note="Una sola serie y un solo tono: el azul del sistema, más opaco cuanto más alta la barra. Es la receta de un gráfico de magnitud —un hue, más es más oscuro— y la que se lee sin depender de distinguir colores: el tamaño y el tono dicen lo mismo. Por eso tampoco lleva leyenda; con una serie, el título ya dice qué se está mirando."
    >
      <Block
        label="Vivo"
        note="Pasá el mouse por las barras, y después tabulá hasta ellas. El tooltip aparece igual con el teclado: un dato que solo existe al pasar el mouse no existe para quien no usa mouse. Y el blanco del hover es la columna entera, no el rectángulo pintado — apuntarle a una barra baja no obliga a bajar hasta el piso."
      >
        <Card className="max-w-2xl p-6">
          <div className="mb-5">
            <div className="text-base font-semibold text-ink">Entregas de la semana</div>
            <div className="text-xs font-medium text-ink-muted">De todos tus espacios, con el mejor día destacado</div>
          </div>
          <BarChart title="Entregas por día de la semana" data={semana} highlight={3} />
        </Card>
      </Block>

      <Block
        label="Sin destacada"
        note="`highlight` no es decoración: es la barra que la pantalla vino a contar. Cuando no hay una —cuando lo que importa es la forma de la serie y no un día— se deja afuera y todas quedan de contexto."
      >
        <Card className="max-w-2xl p-6">
          <BarChart title="Entregas por mes" data={meses} height={160} />
        </Card>
      </Block>

      <Block
        label="Lo que el tooltip puede llevar"
        note="`detail` entra al lado del número: un porcentaje, un grupo de caras, lo que la fila necesite. El número va primero y grande y la frase abajo en gris — es la jerarquía de una leyenda al revés, porque acá el lector ya sabe qué tocó y lo que fue a buscar es cuánto."
      >
        <p className="max-w-[70ch] text-xs text-ink-muted">
          El filo azul de la izquierda es lo único que ata la caja al gráfico: sin él es una tarjeta
          blanca flotando sobre cualquier cosa. Es el único lugar del sistema donde el color del
          dato entra en una superficie de texto.
        </p>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'data', type: 'BarDatum[]', note: 'obligatorio: label, value, y opcionales detail y caption' },
          { name: 'title', type: 'string', note: 'obligatorio: nombra el gráfico y encabeza la tabla escondida' },
          { name: 'highlight', type: 'number', note: 'el índice de la barra llena' },
          { name: 'height', type: 'number', def: '220', note: 'el alto del área de barras, sin las etiquetas' },
        ]} />
      </Block>

      <Block
        label="Lo que no hace"
        note="No tiene eje Y ni grilla: con cinco barras y el tooltip, una grilla es tinta que no es dato."
      >
        <p className="max-w-[70ch] text-xs text-ink-muted">
          Tampoco tiene dos series ni dos ejes: dos medidas de escalas distintas son dos gráficos, no
          uno con dos escalas — es la forma más común de mentir con un gráfico sin darse cuenta. Y
          los valores viven también en una tabla <code>sr-only</code>: un lector de pantalla no puede
          hoverear, y una altura no se lee.
        </p>
      </Block>
    </Section>
  )
}
