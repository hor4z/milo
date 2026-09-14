import cls from './chart.module.css'
import { AvatarGroup, BarChart, Card } from '@milo/ui'
import { A11y, Page, Props, Section } from '../kit'

const face = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`

const week = [
  { label: 'Lunes', value: 18, total: 24, caption: 'Actividades corregidas' },
  { label: 'Martes', value: 6, total: 14, caption: 'Actividades corregidas' },
  { label: 'Miércoles', value: 27, total: 29, caption: 'Actividades corregidas' },
  {
    label: 'Jueves', value: 16, total: 32, caption: 'Actividades corregidas',
    detail: (
      <>
        <span className={`${cls.tooltipValue} tabular`}>50%</span>
        <AvatarGroup
          size={18}
          max={3}
          people={[
            { name: 'Ana Pérez', src: face(1) },
            { name: 'Bruno Díaz', src: face(2) },
            { name: 'Carla Sosa', src: face(3) },
          ]}
        />
      </>
    ),
  },
  { label: 'Viernes', value: 17, total: 17, caption: 'Actividades corregidas' },
]

const months = [
  { label: 'Ene', value: 31, total: 42 }, { label: 'Feb', value: 49, total: 58 },
  { label: 'Mar', value: 24, total: 51 }, { label: 'Abr', value: 64, total: 64 },
  { label: 'May', value: 12, total: 47 }, { label: 'Jun', value: 40, total: 73 },
]

export function ChartStory() {
  return (
    <Page
      title="BarChart"
      kind="Datos"
      imports="import { BarChart } from '@milo/ui'"
      lead="Cada barra son dos cosas: el gris es el total y el azul es lo hecho. No son dos series compitiendo, es una parte adentro de su todo, y por eso el azul va dentro del gris: apoyados uno al lado del otro habría que compararlos a ojo, y metido adentro, lo que falta es el gris que sobra arriba."
    >
      <Section
        title="Vivo"
        note="Pasá el mouse por las barras, y después tabulá hasta ellas. El tooltip aparece igual con el teclado: un dato que solo existe al pasar el mouse no existe para quien no usa mouse. Y el blanco del hover es la columna entera, no el rectángulo pintado: apuntarle a una barra baja no obliga a bajar hasta el piso."
      >
        <Card className={cls.liveCard}>
          <div className={cls.cardHead}>
            <div className={cls.cardTitle}>Corregidas esta semana</div>
            <div className={cls.cardNote}>El azul es lo corregido; el gris, lo que entró ese día</div>
          </div>
          <BarChart title="Corregidas sobre entregadas, por día" data={week} highlight={3} />
        </Card>
      </Section>

      <Section
        title="Sin destacada"
        note="Con todas las barras llevando azul, marcar una con color no queda disponible: `highlight` le pone la etiqueta un paso más pesada, que alcanza para decir 'esta es de la que estamos hablando' sin agregar un tercer tono. Acá va sin ninguna: cuando lo que importa es la forma de la serie y no un mes, se deja afuera."
      >
        <Card className={cls.plainCard}>
          <BarChart title="Corregidas sobre entregadas, por mes" data={months} height={160} />
        </Card>
      </Section>

      <Section
        title="Lo que el tooltip puede llevar"
        note="`detail` entra al lado del número: un porcentaje, un grupo de caras, lo que la fila necesite. El número va primero y grande y la frase abajo en gris: es la jerarquía de una leyenda al revés, porque acá el lector ya sabe qué tocó y lo que fue a buscar es cuánto."
      >
        <p className={cls.tooltipText}>
          El filo azul de la izquierda es lo único que ata la caja al gráfico: sin él es una tarjeta
          blanca flotando sobre cualquier cosa. Es el único lugar del sistema donde el color del
          dato entra en una superficie de texto.
        </p>
      </Section>

      <Section title="Props">
        <Props of={['BarChart', 'BarDatum']} />
      </Section>

      <Section
        title="Lo que no hace"
        note="No tiene eje Y ni grilla: con cinco barras y el tooltip, una grilla es tinta que no es dato."
      >
        <p className={cls.limitsText}>
          Tampoco tiene dos series ni dos ejes: dos medidas de escalas distintas son dos gráficos, no
          uno con dos escalas: es la forma más común de mentir con un gráfico sin darse cuenta. Y
          los valores viven también en una tabla <code>sr-only</code>: un lector de pantalla no puede
          hoverear, y una altura no se lee.
        </p>
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Cada barra es un <button> que se enfoca y muestra el mismo tooltip que con el mouse.',
          'Cada barra se anuncia como "Miércoles: 27 de 29".',
          'Los valores viven además en una tabla sr-only: una altura no se lee.',
          'El tono sube con la altura, así que el tamaño y el color dicen lo mismo.',
        ]} />
      </Section>
    </Page>
  )
}
