import cls from './writing.module.css'
import { Icon } from '@milo/ui'
import { Page, Section } from '../kit'

const pairs: { bad: string; good: string; by: string }[] = [
  {
    bad: 'Error: la operación no pudo ser completada.',
    good: 'No se pudieron traer las entregas.',
    by: 'Decí qué pasó, no que hubo un error. La palabra "error" no agrega información y asusta.',
  },
  {
    bad: '¿Está seguro de que desea eliminar este elemento?',
    good: '¿Borrar "Fracciones equivalentes"?',
    by: 'Nombrá lo que se va a borrar. "Este elemento" obliga a recordar qué estabas tocando.',
  },
  {
    bad: 'No hay datos disponibles.',
    good: 'Todavía no llegó ninguna entrega.',
    by: 'Un vacío es una etapa, no una falla. Decí qué falta para que deje de estar vacío.',
  },
  {
    bad: 'Se ha guardado exitosamente.',
    good: 'Guardado.',
    by: 'Lo que salió bien no necesita explicación. Una palabra alcanza.',
  },
  {
    bad: 'Campo requerido',
    good: 'Poné un nombre para la actividad',
    by: 'Un error de campo dice qué hacer, no qué categoría de error es.',
  },
]

export function Writing() {
  return (
    <Page
      title="Cómo se escribe"
      lead="La interfaz habla en segunda persona, en presente y en argentino. El texto es parte del diseño: una pantalla bien dibujada con un cartel que dice 'ha ocurrido un error inesperado' está mal terminada."
    >
      <Section
        title="Las reglas"
        note="Nueve, y se revisan leyendo en voz alta."
      >
        <div className={cls.div}>
          {[
            ['Vos, no usted', 'Escribí, elegí, mirá. Es como habla la gente con la que trabajamos.'],
            ['Presente', '"Se publicó" y no "ha sido publicado".'],
            ['Frases cortas', 'Si una oración tiene dos comas y un "mediante", va cortada en dos.'],
            ['Sin jerga de sistema', 'Nada de "token", "endpoint", "query" ni "elemento" en una pantalla de producto.'],
            ['Mayúscula solo al principio', 'Los títulos van como una oración: "Entregas de la semana", no "Entregas De La Semana".'],
            ['Números como números', '3 y no "tres", salvo al empezar una oración.'],
            ['Un número por frase', 'Una línea con tres cifras se cuenta, no se lee. "Cuatro espacios, 79 entregas y 12 sin mirar" obliga a hacer tres lecturas para entender una idea, y quien lee puede ser un docente de Lengua, no alguien que vive entre planillas. Si los números están en las tarjetas de abajo, la frase no los repite: dice qué hacer con ellos.'],
            ['Decí qué pasa, no cuánto hay', 'Un contador informa; una frase orienta. "Tres entregas vencen mañana" se entiende de una, "3 · 12 · 79" hay que interpretarlo.'],
            ['Sin raya ni comillas angulares', 'Ni la raya larga ni las comillas angulares. Nadie las tiene a mano en un teclado, así que no aparecen en lo que escribe una persona: cuando aparecen, quien lee siente que el texto lo escribió una máquina y deja de creerle. En su lugar van los dos puntos, la coma, el paréntesis y las comillas dobles, que dicen lo mismo y no llaman la atención.'],
          ].map(([t, d]) => (
            <div key={t} className={`${cls.div2} bg-surface`}>
              <span className={cls.span}>{t}</span>
              <span className={cls.span2}>{d}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Antes y después"
        note="Los mismos mensajes escritos de las dos maneras. La diferencia nunca es de tono: es de información."
      >
        <div className={cls.div3}>
          {pairs.map(p => (
            <div key={p.good} className={cls.div4}>
              <div className={cls.div5}>
                <Icon name="close" size={16} className={cls.icon} />
                <span className={cls.span3}>{p.bad}</span>
              </div>
              <div className={cls.div6}>
                <Icon name="check" size={16} className={cls.icon2} />
                <div className={cls.div7}>
                  <span className={cls.span4}>{p.good}</span>
                  <span className={cls.span5}>{p.by}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  )
}
